// API Configuration - Environment-based
// Priority: 1. VITE_API_URL env var (set during build), 2. Production URL (safe default), 3. Localhost (dev only)
const PRODUCTION_API_URL = 'https://rmsadminbackend.llp.trizenventures.com/api/v1';
const DEVELOPMENT_API_URL = 'http://localhost:3001/api/v1';

// Determine API URL based on environment
// In Vite: import.meta.env.DEV is true only when running `vite` (dev server)
// import.meta.env.PROD is true when running `vite build` (production build)
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? DEVELOPMENT_API_URL : PRODUCTION_API_URL);

// Log the API URL for debugging (helps identify configuration issues)
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  console.log('🔍 API Base URL:', API_BASE_URL);
  console.log('🔍 Environment check:', {
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    VITE_API_URL: import.meta.env.VITE_API_URL || 'not set'
  });
}

export { API_BASE_URL };
