const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

// router.post('/register', async (req, res) => {
//     try{
//         const emp = new Employee(req.body);
//         await emp.save();
//         res.json({ message: 'Employee registered successfully' });
//     }catch(err){
//         res.status(400).json({ error: err.message });
//     }
// });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const payload = { 
        id: employee._id, 
        email: employee.email, 
        empId: employee.empId, 
        name: employee.name 
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, profile: payload });
});

module.exports = router;