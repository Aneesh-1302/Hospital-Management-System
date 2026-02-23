const express = require("express");
const router = express.Router();

const {
  getAllBills,
  createBill,
  updatePaymentStatus
} = require("../controllers/billingController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// View bills (Admin only)
router.get("/", protect, authorizeRoles("Admin"), getAllBills);

// Create bill (Admin only)
router.post("/", protect, authorizeRoles("Admin"), createBill);

// Update payment status (Admin only)
router.put("/:id/status", protect, authorizeRoles("Admin"), updatePaymentStatus);

module.exports = router;