const db = require("../config/db");

// CREATE APPOINTMENT
const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    // 1️⃣ Check patient exists
    const [patient] = await db.execute(
      "SELECT patient_id FROM Patients WHERE patient_id = ?",
      [patient_id]
    );
    if (patient.length === 0)
      return res.status(400).json({ message: "Patient not found" });

    // 2️⃣ Check doctor exists
    const [doctor] = await db.execute(
      "SELECT doctor_id FROM Doctors WHERE doctor_id = ?",
      [doctor_id]
    );
    if (doctor.length === 0)
      return res.status(400).json({ message: "Doctor not found" });

    // 3️⃣ Prevent double booking
    const [existing] = await db.execute(
      `SELECT appointment_id FROM Appointments
       WHERE doctor_id = ?
       AND appointment_date = ?
       AND appointment_time = ?
       AND status != 'Cancelled'`,
      [doctor_id, appointment_date, appointment_time]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Time slot already booked" });

    // 4️⃣ Insert appointment
    const [result] = await db.execute(
      `INSERT INTO Appointments
       (patient_id, doctor_id, appointment_date, appointment_time)
       VALUES (?, ?, ?, ?)`,
      [patient_id, doctor_id, appointment_date, appointment_time]
    );

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment_id: result.insertId,
    });
  } catch (error) {
    console.error("Appointment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL APPOINTMENTS (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.*,
             p.name AS patient_name,
             d.name AS doctor_name
      FROM Appointments a
      JOIN Patients p ON a.patient_id = p.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);
    res.json({ message: "Appointments fetched successfully", data: rows });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY APPOINTMENTS (Patient)
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get patient_id from user_id
    const [patientRows] = await db.execute(
      "SELECT patient_id FROM Patients WHERE user_id = ?",
      [userId]
    );
    if (patientRows.length === 0)
      return res.status(404).json({ message: "Patient profile not found" });

    const patientId = patientRows[0].patient_id;

    const [rows] = await db.execute(
      `SELECT a.*, d.name AS doctor_name, d.specialization
       FROM Appointments a
       JOIN Doctors d ON a.doctor_id = d.doctor_id
       WHERE a.patient_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [patientId]
    );

    res.json({ message: "Your appointments fetched successfully", data: rows });
  } catch (error) {
    console.error("Get My Appointments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET DOCTOR APPOINTMENTS (Doctor - filters by their own doctor_id)
const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get doctor_id from user_id
    const [doctorRows] = await db.execute(
      "SELECT doctor_id FROM Doctors WHERE user_id = ?",
      [userId]
    );
    if (doctorRows.length === 0)
      return res.status(404).json({ message: "Doctor profile not found" });

    const doctorId = doctorRows[0].doctor_id;

    const [rows] = await db.execute(
      `SELECT a.*, p.name AS patient_name, p.age, p.gender
       FROM Appointments a
       JOIN Patients p ON a.patient_id = p.patient_id
       WHERE a.doctor_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [doctorId]
    );

    res.json({ message: "Doctor appointments fetched successfully", data: rows });
  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE APPOINTMENT STATUS (Doctor confirms/cancels, Patient cancels)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Pending", "Confirmed", "Cancelled", "Completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    await db.execute(
      "UPDATE Appointments SET status = ? WHERE appointment_id = ?",
      [status, id]
    );

    res.json({ message: "Appointment status updated successfully" });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};
