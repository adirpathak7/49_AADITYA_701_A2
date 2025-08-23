const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/api/location', async (req, res) => {
  try {
    const response = await axios.get('https://ipapi.co/json');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from API' });
  }
});

module.exports = router;
