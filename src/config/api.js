// API Configuration

export const API_CONFIG = {
  // Country State City API
  CSC_API_KEY: import.meta.env.VITE_CSC_API_KEY || 'NHhvQycrYDZ3YTdCZ3VxOGk1N0oyb0R6WW1mSTVjN2p5UHJleEVpdDZ3MD0',
  CSC_BASE_URL: 'https://api.countrystatecity.in/v1',
  
  // Default country code
  DEFAULT_COUNTRY: 'IN'
};

// Backend API Configuration
export const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  CONTACT_US: '/home/contact-us'
};

// Export API endpoints
export const API_ENDPOINTS = {
  STATES: (countryCode) => `${API_CONFIG.CSC_BASE_URL}/countries/${countryCode}/states`,
  CITIES: (countryCode, stateCode) => `${API_CONFIG.CSC_BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
  CONTACT_US: `${BACKEND_CONFIG.BASE_URL}${BACKEND_CONFIG.CONTACT_US}`
};
