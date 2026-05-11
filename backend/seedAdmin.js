const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

dotenv.config();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@swtech.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_NAME || "SW Admin";

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Admin already exists");
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Admin created: ${email}`);
  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
