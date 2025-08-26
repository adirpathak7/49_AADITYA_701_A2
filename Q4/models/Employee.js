const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empId : String,
    name : String,
    email : String,
    basicSalary : Number,
    hra : Number,
    da : Number,
    grossSalary : Number,
    password : String
});

module.exports = mongoose.model("Employee", employeeSchema);