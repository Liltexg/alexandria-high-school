import pg from 'pg';
import fs from 'fs';
import path from 'path';

const client = new pg.Client({
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

        const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20260218000000_create_audit_logs.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Running audit_logs table creation...');
        await client.query(sql);

        console.log('✅ Migration successful! audit_logs table created.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
