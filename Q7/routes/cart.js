const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get Cart
router.get('/', async (req, res) => {
    let cart = await Cart.findOne().populate('products.product');
    if (!cart) {
        cart = await Cart.create({ products: [] });
    }
    res.render('user/cart', { cart });
});

// Add to Cart
router.post('/add/:productId', async (req, res) => {
    let cart = await Cart.findOne();
    
    if (!cart) {
        cart = await Cart.create({ products: [] });
    }

    const itemIndex = cart.products.findIndex(p => p.product.toString() === req.params.productId);
    
    if (itemIndex > -1) {
        cart.products[itemIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.productId, quantity: 1 });
    }

    await cart.save();
    res.redirect('/cart');
});

// Remove from Cart
router.post('/remove/:productId', async (req, res) => {
    let cart = await Cart.findOne();
    cart.products = cart.products.filter(p => p.product.toString() !== req.params.productId);
    await cart.save();
    res.redirect('/cart');
});

module.exports = router;