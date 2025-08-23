const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");
require('dotenv').config();

const Employee = require("./models/Employee");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: "admin-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 },
}));

mongoose.connect("mongodb://localhost:27017/erp_admin");

function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) next();
  else res.redirect("/login");
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
     user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => res.render("login", { error: null }));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    req.session.isLoggedIn = true;
    res.redirect("/dashboard");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.get("/dashboard", isAuthenticated, async (req, res) => {
  const employees = await Employee.find();
  res.render("dashboard", { employees });
});

app.get("/employee/add", isAuthenticated, (req, res) => {
  res.render("addEmployee");
});

app.post("/employee/add", isAuthenticated, async (req, res) => {
  const { name, email, salary, daysWorked } = req.body;
  const empid = `EMP${Date.now()}`;
  const plainPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const netSalary = (parseFloat(salary) * parseInt(daysWorked)) / 30;

  const employee = new Employee({
    empid,
    name,
    email,
    salary: netSalary,
    password: hashedPassword,
  });

  await employee.save();

  await transporter.sendMail({
    from: "bdcs1191@gmail.com",
    to: email,
    subject: "Welcome to ERP",
    text: `Your login credentials:\nEmpID: ${empid}\nPassword: ${plainPassword}`,
  });

  res.redirect("/dashboard");
});

app.get("/employee/delete/:id", isAuthenticated, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});


app.get("/employee/edit/:id", isAuthenticated, async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  // Reverse-calculating original salary (before net calculation)
  const originalSalary = (employee.salary * 30) / (employee.daysWorked || 30);

  res.render("editemployee", {
    employee: {
      ...employee.toObject(),
      originalSalary,
      daysWorked: employee.daysWorked || 30, // default to 30 if missing
    }
  });
});

app.post("/employee/edit/:id", isAuthenticated, async (req, res) => {
  const { name, salary, daysWorked } = req.body;

  const netSalary = (parseFloat(salary) * parseInt(daysWorked)) / 30;

  await Employee.findByIdAndUpdate(req.params.id, {
    name,
    salary: netSalary,
    daysWorked: parseInt(daysWorked),
    
  });

  res.redirect("/dashboard");
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
