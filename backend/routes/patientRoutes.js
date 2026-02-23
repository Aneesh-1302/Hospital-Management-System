const express = require("express");
const router = express.Router();

const {
  getAllPatients,
  createPatient,
  updatePatient,
  deletePatient
} = require("../controllers/patientController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Only logged-in users can view
router.get("/", protect, getAllPatients);

// Only Admin can create patient (example)
router.post("/", protect, authorizeRoles("Admin"), createPatient);

// Only Admin can update
router.put("/:id", protect, authorizeRoles("Admin"), updatePatient);

// Only Admin can delete
router.delete("/:id", protect, authorizeRoles("Admin"), deletePatient);

module.exports = router;