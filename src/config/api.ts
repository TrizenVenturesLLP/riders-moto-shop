// API Configuration - Environment-based
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:3001/api/v1' 
    : 'https://rmsadminbackend.llp.trizenventures.com/api/v1'
  );

export { API_BASE_URL };
