# Student Module Testing Guide

## Student Testing - No Credentials Required

For testing purposes, the student module allows login **without requiring valid credentials**.

### Login Instructions:
1. Go to `/login`
2. Select "student" as the login role
3. Enter **any email address** (e.g., `test@test.com`, `demo@demo.com`, etc.)
4. Enter **any password** (doesn't matter what you enter)
5. Click login - you'll be automatically logged in as a student

### Example Test Emails:
- `test@test.com`
- `demo@demo.com`
- `student@gmail.com`
- `john.doe@college.edu`
- `jane.smith@university.edu`
- Any other email you prefer!

### Password:
- Any password works (e.g., `password`, `123456`, `test`, etc.)

## Testing Steps

### 1. Login as Student
1. Go to `/login`
2. Select "student" as the login role
3. Enter any of the above credentials
4. You should be redirected to `/student/dashboard`

### 2. Test Dashboard Features
- **Welcome Banner**: Shows student name and credits
- **Statistics Cards**: Display test statistics
- **Recent Tests**: View recent test history
- **Activity Timeline**: Shows recent activities
- **Profile Completion**: Warning if profile is incomplete

### 3. Test Request Test Page
- Navigate to `/student/request`
- Fill out the test request form
- Test credits deduction
- Test buy credits modal
- Test referral system

### 4. Test Test History Page
- Navigate to `/student/history`
- Test filtering by status
- Test date filtering
- Test pagination

### 5. Test Results Page
- Navigate to `/student/results`
- Test result visualization
- Test performance breakdown
- Test PDF download (mock)

### 6. Test Credits Page
- Navigate to `/student/credits`
- Test credit purchase modal
- Test referral system
- Test transaction history

### 7. Test Profile Page
- Navigate to `/student/profile`
- Test profile completion tracking
- Test form inputs
- Test skills management
- Test resume upload

## Mock Data

The student module uses mock data including:

### Student Profile:
```javascript
{
  name: "Aryan Mehta",
  email: "aryan.mehta@gmail.com",
  phone: "+91 9876543210",
  gender: "Male",
  college: "IIT Bombay",
  degree: "B.Tech",
  branch: "Computer Science",
  year: "3rd Year",
  skills: ["React", "Node.js", "Python", "DSA"],
  resume: null,
  avatar: null
}
```

### Test History:
- 8 mock tests with various statuses
- Scores ranging from 44% to 91%
- Different categories (DSA, React, Node.js, etc.)

### Credits:
- Starting balance: 5 credits
- Transaction history with purchases and usage

## Expected Behavior

1. **Successful Login**: Redirect to `/student/dashboard`
2. **Navigation**: All student routes should be accessible
3. **Data Display**: Mock data should appear correctly
4. **Interactions**: Forms, modals, and buttons should work
5. **Responsive Design**: Should work on mobile and desktop

## Troubleshooting

### If login fails:
- Check that the backend API is returning the correct structure
- Verify the `module` field is set to "student"
- Check the ProtectedRoute component

### If pages don't load:
- Verify all imports are correct
- Check the routing configuration
- Ensure lazy loading is working

### If styling issues:
- Verify Tailwind CSS is properly configured
- Check dark mode functionality
- Test responsive breakpoints

## API Response Format

For testing, ensure your login API returns:
```javascript
{
  access_token: "mock_token",
  module: "student",
  role: "student",
  name: "Aryan Mehta",
  email: "student@test.com",
  vendor_id: "student_123",
  plan_name: "Free",
  is_subscribed: false,
  profile_complete_percentage: 80,
  last_login: "2026-04-20",
  remaining_credits: 5
}
```
