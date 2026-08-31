// import React, { useState, useRef } from "react";
// import Header from "./Header";
// import { motion } from "framer-motion";
// import { useVerifyOtpMutation, useResendOtpMutation, useResetAccessCodeMutation, useAdminResetAccessCodeMutation, useAdminResendOtpMutation } from "../redux/services/authApi";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import logo from "../assets/ebench_logo.png";
// import { setCredentials } from "../redux/Slices/AuthSlice";
// import { useDispatch } from "react-redux";

// const OtpVerification = () => {
//     const location = useLocation()
//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const otpRefs = useRef([]);
//     const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
//     const [resetCode, { isLoading: isResetting }] = useResetAccessCodeMutation();
//     const [resendOtp,{isLoading:otpResendLoading}] = useResendOtpMutation();
//     const [adminVerifyOtp,{isLoading:adminverifyLoading}]=useAdminResetAccessCodeMutation()
//     const [adminResendCode,{isLoading:adminLoading}] = useAdminResendOtpMutation();
//     const navigate = useNavigate();
//     const email = new URLSearchParams(location.search).get("email");
//     const dispatch = useDispatch();
//     // OTP Input Handler
//     const handleChange = (e, index) => {
//         const value = e.target.value;

//         if (!/^[0-9]?$/.test(value)) return; // Allow only digits

//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         // Move forward
//         if (value && index < 5) {
//             otpRefs.current[index + 1].focus();
//         }

//         // Move backward when deleting
//         if (!value && index > 0) {
//             otpRefs.current[index - 1].focus();
//         }
//     };

//     // Submit Handler
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const finalOtp = otp.join("");
//         if (finalOtp.length !== 6) {
//             toast.error("Please enter all 6 digits.");
//             return;
//         }

//         try {
//             if (location?.state?.data) {
//                 const result = await resetCode({ email, otp: finalOtp }).unwrap();
//                 // console.log("ram", result);
//                 // debugger;
//                 if (result?.status) {
//                     toast.success("OTP Verified Successfully!");
//                     setTimeout(() => navigate("/reset-password", {
//                         state: {
//                             email: result?.email,
//                             reset_token: result?.reset_token
//                         }
//                     }), 800);
//                 }
//             } else {
//                 const result = await verifyOtp({ email, otp: finalOtp }).unwrap();
//                 if (result?.status) {
//                     dispatch(setCredentials({ token: result?.access_token, module: result?.module, user: result.role, detail: { name: result?.name, email: result?.email, id: result?.vendor_id } }));
//                     toast.success("OTP Verified Successfully!");
//                     setTimeout(() => navigate("/vendor/dashboard"), 800);
//                 }
//             }

//         } catch (err) {
//             toast.error(err?.data?.detail ?? "Invalid OTP, try again.");
//         }
//     };

//     // Admin Submit Handler
//     const adminSubmitHandler = async (e) => {
//         e.preventDefault();

//         const finalOtp = otp.join("");
//         if (finalOtp.length !== 6) {
//             toast.error("Please enter all 6 digits.");
//             return;
//         }

//         try {
//             const result = await adminVerifyOtp({ email, otp: finalOtp }).unwrap();
//             console.log("ram", result);
//             debugger;
//             if (result?.status) {
//                 toast.success("OTP Verified Successfully!");
//                 setTimeout(() => navigate(`/admin/reset-password?email=${result?.email}`), 800);
//             }
//         } catch (err) {
//             toast.error(err?.data?.detail ?? "Invalid OTP, try again.");
//         }
//     };



//     async function resendOtpHandler() {
//         if (!email) {
//             return toast.error("email is required...")
//         }
//         const form = new FormData();
//         form.append('email', email);
//         try {
//             const result = await resendOtp(form).unwrap();
//             // console.log("resss,,", result);
//             if (result?.status) {
//                 toast.success("OTP send successfully. Check your mail.")
//             }
//         } catch (err) {
//             toast.error(err?.data?.detail??"Internal Server Error")
//         }
//     }

//     async function adminResendOtpHandler() {
//         if (!email) {
//             return toast.error("email is required...")
//         }
//         const form = {email}
//         try {
//             const result = await adminResendCode(form).unwrap();
//             if (result?.status) {
//                 toast.success("OTP send successfully. Check your mail.")
//             }
//         } catch (err) {
//             toast.error(err?.data?.detail??"Internal Server Error")
//         }
//     }


//     return (
//         <div className="min-h-screen flex flex-col overflow-hidden">
//             <Header />

//             <div className="flex-1 flex flex-col md:flex-row">

//                 {/* LEFT PANEL – OTP CONTENT */}
//                 <motion.div
//                     initial={{ opacity: 0, x: -40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full"
//                 >
//                     <h1 className="text-3xl font-bold text-white mb-4 leading-snug">
//                         Verify Your Identity with{" "}
//                         <span className="text-white font-extrabold">eBench</span>
//                     </h1>

//                     <p className="text-white leading-relaxed text-sm">
//                         To secure your account, we’ve sent a One-Time Password (OTP) to your
//                         registered email. Enter the 6-digit code below to complete your signup.
//                     </p>

//                     <p className="text-white mt-4 text-sm opacity-95">
//                         This verification step ensures that only you have access to your
//                         account—keeping your personal and vendor data completely secure.
//                     </p>

//                     <div className="mt-10">
//                         <h3 className="text-white text-lg font-semibold mb-3">
//                             Why OTP Verification?
//                         </h3>

//                         <ul className="space-y-4">
//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-blue-300 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Prevents unauthorized access to your vendor account.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Ensures secure onboarding with identity verification.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-purple-300 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Quick, safe, and required for activating your vendor privileges.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-green-300 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Helps maintain a trusted and secure marketplace.
//                                 </span>
//                             </li>
//                         </ul>
//                     </div>

//                     <div className="mt-10">
//                         <p className="text-white opacity-80 text-sm">
//                             Didn’t receive an OTP? You can resend it after a few seconds.
//                         </p>
//                     </div>
//                 </motion.div>

//                 {/* RIGHT PANEL – OTP FORM */}
//                 <motion.div
//                     initial={{ opacity: 0, x: 40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     className="flex-1 flex justify-center flex-col px-10 py-16 bg-[#f0f0f0] min-h-full"
//                 >
//                     <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
//                         <img src={logo} alt="eBench Logo" className="w-32 mx-auto mb-6" />

//                         <h2 className="text-2xl font-bold text-center text-[#286a94] mb-4">
//                             OTP Verification
//                         </h2>

//                         <p className="text-gray-600 text-center mb-6">
//                             Enter the 6-digit code sent to <br />
//                             <span className="font-medium text-[#286a94]">{email}</span>
//                         </p>

//                         <form onSubmit={ location.pathname.includes('admin') ? adminSubmitHandler : handleSubmit} className="space-y-6">
//                             <div className="flex gap-4 justify-center">
//                                 {otp.map((digit, index) => (
//                                     <input
//                                         key={index}
//                                         type="text"
//                                         maxLength={1}
//                                         value={digit}
//                                         ref={(el) => (otpRefs.current[index] = el)}
//                                         onChange={(e) => handleChange(e, index)}
//                                         onFocus={(e) => e.target.select()}
//                                         className="w-12 h-12 text-center text-xl border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                                     />
//                                 ))}
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full bg-[#286a94] text-white font-semibold py-2 rounded-lg hover:bg-[#3080b3] transition duration-200"
//                             >
//                                 {isVerifying ? "Verifying..." : "Verify OTP"}
//                             </button>
//                         </form>

//                         <p className="text-center text-sm text-gray-600 mt-4">
//                             Didn’t receive the code?{" "}
//                             <button
//                                 type="button"
//                                 className="text-[#286a94] font-medium hover:underline"
//                                 onClick={location.pathname.includes('admin') ? adminResendOtpHandler : resendOtpHandler}
//                             >
//                                {(otpResendLoading || adminLoading ) ? 'sending' : 'Resend OTP'} 
//                             </button>
//                         </p>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default OtpVerification;


//=============================================  ============================

import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetAccessCodeMutation,
  useAdminResetAccessCodeMutation,
  useAdminResendOtpMutation,
} from "../redux/services/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/ebench_logo.png";
import { setCredentials } from "../redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";

const OtpVerification = () => {
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetCode, { isLoading: isResetting }] = useResetAccessCodeMutation();
  const [resendOtp, { isLoading: otpResendLoading }] = useResendOtpMutation();
  const [adminVerifyOtp, { isLoading: adminverifyLoading }] = useAdminResetAccessCodeMutation();
  const [adminResendCode, { isLoading: adminLoading }] = useAdminResendOtpMutation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get("email");
  const dispatch = useDispatch();

  // ── OTP Input Handler ──
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
    if (!value && index > 0) otpRefs.current[index - 1].focus();
  };

  // ── Paste Handler ──
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    otpRefs.current[nextEmpty]?.focus();
  };

  // ── Keydown: backspace navigation ──
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // ── Submit Handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return toast.error("Please enter all 6 digits.");
    try {
      if (location?.state?.data) {
        const result = await resetCode({ email, otp: finalOtp }).unwrap();
        if (result?.status) {
          toast.success("OTP Verified Successfully!");
          setTimeout(() => navigate("/reset-password", {
            state: { email: result?.email, reset_token: result?.reset_token },
          }), 800);
        }
      } else {
        const result = await verifyOtp({ email, otp: finalOtp }).unwrap();
        if (result?.status) {
          dispatch(setCredentials({
            token: result?.access_token,
            module: result?.module,
            user: result?.module == "student" ? result?.module : result.role,
            detail: {
              name: result?.name, email: result?.email, id: result?.vendor_id,
              planName: result?.plan_name,
              status: result?.is_subscribed,
              profile_complete_percentage: result?.profile_complete_percentage || 0,
              last_login: result?.last_login,
              remaining_credits: result?.remaining_credits || 0
            },
          }));
          toast.success("OTP Verified Successfully!");
          setTimeout(() => {
            // Navigate based on module/role
            if (result?.module === "student") {
              navigate("/student/dashboard");
            } else {
              navigate("/vendor/dashboard");
            }
          }, 800);
        }
      }
    } catch (err) {
      toast.error(err?.data?.detail ?? "Invalid OTP, try again.");
    }
  };

  // ── Admin Submit Handler ──
  const adminSubmitHandler = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return toast.error("Please enter all 6 digits.");
    try {
      const result = await adminVerifyOtp({ email, otp: finalOtp }).unwrap();
      if (result?.status) {
        toast.success("OTP Verified Successfully!");
        setTimeout(() => navigate(`/admin/reset-password?email=${result?.email}`), 800);
      }
    } catch (err) {
      toast.error(err?.data?.detail ?? "Invalid OTP, try again.");
    }
  };

  // ── Resend Handlers ──
  async function resendOtpHandler() {
    if (!email) return toast.error("Email is required...");
    const form = new FormData();
    form.append("email", email);
    try {
      const result = await resendOtp(form).unwrap();
      if (result?.status) {
        toast.success("OTP sent successfully. Check your mail.");
        setResendTimer(60);
      }
    } catch (err) {
      toast.error(err?.data?.detail ?? "Internal Server Error");
    }
  }

  async function adminResendOtpHandler() {
    if (!email) return toast.error("Email is required...");
    try {
      const result = await adminResendCode({ email }).unwrap();
      if (result?.status) {
        toast.success("OTP sent successfully. Check your mail.");
        setResendTimer(60);
      }
    } catch (err) {
      toast.error(err?.data?.detail ?? "Internal Server Error");
    }
  }

  const isAdmin = location.pathname.includes("admin");
  const isBusy = isVerifying || isResetting || adminverifyLoading;
  const isResendBusy = otpResendLoading || adminLoading;
  const [resendTimer, setResendTimer] = useState(0);
  const filledCount = otp.filter(Boolean).length;

  // Countdown effect for resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#F7FBFF" }}
    >

      <div style={{ flex: 1, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            flex: "1 1 360px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "64px 48px",
            background: "linear-gradient(160deg, #0F2744 0%, #1A3F6E 55%, #286a94 100%)",
            position: "relative", overflow: "hidden", minHeight: "100%",
          }}
        >
          {/* Orbs */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,127,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,168,224,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Badge */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,127,255,0.2)", border: "1px solid rgba(43,127,255,0.35)", borderRadius: 999, padding: "6px 16px", marginBottom: 28, width: "fit-content" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA" }}>Secure Identity Verification</span>
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, color: "white", marginBottom: 16, letterSpacing: "-0.8px", lineHeight: 1.2 }}>
            Verify Your Identity<br />
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              with eBench
            </span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
            style={{ color: "#94B8D8", fontSize: 14, lineHeight: 1.8, marginBottom: 12, maxWidth: 380 }}>
            To secure your account, we've sent a One-Time Password (OTP) to your registered email. Enter the 6-digit code to continue.
          </motion.p>

          <motion.p custom={3} variants={fadeUp} initial="hidden" animate="visible"
            style={{ color: "#94B8D8", fontSize: 14, lineHeight: 1.8, marginBottom: 36, maxWidth: 380 }}>
            This step ensures only you have access — keeping your personal and vendor data completely safe.
          </motion.p>

          {/* Why OTP */}
          <motion.p custom={4} variants={fadeUp} initial="hidden" animate="visible"
            style={{ fontSize: 12, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
            Why OTP Verification?
          </motion.p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { dot: "#60A5FA", text: "Prevents unauthorized access to your vendor account." },
              { dot: "#FCD34D", text: "Ensures secure onboarding with identity verification." },
              { dot: "#A78BFA", text: "Quick, safe, and required for activating vendor privileges." },
              { dot: "#4ADE80", text: "Helps maintain a trusted and secure marketplace." },
            ].map(({ dot, text }, i) => (
              <motion.div key={i} custom={5 + i} variants={fadeUp} initial="hidden" animate="visible"
                style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: dot, flexShrink: 0, boxShadow: `0 0 8px ${dot}80` }} />
                <span style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{text}</span>
              </motion.div>
            ))}
          </div>

          <motion.p custom={10} variants={fadeUp} initial="hidden" animate="visible"
            style={{ marginTop: 36, fontSize: 13, color: "#6B84A0", lineHeight: 1.7 }}>
            Didn't receive an OTP? You can resend it from the form on the right.
          </motion.p>
        </motion.div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{
            flex: "1 1 360px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "64px 40px",
            background: "linear-gradient(160deg, #F0F7FF, #EBF4FD)",
            minHeight: "100%",
          }}
        >
          {/* Card */}
          <div style={{
            maxWidth: 460, width: "100%",
            background: "white", borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "0 24px 80px rgba(43,127,255,0.13), 0 4px 16px rgba(0,0,0,0.05)",
            border: "1px solid #E2EDF8",
          }}>
            {/* Logo */}
            {/* <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <img src={logo} alt="eBench Logo" style={{ width: 130, objectFit: "contain" }} />
            </div> */}

            {/* Shield icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #EAF3FF, #F0FAFF)",
                border: "1px solid #C3DCFF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2B7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F2744", textAlign: "center", marginBottom: 8, letterSpacing: "-0.4px" }}>
              OTP Verification
            </h2>
            <p style={{ fontSize: 14, color: "#6B84A0", textAlign: "center", marginBottom: 28, lineHeight: 1.65 }}>
              Enter the 6-digit code sent to<br />
              <span style={{ fontWeight: 700, color: "#2B7FFF" }}>{email}</span>
            </p>

            <form
              onSubmit={isAdmin ? adminSubmitHandler : handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 22 }}
            >
              {/* OTP Boxes */}
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    style={{
                      width: 52, height: 56,
                      textAlign: "center",
                      fontSize: 22, fontWeight: 700,
                      color: digit ? "#0F2744" : "#94B8D8",
                      borderRadius: 12,
                      border: digit ? "2px solid #2B7FFF" : "1.5px solid #D9E9F8",
                      background: digit ? "#EAF3FF" : "#FAFCFF",
                      outline: "none",
                      caretColor: "#2B7FFF",
                      transition: "all 0.18s ease",
                      boxShadow: digit ? "0 0 0 3px rgba(43,127,255,0.1)" : "none",
                      fontFamily: "inherit",
                    }}
                    onFocusCapture={e => {
                      e.target.style.borderColor = "#2B7FFF";
                      e.target.style.boxShadow = "0 0 0 3px rgba(43,127,255,0.12)";
                      e.target.style.background = "#EAF3FF";
                    }}
                    onBlurCapture={e => {
                      if (!e.target.value) {
                        e.target.style.borderColor = "#D9E9F8";
                        e.target.style.boxShadow = "none";
                        e.target.style.background = "#FAFCFF";
                      }
                    }}
                  />
                ))}
              </div>

              {/* Progress dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                {otp.map((d, i) => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: d ? "#2B7FFF" : "#D9E9F8",
                    transition: "background 0.2s",
                  }} />
                ))}
              </div>

              {/* Paste hint */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#94B8D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 12, color: "#94B8D8" }}>You can paste your OTP directly</span>
              </div>

              {/* Verify button */}
              <button
                type="submit"
                disabled={isBusy || filledCount < 6}
                style={{
                  width: "100%", padding: "13px 0",
                  background: filledCount === 6 && !isBusy
                    ? "linear-gradient(135deg, #2B7FFF, #0FA8E0)"
                    : "linear-gradient(135deg, #B8D4FF, #A5D8F0)",
                  border: "none",
                  cursor: filledCount === 6 && !isBusy ? "pointer" : "not-allowed",
                  color: "white", fontSize: 15, fontWeight: 700,
                  borderRadius: 12,
                  boxShadow: filledCount === 6 && !isBusy ? "0 6px 24px rgba(43,127,255,0.4)" : "none",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => {
                  if (filledCount === 6 && !isBusy) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(43,127,255,0.5)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = filledCount === 6 && !isBusy ? "0 6px 24px rgba(43,127,255,0.4)" : "none";
                }}
              >
                {isBusy ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Resend */}
            <p style={{ textAlign: "center", fontSize: 14, color: "#6B84A0", marginTop: 20 }}>
              Didn't receive the code?{" "}
              <button
                type="button"
                disabled={isResendBusy || resendTimer > 0}
                onClick={isAdmin ? adminResendOtpHandler : resendOtpHandler}
                style={{
                  background: "none", border: "none", cursor: isResendBusy || resendTimer > 0 ? "default" : "pointer",
                  color: isResendBusy ? "#94B8D8" : "#2B7FFF",
                  fontWeight: 700, fontSize: 14, padding: 0,
                  fontFamily: "inherit",
                  transition: "opacity 0.2s",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}
                onMouseEnter={e => { if (!isResendBusy && resendTimer === 0) e.currentTarget.style.opacity = "0.75"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                {isResendBusy ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#94B8D8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Sending...
                  </>
                ) : resendTimer > 0 ? (
                  <>Resend in {resendTimer}s</>
                ) : (
                  <>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                      <path d="M1 4v6h6M23 20v-6h-6" stroke="#2B7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="#2B7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Resend OTP
                  </>
                )}
              </button>
            </p>
          </div>

          {/* Trust badge */}
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 12, color: "#6B84A0" }}>256-bit encrypted · Your data is safe with us</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default OtpVerification;
