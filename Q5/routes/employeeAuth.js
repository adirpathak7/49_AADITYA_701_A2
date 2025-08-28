const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');

router.post('/login', async (req, res) => {
    const { empid, password } = req.body;
    const user = await Employee.findOne({ empid });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("password " + password);
        console.log("user.password " + user.password);

        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });

    res.json({ token });
});

module.exports = router;
