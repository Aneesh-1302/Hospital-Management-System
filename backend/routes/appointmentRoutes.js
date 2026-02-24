const express = require("express");
const router = express.Router();

const { createAppointment, getAllAppointments } = require("../controllers/appointmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// View appointments (Admin only for now)
router.get("/", protect, authorizeRoles("Admin"), getAllAppointments);

// Book appointment
router.post("/", protect, createAppointment);

module.exports = router;