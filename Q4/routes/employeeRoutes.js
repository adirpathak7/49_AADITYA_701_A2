const express = require('express');
const router = express.Router();
const {listEmployees, getCreate, postCreate, getEdit, postEdit, deleteEmployee} = require('../controllers/employeeController');

function isAuthenticated(req, res, next) {
    if (req.session.adminId) {
        return next();
    }
    res.redirect('/admin/login');
};

router.get('/', isAuthenticated, listEmployees);
router.get('/create', isAuthenticated, getCreate);
router.post('/create', isAuthenticated, postCreate);
router.get('/edit/:id', isAuthenticated, getEdit);
router.post('/edit/:id', isAuthenticated, postEdit);
router.get('/delete/:id', isAuthenticated, deleteEmployee);

module.exports = router;