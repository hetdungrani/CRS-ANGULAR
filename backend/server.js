const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('CRS Backend API is running');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/jobs', require('./routes/jobRoutes'));
app.use('/api/jobs', require('./routes/studentJobRoutes'));
app.use('/api/admin/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin/settings', require('./routes/settingsRoutes'));
app.use('/api/settings', require('./routes/publicSettingsRoutes'));
app.use('/api/notifications', require('./routes/studentNotificationRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({
        msg: 'Something went wrong on the server',
        error: err.message
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
