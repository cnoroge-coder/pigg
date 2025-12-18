// Fallback empty env.js for local development
// This file is overwritten during Vercel build with real values
window.ENV = window.ENV || {
  NEXT_PUBLIC_API_URL: '',
  NEXT_PUBLIC_SUPABASE_URL: '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ''
};
