const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Public route to get settings (like allowRegistration)
router.get('/', settingsController.getSettings);

module.exports = router;
