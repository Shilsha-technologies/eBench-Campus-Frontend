import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import ProtectedRoute from "./libs/ProtectedRoute";
import PageLoader from "./libs/PageLoader";
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
import CodingAssessment from "./page/coding/CodingAssessment";
import AssessmentManagement from "./page/admin/Assessment";
import CodingTest from "./page/coding/CodingTest";

/* =========================
  Lazy Loaded Layout
========================= */
const DashboardLayout = lazy(() =>
  import("./components/ui/Layout/DashboardLayout")
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

const CampusDetail = lazy(() =>
  import("./components/admin/CampusDetail")
);

/* =========================
   Lazy Loaded SuperAdmin Pages
========================= */
const SuperAdminLayout = lazy(() =>
  import("./components/admin/superadmin/SuperAdminLayout")
);
const SuperAdminDashboard = lazy(() =>
  import("./components/admin/superadmin/SuperAdminDashboard")
);
const StudentManagement = lazy(() =>
  import("./components/admin/StudentManagement")
);

const AdminSetting = lazy(() =>
  import("./components/admin/AdminSetting")
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
const ProfileSection = lazy(() => import('./page/subVendor/SubVendorProfile'))

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
          <Route
            path="/code-test"
            element={
              <CodingTest />
            }
          />
          <Route
            path="/code"
            element={
              <CodingAssessment />
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
                  {/* ===== SuperAdmin Routes ===== */}
                  <Route
                    path="/superadmin/*"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <SuperAdminLayout />
                        </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<SuperAdminDashboard />} />
                    <Route path="users" element={<StudentManagement />} />
                    <Route path="campuses" element={<CampusManagement />} />
                    <Route path="campuses/:campusId" element={<CampusDetail />} />
                    <Route path="subscription" element={<SubscriptionList />} />
                    <Route path="Assesement" element={<AssessmentManagement />} />
                    <Route path="system" element={<SuperAdminDashboard />} />
                    <Route path="database" element={<SuperAdminDashboard />} />
                    <Route path="logs" element={<SuperAdminDashboard />} />
                    <Route path="settings" element={<AdminSetting />} />
                  </Route>

                  {/* ===== Vendor Routes ===== */}
                  <Route
                    path="/vendor/*"
                    element={
                        <ProtectedRoute allowedRoles={["vendor"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
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
                        <ProtectedRoute allowedRoles={["sub_vendor"]}>
                          <DashboardSubVendorLayout />
                        </ProtectedRoute>
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
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentProvider>
                            <StudentDashboardLayout />
                          </StudentProvider>
                        </ProtectedRoute>
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
      </BrowserRouter>
    </Provider>
  );
}

export default App;
