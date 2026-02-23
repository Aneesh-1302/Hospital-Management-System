const db = require("../config/db");

// GET all patients
const getAllPatients = async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM Patients");
  res.json(rows);
};

// POST create patient
const createPatient = (req, res) => {
    const { name, age, gender, contact } = req.body;

    if (!name || !age || !gender || !contact) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newPatient = {
        id: patients.length + 1,
        name,
        age,
        gender,
        contact
    };

    patients.push(newPatient);

    res.status(201).json({
        message: "Patient created successfully",
        data: newPatient
    });
};

// PUT update patient
const updatePatient = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, gender, contact } = req.body;

    const patient = patients.find(p => p.id === id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    // Update fields if provided
    if (name) patient.name = name;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;

    res.json({
        message: "Patient updated successfully",
        data: patient
    });
};

// DELETE patient
const deletePatient = (req, res) => {
    const id = parseInt(req.params.id);

    const index = patients.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    const deletedPatient = patients.splice(index, 1);

    res.json({
        message: "Patient deleted successfully",
        data: deletedPatient
    });
};

module.exports = {
    getAllPatients,
    createPatient,
    updatePatient,
    deletePatient
};