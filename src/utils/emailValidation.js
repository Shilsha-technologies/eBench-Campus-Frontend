// Email validation utility with role-based domain validation

// Configurable domain lists
export const DOMAIN_CONFIG = {
  // Personal email domains (allowed for Student role, disallowed for Campus role)
  PERSONAL_DOMAINS: [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'zoho.com',
    'protonmail.com',
    'tutanota.com',
    'yandex.com',
    'gmx.com',
    'gmx.net',
    'web.de',
    'live.com',
    'msn.com',
    'comcast.net',
    'verizon.net',
    'att.net',
    'sbcglobal.net',
    'bellsouth.net',
    'charter.net',
    'cox.net',
    'earthlink.net',
    'juno.com',
    'netscape.net',
    'rocketmail.com'
  ],
  
  // Work/business email domains (allowed for Campus role, disallowed for Student role)
  WORK_DOMAINS: [
    'company.com', // Generic company domain placeholder
    'corp.com',
    'business.com',
    'enterprise.com',
    'org.com',
    'llc.com',
    'inc.com',
    'group.com',
    'tech.com',
    'solutions.com',
    'services.com',
    'consulting.com',
    'partners.com',
    'systems.com',
    'global.com',
    'international.com',
    'worldwide.com',
    'industries.com',
    'holdings.com',
    'ventures.com',
    'capital.com',
    'investments.com',
    'management.com',
    'resources.com',
    'development.com'
  ]
};

// Extract domain from email address
export const extractDomain = (email) => {
  if (!email || typeof email !== 'string') return '';
  
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1 || atIndex === email.length - 1) return '';
  
  return email.substring(atIndex + 1).toLowerCase().trim();
};

// Validate email format
export const validateEmailFormat = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Role-based email validation
export const validateEmailByRole = (email, role) => {
  // First validate basic email format
  if (!validateEmailFormat(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }
  
  const domain = extractDomain(email);
  
  if (!domain) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }
  
  // Campus role - only allow work/business emails
  if (role === 'campus') {
    // Check if domain is in personal domains list
    if (DOMAIN_CONFIG.PERSONAL_DOMAINS.includes(domain)) {
      return {
        isValid: false,
        message: 'Please enter your work email address'
      };
    }
    
    // Allow all other domains (assumed to be work domains)
    return {
      isValid: true,
      message: ''
    };
  }
  
  // Student role - only allow personal emails
  if (role === 'student') {
    // Check if domain is in personal domains list
    if (DOMAIN_CONFIG.PERSONAL_DOMAINS.includes(domain)) {
      return {
        isValid: true,
        message: ''
      };
    }
    
    // Reject all other domains (assumed to be work domains)
    return {
      isValid: false,
      message: 'Please enter a valid personal email address'
    };
  }
  
  // Default case - if role is not specified, accept valid email format
  return {
    isValid: true,
    message: ''
  };
};

// Check if domain is a personal email domain
export const isPersonalDomain = (domain) => {
  return DOMAIN_CONFIG.PERSONAL_DOMAINS.includes(domain.toLowerCase());
};

// Check if domain appears to be a work/business domain
export const isWorkDomain = (domain) => {
  return !DOMAIN_CONFIG.PERSONAL_DOMAINS.includes(domain.toLowerCase());
};

// Add new domain to personal domains list
export const addPersonalDomain = (domain) => {
  const normalizedDomain = domain.toLowerCase().trim();
  if (!DOMAIN_CONFIG.PERSONAL_DOMAINS.includes(normalizedDomain)) {
    DOMAIN_CONFIG.PERSONAL_DOMAINS.push(normalizedDomain);
  }
};

// Add new domain to work domains list
export const addWorkDomain = (domain) => {
  const normalizedDomain = domain.toLowerCase().trim();
  if (!DOMAIN_CONFIG.WORK_DOMAINS.includes(normalizedDomain)) {
    DOMAIN_CONFIG.WORK_DOMAINS.push(normalizedDomain);
  }
};

// Get validation message for role
export const getRoleValidationMessage = (role) => {
  if (role === 'campus') {
    return 'Please enter your work email address';
  } else if (role === 'student') {
    return 'Please enter a valid personal email address';
  }
  return 'Please enter a valid email address';
};

// Get placeholder text based on role
export const getEmailPlaceholder = (role) => {
  if (role === 'campus') {
    return 'work@company.com';
  } else if (role === 'student') {
    return 'personal@gmail.com';
  }
  return 'you@example.com';
};
