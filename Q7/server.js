const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/shoppingCart');

app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/product'));
app.use('/cart', require('./routes/cart'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});