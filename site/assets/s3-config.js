// Supabase S3 Storage Configuration
window.__S3_CONFIG = {
  accessKeyId: 'eca8eac0f3b230d7eb2b04f70167acf7',
  secretAccessKey: 'd095fd2a524b877ee0218176b1d7b2f9cd37c71991e8d4eb60714be3323fcfb2',
  region: 'us-east-1',
  endpoint: 'https://fccxkgfytweojfflvfnx.supabase.co/storage/v1/s3',
  bucket: 'pig'
};

console.log('✅ S3 storage configured for bucket:', window.__S3_CONFIG.bucket);
