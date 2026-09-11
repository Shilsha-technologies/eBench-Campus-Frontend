// import { Smile, Download } from "lucide-react";
import CampusLogo from '../assets/eBenchCampu.png'
const SuccessPage = () => {

  // const downloadReport = () => {
  //   const link = document.createElement("a");

  //   link.href = "/Pushkaran_Tyagi_Scoring_Analysis_Report.pdf";
  //   link.download = "Pushkaran_Tyagi_Scoring_Analysis_Report.pdf";

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    //   <div className="bg-white shadow-lg rounded-lg p-10 max-w-md text-center">
    //     <Smile className="mx-auto h-20 w-20 text-blue-800 mb-6" />

    //     <h1 className="text-3xl font-bold text-blue-900 mb-3">
    //       Submission Successful!
    //     </h1>

    //     <p className="text-gray-600 mb-6">
    //       Thank you for submitting your test. Our team will reach out once you
    //       get shortlisted.
    //     </p>

    //     <button
    //       onClick={downloadReport}
    //       className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg p-3 transition duration-200 cursor-pointer"
    //     >
    //       <Download className="h-5 w-5 text-blue-700" />

    //       <span className="text-blue-800 font-medium">
    //         Your report is ready — Download Report
    //       </span>
    //     </button>
    //   </div>
    // </div>

     <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="bg-white border border-slate-200 rounded-2xl px-8 py-10">
                    <img src={CampusLogo} alt="eBench Campus" className="h-32 mx-auto mb-8" />

                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                    </div>

                    <h1 className="text-xl font-semibold text-slate-900 text-center">
                        Test submitted successfully
                    </h1>

                     <p className="text-slate-500 text-sm text-center mt-2 leading-relaxed">
                        Your responses have been recorded and sent to your admin for
                        evaluation. Thank you for completing the assessment.
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-slate-400 text-xs text-center mb-4">
                            If you have any questions about your results, reach out to your
                            admin or campus coordinator.
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    eBench Campus &middot; Assessment Platform
                </p>
            </div>
        </div>
  );
};

export default SuccessPage;