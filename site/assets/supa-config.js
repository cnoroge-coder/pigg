// Supabase configuration
// SECURITY: API keys removed from code and moved to environment variables
// 
// For local development:
// 1. Copy .env.example to .env.local
// 2. Add your Supabase URL and ANON key to .env.local
// 3. These will be injected at build time
//
// For production (Vercel):
// Set these in Vercel dashboard under Environment Variables:
// - NEXT_PUBLIC_SUPABASE_URL
// - NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// For static site deployment, use Vercel's environment variable injection

// Load from environment variables (injected at build/runtime)
window.__SUPABASE_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : (window.ENV && window.ENV.NEXT_PUBLIC_SUPABASE_URL) || '';

window.__SUPABASE_ANON_KEY = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : (window.ENV && window.ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY) || '';

if (!window.__SUPABASE_URL || !window.__SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase configuration missing. Please set environment variables.');
}

/*
  Security note: Only use the anon key for client-side code.
  Never commit service_role keys to the repository.
  Always use Row Level Security (RLS) in your Supabase database.
*/
