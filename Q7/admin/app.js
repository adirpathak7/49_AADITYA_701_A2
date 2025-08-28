require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/erp');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin/categories', require('./routes/category'));
app.use('/admin/products', require('./routes/product'));
app.use('/', require('./routes/product'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Admin site running on http://localhost:${PORT}`));
