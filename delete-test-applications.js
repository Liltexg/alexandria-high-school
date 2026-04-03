// Quick script to delete all test applications from the database
const https = require('https');

const SUPABASE_URL = 'https://lccdrdrnfbncuqmthiyq.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjY2RyZHJuZmJuY3VxbXRoaXlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTk0MTY5NiwiZXhwIjoyMDg1NTE3Njk2fQ.b3M-RRaNaQo-zkn9aBOSFfrEAMxj2fMmpsbkK6Mc6Fo';

async function deleteAllApplications() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'lccdrdrnfbncuqmthiyq.supabase.co',
            path: '/rest/v1/applications?id=neq.00000000-0000-0000-0000-000000000000',
            method: 'DELETE',
            headers: {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 204) {
                    console.log('✅ All test applications deleted successfully!');
                    console.log(`📊 Response: ${data || 'No content'}`);
                    resolve();
                } else {
                    console.error(`❌ Error: Status ${res.statusCode}`);
                    console.error(`Response: ${data}`);
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error);
            reject(error);
        });

        req.end();
    });
}

console.log('🗑️  Deleting all test applications...');
deleteAllApplications()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
