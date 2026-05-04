import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  LogOut
} from "lucide-react";
import { useSubVendorLogoutMutation } from "../../../redux/services/subvendorApi";
import toast from "react-hot-toast";
import Loader from "../../../libs/Loader";
import eBenchLogo from "../../../assets/eBenchCampu.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [subVendorLogout, { isLoading }] = useSubVendorLogoutMutation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/subvendor/dashboard",
    },
    {
      title: "Candidate",
      icon: Users,
      path: "/subvendor/user-management",
    },
    {
      title: "Result Management",
      icon: Users,
      path: "/subvendor/result-management",
    },
    {
      title: "Profile",
      icon: UserCircle,
      path: "/subvendor/profile",
    },
  ];

  const handleLogout = async () => {
    try {
      const result = await subVendorLogout()
      if (result?.data?.status) {
        toast.success("Subvendor Logout Successfully.")
        localStorage.clear()
        setTimeout(() => {
          navigate("/employee/login")
        }, 1000)
      }
      if (result?.error) {
        return toast.error(result?.error?.data?.detail ?? "Something went wrong !")
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
    }
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed overflow-scroll inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#F4F9FF] to-[#E6F1FB] border-r border-[#B5D4F4] flex flex-col transition-transform duration-300 ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="p-6 py-5 border-b sticky top-0 bg-gradient-to-r from-[#042C53] to-[#185FA5] z-20 border-[#0C447C] shadow-md">
          <div className="flex items-center gap-3">
            <img 
              src={eBenchLogo} 
              alt="eBench Campus" 
              className="w-14 h-9 rounded-xl object-cover"
            />
            <div>
              <div className="font-bold text-white text-sm leading-tight">
                eBench Campus
              </div>
              <div className="text-xs text-[#B5D4F4]">
                Employee Portal
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                  ${isActive
                    ? "bg-[#185FA5] text-white shadow-md shadow-[#378ADD]/20"
                    : "text-[#042C53] hover:bg-[#E6F1FB] hover:text-[#0C447C]"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.title}</span>
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-[#B5D4F4]">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#B5D4F4]"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>{isLoading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
