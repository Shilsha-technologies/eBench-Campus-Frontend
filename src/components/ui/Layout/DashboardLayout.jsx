// import AdminSidebar from "./Sidebar";
// import AdminHeader from "./Header";
// import { requestPermission } from "../../../redux/services/firebase";

// export const AdminDashboardLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const role=localStorage.getItem('role')
//   if(!localStorage.getItem('token')){
//     if(role==="admin"){
//     window.location.href = '/admin-login';
//     }else{
//     window.location.href = '/';
//     }
//     localStorage.clear()
//     return;
//   }

//   useEffect(() => {
//     if(role !== "admin"){
//     requestPermission();
//     }
//   }, []);


//   return (
//     <div className="flex h-screen bg-[#ffff]">
//       {/* Sidebar */}
//       <AdminSidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         role={role} // 👈 pass role to Sidebar
//       />

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col overflow-hidden">
//         <AdminHeader setSidebarOpen={setSidebarOpen} role={role} /> {/* 👈 optional role */}
//         <div className="flex-1 p-4 md:p-0 overflow-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };


//=====================
export const useApp = () => useContext(AppContext);


import { Outlet, NavLink, useNavigate } from "react-router-dom";

// function Sidebar({ isOpen, onClose }) {
//   let profileCompletion = 90, credits = 500;
//   function logout() {

//   }
//   const navigate = useNavigate();

//   const navItems = [
//     { to: "/vendor/dashboard", label: "Dashboard", icon: "⊞", end: true },
//     { to: "/vendor/candidates", label: "Candidates", icon: "👥" },
//     { to: "/vendor/results", label: "Test & Results", icon: "📋" },
//     { to: "/vendor/subscription/view", label: "Subscription", icon: "💳" },
//     { to: "/vendor/employee", label: "Employees", icon: "🧑‍💼" },
//     { to: "/vendor/profile", label: "Campus Profile", icon: "🏛" },
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <>
//       {isOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
//       <aside className={`fixed overflow-scroll inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
//         {/* Logo */}
//         <div className="p-6 py-5 border-b sticky top-0 bg-white z-20 border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">CMS</div>
//             <div>
//               <div className="font-bold text-gray-900 text-sm leading-tight">Campus Manager</div>
//               <div className="text-xs text-gray-400">Placement Portal</div>
//             </div>
//           </div>
//         </div>

//         {/* Profile warning */}
//         {profileCompletion < 100 && (
//           <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer" onClick={() => { navigate("/dashboard/profile"); onClose?.(); }}>
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
//           {navItems.map(item => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.end}
//               onClick={onClose}
//               className={({ isActive }) =>
//                 `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive
//                   ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
//                   : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                 }`
//               }
//             >
//               <span className="text-base w-5 text-center">{item.icon}</span>
//               <span className="flex-1">{item.label}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* Credits */}
//         <div className="p-4 border-t border-gray-100 space-y-3">
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
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
//           >
//             <span>🚪</span>
//             <span>Logout</span>
//           </button>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
//         >
//           <span>🚪</span>
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   </>
// );
// }

import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
import eBenchLogo from "../../../assets/eBenchCampu.png";

export function Sidebar({ isOpen, onClose }) {
  const { getProfileCompleteness, canAccessManagement, getRemainsCredit } = useAuth();
  const [credits, setCredits] = useState(getRemainsCredit());
  let profileCompletion = getProfileCompleteness()
  const [logout, { isLoading }] = useLogoutMutation();

  // Update credits when localStorage changes
  useEffect(() => {
    const handleCreditsUpdate = () => {
      setCredits(getRemainsCredit());
    };

    // Listen for custom events from localStorage updates
    window.addEventListener('localStorageUserUpdate', handleCreditsUpdate);

    return () => {
      window.removeEventListener('localStorageUserUpdate', handleCreditsUpdate);
    };
  }, [getRemainsCredit]);

  console.log("canAccess", canAccessManagement);
  console.log("pp", profileCompletion)
  // debuggers

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const result = await logout();
      // console.log("logout-response", result);
      if (result?.error) {
        return toast.error(result?.error?.data?.detail ?? "Something went wrong !")
      }
      if (result?.data) {
        toast.success("Campus Logout Successfully.")
        setTimeout(() => {
          localStorage.clear();
          navigate("/")
        }, 800)
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
    }
  };

  const navItems = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: "", end: true },
    { to: "/vendor/candidates", label: "Candidates", icon: "", end: false },
    { to: "/vendor/results", label: "Test & Results", icon: "", end: false },
    { to: "/vendor/subscription/view", label: "Subscription", icon: "", end: false },
    { to: "/vendor/employee", label: "Role Management", icon: "", end: false },
    { to: "/vendor/profile", label: "Campus Profile", icon: "", end: false },
  ];

  // AUTO REDIRECT LOGIC
  useEffect(() => {
    console.log("pr", profileCompletion)
    if (
      profileCompletion < 100 &&
      location.pathname !== "/vendor/profile"
    ) {
      navigate("/vendor/profile");
    }
  }, [profileCompletion, location.pathname, navigate]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed overflow-scroll inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${isOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="p-6 py-5 border-b sticky top-0 bg-white z-20 border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={eBenchLogo}
              alt="eBench Campus"
              className="w-14 h-9 rounded-xl object-cover"
            />
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">
                eBench Campus
              </div>
              <div className="text-xs text-gray-400">
                Placement Portal
              </div>
            </div>
          </div>
        </div>

        {/* Profile Warning */}
        {profileCompletion < 100 && (
          <div
            className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer"
            onClick={() => {
              navigate("/vendor/profile"); // ✅ fixed
              onClose?.();
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500 text-sm">⚠</span>
              <span className="text-xs font-semibold text-amber-800">
                Profile Incomplete
              </span>
            </div>

            {/* Example Progress */}
            <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <p className="text-xs text-amber-700 mt-1.5">
              {profileCompletion}% complete — finish to unlock all features
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map((item) => {
            const isLocked =
              profileCompletion < 100 &&
              item.to !== "/vendor/profile";

            return (
              <NavLink
                key={item.to}
                to={isLocked ? "#" : item.to}
                end={item.end}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                    return;
                  }
                  onClose && onClose();
                }}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left 
                  ${isActive && !isLocked
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                  ${isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`
                }
              >
                <span className="text-base w-5 text-center">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>

                {isLocked && (
                  <span className="text-xs opacity-70">🔒</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Credits */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="bg-indigo-50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-indigo-700">
                Credits Remaining
              </span>
              <span className="text-xs text-indigo-500">💳</span>
            </div>

            <div className="text-2xl font-bold text-indigo-800">
              {credits.toLocaleString()}
            </div>

            <div className="mt-2 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500"
                style={{
                  width: `${Math.min(
                    100,
                    (credits / 500) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>🚪</span>
            )}
            <span>{isLoading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}


function Header({ onMenuToggle }) {
  // const { profile, authUser } = useApp();

  let profile = JSON.parse(localStorage.getItem('user'))
  console.log("popopopo", profile)
  let authUser = {}

  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="bg-white  border-b border-gray-100 px-4 lg:px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
      <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">☰</button>
      <div className="flex-1">
        {/* <h1 className="text-base font-semibold text-gray-900 hidden sm:block">Campus Management System</h1> */}
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-gray-900">
            {getGreeting()}, {profile?.name || authUser?.campusName || "Campus"}
            {profile?.planName && (
              <span className="ml-2 text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                {profile.planName} Plan
              </span>
            )}
          </h1>
          <p className="text-xs pt- text-gray-400">
            Here’s what’s happening today
          </p>
        </div>
      </div>
      <div className="flex cursor-pointer items-center gap-3">
        <button className="relative w-9 cursor-pointer h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <button
          onClick={() => navigate("/vendor/profile")}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {(profile?.campusName || authUser?.campusName || "CA").slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-gray-800">{profile?.name || authUser?.campusName || "Campus Admin"}</div>
            <div className="text-xs text-gray-400">
              {profile?.last_login
                ? `Last login: ${new Date(profile?.last_login).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}`
                : "Head of Placement"
              }
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(-8px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        <Header onMenuToggle={() => setSidebarOpen(p => !p)} />

        <main className="flex-1 overflow-y-auto p-4 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../libs/AuthProvider";
import { useLogoutMutation } from "../../../redux/services/vendorApi";
import toast from "react-hot-toast";

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_CANDIDATES = [
  { id: 1, name: "Arjun Sharma", email: "arjun.s@college.edu", phone: "9876543210", branch: "CSE", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 87, testDate: "2024-03-10" },
  { id: 2, name: "Priya Mehta", email: "priya.m@college.edu", phone: "9812345678", branch: "ECE", year: "4th", status: "active", testSent: true, testCompleted: false, score: null, testDate: "2024-03-11" },
  { id: 3, name: "Rohit Kumar", email: "rohit.k@college.edu", phone: "9823456789", branch: "ME", year: "3rd", status: "inactive", testSent: false, testCompleted: false, score: null, testDate: null },
  { id: 4, name: "Sneha Patel", email: "sneha.p@college.edu", phone: "9834567890", branch: "CSE", year: "4th", status: "active", testSent: true, testCompleted: true, score: 72, testDate: "2024-03-09" },
  { id: 5, name: "Vikram Singh", email: "vikram.s@college.edu", phone: "9845678901", branch: "IT", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 93, testDate: "2024-03-08" },
  { id: 6, name: "Anjali Nair", email: "anjali.n@college.edu", phone: "9856789012", branch: "CSE", year: "4th", status: "active", testSent: false, testCompleted: false, score: null, testDate: null },
  { id: 7, name: "Rahul Gupta", email: "rahul.g@college.edu", phone: "9867890123", branch: "EEE", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 58, testDate: "2024-03-07" },
  { id: 8, name: "Meera Iyer", email: "meera.i@college.edu", phone: "9878901234", branch: "CSE", year: "2nd", status: "inactive", testSent: false, testCompleted: false, score: null, testDate: null },
];

export const MOCK_EMPLOYEES = [
  { id: 1, name: "Dr. Suresh Verma", email: "suresh.v@college.edu", phone: "9700000001", role: "Placement Officer", department: "Training & Placement", status: "active", joinDate: "2020-06-01" },
  { id: 2, name: "Ms. Kavita Rao", email: "kavita.r@college.edu", phone: "9700000002", role: "Coordinator", department: "Training & Placement", status: "active", joinDate: "2021-03-15" },
  { id: 3, name: "Mr. Anil Desai", email: "anil.d@college.edu", phone: "9700000003", role: "Admin", department: "Administration", status: "active", joinDate: "2019-08-10" },
];

export const INITIAL_PROFILE = {
  campusName: "", university: "", address: "", city: "", state: "",
  pincode: "", contactEmail: "", contactPhone: "", website: "", established: "", totalStudents: "", logo: null,
};

export const PLANS = [
  { id: "starter", name: "Starter", credits: 500, price: 999, features: ["500 test credits", "Basic analytics", "Email support", "1 admin user"] },
  { id: "professional", name: "Professional", credits: 2000, price: 2999, features: ["2000 test credits", "Advanced analytics", "Priority support", "5 admin users", "Custom branding"] },
  { id: "enterprise", name: "Enterprise", credits: 10000, price: 7999, features: ["10000 test credits", "Full analytics suite", "Dedicated support", "Unlimited users", "API access", "White labeling"] },
];

export const RECENT_ACTIVITY = [
  { id: 1, text: "Test link sent to Arjun Sharma", time: "2 hours ago", type: "test" },
  { id: 2, text: "Priya Mehta added as new candidate", time: "4 hours ago", type: "candidate" },
  { id: 3, text: "Vikram Singh completed test (Score: 93)", time: "Yesterday", type: "result" },
  { id: 4, text: "Sneha Patel completed test (Score: 72)", time: "Yesterday", type: "result" },
  { id: 5, text: "50 credits purchased (Professional plan)", time: "2 days ago", type: "credit" },
];

// Demo credentials
export const DEMO_CREDENTIALS = [
  { email: "admin@abc.edu", password: "admin123", campusName: "ABC Institute of Technology", role: "Head of Placement" },
  { email: "demo@campus.edu", password: "demo123", campusName: "Demo University", role: "Placement Coordinator" },
];



export function ProgressBar({ value, label, color = "indigo", showLabel = true }) {
  const colors = {
    indigo: "bg-indigo-500", emerald: "bg-emerald-500",
    amber: "bg-amber-500", rose: "bg-rose-500",
  };
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-semibold text-gray-800">{value}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${colors[color]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}