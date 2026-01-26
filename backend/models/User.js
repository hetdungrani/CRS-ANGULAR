const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6
    },
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number'],
        match: [/^[0-9]{10}$/, 'Please add a valid 10-digit mobile number']
    },
    department: {
        type: String,
        required: [true, 'Please select a department']
    },
    course: {
        type: String,
        required: [true, 'Please select a course']
    },
    cgpa: {
        type: Number,
        required: [true, 'Please enter CGPA'],
        min: 0,
        max: 10
    },
    gender: {
        type: String,
        required: [true, 'Please select gender'],
        enum: ['Male', 'Female', 'Other']
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
