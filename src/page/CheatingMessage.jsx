import CampusLogo from "../assets/ebenchCampu.png";

export default function TestTerminated() { 
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl px-8 py-10">
          {/* <img src={CampusLogo} alt="eBench Campus" className="h-32 mx-auto mb-8" /> */}

          <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="h-7 w-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-slate-900 text-center">
            This test session has been terminated
          </h1>

          <p className="text-slate-500 text-sm text-center mt-2 leading-relaxed">
            We detected activity that violates the assessment's proctoring guidelines,
            such as switching tabs or leaving the test window. As a result, this session
            has been ended and cannot be resumed.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-slate-400 text-xs text-center mb-4">
              If you believe this was flagged in error, please contact your admin
              or campus coordinator to review your session.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          eBench Campus &middot; Assessment Platform
        </p>
      </div>
    </div>
  );
}