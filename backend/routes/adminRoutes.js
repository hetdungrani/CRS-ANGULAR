const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', adminController.login);
router.get('/me', adminAuth, adminController.getMe);

module.exports = router;
