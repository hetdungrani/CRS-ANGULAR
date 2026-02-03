const express = require('express');
const router = express.Router();
const {
    createNotification,
    getNotifications,
    deleteNotification,
    getDynamicDepartments
} = require('../controllers/notificationController');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

router.get('/', getNotifications);
router.get('/departments', getDynamicDepartments);
router.post('/', createNotification);
router.delete('/:id', deleteNotification);

module.exports = router;
