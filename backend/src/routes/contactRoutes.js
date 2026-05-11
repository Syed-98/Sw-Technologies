const express = require("express");
const Contact = require("../models/Contact");
const { hasRequiredFields, isValidEmail } = require("../utils/validators");

const router = express.Router();

router.post("/", async (req, res) => {
  const required = ["name", "email", "phone", "subject", "message"];
  if (!hasRequiredFields(req.body, required)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  await Contact.create(req.body);
  return res.status(201).json({ message: "Message submitted successfully" });
});

module.exports = router;
