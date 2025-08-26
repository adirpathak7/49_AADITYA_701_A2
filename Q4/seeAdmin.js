const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const admin = new Admin({ username: "admin", password: "admin123" });
  await admin.save();
  console.log("Admin created: username=admin, password=admin123");
  mongoose.disconnect();
});
