const express = require('express');
const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const router = express.Router();

// Middleware: check login
function isAuthenticated(req, res, next) {
    if (!req.session.adminId) return res.redirect('/login');
    next();
}

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Generate employee ID
function generateEmpId() {
    return 'EMP' + Math.floor(1000 + Math.random() * 9000);
}

// GET all employees
router.get('/', isAuthenticated, async (req, res) => {
    const employees = await Employee.find();
    res.render('employees/list', { employees });
});

// GET add employee form
router.get('/add', isAuthenticated, (req, res) => {
    res.render('employees/add');
});

// POST add employee
router.post('/add', isAuthenticated, async (req, res) => {
    const { name, email, position, baseSalary, bonus } = req.body;

    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    const empId = generateEmpId();
    const totalSalary = parseFloat(baseSalary) + parseFloat(bonus);

    const newEmp = new Employee({
        empId,
        name,
        email,
        position,
        baseSalary,
        bonus,
        totalSalary,
        password: hashedPassword
    });

    await newEmp.save();

    // Send email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to ERP System',
        text: `Hi ${name},\n\nYour Employee ID: ${empId}\nPassword: ${password}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("❌ Error sending email:", err);
        } else {
            console.log("✅ Email sent:", info.response);
        }
    });

    res.redirect('/employees');
});

// GET edit employee
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const emp = await Employee.findById(req.params.id);
    res.render('employees/edit', { emp });
});

// POST update employee
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    const { name, email, position, baseSalary, bonus } = req.body;
    const totalSalary = parseFloat(baseSalary) + parseFloat(bonus);

    await Employee.findByIdAndUpdate(req.params.id, {
        name, email, position, baseSalary, bonus, totalSalary
    });

    res.redirect('/employees');
});

// GET delete employee
router.get('/delete/:id', isAuthenticated, async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
});

module.exports = router;
