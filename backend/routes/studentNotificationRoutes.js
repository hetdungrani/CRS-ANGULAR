const express = require('express');
const router = express.Router();
const { getStudentNotifications } = require('../controllers/notificationController');
const auth = require('../middleware/auth'); // Assuming this exists for students

router.get('/my', auth, getStudentNotifications);

module.exports = router;
