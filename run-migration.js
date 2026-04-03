
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
    console.error('Error: DATABASE_URL not found in .env (or process.env). Cannot connect directly via PG.');
    // Fallback: try to construct it from Supabase URL if not present, but usually we need the connection string.
    // The service role key is for REST, not direct PG connection.
    console.log('You need the full connection string (postgres://user:pass@host:port/db) to run migrations remotely via script.');
    process.exit(1);
}

const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function runMigration() {
    try {
        await client.connect();
        console.log('✅ Connected to database via PG client.');

        const sql = fs.readFileSync('supabase_setup.sql', 'utf8');
        console.log('Running migration...');

        await client.query(sql);

        console.log('✅ Migration successful! Table "hero_slides" created.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
