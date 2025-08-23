const express = require('express');
const path = require('path');
const utilityRoutes = require('./utility');

const app = express();
const PORT = 3000;

// Serve static HTML from /public folder
app.use(express.static(path.join(__dirname, '../public')));

// Default route to serve geo.html on '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/geo.html'));
});

// API routes
app.use('/', utilityRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
