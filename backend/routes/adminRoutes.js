const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', adminController.login);
router.get('/me', adminAuth, adminController.getMe);


router.get('/students', adminAuth, adminController.getAllStudents);
router.get('/students/:id', adminAuth, adminController.getStudentById);
router.put('/change-password', adminAuth, adminController.changePassword);

module.exports = router;
