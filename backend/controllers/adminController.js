const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get current admin
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
