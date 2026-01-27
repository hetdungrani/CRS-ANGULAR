const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ email: 'admin@crs.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new Admin({
            username: 'SuperAdmin',
            email: 'admin@crs.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin created successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
