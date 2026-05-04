// import Select from 'react-select'
// import { Eye, EyeOff } from "lucide-react";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useSignupMutation } from "../redux/services/authApi";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import Header from "./Header";
// import { useGetCountryDataQuery } from "../redux/services/externalApi";

// const VendorSignup = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         confirm_password: "",
//         country: "",
//         module: "company" // default
//     });
//     const [showPassword, setShowPassword] = useState(false)
//     const [signup, { isLoading }] = useSignupMutation();
//     const navigate = useNavigate();
//     const { data: countryList } = useGetCountryDataQuery();
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const options = (countryList?.data || []).map((c) => ({
//         value: c,
//         searchLabel: c.name, // 👈 used for search
//         label: (
//             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <img
//                     src={c.flag ?? "img"}
//                     alt={c.name}
//                     style={{ width: 20, height: 14, objectFit: "cover" }}
//                 />
//                 <span>{c.name}</span>
//             </div>
//         )
//     }));


//     const [selectedOption, setSelectedOption] = useState(null);

//     useEffect(() => {
//         const countryName = selectedOption?.value?.name;

//         if (countryName) {
//             setFormData((prev) => {
//                 if (prev.country === countryName) return prev;
//                 return {
//                     ...prev,
//                     country: countryName
//                 };
//             });
//         }
//     }, [selectedOption?.value?.name]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("frmdata", formData);
//         try {
//             const result = await signup(formData).unwrap();
//             if (result?.status) {
//                 toast.success("Signup successfully!");
//                 setTimeout(() => {
//                     navigate(`/otp-verify?email=${result?.email}`);
//                 }, 1000);
//             }
//         } catch (err) {
//             // console.error("Signup failed:", err);
//             toast.error(err?.data?.detail || "Unable to signup");
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col overflow-hidden">
//             {/* <Header /> */}

//             <div className="flex-1 flex flex-col md:flex-row">

//                 {/* LEFT PANEL */}
//                 <motion.div
//                     initial={{ opacity: 0, x: -40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full"
//                 >
//                     <h1 className="text-3xl font-bold text-white mb-4 leading-snug">
//                         Begin Your Vendor Journey with{" "}
//                         <span className="text-white font-extrabold">eBench</span>
//                     </h1>

//                     <p className="text-white leading-relaxed text-">
//                         Join eBench and expand your opportunities by connecting with global
//                         clients, streamlining your workflow, and showcasing your services on a
//                         powerful AI-driven platform designed for vendor growth.
//                     </p>

//                     {/* <p className="text-white mt-4 opacity-90">
//             Create your vendor account in just a few steps and unlock access to 
//             intelligent tools, automated processes, and real-time insights that 
//             help you operate smarter.
//           </p> */}

//                     <div className="mt-10">
//                         <h3 className="text-white text-lg font-semibold mb-3">
//                             Why Join as a Vendor?
//                         </h3>

//                         <ul className="space-y-4">
//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Access to global clients and recruitment projects.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-purple-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     AI tools that automate repetitive vendor tasks.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Insightful dashboards to track performance and analytics.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Secure onboarding with fast verification and approval.
//                                 </span>
//                             </li>

//                             <li className="flex items-center space-x-3">
//                                 <span className="w-2.5 h-2.5 bg-pink-400 rounded-full"></span>
//                                 <span className="text-white text-sm">
//                                     Exclusively designed for vendor success and workflow efficiency.
//                                 </span>
//                             </li>
//                         </ul>
//                     </div>

//                     <div className="mt-10">
//                         <p className="text-white opacity-80 text-sm">
//                             Already registered? Continue where you left off by logging in to your account.
//                         </p>
//                     </div>
//                 </motion.div>

//                 {/* RIGHT PANEL (SIGNUP FORM) */}
//                 <motion.div
//                     initial={{ opacity: 0, x: 40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     className="flex-1 flex flex-col px-10 justify-center bg-[#f0f0f0] min-h-full"
//                 >
//                     <div className="max-w-md w-full mx-auto bg-white shadow-md overflow-auto  rounded-2xl p-8 mt-10">

//                         {/* <h2 className="text-2xl font-bold text-center text-[#286a94] mb-6">
//                             Vendor Signup
//                         </h2> */}

//                         <form onSubmit={handleSubmit} className="space-y-3 ">

//                             {/* Registered As */}
//                             <div>
//                                 <label className="block text-gray-700 mb-2">Registered As</label>

//                                 <div className="grid grid-cols-2 gap-3">
//                                     {/* Company */}
//                                     <label className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition 
//       ${formData.module === "company" ? "border-[#286a94] bg-blue-50" : "border-gray-300"}`}>

//                                         <div className="flex items-center gap-3">
//                                             <input
//                                                 type="radio"
//                                                 name="module"
//                                                 value="company"
//                                                 checked={formData.module === "company"}
//                                                 onChange={handleChange}
//                                                 className="accent-[#286a94]"
//                                             />
//                                             <span className="font-medium text-gray-700">Company</span>
//                                         </div>

//                                         {formData.module === "company" && (
//                                             <span className="text-xs text-[#286a94] font-semibold">Selected</span>
//                                         )}
//                                     </label>

//                                     {/* Campus */}
//                                     <label className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition 
//       ${formData.module === "campus" ? "border-[#286a94] bg-blue-50" : "border-gray-300"}`}>

//                                         <div className="flex items-center gap-3">
//                                             <input
//                                                 type="radio"
//                                                 name="module"
//                                                 value="campus"
//                                                 checked={formData.module === "campus"}
//                                                 onChange={handleChange}
//                                                 className="accent-[#286a94]"
//                                             />
//                                             <span className="font-medium text-gray-700">Campus</span>
//                                         </div>

//                                         {formData.module === "campus" && (
//                                             <span className="text-xs text-[#286a94] font-semibold">Selected</span>
//                                         )}
//                                     </label>
//                                 </div>
//                             </div>

//                             <div className=''>
//                                 <label className="block text-gray-700 mb-1" htmlFor="select-option">Select Country</label>
//                                 <Select
//                                     options={options}
//                                     onChange={setSelectedOption}
//                                     placeholder="Select Country"
//                                     getOptionLabel={(option) => option.searchLabel}
//                                     isSearchable
//                                 />

//                             </div>

//                             {/* Name Field */}
//                             <div>
//                                 <label htmlFor="name" className="block text-gray-700 mb-1">
//                                     {formData.module === "campus" ? 'Campus Name' : 'Company Name'}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="name"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     placeholder="Enter your full name"
//                                     className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                     required
//                                 />
//                             </div>

//                             {/* Email Field */}
//                             <div>
//                                 <label htmlFor="email" className="block text-gray-700 mb-1">
//                                     Email Address
//                                 </label>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Enter your email"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                     required
//                                 />
//                             </div>

//                             {/* Password Field */}
//                             <div className="relative">
//                                 <label htmlFor="password" className="block text-gray-700 mb-1">
//                                     Password
//                                 </label>

//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     id="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     placeholder="Create a strong password"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 pr-12"
//                                     required
//                                 />

//                                 {/* Eye Button */}
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500"
//                                 >
//                                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                                 </button>
//                             </div>

//                             {/* Confirm-Password Field */}
//                             {/* Confirm-Password Field */}
//                             <div className="relative">
//                                 <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
//                                     Confirm Password
//                                 </label>

//                                 <input
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     id="confirmPassword"
//                                     name="confirm_password"
//                                     value={formData.confirm_password}
//                                     onChange={handleChange}
//                                     placeholder="Re-enter your password"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 pr-12"
//                                     required

//                                     onPaste={(e) => e.preventDefault()}
//                                     onCopy={(e) => e.preventDefault()}
//                                     onCut={(e) => e.preventDefault()}
//                                     onContextMenu={(e) => e.preventDefault()} // optional: disables right-click
//                                 />
//                             </div>


//                             {/* Submit Button */}
//                             <button
//                                 type="submit"
//                                 className="w-full bg-[#286a94] text-white font-semibold py-2 rounded-lg transition"
//                             >
//                                 {isLoading ? "Signing..." : "Create Account"}
//                             </button>

//                         </form>

//                         <p className="text-center text-gray-600 text-sm mt-4">
//                             Already have a vendor account?{" "}
//                             <span
//                                 onClick={() => navigate("/")}
//                                 className="text-blue-600 hover:underline cursor-pointer"
//                             >
//                                 Login
//                             </span>
//                         </p>
//                     </div>
//                 </motion.div>

//             </div>
//         </div>
//     );
// };

// export default SignupPage;

//=================================

// import { useState } from "react";
// import { Logo } from "../components/landing/Navbar";
// import { FormField, inputClass } from "../libs/Divider";
// import { useNavigate } from "react-router-dom";

// function SignupPage({ nav }) {
//     const navigate=useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", password: "", role: "", org: "" });
//   const [showPass, setShowPass] = useState(false);
//   const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));
//   const trialPerks = {
//     student: "10 assessment credits · AI feedback reports · Profile badge",
//     college: "50 assessment credits · Batch analytics · Student exports",
//     recruiter: "25 candidate assessments · AI hiring summaries · Filtering tools",
//     parent: "Linked student tracking · Monthly AI reports · Progress alerts",
//   };
//   return (
//     <div className="min-h-screen bg-linear-to-br from-[#F0F7FF] to-[#EBF4FD] flex items-center justify-center p-8">
//       <div className="flex max-w-5xl w-full rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(43,127,255,0.15)]">
//         {/* Left Panel */}
//         <div className="flex-1 min-w-[320px] bg-linear-to-b from-[#0F2744] to-[#1A3F6E] p-12 flex flex-col">
//           <Logo nav={nav} />
//           <div className="h-8" />
//           <div className="bg-blue-500/18 border border-blue-500/30 rounded-2xl p-5 mb-7">
//             <div className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-wider">🎉 Free Trial Included</div>
//             <div className="text-2xl font-extrabold text-white mb-1">1 Month Free</div>
//             <div className="text-sm text-[#94B8D8]">No credit card required · Cancel anytime</div>
//             <div className="flex flex-wrap gap-2 mt-3">
//               {["10 Student Credits", "50 College Credits", "25 Recruiter Credits"].map((c) => (
//                 <span key={c} className="text-xs bg-blue-500/22 text-blue-400 px-2.5 py-1 rounded-full font-semibold">
//                   {c}
//                 </span>
//               ))}
//             </div>
//           </div>
//           <h2 className="text-2xl font-extrabold text-white mb-2.5 tracking-tight">
//             Join thousands of students & recruiters
//           </h2>
//           <p className="text-sm text-[#94B8D8] leading-relaxed mb-6">
//             Skill-based hiring is the future. Be part of the platform that's making it happen.
//           </p>
//           {["AI-powered assessments in 60 seconds", "Instant feedback with improvement roadmap", "Verified skill scores for your profile"].map((b) => (
//             <div key={b} className="flex gap-2.5 items-center mb-3">
//               <div className="w-5 h-5 rounded-full bg-blue-500/25 flex items-center justify-center shrink-0 text-xs text-blue-400">✓</div>
//               <span className="text-sm text-[#94B8D8]">{b}</span>
//             </div>
//           ))}
//         </div>
//         {/* Right Panel */}
//         <div className="flex-1 min-w-[340px] bg-white p-10 overflow-y-auto">
//           <h1 className="text-2xl font-extrabold text-[#0F2744] mb-1.5">Create Your Account</h1>
//           <p className="text-sm text-[#6B84A0] mb-6">
//             Already have an account?{" "}
//             <span onClick={() => navigate("/login")} className="text-blue-500 font-semibold cursor-pointer">
//               Log in →
//             </span>
//           </p>
//           <FormField label="Full Name">
//             <input type="text" placeholder="Your full name" value={form.name} onChange={(e) => handle("name", e.target.value)} className={inputClass} />
//           </FormField>
//           <FormField label="Email Address">
//             <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => handle("email", e.target.value)} className={inputClass} />
//           </FormField>
//           <FormField label="Password">
//             <div className="relative">
//               <input type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => handle("password", e.target.value)} className={`${inputClass} pr-12`} />
//               <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-[#6B84A0] text-base">
//                 {showPass ? "🙈" : "👁"}
//               </button>
//             </div>
//           </FormField>
//           <FormField label="I am a...">
//             <select value={form.role} onChange={(e) => handle("role", e.target.value)} className={`${inputClass} cursor-pointer`}>
//               <option value="">Select your role</option>
//               <option value="student">Student (MBA, B.Tech, etc.)</option>
//               <option value="college">College / University</option>
//               <option value="recruiter">Recruiter / Company</option>
//               <option value="parent">Parent</option>
//             </select>
//           </FormField>
//           {form.role === "student" && (
//             <FormField label="College / University">
//               <input type="text" placeholder="e.g. IIT Delhi, BITS Pilani" value={form.org} onChange={(e) => handle("org", e.target.value)} className={inputClass} />
//             </FormField>
//           )}
//           {form.role === "recruiter" && (
//             <FormField label="Company Name">
//               <input type="text" placeholder="e.g. Infosys, Razorpay" value={form.org} onChange={(e) => handle("org", e.target.value)} className={inputClass} />
//             </FormField>
//           )}
//           {form.role && trialPerks[form.role] && (
//             <div className="mb-5 p-4 bg-[#F0F7FF] rounded-xl border border-blue-200">
//               <div className="text-xs font-bold text-blue-500 mb-1">✓ Your Free Trial Includes:</div>
//               <div className="text-sm text-[#3A5068]">{trialPerks[form.role]}</div>
//             </div>
//           )}
//           <button className="w-full py-4 text-base font-bold text-white rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_24px_rgba(43,127,255,0.4)] hover:shadow-[0_10px_32px_rgba(43,127,255,0.5)] hover:-translate-y-0.5 transition-all mb-3">
//             Create Account — Start Free Trial →
//           </button>
//           <p className="text-xs text-[#94B8D8] text-center leading-relaxed">
//             By signing up, you agree to our{" "}
//             <span className="text-blue-500 cursor-pointer">Terms</span> and{" "}
//             <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;

//==================================


// import { useState, useEffect } from "react";

// import { useForm, Controller } from "react-hook-form";

// import Select from "react-select";

// import { Eye, EyeOff } from "lucide-react";

// import { Link, useNavigate } from "react-router-dom";

// import { toast } from "react-hot-toast";

// import { Logo } from "../components/landing/Navbar";

// import { FormField, inputClass } from "../libs/Divider";

// import { useSignupMutation } from "../redux/services/authApi";

// import { useGetCountryDataQuery } from "../redux/services/externalApi";

// function SignupPage({ nav }) {

//     const navigate = useNavigate();

//     const [showPass, setShowPass] = useState(false);

//     const [showConfirmPass, setShowConfirmPass] = useState(false);

//     const [signup, { isLoading }] = useSignupMutation();

//     const { data: countryList } = useGetCountryDataQuery();

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     },[])

//     const {

//         register,

//         handleSubmit,

//         watch,

//         control,

//         setValue,

//         formState: { errors },

//     } = useForm({

//         defaultValues: {

//             module: "campus",

//             name: "",

//             email: "",

//             password: "",

//             confirm_password: "",

//             country: null,

//         },

//     });

//     const watchedModule = watch("module");

//     const watchedPassword = watch("password");

//     // Build react-select options from country list

//     const countryOptions = (countryList?.data || []).map((c) => ({

//         value: c,

//         searchLabel: c.name,

//         label: (
//             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <img

//                     src={c.flag ?? ""}

//                     alt={c.name}

//                     style={{ width: 20, height: 14, objectFit: "cover" }}

//                 />
//                 <span>{c.name}</span>
//             </div>

//         ),

//     }));

//     const trialPerks = {

//         company: "500 Free Given Credits",

//         // campus: "50 assessment credits · Batch analytics · Student exports",

//     };

//     const onSubmit = async (data) => {

//         const payload = {

//             name: data.name,

//             email: data.email,

//             password: data.password,

//             confirm_password: data.confirm_password,

//             country: data.country?.value?.name || "",

//             module: data.module,

//         };

//         try {

//             const result = await signup(payload).unwrap();

//             if (result?.status) {

//                 toast.success("Signup successfully!");

//                 setTimeout(() => {

//                     navigate(`/otp-verify?email=${result?.email}`);

//                 }, 1000);

//             }

//         } catch (err) {

//             toast.error(err?.data?.detail || "Unable to signup");

//         }

//     };

//     return (
//         <div className="min-h-screen bg-linear-to-br from-[#F0F7FF] to-[#EBF4FD] flex items-center justify-center p-8">
//             <div className="flex max-w-5xl w-full rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(43,127,255,0.15)]">

//                 {/* ── Left Panel ── */}
//                 <div className="flex-1 min-w-[320px] bg-linear-to-b from-[#0F2744] to-[#1A3F6E] p-12 py-6 flex flex-col">
//                     <Logo nav={nav} item={true} width={250} />
//                     <div className="h-" />

//                     <div className="bg-blue-500/18 border border-blue-500/30 rounded-2xl p-5 mb-7">
//                         <div className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-wider">

//                             🎉 Free Trial Included
//                         </div>
//                         <div className="text-2xl font-extrabold text-white mb-1">1 Month Free</div>
//                         <div className="text-sm text-[#94B8D8]">No credit card required · Cancel anytime</div>
//                         <div className="flex flex-wrap gap-2 mt-3">

//                             {["500 Free Given Credits"].map((c) => (
//                                 <span key={c} className="text-xs bg-blue-500/22 text-blue-400 px-2.5 py-1 rounded-full font-semibold">

//                                     {c}
//                                 </span>

//                             ))}
//                         </div>
//                     </div>

                    
//                     <p className="text-sm text-[#94B8D8] leading-relaxed mb-6">

//                         Join eBench and expand your opportunities by connecting with global clients,

//                         streamlining your workflow, and showcasing your services on a powerful AI-driven platform.
//                     </p>

//                     {[

//                         "Access to global clients and recruitment projects.",

//                         "AI tools that automate repetitive vendor tasks.",

//                         "Insightful dashboards to track performance and analytics.",

//                         "Secure onboarding with fast verification and approval.",

//                         "Exclusively designed for vendor success and workflow efficiency.",

//                     ].map((b) => (
//                         <div key={b} className="flex gap-2.5 items-center mb-3">
//                             <div className="w-5 h-5 rounded-full bg-blue-500/25 flex items-center justify-center shrink-0 text-xs text-blue-400">

//                                 ✓
//                             </div>
//                             <span className="text-sm text-[#94B8D8]">{b}</span>
//                         </div>

//                     ))}

//                     <div className="mt-auto pt-8">
//   <p className="text-sm text-[#94B8D8] opacity-80">
//     Already registered?{" "}
//     <Link
//       to="/login"
//       className="text-white font-semibold hover:underline"
//     >
//       Login here
//     </Link>
//   </p>
// </div>
//                 </div>

//                 {/* ── Right Panel ── */}
//                 <div className="flex-1 min-w-[340px] bg-white p-10 overflow-y-auto">
//                     <h1 className="text-2xl font-extrabold text-[#0F2744] mb-1.5">Create Your Account</h1>
//                     <p className="text-sm text-[#6B84A0] mb-6">

//                         Already have an account?{" "}
//                         <span

//                             onClick={() => navigate("/login")}

//                             className="text-blue-500 font-semibold cursor-pointer"
//                         >

//                             Log in →
//                         </span>
//                     </p>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>


//                         {/* Country Select */}
//                         <FormField label="Select Country">
//                             <Controller

//                                 name="country"

//                                 control={control}

//                                 rules={{ required: "Please select a country" }}

//                                 render={({ field }) => (
//                                     <Select

//                                         {...field}

//                                         options={countryOptions}

//                                         placeholder="Select Country"

//                                         getOptionLabel={(option) => option.searchLabel}

//                                         isSearchable

//                                         styles={{

//                                             control: (base, state) => ({

//                                                 ...base,

//                                                 borderColor: errors.country

//                                                     ? "#ef4444"

//                                                     : state.isFocused

//                                                         ? "#93c5fd"

//                                                         : "#d1d5db",

//                                                 borderRadius: "0.5rem",

//                                                 padding: "1px",

//                                                 boxShadow: state.isFocused ? "0 0 0 2px #dbeafe" : "none",

//                                                 "&:hover": { borderColor: "#93c5fd" },

//                                             }),

//                                         }}

//                                     />

//                                 )}

//                             />

//                             {errors.country && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>

//                             )}
//                         </FormField>

//                         {/* Name */}
//                         <FormField label="Campus Name">
//                             <input

//                                 type="text"

//                                 placeholder="Enter your campus name"

//                                 className={`${inputClass} ${errors.name ? "border-red-400 focus:ring-red-100" : ""}`}

//                                 {...register("name", {

//                                     required: "Name is required",

//                                     minLength: { value: 2, message: "Name must be at least 2 characters" },

//                                 })}

//                             />

//                             {errors.name && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>

//                             )}
//                         </FormField>

//                         {/* Email */}
//                         <FormField label="Email Address">
//                             <input

//                                 type="email"

//                                 placeholder="you@example.com"

//                                 className={`${inputClass} ${errors.email ? "border-red-400 focus:ring-red-100" : ""}`}

//                                 {...register("email", {

//                                     required: "Email is required",

//                                     pattern: {

//                                         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

//                                         message: "Enter a valid email address",

//                                     },

//                                 })}

//                             />

//                             {errors.email && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>

//                             )}
//                         </FormField>

//                         {/* Password */}
//                         <FormField label="Password">
//                             <div className="relative">
//                                 <input

//                                     type={showPass ? "text" : "password"}

//                                     placeholder="Min. 8 characters"

//                                     className={`${inputClass} pr-12 ${errors.password ? "border-red-400 focus:ring-red-100" : ""}`}

//                                     {...register("password", {

//                                         required: "Password is required",

//                                         minLength: { value: 8, message: "Password must be at least 8 characters" },

//                                         pattern: {

//                                             value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,

//                                             message: "Must include uppercase, lowercase, and a number",

//                                         },

//                                     })}

//                                 />
//                                 <button

//                                     type="button"

//                                     onClick={() => setShowPass(!showPass)}

//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent border-0 cursor-pointer"
//                                 >

//                                     {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//                                 </button>
//                             </div>

//                             {errors.password && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>

//                             )}
//                         </FormField>

//                         {/* Confirm Password */}
//                         <FormField label="Confirm Password">
//                             <div className="relative">
//                                 <input

//                                     type={showConfirmPass ? "text" : "password"}

//                                     placeholder="Re-enter your password"

//                                     className={`${inputClass} pr-12 ${errors.confirm_password ? "border-red-400 focus:ring-red-100" : ""}`}

//                                     onPaste={(e) => e.preventDefault()}

//                                     onCopy={(e) => e.preventDefault()}

//                                     onCut={(e) => e.preventDefault()}

//                                     onContextMenu={(e) => e.preventDefault()}

//                                     {...register("confirm_password", {

//                                         required: "Please confirm your password",

//                                         validate: (val) =>

//                                             val === watchedPassword || "Passwords do not match",

//                                     })}

//                                 />
//                                 <button

//                                     type="button"

//                                     onClick={() => setShowConfirmPass(!showConfirmPass)}

//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent border-0 cursor-pointer"
//                                 >

//                                     {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
//                                 </button>
//                             </div>

//                             {errors.confirm_password && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>

//                             )}
//                         </FormField>

//                         {/* Trial Perks Banner */}

//                         {watchedModule && trialPerks[watchedModule] && (
//                             <div className="p-4 bg-[#F0F7FF] rounded-xl border border-blue-200">
//                                 <div className="text-xs font-bold text-blue-500 mb-1">✓ Your Free Trial Includes:</div>
//                                 <div className="text-sm text-[#3A5068]">{trialPerks[watchedModule]}</div>
//                             </div>

//                         )}

//                         {/* Submit */}
//                         <button

//                             type="submit"

//                             disabled={isLoading}

//                             className="w-full py-4 text-base font-bold text-white rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_24px_rgba(43,127,255,0.4)] hover:shadow-[0_10px_32px_rgba(43,127,255,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
//                         >

//                             {isLoading ? "Creating Account..." : "Create Account — Start Free Trial →"}
//                         </button>
//                     </form>

//                     <p className="text-xs text-[#94B8D8] text-center leading-relaxed mt-3">

//                         By signing up, you agree to our{" "}
//                         <span className="text-blue-500 cursor-pointer">Terms</span> and{" "}
//                         <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
//                     </p>
//                 </div>
//             </div>
//         </div>

//     );

// }

// export default SignupPage;

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";

import Select from "react-select";

import { Eye, EyeOff } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import { Logo } from "../components/landing/Navbar";

import { FormField, inputClass } from "../libs/Divider";

import { useSignupMutation } from "../redux/services/authApi";

import { useGetCountryDataQuery } from "../redux/services/externalApi";

import { validateEmailByRole, getEmailPlaceholder } from "../utils/emailValidation";

function SignupPage({ nav }) {

    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);

    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [signup, { isLoading }] = useSignupMutation();

    const { data: countryList } = useGetCountryDataQuery();

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    const {

        register,

        handleSubmit,

        watch,

        control,

        setValue,

        formState: { errors },

    } = useForm({

        defaultValues: {

            module: "student",

            name: "",

            email: "",

            password: "",

            confirm_password: "",

            country: null,

        },

    });

    const watchedModule = watch("module");

    const watchedPassword = watch("password");

    // Clear email field when role changes to prevent confusion
    useEffect(() => {
        if (watchedModule) {
            setValue("email", "");
        }
    }, [watchedModule, setValue]);

    // Build react-select options from country list

    const countryOptions = (countryList?.data || []).map((c) => ({

        value: c,

        searchLabel: c.name,

        label: (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img

                    src={c.flag ?? ""}

                    alt={c.name}

                    style={{ width: 20, height: 14, objectFit: "cover" }}

                />
                <span>{c.name}</span>
            </div>

        ),

    }));

    const trialPerks = {

        student: "500 Free Application Tests · Internship Opportunities · Training Programs · Job Placement Support",

        campus: "500 Free Given Credits",

    };

    const onSubmit = async (data) => {

        const payload = {

            name: data.name,

            email: data.email,

            password: data.password,

            confirm_password: data.confirm_password,

            country: data.country?.value?.name || "",

            module: data.module,

        };

        try {

            const result = await signup(payload).unwrap();

            if (result?.status) {

                toast.success("Signup successfully!");

                setTimeout(() => {

                    navigate(`/otp-verify?email=${result?.email}`);

                }, 1000);

            }

        } catch (err) {

            toast.error(err?.data?.detail || "Unable to signup");

        }

    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#F0F7FF] to-[#EBF4FD] flex items-center justify-center p-8">
            <div className="flex max-w-5xl w-full rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(43,127,255,0.15)]">

                {/* ── Left Panel ── */}
                <div className="flex-1 min-w-[320px] bg-linear-to-b from-[#0F2744] to-[#1A3F6E] p-12 flex flex-col">
                    <Logo nav={nav} />
                    <div className="h-8" />

                    <div className="bg-blue-500/18 border border-blue-500/30 rounded-2xl p-5 mb-7">
                        <div className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-wider">

                            🎉 Free Trial Included
                        </div>
                        <div className="text-2xl font-extrabold text-white mb-1">1 Month Free</div>
                        <div className="text-sm text-[#94B8D8]">No credit card required · Cancel anytime</div>
                        <div className="flex flex-wrap gap-2 mt-3">

                            {["500 Free Given Credits"].map((c) => (
                                <span key={c} className="text-xs bg-blue-500/22 text-blue-400 px-2.5 py-1 rounded-full font-semibold">

                                    {c}
                                </span>

                            ))}
                        </div>
                    </div>

                    
                    <p className="text-sm text-[#94B8D8] leading-relaxed mb-6">

                        Join eBench and expand your opportunities by connecting with global clients,

                        streamlining your workflow, and showcasing your services on a powerful AI-driven platform.
                    </p>

                    {[

                        "Access to global clients and recruitment projects.",

                        "AI tools that automate repetitive vendor tasks.",

                        "Insightful dashboards to track performance and analytics.",

                        "Secure onboarding with fast verification and approval.",

                        "Exclusively designed for vendor success and workflow efficiency.",

                    ].map((b) => (
                        <div key={b} className="flex gap-2.5 items-center mb-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500/25 flex items-center justify-center shrink-0 text-xs text-blue-400">

                                ✓
                            </div>
                            <span className="text-sm text-[#94B8D8]">{b}</span>
                        </div>

                    ))}

                    <div className="mt-auto pt-8">
  <p className="text-sm text-[#94B8D8] opacity-80">
    Already registered?{" "}
    <Link
      to="/login"
      className="text-white font-semibold hover:underline"
    >
      Login here
    </Link>
  </p>
</div>
                </div>

                {/* ── Right Panel ── */}
                <div className="flex-1 min-w-[340px] bg-white p-10 overflow-y-auto">
                    <h1 className="text-2xl font-extrabold text-[#0F2744] mb-1.5">Create Your Account</h1>
                    <p className="text-sm text-[#6B84A0] mb-6">

                        Already have an account?{" "}
                        <span

                            onClick={() => navigate("/login")}

                            className="text-blue-500 font-semibold cursor-pointer"
                        >

                            Log in →
                        </span>
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                        {/* Registered As */}
                        <FormField label="Registered As">
                            <div className="grid grid-cols-2 gap-3">

                                {["student", "campus"].map((mod) => (
                                    <label

                                        key={mod}

                                        className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition

                      ${watchedModule === mod

                                                ? "border-[#286a94] bg-blue-50"

                                                : "border-gray-300"

                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input

                                                type="radio"

                                                value={mod}

                                                {...register("module")}

                                                className="accent-[#286a94]"

                                            />
                                            <span className="font-medium text-gray-700 capitalize">{mod}</span>
                                        </div>

                                        {watchedModule === mod && (
                                            <span className="text-xs text-[#286a94] font-semibold">Selected</span>

                                        )}
                                    </label>

                                ))}
                            </div>
                        </FormField>

                        {/* Country Select */}
                        <FormField label="Select Country">
                            <Controller

                                name="country"

                                control={control}

                                rules={{ required: "Please select a country" }}

                                render={({ field }) => (
                                    <Select

                                        {...field}

                                        options={countryOptions}

                                        placeholder="Select Country"

                                        getOptionLabel={(option) => option.searchLabel}

                                        isSearchable

                                        styles={{

                                            control: (base, state) => ({

                                                ...base,

                                                borderColor: errors.country

                                                    ? "#ef4444"

                                                    : state.isFocused

                                                        ? "#93c5fd"

                                                        : "#d1d5db",

                                                borderRadius: "0.5rem",

                                                padding: "1px",

                                                boxShadow: state.isFocused ? "0 0 0 2px #dbeafe" : "none",

                                                "&:hover": { borderColor: "#93c5fd" },

                                            }),

                                        }}

                                    />

                                )}

                            />

                            {errors.country && (
                                <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>

                            )}
                        </FormField>

                        {/* Name */}
                        <FormField label={watchedModule === "campus" ? "Campus Name" : "Student Name"}>
                            <input

                                type="text"

                                placeholder={`Enter your ${watchedModule === "campus" ? "campus" : "student"} name`}

                                className={`${inputClass} ${errors.name ? "border-red-400 focus:ring-red-100" : ""}`}

                                {...register("name", {

                                    required: "Name is required",

                                    minLength: { value: 2, message: "Name must be at least 2 characters" },

                                })}

                            />

                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>

                            )}
                        </FormField>

                        {/* Email */}
                        <FormField label="Email Address">
                            <input

                                type="email"

                                placeholder={getEmailPlaceholder(watchedModule)}

                                className={`${inputClass} ${errors.email ? "border-red-400 focus:ring-red-100" : ""}`}

                                {...register("email", {

                                    required: "Email is required",

                                    validate: (value) => {
                                        const validation = validateEmailByRole(value, watchedModule);
                                        return validation.isValid || validation.message;
                                    }

                                })}

                            />

                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>

                            )}
                            
                            {watchedModule && (
                                <p className="text-gray-500 text-xs mt-1">
                                    {watchedModule === "campus" 
                                        ? "Use your work email (e.g., vishal@company.com)"
                                        : "Use your personal email (e.g., personal@gmail.com)"
                                    }
                                </p>
                            )}
                        </FormField>

                        {/* Password */}
                        <FormField label="Password">
                            <div className="relative">
                                <input

                                    type={showPass ? "text" : "password"}

                                    placeholder="Min. 8 characters"

                                    className={`${inputClass} pr-12 ${errors.password ? "border-red-400 focus:ring-red-100" : ""}`}

                                    {...register("password", {

                                        required: "Password is required",

                                        minLength: { value: 8, message: "Password must be at least 8 characters" },

                                        pattern: {

                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,

                                            message: "Must include uppercase, lowercase, and a number",

                                        },

                                    })}

                                />
                                <button

                                    type="button"

                                    onClick={() => setShowPass(!showPass)}

                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent border-0 cursor-pointer"
                                >

                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>

                            )}
                        </FormField>

                        {/* Confirm Password */}
                        <FormField label="Confirm Password">
                            <div className="relative">
                                <input

                                    type={showConfirmPass ? "text" : "password"}

                                    placeholder="Re-enter your password"

                                    className={`${inputClass} pr-12 ${errors.confirm_password ? "border-red-400 focus:ring-red-100" : ""}`}

                                    onPaste={(e) => e.preventDefault()}

                                    onCopy={(e) => e.preventDefault()}

                                    onCut={(e) => e.preventDefault()}

                                    onContextMenu={(e) => e.preventDefault()}

                                    {...register("confirm_password", {

                                        required: "Please confirm your password",

                                        validate: (val) =>

                                            val === watchedPassword || "Passwords do not match",

                                    })}

                                />
                                <button

                                    type="button"

                                    onClick={() => setShowConfirmPass(!showConfirmPass)}

                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent border-0 cursor-pointer"
                                >

                                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.confirm_password && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>

                            )}
                        </FormField>

                        {/* Trial Perks Banner */}

                        {watchedModule && trialPerks[watchedModule] && (
                            <div className="p-4 bg-[#F0F7FF] rounded-xl border border-blue-200">
                                <div className="text-xs font-bold text-blue-500 mb-1">✓ Your Free Trial Includes:</div>
                                <div className="text-xs text-[#3A5068]">{trialPerks[watchedModule]}</div>
                            </div>

                        )}

                        {/* Submit */}
                        <button

                            type="submit"

                            disabled={isLoading}

                            className="w-full py-4 text-base font-bold text-white rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_24px_rgba(43,127,255,0.4)] hover:shadow-[0_10px_32px_rgba(43,127,255,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >

                            {isLoading ? "Creating Account..." : "Create Account — Start Free Trial →"}
                        </button>
                    </form>

                    <p className="text-xs text-[#94B8D8] text-center leading-relaxed mt-3">

                        By signing up, you agree to our{" "}
                        <span className="text-blue-500 cursor-pointer">Terms</span> and{" "}
                        <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>

    );

}

export default SignupPage;

