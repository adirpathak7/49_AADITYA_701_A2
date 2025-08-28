const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// List all categories
router.get('/', async (req, res) => {
    const categories = await Category.find().populate('parent');
    res.render('categories/list', { categories });
});

// Show add form
router.get('/add', async (req, res) => {
    try {
        const categories = await Category.find({}).lean();
        res.render('categories/add', { categories });  // pass categories here
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Add category
router.post('/add', async (req, res) => {
    const { name, parent } = req.body;
    await Category.create({ name, parent: parent || null });
    res.redirect('/admin/categories');
});

module.exports = router;
