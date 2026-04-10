const db = require("../config/db");

const addPatientViaProcedure = async (req, res) => {
  try {
    const { name, email, age, gender, contact } = req.body;

    if (!name || !email || age === undefined || !gender || !contact) {
      return res.status(400).json({ message: "name, email, age, gender, and contact are required" });
    }

    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge)) {
      return res.status(400).json({ message: "age must be an integer" });
    }

    const [resultSets] = await db.query(
      "CALL add_patient(?, ?, ?, ?, ?)",
      [name, email, parsedAge, gender, contact]
    );

    const procedureResult = resultSets?.[0]?.[0] || {};

    return res.status(201).json({
      message: "Patient created successfully",
      user_id: procedureResult.user_id,
      patient_id: procedureResult.patient_id,
      temporary_password: procedureResult.temporary_password
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Patient email already exists" });
    }

    if (error.sqlState === "45000") {
      return res.status(400).json({ message: error.sqlMessage || error.message });
    }

    console.error("addPatientViaProcedure Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const bookAppointmentViaProcedure = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date } = req.body;

    if (!patient_id || !doctor_id || !appointment_date) {
      return res.status(400).json({ message: "patient_id, doctor_id, and appointment_date are required" });
    }

    const [resultSets] = await db.query(
      "CALL book_appointment(?, ?, ?)",
      [Number(patient_id), Number(doctor_id), appointment_date]
    );

    const appointmentId = resultSets?.[0]?.[0]?.appointment_id;

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment_id: appointmentId
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid patient_id or doctor_id" });
    }

    console.error("bookAppointmentViaProcedure Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const generateBillViaProcedure = async (req, res) => {
  try {
    const { patient_id, amount } = req.body;

    if (!patient_id || amount === undefined) {
      return res.status(400).json({ message: "patient_id and amount are required" });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ message: "amount must be a valid non-negative number" });
    }

    const [resultSets] = await db.query(
      "CALL generate_bill(?, ?)",
      [Number(patient_id), parsedAmount]
    );

    const billId = resultSets?.[0]?.[0]?.bill_id;

    return res.status(201).json({
      message: "Bill generated successfully",
      bill_id: billId
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid patient_id" });
    }

    console.error("generateBillViaProcedure Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addPatientViaProcedure,
  bookAppointmentViaProcedure,
  generateBillViaProcedure
};
