const mongoose = require('mongoose');

const SystemSettingSchema = new mongoose.Schema({
    allowRegistration: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemSetting', SystemSettingSchema);
