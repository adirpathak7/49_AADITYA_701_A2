const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// List products
router.get('/', async (req, res) => {
    const products = await Product.find().populate('category');
    res.render('products/list', { products });
});

// Add form
router.get('/add', async (req, res) => {
    const categories = await Category.find();
    res.render('products/add', { categories });
});

// Add product
router.post('/add', async (req, res) => {
    const { name, price, description, category, image } = req.body;
    await Product.create({ name, price, description, category, image });
    res.redirect('/admin/products');
});

// GET /api/products (user access)
router.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


module.exports = router;
