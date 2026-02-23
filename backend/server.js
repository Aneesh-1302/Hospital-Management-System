require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patients", patientRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctors", doctorRoutes);

const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api/appointments", appointmentRoutes);

const billingRoutes = require("./routes/billingRoutes");
app.use("/api/billing", billingRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running ");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});