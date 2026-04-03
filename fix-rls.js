import pg from 'pg';
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

async function fixRLS() {
    try {
        await client.connect();
        console.log('✅ Connected to Supabase.');

        const sql = `
            -- Fix RLS policy for applications table
            DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
            
            CREATE POLICY "Anyone can submit an application"
            ON public.applications FOR INSERT
            WITH CHECK (true);
            
            -- Ensure RLS is enabled
            ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
            
            -- Grant necessary permissions
            GRANT ALL ON public.applications TO anon;
            GRANT ALL ON public.applications TO authenticated;
                                    GRANT ALL ON SEQUENCE application_ref_seq TO anon;
                                    GRANT ALL ON SEQUENCE application_ref_seq TO authenticated;
        `;

        console.log('Updating RLS policies and permissions...');
        await client.query(sql);

        console.log('✅ RLS Policy fix successful!');
    } catch (err) {
        console.error('❌ Fix failed:', err);
    } finally {
        await client.end();
    }
}

fixRLS();
