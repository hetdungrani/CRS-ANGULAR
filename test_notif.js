const axios = require('axios');

async function test() {
    try {
        const response = await axios.post('http://localhost:5000/api/admin/notifications', {
            title: 'Test Notification',
            message: 'This is a test message',
            type: 'general',
            targetGroup: 'all'
        }, {
            headers: {
                'x-auth-token': 'YOUR_TOKEN_HERE' // I don't have a token
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
    }
}

// test();
