const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const employeeRoutes = require('./routes/employeeApi')

app.use(cors())

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/employee', require('./routes/employeeAuth'));
app.use('/api/employee', require('./routes/employeeApi'));
app.use('/api/employee', employeeRoutes);

app.listen(3000, () => console.log('Server running'));
