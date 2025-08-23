const express = require('express');
const router = express.Router();
const Leave = require('../models/leave');
const verifyToken = require('../middleware/verifyToken');

router.get('/leave', verifyToken, (req, res) => {
  res.render('leave');
});

router.post('/leave', verifyToken, async (req, res) => {
  const { date, reason } = req.body;
  await Leave.create({ employeeId: req.userId, date, reason });
  res.redirect('/leaves');
});

router.get('/leaves', verifyToken, async (req, res) => {
  const leaves = await Leave.find({ employeeId: req.userId });
  res.render('leaves', { leaves });
});

module.exports = router;
