const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const methodOverride = require('method-override');
const session = require('express-session');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret123', 
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.set('view engine', 'ejs');

app.use('/admin', require('./routes/adminRoutes'));
app.use('/employees', require('./routes/employeeRoutes'));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});