const crypto = require('crypto');
const axios = require('axios');

const secret = 'whsec_ZCMKB0DaByuxwe6Y7GOuvOewgYFS/tvV';
const userId = 'user_2sxk2dGFwUeAA2Q3lQj3q5a3q'

const payload = {
    type: 'checkout.session.completed',
    data: {
        id: 'sub_test_123',
        customer_id: 'cus_test_123',
        subscription_id: 'sub_test_123',
        metadata: {
            userId: userId
        },
        customer_email: 'test@example.com'
    }
};

const body = JSON.stringify(payload);

const signature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

console.log('Signature calculated:', signature);

async function sendWebhook() {
    try {
        console.log('Sending request to http://[::1]:3000/api/webhooks...');
        const response = await axios.post('http://[::1]:3000/api/webhooks', payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-signature': signature
            }
        });

        console.log('Success Status:', response.status);
        console.log('Success Data:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else if (error.request) {
            console.error('Error Request (No Response):', error.message);
        } else {
            console.error('Error Setup:', error.message);
        }
    }
}

sendWebhook();
