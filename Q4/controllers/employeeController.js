const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});

exports.listEmployees = async (req,res) => {
    const employees = await Employee.find();
    res.render("employees/list", { employees });
};

exports.getCreate = (req, res) => {
    res.render("employees/create");
};

exports.postCreate = async (req, res) => {
    const { name, email, basicSalary, hra, da} = req.body;
    const empId = "EMP" + Date.now();
    const plainPassword = Math.random().toString(36).slice(-8);
    const grossSalary = Number(basicSalary) + Number(hra) + Number(da);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newEmp = await Employee.create({
        empId,
        name,
        email,
        basicSalary,
        hra,
        da,
        grossSalary,
        password: hashedPassword
    });

    await transporter.sendMail({
        from : process.env.EMAIL,
        to : email,
        subject : "Your Employee Account Details",
        text : `Hello ${name},\nYour employee account has been created successfully.\nYour Employee ID: ${empId}\nPassword: ${plainPassword}\n\nPlease change your password after logging in.\n\nThank you!`
    });

    res.redirect("/employees");
};

exports.getEdit = async (req,res) =>{
    const emp = await Employee.findById(req.params.id);
    res.render("employees/edit", { emp });
};

exports.postEdit = async (req, res) => {
    const {name, email, basicSalary, hra, da} = req.body;
    const grossSalary = Number(basicSalary) + Number(hra) + Number(da);
    await Employee.findByIdAndUpdate(req.params.id, {
        name,
        email,
        basicSalary,
        hra,
        da,
        grossSalary
    });
    res.redirect("/employees");
};

exports.deleteEmployee = async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect("/employees");
};