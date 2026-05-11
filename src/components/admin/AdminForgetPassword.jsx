// import { useState } from 'react'
// import Header from '../../page/Header'
// import { LeftScreen } from './Login'
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const AdminForgetPassword = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [adminRequestOTP, { isLoading, isError, isSuccess }] = useAdminForgotPasswordMutation()
//     const [formdata, setFormdata] = useState({
//         email: "",
//     })

//     const [showPassword, setShowPassword] = useState(false);
//     function changeHandler(e) {
//         const { name, value } = e.target;
//         setFormdata({
//             ...formdata,
//             [name]: value  
//         })
//     }

//     async function handleSubmit(e) {
//         e.preventDefault();
//         // console.log("formd",formdata)
//         try {
//             const result = await adminRequestOTP(formdata);
//             // console.log("res", result)
//             if (result?.data) {
//                 toast.success(result?.data?.message??"Admin Login Successfully..")
//                 setTimeout(() => {
//                     navigate(`/admin/otp-verify?email=${result?.data?.email}`)
//                 }, 1000)
//             }
//             if (result?.error) {
//                 toast.error(result?.error?.data?.detail ?? "Invalid email or password")
//                 return null;
//             }
//         } catch (err) {
//             // console.log("err", isError)
//             toast.error(err?.data?.detail??"Error occurred..")
//     }
// }

//     return (
//         <div className='min-h-screen w-full bg-white flex flex-col'>
//             <div className="flex flex-col md:flex-row  flex-1">
//                 {/* Left Section */}
//                 <LeftScreen />
//                 <form onSubmit={handleSubmit} className="flex-1 flex items-center justify-center py-10 bg-gray-50">
//                     <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
//                         <div className="flex flex-col items-center mb-6">
//                             <span className="text-4xl mb-2">🔑</span>
//                             <h2 className="text-2xl font-bold text-blue-950">Admin Password Recovery
//                             </h2>
//                             <p className="text-gray-500 text-xs text-center mt-1">
//                                 Enter your registered email address to reset your password and regain access to your secure admin dashboard.                            </p>
//                         </div>

//                         {/* Email */}
//                         <div className="mb-5">
//                             <label className="block text-gray-700 mb-1">Email Address</label>
//                             <input
//                                 type="email"
//                                 placeholder="Enter your email"
//                                 name="email"
//                                 required={true}
//                                 onChange={changeHandler}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             />
//                         </div>



//                         <button type="submit" disabled={isLoading} className="w-full bg-[#1f5377] hover:bg-[#17415c] text-white py-2 rounded-lg font-semibold shadow">
//                             {isLoading ? 'Loading...' : 'Submit'}
//                         </button>
//                     </div>
//                 </form>

//             </div>
//         </div>
//     )
// }

// export default AdminForgetPassword

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, KeyRound, Lock, Eye, EyeOff,
  Loader2, AlertCircle, CheckCircle2, ArrowRight,
  Briefcase, Shield, RefreshCw,
} from "lucide-react";


// ── Replace path with your actual API slice location ──
import {
  useAdminForgotPasswordMutation,
  useAdminResetAccessCodeMutation,
  useAdminResetPasswordMutation,
} from "../../redux/services/authApi";

/* ─────────────────────────────────────────────
   Step Indicator
───────────────────────────────────────────── */
const Steps = ({ current }) => {
  const steps = [
    { id: 1, label: "Email" },
    { id: 2, label: "Verify OTP" },
    { id: 3, label: "New Password" },
  ];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28 }}>
      {steps.map((s, i) => (
        <div key={s.id} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background: current > s.id
                ? "#6366f1"
                : current === s.id
                ? "linear-gradient(135deg,#6366f1,#4f46e5)"
                : "#f1f5f9",
              border:`2px solid ${current >= s.id ? "#6366f1" : "#e2e8f0"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: current === s.id ? "0 0 0 4px rgba(99,102,241,.15)" : "none",
              transition:"all .35s",
            }}>
              {current > s.id
                ? <CheckCircle2 size={14} color="#fff" />
                : <span style={{ fontSize:12, fontWeight:700, color: current === s.id ? "#fff" : "#94a3b8" }}>{s.id}</span>
              }
            </div>
            <span style={{ fontSize:11, fontWeight:600, color: current >= s.id ? "#6366f1" : "#94a3b8", letterSpacing:"0.03em" }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width:52, height:2, marginBottom:18,
              background: current > s.id ? "linear-gradient(90deg,#6366f1,#818cf8)" : "#e2e8f0",
              transition:"background .35s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   OTP Input — 6 individual boxes
───────────────────────────────────────────── */
const OtpInput = ({ value, onChange, disabled }) => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = val;
    onChange(next.join(""));
    if (val && i < 5) inputRefs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        next[i - 1] = "";
        onChange(next.join(""));
        inputRefs[i - 1].current?.focus();
      }
    } else if (e.key === "ArrowLeft"  && i > 0) { inputRefs[i - 1].current?.focus(); }
      else if (e.key === "ArrowRight" && i < 5) { inputRefs[i + 1].current?.focus(); }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6).replace(/ /g, ""));
    inputRefs[Math.min(pasted.length, 5)].current?.focus();
  };

  return (
    <div style={{ display:"flex", gap:10, justifyContent:"center", margin:"6px 0" }}>
      {digits.map((d, i) => (
        <input
          key={i} ref={inputRefs[i]}
          type="text" inputMode="numeric" maxLength={1}
          value={d} disabled={disabled}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width:46, height:52, borderRadius:12, textAlign:"center",
            fontSize:22, fontWeight:700, color:"#1e293b",
            background: d ? "#f0f4ff" : "#f8fafc",
            border:`2px solid ${d ? "#6366f1" : "#e2e8f0"}`,
            outline:"none", transition:"all .2s", fontFamily:"'DM Sans',sans-serif",
            boxShadow: d ? "0 0 0 3px rgba(99,102,241,.1)" : "none",
            caretColor:"#6366f1",
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Password Strength Bar
───────────────────────────────────────────── */
const StrengthBar = ({ password }) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:"flex", gap:4, marginBottom:4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i <= score ? colors[score] : "#e2e8f0", transition:"background .3s" }} />
        ))}
      </div>
      <span style={{ fontSize:11.5, color:colors[score], fontWeight:600 }}>{labels[score]}</span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function ForgotPassword() {
  const navigate = useNavigate();

  // ── RTK Query mutations ──
  const [sendOtp,       { isLoading: sendingOtp   }] = useAdminForgotPasswordMutation();
  const [verifyOtp,     { isLoading: verifyingOtp }] = useAdminResetAccessCodeMutation();
  const [resetPassword, { isLoading: resetting    }] = useAdminResetPasswordMutation();

  const isLoading = sendingOtp || verifyingOtp || resetting;

  // ── Form state ──
  const [step,            setStep]            = useState(1);
  const [email,           setEmail]           = useState("");
  const [otp,             setOtp]             = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [focus,           setFocus]           = useState(null);
  const [localError,      setLocalError]      = useState("");
  const [apiError,        setApiError]        = useState("");
  const [success,         setSuccess]         = useState(false);
  const [mounted,         setMounted]         = useState(false);
  const [countdown,       setCountdown]       = useState(0);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const clearErrors = () => { setLocalError(""); setApiError(""); };

  const extractError = (err) =>
    err?.data?.message ||
    err?.data?.detail  ||
    err?.data?.error   ||
    err?.error         ||
    "Something went wrong. Please try again.";

  const displayError = localError || apiError;

  /* ─────────────────────────────────────────────
     STEP 1 — Send OTP to email
     Hook  : adminRequestOTP
     Payload: { email }
  ───────────────────────────────────────────── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    if (!email)                         return setLocalError("Please enter your email address.");
    if (!/\S+@\S+\.\S+/.test(email))    return setLocalError("Enter a valid email address.");
    try {
      await sendOtp({ email }).unwrap();
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setApiError(extractError(err));
    }
  };

  /* ─────────────────────────────────────────────
     STEP 2 — Verify OTP
     Hook  : useAdminResetAccessCodeMutation
     Payload: { email, otp }
  ───────────────────────────────────────────── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    if (otp.length < 6) return setLocalError("Please enter the complete 6-digit OTP.");
    try {
      await verifyOtp({ email, otp }).unwrap();
      setStep(3);
    } catch (err) {
      setApiError(extractError(err));
    }
  };

  /* ─────────────────────────────────────────────
     STEP 2 — Resend OTP
     Hook  : adminRequestOTP
     Payload: { email }
  ───────────────────────────────────────────── */
  const handleResend = async () => {
    if (countdown > 0 || sendingOtp) return;
    clearErrors();
    setOtp("");
    try {
      await sendOtp({ email }).unwrap();
      setCountdown(60);
    } catch (err) {
      setApiError(extractError(err));
    }
  };

  /* ─────────────────────────────────────────────
     STEP 3 — Reset password
     Hook  : useAdminResetPasswordMutation
     Payload: { email, otp, password, confirm_password }
  ───────────────────────────────────────────── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearErrors();
    if (!password)                       return setLocalError("Please enter a new password.");
    if (password.length < 8)             return setLocalError("Password must be at least 8 characters.");
    if (password !== confirmPassword)     return setLocalError("Passwords do not match.");
    try {
      await resetPassword({
        email,
        new_password:     password,
      confirm_password: confirmPassword,
      }).unwrap();
      setSuccess(true);
      setTimeout(() => navigate("/admin-login"), 2000);
    } catch (err) {
      setApiError(extractError(err));
    }
  };

  /* ── Shared input style ── */
  const inputStyle = (field, overrideBorder) => ({
    width:"100%",
    background: focus===field ? "#f5f7ff" : "#f8fafc",
    border:`1.5px solid ${overrideBorder || (focus===field ? "#6366f1" : "#e2e8f0")}`,
    borderRadius:11, padding:"11px 14px", color:"#1e293b", fontSize:14,
    outline:"none", transition:"all .2s", fontFamily:"'DM Sans',sans-serif",
    boxShadow: focus===field ? "0 0 0 3px rgba(99,102,241,.1)" : "none",
  });

  /* ── CTA button style ── */
  const btnStyle = (isDisabled) => ({
    width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    background: isDisabled ? "rgba(99,102,241,.45)" : "linear-gradient(135deg,#6366f1,#4f46e5)",
    border:"none", borderRadius:12, padding:"13px 20px",
    color:"#fff", fontSize:14, fontWeight:600,
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition:"all .25s", fontFamily:"'DM Sans',sans-serif",
    boxShadow: isDisabled ? "none" : "0 8px 28px rgba(99,102,241,.38)",
  });

  /* ── Step metadata ── */
  const meta = {
    1: { icon: Mail,     title:"Forgot Password?", sub:"Enter your admin email address and we'll send you a one-time verification code." },
    2: { icon: KeyRound, title:"Check Your Email",  sub:`We've sent a 6-digit OTP to ${email || "your email"}. Enter it below to continue.` },
    3: { icon: Lock,     title:"Set New Password",  sub:"Create a strong new password for your admin account." },
  }[step];

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
        @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spinBtn{to{transform:rotate(360deg)}}
        .u0{animation:up .45s cubic-bezier(.22,1,.36,1) .05s both}
        .u1{animation:up .45s cubic-bezier(.22,1,.36,1) .10s both}
        .u5{animation:up .45s cubic-bezier(.22,1,.36,1) .30s both}
        .step-in{animation:up .38s cubic-bezier(.22,1,.36,1) both}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px #f8fafc inset!important;-webkit-text-fill-color:#1e293b!important}
        .submit-btn:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 14px 44px rgba(99,102,241,.5)!important}
        .submit-btn:not(:disabled):active{transform:scale(.99)}
        ::placeholder{color:#94a3b8}
        .back-btn:hover{color:#6366f1!important;background:#f0f4ff!important}
        .resend-btn:hover{opacity:.75}
      `}</style>

      <div style={{ minHeight:"100vh", width:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#090a13", fontFamily:"'DM Sans',sans-serif", overflow:"hidden", position:"relative", padding:"24px 16px" }}>

        {/* ── Animated background ── */}
        <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"5%",  left:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.17) 0%,transparent 70%)", animation:"blobA 16s ease-in-out infinite" }} />
          <div style={{ position:"absolute", bottom:"8%",right:"8%", width:440, height:440, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.13) 0%,transparent 70%)",  animation:"blobB 20s ease-in-out infinite" }} />
          <div style={{ position:"absolute", top:"50%", left:"52%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 70%)",   animation:"blobC 24s ease-in-out infinite" }} />
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(99,102,241,.17) 1px,transparent 1px)", backgroundSize:"36px 36px", opacity:.45 }} />
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 85% 85% at 50% 50%,transparent 35%,rgba(9,10,19,.97) 100%)" }} />
          <div style={{ position:"absolute", top:"50%", left:"50%", width:780,  height:780,  borderRadius:"50%", border:"1px solid rgba(99,102,241,.07)", transform:"translate(-50%,-50%)", animation:"ringR 70s linear infinite" }} />
          <div style={{ position:"absolute", top:"50%", left:"50%", width:1020, height:1020, borderRadius:"50%", border:"1px solid rgba(99,102,241,.05)", transform:"translate(-50%,-50%)", animation:"ringL 100s linear infinite" }} />
        </div>

        {/* ── Logo ── */}
        <div className={mounted?"u0":""} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, opacity:mounted?undefined:0 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#6366f1,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 22px rgba(99,102,241,.5)" }}>
            <Briefcase size={18} color="#fff" />
          </div>
          <span style={{ color:"#f1f5f9", fontWeight:700, fontSize:21, letterSpacing:"-0.5px" }}>
            eBench<span style={{ color:"#818cf8" }}>.ai</span>
          </span>
          <span style={{ color:"rgba(148,163,184,.3)", fontSize:11.5, marginLeft:4, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:500, alignSelf:"flex-end", marginBottom:2 }}>Admin</span>
        </div>

        {/* ── Card shell ── */}
        <div className={mounted?"u1":""} style={{ position:"relative", width:"100%", maxWidth:430, opacity:mounted?undefined:0 }}>
          <div style={{ position:"absolute", inset:-1, borderRadius:26, background:"linear-gradient(135deg,rgba(99,102,241,.25),rgba(59,130,246,.13),transparent 60%)", zIndex:0 }} />

          {/* ── White inner card ── */}
          <div style={{ position:"relative", zIndex:1, background:"#ffffff", borderRadius:24, boxShadow:"0 40px 90px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.12)", overflow:"hidden" }}>

            {/* Accent stripe */}
            <div style={{ height:4, background:"linear-gradient(90deg,#6366f1,#3b82f6,#8b5cf6)", width:"100%" }} />

            <div style={{ padding:"30px 30px 28px" }}>

              {/* Back button */}
              <button
                className="back-btn"
                onClick={() => step === 1 ? navigate("/login") : setStep(s => { clearErrors(); return s - 1; })}
                style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none", color:"#94a3b8", fontSize:13, fontWeight:500, cursor:"pointer", padding:"4px 8px", borderRadius:8, marginBottom:20, transition:"all .2s", fontFamily:"'DM Sans',sans-serif" }}
              >
                <ArrowLeft size={14} />
                {step === 1 ? "Back to Login" : "Back"}
              </button>

              {/* Step indicator */}
              <Steps current={step} />

              {/* Animated step content */}
              <div key={step} className="step-in">

                {/* Step header */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:22 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <meta.icon size={20} color="#6366f1" />
                  </div>
                  <div>
                    <h1 style={{ color:"#0f172a", fontWeight:700, fontSize:20, marginBottom:4, letterSpacing:"-0.3px" }}>{meta.title}</h1>
                    <p style={{ color:"#64748b", fontSize:13, lineHeight:1.6 }}>{meta.sub}</p>
                  </div>
                </div>

                {/* Error banner */}
                {displayError && !success && (
                  <div style={{ display:"flex", alignItems:"flex-start", gap:9, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:11, padding:"10px 13px", marginBottom:16, color:"#dc2626", fontSize:13 }}>
                    <AlertCircle size={14} style={{ flexShrink:0, marginTop:1 }} />
                    {displayError}
                  </div>
                )}

                {/* Success banner */}
                {success && (
                  <div style={{ display:"flex", alignItems:"flex-start", gap:9, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:11, padding:"10px 13px", marginBottom:16, color:"#16a34a", fontSize:13 }}>
                    <CheckCircle2 size={14} style={{ flexShrink:0, marginTop:1 }} />
                    Password reset successful! Redirecting to login…
                  </div>
                )}

                {/* ══════════════════════════════
                    STEP 1 — Enter email
                    Hook: adminRequestOTP
                    Payload: { email }
                ══════════════════════════════ */}
                {step === 1 && (
                  <form onSubmit={handleSendOtp} noValidate>
                    <div style={{ marginBottom:20 }}>
                      <label style={{ display:"block", color:"#475569", fontSize:13, fontWeight:600, marginBottom:6 }}>
                        Admin Email Address
                      </label>
                      <input
                        type="email" autoComplete="email"
                        value={email} placeholder="admin@company.com"
                        disabled={isLoading}
                        onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                        onChange={e => { setEmail(e.target.value); clearErrors(); }}
                        style={inputStyle("email")}
                      />
                    </div>
                    <button type="submit" disabled={isLoading} className="submit-btn" style={btnStyle(isLoading)}>
                      {sendingOtp
                        ? <><Loader2 size={15} style={{ animation:"spinBtn 1s linear infinite" }}/> Sending OTP…</>
                        : <>Send OTP to Email <ArrowRight size={15}/></>
                      }
                    </button>
                  </form>
                )}

                {/* ══════════════════════════════
                    STEP 2 — Verify OTP
                    Hook: useAdminResetAccessCodeMutation
                    Payload: { email, otp }
                ══════════════════════════════ */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOtp} noValidate>
                    <div style={{ marginBottom:6 }}>
                      <label style={{ display:"block", color:"#475569", fontSize:13, fontWeight:600, marginBottom:10, textAlign:"center" }}>
                        Enter 6-digit OTP
                      </label>
                      <OtpInput value={otp} onChange={v => { setOtp(v); clearErrors(); }} disabled={isLoading} />
                    </div>

                    {/* Resend row */}
                    <div style={{ textAlign:"center", margin:"14px 0 20px" }}>
                      {countdown > 0 ? (
                        <span style={{ color:"#94a3b8", fontSize:13 }}>
                          Resend OTP in{" "}
                          <span style={{ color:"#6366f1", fontWeight:700, fontVariantNumeric:"tabular-nums" }}>{countdown}s</span>
                        </span>
                      ) : (
                        <button type="button" className="resend-btn" onClick={handleResend} disabled={sendingOtp}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, background:"none", border:"none", color:"#6366f1", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"opacity .2s" }}>
                          <RefreshCw size={13} style={sendingOtp ? { animation:"spinBtn 1s linear infinite" } : {}} />
                          {sendingOtp ? "Resending…" : "Resend OTP"}
                        </button>
                      )}
                    </div>

                    <button type="submit" disabled={isLoading || otp.length < 6} className="submit-btn" style={btnStyle(isLoading || otp.length < 6)}>
                      {verifyingOtp
                        ? <><Loader2 size={15} style={{ animation:"spinBtn 1s linear infinite" }}/> Verifying OTP…</>
                        : <>Verify OTP <ArrowRight size={15}/></>
                      }
                    </button>

                    {/* Email hint */}
                    <p style={{ textAlign:"center", color:"#94a3b8", fontSize:12, marginTop:14 }}>
                      Sent to <span style={{ color:"#475569", fontWeight:600 }}>{email}</span>
                      {" · "}
                      <button type="button" onClick={() => { setStep(1); clearErrors(); setOtp(""); }}
                        style={{ background:"none", border:"none", color:"#6366f1", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                        Change email
                      </button>
                    </p>
                  </form>
                )}

                {/* ══════════════════════════════
                    STEP 3 — Set new password
                    Hook: useAdminResetPasswordMutation
                    Payload: { email, otp, password, confirm_password }
                ══════════════════════════════ */}
                {step === 3 && (
                  <form onSubmit={handleResetPassword} noValidate>

                    {/* New password */}
                    <div style={{ marginBottom:14 }}>
                      <label style={{ display:"block", color:"#475569", fontSize:13, fontWeight:600, marginBottom:6 }}>New Password</label>
                      <div style={{ position:"relative" }}>
                        <input
                          type={showPw ? "text" : "password"}
                          value={password} placeholder="Min. 8 characters"
                          disabled={isLoading || success}
                          onFocus={() => setFocus("pw")} onBlur={() => setFocus(null)}
                          onChange={e => { setPassword(e.target.value); clearErrors(); }}
                          style={{ ...inputStyle("pw"), paddingRight:42 }}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}
                          style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#94a3b8", cursor:"pointer", display:"flex", padding:2, transition:"color .2s" }}
                          onMouseEnter={e => e.currentTarget.style.color="#6366f1"}
                          onMouseLeave={e => e.currentTarget.style.color="#94a3b8"}>
                          {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                      <StrengthBar password={password} />
                    </div>

                    {/* Confirm password */}
                    <div style={{ marginBottom:22 }}>
                      <label style={{ display:"block", color:"#475569", fontSize:13, fontWeight:600, marginBottom:6 }}>Confirm Password</label>
                      <div style={{ position:"relative" }}>
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword} placeholder="Re-enter new password"
                          disabled={isLoading || success}
                          onFocus={() => setFocus("confirm")} onBlur={() => setFocus(null)}
                          onChange={e => { setConfirmPassword(e.target.value); clearErrors(); }}
                          style={{
                            ...inputStyle("confirm",
                              confirmPassword && confirmPassword === password ? "#22c55e"
                              : confirmPassword && confirmPassword !== password ? "#ef4444"
                              : undefined
                            ),
                            paddingRight:42,
                          }}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Hide password" : "Show password"}
                          style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#94a3b8", cursor:"pointer", display:"flex", padding:2, transition:"color .2s" }}
                          onMouseEnter={e => e.currentTarget.style.color="#6366f1"}
                          onMouseLeave={e => e.currentTarget.style.color="#94a3b8"}>
                          {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                        {confirmPassword && confirmPassword === password && (
                          <CheckCircle2 size={15} color="#22c55e" style={{ position:"absolute", right:38, top:"50%", transform:"translateY(-50%)" }} />
                        )}
                      </div>
                      {confirmPassword && confirmPassword !== password && (
                        <p style={{ color:"#ef4444", fontSize:12, marginTop:5 }}>Passwords do not match</p>
                      )}
                    </div>

                    <button type="submit" disabled={isLoading || success} className="submit-btn" style={btnStyle(isLoading || success)}>
                      {resetting
                        ? <><Loader2 size={15} style={{ animation:"spinBtn 1s linear infinite" }}/> Resetting Password…</>
                        : success
                        ? <><CheckCircle2 size={15}/> Password Reset!</>
                        : <>Reset Password <ArrowRight size={15}/></>
                      }
                    </button>
                  </form>
                )}

              </div>{/* end step-in */}

              {/* Card footer */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:20 }}>
                <Shield size={12} color="#94a3b8" />
                <p style={{ color:"#94a3b8", fontSize:12 }}>
                  Secured by eBench.ai ·{" "}
                  <a href="#" onClick={e => e.preventDefault()} style={{ color:"#6366f1", textDecoration:"none", fontWeight:500 }}>Privacy Policy</a>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Brand footer */}
        <div className={mounted?"u5":""} style={{ display:"flex", alignItems:"center", gap:8, marginTop:20, opacity:mounted?undefined:0 }}>
          <div style={{ width:4, height:4, borderRadius:"50%", background:"rgba(99,102,241,.5)" }} />
          <span style={{ color:"rgba(148,163,184,.2)", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            eBench.ai — Enterprise HRMS &amp; ATS
          </span>
          <div style={{ width:4, height:4, borderRadius:"50%", background:"rgba(99,102,241,.5)" }} />
        </div>

      </div>
    </>
  );
}