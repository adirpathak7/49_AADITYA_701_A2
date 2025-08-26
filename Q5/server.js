require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
connectDB(process.env.MONGO_URI);

app.use(cors()); // allow cross-origin (if serving frontend separately)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/leaves', require('./routes/leaves'));

// Serve frontend static files from public/
app.use('/', express.static(path.join(__dirname, 'public')));

// catch-all for SPA pages (so /profile works if refreshed)
app.get('/profile.html', (req, res) => res.sendFile(path.join(__dirname, 'public/profile.html')));
app.get('/leaves.html', (req, res) => res.sendFile(path.join(__dirname, 'public/leaves.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));