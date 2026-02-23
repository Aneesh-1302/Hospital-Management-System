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

    // 1️⃣ Check appointment exists
    const [appointment] = await db.execute(
      "SELECT appointment_id FROM Appointments WHERE appointment_id = ?",
      [appointment_id]
    );

    if (appointment.length === 0) {
      return res.status(400).json({ message: "Appointment not found" });
    }

    // 2️⃣ Prevent duplicate bill
    const [existing] = await db.execute(
      "SELECT bill_id FROM Billing WHERE appointment_id = ?",
      [appointment_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Bill already exists for this appointment"
      });
    }

    // 3️⃣ Insert bill (total auto-calculated by DB)
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

module.exports = {
  getAllBills,
  createBill,
  updatePaymentStatus
};