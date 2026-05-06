import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { mockStudentData } from "../../utils/mockAuth";

// Quick test button for student module - only visible in development
export default function StudentTestButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuickStudentLogin = () => {
    // Set mock student credentials
    dispatch(
      setCredentials({
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
          remaining_credits: mockStudentData.remaining_credits,
        },
      })
    );

    // Navigate to student dashboard
    navigate("/student/dashboard");
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleQuickStudentLogin}
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
        title="Quick Student Login (Development Only)"
      >
        🧪 Quick Student Login
      </button>
    </div>
  );
}
