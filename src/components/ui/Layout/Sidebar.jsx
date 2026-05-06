// import { Code2, Users, LayoutDashboard, X, LogOut, Package, ShoppingBag, Crown, Podcast } from "lucide-react";
// import logo from "../../../assets/logo_white2.png";
// import { Gem } from "lucide-react";
// import { useState, useEffect } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";

// const Sidebar = ({ sidebarOpen, setSidebarOpen ,role}) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     localStorage.clear();
//     if (role === "admin") {
//       navigate('/admin-login')
//     } else {
//       navigate("/");
//     }
//   };

//   const adminMenu = [
//     { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
//     {
//       label: "Vendor Management", icon: Gem,
//       to: "/admin/vendor-management"
//     },
//     {
//       label: "Subscription ",
//       icon: Gem,
//       submenu: [
//         { to: "/admin/subscription/user", label: "(Add/Edit) Subscription" },
//         { to: "/admin/subscription/list", label: "View Subscription List" },
//       ],
//     },
//   ];

//   const vendorMenu = [
//     { to: "/vendor", label: "Dashboard", icon: LayoutDashboard },
//     { to: "/vendor/user-management", label: "User Management", icon: Users },
//     {
//       to: "/vendor/subscription", label: "Subscription", icon: Crown,
//       submenu: [
//         { to: "/vendor/subscription", label: "Purchase Subscription", icon: Podcast },
//         { to: "/vendor/subscription/view", label: "View Subscription List", icon: Podcast },
//       ],
//     },
//   ];

//   const menuItems = role === "vendor" ? vendorMenu : adminMenu;

//   // Track which submenu is open 
//   const [openMenu, setOpenMenu] = useState("");

//   // Auto open submenu if user is on a nested route
//   useEffect(() => {
//     const currentMenu = menuItems.find(
//       (item) => item.submenu && item.submenu.some((sub) => sub.to === location.pathname)
//     );
//     if (currentMenu) setOpenMenu(currentMenu.label);
//     else setOpenMenu("");
//   }, [location.pathname]);

//   return (
//     <aside
//       className={`fixed md:static top-0 left-0 h-full z-40 bg-[#286a94] text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 transition-transform duration-300 w-64 flex flex-col justify-between`}
//     >
//       <div>
//         {/* Logo */}
//         <div className="flex items-center justify-between p-4 border-b border-b-[#3E6E91]">
//           <img className="w-9/12 mx-auto h-8 object-contain" src={logo} alt="Ebench logo" />
//           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Dynamic Navigation */}
//         <nav className="mt-6 flex flex-col gap-1">
//           {menuItems.map((item) => {
//             const Icon = item?.icon;
//             let SubIcon = null;

//             if (item.submenu) {
//               if (item?.icon) {
//                 SubIcon = item?.icon;
//                 console.log("LPP", SubIcon);
//               }
//               const isOpen = openMenu === item.label;
//               return (
//                 <div key={item.label} className="flex flex-col">
//                   {/* Parent Menu */}
//                   <button
//                     onClick={() =>
//                       setOpenMenu(isOpen ? "" : item.label)
//                     }
//                     className="flex items-center px-4 py-2 w-full hover:bg-[#28527A] justify-between transition-colors"
//                   >
//                     <div className="flex items-center">
//                       {Icon && <Icon className="h-5 w-5 mr-3" />}
//                       <span>{item.label}</span>
//                     </div>
//                     <span className="text-[10px]">{isOpen ? "▲" : "▼"}</span>
//                   </button>

//                   {/* Submenu */}
//                   {isOpen &&
//                     item.submenu.map((sub) => (
//                       <NavLink
//                         key={sub.to}
//                         to={sub.to}
//                         end
//                         className={({ isActive }) =>
//                           `flex items-center px-8 py-2 ml-2 rounded-r-md ${isActive ? "bg-[#5C8DA6]" : "bg-[#32729b] hover:bg-[#3E6E91]"
//                           } transition-colors`
//                         }
//                       >
//                         <span> {SubIcon && <SubIcon className="h-3 w-3 mr-1" />}</span>  <span>{sub.label}</span>
//                       </NavLink>
//                     ))}
//                 </div>
//               );
//             }

//             return (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 end
//                 onClick={() => setOpenMenu("")} 
//                 className={({ isActive }) =>
//                   `flex items-center px-4 py-2 ${isActive ? "bg-[#49799b]" : "hover:bg-[#28527A]"
//                   } transition-colors`
//                 }
//               >
//                 {Icon && <Icon className="h-5 w-5 mr-3" />}
//                 <span>{item.label}</span>
//               </NavLink>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Logout */}
//       <div className="p-4">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-[#28527A] transition"
//         >
//           <LogOut className="h-5 w-5" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import {
  Users,
  LayoutDashboard,
  X,
  LogOut,
  Crown,
  FileUser,
  Podcast,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { Gem } from "lucide-react";
import logo from "../../../assets/logo_white2.png";
import { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLogoutMutation } from "../../../redux/services/vendorApi";
import Loader from "../../../libs/Loader";
import { useAdminLogoutMutation } from "../../../redux/services/adminApi";
import { useProfileCompleteness } from "../../../libs/useProfileCompleteness";

const Sidebar = ({ sidebarOpen, setSidebarOpen, role = "admin" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logout, { isLoading }] = useLogoutMutation();
  const [adminLogout,{isLoading:adminLoadimg}]=useAdminLogoutMutation()
  
  // Profile completeness hook for security
  const { 
    canAccessManagement, 
    checkAndRedirect, 
    profileCompleteness, 
    isLoading: profileLoading,
    getProfileStatus 
  } = useProfileCompleteness();

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    try {
      const result = role == "admin" ? await adminLogout() : await logout();
      // console.log("logout-response", result);
      if(result?.error){
        return toast.error(result?.error?.data?.detail??"Somthing went wrong !")
      }
      if (result?.data) {
        if (role == "admin") {
        toast.success("Admin Logout Sucessfully.")
          setTimeout(() => {
            navigate("/admin-login")
          }, 1000)
        } else {
        toast.success("Vendor Logout Successfully.")
          setTimeout(() => {
            navigate("/")
          }, 800)
        }
        localStorage.clear();
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
    }

  };

  /* ---------- MENU CONFIG ---------- */
  const adminMenu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/admin/vendor-management",
      label: "Vendor Management",
      icon: Gem,
    },
    {
      to: "/admin/campus-management",
      label: "Campus Management",
      icon: Users,
    },
    {
      label: "Subscription",
      icon: Gem,
      submenu: [
        { to: "/admin/subscription/user", label: "(Add/Edit) Subscription" },
        { to: "/admin/subscription/list", label: "View Subscription List" },
      ],
    },
  ];

  const vendorMenu = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/vendor/user-management",
      label: "Candidate Management",
      icon: Users,
      restricted: true, // Mark as restricted for incomplete profiles
    },
    { 
      to: "/vendor/result-management", 
      label: "Result Management", 
      icon: FileUser,
      restricted: true, // Mark as restricted for incomplete profiles
    },
    { 
      to: "/vendor/role-management", 
      label: "Role Management", 
      icon: FileUser,
      restricted: true, // Mark as restricted for incomplete profiles
    },
    {
      label: "Subscription",
      icon: Crown,
      to:"/vendor/subscription/view",
      restricted: true, // Mark as restricted for incomplete profiles
      // submenu: [
      //   { to: "/vendor/subscription/plan", label: "Purchase Subscription", icon: Podcast },
      //   { to: , label: "View Subscription List", icon: Podcast },
      // ],
    },
  ];

const menuItems = useMemo(() => {
  return role === "vendor" ? vendorMenu : adminMenu;
}, [role]);
  /* ---------- SUBMENU STATE ---------- */
  const [openMenu, setOpenMenu] = useState(null);

  /* prevents auto-close on manual click */
  const userClickedRef = useRef(false);

  /* ---------- AUTO OPEN ONLY ON ROUTE CHANGE ---------- */
  useEffect(() => {
    if (userClickedRef.current) {
      userClickedRef.current = false;
      return;
    }

    const activeMenu = menuItems.find((item) =>
      item.submenu?.some((sub) =>
        location.pathname.startsWith(sub.to)
      )
    );

    setOpenMenu(activeMenu ? activeMenu.label : null);
  }, [menuItems]);

  /* ---------- MENU CLICK HANDLER ---------- */
  const handleMenuClick = (item, event) => {
    event.preventDefault();
    
    // Check if the item is restricted and profile is incomplete
    if (role === "vendor" && item.restricted && !canAccessManagement()) {
      // Show warning and redirect to profile
      checkAndRedirect({
        showMessage: true,
        redirectPath: "/vendor/profile",
        message: `Please complete your profile (${profileCompleteness}%) to access ${item.label}`
      });
      return;
    }
    
    // Navigate to the intended route
    navigate(item.to);
    closeSidebarOnMobile();
  };

  /* ---------- MOBILE CLOSE ---------- */
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full z-40 bg-[#286a94] text-white
      transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-64 flex flex-col justify-between`}
    >
      <div>
        {/* ---------- LOGO ---------- */}
        <div className="flex items-center justify-between p-4 border-b border-[#3E6E91]">
          <img src={logo} alt="logo" className="w-9/12 mx-auto h-8 object-contain" />
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---------- PROFILE COMPLETENESS INDICATOR (VENDOR ONLY) ---------- */}
        {role === "vendor" && !profileLoading && (
          <div className="px-4 py-3 border-b border-[#3E6E91]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Profile Status</span>
              <span className={`text-xs font-bold ${canAccessManagement() ? 'text-green-400' : 'text-yellow-400'}`}>
                {profileCompleteness}%
              </span>
            </div>
            <div className="w-full bg-[#1a4a6a] rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  canAccessManagement() ? 'bg-green-400' : 'bg-yellow-400'
                }`}
                style={{ width: `${profileCompleteness}%` }}
              />
            </div>
            {!canAccessManagement() && (
              <p className="text-xs text-yellow-400 mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Complete profile to access all features
              </p>
            )}
          </div>
        )}

        {/* ---------- NAV ---------- */}
        <nav className="mt-6 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openMenu === item.label;

            if (item.submenu) {
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      userClickedRef.current = true;
                      setOpenMenu(isOpen ? null : item.label);
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-[#28527A]"
                  >
                    <div className="flex items-center">
                      {Icon && <Icon className="h-5 w-5 mr-3" />}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen &&
                    item.submenu.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          onClick={closeSidebarOnMobile}
                          className={({ isActive }) =>
                            `flex items-center px-8 py-2 ml-2 rounded-r-md transition ${isActive
                              ? "bg-[#5C8DA6]"
                              : "bg-[#32729b] hover:bg-[#3E6E91]"
                            }`
                          }
                        >
                          {SubIcon && <SubIcon className="h-3 w-3 mr-2" />}
                          <span>{sub.label}</span>
                        </NavLink>
                      );
                    })}
                </div>
              );
            }

            // Check if item is restricted and profile is incomplete
            const isRestricted = role === "vendor" && item.restricted && !canAccessManagement();
            
            return (
              <div key={item.to} className="relative">
                {isRestricted ? (
                  // Restricted item - show with lock icon and custom click handler
                  <button
                    onClick={(e) => handleMenuClick(item, e)}
                    className={`w-full flex items-center px-4 py-2 transition cursor-not-allowed opacity-60 hover:bg-[#28527A]`}
                    title={`Profile incomplete (${profileCompleteness}%) - Complete profile to access`}
                  >
                    {Icon && <Icon className="h-5 w-5 mr-3" />}
                    <Lock className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>{item.label}</span>
                    <AlertCircle className="h-4 w-4 ml-auto text-yellow-400" />
                  </button>
                ) : (
                  // Normal navigation item
                  <NavLink
                    to={item.to}
                    onClick={() => {
                      setOpenMenu(null);
                      closeSidebarOnMobile();
                    }}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 transition ${isActive ? "bg-[#49799b]" : "hover:bg-[#28527A]"
                      }`
                    }
                  >
                    {Icon && <Icon className="h-5 w-5 mr-3" />}
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ---------- LOGOUT ---------- */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#28527A]"
        >
          {
            isLoading ? <> 
            Logging
          <span>
            <Loader size={20} innerSize={10} />
          </span>
            </>:<> <LogOut className="h-5 w-5" />
          <span>Logout</span></>
          }
          
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

