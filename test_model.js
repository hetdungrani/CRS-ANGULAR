const mongoose = require('mongoose');
const Notification = require('./backend/models/Notification');

async function test() {
    try {
        await mongoose.connect('mongodb://localhost:27017/crs_angular_db');
        console.log('Connected');
        
        const n = await Notification.create({
            title: 'Test',
            message: 'Test message',
            type: 'general',
            targetGroup: 'all'
        });
        console.log('Success:', n);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

test();
