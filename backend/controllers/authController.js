const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const [existing] = await db.execute(
      "SELECT user_id FROM Users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Users table
    const [result] = await db.execute(
      "INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );

     if (role === "Patient") {
      await db.execute(
        `INSERT INTO Patients (user_id, name)
         VALUES (?, ?)`,
        [result.insertId, email] // temporary name
      );
    }

    if (role === "Doctor") {
      await db.execute(
        `INSERT INTO Doctors (user_id, name, specialization)
         VALUES (?, ?, ?)`,
        [result.insertId, email, "General"]
      );
    }

    res.status(201).json({
      message: "User registered successfully",
      user_id: result.insertId
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  registerUser,
  loginUser
};