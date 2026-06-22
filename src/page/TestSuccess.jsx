import { Smile } from "lucide-react";

const SuccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md text-center">
        <Smile className="mx-auto h-20 w-20 text-blue-800 mb-6" />

        <h1 className="text-3xl font-bold text-blue-900 mb-3">
          Submission Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for submitting your test. Our team will reach out once you get shortlisted.
        </p>

        {/* <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition duration-200"
        >    
          Back to Dashboard
        </button> */}
      </div>
    </div>
  );
};

export default SuccessPage;
