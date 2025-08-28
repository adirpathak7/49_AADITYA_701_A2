const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyToken');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

// Get profile
router.get('/profile', verifyJWT, async (req, res) => {
    try {
        const emp = await Employee.findById(req.user.id);
        if (!emp) return res.status(404).json({ message: "Employee not found" });
        res.json(emp);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Apply for leave
router.post('/leave', verifyJWT, async (req, res) => {
    const { date, reason } = req.body;
    const leave = new Leave({
        employee: req.user.id,
        date,
        reason,
    });
    await leave.save();
    res.json({ message: 'Leave request submitted.' });
});

// List leaves
router.get('/leaves', verifyJWT, async (req, res) => {
    const leaves = await Leave.find({ employee: req.user.id });
    res.json(leaves);
});

module.exports = router;
