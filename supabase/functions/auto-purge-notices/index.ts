import { createClient } from '@supabase/supabase-js'

console.log("Job: auto-purge-notices started")

Deno.serve(async (req) => {
  try {
    // 1. Initialize Admin Client
    // We need service_role key to bypass RLS and delete records
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Define the threshold (30 days ago)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffTimestamp = thirtyDaysAgo.toISOString()

    // 3. Perform the soft-delete cleanup
    // Delete notices where status is 'archived' AND updated_at < 30 days ago
    // Note: We rely on updated_at because that's when it moved to archive (usually)
    // or we could check 'expire_at' if we want to be strict about expiry.
    // Let's stick to status='archived' to be safe.
    
    const { data, error, count } = await supabaseAdmin
      .from('notices')
      .delete({ count: 'exact' })
      .eq('status', 'archived')
      .lt('updated_at', cutoffTimestamp)

    if (error) {
      console.error("Migration Error:", error)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      })
    }

    console.log(`Deleted ${count} old notices.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Purged ${count} notices archived before ${cutoffTimestamp}` 
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    )

  } catch (error) {
    console.error("System Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})
