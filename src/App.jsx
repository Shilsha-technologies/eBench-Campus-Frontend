import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import ProtectedRoute from "./libs/ProtectedRoute";
import PageLoader from "./libs/PageLoader";
import AppErrorBoundary from "./libs/AppErrorBoundary";
import SubVendorLogin from "./page/subVendor/Login";
import DashboardHome from "./page/subVendor/DashboardHome";
import { onMessage } from "firebase/messaging";
import { messaging } from "./Firebase/Firebase";
import toast from "react-hot-toast";
import AdminForgetPassword from "./components/admin/AdminForgetPassword";
import { AuthProvider } from "./libs/AuthProvider";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { StudentProvider } from "./context/StudentContext";
// import StudentTestButton from "./components/test/StudentTestButton";

/* =========================
    Lazy Loaded Layout
========================= */
const DashboardLayout = lazy(() =>
  import("./components/ui/Layout/DashboardLayout")
);
const AdminDashboardLayout = lazy(() =>
  import("./components/ui/Layout/DashboardLayout").then(module => ({ default: module.AdminDashboardLayout }))
);

/* =========================
   Lazy Loaded Admin Pages
========================= */
const AdminDashboard = lazy(() => import("./page/AdminboardPage"));
const AdminSubscription = lazy(() => import("./page/AdminSubscription"));

const RoleManagement = lazy(() => import("./page/vendor/role/RoleManagement"))
const SubscriptionList = lazy(() =>
  import("./components/admin/SubscriptionList")
);
const AdminLoginPage = lazy(() => import("./components/admin/Login"));
const CampusManagement = lazy(() =>
  import("./components/admin/CampusManagement")
);
const CampusStudents = lazy(() =>
  import("./components/admin/CampusStudents")
);
const CampusDetail = lazy(() =>
  import("./components/admin/CampusDetail")
);
const CampusEmployees = lazy(() =>
  import("./components/admin/CampusEmployees")
);

/* =========================
   Lazy Loaded Vendor Pages
========================= */
const VendorDashboard = lazy(() => import("./page/vendor/VendorDashboard"));
const UserManagement = lazy(() =>
  import("./page/vendor/user/UserManagement")
);
const Subscription = lazy(() =>
  import("./page/vendor/subscription/Subscription")
);
const ViewSubscription = lazy(() =>
  import("./page/vendor/subscription/ViewSubscription")
);
const Profile = lazy(() => import("./page/vendor/Profile"));
const ResultManagement = lazy(() =>
  import("./page/vendor/result/ResultManagement")
);
const CandidateDetailsPage = lazy(() =>
  import("./page/vendor/user/CandidateDetailsPage")
);

/* =========================
   Lazy Loaded Public Pages
========================= */
const LandingPage = lazy(() => import("./page/LandingPage"));

const Login = lazy(() => import("./page/Login-Updated"));
const Signup = lazy(() => import("./page/Signup"));
const OtpVerification = lazy(() => import("./page/OtpVerification"));
// const IntroAnalysisApp = lazy(() => import("./page/REsult"));
const IntroAnalysisApp = lazy(() => import("./page/Result"));

const IntroAnalysis = lazy(() => import("./page/IntroductionResult"));
const RecordPage = lazy(() => import("./page/Record"));
const VendorForgotPassword = lazy(() =>
  import("./page/ForgotPassword")
);
const ResetPassword = lazy(() => import("./page/ResetPassword"));
const CheckoutPage = lazy(() => import("./libs/CheckoutPage"));
const Cancel = lazy(() => import("./libs/Cancel"));
const Success = lazy(() => import("./libs/PaymentSuccess"));
const SuccessPageTest = lazy(() => import("./page/TestSuccess"));
const ProcessingPayment = lazy(() =>
  import("./page/vendor/subscription/VerifyPayments")
);
const PaymentSuccess = lazy(() =>
  import("./page/vendor/subscription/PaymentSucessPage")
);
const PaymentFailed = lazy(() =>
  import("./page/vendor/subscription/PaymentFailed")
);
const Unauthorized = lazy(() => import("./libs/UnauthorizedPage"));
const NotFound = lazy(() => import("./page/NotFound"));
const SubvendorResetPassword = lazy(() => import("./page/subVendor/SubvendorResetPassword"));
const ViewSubVendorDetails = lazy(() => import('./page/vendor/role/ViewSubVendor'))

const DashboardSubVendorLayout = lazy(() => import('./components/subvendor/DashboardLayout/DashboardLayout'))
const ProfileSection=lazy(() =>import('./page/subVendor/SubVendorProfile'))

/* =========================
   Lazy Loaded Student Pages
========================= */
const StudentDashboardLayout = lazy(() => import('./components/student/DashboardLayout'));
const StudentDashboard = lazy(() => import('./page/student/Dashboard'));
const StudentRequestTest = lazy(() => import('./page/student/RequestTest'));
const StudentTestHistory = lazy(() => import('./page/student/TestHistory'));
const StudentResults = lazy(() => import('./page/student/Results'));
const StudentCredits = lazy(() => import('./page/student/Credits'));
const StudentProfile = lazy(() => import('./page/student/Profile'));
/* =========================
   App Component
========================= */ //110011
function App() {

  // const isAuthenticated = !!localStorage.getItem('token');
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      toast.custom(
        (t) => (
          <div
            className={`bg-[#6090e2] text-white shadow-xl rounded-lg p-4 w-[260px]
          transform transition-all duration-500
          ${t.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          >
            <p className="font-semibold text-sm">
              {payload?.notification?.title}
            </p>
            <p className="text-xs mt-1 opacity-90">
              {payload?.notification?.body}
            </p>
          </div>
        ),
        {
          position: "bottom-right",
          // duration: 4000,
        }
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* Development testing button - placed inside Router */}
        {/* <StudentTestButton /> */}
        <AppErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>

            {/* ===== Public Routes (Outside AuthProvider) ===== */}
            <Route
              path="/login"
              element={
                  <Login />
              }
            />
             <Route
              path="/"
              element={
                  <LandingPage />
              }
            />
            <Route path="/res" element={<IntroAnalysis />} />
            <Route path="/admin/forget-password" element={<AdminForgetPassword />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/vendor-signup" element={<Signup />} />
            <Route path="/otp-verify" element={<OtpVerification />} />
            <Route path="/admin/otp-verify" element={<OtpVerification />} />
            <Route
              path="/candidate/start_test"
              element={<IntroAnalysisApp />}
            />
            <Route path="/admin-reset-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/test-success" element={<SuccessPageTest />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/payment/cancel" element={<Cancel />} />
            <Route path="/checkout-page" element={<CheckoutPage />} />
            <Route
              path="/verify-payments"
              element={<ProcessingPayment />}
            />
            <Route
              path="/payment-success"
              element={<PaymentSuccess />}
            />
            <Route
              path="/forgot-password"
              element={<VendorForgotPassword />}
            />
            <Route
              path="/payment-failed"
              element={<PaymentFailed />}
            />
            <Route path="/employee/login" element={<SubVendorLogin />} />
            <Route path="/reset-password/subvendor" element={<SubvendorResetPassword />} />

            {/* ===== Protected Routes (Inside AuthProvider) ===== */}
            <Route
              path="/*"
              element={
                <AuthProvider>
                  <Routes>
                    {/* ===== Admin Routes ===== */}
                    <Route
                      path="/admin/*"
                      element={
                        <AppErrorBoundary>
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboardLayout />
                          </ProtectedRoute>
                        </AppErrorBoundary>
                      }
                    >
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route
                        path="subscription/user"
                        element={<AdminSubscription />}
                      />
                      <Route
                        path="subscription/list"
                        element={<SubscriptionList />}
                      />
                      
                      <Route
                        path="campus-management"
                        element={<CampusManagement />}
                      />
                      <Route
                        path="campus-management/:campusId"
                        element={<CampusDetail />}
                      />
                      <Route
                        path="campus/:campusId/students"
                        element={<CampusStudents />}
                      />
                      <Route
                        path="campus/:campusId/employees"
                        element={<CampusEmployees />}
                      />
                    </Route>

                    {/* ===== Vendor Routes ===== */}
                    <Route
                      path="/vendor/*"
                      element={
                        <AppErrorBoundary>
                          <ProtectedRoute allowedRoles={["vendor"]}>
                            <DashboardLayout />
                          </ProtectedRoute>
                        </AppErrorBoundary>
                      }
                    >
                      <Route path="dashboard" element={<VendorDashboard />} />
                      <Route
                        path="candidates"
                        element={<UserManagement />}
                      />
                      <Route path="employee" element={<RoleManagement />} />
                      <Route
                        path="subscription/plan"
                        element={<Subscription />}
                      />
                      <Route
                        path="subscription/view"
                        element={<ViewSubscription />}
                      />
                      <Route path="profile" element={<Profile />} />
                      <Route
                        path="results"
                        element={<ResultManagement />}
                      />
                      <Route
                        path="results/view"
                        element={<IntroAnalysis />}
                      />
                      <Route
                        path="candidates/:candidateId"
                        element={<CandidateDetailsPage />}
                      />
                      <Route path="employee/view" element={<ViewSubVendorDetails />} />
                    </Route>

                    {/* ===== Sub Vendor Routes ===== */}
                    <Route
                      path="/subvendor/*"
                      element={
                        <AppErrorBoundary>
                          <ProtectedRoute allowedRoles={["sub_vendor"]}>
                            <DashboardSubVendorLayout />
                          </ProtectedRoute>
                        </AppErrorBoundary>
                      }
                    >
                      <Route path="dashboard" element={<DashboardHome />} />
                      <Route path="user-management" element={<UserManagement />} />
                      <Route
                        path="result-management"
                        element={<ResultManagement />}
                      />
                      <Route
                        path="result-management/view"
                        element={<IntroAnalysis />}
                      />
                      <Route
                        path="user-management/:candidateId"
                        element={<CandidateDetailsPage />}
                      />
                      <Route
                        path="profile"
                        element={<ProfileSection />}
                      />
                    </Route>

                    {/* ===== Student Routes ===== */}
                    <Route
                      path="/student/*"
                      element={
                        <AppErrorBoundary>
                          <ProtectedRoute allowedRoles={["student"]}>
                            <StudentProvider>
                              <StudentDashboardLayout />
                            </StudentProvider>
                          </ProtectedRoute>
                        </AppErrorBoundary>
                      }
                    >
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="request" element={<StudentRequestTest />} />
                      <Route path="history" element={<StudentTestHistory />} />
                      <Route path="results" element={<StudentResults />} />
                      <Route path="credits" element={<StudentCredits />} />
                      <Route path="profile" element={<StudentProfile />} />
                    </Route>
                  </Routes>
                </AuthProvider>
              }
            />

            {/* ===== Fallback Routes ===== */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </AppErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

//================  x  =========================== x ==============


/**
 * Campus Management System
 * Full-featured dashboard for campus heads to manage students for internships & jobs
 * 
 * Architecture:
 * - React functional components + hooks
 * - Context API for global state
 * - Simulated routing via state
 * - Tailwind CSS for styling
 * - Mock data (no backend)
 */

// import { createContext, useContext } from "react";

// // ─────────────────────────────────────────────
// // MOCK DATA
// // ─────────────────────────────────────────────
// const MOCK_CANDIDATES = [
//   { id: 1, name: "Arjun Sharma", email: "arjun.s@college.edu", phone: "9876543210", branch: "CSE", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 87, testDate: "2024-03-10" },
//   { id: 2, name: "Priya Mehta", email: "priya.m@college.edu", phone: "9812345678", branch: "ECE", year: "4th", status: "active", testSent: true, testCompleted: false, score: null, testDate: "2024-03-11" },
//   { id: 3, name: "Rohit Kumar", email: "rohit.k@college.edu", phone: "9823456789", branch: "ME", year: "3rd", status: "inactive", testSent: false, testCompleted: false, score: null, testDate: null },
//   { id: 4, name: "Sneha Patel", email: "sneha.p@college.edu", phone: "9834567890", branch: "CSE", year: "4th", status: "active", testSent: true, testCompleted: true, score: 72, testDate: "2024-03-09" },
//   { id: 5, name: "Vikram Singh", email: "vikram.s@college.edu", phone: "9845678901", branch: "IT", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 93, testDate: "2024-03-08" },
//   { id: 6, name: "Anjali Nair", email: "anjali.n@college.edu", phone: "9856789012", branch: "CSE", year: "4th", status: "active", testSent: false, testCompleted: false, score: null, testDate: null },
//   { id: 7, name: "Rahul Gupta", email: "rahul.g@college.edu", phone: "9867890123", branch: "EEE", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 58, testDate: "2024-03-07" },
//   { id: 8, name: "Meera Iyer", email: "meera.i@college.edu", phone: "9878901234", branch: "CSE", year: "2nd", status: "inactive", testSent: false, testCompleted: false, score: null, testDate: null },
// ];

// const MOCK_EMPLOYEES = [
//   { id: 1, name: "Dr. Suresh Verma", email: "suresh.v@college.edu", phone: "9700000001", role: "Placement Officer", department: "Training & Placement", status: "active", joinDate: "2020-06-01" },
//   { id: 2, name: "Ms. Kavita Rao", email: "kavita.r@college.edu", phone: "9700000002", role: "Coordinator", department: "Training & Placement", status: "active", joinDate: "2021-03-15" },
//   { id: 3, name: "Mr. Anil Desai", email: "anil.d@college.edu", phone: "9700000003", role: "Admin", department: "Administration", status: "active", joinDate: "2019-08-10" },
// ];

// const INITIAL_PROFILE = {
//   campusName: "",
//   university: "",
//   address: "",
//   city: "",
//   state: "",
//   pincode: "",
//   contactEmail: "",
//   contactPhone: "",
//   website: "",
//   established: "",
//   totalStudents: "",
//   logo: null,
// };

// const PLANS = [
//   { id: "starter", name: "Starter", credits: 500, price: 999, features: ["500 test credits", "Basic analytics", "Email support", "1 admin user"] },
//   { id: "professional", name: "Professional", credits: 2000, price: 2999, features: ["2000 test credits", "Advanced analytics", "Priority support", "5 admin users", "Custom branding"] },
//   { id: "enterprise", name: "Enterprise", credits: 10000, price: 7999, features: ["10000 test credits", "Full analytics suite", "Dedicated support", "Unlimited users", "API access", "White labeling"] },
// ];

// const RECENT_ACTIVITY = [
//   { id: 1, text: "Test link sent to Arjun Sharma", time: "2 hours ago", type: "test" },
//   { id: 2, text: "Priya Mehta added as new candidate", time: "4 hours ago", type: "candidate" },
//   { id: 3, text: "Vikram Singh completed test (Score: 93)", time: "Yesterday", type: "result" },
//   { id: 4, text: "Sneha Patel completed test (Score: 72)", time: "Yesterday", type: "result" },
//   { id: 5, text: "50 credits purchased (Professional plan)", time: "2 days ago", type: "credit" },
// ];

// // ─────────────────────────────────────────────
// // CONTEXT
// // ─────────────────────────────────────────────
// const AppContext = createContext(null);

// function AppProvider({ children }) {
//   const [currentPage, setCurrentPage] = useState("dashboard");
//   const [profile, setProfile] = useState(INITIAL_PROFILE);
//   const [profileCompletion, setProfileCompletion] = useState(100);
//   const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
//   const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
//   const [credits, setCredits] = useState(500);
//   const [currentPlan, setCurrentPlan] = useState("starter");
//   const [toasts, setToasts] = useState([]);

//   // Calculate profile completion
//   useEffect(() => {
//     const fields = Object.values(profile);
//     const filled = fields.filter(v => v && String(v).trim() !== "").length;
//     // setProfileCompletion(Math.round((filled / fields.length) * 100));
//   }, [profile]);

//   const navigate = useCallback((page) => {
//     if (page !== "profile" && profileCompletion < 100) {
//       addToast("Complete your campus profile to access all features.", "warning");
//       setCurrentPage("profile");
//       return;
//     }
//     setCurrentPage(page);
//   }, [profileCompletion]);

//   const addToast = useCallback((message, type = "success") => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, message, type }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
//   }, []);

//   const removeToast = useCallback((id) => {
//     setToasts(prev => prev.filter(t => t.id !== id));
//   }, []);

//   const sendTestLink = useCallback((candidateId) => {
//     if (credits <= 0) {
//       addToast("Insufficient credits. Please purchase a plan.", "error");
//       return false;
//     }
//     setCandidates(prev => prev.map(c =>
//       c.id === candidateId ? { ...c, testSent: true, testDate: new Date().toISOString().split("T")[0] } : c
//     ));
//     setCredits(prev => prev - 1);
//     addToast("Test link sent successfully!", "success");
//     return true;
//   }, [credits, addToast]);

//   const value = {
//     currentPage, setCurrentPage, navigate,
//     profile, setProfile, profileCompletion,
//     candidates, setCandidates,
//     employees, setEmployees,
//     credits, setCredits, currentPlan, setCurrentPlan,
//     toasts, addToast, removeToast,
//     sendTestLink,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// }

// const useApp = () => useContext(AppContext);

// // ─────────────────────────────────────────────
// // UTILITY COMPONENTS
// // ─────────────────────────────────────────────

// /** Toast notification */
// function ToastContainer() {
//   const { toasts, removeToast } = useApp();
//   const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };
//   const colors = {
//     success: "bg-emerald-50 border-emerald-200 text-emerald-800",
//     error: "bg-red-50 border-red-200 text-red-800",
//     warning: "bg-amber-50 border-amber-200 text-amber-800",
//     info: "bg-blue-50 border-blue-200 text-blue-800",
//   };
//   if (!toasts.length) return null;
//   return (
//     <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
//       {toasts.map(t => (
//         <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium min-w-[280px] max-w-xs animate-fade-in ${colors[t.type] || colors.info}`}>
//           <span className="text-base">{icons[t.type]}</span>
//           <span className="flex-1">{t.message}</span>
//           <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// /** Modal component */
// function Modal({ isOpen, onClose, title, children, size = "md" }) {
//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, [isOpen]);
//   if (!isOpen) return null;
//   const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
//         onClick={e => e.stopPropagation()}>
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
//           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-xl">×</button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// }

// /** Reusable Table */
// function Table({ columns, data, emptyMessage = "No data found" }) {
//   if (!data.length) return (
//     <div className="text-center py-16 text-gray-400">
//       <div className="text-5xl mb-3">📭</div>
//       <p className="font-medium">{emptyMessage}</p>
//     </div>
//   );
//   return (
//     <div className="overflow-x-auto rounded-xl border border-gray-100">
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="bg-gray-50 border-b border-gray-100">
//             {columns.map(col => (
//               <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, i) => (
//             <tr key={row.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
//               {columns.map(col => (
//                 <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
//                   {col.render ? col.render(row[col.key], row) : row[col.key] ?? "—"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /** Input field */
// function Input({ label, required, error, className = "", ...props }) {
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       {label && <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
//       <input className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-all ${error ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"}`} {...props} />
//       {error && <p className="text-xs text-red-500">{error}</p>}
//     </div>
//   );
// }

// /** Select field */
// function Select({ label, required, options, error, className = "", ...props }) {
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       {label && <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
//       <select className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-all bg-white ${error ? "border-red-300" : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"}`} {...props}>
//         {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//       </select>
//       {error && <p className="text-xs text-red-500">{error}</p>}
//     </div>
//   );
// }

// /** Stat card */
// function StatCard({ label, value, icon, color = "indigo", change }) {
//   const colors = {
//     indigo: "bg-indigo-50 text-indigo-600",
//     emerald: "bg-emerald-50 text-emerald-600",
//     amber: "bg-amber-50 text-amber-600",
//     rose: "bg-rose-50 text-rose-600",
//     blue: "bg-blue-50 text-blue-600",
//   };
//   return (
//     <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-3">
//         <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>{icon}</div>
//         {change !== undefined && (
//           <span className={`text-xs font-medium px-2 py-1 rounded-full ${change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
//             {change >= 0 ? "+" : ""}{change}%
//           </span>
//         )}
//       </div>
//       <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
//       <div className="text-sm text-gray-500">{label}</div>
//     </div>
//   );
// }

// /** Badge */
// function Badge({ children, variant = "gray" }) {
//   const variants = {
//     gray: "bg-gray-100 text-gray-700",
//     green: "bg-emerald-50 text-emerald-700",
//     red: "bg-red-50 text-red-700",
//     blue: "bg-blue-50 text-blue-700",
//     amber: "bg-amber-50 text-amber-700",
//     indigo: "bg-indigo-50 text-indigo-700",
//   };
//   return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
// }

// /** Progress bar */
// function ProgressBar({ value, label, color = "indigo", showLabel = true }) {
//   const colors = { indigo: "bg-indigo-500", emerald: "bg-emerald-500", amber: "bg-amber-500", rose: "bg-rose-500" };
//   return (
//     <div className="w-full">
//       {showLabel && <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{label}</span><span className="font-semibold text-gray-800">{value}%</span></div>}
//       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//         <div className={`h-full rounded-full transition-all duration-700 ${colors[color]}`} style={{ width: `${value}%` }} />
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // SIDEBAR
// // ─────────────────────────────────────────────
// function Sidebar({ isOpen, onClose }) {
//   const { currentPage, navigate, profileCompletion, credits } = useApp();

//   const navItems = [
//     { id: "dashboard", label: "Dashboard", icon: "⊞", emoji: true },
//     { id: "candidates", label: "Candidates", icon: "👥", emoji: true },
//     { id: "results", label: "Test & Results", icon: "📋", emoji: true },
//     { id: "subscription", label: "Subscription", icon: "💳", emoji: true },
//     { id: "employees", label: "Employees", icon: "🧑‍💼", emoji: true },
//     { id: "profile", label: "Campus Profile", icon: "🏛", emoji: true },
//   ];

//   const handleNav = (id) => {
//     navigate(id);
//     onClose?.();
//   };

//   return (
//     <>
//       {isOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
//       <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">CMS</div>
//             <div>
//               <div className="font-bold text-gray-900 text-sm leading-tight">Campus Manager</div>
//               <div className="text-xs text-gray-400">Placement Portal</div>
//             </div>
//           </div>
//         </div>

//         {/* Profile warning */}
//         {profileCompletion < 100 && (
//           <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer" onClick={() => handleNav("profile")}>
//             <div className="flex items-center gap-2 mb-2">
//               <span className="text-amber-500 text-sm">⚠</span>
//               <span className="text-xs font-semibold text-amber-800">Profile Incomplete</span>
//             </div>
//             <ProgressBar value={profileCompletion} color="amber" showLabel={false} />
//             <p className="text-xs text-amber-700 mt-1.5">{profileCompletion}% complete — finish to unlock all features</p>
//           </div>
//         )}

//         {/* Navigation */}
//         <nav className="flex-1 p-4 space-y-1 mt-2">
//           {navItems.map(item => {
//             const isActive = currentPage === item.id;
//             const isLocked = item.id !== "profile" && profileCompletion < 100;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNav(item.id)}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"} ${isLocked ? "opacity-50" : ""}`}
//               >
//                 <span className="text-base w-5 text-center">{item.icon}</span>
//                 <span className="flex-1">{item.label}</span>
//                 {isLocked && <span className="text-xs opacity-70">🔒</span>}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Credits */}
//         <div className="p-4 border-t border-gray-100">
//           <div className="bg-indigo-50 rounded-xl p-3">
//             <div className="flex justify-between items-center mb-1.5">
//               <span className="text-xs font-semibold text-indigo-700">Credits Remaining</span>
//               <span className="text-xs text-indigo-500">💳</span>
//             </div>
//             <div className="text-2xl font-bold text-indigo-800">{credits.toLocaleString()}</div>
//             <div className="mt-2 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
//               <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (credits / 500) * 100)}%` }} />
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// // ─────────────────────────────────────────────
// // HEADER
// // ─────────────────────────────────────────────
// function Header({ onMenuToggle }) {
//   const { navigate, profile } = useApp();
//   return (
//     <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
//       <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">☰</button>
//       <div className="flex-1">
//         <h1 className="text-base font-semibold text-gray-900 hidden sm:block">Campus Management System</h1>
//       </div>
//       <div className="flex items-center gap-3">
//         <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">
//           🔔
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
//         </button>
//         <button onClick={() => navigate("profile")} className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
//             {(profile.campusName || "CA").slice(0, 2).toUpperCase()}
//           </div>
//           <div className="hidden sm:block text-left">
//             <div className="text-xs font-semibold text-gray-800">{profile.campusName || "Campus Admin"}</div>
//             <div className="text-xs text-gray-400">Head of Placement</div>
//           </div>
//         </button>
//       </div>
//     </header>
//   );
// }

// // ─────────────────────────────────────────────
// // PAGE: DASHBOARD
// // ─────────────────────────────────────────────
// function DashboardPage() {
//   const { candidates, credits, navigate } = useApp();

//   const totalCandidates = candidates.length;
//   const testsSent = candidates.filter(c => c.testSent).length;
//   const testsCompleted = candidates.filter(c => c.testCompleted).length;
//   const activeCandidates = candidates.filter(c => c.status === "active").length;

//   const avgScore = candidates.filter(c => c.score).reduce((a, c, _, arr) => a + c.score / arr.length, 0).toFixed(0);
//   const passRate = candidates.filter(c => c.score).length
//     ? Math.round((candidates.filter(c => c.score >= 60).length / candidates.filter(c => c.score).length) * 100)
//     : 0;

//   const activityIcons = { test: "📤", candidate: "👤", result: "📊", credit: "💳" };

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div>
//         <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
//         <p className="text-sm text-gray-500 mt-0.5">Overview of your campus placement activities</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Total Candidates" value={totalCandidates} icon="👥" color="indigo" change={12} />
//         <StatCard label="Tests Sent" value={testsSent} icon="📤" color="blue" change={8} />
//         <StatCard label="Tests Completed" value={testsCompleted} icon="✅" color="emerald" change={5} />
//         <StatCard label="Remaining Credits" value={credits.toLocaleString()} icon="💳" color="amber" />
//       </div>

//       {/* Secondary stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//           <div className="text-sm text-gray-500 mb-1">Active Candidates</div>
//           <div className="text-2xl font-bold text-gray-900">{activeCandidates}</div>
//           <ProgressBar value={Math.round((activeCandidates / totalCandidates) * 100)} showLabel={false} color="indigo" />
//           <div className="text-xs text-gray-400 mt-1">{Math.round((activeCandidates / totalCandidates) * 100)}% of total</div>
//         </div>
//         <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//           <div className="text-sm text-gray-500 mb-1">Average Score</div>
//           <div className="text-2xl font-bold text-gray-900">{avgScore || "—"}</div>
//           <ProgressBar value={Number(avgScore) || 0} showLabel={false} color="emerald" />
//           <div className="text-xs text-gray-400 mt-1">Out of 100</div>
//         </div>
//         <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//           <div className="text-sm text-gray-500 mb-1">Pass Rate</div>
//           <div className="text-2xl font-bold text-gray-900">{passRate}%</div>
//           <ProgressBar value={passRate} showLabel={false} color={passRate >= 60 ? "emerald" : "amber"} />
//           <div className="text-xs text-gray-400 mt-1">Minimum score: 60</div>
//         </div>
//       </div>

//       {/* Bottom row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent activity */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
//           <div className="flex items-center justify-between p-5 border-b border-gray-100">
//             <h3 className="font-semibold text-gray-900">Recent Activity</h3>
//             <span className="text-xs text-gray-400">Last 7 days</span>
//           </div>
//           <div className="divide-y divide-gray-50">
//             {RECENT_ACTIVITY.map(a => (
//               <div key={a.id} className="flex items-start gap-3 p-4">
//                 <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{activityIcons[a.type]}</div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm text-gray-700">{a.text}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick actions */}
//         <div className="space-y-4">
//           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
//             <div className="text-3xl mb-2">🎯</div>
//             <h3 className="font-bold text-lg">Quick Actions</h3>
//             <p className="text-indigo-100 text-sm mt-1 mb-4">Manage candidates and tests efficiently</p>
//             <div className="grid grid-cols-2 gap-3">
//               <button onClick={() => navigate("candidates")} className="bg-white/20 hover:bg-white/30 rounded-xl py-2.5 text-sm font-medium transition-colors">+ Add Candidate</button>
//               <button onClick={() => navigate("results")} className="bg-white/20 hover:bg-white/30 rounded-xl py-2.5 text-sm font-medium transition-colors">View Results</button>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//             <h3 className="font-semibold text-gray-900 mb-3">Test Completion Rate</h3>
//             <div className="space-y-3">
//               <ProgressBar label="Tests Sent" value={Math.round((testsSent / totalCandidates) * 100)} color="indigo" />
//               <ProgressBar label="Tests Completed" value={Math.round((testsCompleted / totalCandidates) * 100)} color="emerald" />
//               <ProgressBar label="Pending Tests" value={Math.round(((testsSent - testsCompleted) / totalCandidates) * 100)} color="amber" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // PAGE: CANDIDATES
// // ─────────────────────────────────────────────
// function CandidatesPage() {
//   const { candidates, setCandidates, sendTestLink, addToast } = useApp();
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterBranch, setFilterBranch] = useState("all");
//   const [showModal, setShowModal] = useState(false);
//   const [editCandidate, setEditCandidate] = useState(null);
//   const [form, setForm] = useState({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
//   const [errors, setErrors] = useState({});

//   const branches = [...new Set(candidates.map(c => c.branch))];

//   const filtered = candidates.filter(c => {
//     const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
//     const matchStatus = filterStatus === "all" || c.status === filterStatus;
//     const matchBranch = filterBranch === "all" || c.branch === filterBranch;
//     return matchSearch && matchStatus && matchBranch;
//   });

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
//     if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = "Valid 10-digit phone required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;
//     if (editCandidate) {
//       setCandidates(prev => prev.map(c => c.id === editCandidate.id ? { ...c, ...form } : c));
//       addToast("Candidate updated successfully!");
//     } else {
//       const newC = { id: Date.now(), ...form, status: "active", testSent: false, testCompleted: false, score: null, testDate: null };
//       setCandidates(prev => [...prev, newC]);
//       addToast("Candidate added successfully!");
//     }
//     setShowModal(false);
//     setEditCandidate(null);
//     setForm({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
//     setErrors({});
//   };

//   const toggleStatus = (id) => {
//     setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
//     addToast("Candidate status updated.");
//   };

//   const openEdit = (c) => {
//     setEditCandidate(c);
//     setForm({ name: c.name, email: c.email, phone: c.phone, branch: c.branch, year: c.year });
//     setErrors({});
//     setShowModal(true);
//   };

//   const openAdd = () => {
//     setEditCandidate(null);
//     setForm({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
//     setErrors({});
//     setShowModal(true);
//   };

//   const columns = [
//     {
//       key: "name", label: "Name", render: (v, row) => (
//         <div>
//           <div className="font-medium text-gray-900">{v}</div>
//           <div className="text-xs text-gray-400">{row.email}</div>
//         </div>
//       )
//     },
//     { key: "branch", label: "Branch" },
//     { key: "year", label: "Year" },
//     { key: "status", label: "Status", render: v => <Badge variant={v === "active" ? "green" : "red"}>{v}</Badge> },
//     {
//       key: "testSent", label: "Test", render: (v, row) => (
//         <div className="flex items-center gap-2">
//           {v ? <Badge variant={row.testCompleted ? "green" : "amber"}>{row.testCompleted ? "Completed" : "Pending"}</Badge> : <Badge variant="gray">Not Sent</Badge>}
//         </div>
//       )
//     },
//     {
//       key: "score", label: "Score", render: v => v != null ? (
//         <span className={`font-semibold ${v >= 60 ? "text-emerald-600" : "text-red-600"}`}>{v}</span>
//       ) : "—"
//     },
//     {
//       key: "actions", label: "Actions", render: (_, row) => (
//         <div className="flex items-center gap-2">
//           {!row.testSent && (
//             <button onClick={() => sendTestLink(row.id)} className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-medium transition-colors">Send Test</button>
//           )}
//           <button onClick={() => openEdit(row)} className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-2.5 py-1 rounded-lg font-medium transition-colors">Edit</button>
//           <button onClick={() => toggleStatus(row.id)} className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${row.status === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
//             {row.status === "active" ? "Deactivate" : "Activate"}
//           </button>
//         </div>
//       )
//     },
//   ];

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Candidates</h2>
//           <p className="text-sm text-gray-500 mt-0.5">{candidates.length} total candidates registered</p>
//         </div>
//         <button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200 flex items-center gap-2">
//           <span>+</span> Add Candidate
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
//         <div className="flex-1 min-w-48">
//           <input
//             placeholder="🔍  Search by name or email..."
//             value={search} onChange={e => setSearch(e.target.value)}
//             className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
//           />
//         </div>
//         <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
//           className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white">
//           <option value="all">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//         <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
//           className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white">
//           <option value="all">All Branches</option>
//           {branches.map(b => <option key={b} value={b}>{b}</option>)}
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
//         <Table columns={columns} data={filtered} emptyMessage="No candidates match your search" />
//       </div>

//       {/* Add/Edit Modal */}
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCandidate ? "Edit Candidate" : "Add New Candidate"}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Input label="Full Name" required placeholder="Arjun Sharma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} className="sm:col-span-2" />
//           <Input label="Email Address" required type="email" placeholder="arjun@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} />
//           <Input label="Phone Number" required placeholder="9876543210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} error={errors.phone} />
//           <Select label="Branch" required value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))}
//             options={["CSE", "ECE", "ME", "EEE", "IT", "CIVIL", "MBA"].map(b => ({ value: b, label: b }))} />
//           <Select label="Year" required value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
//             options={["1st", "2nd", "3rd", "4th"].map(y => ({ value: y, label: `${y} Year` }))} />
//         </div>
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
//           <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200">
//             {editCandidate ? "Update" : "Add Candidate"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // PAGE: TEST & RESULTS
// // ─────────────────────────────────────────────
// function ResultsPage() {
//   const { candidates } = useApp();
//   const [filter, setFilter] = useState("all");
//   const [selectedResult, setSelectedResult] = useState(null);

//   const withTests = candidates.filter(c => c.testSent);
//   const filtered = filter === "all" ? withTests
//     : filter === "completed" ? withTests.filter(c => c.testCompleted)
//       : filter === "pending" ? withTests.filter(c => !c.testCompleted)
//         : filter === "passed" ? withTests.filter(c => c.score >= 60)
//           : withTests.filter(c => c.score != null && c.score < 60);

//   const stats = {
//     sent: candidates.filter(c => c.testSent).length,
//     completed: candidates.filter(c => c.testCompleted).length,
//     passed: candidates.filter(c => c.score >= 60).length,
//     failed: candidates.filter(c => c.score != null && c.score < 60).length,
//     avgScore: candidates.filter(c => c.score).length
//       ? Math.round(candidates.filter(c => c.score).reduce((a, c) => a + c.score, 0) / candidates.filter(c => c.score).length)
//       : 0,
//   };

//   const columns = [
//     {
//       key: "name", label: "Candidate", render: (v, row) => (
//         <div>
//           <div className="font-medium text-gray-900">{v}</div>
//           <div className="text-xs text-gray-400">{row.branch} • {row.year} Year</div>
//         </div>
//       )
//     },
//     { key: "testDate", label: "Sent On", render: v => v ? new Date(v).toLocaleDateString("en-IN") : "—" },
//     {
//       key: "testCompleted", label: "Status", render: (v, row) => (
//         !v ? <Badge variant="amber">Pending</Badge>
//           : row.score >= 60 ? <Badge variant="green">Passed</Badge>
//             : <Badge variant="red">Failed</Badge>
//       )
//     },
//     {
//       key: "score", label: "Score", render: v => v != null ? (
//         <div className="flex items-center gap-2">
//           <div className="flex-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
//             <div className={`h-full rounded-full ${v >= 60 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${v}%` }} />
//           </div>
//           <span className={`text-sm font-bold ${v >= 60 ? "text-emerald-600" : "text-red-600"}`}>{v}</span>
//         </div>
//       ) : "—"
//     },
//     {
//       key: "actions", label: "", render: (_, row) => row.testCompleted ? (
//         <button onClick={() => setSelectedResult(row)} className="text-xs text-indigo-600 hover:underline font-medium">View Details</button>
//       ) : null
//     },
//   ];

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div>
//         <h2 className="text-xl font-bold text-gray-900">Test & Results</h2>
//         <p className="text-sm text-gray-500 mt-0.5">Monitor test attempts, scores and analytics</p>
//       </div>

//       {/* Analytics cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
//         <StatCard label="Tests Sent" value={stats.sent} icon="📤" color="blue" />
//         <StatCard label="Completed" value={stats.completed} icon="✅" color="emerald" />
//         <StatCard label="Passed" value={stats.passed} icon="🏆" color="emerald" />
//         <StatCard label="Failed" value={stats.failed} icon="❌" color="rose" />
//         <StatCard label="Avg Score" value={`${stats.avgScore}/100`} icon="📊" color="indigo" />
//       </div>

//       {/* Pass/Fail bar */}
//       {stats.completed > 0 && (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//           <h3 className="font-semibold text-gray-900 mb-4">Score Distribution</h3>
//           <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
//             <div className="bg-emerald-400 flex items-center justify-center text-white text-xs font-medium transition-all" style={{ width: `${(stats.passed / stats.completed) * 100}%` }}>
//               {stats.passed > 0 && `${stats.passed} Passed`}
//             </div>
//             <div className="bg-red-400 flex items-center justify-center text-white text-xs font-medium transition-all" style={{ width: `${(stats.failed / stats.completed) * 100}%` }}>
//               {stats.failed > 0 && `${stats.failed} Failed`}
//             </div>
//           </div>
//           <div className="flex justify-between mt-2 text-xs text-gray-500">
//             <span>Pass rate: {Math.round((stats.passed / stats.completed) * 100)}%</span>
//             <span>Fail rate: {Math.round((stats.failed / stats.completed) * 100)}%</span>
//           </div>
//         </div>
//       )}

//       {/* Filter + Table */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
//         <div className="p-4 border-b border-gray-100 flex gap-2 flex-wrap">
//           {["all", "completed", "pending", "passed", "failed"].map(f => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
//               {f}
//             </button>
//           ))}
//         </div>
//         <Table columns={columns} data={filtered} emptyMessage="No results found" />
//       </div>

//       {/* Result Detail Modal */}
//       <Modal isOpen={!!selectedResult} onClose={() => setSelectedResult(null)} title="Result Details" size="sm">
//         {selectedResult && (
//           <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
//                 {selectedResult.score >= 60 ? "🏆" : "📉"}
//               </div>
//               <div>
//                 <div className="font-bold text-gray-900 text-lg">{selectedResult.name}</div>
//                 <div className="text-sm text-gray-500">{selectedResult.branch} • {selectedResult.year} Year</div>
//               </div>
//             </div>
//             <div className="bg-gray-50 rounded-xl p-4 space-y-3">
//               <div className="flex justify-between"><span className="text-sm text-gray-500">Score</span><span className={`font-bold text-lg ${selectedResult.score >= 60 ? "text-emerald-600" : "text-red-600"}`}>{selectedResult.score}/100</span></div>
//               <div className="flex justify-between"><span className="text-sm text-gray-500">Status</span><Badge variant={selectedResult.score >= 60 ? "green" : "red"}>{selectedResult.score >= 60 ? "Passed" : "Failed"}</Badge></div>
//               <div className="flex justify-between"><span className="text-sm text-gray-500">Test Date</span><span className="text-sm font-medium">{new Date(selectedResult.testDate).toLocaleDateString("en-IN")}</span></div>
//               <div className="flex justify-between"><span className="text-sm text-gray-500">Email</span><span className="text-sm text-gray-700">{selectedResult.email}</span></div>
//             </div>
//             <ProgressBar label="Score" value={selectedResult.score} color={selectedResult.score >= 60 ? "emerald" : "rose"} />
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // PAGE: SUBSCRIPTION
// // ─────────────────────────────────────────────
// function SubscriptionPage() {
//   const { credits, setCredits, currentPlan, setCurrentPlan, addToast } = useApp();
//   const [showPurchaseModal, setShowPurchaseModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const current = PLANS.find(p => p.id === currentPlan);

//   const handlePurchase = () => {
//     if (!selectedPlan) return;
//     const plan = PLANS.find(p => p.id === selectedPlan);
//     setCredits(prev => prev + plan.credits);
//     setCurrentPlan(selectedPlan);
//     setShowPurchaseModal(false);
//     addToast(`${plan.name} plan activated! ${plan.credits} credits added.`, "success");
//   };

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div>
//         <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
//         <p className="text-sm text-gray-500 mt-0.5">Manage your plan and test credits</p>
//       </div>

//       {/* Current plan summary */}
//       <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
//         <div className="flex items-start justify-between mb-4">
//           <div>
//             <div className="text-indigo-200 text-sm mb-1">Current Plan</div>
//             <div className="text-2xl font-bold">{current?.name} Plan</div>
//           </div>
//           <div className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-semibold">Active</div>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           <div className="bg-white/10 rounded-xl p-3">
//             <div className="text-indigo-200 text-xs mb-1">Credits Remaining</div>
//             <div className="text-2xl font-bold">{credits.toLocaleString()}</div>
//           </div>
//           <div className="bg-white/10 rounded-xl p-3">
//             <div className="text-indigo-200 text-xs mb-1">Plan Credits</div>
//             <div className="text-2xl font-bold">{current?.credits.toLocaleString()}</div>
//           </div>
//         </div>
//         <div className="mt-4">
//           <div className="flex justify-between text-indigo-200 text-xs mb-1">
//             <span>Credit usage</span>
//             <span>{Math.round(((current?.credits - credits) / current?.credits) * 100)}% used</span>
//           </div>
//           <div className="h-2 bg-white/20 rounded-full overflow-hidden">
//             <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.max(0, (credits / current?.credits) * 100)}%` }} />
//           </div>
//         </div>
//       </div>

//       {/* Credit usage note */}
//       <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
//         <span className="text-amber-500 text-lg">ℹ</span>
//         <div>
//           <div className="font-semibold text-amber-800 text-sm">How credits work</div>
//           <div className="text-amber-700 text-sm mt-0.5">Each test link sent to a candidate deducts 1 credit from your balance. Purchase a plan to top up your credits.</div>
//         </div>
//       </div>

//       {/* Plans */}
//       <div>
//         <h3 className="font-semibold text-gray-900 mb-4">Available Plans</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {PLANS.map(plan => (
//             <div key={plan.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${currentPlan === plan.id ? "border-indigo-500 shadow-lg shadow-indigo-100" : "border-gray-100 hover:border-gray-200"}`}>
//               {currentPlan === plan.id && (
//                 <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">Current Plan</div>
//               )}
//               <h4 className="font-bold text-gray-900 text-lg">{plan.name}</h4>
//               <div className="text-3xl font-bold text-gray-900 mt-2">₹{plan.price.toLocaleString()}</div>
//               <div className="text-gray-500 text-sm">{plan.credits.toLocaleString()} credits</div>
//               <ul className="mt-4 space-y-2">
//                 {plan.features.map((f, i) => (
//                   <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
//                     <span className="text-emerald-500 font-bold text-base">✓</span>
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 onClick={() => { setSelectedPlan(plan.id); setShowPurchaseModal(true); }}
//                 className={`w-full mt-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${currentPlan === plan.id ? "bg-gray-100 text-gray-500 cursor-default" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"}`}
//                 disabled={currentPlan === plan.id}
//               >
//                 {currentPlan === plan.id ? "Active" : "Upgrade"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Purchase confirmation modal */}
//       <Modal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} title="Confirm Purchase" size="sm">
//         {selectedPlan && (() => {
//           const plan = PLANS.find(p => p.id === selectedPlan);
//           return (
//             <div className="space-y-4">
//               <div className="bg-indigo-50 rounded-xl p-4">
//                 <div className="text-indigo-800 font-bold text-lg">{plan.name} Plan</div>
//                 <div className="text-indigo-600 text-sm mt-1">{plan.credits.toLocaleString()} credits will be added</div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm"><span className="text-gray-500">Plan price</span><span className="font-semibold">₹{plan.price.toLocaleString()}</span></div>
//                 <div className="flex justify-between text-sm"><span className="text-gray-500">Credits to add</span><span className="font-semibold text-emerald-600">+{plan.credits.toLocaleString()}</span></div>
//                 <div className="flex justify-between text-sm border-t pt-2"><span className="font-semibold text-gray-800">Total</span><span className="font-bold text-lg">₹{plan.price.toLocaleString()}</span></div>
//               </div>
//               <p className="text-xs text-gray-400">This is a demo. No actual payment will be processed.</p>
//               <div className="flex gap-3">
//                 <button onClick={() => setShowPurchaseModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
//                 <button onClick={handlePurchase} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-200">Confirm Purchase</button>
//               </div>
//             </div>
//           );
//         })()}
//       </Modal>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // PAGE: CAMPUS PROFILE
// // ─────────────────────────────────────────────
// function ProfilePage() {
//   const { profile, setProfile, profileCompletion, addToast } = useApp();
//   const [form, setForm] = useState(profile);
//   const [saved, setSaved] = useState(false);

//   const fields = [
//     { key: "campusName", label: "Campus Name", placeholder: "IIET College of Engineering", required: true, span: 2 },
//     { key: "university", label: "Affiliated University", placeholder: "JNTU Hyderabad", required: true },
//     { key: "established", label: "Established Year", placeholder: "1995", type: "number" },
//     { key: "address", label: "Address", placeholder: "123 Campus Road, Sector 5", required: true, span: 2 },
//     { key: "city", label: "City", placeholder: "Hyderabad", required: true },
//     { key: "state", label: "State", placeholder: "Telangana", required: true },
//     { key: "pincode", label: "Pincode", placeholder: "500001" },
//     { key: "totalStudents", label: "Total Students", placeholder: "2500", type: "number" },
//     { key: "contactEmail", label: "Contact Email", placeholder: "placement@college.edu", type: "email", required: true },
//     { key: "contactPhone", label: "Contact Phone", placeholder: "9000000000", required: true },
//     { key: "website", label: "Website", placeholder: "https://college.edu" },
//   ];

//   const calcCompletion = (f) => {
//     const vals = Object.values(f);
//     const filled = vals.filter(v => v && String(v).trim() !== "").length;
//     return Math.round((filled / vals.length) * 100);
//   };

//   const handleSave = () => {
//     setProfile(form);
//     setSaved(true);
//     addToast("Profile saved successfully!", "success");
//     setTimeout(() => setSaved(false), 2000);
//   };

//   const previewCompletion = calcCompletion(form);

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Campus Profile</h2>
//           <p className="text-sm text-gray-500 mt-0.5">Complete your profile to unlock all features</p>
//         </div>
//         <div className="flex items-center gap-3">
//           {profileCompletion < 100 && (
//             <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
//               <span className="text-amber-500 text-sm">⚠</span>
//               <span className="text-xs font-semibold text-amber-700">{profileCompletion}% complete</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Completion card */}
//       <div className={`rounded-2xl p-5 border ${profileCompletion === 100 ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-100 shadow-sm"}`}>
//         <div className="flex items-center gap-4 mb-3">
//           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${profileCompletion === 100 ? "bg-emerald-100" : "bg-indigo-50"}`}>
//             {profileCompletion === 100 ? "✅" : "🏛"}
//           </div>
//           <div className="flex-1">
//             <div className="font-semibold text-gray-900">{profileCompletion === 100 ? "Profile Complete! All features unlocked." : `Profile ${previewCompletion}% complete`}</div>
//             <div className="text-sm text-gray-500 mt-0.5">{profileCompletion < 100 ? "Fill all required fields to unlock the dashboard" : "Your campus profile is fully set up"}</div>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">{previewCompletion}%</div>
//         </div>
//         <ProgressBar value={previewCompletion} showLabel={false} color={previewCompletion === 100 ? "emerald" : "indigo"} />
//       </div>

//       {/* Form */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//         <h3 className="font-semibold text-gray-900 mb-5">Campus Information</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {fields.map(f => (
//             <Input
//               key={f.key}
//               label={f.label}
//               required={f.required}
//               placeholder={f.placeholder}
//               type={f.type || "text"}
//               value={form[f.key] || ""}
//               onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
//               className={f.span === 2 ? "sm:col-span-2" : ""}
//             />
//           ))}
//         </div>

//         <div className="mt-6 flex gap-3 justify-end">
//           <button onClick={() => setForm(profile)} className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Reset</button>
//           <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${saved ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"}`}>
//             {saved ? "✓ Saved!" : "Save Profile"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // PAGE: EMPLOYEES
// // ─────────────────────────────────────────────
// function EmployeesPage() {
//   const { employees, setEmployees, addToast } = useApp();
//   const [showModal, setShowModal] = useState(false);
//   const [editEmployee, setEditEmployee] = useState(null);
//   const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Coordinator", department: "Training & Placement" });
//   const [errors, setErrors] = useState({});
//   const [search, setSearch] = useState("");

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
//     if (!form.phone.trim()) e.phone = "Phone is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;
//     if (editEmployee) {
//       setEmployees(prev => prev.map(e => e.id === editEmployee.id ? { ...e, ...form } : e));
//       addToast("Employee updated!");
//     } else {
//       setEmployees(prev => [...prev, { id: Date.now(), ...form, status: "active", joinDate: new Date().toISOString().split("T")[0] }]);
//       addToast("Employee added!");
//     }
//     setShowModal(false);
//     setEditEmployee(null);
//     setForm({ name: "", email: "", phone: "", role: "Coordinator", department: "Training & Placement" });
//   };

//   const openEdit = (emp) => {
//     setEditEmployee(emp);
//     setForm({ name: emp.name, email: emp.email, phone: emp.phone, role: emp.role, department: emp.department });
//     setErrors({});
//     setShowModal(true);
//   };

//   const toggleStatus = (id) => {
//     setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "active" ? "inactive" : "active" } : e));
//     addToast("Employee status updated.");
//   };

//   const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

//   const columns = [
//     {
//       key: "name", label: "Employee", render: (v, row) => (
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600">
//             {v.split(" ").map(w => w[0]).slice(0, 2).join("")}
//           </div>
//           <div>
//             <div className="font-medium text-gray-900">{v}</div>
//             <div className="text-xs text-gray-400">{row.email}</div>
//           </div>
//         </div>
//       )
//     },
//     { key: "role", label: "Role", render: v => <Badge variant="indigo">{v}</Badge> },
//     { key: "department", label: "Department" },
//     { key: "joinDate", label: "Joined", render: v => new Date(v).toLocaleDateString("en-IN") },
//     { key: "status", label: "Status", render: v => <Badge variant={v === "active" ? "green" : "red"}>{v}</Badge> },
//     {
//       key: "actions", label: "Actions", render: (_, row) => (
//         <div className="flex gap-2">
//           <button onClick={() => openEdit(row)} className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-2.5 py-1 rounded-lg font-medium">Edit</button>
//           <button onClick={() => toggleStatus(row.id)} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${row.status === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
//             {row.status === "active" ? "Deactivate" : "Activate"}
//           </button>
//         </div>
//       )
//     },
//   ];

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Employees</h2>
//           <p className="text-sm text-gray-500 mt-0.5">{employees.length} employees in your team</p>
//         </div>
//         <button onClick={() => { setEditEmployee(null); setForm({ name: "", email: "", phone: "", role: "Coordinator", department: "Training & Placement" }); setErrors({}); setShowModal(true); }}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200">
//           + Add Employee
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//         <input placeholder="🔍  Search employees..." value={search} onChange={e => setSearch(e.target.value)}
//           className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50" />
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
//         <Table columns={columns} data={filtered} emptyMessage="No employees found" />
//       </div>

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editEmployee ? "Edit Employee" : "Add Employee"}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Input label="Full Name" required placeholder="Dr. Suresh Verma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} className="sm:col-span-2" />
//           <Input label="Email" required type="email" placeholder="suresh@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} />
//           <Input label="Phone" required placeholder="9700000001" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} error={errors.phone} />
//           <Select label="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
//             options={["Placement Officer", "Coordinator", "Admin", "HR Manager", "Faculty", "Support Staff"].map(r => ({ value: r, label: r }))} />
//           <Select label="Department" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
//             options={["Training & Placement", "Administration", "HR", "Faculty", "IT Support"].map(d => ({ value: d, label: d }))} />
//         </div>
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
//           <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-200">
//             {editEmployee ? "Update" : "Add Employee"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // DASHBOARD LAYOUT
// // ─────────────────────────────────────────────
// function DashboardLayout() {
//   const { currentPage } = useApp();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const pages = {
//     dashboard: <DashboardPage />,
//     candidates: <CandidatesPage />,
//     results: <ResultsPage />,
//     subscription: <SubscriptionPage />,
//     employees: <EmployeesPage />,
//     profile: <ProfilePage />,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex-1 flex flex-col min-w-0">
//         <Header onMenuToggle={() => setSidebarOpen(p => !p)} />
//         <main className="flex-1 overflow-y-auto">
//           {pages[currentPage] || <DashboardPage />}
//         </main>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // ROOT APP
// // ─────────────────────────────────────────────
// // export default function App() {
// //   return (
// //     <AppProvider>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
// //         * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
// //         @keyframes fade-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
// //         .animate-fade-in { animation: fade-in 0.2s ease-out; }
// //         ::-webkit-scrollbar { width: 6px; height: 6px; }
// //         ::-webkit-scrollbar-track { background: transparent; }
// //         ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 3px; }
// //       `}</style>
// //       <DashboardLayout />
// //       <ToastContainer />
// //     </AppProvider>
// //   );
// // }


// //=================================

// // ─────────────────────────────────────────────────────────────────────────────

// // HeroSection.jsx  —  Dual-mode Hero: Campus  ↔  Companies

// // Stack: React + Tailwind CSS  |  No external UI libs required

// // ─────────────────────────────────────────────────────────────────────────────
