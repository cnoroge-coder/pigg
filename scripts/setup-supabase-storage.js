// Setup Supabase Storage Bucket for Pig Images
// Run this once to create the storage bucket

const SUPABASE_URL = 'https://fccxkgfytweojfflvfnx.supabase.co';
const SUPABASE_SERVICE_KEY = '77b7d7d6d7e0b23e6b624698ddeb7a272922fdf3a6e331c2a4049dc4436617f7'; // Service role key

async function setupStorage() {
  console.log('🔧 Setting up Supabase Storage for pig images...\n');

  try {
    // Create the 'pigs' bucket
    console.log('Creating "pigs" bucket...');
    const createBucketResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({
        name: 'pigs',
        public: true,
        file_size_limit: 5242880, // 5MB
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      })
    });

    const createResult = await createBucketResponse.text();
    
    if (createBucketResponse.ok) {
      console.log('✅ Bucket "pigs" created successfully!');
      console.log('Response:', createResult);
    } else if (createBucketResponse.status === 409) {
      console.log('ℹ️  Bucket "pigs" already exists');
    } else {
      console.log('❌ Failed to create bucket');
      console.log('Status:', createBucketResponse.status);
      console.log('Response:', createResult);
    }

    // Update bucket to be public (if it exists)
    console.log('\nUpdating bucket to be public...');
    const updateBucketResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/pigs`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({
        public: true,
        file_size_limit: 5242880,
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      })
    });

    const updateResult = await updateBucketResponse.text();
    
    if (updateBucketResponse.ok) {
      console.log('✅ Bucket updated successfully!');
      console.log('Response:', updateResult);
    } else {
      console.log('⚠️  Bucket update response:');
      console.log('Status:', updateBucketResponse.status);
      console.log('Response:', updateResult);
    }

    console.log('\n📝 Summary:');
    console.log('- Bucket name: pigs');
    console.log('- Public access: enabled');
    console.log('- Max file size: 5MB');
    console.log('- Allowed types: JPEG, PNG, WebP, GIF');
    console.log('\n✅ Storage setup complete! You can now upload pig images.');

  } catch (error) {
    console.error('❌ Error setting up storage:', error);
  }
}

setupStorage();
