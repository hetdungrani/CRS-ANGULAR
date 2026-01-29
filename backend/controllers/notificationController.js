const Notification = require('../models/Notification');

// @desc    Create/Send notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
exports.createNotification = async (req, res) => {
    try {
        const { title, message, type, targetGroup } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ 
                msg: 'Title and message are required',
                received: { title: !!title, message: !!message } 
            });
        }

        const notification = new Notification({
            title,
            message,
            type: type || 'general',
            targetGroup: targetGroup || 'all',
            sender: req.admin?.username || 'Admin'
        });

        const savedNotification = await notification.save();
        res.status(201).json(savedNotification);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
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
        res.status(500).send('Server Error');
    }
};

// @desc    Delete notification
// @route   DELETE /api/admin/notifications/:id
// @access  Private/Admin
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }
        
        res.json({ msg: 'Notification removed' });
    } catch (err) {
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
        res.status(500).send('Server Error');
    }
};
