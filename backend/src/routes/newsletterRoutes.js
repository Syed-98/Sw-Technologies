const express = require("express");
const Newsletter = require("../models/Newsletter");
const { hasRequiredFields, isValidEmail } = require("../utils/validators");

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  if (!hasRequiredFields(req.body, ["email"])) {
    return res.status(400).json({ message: "Email is required" });
  }

  const email = String(req.body.email).trim().toLowerCase();
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "You are already subscribed" });
  }

  await Newsletter.create({ email });
  return res.status(201).json({ message: "Subscribed successfully" });
});

module.exports = router;
