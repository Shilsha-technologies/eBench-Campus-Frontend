import { Smile, Download } from "lucide-react";

const SuccessPage = () => {

  const downloadReport = () => {
    const link = document.createElement("a");

    link.href = "/Pushkaran_Tyagi_Scoring_Analysis_Report.pdf";
    link.download = "Pushkaran_Tyagi_Scoring_Analysis_Report.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md text-center">
        <Smile className="mx-auto h-20 w-20 text-blue-800 mb-6" />

        <h1 className="text-3xl font-bold text-blue-900 mb-3">
          Submission Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for submitting your test. Our team will reach out once you
          get shortlisted.
        </p>

        <button
          onClick={downloadReport}
          className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg p-3 transition duration-200 cursor-pointer"
        >
          <Download className="h-5 w-5 text-blue-700" />

          <span className="text-blue-800 font-medium">
            Your report is ready — Download Report
          </span>
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;