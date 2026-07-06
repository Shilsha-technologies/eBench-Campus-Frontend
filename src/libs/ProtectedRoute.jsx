import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  // debugger;
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')

  if (!token) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  // console.log("allowedRoles",allowedRoles)

  if (!allowedRoles.includes(role)) {
    // Logged in but role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
