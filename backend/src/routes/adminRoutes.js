const express = require("express");
const Contact = require("../models/Contact");
const User = require("../models/User");
const Quote = require("../models/Quote");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/contacts", async (_req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return res.json({ contacts });
});

router.delete("/contacts/:id", async (req, res) => {
  const deleted = await Contact.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Submission not found" });
  }
  return res.json({ message: "Submission deleted" });
});

router.get("/users", async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json({ users });
});

router.get("/quotes", async (_req, res) => {
  const quotes = await Quote.find().sort({ createdAt: -1 });
  return res.json({ quotes });
});

module.exports = router;
