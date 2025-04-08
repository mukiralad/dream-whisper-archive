import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const siteUrl = import.meta.env.MODE === 'production' 
  ? 'https://dream-whisper-archive.vercel.app'
  : 'http://localhost:3000';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage
  },
});

// Storage bucket for dream recordings
export const STORAGE_BUCKET = 'dream-recordings';

// Initialize storage bucket
export const initializeStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);

    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: false, // Keep recordings private
        fileSizeLimit: 5242880, // 5MB limit
      });

      if (error) {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}; 