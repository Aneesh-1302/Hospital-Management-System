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

    if (patient.length === 0) {
      return res.status(400).json({ message: "Patient not found" });
    }

    // 2️⃣ Check doctor exists
    const [doctor] = await db.execute(
      "SELECT doctor_id FROM Doctors WHERE doctor_id = ?",
      [doctor_id]
    );

    if (doctor.length === 0) {
      return res.status(400).json({ message: "Doctor not found" });
    }

    // 3️⃣ Get day of week
    const dateObj = new Date(appointment_date);
    const dayOfWeek = dateObj.toLocaleString("en-US", { weekday: "long" });

    // 4️⃣ Check doctor schedule
    const [schedule] = await db.execute(
      `SELECT * FROM Doctor_Schedules 
       WHERE doctor_id = ? 
       AND day_of_week = ?
       AND is_available = 1`,
      [doctor_id, dayOfWeek]
    );

    if (schedule.length === 0) {
      return res.status(400).json({
        message: "Doctor not available on this day"
      });
    }

    const { start_time, end_time } = schedule[0];

    // 5️⃣ Validate time within schedule
    if (appointment_time < start_time || appointment_time > end_time) {
      return res.status(400).json({
        message: "Appointment time outside doctor's working hours"
      });
    }

    // 6️⃣ Prevent double booking
    const [existing] = await db.execute(
      `SELECT appointment_id FROM Appointments
       WHERE doctor_id = ?
       AND appointment_date = ?
       AND appointment_time = ?
       AND status != 'Cancelled'`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Time slot already booked"
      });
    }

    // 7️⃣ Insert appointment
    const [result] = await db.execute(
      `INSERT INTO Appointments 
       (patient_id, doctor_id, appointment_date, appointment_time)
       VALUES (?, ?, ?, ?)`,
      [patient_id, doctor_id, appointment_date, appointment_time]
    );

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment_id: result.insertId
    });

  } catch (error) {
    console.error("Appointment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment
};