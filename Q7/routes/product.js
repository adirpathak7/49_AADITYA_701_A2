const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

//HomePage
router.get('/', async (req, res) => {
    const categories = await Category.find({ parent: null});
    res.render('user/home', { categories });
});

//Products by Category
router.get('/category/:id', async (req, res) => {
    const products = await Product.find({ category: req.params.id });
    res.render('user/productList', { products });
});

module.exports = router;