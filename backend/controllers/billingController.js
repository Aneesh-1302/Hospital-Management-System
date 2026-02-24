const db = require("../config/db");

// GET ALL BILLS
const getAllBills = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.*, p.name AS patient_name
      FROM Billing b
      JOIN Patients p ON b.patient_id = p.patient_id
    `);

    res.json({
      message: "Bills fetched successfully",
      data: rows
    });

  } catch (error) {
    console.error("Get Bills Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE BILL
const createBill = async (req, res) => {
  try {
    const {
      patient_id,
      appointment_id,
      consultation_charges,
      lab_charges,
      medicine_charges
    } = req.body;

    // 1️⃣ Check appointment exists & get status
    const [appointment] = await db.execute(
      `SELECT status, patient_id 
       FROM Appointments 
       WHERE appointment_id = ?`,
      [appointment_id]
    );

    if (appointment.length === 0) {
      return res.status(400).json({
        message: "Appointment not found"
      });
    }

    // 2️⃣ Check appointment is Completed
    if (appointment[0].status !== "Completed") {
      return res.status(400).json({
        message: "Bill can only be generated for completed appointments"
      });
    }

    // 3️⃣ Validate patient matches appointment
    if (appointment[0].patient_id !== patient_id) {
      return res.status(400).json({
        message: "Patient does not match appointment"
      });
    }

    // 4️⃣ Prevent duplicate bill
    const [existing] = await db.execute(
      "SELECT bill_id FROM Billing WHERE appointment_id = ?",
      [appointment_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Bill already exists for this appointment"
      });
    }

    // 5️⃣ Insert bill (total auto-calculated by DB)
    const [result] = await db.execute(
      `INSERT INTO Billing 
       (patient_id, appointment_id, consultation_charges, lab_charges, medicine_charges)
       VALUES (?, ?, ?, ?, ?)`,
      [
        patient_id,
        appointment_id,
        consultation_charges || 0,
        lab_charges || 0,
        medicine_charges || 0
      ]
    );

    res.status(201).json({
      message: "Bill created successfully",
      bill_id: result.insertId
    });

  } catch (error) {

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Bill already exists for this appointment"
      });
    }

    console.error("Create Bill Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PAYMENT STATUS
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    await db.execute(
      `UPDATE Billing 
       SET payment_status = ? 
       WHERE bill_id = ?`,
      [payment_status, id]
    );

    res.json({
      message: "Payment status updated successfully"
    });

  } catch (error) {
    console.error("Update Payment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY BILLS (Patient only)
const getMyBills = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get patient_id from user_id
    const [patient] = await db.execute(
      "SELECT patient_id FROM Patients WHERE user_id = ?",
      [userId]
    );

    if (patient.length === 0) {
      return res.status(404).json({
        message: "Patient profile not found"
      });
    }

    const patientId = patient[0].patient_id;

    // 2️⃣ Get bills for this patient
    const [bills] = await db.execute(
      `SELECT b.*, a.appointment_date, a.appointment_time
       FROM Billing b
       LEFT JOIN Appointments a ON b.appointment_id = a.appointment_id
       WHERE b.patient_id = ?
       ORDER BY b.issued_date DESC`,
      [patientId]
    );

    res.json({
      message: "Your bills fetched successfully",
      data: bills
    });

  } catch (error) {
    console.error("Get My Bills Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllBills,
  createBill,
  updatePaymentStatus,
  getMyBills
};