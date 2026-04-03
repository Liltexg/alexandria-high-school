import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envConfig[key.trim()] = value.trim();
        }
    });
}

const dbUrl = envConfig.DATABASE_URL || process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('Error: DATABASE_URL not found in .env. Please check your credentials.');
    process.exit(1);
}

const client = new pg.Client({
    // Using the pooler address for better reliability
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.lccdrdrnfbncuqmthiyq',
    password: 'ycGzTjqJ6We1HKfY',
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function runMigration() {
    try {
        await client.connect();
        console.log('✅ Connected to Alexandria High School Supabase.');

        const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20260217180000_update_applications_fields.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Running schema update...');
        await client.query(sql);

        console.log('✅ Migration successful! Database schema updated with new application fields.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
