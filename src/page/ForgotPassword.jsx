// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import logo from "../assets/ebench_logo.png";
// import Header from "./Header";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { useForgotPasswordMutation } from "../redux/services/authApi";

// export default function VendorForgotPassword() {
//     const [email, setEmail] = useState("");
//     const [forgotPassword,{isLoading}] = useForgotPasswordMutation();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email) {
//             return toast.error("Email is required!");
//         }

//         try {
//             const result = await forgotPassword({ email }).unwrap();
//             toast.success(result?.message || "Reset link sent!");
//             setTimeout(() => {
//             navigate(`/otp-verify?email=${email}`,{state:{data:true}});
//             },1500)
//         } catch (err) {
//             toast.error(err?.data?.detail || "Unable to send reset link");
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col">
//             <Header />

//             {/* Main Layout */}
//             <div className="flex-1 flex flex-col md:flex-row">
//                 <motion.div
//                     className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full"
//                 >
//                     <h1 className="text-3xl font-bold text-white mb-4"> Reset Your Password with <span className="text-white">eBench</span> </h1>
//                     <p className="text-white mt-4 opacity-90">
//                         Our system uses advanced encryption and verification methods to ensure your
//                         account stays protected while giving you quick access whenever you need it.
//                     </p>

//                     <div className="mt-10">
//                         <h3 className="text-white text-lg font-semibold mb-3">
//                             Why Reset with eBench?
//                         </h3>

//                         <ul className="space-y-4">
//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Secure password recovery with encrypted reset links.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-purple-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Instant delivery of reset instructions directly to your inbox.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Hassle-free recovery without contacting support or waiting.
//                                 </span>
//                             </li>


//                         </ul>
//                     </div>

//                     <div className="mt-10">
//                         <p className="text-white opacity-80 text-sm">
//                             Need additional assistance? Our support team is always available to help
//                             you recover your account securely and quickly.
//                         </p>
//                     </div>
//                 </motion.div>

//                 {/* RIGHT SECTION */}
//                 <motion.div
//                     className="flex-1 flex items-center justify-center flex-col px-10 py-16 bg-[#f0f0f0] min-h-full"
//                 >
//                     <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
//                         <img src={logo} alt="eBench Logo" className="w-40 mx-auto mb-6" />

//                         <h2 className="text-xl font-semibold text-center mb-2">
//                             Forgot Password
//                         </h2>
//                         <p className="text-gray-600 text-center text-sm mb-6">
//                             Enter your registered email to receive a password reset link.
//                         </p>

//                         <form onSubmit={handleSubmit} className="space-y-5">

//                             {/* EMAIL FIELD */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Email Address
//                                 </label>
//                                 <input
//                                     type="email"
//                                     placeholder="Enter your email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                 />
//                             </div>

//                             {/* SUBMIT BUTTON */}
//                             <button
//                                 type="submit"
//                                 className="w-full bg-[#286a94] text-white font-medium py-2 rounded-lg transition"
//                             >
//                                 {isLoading ? "Sending..." : "Send Reset Link"}
//                             </button>

//                             {/* BACK TO LOGIN */}
//                             <p className="text-center text-gray-600 text-sm mt-1">
//                                 Remember password?{" "}
//                                 <span
//                                     onClick={() => navigate("/")}
//                                     className="text-blue-600 hover:underline cursor-pointer"
//                                 >
//                                     Login
//                                 </span>
//                             </p>
//                         </form>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

import React, { useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/ebench_logo.png";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForgotPasswordMutation } from "../redux/services/authApi";

export default function VendorForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Email is required!");
    }
    try {
      const result = await forgotPassword({ email }).unwrap();
      toast.success(result?.message || "Reset link sent!");
      setTimeout(() => {
        navigate(`/otp-verify?email=${email}`, { state: { data: true } });
      }, 1500);
    } catch (err) {
      toast.error(err?.data?.detail || "Unable to send reset link");
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#F7FBFF" }}>

      <div className="flex-1 flex flex-col md:flex-row">

        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-center px-10 py-16"
          style={{
            background: "linear-gradient(160deg, #0F2744 0%, #1A3F6E 60%, #286a94 100%)",
            position: "relative",
            overflow: "hidden",
            minHeight: "100%",
          }}
        >
          {/* Decorative orbs */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,127,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,168,224,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Badge */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,127,255,0.2)", border: "1px solid rgba(43,127,255,0.35)", borderRadius: 999, padding: "6px 16px", marginBottom: 28, width: "fit-content" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA" }}>Secure Account Recovery</span>
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, color: "white", marginBottom: 16, letterSpacing: "-1px", lineHeight: 1.2 }}>
            Reset Your Password<br />
            <span style={{ background: "linear-gradient(135deg, #60A5FA, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              with eBench
            </span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
            style={{ color: "#94B8D8", fontSize: 15, lineHeight: 1.75, marginBottom: 40, maxWidth: 400 }}>
            Our system uses advanced encryption and verification methods to ensure your account stays protected while giving you quick access whenever you need it.
          </motion.p>

          {/* Why Reset list */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <p style={{ fontSize: 13, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18 }}>
              Why Reset with eBench?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { dot: "#60A5FA", text: "Secure password recovery with encrypted reset links." },
                { dot: "#A78BFA", text: "Instant delivery of reset instructions directly to your inbox." },
                { dot: "#FCD34D", text: "Hassle-free recovery without contacting support or waiting." },
              ].map(({ dot, text }, i) => (
                <motion.div key={i} custom={4 + i} variants={fadeUp} initial="hidden" animate="visible"
                  style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: dot, flexShrink: 0, boxShadow: `0 0 8px ${dot}80` }} />
                  <span style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.6 }}>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p custom={8} variants={fadeUp} initial="hidden" animate="visible"
            style={{ marginTop: 40, fontSize: 13, color: "#6B84A0", lineHeight: 1.7 }}>
            Need additional assistance? Our support team is always available to help you recover your account securely and quickly.
          </motion.p>
        </motion.div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex-1 flex items-center justify-center px-10 py-16"
          style={{ background: "linear-gradient(160deg, #F0F7FF, #EBF4FD)", minHeight: "100%" }}
        >
          <div style={{
            maxWidth: 440,
            width: "100%",
            background: "white",
            borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "0 24px 80px rgba(43,127,255,0.14), 0 4px 16px rgba(0,0,0,0.05)",
            border: "1px solid #E2EDF8",
          }}>


            {/* Lock icon circle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #EAF3FF, #F0FAFF)",
                border: "1px solid #C3DCFF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    stroke="#2B7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F2744", textAlign: "center", marginBottom: 8, letterSpacing: "-0.4px" }}>
              Forgot Password?
            </h2>
            <p style={{ fontSize: 14, color: "#6B84A0", textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>
              An OTP has been sent to your registered email address.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Email field */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#3A5068", display: "block", marginBottom: 7 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
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
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = "#2B7FFF";
                      e.target.style.boxShadow = "0 0 0 3px rgba(43,127,255,0.1)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "#D9E9F8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "13px 0",
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
                  transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(43,127,255,0.5)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = isLoading ? "none" : "0 6px 24px rgba(43,127,255,0.4)";
                }}
              >
                {isLoading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                        stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset OTP
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
                <span style={{ fontSize: 12, color: "#94B8D8" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
              </div>

              {/* Back to login */}
              <p style={{ textAlign: "center", fontSize: 14, color: "#6B84A0", margin: 0 }}>
                Remember your password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{ color: "#2B7FFF", fontWeight: 700, cursor: "pointer", textDecoration: "none", transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.target.style.opacity = "0.75"}
                  onMouseLeave={e => e.target.style.opacity = "1"}
                >
                  Back to Login
                </span>
              </p>
            </form>
          </div>

          {/* Trust badge below card
          <div style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 12, color: "#6B84A0" }}>256-bit encrypted · Your data is safe with us</span>
          </div> */}
        </motion.div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}