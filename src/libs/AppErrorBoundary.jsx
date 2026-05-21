import { ErrorBoundary } from "react-error-boundary";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary }) {
  const [showDetails, setShowDetails] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    role === "vendor" ? navigate("/") : navigate("/admin-login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-r from-blue-300 to-blue-400 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-10 max-w-md w-full text-center text-white">
        <h1 className="text-3xl font-bold mb-4">😢 Oops! Something went wrong</h1>
        <p className="mb-6 text-base">
          We're having trouble displaying this page. You can try reloading it.
        </p>

        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 rounded-md bg-red-500 hover:bg-red-600 transition text-white font-semibold"
        >
          Reload Page
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 px-4 mx-2 py-2 rounded-md bg-gray-200/30 text-gray-900 hover:bg-gray-200 transition"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>

        <button
          onClick={handleLogout}
          className="mt-4 px-4 mx-2 py-2 rounded-md bg-gray-200/30 text-gray-900 hover:bg-gray-200 transition"
        >
          Logout
        </button>

        {showDetails && (
          <pre className="mt-4 text-left bg-white/20 p-4 rounded-md overflow-x-auto text-sm text-red-100">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}
