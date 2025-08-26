const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');

router.get('/profile', auth, async (req, res) => {
  const emp = await Employee.findById(req.employee.id).select('-password');
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  res.json(emp);
});

module.exports = router;