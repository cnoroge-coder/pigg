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

// Supabase configuration for static site
window.__SUPABASE_URL = 'https://fccxkgfytweojfflvfnx.supabase.co';
window.__SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjY3hrZ2Z5dHdlb2pmZmx2Zm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTcxNDMsImV4cCI6MjA4MTYzMzE0M30.fEnMNwGh7cbr9s8A58gTgoe0qqbEZmdiOxlaMrMxCOs';

if (!window.__SUPABASE_URL || !window.__SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase configuration missing. Please set environment variables.');
}

/*
  Security note: Only use the anon key for client-side code.
  Never commit service_role keys to the repository.
  Always use Row Level Security (RLS) in your Supabase database.
*/
