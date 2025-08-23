const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

router.get('/',(req,res) => res.render('admin/dashboard'));

// Category Routes
router.get('/categories', async (req,res) => {
    const categories = await Category.find().populate('parent');
    res.render('admin/categories', {categories});
});

router.post('/categories', async (req,res) => {
    const {name, parent} = req.body;
    await Category.create({name, parent: parent || null});
    res.redirect('/admin/categories');
});

//Product Routes
router.get('/products', async (req,res) => {
    const products = await Product.find().populate('category');
    const categories = await Category.find();
    res.render('admin/products', {products, categories});
});

router.post('/products', async (req,res) => {
    const {name, price, category, description} = req.body;
    await Product.create({name, price, category, description});
    res.redirect('/admin/products');
});

module.exports = router;