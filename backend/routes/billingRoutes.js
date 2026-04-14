console.log("🔥 BILLING ROUTE LOADED");
const express = require("express");
const router = express.Router();

const {
  getAllBills,
  createBill,
  updatePaymentStatus,
  getMyBills,
  getDoctorBills
} = require("../controllers/billingController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Admin routes
router.get("/", protect, authorizeRoles("admin", "doctor"), getAllBills);
router.post("/", (req, res, next) => {
  console.log("🔥 BILLING API CALLED");
  next();
}, protect, authorizeRoles("admin", "doctor"), createBill);
router.put("/:id/status", protect, authorizeRoles("admin", "doctor", "patient"), updatePaymentStatus);
router.get("/doctor", protect, authorizeRoles("doctor"), getDoctorBills);

// Patient route
router.get("/my", protect, authorizeRoles("patient"), getMyBills);

module.exports = router;