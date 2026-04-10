const express = require("express");

const {
  addPatientViaProcedure,
  bookAppointmentViaProcedure,
  generateBillViaProcedure
} = require("../controllers/procedureController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/patients", protect, authorizeRoles("Admin"), addPatientViaProcedure);
router.post("/appointments", protect, authorizeRoles("Admin", "Patient"), bookAppointmentViaProcedure);
router.post("/billing", protect, authorizeRoles("Admin"), generateBillViaProcedure);

module.exports = router;
