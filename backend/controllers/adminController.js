const Admin = require('../models/Admin');
const User = require('../models/User');
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

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private
exports.getAllStudents = async (req, res) => {
    try {
        const { branch, cgpa, passingYear, skills } = req.query;
        let query = { role: 'student' };

        if (branch) query.department = branch;
        if (cgpa) query.cgpa = { $gte: parseFloat(cgpa) };
        if (passingYear) query.passingYear = passingYear;
        
        // Search by name or department (or skills)
        if (skills) { // keeping this if specific skills filter is used
             const skillArray = skills.split(',').map(s => new RegExp(s.trim(), 'i'));
             query.skills = { $in: skillArray };
        }

        const { search } = req.query;
        if (search) {
             const searchRegex = new RegExp(search, 'i');
             query.$or = [
                 { fullName: searchRegex },
                 { department: searchRegex },
                 { email: searchRegex }
             ];
        }

        const students = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select('-password');
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
};// @desc    Change Admin Password
// @route   PUT /api/admin/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        await admin.save();
        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
