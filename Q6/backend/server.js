const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3000;

// const fileName = fileURLToPath(import.meta.url);
// const __dirName = path.dirname(fileName);

app.use(express.static(path.join(__dirname,"../frontend")));

app.get('/api/holidays', async (req, res) => {
    const country = req.query.country || 'US';
    try {
        const response = await fetch(`https://date.nager.at/api/v3/NextPublicHolidays/${country}`);
        const data = await response.json();
        res.json(data.slice(0,5));
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch holiday data'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});