const SystemSetting = require('../models/SystemSetting');

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
    try {
        let settings = await SystemSetting.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = new SystemSetting();
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
    try {
        const { allowRegistration, theme } = req.body;
        
        let settings = await SystemSetting.findOne();
        if (!settings) {
            settings = new SystemSetting();
        }

        settings.allowRegistration = allowRegistration !== undefined ? allowRegistration : settings.allowRegistration;
        settings.theme = theme !== undefined ? theme : settings.theme;

        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
