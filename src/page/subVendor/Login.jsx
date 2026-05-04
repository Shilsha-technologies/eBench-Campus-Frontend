// import React, { useState } from "react";
// // import axios from "axios";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useEmployeeLoginMutation, useSubVendorResetPasswordMutation } from "../../redux/services/subvendorApi";
// import toast from "react-hot-toast";

// const SubVendorLogin = () => {

//   const [employeeLogin, { isLoading: subVendorLoading }] = useEmployeeLoginMutation()
//   const [employeeResetPassword, { isLoading: resetLoading }] = useSubVendorResetPasswordMutation();

//   const [email, setEmail] = useState(null)
//   const schema = Yup.object({
//     email: Yup.string().email("Enter valid email").required("Email is required"),
//     password: Yup.string().required("Password is required"),
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
//   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data) => {
//     try {
//       const result = await employeeLogin(data).unwrap();
//       console.log("eres", result);
//       // debugger;
//       if (result?.status && result?.first_login) {
//         setTimeout(() => {
//           setEmail(result?.email ?? null)
//           setShowModal(!showModal)
//         }, 500)
//       }
//       if (result?.status && (!result?.first_login)) {
//         const { access_token, name, role, sub_vendor_id, vendor_id,email } = result
//         localStorage.setItem('token', access_token)
//         localStorage.setItem('name', name)
//         localStorage.setItem('role', role)
//         localStorage.setItem('subvendorId', sub_vendor_id)
//         localStorage.setItem('vendorId', vendor_id)
//         localStorage.setItem('email',email)
//         toast.success("Subvendor Login Successfully")
//         setTimeout(() => {
//           navigate('/subvendor/dashboard')
//         }, 500)
//       }
//     } catch (err) {
//       console.log("err", err);
//       toast.error(err?.data?.detail ?? "Internal Server Error")
//     }

//   };

//   const navigate = useNavigate()

//   const handleConfirmFirstLogin = async () => {
//     const formdata = new FormData();
//     formdata.append('email', email);

//     try {
//       const result = await employeeResetPassword(formdata);
//       if (result?.data?.status) {
//         toast.success(result?.data?.message);
//         setTimeout(() => {
//           navigate(`/reset-password/subvendor?email=${result?.data?.email}`)
//         }, 1000)
//       }
//     } catch (err) {

//       toast.error(err?.data?.message ?? "Internal Server Error");
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!forgotPasswordEmail) {
//       toast.error("Please enter your email address");
//       return;
//     }

//     const formdata = new FormData();
//     formdata.append('email', forgotPasswordEmail);

//     try {
//       const result = await employeeResetPassword(formdata);
//       if (result?.data?.status) {
//         toast.success(result?.data?.message);
//         setShowForgotPasswordModal(false);
//         setForgotPasswordEmail('');
//         setTimeout(() => {
//           navigate(`/reset-password/subvendor?email=${result?.data?.email}`)
//         }, 1000)
//       }
//     } catch (err) {
//       toast.error(err?.data?.message ?? "Internal Server Error");
//     }
//   };

  
  
//   return (
//     <div className="min-h-screen flex">

//       {/* LEFT SIDE BRAND PANEL */}
//       <div className="hidden lg:flex w-1/2 bg-linear-to-br from-[#0f3c55] to-[#286a94] text-white flex-col justify-center px-16">

//         <h1 className="text-4xl font-bold mb-6 leading-tight">
//           eCampus Partner Portal
//         </h1>

//         <p className="text-lg opacity-90 mb-8">
//           Manage student enrollments, assessments, and recruitment workflows
//           in one unified platform.
//         </p>

//         <div className="space-y-3 text-sm opacity-90">
//           <p>✔ Vendor onboarding</p>
//           <p>✔ Student test management</p>
//           <p>✔ Hiring workflow tracking</p>
//           <p>✔ Analytics dashboard</p>
//         </div>

//         <div className="mt-12 text-xs opacity-70">
//           © {new Date().getFullYear()} eCampus. All rights reserved.
//         </div>
//       </div>

//       {/* RIGHT SIDE LOGIN */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100">

//         <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10">

//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Team Member Login
//           </h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Access your organisation workspace
//           </p>


//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//             {/* Email */}
//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Work Email
//               </label>
//               <input
//                 type="email"
//                 autoComplete="work email"
//                 {...register("email")}
//                 placeholder="name@organisation.com"
//                 className="w-full mt-1 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#286a94] outline-none"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   {...register("password")}
//                   placeholder="Enter password"
//                   className="w-full mt-1 border rounded-xl px-3 py-2 pr-10 focus:ring-2 focus:ring-[#286a94] outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                 >
//                   {showPassword ? (
//                     <svg className="w-5 h-5 cursor-pointer " fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Forgot Password */}
//             <div className="text-right">
//               <button
//                 type="button"
//                 onClick={() => setShowForgotPasswordModal(true)}
//                 className="text-sm cursor-pointer text-[#286a94] hover:text-[#1f5575] font-medium"
//               >
//                 Forgot Password?
//               </button>
//             </div>

//             {/* Login button */}
//             <button
//               type="submit"
//               disabled={subVendorLoading}
//               className="w-full bg-[#286a94] hover:bg-[#1f5575] text-white font-semibold py-2.5 rounded-xl transition"
//             >
//               {subVendorLoading ? "Signing in..." : "Login to Workspace"}
//             </button>

//           </form>

//           {/* footer */}
//           <div className="text-xs text-gray-400 mt-6 text-center">
//             Need access? Contact your organisation admin.
//           </div>
//         </div>
//       </div>


//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {/* Card */}
//             <motion.div
//               initial={{ scale: 0.7, y: 40, opacity: 0 }}
//               animate={{ scale: 1, y: 0, opacity: 1 }}
//               exit={{ scale: 0.7, y: 40, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 260, damping: 18 }}
//               className="relative w-full max-w-md mx-4"
//             >
//               <div className="bg-white rounded-2xl shadow-2xl p-7 relative overflow-hidden">

//                 {/* Gradient highlight */}
//                 <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 opacity-70" />

//                 {/* Content */}
//                 <div className="relative z-10">
//                   {/* Icon */}
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.2, type: "spring" }}
//                     className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mx-auto mb-4"
//                   >
//                     <svg
//                       className="w-7 h-7 text-blue-600"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M12 11c0-3 2-5 5-5s5 2 5 5v4a5 5 0 01-10 0v-4z" />
//                       <path d="M4 11a8 8 0 0116 0v4a8 8 0 01-16 0v-4z" />
//                     </svg>
//                   </motion.div>

//                   {/* Title */}
//                   <h3 className="text-xl font-semibold text-center mb-2">
//                     First Time Login
//                   </h3>

//                   {/* Description */}
//                   <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
//                     For security reasons, we’ll send a verification OTP to your registered
//                     email so you can create a new password.
//                   </p>

//                   {/* Buttons */}
//                   <div className="flex gap-3">
//                     <motion.button
//                       whileTap={{ scale: 0.95 }}
//                       whileHover={{ scale: 1.02 }}
//                       onClick={() => setShowModal(false)}
//                       className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
//                     >
//                       Cancel
//                     </motion.button>

//                     <motion.button
//                       whileTap={{ scale: 0.95 }}
//                       whileHover={{ scale: 1.05 }}
//                       onClick={handleConfirmFirstLogin}
//                       className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"

//                     >
//                       {!resetLoading ? 'Send OTP' : 'Loading..'}
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Forgot Password Modal */}
//       <AnimatePresence>
//         {showForgotPasswordModal && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{ scale: 0.7, y: 40, opacity: 0 }}
//               animate={{ scale: 1, y: 0, opacity: 1 }}
//               exit={{ scale: 0.7, y: 40, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 260, damping: 18 }}
//               className="relative w-full max-w-md mx-4"
//             >
//               <div className="bg-white rounded-2xl shadow-2xl p-7 relative overflow-hidden">
//                 <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 opacity-70" />
                
//                 <div className="relative z-10">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.2, type: "spring" }}
//                     className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mx-auto mb-4"
//                   >
//                     <svg
//                       className="w-7 h-7 text-blue-600"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                     </svg>
//                   </motion.div>

//                   <h3 className="text-xl font-semibold text-center mb-2">
//                     Forgot Password
//                   </h3>

//                   <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
//                     Enter your email address and we'll send you a verification OTP to set your password.
//                   </p>

//                   <div className="mb-6">
//                     <label className="text-sm font-medium text-gray-600 block mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       value={forgotPasswordEmail}
//                       onChange={(e) => setForgotPasswordEmail(e.target.value)}
//                       placeholder="name@organisation.com"
//                       className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#286a94] outline-none"
//                     />
//                   </div>

//                   <div className="flex gap-3">
//                     <motion.button
//                       whileTap={{ scale: 0.95 }}
//                       whileHover={{ scale: 1.02 }}
//                       onClick={() => {
//                         setShowForgotPasswordModal(false);
//                         setForgotPasswordEmail('');
//                       }}
//                       className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
//                     >
//                       Cancel
//                     </motion.button>

//                     <motion.button
//                       whileTap={{ scale: 0.95 }}
//                       whileHover={{ scale: 1.05 }}
//                       onClick={handleForgotPassword}
//                       className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
//                     >
//                       {resetLoading ? 'Sending...' : 'Send OTP'}
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default SubVendorLogin;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEmployeeLoginMutation, useSubVendorResetPasswordMutation } from "../../redux/services/subvendorApi";
import toast from "react-hot-toast";
import campusLogo from '../../assets/eBenchCampu.png'

export default function CampusLogin() {
  const [employeeLogin, { isLoading: subVendorLoading }] = useEmployeeLoginMutation()
  const [employeeResetPassword, { isLoading: resetLoading }] = useSubVendorResetPasswordMutation();

  const [email, setEmail] = useState(null)
  const schema = Yup.object({
    email: Yup.string().email("Enter valid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [showModal, setShowModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await employeeLogin(data).unwrap();
      console.log("eres", result);
      // debugger;
      if (result?.status && result?.first_login) {
        setTimeout(() => {
          setEmail(result?.email ?? null)
          setShowModal(!showModal)
        }, 500)
      }
      if (result?.status && (!result?.first_login)) {
        const { access_token, name, role, sub_vendor_id, vendor_id,email } = result
        localStorage.setItem('token', access_token)
        localStorage.setItem('name', name)
        localStorage.setItem('role', role)
        localStorage.setItem('subvendorId', sub_vendor_id)
        localStorage.setItem('vendorId', vendor_id)
        localStorage.setItem('email',email)
        toast.success("Subvendor Login Successfully")
        setTimeout(() => {
          navigate('/subvendor/dashboard')
        }, 500)
      }
    } catch (err) {
      console.log("err", err);
      toast.error(err?.data?.detail ?? "Internal Server Error")
    }

  };

  const navigate = useNavigate()

  const handleConfirmFirstLogin = async () => {
    const formdata = new FormData();
    formdata.append('email', email);

    try {
      const result = await employeeResetPassword(formdata);
      if (result?.data?.status) {
        toast.success(result?.data?.message);
        setTimeout(() => {
          navigate(`/reset-password/subvendor?email=${result?.data?.email}`)
        }, 1000)
      }
    } catch (err) {

      toast.error(err?.data?.message ?? "Internal Server Error");
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address");
      return;
    }

    const formdata = new FormData();
    formdata.append('email', forgotPasswordEmail);

    try {
      const result = await employeeResetPassword(formdata);
      if (result?.data?.status) {
        toast.success(result?.data?.message);
        setShowForgotPasswordModal(false);
        setForgotPasswordEmail('');
        setTimeout(() => {
          navigate(`/reset-password/subvendor?email=${result?.data?.email}`)
        }, 1000)
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Internal Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#042C53] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background decorative circles */}
      <div className="absolute w-80 h-80 rounded-full bg-[#0C447C] -top-20 -left-20 z-0" />
      <div className="absolute w-60 h-60 rounded-full bg-[#0C447C] -bottom-16 -right-16 z-0" />
      <div className="absolute w-36 h-36 rounded-full bg-[#185FA5] bottom-16 left-10 opacity-40 z-0" />

      {/* Dot grid background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #378ADD 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />      

      {/* Login Card */}
      <div className="bg-white rounded-2xl w-full max-width-sm px-9 py-10 z-10 border border-[#B5D4F4] shadow-none" style={{ maxWidth: 420 }}>

        {/* Card Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#E6F1FB] border-2 border-[#B5D4F4] flex items-center justify-center mb-4">
            {/* <svg width="28" height="28" viewBox="0 0 26 26" fill="none" stroke="#378ADD" strokeWidth="1.5">
              <circle cx="13" cy="9" r="4.5" />
              <path d="M4 23c0-4.97 4.03-9 9-9s9 4.03 9 9" />
            </svg> */}
            <img src={campusLogo} alt="" />
          </div>
          <h1 className="text-[#042C53] text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-[#378ADD] text-sm mt-1">Sign in to your employee account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#0C447C] mb-1.5 tracking-wide">
              Work email
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85B7EB] pointer-events-none" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="1" y="3" width="13" height="9" rx="1.5" />
                <path d="M1 5l6.5 4L14 5" />
              </svg>
              <input
                type="email"
                {...register("email")}
                placeholder="you@greenfield.edu"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F4F9FF] border border-[#B5D4F4] rounded-lg text-[#042C53] placeholder-[#85B7EB] outline-none focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20 focus:bg-white transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#0C447C] mb-1.5 tracking-wide">
              Password
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85B7EB] pointer-events-none" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="3" y="7" width="9" height="6" rx="1.2" />
                <path d="M5 7V5.5a2.5 2.5 0 015 0V7" />
                <circle cx="7.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-[#F4F9FF] border border-[#B5D4F4] rounded-lg text-[#042C53] placeholder-[#85B7EB] outline-none focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-[#85B7EB] hover:text-[#378ADD] transition-colors"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z" />
                    <circle cx="7" cy="7" r="1.8" />
                    <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z" />
                    <circle cx="7" cy="7" r="1.8" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Options row */}
          <div className="flex items-center justify-between pt-1">
           
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs cursor-pointer text-[#378ADD] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={subVendorLoading}
            className="w-full py-2.5 bg-[#185FA5] cursor-pointer hover:bg-[#0C447C] active:scale-[0.99] text-white text-sm font-semibold rounded-lg transition-all tracking-wide mt-2"
          >
            {subVendorLoading ? "Signing in..." : "Sign in to portal"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#B5D4F4]" />
          <span className="text-xs text-[#85B7EB]">or</span>
          <div className="flex-1 h-px bg-[#B5D4F4]" />
        </div>

       

        {/* Footer links */}
        <div className="mt-5 text-center text-xs text-[#85B7EB] space-x-2">
         Need access? Contact your organisation admin
         </div>
      </div>

      

      {/* First Login Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Card */}
            <motion.div
              initial={{ scale: 0.7, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative w-full max-w-md mx-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-7 relative overflow-hidden">

                {/* Gradient highlight */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 opacity-70" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mx-auto mb-4"
                  >
                    <svg
                      className="w-7 h-7 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 11c0-3 2-5 5-5s5 2 5 5v4a5 5 0 01-10 0v-4z" />
                      <path d="M4 11a8 8 0 0116 0v4a8 8 0 01-16 0v-4z" />
                    </svg>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-center mb-2">
                    First Time Login
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
                    For security reasons, we'll send a verification OTP to your registered
                    email so you can create a new password.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowModal(false)}
                      className="flex-1 cursor-pointer py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleConfirmFirstLogin}
                      className="flex-1 py-2.5 cursor-pointer rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"

                    >
                      {!resetLoading ? 'Send OTP' : 'Loading..'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative w-full max-w-md mx-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-7 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 opacity-70" />
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mx-auto mb-4"
                  >
                    <svg
                      className="w-7 h-7 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </motion.div>

                  <h3 className="text-xl font-semibold text-center mb-2">
                    Forgot Password
                  </h3>

                  <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
                    Enter your email address and we'll send you a verification OTP to set your password.
                  </p>

                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="name@organisation.com"
                      className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#286a94] outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setShowForgotPasswordModal(false);
                        setForgotPasswordEmail('');
                      }}
                      className="flex-1 cursor-pointer py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleForgotPassword}
                      className="flex-1 py-2.5 cursor-pointer rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
                    >
                      {resetLoading ? 'Sending...' : 'Send OTP'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}