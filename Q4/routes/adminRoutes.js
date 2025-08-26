const express = require('express');
const router = express.Router();
const {getLogin, postLogin, logout} = require('../controllers/adminController');

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

module.exports = router;