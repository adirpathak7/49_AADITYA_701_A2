const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empid: String,
  name: String,
  email: String,
  salary: Number,
  password: String,
});

module.exports = mongoose.model("Employee", employeeSchema);
