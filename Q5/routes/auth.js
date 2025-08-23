const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');


router.get('/', (req, res) => {
  res.send('<h1>Welcome to Employee Site</h1><a href="/login">Login</a>');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const emp = await Employee.findOne({ email });
  if (!emp) return res.send('User not found');

  const match = await bcrypt.compare(password, emp.password);
  if (!match) return res.send('Wrong password');

  const token = jwt.sign({ id: emp._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token);
  res.redirect('/profile');
});

router.get('/profile', require('../middleware/verifyToken'), async (req, res) => {
  const emp = await Employee.findById(req.userId);
  res.render('profile', { employee: emp });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
