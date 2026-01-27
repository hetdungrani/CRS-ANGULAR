const Notification = require('../models/Notification');

// @desc    Create/Send notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
exports.createNotification = async (req, res) => {
    try {
        const { title, message, type, targetGroup } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ msg: 'Title and message are required' });
        }

        const notification = new Notification({
            title,
            message,
            type: type || 'general',
            targetGroup: targetGroup || 'all'
        });

        const savedNotification = await notification.save();
        res.status(201).json(savedNotification);
    } catch (err) {
        console.error('Detailed Notification Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message, stack: err.stack });
    }
};

// @desc    Get all notifications (Admin view)
// @route   GET /api/admin/notifications
// @access  Private/Admin
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete notification
// @route   DELETE /api/admin/notifications/:id
// @access  Private/Admin
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }
        await notification.deleteOne();
        res.json({ msg: 'Notification removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get notifications for a specific student (Student view)
// @route   GET /api/notifications/my
// @access  Private
exports.getStudentNotifications = async (req, res) => {
    try {
        // This would be called from the student/client app
        // We'll search for 'all' or their specific department
        const { department } = req.user; // Assuming auth middleware attaches user to req
        const notifications = await Notification.find({
            targetGroup: { $in: ['all', department] }
        }).sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
