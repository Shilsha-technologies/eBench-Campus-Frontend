// Mock authentication utility for testing student module

export const mockStudentData = {
  access_token: "mock_student_token_12345",
  module: "student",
  role: "student",
  name: "Aryan Mehta",
  email: "student@gmail.com",
  vendor_id: "student_123",
  plan_name: "Free",
  is_subscribed: false,
  profile_complete_percentage: 80,
  last_login: new Date().toISOString(),
  remaining_credits: 5
};

// Mock login function for testing
export const mockStudentLogin = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Allow ANY student login attempt without checking credentials
  if (credentials.module === "student") {
    // Use the provided email or default to mock data
    const studentData = {
      ...mockStudentData,
      email: credentials.email || mockStudentData.email,
      name: credentials.email ? credentials.email.split('@')[0] : mockStudentData.name
    };
    
    return {
      data: studentData
    };
  }
  
  // For other logins, let the real API handle it
  throw new Error("Invalid credentials for mock student");
};

// For development/testing - bypass authentication
export const bypassAuthForTesting = () => {
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem('token', mockStudentData.access_token);
    localStorage.setItem('user', JSON.stringify({
      token: mockStudentData.access_token,
      module: mockStudentData.module,
      user: mockStudentData.role,
      detail: {
        name: mockStudentData.name,
        email: mockStudentData.email,
        id: mockStudentData.vendor_id,
        planName: mockStudentData.plan_name,
        status: mockStudentData.is_subscribed,
        profile_complete_percentage: mockStudentData.profile_complete_percentage,
        last_login: mockStudentData.last_login,
        remaining_credits: mockStudentData.remaining_credits
      }
    }));
    
    return true;
  }
  return false;
};

// Quick test function
export const quickStudentTest = () => {
  console.log("🧪 Setting up mock student login for testing...");
  
  if (bypassAuthForTesting()) {
    console.log("✅ Mock student auth setup complete");
    console.log("📧 Email: student@gmail.com");
    console.log("🔑 Password: password123");
    console.log("🎯 Navigate to: /student/dashboard");
    return true;
  }
  
  console.log("❌ Mock auth only works in development mode");
  return false;
};
