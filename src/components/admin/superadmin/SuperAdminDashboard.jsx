import { useState } from "react";
import {
  LayoutDashboard, Users, Building2, Shield, Settings, Activity,
  TrendingUp, AlertCircle, CheckCircle, XCircle, Globe, Database,
  Lock, Eye, Download, RefreshCw, BarChart3, PieChart, Zap,
  Crown, Key, UserCheck, Server, Cloud, Cpu, HardDrive
} from "lucide-react";

/* ════════════════════════════════════════════
   SUPERADMIN THEME TOKENS (Light Green Theme)
════════════════════════════════════════════ */
export const T = {
  bg: "#f8fafb",
  surface: "#ffffff",
  border: "rgba(34,197,94,.15)",
  borderSoft: "rgba(34,197,94,.08)",
  text: "#118f5a",
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
   SUPERADMIN DUMMY DATA
════════════════════════════════════════════ */
const SYSTEM_STATS = [
  { label: "Total Users", value: "15,847", icon: Users, color: "#8b5cf6", trend: 12.5, sub: "All roles combined" },
  { label: "Active Campuses", value: "124", icon: Building2, color: "#3b82f6", trend: 8.3, sub: "Across 28 states" },
  { label: "System Health", value: "98.2%", icon: Activity, color: "#10b981", trend: 2.1, sub: "Optimal performance" },
  { label: "Data Storage", value: "2.4TB", icon: Database, color: "#f59e0b", trend: 15.7, sub: "Used of 5TB" },
  { label: "API Calls", value: "1.2M", icon: Globe, color: "#06b6d4", trend: 24.3, sub: "Last 30 days" },
  { label: "Security Score", value: "A+", icon: Shield, color: "#10b981", trend: 0, sub: "No vulnerabilities" },
];

const ADMIN_USERS = [
  { id: 1, name: "Super Admin", email: "superadmin@ebench.ai", role: "superadmin", status: "active", lastLogin: "2 hours ago", permissions: "full" },
  { id: 2, name: "John Smith", email: "john@ebench.ai", role: "admin", status: "active", lastLogin: "1 day ago", permissions: "campus,students" },
  { id: 3, name: "Sarah Johnson", email: "sarah@ebench.ai", role: "admin", status: "active", lastLogin: "3 days ago", permissions: "campus,students,tests" },
  { id: 4, name: "Mike Wilson", email: "mike@ebench.ai", role: "admin", status: "inactive", lastLogin: "2 weeks ago", permissions: "campus" },
];

const SYSTEM_LOGS = [
  { id: 1, type: "security", message: "Super admin login from IP 192.168.1.1", time: "5 min ago", severity: "info" },
  { id: 2, type: "system", message: "Database backup completed successfully", time: "1 hour ago", severity: "success" },
  { id: 3, type: "security", message: "Failed login attempt for admin account", time: "2 hours ago", severity: "warning" },
  { id: 4, type: "system", message: "Server memory usage at 78%", time: "3 hours ago", severity: "info" },
  { id: 5, type: "error", message: "API rate limit exceeded for user 1234", time: "5 hours ago", severity: "error" },
];

const PERFORMANCE_DATA = [
  { metric: "Response Time", value: "124ms", status: "good", icon: Zap },
  { metric: "Uptime", value: "99.9%", status: "excellent", icon: Server },
  { metric: "CPU Usage", value: "45%", status: "good", icon: Cpu },
  { metric: "Memory", value: "62%", status: "good", icon: HardDrive },
];

/* ════════════════════════════════════════════
   SUPERADMIN COMPONENTS
════════════════════════════════════════════ */
const SuperAdminCard = ({ title, children, style = {} }) => (
  <div style={{
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset",
    overflow: "hidden",
    transition: "all .3s",
    ...style,
  }}>
    <div style={{ height: 3, background: "linear-gradient(90deg,#22c55e,#16a34a,#10b981)", width: "100%" }} />
    <div style={{ padding: 20 }}>{children}</div>
  </div>
);

const SuperAdminStatCard = ({ title, value, icon: Icon, color, trend, sub }) => (
  <div style={{
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 18,
    padding: "20px 22px",
    boxShadow: "0 8px 24px rgba(0,0,0,.06)",
    transition: "all .3s",
    cursor: "default",
  }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.12)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.06)";
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${color}25` }}>
        <Icon size={20} style={{ color }} />
      </div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 8, background: trend === "up" ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)", color: trend === "up" ? T.accent : "#ef4444", fontSize: 12, fontWeight: 600 }}>
          {trend === "up" ? "↑" : "↓"} {trend.value}%
        </div>
      )}
    </div>
    <h3 style={{ color: T.text, fontWeight: 800, fontSize: 24, marginBottom: 4 }}>{value}</h3>
    <p style={{ color: T.textMuted, fontSize: 13, fontWeight: 500, marginBottom: sub ? 8 : 0 }}>{title}</p>
    {sub && <p style={{ color: T.textDim, fontSize: 11.5 }}>{sub}</p>}
  </div>
);

const SuperAdminButton = ({ children, icon: Icon, onClick, variant = "primary", style = {} }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", border: "none" },
    secondary: { background: "rgba(34,197,94,.08)", color: T.accent, border: `1px solid ${T.accent}30` },
    danger: { background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", border: "none" },
  };
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'DM Sans',sans-serif",
        cursor: "pointer",
        transition: "all .2s",
        border: v.border,
        background: v.background,
        color: v.color,
        boxShadow: variant === "primary" ? "0 4px 16px rgba(34,197,94,.25)" : "none",
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-1px)";
        if (variant === "secondary") e.currentTarget.style.background = "rgba(34,197,94,.12)";
        if (variant === "danger") e.currentTarget.style.boxShadow = "0 6px 20px rgba(239,68,68,.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        if (variant === "secondary") e.currentTarget.style.background = "rgba(34,197,94,.08)";
        if (variant === "danger") e.currentTarget.style.boxShadow = "0 4px 16px rgba(239,68,68,.25)";
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    Active: { bg: "rgba(34,197,94,.12)", color: T.accent, border: `1px solid ${T.accent}30` },
    Inactive: { bg: "rgba(148,163,184,.08)", color: T.textMuted, border: `1px solid rgba(148,163,184,.2)` },
    Pending: { bg: "rgba(251,191,36,.12)", color: T.gold, border: `1px solid ${T.gold}30` },
    Completed: { bg: "rgba(34,197,94,.12)", color: T.accent, border: `1px solid ${T.accent}30` },
    Failed: { bg: "rgba(239,68,68,.12)", color: "#ef4444", border: `1px solid rgba(239,68,68,.3)` },
    SuperAdmin: { bg: "rgba(34,197,94,.12)", color: T.accent, border: `1px solid ${T.accent}30` },
    Admin: { bg: "rgba(59,130,246,.12)", color: "#3b82f6", border: `1px solid rgba(59,130,246,.3)` },
    Moderator: { bg: "rgba(251,191,36,.12)", color: T.gold, border: `1px solid ${T.gold}30` },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: 8,
      fontSize: 11.5,
      fontWeight: 600,
      background: s.bg,
      color: s.color,
      border: s.border,
    }}>
      {status}
    </span>
  );
};

/* ════════════════════════════════════════════
   SUPERADMIN DASHBOARD COMPONENT
════════════════════════════════════════════ */
export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderOverview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        background: "linear-gradient(135deg,rgba(34,197,94,.1),rgba(167,139,250,.05))",
        padding: "20px 24px",
        borderRadius: 16,
        border: `1px solid ${T.border}`
      }}>
        <div>
          <h1 style={{
            color: T.text,
            fontWeight: 800,
            fontSize: 24,
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <Crown size={28} style={{ color: T.gold }} />
            Super Admin Dashboard
          </h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>
            Full system control and monitoring • {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SuperAdminButton icon={RefreshCw} variant="secondary">Refresh</SuperAdminButton>
          <SuperAdminButton icon={Download} variant="primary">Export Report</SuperAdminButton>
          {/* <SuperAdminButton icon={Download} gold>Export Report</SuperAdminButton> */}
        </div>
      </div>

      {/* System Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
        {SYSTEM_STATS.map(stat => <SuperAdminStatCard key={stat.label} {...stat} />)}
      </div>

      {/* Performance Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SuperAdminCard>
          <h3 style={{ color: T.text, fontWeight: 700, fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={18} style={{ color: T.accent }} />
            Performance Metrics
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {PERFORMANCE_DATA.map(item => (
              <div key={item.metric} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${T.borderSoft}`
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `${T.accent}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <item.icon size={16} style={{ color: T.accent }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{item.value}</p>
                  <p style={{ fontSize: 11, color: T.textMuted }}>{item.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        <SuperAdminCard>
          <h3 style={{ color: T.text, fontWeight: 700, fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={18} style={{ color: T.gold }} />
            Security Overview
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Firewall Status", value: "Active", status: "good" },
              { label: "SSL Certificate", value: "Valid", status: "good" },
              { label: "Failed Logins (24h)", value: "12", status: "warning" },
              { label: "Security Updates", value: "Current", status: "excellent" },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${T.borderSoft}`
              }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>{item.label}</span>
                <StatusBadge status={item.status} type="security" />
              </div>
            ))}
          </div>
        </SuperAdminCard>
      </div>

      {/* System Logs */}
      <SuperAdminCard>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ color: T.text, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={18} style={{ color: T.accent }} />
            Recent System Activity
          </h3>
          <SuperAdminButton icon={Eye} variant="secondary">View All</SuperAdminButton>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SYSTEM_LOGS.map(log => (
            <div key={log.id} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,.02)",
              border: `1px solid ${T.borderSoft}`,
              transition: "background .15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.02)"}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: log.severity === "error" ? "rgba(239,68,68,.12)" :
                  log.severity === "warning" ? "rgba(245,158,11,.12)" :
                    log.severity === "success" ? "rgba(16,185,129,.12)" : "rgba(59,130,246,.12)"
              }}>
                {log.severity === "error" ? <XCircle size={13} color="#fca5a5" /> :
                  log.severity === "warning" ? <AlertCircle size={13} color="#fcd34d" /> :
                    log.severity === "success" ? <CheckCircle size={13} color="#6ee7b7" /> :
                      <Activity size={13} color="#93c5fd" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{log.message}</p>
                <p style={{ fontSize: 11.5, color: T.textDim, marginTop: 2 }}>{log.time}</p>
              </div>
              <StatusBadge status={log.severity} />
            </div>
          ))}
        </div>
      </SuperAdminCard>
    </div>
  );

  const renderUsers = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: T.text, fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <UserCheck size={22} style={{ color: T.accent }} />
          Admin User Management
        </h2>
        <SuperAdminButton icon={Users}>Add New Admin</SuperAdminButton>
      </div>

      <SuperAdminCard>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.borderSoft}`, background: "rgba(255,255,255,.02)" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>User</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Role</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Status</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Last Login</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_USERS.map(user => (
                <tr key={user.id} style={{ borderBottom: `1px solid rgba(255,255,255,.04)`, transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px" }}>
                    <div>
                      <p style={{ color: T.text, fontWeight: 600, fontSize: 13 }}>{user.name}</p>
                      <p style={{ fontSize: 11.5, color: T.textDim }}>{user.email}</p>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: 99,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: user.role === "superadmin" ? `${T.gold}20` : `${T.accent}15`,
                      color: user.role === "superadmin" ? T.gold : T.accent,
                      border: `1px solid ${user.role === "superadmin" ? `${T.gold}35` : `${T.accent}25`}`
                    }}>
                      {user.role === "superadmin" && <Crown size={11} />}
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <StatusBadge status={user.status} />
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: T.textMuted }}>
                    {user.lastLogin}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <SuperAdminButton icon={Eye} variant="secondary" size="sm">View</SuperAdminButton>
                      <SuperAdminButton icon={Settings} variant="secondary" size="sm">Edit</SuperAdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SuperAdminCard>
    </div>
  );

  const renderSettings = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ color: T.text, fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <Settings size={22} style={{ color: T.accent }} />
        System Settings
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SuperAdminCard>
          <h3 style={{ color: T.text, fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Security Configuration</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Two-Factor Authentication", enabled: true },
              { label: "Session Timeout", enabled: true },
              { label: "IP Whitelist", enabled: false },
              { label: "Audit Logging", enabled: true },
            ].map(setting => (
              <div key={setting.label} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${T.borderSoft}`
              }}>
                <span style={{ fontSize: 13, color: T.text }}>{setting.label}</span>
                <div style={{
                  width: 40,
                  height: 20,
                  borderRadius: 99,
                  background: setting.enabled ? "linear-gradient(135deg,#8b5cf6,#7c3aed)" : "rgba(255,255,255,.1)",
                  position: "relative",
                  cursor: "pointer",
                  boxShadow: setting.enabled ? "0 4px 12px rgba(139,92,246,.4)" : "none",
                  transition: "all .2s"
                }}>
                  <div style={{
                    position: "absolute",
                    top: 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 1px 4px rgba(0,0,0,.3)",
                    transition: "left .2s",
                    left: setting.enabled ? 22 : 2
                  }} />
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        <SuperAdminCard>
          <h3 style={{ color: T.text, fontWeight: 700, fontSize: 16, marginBottom: 16 }}>System Configuration</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Auto Backup", value: "Daily at 2:00 AM" },
              { label: "Log Retention", value: "30 days" },
              { label: "Max File Upload", value: "50MB" },
              { label: "API Rate Limit", value: "1000 req/min" },
            ].map(config => (
              <div key={config.label} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${T.borderSoft}`
              }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>{config.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{config.value}</span>
              </div>
            ))}
          </div>
        </SuperAdminCard>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      padding: 20,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: 4,
        background: "rgba(255,255,255,.04)",
        padding: 4,
        borderRadius: 14,
        width: "fit-content",
        marginBottom: 20,
        border: `1px solid ${T.borderSoft}`
      }}>
        {[
          { id: "overview", label: "System Overview", icon: LayoutDashboard },
          { id: "users", label: "Admin Users", icon: Users },
          { id: "settings", label: "System Settings", icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .2s",
              background: activeTab === tab.id ? "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))" : "transparent",
              border: "none",
              color: activeTab === tab.id ? "#fff" : T.textMuted,
              boxShadow: activeTab === tab.id ? "0 4px 14px #48a74866" : "none",
              fontFamily: "'DM Sans',sans-serif"
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "users" && renderUsers()}
      {activeTab === "settings" && renderSettings()}
    </div>
  );
}
