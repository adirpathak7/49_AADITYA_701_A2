const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/employeesite')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/', authRoutes);
app.use('/', leaveRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
