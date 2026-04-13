const express = require("express");
const router = express.Router();

const {
  getAllBills,
  createBill,
  updatePaymentStatus,
  getMyBills
} = require("../controllers/billingController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Admin routes
router.get("/", protect, authorizeRoles("admin"), getAllBills);
router.post("/", protect, authorizeRoles("admin", "doctor"), createBill);
router.put("/:id/status", protect, authorizeRoles("admin", "doctor"), updatePaymentStatus);

// Patient route
router.get("/my", protect, authorizeRoles("patient"), getMyBills);

module.exports = router;