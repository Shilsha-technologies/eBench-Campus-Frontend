// import { useState, useEffect, useRef } from "react";
// import toast from "react-hot-toast";
// import { useSubvendorProfileQuery, useSubVendorChangePasswordMutation } from "../../redux/services/subvendorApi";
// import { useForm } from "react-hook-form";
// import Loader from "../../libs/Loader";
// import { UserRoundPen, Key } from "lucide-react";

// const ProfileSection = () => {
//   const { data, isLoading } = useSubvendorProfileQuery()
//   const [open, setOpen] = useState(false)
//   const [changePasswordOpen, setChangePasswordOpen] = useState(false)



//   const { subvendor, vendor, company } = data || {};

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: subvendor?.name || "",
//       phone: subvendor?.phone || "",
//       address: subvendor?.sub_vendor_address || "",
//       gender: subvendor?.gender || "",
//     },
//   });

//   const handleOpen = () => {
//     reset({
//       name: subvendor?.name,
//       phone: subvendor?.phone,
//       address: subvendor?.sub_vendor_address,
//       gender: subvendor?.gender,
//     });
//     setOpen(true);
//   };


//   const onSubmit = async (formDataValues) => {
//     try {

//       const formData = new FormData();
//       formData.append(
//         "subvendor",
//         JSON.stringify({
//           name: formDataValues.name,
//           phone: formDataValues.phone,
//           address: formDataValues.address,
//           gender: formDataValues.gender,
//         })
//       );

//       const res = await fetch("http://localhost:8000/profile", {
//         method: "PUT",
//         headers: {
//           Authorization: "Bearer YOUR_ACCESS_TOKEN",
//         },
//         body: formData,
//       });

//       const result = await res.json();
//       console.log("Updated:", result);

//       setOpen(false);
//     } catch (err) {
//       console.error(err);
//     } finally {
//     }
//   };

  

//   if (isLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-full gap-3">
//         <Loader />
//         <p className="text-gray-500 text-sm">Loading, please wait...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
//       <div className="w-full max-w-5xl space-y-6">

//         {/* Profile Card */}
//         <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">

//           {/* Avatar */}
//           <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
//             {subvendor?.name?.charAt(0)?.toUpperCase() || "U"}
//           </div>

//           {/* Info */}
//           <div className="flex-1 text-center md:text-left ">
//             <div className="flex items-start justify-between bg-white p-4 rounded-xl shadow-sm">
//               {/* Left Section */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   {subvendor?.name || "N/A"}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {subvendor?.email || "No email available"}
//                 </p>
//               </div>

//               {/* Right Section */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleOpen}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors duration-200">
//                   <UserRoundPen size={16} />
//                   Edit
//                 </button>
//                 <button 
//                   onClick={() => setChangePasswordOpen(true)}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors duration-200">
//                   <Key size={16} />
//                   Change Password
//                 </button>
//               </div>
//             </div>


//             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
//               <p><span className="font-medium">Phone:</span> +{subvendor?.phone || "N/A"}</p>
//               <p><span className="font-medium">Gender:</span> {subvendor?.gender || "N/A"}</p>
//               <p><span className="font-medium">Country:</span> {subvendor?.country || "N/A"}</p>
//               <p><span className="font-medium">Status:</span>
//                 <span className={`ml-2 px-2 py-1 rounded-full text-xs ${subvendor?.active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
//                   }`}>
//                   {subvendor?.active ? "Active" : "Inactive"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Address Section */}
//         <div className="bg-white shadow-md rounded-2xl p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Address Information
//           </h3>

//           <div className="grid sm:grid-cols-2 gap-4 text-gray-600 text-sm">
//             <p><span className="font-medium">Company Address:</span> {subvendor?.company_address || "N/A"}</p>
//             <p><span className="font-medium">Address:</span> {subvendor?.sub_vendor_address || "N/A"}</p>
//           </div>
//         </div>

//         {/* Vendor Info */}
//         <div className="bg-white shadow-md rounded-2xl p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Vendor Information
//           </h3>

//           <div className="grid sm:grid-cols-2 gap-4 text-gray-600 text-sm">
//             <p><span className="font-medium">Vendor Name:</span> {vendor?.name || "N/A"}</p>
//             <p><span className="font-medium">Vendor Email:</span> {vendor?.email || "N/A"}</p>
//             <p><span className="font-medium">Vendor Phone:</span> {'+'+vendor?.phone || "N/A"}</p>
//           </div>
//         </div>

//         {/* Company Info */}
//         <div className="bg-white shadow-md rounded-2xl p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Company Information
//           </h3>

//           <div className="grid sm:grid-cols-2 gap-4 text-gray-600 text-sm">
//             <p><span className="font-medium">Company Name:</span> {company?.company_name || "N/A"}</p>
//             <p><span className="font-medium">Website:</span>
//               <a
//                 href={company?.website}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-blue-600 hover:underline ml-1"
//               >
//                 {company?.website || "N/A"}
//               </a>
//             </p>
//             <p><span className="font-medium">Registration No:</span> {company?.registration_number || "N/A"}</p>
//             <p><span className="font-medium">Location:</span> {company?.location || "N/A"}</p>
//           </div>
//         </div>

//       </div>
//       {/* MODAL */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

//             <h2 className="text-xl font-semibold mb-4">
//               Edit Profile
//             </h2>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//               {/* Name */}
//               <div>
//                 <label className="text-sm text-gray-600">Name</label>
//                 <input
//                   {...register("name", { required: "Name is required" })}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-xs">{errors.name.message}</p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="text-sm text-gray-600">Phone</label>
//                 <input
//                   {...register("phone", { required: "Phone is required" })}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//               </div>

//               {/* Address */}
//               <div>
//                 <label className="text-sm text-gray-600">Address</label>
//                 <input
//                   {...register("address")}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 />
//               </div>

//               {/* Gender */}
//               <div>
//                 <label className="text-sm text-gray-600">Gender</label>
//                 <select
//                   {...register("gender")}
//                   className="w-full mt-1 p-2 border rounded-lg"
//                 >
//                   <option value="">Select</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//               </div>

//               {/* ACTIONS */}
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setOpen(false)}
//                   className="px-4 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   //   disabled={loading}
//                   className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   {false ? "Updating..." : "Save Changes"}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       )}
//       {changePasswordOpen && <SubVendorChangePasswordModal onClose={() => setChangePasswordOpen(false)} />}
//     </div>
//   );
// };

// /* ================= SUBVENDOR CHANGE PASSWORD MODAL ================= */

// function getStrength(pw) {
//     if (!pw) return { score: 0, label: "", color: "" };
//     let s = 0;
//     if (pw.length >= 8) s++;
//     if (/[A-Z]/.test(pw)) s++;
//     if (/[0-9]/.test(pw)) s++;
//     if (/[^A-Za-z0-9]/.test(pw)) s++;
//     const map = [
//         { label: "Too short", color: "#ef4444" },
//         { label: "Weak", color: "#f97316" },
//         { label: "Fair", color: "#eab308" },
//         { label: "Good", color: "#22c55e" },
//         { label: "Strong 💪", color: "#16a34a" },
//     ];
//     return { score: s, ...map[s] };
// }

// const EyeIcon = ({ open }) =>
//     open ? (
//         <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//         </svg>
//     ) : (
//         <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//         </svg>
//     );

// const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
//     id: i,
//     size: 4 + Math.random() * 8,
//     left: 5 + Math.random() * 90,
//     bottom: -20 + Math.random() * 30,
//     dur: 3 + Math.random() * 4,
//     delay: Math.random() * 4,
//     op: 0.15 + Math.random() * 0.25,
//     color: i % 3 === 0 ? "#286a94" : i % 3 === 1 ? "#4fb3e8" : "#a5d8f0",
// }));

// function SubVendorChangePasswordModal({ onClose }) {
//     const [phase, setPhase] = useState("entering"); // entering | idle | exiting
//     const [show, setShow] = useState({ cur: false, nw: false, cf: false });
//     const [success, setSuccess] = useState(false);
//     const submitBtnRef = useRef(null);
//     const [submit, { isLoading }] = useSubVendorChangePasswordMutation()

//     const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ mode: "onChange" });
//     const newPass = watch("newPassword", "");
//     const strength = getStrength(newPass);

//     useEffect(() => {
//         const t = setTimeout(() => setPhase("idle"), 450);
//         return () => clearTimeout(t);
//     }, []);

//     const handleClose = () => {
//         setPhase("exiting");
//         setTimeout(onClose, 300);
//     };

//     const onSubmit = async (data) => {
//         const { confirmPassword, currentPassword, newPassword } = data
//         try {
//             const result = await submit({
//                 current_password: currentPassword,
//                 new_password: newPassword, confirm_password: confirmPassword
//             })
//             if (result?.error) {
//                 throw new Error(result?.error?.data?.detail)
//             }
//             if (result?.data) {
//                 setSuccess(true);
//                 setTimeout(handleClose, 2000);
//             }
//         } catch (err) {
//             toast.error(err?.message ?? "Internal Server Error")
//         }
//     };

//     const toggle = (f) => setShow((p) => ({ ...p, [f]: !p[f] }));

//     const handleRipple = (e) => {
//         const btn = submitBtnRef.current;
//         if (!btn) return;
//         const rect = btn.getBoundingClientRect();
//         const dot = document.createElement("span");
//         const size = Math.max(rect.width, rect.height);
//         dot.style.cssText = `
//       position:absolute; border-radius:50%; pointer-events:none;
//       background:rgba(255,255,255,0.4);
//       width:${size}px; height:${size}px;
//       left:${e.clientX - rect.left - size / 2}px;
//       top:${e.clientY - rect.top - size / 2}px;
//       animation: ripple 0.6s linear;
//     `;
//         btn.appendChild(dot);
//         setTimeout(() => dot.remove(), 600);
//     };

//     const animCls = phase === "idle" ? "" : phase;

//     return (
//         <>
//             <style>{`
//         @keyframes overlayIn  { from{opacity:0} to{opacity:1} }
//         @keyframes overlayOut { from{opacity:1} to{opacity:0} }
//         @keyframes modalIn {
//           0%   { opacity:0; transform:translateY(60px) scale(0.88); }
//           60%  { opacity:1; transform:translateY(-6px) scale(1.01); }
//           100% { opacity:1; transform:translateY(0) scale(1); }
//         }
//         @keyframes modalOut {
//           0%   { opacity:1; transform:translateY(0) scale(1); }
//           100% { opacity:0; transform:translateY(40px) scale(0.92); }
//         }
//         @keyframes floatUp {
//           0%   { transform:translateY(0) scale(1); opacity:0; }
//           15%  { opacity:var(--op); }
//           85%  { opacity:var(--op); }
//           100% { transform:translateY(-120px) scale(0.4); opacity:0; }
//         }
//         @keyframes iconBounce {
//           from { transform:scale(0) rotate(-20deg); }
//           to   { transform:scale(1) rotate(0); }
//         }
//         @keyframes fieldSlide {
//           from { opacity:0; transform:translateX(-18px); }
//           to   { opacity:1; transform:translateX(0); }
//         }
//         @keyframes successPop {
//           from { opacity:0; transform:scale(0.85) translateY(8px); }
//           to   { opacity:1; transform:scale(1) translateY(0); }
//         }
//         @keyframes checkSpin {
//           from { transform:scale(0) rotate(-90deg); }
//           to   { transform:scale(1) rotate(0); }
//         }
//         @keyframes shimmerBar { to { background-position:-300% 0; } }
//         @keyframes blobPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
//         @keyframes errPop { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes ripple { to { transform:scale(4); opacity:0; } }
//         @keyframes spin { to { transform:rotate(360deg); } }

//         .overlay-bg.entering { animation:overlayIn 0.35s ease forwards; }
//         .overlay-bg.exiting  { animation:overlayOut 0.3s ease forwards; }
//         .modal-wrap.entering .modal { animation:modalIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
//         .modal-wrap.exiting  .modal { animation:modalOut 0.3s cubic-bezier(0.4,0,1,1) forwards; }

//         .close-btn:hover { background:#fee2e2 !important; color:#ef4444 !important; transform:rotate(90deg) scale(1.1) !important; }
//         .toggle-eye:hover { color:#286a94; transform:translateY(-50%) scale(1.15); }
//         .btn-submit::after {
//           content:''; position:absolute; inset:0;
//           background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
//           transform:translateX(-100%); transition:transform 0.4s ease;
//         }
//         .btn-submit:hover::after { transform:translateX(0); }
//       `}</style>

//             {/* Overlay */}
//             <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
//                 <div className={`overlay-bg ${animCls}`} onClick={handleClose}
//                     style={{ position: "absolute", inset: 0, background: "rgba(10,30,50,0.55)", backdropFilter: "blur(6px)" }}
//                 />

//                 {/* Floating particles */}
//                 {PARTICLES.map((p) => (
//                     <span key={p.id} style={{
//                         position: "absolute", borderRadius: "50%", pointerEvents: "none",
//                         width: p.size, height: p.size, left: `${p.left}%`, bottom: p.bottom,
//                         background: p.color, zIndex: 1,
//                         animation: `floatUp ${p.dur}s ease-in-out ${p.delay}s infinite`,
//                         "--op": p.op,
//                     }} />
//                 ))}

//                 {/* Modal */}
//                 <div className={`modal-wrap ${animCls}`} style={{ position: "relative", zIndex: 2, width: 430, maxWidth: "95vw" }}>
//                     <div className="modal" style={{
//                         background: "#fff", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
//                         boxShadow: "0 32px 80px rgba(10,30,60,0.22), 0 0 0 1px rgba(255,255,255,0.8) inset",
//                     }}>

//                         {/* Header */}
//                         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
//                             <div style={{ fontSize: 18, fontWeight: 600, color: "#1a2633", display: "flex", alignItems: "center", gap: 10 }}>
//                                 <div style={{
//                                     width: 38, height: 38, borderRadius: 10,
//                                     background: "linear-gradient(135deg,#286a94,#4fb3e8)",
//                                     display: "flex", alignItems: "center", justifyContent: "center",
//                                     boxShadow: "0 4px 12px rgba(40,106,148,0.35)",
//                                     animation: "iconBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
//                                 }}>
//                                     <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                     </svg>
//                                 </div>
//                                 Change Password
//                             </div>
//                             <button className="close-btn" onClick={handleClose} style={{
//                                 width: 32, height: 32, border: "none", background: "#f1f5f9",
//                                 borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center",
//                                 justifyContent: "center", color: "#64748b", transition: "all 0.2s",
//                             }}>
//                                 <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>

//                         {success && (
//                             <div style={{
//                                 background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10,
//                                 padding: "12px 14px", color: "#166534", fontSize: 13, fontWeight: 500,
//                                 display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
//                                 animation: "successPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
//                             }}>
//                                 <div style={{
//                                     width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
//                                     background: "linear-gradient(135deg,#22c55e,#16a34a)",
//                                     display: "flex", alignItems: "center", justifyContent: "center",
//                                     animation: "checkSpin 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
//                                 }}>
//                                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                     </svg>
//                                 </div>
//                                 Password updated successfully!
//                             </div>
//                         )}

//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             {[
//                                 {
//                                     key: "currentPassword", label: "Current Password", showKey: "cur",
//                                     rules: { required: "Current password is required", minLength: { value: 6, message: "At least 6 characters" } }
//                                 },
//                                 {
//                                     key: "newPassword", label: "New Password", showKey: "nw",
//                                     rules: {
//                                         required: "New password is required", minLength: { value: 8, message: "At least 8 characters" },
//                                         validate: v => v !== watch("currentPassword") || "Must differ from current"
//                                     }
//                                 },
//                                 {
//                                     key: "confirmPassword", label: "Confirm New Password", showKey: "cf",
//                                     rules: { required: "Please confirm your password", validate: v => v === newPass || "Passwords do not match" }
//                                 },
//                             ].map(({ key, label, showKey, rules }, i) => (
//                                 <div key={key} style={{ marginBottom: 18, animation: `fieldSlide 0.4s ease ${0.15 + i * 0.07}s both` }}>
//                                     <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>
//                                     <div style={{ position: "relative" }}>
//                                         <input
//                                             type={show[showKey] ? "text" : "password"}
//                                             placeholder={`Enter ${label.toLowerCase()}`}
//                                             style={{
//                                                 width: "100%", padding: "11px 42px 11px 14px",
//                                                 border: `1.5px solid ${errors[key] ? "#ef4444" : "#e2e8f0"}`,
//                                                 borderRadius: 10, fontSize: 14, color: "#1a2633", outline: "none",
//                                                 background: "#fafbfc", fontFamily: "inherit",
//                                                 transition: "all 0.2s",
//                                             }}
//                                             onFocus={e => { e.target.style.borderColor = "#286a94"; e.target.style.boxShadow = "0 0 0 3.5px rgba(40,106,148,0.12)"; e.target.style.transform = "translateY(-1px)"; e.target.style.background = "#fff"; }}
//                                             onBlur={e => { e.target.style.borderColor = errors[key] ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.transform = "none"; }}
//                                             {...register(key, rules)}
//                                         />
//                                         <button type="button" onClick={() => toggle(showKey)} style={{
//                                             position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
//                                             background: "none", border: "none", cursor: "pointer",
//                                             color: "#94a3b8", padding: 2, display: "flex", alignItems: "center", transition: "color 0.15s",
//                                         }}>
//                                             <EyeIcon open={show[showKey]} />
//                                         </button>
//                                     </div>
//                                     {/* Strength bar for new password */}
//                                     {key === "newPassword" && newPass && (
//                                         <div style={{ marginTop: 7 }}>
//                                             <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
//                                                 <div style={{ height: "100%", borderRadius: 99, width: `${(strength.score / 4) * 100}%`, background: strength.color, transition: "width 0.4s, background 0.4s" }} />
//                                             </div>
//                                             <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: strength.color }}>{strength.label}</div>
//                                         </div>
//                                     )}
//                                     {errors[key] && (
//                                         <div style={{ fontSize: 12, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4, animation: "errPop 0.2s ease" }}>
//                                             ⚠ {errors[key].message}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}

//                             <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e2e8f0,transparent)", margin: "22px 0" }} />

//                             <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", animation: "fieldSlide 0.4s ease 0.35s both" }}>
//                                 <button type="button" onClick={handleClose} style={{
//                                     padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0",
//                                     background: "#fff", fontSize: 14, fontWeight: 500, color: "#64748b",
//                                     cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
//                                 }}>
//                                     Cancel
//                                 </button>
//                                 <button ref={submitBtnRef} type="submit" disabled={isSubmitting || success} onClick={handleRipple}
//                                     className="btn-submit" style={{
//                                         padding: "10px 22px", borderRadius: 10, border: "none",
//                                         background: "linear-gradient(135deg,#286a94,#3a8cbf)",
//                                         fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer",
//                                         display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
//                                         boxShadow: "0 4px 14px rgba(40,106,148,0.35)", position: "relative", overflow: "hidden",
//                                         transition: "all 0.2s",
//                                     }}>
//                                     {isSubmitting ? (
//                                         <>
//                                             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
//                                                 <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
//                                             </svg>
//                                             Updating…

//                                         </>
//                                     ) : (
//                                         <>
//                                             <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                             </svg>
//                                             Update Password
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default ProfileSection;

//===============

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Loader from "../../libs/Loader";
import { Key, ArrowLeft } from "lucide-react";
import { useSubvendorProfileQuery, useSubVendorChangePasswordMutation } from "../../redux/services/subvendorApi";
import { useNavigate } from "react-router-dom";


function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function Avatar({ name, image, size = "lg" }) {
  const initials = getInitials(name);
  const sizeClass =
    size === "lg"
      ? "w-20 h-20 text-2xl"
      : size === "md"
      ? "w-12 h-12 text-base"
      : "w-9 h-9 text-sm";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClass} z-50 rounded-full object-cover ring-2 ring-white shadow`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full flex z-50 items-center justify-center font-semibold bg-indigo-100 text-indigo-700 ring-2 ring-white shadow select-none`}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status ? "active" : "deactive";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {isActive || "Unknown"}
    </span>
  );
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!value || value === "Not Available" || value === "Not Provided") return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy"
      className="ml-1.5 p-1 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-indigo-600"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

function InfoRow({ label, value, copyable, icon }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      {icon && (
        <span className="mt-0.5 flex-shrink-0 text-slate-400">{icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <div className="flex items-center gap-1 flex-wrap">
          <p className="text-sm text-slate-700 font-medium break-words">{value || "N/A"}</p>
          {copyable && <CopyButton value={value} />}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
        <span className="text-indigo-500">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-600 tracking-wide uppercase">{title}</h3>
      </div>
      <div className="px-5 py-3">{children}</div>
    </div>
  );
}

function SkeletonBlock({ className }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-5">
        <SkeletonBlock className="h-28 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SkeletonBlock className="h-72 rounded-2xl" />
          <div className="md:col-span-2 space-y-5">
            <SkeletonBlock className="h-32 rounded-2xl" />
            <SkeletonBlock className="h-36 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  const navigate=useNavigate();
  const { data, isLoading, error, refetch } = useSubvendorProfileQuery();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  if (isLoading) return <SkeletonLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <div>
          <p className="text-slate-700 font-semibold text-lg">Failed to load profile</p>
          <p className="text-slate-400 text-sm mt-1">Something went wrong while fetching employee data.</p>
        </div>
        <button
          onClick={refetch}
          className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow"
        >
          Retry
        </button>
      </div>
    );
  }

  const { subvendor, vendor } = data || {};

  const icons = {
    email: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    phone: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    location: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    id: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
      </svg>
    ),
    calendar: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    building: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    person: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    globe: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className=" bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 p-4  font-sans">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── HEADER ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="w-1 h-10 rounded-full bg-indigo-500 hidden sm:block" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                {subvendor.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 tracking-wide">
                  College Employee
                </span>
                <StatusBadge status={subvendor?.active} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={() => setChangePasswordOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium cursor-pointer text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              <Key size={16} />
              Change Password
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated: {formatDate(subvendor.created_at)}
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* ── LEFT: PROFILE CARD ── */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* gradient banner */}
              <div className="h-20 bg-gradient-to-r from-indigo-500 to-violet-500 relative">
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='white'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="px-5 pb-5">
                <div className="-mt-10 mb-4 flex justify-center">
                  <Avatar name={subvendor.name} image={subvendor.profile_image} size="lg" />
                </div>
                <div className="text-center mb-5">
                  <p className="font-bold text-slate-800 text-base">{subvendor.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Sub-Vendor · College Staff</p>
                </div>
                <div className="space-y-0 divide-y divide-slate-100">
                  <InfoRow label="Email" value={subvendor.email} copyable icon={icons.email} />
                  <InfoRow label="Phone" value={subvendor.phone || "Not Available"} copyable icon={icons.phone} />
                  <InfoRow label="Gender" value={subvendor.gender} icon={icons.person} />
                  <InfoRow label="Country" value={subvendor.country} icon={icons.globe} />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="md:col-span-2 space-y-5">

            {/* Employee Info */}
            <SectionCard
              title="Employee Information"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow label="Employee ID" value={subvendor.id} icon={icons.id} />
                <InfoRow label="Joined Date" value={formatDate(subvendor.created_at)} icon={icons.calendar} />
                <div className="sm:col-span-2">
                  <InfoRow label="Address" value={subvendor.sub_vendor_address} icon={icons.location} />
                </div>
              </div>
            </SectionCard>

            {/* College / Vendor Info */}
            <SectionCard
              title="College (Vendor) Information"
              icon={icons.building}
            >
              <div className="flex items-center gap-4 mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <Avatar name={vendor.name} image={vendor.profile_image} size="md" />
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{vendor.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Academic Institution</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow label="College Email" value={vendor.email} copyable icon={icons.email} />
                <InfoRow
                  label="College Phone"
                  value={vendor.phone || "Not Provided"}
                  copyable={!!vendor.phone}
                  icon={icons.phone}
                />
              </div>
            </SectionCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Status", value: subvendor.active ? 'Active':'deactive', color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                { label: "Role", value: "Employee", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
                { label: "Region", value: subvendor.country, color: "text-amber-600 bg-amber-50 border-amber-200" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className={`rounded-xl border px-3 py-3 text-center ${color}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
                  <p className="text-sm font-bold mt-1 truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>       
      </div>
      
      {/* CHANGE PASSWORD MODAL */}
      {changePasswordOpen && <EmployeeChangePasswordModal onClose={() => setChangePasswordOpen(false)} />}
    </div>
  );
}

/* ================= EMPLOYEE CHANGE PASSWORD MODAL ================= */

function getStrength(pw) {
    if (!pw) return { score: 0, label: "", color: "" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const map = [
        { label: "Too short", color: "#ef4444" },
        { label: "Weak", color: "#f97316" },
        { label: "Fair", color: "#eab308" },
        { label: "Good", color: "#22c55e" },
        { label: "Strong 💪", color: "#16a34a" },
    ];
    return { score: s, ...map[s] };
}

const EyeIcon = ({ open }) =>
    open ? (
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ) : (
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 4 + Math.random() * 8,
    left: 5 + Math.random() * 90,
    bottom: -20 + Math.random() * 30,
    dur: 3 + Math.random() * 4,
    delay: Math.random() * 4,
    op: 0.15 + Math.random() * 0.25,
    color: i % 3 === 0 ? "#286a94" : i % 3 === 1 ? "#4fb3e8" : "#a5d8f0",
}));

function EmployeeChangePasswordModal({ onClose }) {
    const [phase, setPhase] = useState("entering"); // entering | idle | exiting
    const [show, setShow] = useState({ cur: false, nw: false, cf: false });
    const [success, setSuccess] = useState(false);
    const submitBtnRef = useRef(null);
    const [submit, { isLoading }] = useSubVendorChangePasswordMutation();

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ mode: "onChange" });
    const newPass = watch("newPassword", "");
    const strength = getStrength(newPass);

    useEffect(() => {
        const t = setTimeout(() => setPhase("idle"), 450);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setPhase("exiting");
        setTimeout(onClose, 300);
    };

    const onSubmit = async (data) => {
        const { confirmPassword, currentPassword, newPassword } = data
        try {
            const result = await submit({
                current_password: currentPassword,
                new_password: newPassword, 
                confirm_password: confirmPassword
            });
            if (result?.error) {
                throw new Error(result?.error?.data?.detail);
            }
            if (result?.data) {
                setSuccess(true);
                setTimeout(handleClose, 2000);
                toast.success("Password updated successfully!");
            }
        } catch (err) {
            toast.error(err?.message ?? "Internal Server Error");
        }
    };

    const toggle = (f) => setShow((p) => ({ ...p, [f]: !p[f] }));

    const handleRipple = (e) => {
        const btn = submitBtnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const dot = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        dot.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      background:rgba(255,255,255,0.4);
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      animation: ripple 0.6s linear;
    `;
        btn.appendChild(dot);
        setTimeout(() => dot.remove(), 600);
    };

    const animCls = phase === "idle" ? "" : phase;

    return (
        <>
            <style>{`
        @keyframes overlayIn  { from{opacity:0} to{opacity:1} }
        @keyframes overlayOut { from{opacity:1} to{opacity:0} }
        @keyframes modalIn {
          0%   { opacity:0; transform:translateY(60px) scale(0.88); }
          60%  { opacity:1; transform:translateY(-6px) scale(1.01); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes modalOut {
          0%   { opacity:1; transform:translateY(0) scale(1); }
          100% { opacity:0; transform:translateY(40px) scale(0.92); }
        }
        @keyframes floatUp {
          0%   { transform:translateY(0) scale(1); opacity:0; }
          15%  { opacity:var(--op); }
          85%  { opacity:var(--op); }
          100% { transform:translateY(-120px) scale(0.4); opacity:0; }
        }
        @keyframes iconBounce {
          from { transform:scale(0) rotate(-20deg); }
          to   { transform:scale(1) rotate(0); }
        }
        @keyframes fieldSlide {
          from { opacity:0; transform:translateX(-18px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes successPop {
          from { opacity:0; transform:scale(0.85) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes checkSpin {
          from { transform:scale(0) rotate(-90deg); }
          to   { transform:scale(1) rotate(0); }
        }
        @keyframes shimmerBar { to { background-position:-300% 0; } }
        @keyframes blobPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes errPop { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ripple { to { transform:scale(4); opacity:0; } }
        @keyframes spin { to { transform:rotate(360deg); } }

        .overlay-bg.entering { animation:overlayIn 0.35s ease forwards; }
        .overlay-bg.exiting  { animation:overlayOut 0.3s ease forwards; }
        .modal-wrap.entering .modal { animation:modalIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .modal-wrap.exiting  .modal { animation:modalOut 0.3s cubic-bezier(0.4,0,1,1) forwards; }

        .close-btn:hover { background:#fee2e2 !important; color:#ef4444 !important; transform:rotate(90deg) scale(1.1) !important; }
        .toggle-eye:hover { color:#286a94; transform:translateY(-50%) scale(1.15); }
        .btn-submit::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
          transform:translateX(-100%); transition:transform 0.4s ease;
        }
        .btn-submit:hover::after { transform:translateX(0); }
      `}</style>

            {/* Overlay */}
            <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div className={`overlay-bg ${animCls}`} onClick={handleClose}
                    style={{ position: "absolute", inset: 0, background: "rgba(10,30,50,0.55)", backdropFilter: "blur(6px)" }}
                />

                {/* Floating particles */}
                {PARTICLES.map((p) => (
                    <span key={p.id} style={{
                        position: "absolute", borderRadius: "50%", pointerEvents: "none",
                        width: p.size, height: p.size, left: `${p.left}%`, bottom: p.bottom,
                        background: p.color, zIndex: 1,
                        animation: `floatUp ${p.dur}s ease-in-out ${p.delay}s infinite`,
                        "--op": p.op,
                    }} />
                ))}

                {/* Modal */}
                <div className={`modal-wrap ${animCls}`} style={{ position: "relative", zIndex: 2, width: 430, maxWidth: "95vw" }}>
                    <div className="modal" style={{
                        background: "#fff", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
                        boxShadow: "0 32px 80px rgba(10,30,60,0.22), 0 0 0 1px rgba(255,255,255,0.8) inset",
                    }}>

                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <div style={{ fontSize: 18, fontWeight: 600, color: "#1a2633", display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: "linear-gradient(135deg,#286a94,#4fb3e8)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(40,106,148,0.35)",
                                    animation: "iconBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
                                }}>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                Change Password
                            </div>
                            <button className="close-btn" onClick={handleClose} style={{
                                width: 32, height: 32, border: "none", background: "#f1f5f9",
                                borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center",
                                justifyContent: "center", color: "#64748b", transition: "all 0.2s",
                            }}>
                                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {success && (
                            <div style={{
                                background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10,
                                padding: "12px 14px", color: "#166534", fontSize: 13, fontWeight: 500,
                                display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
                                animation: "successPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                            }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    animation: "checkSpin 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
                                }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                Password updated successfully!
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {[
                                {
                                    key: "currentPassword", label: "Current Password", showKey: "cur",
                                    rules: { required: "Current password is required", minLength: { value: 6, message: "At least 6 characters" } }
                                },
                                {
                                    key: "newPassword", label: "New Password", showKey: "nw",
                                    rules: {
                                        required: "New password is required", minLength: { value: 8, message: "At least 8 characters" },
                                        validate: v => v !== watch("currentPassword") || "Must differ from current"
                                    }
                                },
                                {
                                    key: "confirmPassword", label: "Confirm New Password", showKey: "cf",
                                    rules: { required: "Please confirm your password", validate: v => v === newPass || "Passwords do not match" }
                                },
                            ].map(({ key, label, showKey, rules }, i) => (
                                <div key={key} style={{ marginBottom: 18, animation: `fieldSlide 0.4s ease ${0.15 + i * 0.07}s both` }}>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={show[showKey] ? "text" : "password"}
                                            placeholder={`Enter ${label.toLowerCase()}`}
                                            style={{
                                                width: "100%", padding: "11px 42px 11px 14px",
                                                border: `1.5px solid ${errors[key] ? "#ef4444" : "#e2e8f0"}`,
                                                borderRadius: 10, fontSize: 14, color: "#1a2633", outline: "none",
                                                background: "#fafbfc", fontFamily: "inherit",
                                                transition: "all 0.2s",
                                            }}
                                            onFocus={e => { e.target.style.borderColor = "#286a94"; e.target.style.boxShadow = "0 0 0 3.5px rgba(40,106,148,0.12)"; e.target.style.transform = "translateY(-1px)"; e.target.style.background = "#fff"; }}
                                            onBlur={e => { e.target.style.borderColor = errors[key] ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.transform = "none"; }}
                                            {...register(key, rules)}
                                        />
                                        <button type="button" onClick={() => toggle(showKey)} style={{
                                            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                            background: "none", border: "none", cursor: "pointer",
                                            color: "#94a3b8", padding: 2, display: "flex", alignItems: "center", transition: "color 0.15s",
                                        }}>
                                            <EyeIcon open={show[showKey]} />
                                        </button>
                                    </div>
                                    {/* Strength bar for new password */}
                                    {key === "newPassword" && newPass && (
                                        <div style={{ marginTop: 7 }}>
                                            <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                                                <div style={{ height: "100%", borderRadius: 99, width: `${(strength.score / 4) * 100}%`, background: strength.color, transition: "width 0.4s, background 0.4s" }} />
                                            </div>
                                            <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: strength.color }}>{strength.label}</div>
                                        </div>
                                    )}
                                    {errors[key] && (
                                        <div style={{ fontSize: 12, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4, animation: "errPop 0.2s ease" }}>
                                            ⚠ {errors[key].message}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e2e8f0,transparent)", margin: "22px 0" }} />

                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", animation: "fieldSlide 0.4s ease 0.35s both" }}>
                                <button type="button" onClick={handleClose} style={{
                                    padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                                    background: "#fff", fontSize: 14, fontWeight: 500, color: "#64748b",
                                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                                }}>
                                    Cancel
                                </button>
                                <button ref={submitBtnRef} type="submit" disabled={isSubmitting || success} onClick={handleRipple}
                                    className="btn-submit" style={{
                                        padding: "10px 22px", borderRadius: 10, border: "none",
                                        background: "linear-gradient(135deg,#286a94,#3a8cbf)",
                                        fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
                                        boxShadow: "0 4px 14px rgba(40,106,148,0.35)", position: "relative", overflow: "hidden",
                                        transition: "all 0.2s",
                                    }}>
                                    {isSubmitting ? (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                            </svg>
                                            Updating…

                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Update Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}