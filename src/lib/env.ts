// Environment detection utility
export function getEnvironment() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (hostname.includes('lovable.app') || hostname.includes('lovable.dev')) {
    return 'lovable';
  }
  
  if (hostname.includes('pages.dev') || hostname.includes('fortunecoastalgroup.com') || hostname.includes('fortunecoastal.com')) {
    return 'cloudflare';
  }
  
  if (import.meta.env.PROD) {
    return 'production';
  }
  
  return 'development';
}

export function getSupabaseConfig() {
  const env = getEnvironment();
  
  // Lovable environment
  if (env === 'lovable') {
    return {
      url: import.meta.env.VITE_SUPABASE_URL || 'https://fycahwbrblvrytmkocfk.supabase.co',
      key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    };
  }
  
  // Cloudflare environment
  if (env === 'cloudflare' || env === 'production') {
    return {
      url: import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://sjdocxbywfmzksxyezq.supabase.co',
      key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'YOUR_CLOUDFLARE_KEY',
    };
  }
  
  // Development (default to Lovable)
  return {
    url: 'https://fycahwbrblvrytmkocfk.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  };
}