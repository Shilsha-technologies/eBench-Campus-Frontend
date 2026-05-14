import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Shield, Settings, Activity,
  Crown, Key, UserCheck, Server, Cloud, Database, Lock, Menu, X,
  ChevronRight, ChevronLeft, Search, Bell, LogOut, Eye
} from "lucide-react";

/* ════════════════════════════════════════════
   SUPERADMIN THEME TOKENS (Light Green Theme)
════════════════════════════════════════════ */
const T = {
  bg: "#f8fafb",
  surface: "#ffffff",
  border: "rgba(34,197,94,.15)",
  borderSoft: "rgba(34,197,94,.08)",
  text: "#1e293b",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  accent: "#22c55e",
  accentHover: "#16a34a",
  gold: "#fbbf24",
  goldHover: "#f59e0b",
  glow: "rgba(34,197,94,.3)",
  goldGlow: "rgba(251,191,36,.3)",
};

/* ════════════════════════════════════════════
   NAVIGATION ITEMS
════════════════════════════════════════════ */
const superAdminNavItems = [
  { 
    id: "dashboard", 
    label: "System Overview", 
    icon: LayoutDashboard,
    description: "System health and metrics"
  },
  { 
    id: "users", 
    label: "Student Management", 
    icon: Users,
    description: "Manage campus accounts"
  },
  { 
    id: "campuses", 
    label: "Campus Management", 
    icon: Building2,
    description: "View all students"
  },
  { 
    id: "subscription", 
    label: "Subscription", 
    icon: Shield,
    description: "Manage subscription plans"

  },
  // { 
  //   id: "system", 
  //   label: "System", 
  //   icon: Server,
  //   description: "System configuration"
  // },
  // { 
  //   id: "database", 
  //   label: "Database", 
  //   icon: Database,
  //   description: "Database management"
  // },
  // { 
  //   id: "logs", 
  //   label: "System Logs", 
  //   icon: Activity,
  //   description: "Activity logs"
  // },
  { 
    id: "settings", 
    label: "Settings", 
    icon: Settings,
    description: "System settings"
  },
];

/* ════════════════════════════════════════════
   ANIMATED BACKGROUND (Light Theme)
════════════════════════════════════════════ */
const AnimatedBg = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{ 
      position: "absolute", 
      top: "4%", 
      left: "8%", 
      width: 520, 
      height: 520, 
      borderRadius: "50%", 
      background: "radial-gradient(circle,rgba(34,197,94,.08) 0%,transparent 70%)", 
      animation: "blobA 16s ease-in-out infinite" 
    }}/>
    <div style={{ 
      position: "absolute", 
      bottom: "6%", 
      right: "6%", 
      width: 460, 
      height: 460, 
      borderRadius: "50%", 
      background: "radial-gradient(circle,rgba(16,185,129,.06) 0%,transparent 70%)",  
      animation: "blobB 20s ease-in-out infinite" 
    }}/>
    <div style={{ 
      position: "absolute", 
      top: "45%", 
      left: "48%", 
      width: 340, 
      height: 340, 
      borderRadius: "50%", 
      background: "radial-gradient(circle,rgba(251,191,36,.04) 0%,transparent 70%)",  
      animation: "blobC 24s ease-in-out infinite" 
    }}/>
    <div style={{ 
      position: "absolute", 
      inset: 0, 
      backgroundImage: "radial-gradient(rgba(34,197,94,.08) 1px,transparent 1px)", 
      backgroundSize: "38px 38px", 
      opacity: 0.3 
    }}/>
    <div style={{ 
      position: "absolute", 
      inset: 0, 
      background: "radial-gradient(ellipse 90% 90% at 50% 50%,transparent 30%,rgba(248,250,251,.98) 100%)" 
    }}/>
  </div>
);

/* ════════════════════════════════════════════
   SIDEBAR COMPONENT
════════════════════════════════════════════ */
const SuperAdminSidebar = ({ active, onNav, collapsed, onToggle }) => (
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    height: "100%", 
    background: "#ffffff", 
    borderRight: `1px solid ${T.border}`, 
    boxShadow: "0 4px 12px rgba(0,0,0,.08)", 
    width: collapsed ? 64 : 268, 
    transition: "width .3s", 
    flexShrink: 0, 
    position: "relative", 
    zIndex: 10 
  }}>
    {/* Logo */}
    <div className=" border-b-[1px] border-gray-300" style={{ 
      height: 60, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: collapsed ? "center" : "flex-start", 
      padding: collapsed ? "0" : "0 16px", 
      // borderBottom: `5px solid rgba(255,255,255,.06)` 
    }}>
      {!collapsed ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 10, 
            background: "linear-gradient(135deg,#22c55e,#16a34a)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: "0 0 18px rgba(34,197,94,.35)" 
          }}>
            <Crown size={16} color="#fff"/>
          </div>
          <div>
            <span style={{ 
              color: T.text, 
              fontWeight: 800, 
              fontSize: 17, 
              letterSpacing: "-0.5px" 
            }}>
              eBench<span style={{ color: T.accent }}>.campu</span>
            </span>
            <div style={{ 
              fontSize: 10, 
              color: T.accent, 
              fontWeight: 600, 
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              gap: 4
            }}>
              <Crown size={10}/>
              SUPER ADMIN
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: 10, 
          background: "linear-gradient(135deg,#22c55e,#16a34a)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          boxShadow: "0 0 18px rgba(34,197,94,.35)",
          borderBottom: "5px solid rgba(255,255,255)" 
        }}>
          <Crown size={16} color="#fff"/>
        </div>
      )}
    </div>

    {/* Nav items */}
    <nav style={{ 
      flex: 1, 
      padding: "10px 8px", 
      display: "flex", 
      flexDirection: "column", 
      gap: 2, 
      overflowY: "auto" 
    }}>
      {superAdminNavItems.map(item => {
        const isActive = active === item.id;
        return (
          <button 
            key={item.id} 
            onClick={() => onNav(item.id)} 
            title={collapsed ? item.label : ""}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 10, 
              padding: "10px 11px", 
              borderRadius: 12, 
              cursor: "pointer", 
              transition: "all .2s", 
              background: isActive ? "linear-gradient(135deg,rgba(34,197,94,.12),rgba(16,185,129,.08))" : "transparent", 
              border: `1px solid ${isActive ? "rgba(34,197,94,.25)" : "transparent"}`, 
              color: isActive ? "#16a34a" : T.textMuted, 
              fontFamily: "'DM Sans',sans-serif", 
              width: "100%", 
              textAlign: "left", 
              boxShadow: isActive ? "0 4px 20px rgba(34,197,94,.15), inset 0 1px 0 rgba(255,255,255,.06)" : "none", 
              justifyContent: collapsed ? "center" : "flex-start" 
            }}
            onMouseEnter={e => { 
              if(!isActive){ 
                e.currentTarget.style.background = "rgba(34,197,94,.06)"; 
                e.currentTarget.style.color = T.text; 
              }
            }}
            onMouseLeave={e => { 
              if(!isActive){ 
                e.currentTarget.style.background = "transparent"; 
                e.currentTarget.style.color = T.textMuted; 
              }
            }}
          >
            <item.icon size={16} style={{ flexShrink: 0 }}/>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: 13.5, 
                  fontWeight: 600, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 6 
                }}>
                  {item.label}
                  {item.id === "security" && <Shield size={11} style={{ color: T.accent }}/>}
                  {item.id === "system" && <Server size={11} style={{ color: T.accentHover }}/>}
                </div>
                {!collapsed && (
                  <div style={{ 
                    fontSize: 10.5, 
                    color: T.textDim, 
                    marginTop: 1, 
                    fontWeight: 400 
                  }}>
                    {item.description}
                  </div>
                )}
              </div>
            )}
            {!collapsed && isActive && (
              <div style={{ 
                width: 6, 
                height: 6, 
                borderRadius: "50%", 
                background: "#22c55e", 
                boxShadow: "0 0 8px #22c55e" 
              }}/>
            )}
          </button>
        );
      })}
    </nav>

    {/* Bottom */}
    <div style={{ padding: 8, borderTop: `1px solid rgba(255,255,255,.06)` }}>
      {!collapsed && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 9, 
          padding: "9px 11px", 
          borderRadius: 12, 
          marginBottom: 4, 
          cursor: "pointer",
          background: `${T.accent}10`,
          border: `1px solid ${T.accent}30`
        }}
          onMouseEnter={e => e.currentTarget.style.background = `${T.accent}20`}
          onMouseLeave={e => e.currentTarget.style.background = `${T.accent}10`}
        >
          <div style={{ 
            width: 28, 
            height: 28, 
            borderRadius: "50%", 
            background: "linear-gradient(135deg,#22c55e,#16a34a)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: 11, 
            fontWeight: 800, 
            color: "#fff" 
          }}>
            SA
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ 
              fontSize: 12.5, 
              fontWeight: 700, 
              color: T.text, 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap" 
            }}>
              Super Admin
            </p>
            <p style={{ 
              fontSize: 11, 
              color: T.textDim, 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap" 
            }}>
              superadmin@ebench.ai
            </p>
          </div>
        </div>
      )}
      <button 
        onClick={onToggle} 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          padding: "8px 11px", 
          borderRadius: 12, 
          background: "transparent", 
          border: "none", 
          color: "#94a3b8", 
          cursor: "pointer", 
          width: "100%", 
          fontSize: 12, 
          fontFamily: "'DM Sans',sans-serif", 
          justifyContent: collapsed ? "center" : "flex-start", 
          transition: "all .15s" 
        }}
        onMouseEnter={e => { 
          e.currentTarget.style.background = "rgba(34,197,94,.06)"; 
          e.currentTarget.style.color = "#6b7280"; 
        }}
        onMouseLeave={e => { 
          e.currentTarget.style.background = "transparent"; 
          e.currentTarget.style.color = "#94a3b8"; 
        }}
      >
        {collapsed ? <ChevronRight size={14}/> : <><ChevronLeft size={14}/><span>Collapse</span></>}
      </button>
    </div>
  </div>
);

/* ════════════════════════════════════════════
   TOP NAVIGATION
════════════════════════════════════════════ */
const SuperAdminTopNav = ({ active, onMobileMenu, onLogout }) => {
  const title = superAdminNavItems.find(n => n.id === active)?.label || "System Overview";
  
  return (
    <div style={{ 
      height: 60, 
      background: "#ffffff", 
      borderBottom: `1px solid #d1d5db`, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      padding: "0 20px", 
      flexShrink: 0, 
      boxShadow: "0 2px 8px rgba(0,0,0,.06)", 
      position: "relative", 
      zIndex: 5 
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button 
          onClick={onMobileMenu} 
          style={{ 
            display: "none", 
            padding: 6, 
            borderRadius: 9, 
            background: "none", 
            border: "none", 
            color: "#6b7280", 
            cursor: "pointer" 
          }} 
          className="mobile-menu-btn"
        >
          <Menu size={18}/>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Crown size={14} style={{ color: "#34c759" }}/>
          <span style={{ color: "#94a3b8" }}>Super Admin</span>
          <ChevronRight size={13} style={{ color: "#94a3b8" }}/>
          <span style={{ color: "#1e293b", fontWeight: 600 }}>{title}</span>
        </div>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ 
            position: "absolute", 
            left: 11, 
            top: "50%", 
            transform: "translateY(-50%)", 
            color: "rgba(100,116,139,.35)", 
            pointerEvents: "none" 
          }}/>
          <input 
            placeholder="Search system..." 
            style={{ 
              background: "rgba(34,197,94,.04)", 
              border: `1px solid rgba(34,197,94,.1)`, 
              borderRadius: 11, 
              padding: "8px 12px 8px 36px", 
              paddingRight: 12, 
              width: 200, 
              fontSize: 13, 
              color: "#1e293b",
              outline: "none",
              transition: "all .2s"
            }} 
            onFocus={e => {
              e.target.style.border = "1px solid rgba(34,197,94,.3)"; 
              e.target.style.background = "rgba(34,197,94,.08)"; 
              e.target.style.width = "240px";
            }} 
            onBlur={e => {
              e.target.style.border = "1px solid rgba(34,197,94,.1)"; 
              e.target.style.background = "rgba(34,197,94,.04)"; 
              e.target.style.width = "200px";
            }}
          />
        </div>
        
        <button style={{ 
          position: "relative", 
          padding: 8, 
          borderRadius: 10, 
          background: "rgba(34,197,94,.08)", 
          border: `1px solid rgba(34,197,94,.15)`, 
          color: "#6b7280", 
          cursor: "pointer", 
          display: "flex" 
        }}>
          <Bell size={16}/>
          <span style={{ 
            position: "absolute", 
            top: 5, 
            right: 5, 
            width: 7, 
            height: 7, 
            borderRadius: "50%", 
            background: "#ef4444", 
            boxShadow: "0 0 8px rgba(239,68,68,.6)" 
          }}/>
        </button>
        
        <button 
          onClick={onLogout}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 6, 
            padding: "6px 12px", 
            borderRadius: 10, 
            background: "rgba(34,197,94,.1)", 
            border: `1px solid rgba(34,197,94,.3)`, 
            color: "#34c759", 
            fontSize: 12, 
            fontWeight: 600, 
            cursor: "pointer",
            transition: "all .15s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(34,197,94,.2)";
            e.currentTarget.style.borderColor = "rgba(34,197,94,.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(34,197,94,.1)";
            e.currentTarget.style.borderColor = "rgba(34,197,94,.3)";
          }}
        >
          <LogOut size={14}/>
          Logout
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN LAYOUT COMPONENT
════════════════════════════════════════════ */
export default function SuperAdminLayout() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update active state based on current path
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && superAdminNavItems.find(item => item.id === path)) {
      setActive(path);
    }
  }, [location.pathname]);

  const handleNav = (itemId) => {
    setActive(itemId);
    navigate(`/superadmin/${itemId}`);
    setMobileSidebar(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/admin-login');
  };

  return (
    <>
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{margin:0;background:#f8fafb}
        @keyframes blobA{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(28px,-18px)scale(1.04)}66%{transform:translate(-18px,14px)scale(.97)}
        @keyframes blobB{0%,100%{transform:translate(0,0)scale(1)}40%{transform:translate(-22px,26px)scale(1.03)}70%{transform:translate(18px,-8px)scale(.98)}
        @keyframes blobC{0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(14px,22px)scale(1.05)}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(34,197,94,.25);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(34,197,94,.45)}
        select option{background:#ffffff;color:#1e293b}
        @media(max-width:768px){
          .sidebar-desktop{display:none!important}
          .mobile-menu-btn{display:flex!important}
          .topnav-search{display:none!important}
        }
      `}</style> */}

      {/* Fixed animated background */}
      <AnimatedBg/>

      <div style={{ 
        display: "flex", 
        height: "100vh", 
        overflow: "hidden", 
        fontFamily: "'DM Sans', sans-serif", 
        position: "relative", 
        zIndex: 1 
      }}>

        {/* Mobile sidebar overlay */}
        {mobileSidebar && (
          <div style={{ 
            position: "fixed", 
            inset: 0, 
            background: "rgba(0,0,0,.7)", 
            zIndex: 40, 
            backdropFilter: "blur(4px)" 
          }} onClick={() => setMobileSidebar(false)}/>
        )}

        {/* Mobile sidebar */}
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          bottom: 0, 
          zIndex: 41, 
          transform: mobileSidebar ? "translateX(0)" : "translateX(-100%)", 
          transition: "transform .3s" 
        }}>
          <SuperAdminSidebar 
            active={active} 
            onNav={handleNav} 
            collapsed={false} 
            onToggle={() => setMobileSidebar(false)} 
          />
        </div>

        {/* Desktop sidebar */}
        <div className="sidebar-desktop" style={{ flexShrink: 0, position: "relative", zIndex: 10 }}>
          <SuperAdminSidebar 
            active={active} 
            onNav={handleNav} 
            collapsed={collapsed} 
            onToggle={() => setCollapsed(c => !c)} 
          />
        </div>

        {/* Main content */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          minWidth: 0, 
          overflow: "hidden" 
        }}>
          <SuperAdminTopNav 
            active={active} 
            onMobileMenu={() => setMobileSidebar(true)} 
            onLogout={handleLogout} 
          />
          <main style={{ 
            flex: 1, 
            overflowY: "auto", 
            // padding: 20 
          }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
