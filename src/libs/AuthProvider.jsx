import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const role = localStorage.getItem('role');

  // For admin users, skip all profile processing but still provide context
  if (role === 'admin') {
    const adminValue = {
      profileCompleteness: 100,
      isLoading: false,
      isProfileComplete: () => true,
      canAccessManagement: () => true,
      redirectToProfileIfIncomplete: () => false,
      getProfileCompleteness: () => 100,
      updateProfileCompleteness: () => {},
      getMissingFields: () => [],
      getRemainsCredit: () => 0,
      role,
      isLoggedIn: !!localStorage.getItem('token')
    };

    return (
      <AuthContext.Provider value={adminValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [storageUpdate, setStorageUpdate] = useState(0);
  
  // Get user data from Redux store
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  
  // Get user details from localStorage (fallback)
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        // Trigger re-render when localStorage user data changes
        setStorageUpdate(prev => prev + 1);
      }
    };

    // Custom event listener for same-tab localStorage changes
    const handleLocalStorageUpdate = () => {
      setStorageUpdate(prev => prev + 1);
    };

    // Add event listener for storage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Add custom event listener for same-tab changes
    window.addEventListener('localStorageUserUpdate', handleLocalStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUserUpdate', handleLocalStorageUpdate);
    };
  }, []);

  // Update profile completeness from user data
  useEffect(() => {
    const updateProfileCompleteness = () => {
      setIsLoading(true);
      
      let userData = user;
      // console.log("userData--check",userData);
      
      // Fallback to localStorage if Redux user is not available
      if (!userData) {
        userData = getUserFromStorage();
      }
      
      // Get completeness from backend response
      if (userData?.profile_complete_percentage !== undefined) {
        setProfileCompleteness(userData.profile_complete_percentage);
      } else{
        setProfileCompleteness(0);
      } 
      
      setIsLoading(false);
    };

    updateProfileCompleteness();
  }, [user, storageUpdate]);

  // Check if profile is complete
  const isProfileComplete = () => {
    return profileCompleteness === 100;
  };

  // Check if user can access management features
  const canAccessManagement = () => {
    // Only vendors need profile completeness check
    if (role !== 'campus') {
      return true;
    }
    
    return isProfileComplete();
  };

  // Redirect to profile if profile is incomplete and trying to access management
  const redirectToProfileIfIncomplete = (fallbackPath = '/vendor/profile') => {
    if (!canAccessManagement() && isLoggedIn) {
      window.location.href = fallbackPath;
      return true;
    }
    return false;
  };

  // Get profile completeness percentage
  const getProfileCompleteness = () => {
    return getUserFromStorage()?.profile_complete_percentage || 0;
  };

  const getRemainsCredit = () => {
    const userData = getUserFromStorage();
    console.log("Getting remaining credits from localStorage:", userData?.remaining_credits);
    return userData?.remaining_credits || 0;
  };

  // Update profile completeness manually (for when user updates profile)
  const updateProfileCompleteness = (newCompleteness) => {
    setProfileCompleteness(newCompleteness);
    // Update localStorage as well
    const userData = getUserFromStorage();
    if (userData) {
      userData.profile_complete_percentage = newCompleteness;
      // userData.completeness = newCompleteness;
      localStorage.setItem('user', JSON.stringify(userData));
    }

  };

  // Get missing fields based on completeness
  const getMissingFields = () => {
    const userData = getUserFromStorage();
    if (!userData) return [];

    const missingFields = [];
    
    // Check common required fields for vendor profile
    const requiredFields = [
      { key: 'company_name', label: 'Company Name' },
      { key: 'company_email', label: 'Company Email' },
      { key: 'company_phone', label: 'Company Phone' },
      { key: 'company_address', label: 'Company Address' },
      { key: 'industry_type', label: 'Industry Type' },
      { key: 'company_size', label: 'Company Size' },
      { key: 'website', label: 'Website' },
      { key: 'description', label: 'Company Description' },
    ];

    requiredFields.forEach(field => {
      if (!userData[field.key] || userData[field.key] === '') {
        missingFields.push(field.label);
      }
    });

    return missingFields;
  };

  const value = {
    profileCompleteness,
    isLoading,
    isProfileComplete,
    canAccessManagement,
    redirectToProfileIfIncomplete,
    getProfileCompleteness,
    updateProfileCompleteness,
    getMissingFields,
    getRemainsCredit,
    role,
    isLoggedIn
  };

  function fields(nums){
    let posCount=0,negCount=0;
    for(let i of nums){
      if(i==0){
        continue;
      }else if(i>0){
        posCount++;
      }else{
        negCount++
      }
    }
    return Math.max(posCount,negCount);
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protecting management routes
export const withProfileCompleteCheck = (Component) => {
  return function ProtectedComponent(props) {
    const { canAccessManagement, redirectToProfileIfIncomplete, isLoading } = useAuth();
    // debugger;
    useEffect(() => {
      if (!isLoading && !canAccessManagement()) {
        redirectToProfileIfIncomplete();
      }
    }, [canAccessManagement, redirectToProfileIfIncomplete, isLoading]);

    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>;
    }

    if (!canAccessManagement()) {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
};

export default AuthProvider;
