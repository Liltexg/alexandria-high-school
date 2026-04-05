import pg from 'pg';
import fs from 'fs';

const deploySchema = async () => {
    // Extract Database URL from .env (Manual extraction for simplicity in one script)
    const env = fs.readFileSync('.env', 'utf8');
    const databaseUrlMatch = env.match(/DATABASE_URL=(.*)/);
    
    if (!databaseUrlMatch) {
        console.error('DATABASE_URL not found in .env');
        process.exit(1);
    }

    const databaseUrl = databaseUrlMatch[1].trim();
    const { Client } = pg;
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });

    const sql = `
-- Institutional Governance: Audit Logging Protocol
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biometric Governance: Optic Recognition Descriptors
CREATE TABLE IF NOT EXISTS public.user_biometrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    face_descriptor DOUBLE PRECISION[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Fix: Add parent_signature column to applications table
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS parent_signature TEXT;
    `;

    try {
        console.log('Connecting to institutional database...');
        await client.connect();
        console.log('Running deployment script...');
        await client.query(sql);
        console.log('✅ Institutional Audit Protocol Deployed Successfully.');
    } catch (err) {
        console.error('❌ Deployment Failed:', err.message);
    } finally {
        await client.end();
    }
};

deploySchema();
