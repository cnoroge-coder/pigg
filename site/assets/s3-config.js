// Supabase S3 Storage Configuration
window.__S3_CONFIG = {
  accessKeyId: '5029b64f6f1c6a938b2f06ebb22b190c7671e7a24b2ba47f659b6e90c952273b',
  secretAccessKey: '534f58bd88db2df84a6357f44491d511',
  region: 'us-east-1', // Default Supabase region
  endpoint: 'https://fccxkgfytweojfflvfnx.supabase.co/storage/v1/s3',
  bucket: 'pigs'
};

console.log('✅ S3 storage configured for bucket:', window.__S3_CONFIG.bucket);
