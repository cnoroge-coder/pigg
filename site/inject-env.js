#!/usr/bin/env node
/**
 * Inject environment variables into the static site
 * This script runs during Vercel build to make env vars available in browser
 */

const fs = require('fs');
const path = require('path');

const envVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

// Create env injection script
const envScript = `
// Auto-generated environment variables - DO NOT EDIT
window.ENV = ${JSON.stringify(envVars, null, 2)};
`;

// Write to assets directory
const outputPath = path.join(__dirname, 'assets', 'env.js');
fs.writeFileSync(outputPath, envScript);

console.log('✅ Environment variables injected for static site');
console.log('Variables:', Object.keys(envVars));
