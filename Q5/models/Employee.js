const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empid: String,
    name: String,
    email: String,
    password: String,
    salary: Number,
});

module.exports = mongoose.model('Employee', employeeSchema);
