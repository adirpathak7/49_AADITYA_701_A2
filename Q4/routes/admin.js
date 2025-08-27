const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const router = express.Router();

// GET login
router.get('/login', (req, res) => {
    res.render('login');
});

// POST login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (admin && await bcrypt.compare(password, admin.password)) {
        req.session.adminId = admin._id;
        return res.redirect('/dashboard');
    }

    res.send('Invalid credentials!')
});

// GET dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.adminId) return res.redirect('/login');
    res.render('dashboard');
});

// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
