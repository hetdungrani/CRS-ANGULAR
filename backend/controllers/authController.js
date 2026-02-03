const User = require('../models/User');
const SystemSetting = require('../models/SystemSetting');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        // Check if registration is allowed
        const settings = await SystemSetting.findOne();
        if (settings && !settings.allowRegistration) {
            return res.status(403).json({ msg: 'Registration is not allowed' });
        }

        const { fullName, email, password, mobile, department, cgpa, gender } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            fullName,
            email,
            password,
            mobile,
            department,
            cgpa,
            gender
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                department: user.department
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret', // Default secret for dev
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err);
                    return res.status(500).json({ msg: 'Token generation failed' });
                }
                res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error('Registration Error Details:', err);
        res.status(500).json({ msg: err.message || 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                department: user.department
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role,
                        mobile: user.mobile,
                        department: user.department,
                        cgpa: user.cgpa,
                        gender: user.gender
                    }
                });
            }
        );
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
    const { fullName, email, mobile, department, cgpa, gender, dateOfBirth, address, skills } = req.body;

        // Build user object
        const profileFields = {};
        if (fullName) profileFields.fullName = fullName;
        if (mobile) profileFields.mobile = mobile;
        if (department) profileFields.department = department;
        if (cgpa !== undefined) profileFields.cgpa = cgpa;
        if (gender) profileFields.gender = gender;
        if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
        if (address) profileFields.address = address;
        if (skills) profileFields.skills = skills;

        // Handle email update separately due to uniqueness
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
            profileFields.email = email;
        }

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Server Error');
    }
};
