const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/authMiddleware");
const { hasRequiredFields, isValidEmail } = require("../utils/validators");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!hasRequiredFields(req.body, ["name", "email", "password"])) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return res.status(201).json({
    message: "Registration successful",
    user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!hasRequiredFields(req.body, ["email", "password"])) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  });
});

router.get("/profile", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
