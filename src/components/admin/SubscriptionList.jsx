import { useState } from 'react'
import { useGetSubscriptionsQuery } from '../../redux/services/adminApi'
import Loader from '../../libs/Loader';
import { Pagination } from '../../page/vendor/user/UserManagement';
import useDebounce from '../../libs/useDebounce';
import SubscriptionModule from '../../page/AdminSubscription';

import { LayoutDashboard, Users, Search, Globe, CreditCard, Clock, DollarSign, TrendingUp } from "lucide-react";
import { T } from './superadmin/SuperAdminDashboard';

const SubscriptionList = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [planType, setPlanType] = useState("global"); // global | country
    const debouncedQuery = useDebounce(search, 500);

    const { data, isLoading } = useGetSubscriptionsQuery({ plan: debouncedQuery, page, size: pageSize });

    // Select plans based on toggle
    const subscription =
        planType === "country"
            ? data?.country_plans?.items ?? []
            : data?.global_plans?.items ?? [];

    const total =
        planType === "country"
            ? data?.country_plans?.total ?? 0
            : data?.global_plans?.total ?? 0;

    // Stats calculations
    const totalCredits = subscription.reduce((sum, plan) => sum + (plan.credits || 0), 0);
    const avgPrice = subscription.length > 0 
        ? (subscription.reduce((sum, plan) => sum + (plan.price || 0), 0) / subscription.length).toFixed(2)
        : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                flexWrap: "wrap", 
                gap: 12,
                background: "linear-gradient(135deg,rgba(34,197,94,.1),rgba(16,185,129,.05))",
                padding: "20px 24px",
                borderRadius: 16,
                border: `1px solid ${T.border}`
            }}>
                <div>
                    <h1 style={{ 
                        color: T.text, 
                        fontWeight: 800, 
                        fontSize: 22, 
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <CreditCard size={24} style={{ color: T.accent }}/>
                        Subscription Plans
                    </h1>
                    <p style={{ color: T.textMuted, fontSize: 13 }}>
                        Manage global and country-specific subscription plans
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        borderRadius: 12,
                        background: "rgba(34,197,94,.08)",
                        border: `1px solid ${T.border}`
                    }}>
                        <Globe size={16} style={{ color: T.accent }}/>
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                            {total} Plans
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
                <div style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: "18px 20px",
                    boxShadow: "0 4px 16px rgba(0,0,0,.04)",
                    transition: "all .3s",
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.04)";
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${T.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CreditCard size={18} style={{ color: T.accent }}/>
                        </div>
                    </div>
                    <h3 style={{ color: T.text, fontWeight: 800, fontSize: 22, marginBottom: 2 }}>{total}</h3>
                    <p style={{ color: T.textMuted, fontSize: 12, fontWeight: 500 }}>Total Plans</p>
                </div>

                <div style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: "18px 20px",
                    boxShadow: "0 4px 16px rgba(0,0,0,.04)",
                    transition: "all .3s",
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.04)";
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(59,130,246,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TrendingUp size={18} style={{ color: "#3b82f6" }}/>
                        </div>
                    </div>
                    <h3 style={{ color: T.text, fontWeight: 800, fontSize: 22, marginBottom: 2 }}>{totalCredits.toLocaleString()}</h3>
                    <p style={{ color: T.textMuted, fontSize: 12, fontWeight: 500 }}>Total Credits</p>
                </div>

                <div style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: "18px 20px",
                    boxShadow: "0 4px 16px rgba(0,0,0,.04)",
                    transition: "all .3s",
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.04)";
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(251,191,36,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <DollarSign size={18} style={{ color: T.gold }}/>
                        </div>
                    </div>
                    <h3 style={{ color: T.text, fontWeight: 800, fontSize: 22, marginBottom: 2 }}>${avgPrice}</h3>
                    <p style={{ color: T.textMuted, fontSize: 12, fontWeight: 500 }}>Avg Price</p>
                </div>

                <div style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: "18px 20px",
                    boxShadow: "0 4px 16px rgba(0,0,0,.04)",
                    transition: "all .3s",
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.04)";
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(139,92,246,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Clock size={18} style={{ color: "#8b5cf6" }}/>
                        </div>
                    </div>
                    <h3 style={{ color: T.text, fontWeight: 800, fontSize: 22, marginBottom: 2 }}>{planType === "global" ? "Global" : "Country"}</h3>
                    <p style={{ color: T.textMuted, fontSize: 12, fontWeight: 500 }}>Plan Type</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,.04)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Search */}
                    <div style={{ position: "relative" }}>
                        <Search size={14} style={{ 
                            position: "absolute", 
                            left: 12, 
                            top: "50%", 
                            transform: "translateY(-50%)", 
                            color: "rgba(100,116,139,.35)", 
                            pointerEvents: "none" 
                        }}/>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search plan by country name"
                            style={{
                                background: "rgba(34,197,94,.04)",
                                border: `1px solid ${T.borderSoft}`,
                                borderRadius: 10,
                                padding: "8px 12px 8px 36px",
                                width: 280,
                                fontSize: 13,
                                color: T.text,
                                outline: "none",
                                transition: "all .2s"
                            }}
                            onFocus={e => {
                                e.target.style.border = `1px solid ${T.border}`;
                                e.target.style.background = "rgba(34,197,94,.08)";
                            }}
                            onBlur={e => {
                                e.target.style.border = `1px solid ${T.borderSoft}`;
                                e.target.style.background = "rgba(34,197,94,.04)";
                            }}
                        />
                    </div>

                    {/* Toggle */}
                    <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,.04)", padding: 4, borderRadius: 10, border: `1px solid ${T.borderSoft}` }}>
                        <button
                            onClick={() => setPlanType("global")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "8px 16px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all .2s",
                                background: planType === "global" ? "linear-gradient(135deg,rgb(34,197,94),rgb(22,163,74))" : "transparent",
                                border: "none",
                                color: planType === "global" ? "#fff" : T.textMuted,
                                boxShadow: planType === "global" ? "0 4px 14px rgba(34,197,94,.25)" : "none",
                                fontFamily: "'DM Sans',sans-serif"
                            }}
                        >
                            <Globe size={13}/>
                            Global Plans
                        </button>

                        <button
                            onClick={() => setPlanType("country")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "8px 16px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all .2s",
                                background: planType === "country" ? "linear-gradient(135deg,rgb(34,197,94),rgb(22,163,74))" : "transparent",
                                border: "none",
                                color: planType === "country" ? "#fff" : T.textMuted,
                                boxShadow: planType === "country" ? "0 4px 14px rgba(34,197,94,.25)" : "none",
                                fontFamily: "'DM Sans',sans-serif"
                            }}
                        >
                            <Globe size={13}/>
                            Country Plans
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset",
                overflow: "hidden"
            }}>
                <div style={{ height: 3, background: "linear-gradient(90deg,#22c55e,#16a34a,#10b981)", width: "100%" }}/>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${T.borderSoft}`, background: "rgba(255,255,255,.02)" }}>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Plan Name</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Duration</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Country</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Credits</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Price</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Price / Credit</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                                        <Loader />
                                    </td>
                                </tr>
                            ) : subscription.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: T.textMuted, fontSize: 13 }}>
                                        No subscription plans found
                                    </td>
                                </tr>
                            ) : (
                                subscription.map((plan, index) => (
                                    <tr
                                        key={plan.id}
                                        style={{ borderBottom: `1px solid rgba(255,255,255,.04)`, transition: "background .15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,.03)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "16px 18px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ 
                                                    width: 36, 
                                                    height: 36, 
                                                    borderRadius: 10, 
                                                    background: `${T.accent}15`, 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center" 
                                                }}>
                                                    <CreditCard size={16} style={{ color: T.accent }}/>
                                                </div>
                                                <span style={{ color: T.text, fontWeight: 600, fontSize: 13 }}>
                                                    {plan.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 18px", fontSize: 13, color: T.textMuted }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <Clock size={13} style={{ color: T.textDim }}/>
                                                {plan.duration_days} days
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 18px" }}>
                                            <span style={{ 
                                                display: "inline-flex", 
                                                alignItems: "center", 
                                                gap: 4, 
                                                padding: "4px 10px", 
                                                borderRadius: 8, 
                                                fontSize: 11.5, 
                                                fontWeight: 600, 
                                                background: plan.country ? `${T.accent}15` : "rgba(139,92,246,.12)", 
                                                color: plan.country ? T.accent : "#8b5cf6", 
                                                border: `1px solid ${plan.country ? `${T.accent}25` : "rgba(139,92,246,.3)"}` 
                                            }}>
                                                <Globe size={11}/>
                                                {plan.country ?? "Global"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px 18px", fontSize: 13, color: T.textMuted }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <TrendingUp size={13} style={{ color: T.textDim }}/>
                                                {plan.credits}
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 18px", fontSize: 13, color: T.textMuted }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <DollarSign size={13} style={{ color: T.gold }}/>
                                                {plan.price} {plan.currency}
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px 18px", fontSize: 13, fontWeight: 600, color: T.text }}>
                                            {plan.price_per_credit}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {
                    planType === "country" &&
                    <div style={{ 
                        padding: "16px 20px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        borderTop: `1px solid ${T.borderSoft}` 
                    }}>
                        <div style={{ fontSize: 13, color: T.textMuted }}>
                            Showing <span style={{ fontWeight: 600, color: T.text }}>{subscription.length}</span> of <span style={{ fontWeight: 600, color: T.text }}>{total}</span> plans
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${T.border}`,
                                    background: "rgba(34,197,94,.04)",
                                    color: T.text,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    outline: "none"
                                }}
                            >
                                {[10, 20, 50].map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>

                            <Pagination
                                page={page}
                                totalPages={Math.ceil(total / pageSize)}
                                setPage={setPage}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};


const AdminSubscriptionManagement = () => {
    const [activeTab, setActiveTab] = useState("view");
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
          { id: "view", label: "View Subscription", icon: LayoutDashboard },
          { id: "update", label: "Manage Subsctipion", icon: Users },
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
              background: activeTab === tab.id ?  "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))" : "transparent", 
              border: "none", 
              color: activeTab === tab.id ? "#fff" : T.textMuted, 
              boxShadow: activeTab === tab.id ? "0 4px 14px #48a74866" : "none", 
              fontFamily: "'DM Sans',sans-serif" 
            }}
          >
            <tab.icon size={14}/>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "view" && <SubscriptionList/>}
      {activeTab === "update" && <SubscriptionModule/>}
    </div>
  );
};

export default AdminSubscriptionManagement;

