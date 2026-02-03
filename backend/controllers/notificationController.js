const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Create a new notification (Admin only)
 * @route   POST /api/notifications
 */
exports.createNotification = async (req, res) => {
    try {
        const { title, message, type, targetGroup } = req.body;
        
        const notification = new Notification({
            title,
            message,
            type: type || 'general',
            targetGroup: targetGroup || 'all'
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        console.error('Notification Creation Error:', err);
        res.status(500).json({ msg: 'Failed to create notification', error: err.message });
    }
};

/**
 * @desc    Get all notifications (Admin view)
 * @route   GET /api/notifications/all
 */
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch notifications' });
    }
};

/**
 * @desc    Get notifications for the logged-in student (with pagination)
 * @route   GET /api/notifications/my
 */
exports.getStudentNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            targetGroup: { $in: ['all', user.department] }
        };

        // Fetch paginated notifications
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Notification.countDocuments(query);
        
        res.json({
            notifications,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Error fetching student notifications:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete' });
    }
};

/**
 * @desc    Get departments with registered students
 * @route   GET /api/notifications/departments
 */
exports.getDynamicDepartments = async (req, res) => {
    try {
        // Find all unique departments from students
        const departments = await User.distinct('department', { role: 'student' });
        
        // Return sorted list
        res.json(departments.sort());
    } catch (err) {
        console.error('Error fetching dynamic departments:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
