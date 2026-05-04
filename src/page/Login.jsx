// import CreateAccount from './Account'

// const Login = () => {
//   return (
//     <>
//       {/* <IntroAnalysisApp /> */}
//       <CreateAccount />
//     </>
//   )
// }

// export default Login

// //============

// import { useState } from "react";
// import { Logo } from "../components/landing/Navbar";
// import Divider, { FormField, inputClass } from "../libs/Divider";
// import { useNavigate } from "react-router-dom";

// function Login({ nav }) {
//   const [form, setForm] = useState({ email: "", password: "", remember: false });
//   const [showPass, setShowPass] = useState(false);
//   const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

//   const navigate=useNavigate()

//   return (
//     <div className="min-h-screen bg-linear-to-br from-[#F0F7FF] to-[#EBF4FD] flex items-center justify-center p-8">
//       <div className="flex max-w-4xl w-full rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(43,127,255,0.15)]">
//         {/* Left Panel */}
//         <div className="flex-1 min-w-[320px] bg-linear-to-b from-[#0F2744] to-[#1A3F6E] p-12 flex flex-col justify-between min-h-[560px]">
//           <Logo nav={nav} />
//           <div>
//             <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Welcome back!</h2>
//             <p className="text-base text-[#94B8D8] leading-relaxed mb-8">
//               Log in to access your assessments, analytics, and AI-powered insights.
//             </p>
//             {[["50K+", "Assessments Completed"], ["800+", "Companies Hiring"], ["4.9/5", "Platform Rating"]].map(([n, l]) => (
//               <div key={l} className="flex items-center gap-4 mb-5">
//                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-base shrink-0">✓</div>
//                 <div>
//                   <div className="text-base font-extrabold text-white">{n}</div>
//                   <div className="text-xs text-[#6B84A0]">{l}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="text-xs text-[#6B84A0]">© 2026 CampusHireAI</div>
//         </div>
//         {/* Right Panel */}
//         <div className="flex-1 min-w-[320px] bg-white p-12 flex flex-col justify-center">
//           <h1 className="text-2xl font-extrabold text-[#0F2744] mb-2">Log In</h1>
//           <p className="text-sm text-[#6B84A0] mb-7">
//             Don't have an account?{" "}
//             <span onClick={() => navigate("/vendor-signup")} className="text-blue-500 font-semibold cursor-pointer">
//               Sign up free →
//             </span>
//           </p>
//           <FormField label="Email Address">
//             <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => handle("email", e.target.value)} className={inputClass} />
//           </FormField>
//           <div className="mb-4">
//             <div className="flex justify-between mb-1.5">
//               <label className="text-sm font-semibold text-[#3A5068]">Password</label>
//               <span onClick={() => navigate('/forgot-password')} className="text-sm text-blue-500 cursor-pointer font-semibold">Forgot password?</span>
//             </div>
//             <div className="relative">
//               <input type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => handle("password", e.target.value)} className={`${inputClass} pr-12`} />
//               <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-[#6B84A0] text-base">
//                 {showPass ? "🙈" : "👁"}
//               </button>
//             </div>
//           </div>
//           <div
//             className="flex items-center gap-2.5 mb-7 cursor-pointer"
//             onClick={() => handle("remember", !form.remember)}
//           >
//             <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${form.remember ? "bg-blue-500 border-blue-500" : "bg-white border-blue-200"}`}>
//               {form.remember && <span className="text-white text-xs leading-none">✓</span>}
//             </div>
//             <span className="text-sm text-[#3A5068]">Remember me for 30 days</span>
//           </div>
//           <button className="w-full py-4 text-base font-bold text-white rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_24px_rgba(43,127,255,0.4)] hover:shadow-[0_10px_32px_rgba(43,127,255,0.5)] hover:-translate-y-0.5 transition-all">
//             Log In →
//           </button>
//           <Divider />
//           <div className="flex gap-3">
//             {["Google", "LinkedIn"].map((s) => (
//               <button
//                 key={s}
//                 className="flex-1 py-3 bg-white border-[1.5px] border-[#E2EDF8] rounded-xl cursor-pointer text-sm font-semibold text-[#3A5068] hover:border-blue-500 hover:text-blue-500 hover:bg-[#F0F7FF] transition-all"
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//  export default Login


// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import logo from "../assets/ebenchwhite.png";
// import { Link, useNavigate } from "react-router-dom";
// import Header from "./Header";
// import { useLoginMutation } from "../redux/services/authApi";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "../redux/Slices/AuthSlice";
// import toast from "react-hot-toast";




// export default function CreateAccount() {
//   const [vendorData, setVendorData] = useState({
//     email: "",
//     password: "",
//     module: "campus",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [remember, setRemember] = useState(false);

//   const [login, { isLoading }] = useLoginMutation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setVendorData((prev) => ({ ...prev, [name]: value }));
//   };

//   useEffect(() => {
// window.scrollTo(0, 0)
//   },[])

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!vendorData?.email || !vendorData?.password) {
//       return toast.error("Please fill all required information.");
//     }
//     try {
//       const result = await login({ ...vendorData }).unwrap();
//       if (result?.access_token) {
//         dispatch(
//           setCredentials({
//             token: result?.access_token,
//             module: result?.module,
//             user: result.role,
//             detail: {
//               name: result?.name,
//               email: result?.email,
//               id: result?.vendor_id,
//               planName: result?.plan_name,
//               status: result?.is_subscribed,
//               profile_complete_percentage:result?.profile_complete_percentage || 0,
//               last_login:result?.last_login,
//               remaining_credits:result?.remaining_credits || 0
//             },
//           })
//         );
//         toast.success("Login Success..")
//         setTimeout(() => {
//           navigate("/vendor/dashboard");
//         }, 1000)
//       }

//     } catch (err) {
//       if(err?.data?.email && !err?.data?.is_verified){
//          navigate(`/otp-verify?email=${err?.data?.email}`);
//          setTimeout(() => {
//           toast.success("Pls verify your account")
//          },500)
//          return;
//       }
//       toast.error(err?.data?.detail ?? "Internal Server Error");
//     }
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//       }}
//     >

//       {/* Full page centered */}
//       <div
//         style={{
//           flex: 1,
//           background: "linear-gradient(135deg, #F0F7FF, #EBF4FD)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "40px 20px",
//         }}
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.55, ease: "easeOut" }}
//           style={{
//             display: "flex",
//             maxWidth: 900,
//             width: "100%",
//             borderRadius: 24,
//             overflow: "hidden",
//             boxShadow: "0 32px 80px rgba(43,127,255,0.15)",
//           }}
//         >
//           {/* ── LEFT PANEL ── */}
//           <div
//             style={{
//               flex: "1 1 300px",
//               minWidth: 280,
//               background: "linear-gradient(180deg, #0F2744, #1A3F6E)",
//               padding: "4px 40px",
//               display: "flex",
//               flexDirection: "column",
//               // justifyContent: "space-between",
//               minHeight: 560,
//             }}
//           >
//             {/* Logo */}
//             <div style={{ display: "flex", alignItems: "center",  }}>
//               <img src={logo} alt="eBench Logo" style={{ width: 250, objectFit: "contain" }} />
//             </div>

//             {/* Middle content */}
//             <div>
//               <h2
//                 style={{
//                   fontSize: 28,
//                   fontWeight: 800,
//                   color: "white",
//                   marginBottom: 12,
//                   letterSpacing: "-0.5px",
//                   lineHeight: 1.25,
//                 }}
//               >
//                 Welcome back!
//               </h2>
//               <p
//                 style={{
//                   fontSize: 15,
//                   color: "#94B8D8",
//                   lineHeight: 1.75,
//                   marginBottom: 32,
//                 }}
//               >
//                 Log in to manage campus operations, collaborate efficiently, and access AI-powered tools.
//               </p>

//               {[["🌐", "Global campus network"],["⚡", "Smart workflow automation"],["📊", "Insightful analytics"],["🤖", "AI-driven campus management"]].map(([icon, label]) => (
//                 <div
//                   key={label}
//                   style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}
//                 >
//                   <div
//                     style={{
//                       width: 38,
//                       height: 38,
//                       borderRadius: 11,
//                       background: "rgba(43,127,255,0.2)",
//                       border: "1px solid rgba(43,127,255,0.3)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: 16,
//                       flexShrink: 0,
//                     }}
//                   >
//                     {icon}
//                   </div>
//                   <span style={{ fontSize: 14, color: "#CBD5E1" }}>{label}</span>
//                 </div>
//               ))}
//             </div>

//             <div style={{ fontSize: 12, color: "#6B84A0" }}> 2026 eBench</div>
//           </div>

//           {/* ── RIGHT PANEL ── */}
//           <div
//             style={{
//               flex: "1 1 320px",
//               minWidth: 280,
//               background: "white",
//               padding: "48px 40px",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//             }}
//           >
//             <h1
//               style={{
//                 fontSize: 24,
//                 fontWeight: 800,
//                 color: "#0F2744",
//                 marginBottom: 6,
//                 letterSpacing: "-0.4px",
//               }}
//             >
//               Log In
//             </h1>
//             <p style={{ fontSize: 14, color: "#6B84A0", marginBottom: 28 }}>
//               Don't have a campus account?{" "}
//               <Link
//                 to="/vendor-signup"
//                 style={{ color: "#2B7FFF", fontWeight: 700, textDecoration: "none" }}
//               >
//                 Sign up free →
//               </Link>
//             </p>

//             <form
//               onSubmit={handleSubmit}
//               style={{ display: "flex", flexDirection: "column", gap: 0 }}
//               noValidate
//             >

//               {/* ── Email ── */}
//               <div style={{ marginBottom: 18 }}>
//                 <label
//                   style={{
//                     fontSize: 13,
//                     fontWeight: 600,
//                     color: "#3A5068",
//                     display: "block",
//                     marginBottom: 7,
//                   }}
//                 >
//                   Email Address
//                 </label>
//                 <div style={{ position: "relative" }}>
//                   <span
//                     style={{
//                       position: "absolute",
//                       left: 14,
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       pointerEvents: "none",
//                     }}
//                   >
//                     <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
//                       <path
//                         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         stroke="#6B84A0"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </span>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={vendorData.email}
//                     onChange={handleChange}
//                     style={inputStyle}
//                     onFocus={focusIn}
//                     onBlur={focusOut}
//                   />
//                 </div>
//               </div>

//               {/* ── Password ── */}
//               <div style={{ marginBottom: 6 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 7,
//                   }}
//                 >
//                   <label
//                     style={{ fontSize: 13, fontWeight: 600, color: "#3A5068" }}
//                   >
//                     Password
//                   </label>
//                   <Link
//                     to="/forgot-password"
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 600,
//                       color: "#2B7FFF",
//                       textDecoration: "none",
//                     }}
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div style={{ position: "relative" }}>
//                   <span
//                     style={{
//                       position: "absolute",
//                       left: 14,
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       pointerEvents: "none",
//                     }}
//                   >
//                     <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
//                       <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6B84A0" strokeWidth="2" />
//                       <path d="M7 11V7a5 5 0 0110 0v4" stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </span>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={vendorData.password}
//                     onChange={handleChange}
//                     style={{ ...inputStyle, paddingRight: 48 }}
//                     onFocus={focusIn}
//                     onBlur={focusOut}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((p) => !p)}
//                     style={{
//                       position: "absolute",
//                       right: 13,
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       color: "#6B84A0",
//                       display: "flex",
//                       alignItems: "center",
//                       padding: 0,
//                     }}
//                   >
//                     {showPassword ? (
//                       <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
//                         <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                       </svg>
//                     ) : (
//                       <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
//                         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
//                         <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>            

//               {/* ── Submit ── */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 style={{
//                   width: "100%",
//                   marginTop: 20,
//                   padding: "14px 0",
//                   background: isLoading
//                     ? "linear-gradient(135deg, #93C5FD, #7DD3FC)"
//                     : "linear-gradient(135deg, #2B7FFF, #0FA8E0)",
//                   border: "none",
//                   cursor: isLoading ? "not-allowed" : "pointer",
//                   color: "white",
//                   fontSize: 15,
//                   fontWeight: 700,
//                   borderRadius: 12,
//                   boxShadow: isLoading ? "none" : "0 6px 24px rgba(43,127,255,0.4)",
//                   transition: "transform 0.2s, box-shadow 0.2s",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                   fontFamily: "inherit",
//                   marginBottom: 18,
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isLoading) {
//                     e.currentTarget.style.transform = "translateY(-1px)";
//                     e.currentTarget.style.boxShadow = "0 10px 32px rgba(43,127,255,0.5)";
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "";
//                   e.currentTarget.style.boxShadow = isLoading
//                     ? "none"
//                     : "0 6px 24px rgba(43,127,255,0.4)";
//                 }}
//               >
//                 {isLoading ? (
//                   <>
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       style={{ animation: "spin 1s linear infinite" }}
//                     >
//                       <path
//                         d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
//                         stroke="white"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     Log In →
//                   </>
//                 )}
//               </button>

//               {/* ── Divider ── */}
//               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
//                 <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
//                 <span style={{ fontSize: 12, color: "#94B8D8" }}>or continue with</span>
//                 <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
//               </div>

//               {/* ── Social buttons ── */}
//               <div style={{ display: "flex", gap: 12 }}>
//                 {["Google", "LinkedIn"].map((s) => (
//                   <button
//                     key={s}
//                     type="button"
//                     style={{
//                       flex: 1,
//                       padding: "11px 0",
//                       background: "white",
//                       border: "1.5px solid #D9E9F8",
//                       borderRadius: 12,
//                       cursor: "pointer",
//                       fontSize: 14,
//                       fontWeight: 600,
//                       color: "#3A5068",
//                       transition: "all 0.2s",
//                       fontFamily: "inherit",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.borderColor = "#2B7FFF";
//                       e.currentTarget.style.color = "#2B7FFF";
//                       e.currentTarget.style.background = "#F0F7FF";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.borderColor = "#D9E9F8";
//                       e.currentTarget.style.color = "#3A5068";
//                       e.currentTarget.style.background = "white";
//                     }}
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       </div>

//       <style>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
//       `}</style>
//     </div>
//   );
// }

/* ── Shared input style ── */
// const inputStyle = {
//   width: "100%",
//   padding: "12px 16px 12px 40px",
//   borderRadius: 12,
//   border: "1.5px solid #D9E9F8",
//   fontSize: 15,
//   color: "#0F2744",
//   outline: "none",
//   boxSizing: "border-box",
//   background: "#FAFCFF",
//   fontFamily: "inherit",
//   transition: "border-color 0.2s, box-shadow 0.2s",
// };

// const focusIn = (e) => {
//   e.target.style.borderColor = "#2B7FFF";
//   e.target.style.boxShadow = "0 0 0 3px rgba(43,127,255,0.1)";
// };

// const focusOut = (e) => {
//   e.target.style.borderColor = "#D9E9F8";
//   e.target.style.boxShadow = "none";
// };


//--======================>>   ===================================>>


import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import logo from "../assets/ebenchCampu.png";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useLoginMutation } from "../redux/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/Slices/AuthSlice";
import toast from "react-hot-toast";
import { validateEmailByRole, getEmailPlaceholder } from "../utils/emailValidation";

export default function CreateAccount() {
  const [vendorData, setVendorData] = useState({
    email: "",
    password: "",
    module: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
window.scrollTo(0, 0)
  },[])

  async function handleSubmit(e) {
    e.preventDefault();
    if (!vendorData?.email || !vendorData?.password) {
      return toast.error("Please fill all required information.");
    }
    try {
      const result = await login({ ...vendorData }).unwrap();
      if (result?.access_token) {
        dispatch(
          setCredentials({
            token: result?.access_token,
            module: result?.module,
            user: result.role,
            detail: {
              name: result?.name,
              email: result?.email,
              id: result?.vendor_id,
              planName: result?.plan_name,
              status: result?.is_subscribed,
              profile_complete_percentage:result?.profile_complete_percentage || 0,
              last_login:result?.last_login,
              remaining_credits:result?.remaining_credits || 0
            },
          })
        );
        toast.success("Login Success..")
        setTimeout(() => {
          navigate("/vendor/dashboard");
        }, 1000)
      }

    } catch (err) {
      if(err?.data?.email && !err?.data?.is_verified){
         navigate(`/otp-verify?email=${err?.data?.email}`);
         setTimeout(() => {
          toast.success("Pls verify your account")
         },500)
         return;
      }
      toast.error(err?.data?.detail ?? "Internal Server Error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >

      {/* Full page centered */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #F0F7FF, #EBF4FD)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            display: "flex",
            maxWidth: 900,
            width: "100%",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(43,127,255,0.15)",
          }}
        >
          {/* ── LEFT PANEL ── */}
          <div
            style={{
              flex: "1 1 300px",
              minWidth: 280,
              background: "linear-gradient(180deg, #0F2744, #1A3F6E)",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 560,
            }}
          >
            {/* Logo */}
            <div className=" cursor-pointer" onClick={() => navigate('/')} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={logo} alt="eBench Logo" style={{ width: 110, objectFit: "contain" }} />
            </div>

            {/* Middle content */}
            <div>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "white",
                  marginBottom: 12,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.25,
                }}
              >
                Welcome back!
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#94B8D8",
                  lineHeight: 1.75,
                  marginBottom: 32,
                }}
              >
                Log in to manage vendor operations, collaborate efficiently, and access AI-powered tools.
              </p>

              {[
                ["🌐", "Global vendor network"],
                ["⚡", "Smart workflow automation"],
                ["📊", "Insightful analytics"],
                ["🤖", "AI-driven vendor management"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: "rgba(43,127,255,0.2)",
                      border: "1px solid rgba(43,127,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <span style={{ fontSize: 14, color: "#CBD5E1" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: "#6B84A0" }}>© 2026 eBench</div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            style={{
              flex: "1 1 320px",
              minWidth: 280,
              background: "white",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#0F2744",
                marginBottom: 6,
                letterSpacing: "-0.4px",
              }}
            >
              Log In
            </h1>
            <p style={{ fontSize: 14, color: "#6B84A0", marginBottom: 28 }}>
              Don't have a vendor account?{" "}
              <Link
                to="/vendor-signup"
                style={{ color: "#2B7FFF", fontWeight: 700, textDecoration: "none" }}
              >
                Sign up free →
              </Link>
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 0 }}
              noValidate
            >
              {/* ── Login As (module selector) ── */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#3A5068",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Login as
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["student", "campus"].map((mod) => (
                    <label
                      key={mod}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "11px 14px",
                        borderRadius: 12,
                        border: `1.5px solid ${vendorData.module === mod ? "#2B7FFF" : "#D9E9F8"}`,
                        background: vendorData.module === mod ? "#EAF3FF" : "white",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Custom radio */}
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `2px solid ${vendorData.module === mod ? "#2B7FFF" : "#C3D8EF"}`,
                            background: vendorData.module === mod ? "#2B7FFF" : "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.2s",
                          }}
                          onClick={() =>
                            setVendorData((prev) => ({ ...prev, module: mod }))
                          }
                        >
                          {vendorData.module === mod && (
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "white",
                              }}
                            />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="module"
                          value={mod}
                          checked={vendorData.module === mod}
                          onChange={handleChange}
                          style={{ display: "none" }}
                        />
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: vendorData.module === mod ? "#0F2744" : "#6B84A0",
                            textTransform: "capitalize",
                          }}
                        >
                          {mod}
                        </span>
                      </div>
                      {vendorData.module === mod && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#2B7FFF",
                            background: "#DBEAFE",
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          Selected
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Email ── */}
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#3A5068",
                    display: "block",
                    marginBottom: 7,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        stroke="#6B84A0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={vendorData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </div>

              {/* ── Password ── */}
              <div style={{ marginBottom: 6 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 7,
                  }}
                >
                  <label
                    style={{ fontSize: 13, fontWeight: 600, color: "#3A5068" }}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#2B7FFF",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6B84A0" strokeWidth="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={vendorData.password}
                    onChange={handleChange}
                    style={{ ...inputStyle, paddingRight: 48 }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 13,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6B84A0",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ── Remember me ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                  cursor: "pointer",
                  marginTop: 14,
                }}
                onClick={() => setRemember((r) => !r)}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `2px solid ${remember ? "#2B7FFF" : "#C3D8EF"}`,
                    background: remember ? "#2B7FFF" : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {remember && (
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 14, color: "#3A5068" }}>
                  Remember me for 30 days
                </span>
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: isLoading
                    ? "linear-gradient(135deg, #93C5FD, #7DD3FC)"
                    : "linear-gradient(135deg, #2B7FFF, #0FA8E0)",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 12,
                  boxShadow: isLoading ? "none" : "0 6px 24px rgba(43,127,255,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "inherit",
                  marginBottom: 18,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 10px 32px rgba(43,127,255,0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = isLoading
                    ? "none"
                    : "0 6px 24px rgba(43,127,255,0.4)";
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path
                        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Log In →
                  </>
                )}
              </button>

              {/* ── Divider ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
                <span style={{ fontSize: 12, color: "#94B8D8" }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
              </div>

              {/* ── Social buttons ── */}
              <div style={{ display: "flex", gap: 12 }}>
                {["Google", "LinkedIn"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    style={{
                      flex: 1,
                      padding: "11px 0",
                      background: "white",
                      border: "1.5px solid #D9E9F8",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#3A5068",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2B7FFF";
                      e.currentTarget.style.color = "#2B7FFF";
                      e.currentTarget.style.background = "#F0F7FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#D9E9F8";
                      e.currentTarget.style.color = "#3A5068";
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}

/* ── Shared input style ── */
const inputStyle = {
  width: "100%",
  padding: "12px 16px 12px 40px",
  borderRadius: 12,
  border: "1.5px solid #D9E9F8",
  fontSize: 15,
  color: "#0F2744",
  outline: "none",
  boxSizing: "border-box",
  background: "#FAFCFF",
  fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const focusIn = (e) => {
  e.target.style.borderColor = "#2B7FFF";
  e.target.style.boxShadow = "0 0 0 3px rgba(43,127,255,0.1)";
};

const focusOut = (e) => {
  e.target.style.borderColor = "#D9E9F8";
  e.target.style.boxShadow = "none";
};