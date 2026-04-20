// upload_notice.js
// Usage: node upload_notice.js "Title" "Body" "Target Group" "Publish Date (ISO)" "Expire Date (ISO)" "Status"
// Example: node upload_notice.js "New Event" "Details..." "Learners" "2026-04-10T09:00" "2026-04-20T23:59" "active"

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const args = process.argv.slice(2);
if (args.length < 6) {
  console.error('Missing arguments. Expected: title, body, target_group, publish_at, expire_at, status');
  process.exit(1);
}

const [title, body, targetGroup, publishAt, expireAt, status] = args;

(async () => {
  const payload = {
    title,
    body,
    target_group: targetGroup,
    publish_at: new Date(publishAt).toISOString(),
    expire_at: new Date(expireAt).toISOString(),
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('notices').insert([payload]);
  if (error) {
    console.error('Error uploading notice:', error.message);
    process.exit(1);
  }
  console.log('Notice uploaded successfully:', data);
})();
