const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empId: String,
    name: String,
    email: String,
    position: String,
    baseSalary: Number,
    bonus: Number,
    totalSalary: Number,
    password: String
});

module.exports = mongoose.model('Employee', employeeSchema);
