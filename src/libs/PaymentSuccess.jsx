import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>


        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you! Your payment has been completed successfully.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/vendor")}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/vendor/subscription")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;