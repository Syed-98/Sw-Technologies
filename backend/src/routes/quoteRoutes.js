const express = require("express");
const Quote = require("../models/Quote");
const { hasRequiredFields, isValidEmail } = require("../utils/validators");

const router = express.Router();

router.post("/", async (req, res) => {
  const required = ["name", "email", "phone", "serviceRequired", "budget", "message"];
  if (!hasRequiredFields(req.body, required)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  await Quote.create(req.body);
  return res.status(201).json({ message: "Quote request submitted successfully" });
});

module.exports = router;
