const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    type: {
        type: String,
        enum: ['job', 'interview', 'exam', 'result', 'general'],
        default: 'general'
    },
    targetGroup: {
        type: String,
        enum: ['all', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical', 'Civil'],
        default: 'all'
    },
    sender: {
        type: String,
        default: 'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
