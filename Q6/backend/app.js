// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/weather', async (req, res) => {
    try {
        const lat = req.query.lat || 21.1702;
        const lon = req.query.lon || 72.8311;

        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const response = await axios.get(apiUrl);

        res.json(response.data.current_weather);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
