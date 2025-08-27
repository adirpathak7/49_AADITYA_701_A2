require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'super-secret-session-key',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');

app.use('/', adminRoutes);
app.use('/employees', employeeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
