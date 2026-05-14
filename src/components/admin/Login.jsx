export const LeftScreen = () => {
    return (
        <div className="flex-1 bg-[#1f5377] flex flex-col justify-center text-white px-10 py-16 pt-20">
            <h1 className="text-3xl font-bold mb-6">
                Empowering <span className="text-yellow-300">Admin Excellence</span>
            </h1>

            <p className="text-white/90 mb-10 max-w-xl">
                Streamline, supervise, and scale your recruitment ecosystem. Manage every
                candidate, client, and vendor — all in one smart platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                {/* Card 1 */}
                <div className="bg-[#31668a] p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-1">Real-time Insights</h3>
                    <p className="text-white/80 text-sm">
                        Get live analytics and actionable hiring data.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#31668a] p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-1">Workflow Control</h3>
                    <p className="text-white/80 text-sm">
                        Oversee operations and approvals effortlessly.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#31668a] p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-1">Secure Access</h3>
                    <p className="text-white/80 text-sm">
                        Enterprise‑grade security for your team and data.
                    </p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#31668a] p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-1">Optimized Performance</h3>
                    <p className="text-white/80 text-sm">
                        Fast, intuitive, and scalable admin operations.
                    </p>
                </div>
            </div>

            <div className="mt-10 p-4 bg-[#31668a] rounded-lg max-w-xl">
                <p className="text-white/90 text-sm">
                    Take control. Drive decisions with data and empower your team to achieve
                    more with eBench.
                </p>
            </div>
        </div>
    )
}


import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowRight, Briefcase, Shield, Users, TrendingUp, Zap } from "lucide-react";
import { useAdminLoginMutation } from "../../redux/services/adminApi";
import { setCredentials } from "../../redux/Slices/AuthSlice";

/* ─────────────────────────────────────────────
   Floating metric pill (decorative)
───────────────────────────────────────────── */
const Pill = ({ icon: Icon, val, label, style }) => (
    <div style={{
        position: "absolute", display: "flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
        backdropFilter: "blur(16px)", borderRadius: 100, padding: "7px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,.3)", ...style,
    }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(99,102,241,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={11} color="#a5b4fc" />
        </div>
        <span style={{ color: "rgba(226,232,240,.85)", fontSize: 12.5, fontWeight: 600 }}>{val}</span>
        <span style={{ color: "rgba(148,163,184,.4)", fontSize: 12 }}>{label}</span>
    </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function AdminLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ── RTK Query mutation ──
    const [adminLogin, { isLoading, isError, error: rtkError }] = useAdminLoginMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);
    const [localError, setLocalError] = useState(""); // client-side validation errors
    const [success, setSuccess] = useState(false);
    const [focus, setFocus] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    console.log("rtkError", rtkError);
    // Derive the error message to display:
    // Priority → localError → RTK server error
    const displayError =
        localError ||
        (isError
            ? rtkError?.data?.message ||
            rtkError?.data?.detail ||
            rtkError?.error ||
            "Invalid credentials. Please try again."
            : "");

    /* ── Form submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        // Client-side validation
        if (!email || !password) return setLocalError("Please fill in all fields.");
        if (!/\S+@\S+\.\S+/.test(email)) return setLocalError("Enter a valid email address.");
        if (password.length < 6) return setLocalError("Password must be at least 6 characters.");

        try {
            const result = await adminLogin({ email, password }).unwrap();
            // debugger;

            // Store credentials in Redux (authSlice)
            if (result?.access_token) {
                dispatch(
                    setCredentials({
                        token: result?.access_token,
                        user: result?.role,
                        detail: {
                            name: result?.name,
                            email: result?.email,
                        },
                    })
                );
            }


            setSuccess(true);
            if (result?.error) {
                toast.error(result?.error?.data?.detail ?? "Invalid email or password")
                return null;
            }

            setTimeout(() => navigate("/superadmin/dashboard"), 1200);
            // debugger;

        } catch (err) {
            console.error("Login failed:", err);
            toast.error(err?.data?.details ?? "Error occurred..")
        }
    };

    /* ── Shared input style ── */
    const inputStyle = (field) => ({
        width: "100%",
        background: focus === field ? "#f5f7ff" : "#f8fafc",
        border: `1.5px solid ${focus === field ? "#6366f1" : "#e2e8f0"}`,
        borderRadius: 11, padding: "11px 14px", color: "#1e293b", fontSize: 14,
        outline: "none", transition: "all .2s", fontFamily: "'DM Sans',sans-serif",
        boxShadow: focus === field ? "0 0 0 3px rgba(99,102,241,.1)" : "none",
    });

    /* ─────────────────────────────────────────────
       Render
    ───────────────────────────────────────────── */
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{margin:0}
        @keyframes blobA{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(28px,-18px)scale(1.05)}66%{transform:translate(-18px,14px)scale(.97)}}
        @keyframes blobB{0%,100%{transform:translate(0,0)scale(1)}40%{transform:translate(-22px,26px)scale(1.04)}70%{transform:translate(18px,-8px)scale(.98)}}
        @keyframes blobC{0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(14px,22px)scale(1.06)}}
        @keyframes ringR{to{transform:translate(-50%,-50%)rotate(360deg)}}
        @keyframes ringL{to{transform:translate(-50%,-50%)rotate(-360deg)}}
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spinBtn{to{transform:rotate(360deg)}}
        .u0{animation:up .5s cubic-bezier(.22,1,.36,1) .05s both}
        .u1{animation:up .5s cubic-bezier(.22,1,.36,1) .12s both}
        .u2{animation:up .5s cubic-bezier(.22,1,.36,1) .19s both}
        .u3{animation:up .5s cubic-bezier(.22,1,.36,1) .26s both}
        .u5{animation:up .5s cubic-bezier(.22,1,.36,1) .40s both}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px #f8fafc inset!important;-webkit-text-fill-color:#1e293b!important}
        .submit-btn:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 14px 44px rgba(99,102,241,.5)!important}
        .submit-btn:not(:disabled):active{transform:scale(.99)}
        ::placeholder{color:#94a3b8}
      `}</style>

            <div style={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#090a13", fontFamily: "'DM Sans',sans-serif", overflow: "hidden", position: "relative", padding: "24px 16px" }}>

                {/* ── Animated background ── */}
                <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                    <div style={{ position: "absolute", top: "5%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.17) 0%,transparent 70%)", animation: "blobA 16s ease-in-out infinite" }} />
                    <div style={{ position: "absolute", bottom: "8%", right: "8%", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.13) 0%,transparent 70%)", animation: "blobB 20s ease-in-out infinite" }} />
                    <div style={{ position: "absolute", top: "50%", left: "52%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 70%)", animation: "blobC 24s ease-in-out infinite" }} />
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,.17) 1px,transparent 1px)", backgroundSize: "36px 36px", opacity: .45 }} />
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 85% 85% at 50% 50%,transparent 35%,rgba(9,10,19,.97) 100%)" }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", width: 780, height: 780, borderRadius: "50%", border: "1px solid rgba(99,102,241,.07)", transform: "translate(-50%,-50%)", animation: "ringR 70s linear infinite" }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", width: 1020, height: 1020, borderRadius: "50%", border: "1px solid rgba(99,102,241,.05)", transform: "translate(-50%,-50%)", animation: "ringL 100s linear infinite" }} />
                </div>

                {/* ── Floating metric pills ── */}
                {mounted && <>
                    <Pill icon={Users} val="100+" label="employees management" style={{ top: "17%", left: "7%", animation: "blobA 14s ease-in-out 2s infinite" }} />
                    <Pill icon={TrendingUp} val="100%" label="subscription management" style={{ top: "26%", right: "6%", animation: "blobB 17s ease-in-out 0s infinite" }} />
                    <Pill icon={Zap} val="340+" label="campus management" style={{ bottom: "20%", left: "6%", animation: "blobC 19s ease-in-out 1s infinite" }} />
                    <Pill icon={Shield} val="99.9%" label="real time system feedback" style={{ bottom: "27%", right: "5%", animation: "blobA 21s ease-in-out 3s infinite" }} />
                </>}

                {/* ── Logo ── */}
                <div className={mounted ? "u0" : ""} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, opacity: mounted ? undefined : 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #426190 0%, #5799db 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 22px rgba(99,102,241,.5)" }}>
                        <Briefcase size={18} color="#fff" />
                    </div>
                    <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 21, letterSpacing: "-0.5px" }}>
                        eBench<span style={{ color: "linear-gradient(135deg, #426190 0%, #5799db 100%)" }}>.campu</span>
                    </span>
                    <span style={{ color: "#fff", fontSize: 11.5, marginLeft: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, alignSelf: "flex-end", marginBottom: 2 }}>Admin</span>
                </div>

                {/* ── Card shell (glow border) ── */}
                <div className={mounted ? "u1" : ""} style={{ position: "relative", width: "100%", maxWidth: 420, opacity: mounted ? undefined : 0 }}>
                    <div style={{ position: "absolute", inset: -1, borderRadius: 26, background: "linear-gradient(135deg,rgba(99,102,241,.25),rgba(59,130,246,.13),transparent 60%)", zIndex: 0 }} />

                    {/* ── White inner card ── */}
                    <div style={{ position: "relative", zIndex: 1, background: "#ffffff", borderRadius: 24, boxShadow: "0 40px 90px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.12)", overflow: "hidden" }}>

                        {/* Top accent stripe */}
                        <div style={{ height: 4, background: "linear-gradient(90deg,#6366f1,#3b82f6,#8b5cf6)", width: "100%" }} />

                        <div style={{ padding: "32px 30px 28px" }}>

                            {/* Heading */}
                            <div className={mounted ? "u2" : ""} style={{ marginBottom: 26, opacity: mounted ? undefined : 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Shield size={15} color="#6366f1" />
                                    </div>
                                    <span style={{ color: "#6366f1", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Secure Admin Access</span>
                                </div>
                                <h1 style={{ color: "#0f172a", fontWeight: 700, fontSize: 22, marginBottom: 5, letterSpacing: "-0.4px" }}>Welcome back, Admin</h1>
                                <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.55 }}>Sign in to your eBench.campu workspace to continue.</p>
                            </div>

                            {/* Error banner */}
                            {displayError && (
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "10px 13px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>
                                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                                    {displayError}
                                </div>
                            )}

                            {/* Success banner */}
                            {success && (
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 11, padding: "10px 13px", marginBottom: 16, color: "#16a34a", fontSize: 13 }}>
                                    <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                                    Login successful! Redirecting to dashboard…
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} noValidate className={mounted ? "u3" : ""} style={{ opacity: mounted ? undefined : 0 }}>

                                {/* Email */}
                                <div style={{ marginBottom: 14 }}>
                                    <label style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: "0.02em" }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        placeholder="admin@company.com"
                                        disabled={isLoading || success}
                                        onFocus={() => setFocus("email")}
                                        onBlur={() => setFocus(null)}
                                        onChange={e => { setEmail(e.target.value); setLocalError(""); }}
                                        style={inputStyle("email")}
                                    />
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: 6 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                        <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>Password</label>
                                        <span onClick={() => navigate('/admin/forget-password')} className=" cursor-pointer" style={{ color: "#6366f1", fontSize: 12.5, fontWeight: 500, textDecoration: "none" }}
                                            onMouseEnter={e => e.currentTarget.style.color = "#4f46e5"}
                                            onMouseLeave={e => e.currentTarget.style.color = "#6366f1"}>
                                            Forgot password?
                                        </span>
                                    </div>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showPw ? "text" : "password"}
                                            autoComplete="current-password"
                                            value={password}
                                            placeholder="Enter your password"
                                            disabled={isLoading || success}
                                            onFocus={() => setFocus("pw")}
                                            onBlur={() => setFocus(null)}
                                            onChange={e => { setPassword(e.target.value); setLocalError(""); }}
                                            style={{ ...inputStyle("pw"), paddingRight: 42 }}
                                        />
                                        <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}
                                            style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", padding: 2, transition: "color .2s" }}
                                            onMouseEnter={e => e.currentTarget.style.color = "#6366f1"}
                                            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember me */}
                                <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "16px 0 22px" }}>
                                    <div onClick={() => setRemember(!remember)} style={{
                                        width: 17, height: 17, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                                        border: `1.5px solid ${remember ? "#6366f1" : "#cbd5e1"}`,
                                        background: remember ? "#6366f1" : "#fff",
                                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
                                        boxShadow: remember ? "0 0 0 3px rgba(99,102,241,.15)" : "none",
                                    }}>
                                        {remember && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 3.5L3.8 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span onClick={() => setRemember(!remember)} style={{ color: "#64748b", fontSize: 13, cursor: "pointer", userSelect: "none" }}>
                                        Keep me signed in for 30 days
                                    </span>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading || success}
                                    className="submit-btn"
                                    style={{
                                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                        background: isLoading || success ? "rgba(99,102,241,.5)" : "linear-gradient(135deg, #426190 0%, #5799db 100%)",
                                        border: "none", borderRadius: 12, padding: "13px 20px",
                                        color: "#fff", fontSize: 14, fontWeight: 600,
                                        cursor: isLoading || success ? "not-allowed" : "pointer",
                                        transition: "all .25s", fontFamily: "'DM Sans',sans-serif",
                                        boxShadow: isLoading || success ? "none" : "0 8px 28px rgba(99,102,241,.38)",
                                    }}
                                >
                                    {isLoading
                                        ? <><Loader2 size={15} style={{ animation: "spinBtn 1s linear infinite" }} /> Authenticating…</>
                                        : success
                                            ? <><CheckCircle2 size={15} /> Signed In</>
                                            : <>Sign In to Dashboard <ArrowRight size={15} /></>
                                    }
                                </button>
                            </form>

                            {/* Footer */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20 }}>
                                <Shield size={12} color="#94a3b8" />
                                <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
                                    Enterprise-grade security ·{" "}
                                    <a href="#" onClick={e => e.preventDefault()} style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</a>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Help line */}
                <p className={mounted ? "u5" : ""} style={{ marginTop: 18, color: "rgba(148,163,184,.35)", fontSize: 12, opacity: mounted ? undefined : 0 }}>
                    Having trouble?{" "}
                    <a href="#" onClick={e => e.preventDefault()} style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>Contact IT Support</a>
                </p>

                {/* Brand footer */}
                <div className={mounted ? "u5" : ""} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, opacity: mounted ? undefined : 0 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(99,102,241,.5)" }} />
                    <span style={{ color: "rgba(148,163,184,.2)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>eBench.campu — Enterprise HRMS &amp; ATS</span>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(99,102,241,.5)" }} />
                </div>

            </div>
        </>
    );
}
