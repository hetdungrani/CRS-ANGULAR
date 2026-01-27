const express = require('express');
const router = express.Router();
const {
    createNotification,
    getNotifications,
    deleteNotification
} = require('../controllers/notificationController');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

router.route('/')
    .get(getNotifications)
    .post(createNotification);

router.delete('/:id', deleteNotification);

module.exports = router;
