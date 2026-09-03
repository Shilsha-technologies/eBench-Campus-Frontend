import userImg from '../assets/userImg.jpg'
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";

// export default function ProfilePage() {
//     const navigate = useNavigate();

//     return (
//         <>
// <Header />
// <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-8">
//     <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden"
//     >
//         {/* Decorative Background */}
//         <div className="absolute top-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse" />
//         <div className="absolute bottom-0 right-0 w-60 h-60  rounded-full blur-3xl opacity-30 animate-pulse" />

//         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
//             {/* Left Section: User Profile */}
//             <div className="flex flex-col items-center md:items-start">
//                 <motion.img
//                     src={userImg}
//                     alt="Profile"
//                     className="w-36 h-36 rounded-full border-2 border-[#dfe4e7] shadow-lg mb-4"
//                     whileHover={{ scale: 1.05 }}
//                 />
//                 <h2 className="text-3xl font-bold text-[#286a94] mb-1">
//                     Abhishek Yadav
//                 </h2>
//                 <p className="text-gray-600 mb-4">
//                     MERN Stack Developer | 2+ years experience
//                 </p>

//                 <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 shadow-inner w-full">
//                     <h3 className="text-[#286a94] font-semibold mb-2">
//                         Profile Details
//                     </h3>
//                     <ul className="space-y-1">
//                         <li><strong>Email:</strong> abhishek@example.com</li>
//                         <li><strong>Phone:</strong> +91 9876543210</li>
//                         <li><strong>City:</strong> Delhi, India</li>
//                         <li><strong>Member Since:</strong> March 2023</li>
//                     </ul>
//                 </div>
//             </div>

//             {/* Right Section: Test Description */}
//             <div className="flex flex-col justify-center space-y-4">
//                 <motion.h2
//                     className="text-2xl font-bold text-[#286a94]"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                 >
//                     🧩 Introduction Test Overview
//                 </motion.h2>
//                 <p className="text-gray-700 leading-relaxed">
//                     In this test, you’ll record a short video introducing yourself.
//                     Talk about your background, skills, and interests. This helps us
//                     understand your communication style and personality better.
//                 </p>

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">📋 Duration</h4>
//                         <p>60 seconds</p>
//                     </div>
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">🎯 Objective</h4>
//                         <p>Self Introduction</p>
//                     </div>
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">🎥 Camera</h4>
//                         <p>Required (Video + Audio)</p>
//                     </div>
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">💾 Format</h4>
//                         <p>MP4 Upload</p>
//                     </div>
//                 </div>

//                 <motion.button
//                     onClick={() => navigate("/record")}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="bg-[#286a94] hover:bg-[#5992b6] text-white font-semibold py-3 px-6 rounded-xl shadow-lg mt-6"
//                 >
//                     🚀 Start Your Introduction
//                 </motion.button>
//             </div>
//         </div>
//     </motion.div>
// </div>
//         </>

//     );
// }

// new code

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Header";
import { useBeginTestMutation, useCookiesGenerateQuery, useLazyGetProfileQuery, useVerifyUserOtpMutation } from '../redux/services/userApi';
import toast from 'react-hot-toast';

// export default function ProfilePage() {
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const candidate_id = searchParams.get("candidate_id"); 
//     const token = searchParams.get("token");
//     const [isOtpOpen, setIsOtpOpen] = useState(false);
//     const [otp, setOtp] = useState("");
//     const [verifyOtp] = useVerifyUserOtpMutation();
//     // console.log("verify",verifyOtp);

//     const { data: cookieData, isSuccess: cookieReady, isError, isLoading: dataLoading } =
//         useCookiesGenerateQuery({ candidate_id, token });

//     const [fetchCandidate, { data: candidateData, isLoading, isError: fetchDetailError }] = useLazyGetProfileQuery();

//     const handleVerify = async () => {
//         // console.log("first", otp.length<6);
//         if (otp.length < 6) {
//             toast.warning("Enter valid 6 digit OTP")
//             return;
//         }
//         const form = new FormData();
//         form.append('candidate_id', candidate_id)
//         form.append('otp', otp)
//         try {
//             const res = await verifyOtp(form).unwrap();
//             if (res?.status) {
//                 toast.success("Authentication Successully")
//                 setIsOtpOpen(false);
//                 setTimeout(() => {
//                     navigate("/record", { state: { data: token } });
//                 }, 1000)
//             } else {
//                 setOtp("")
//             }
//         } catch (err) {
//             // console.log("err", err)
//             toast.error(err?.data?.detail ?? "Something went wrong")
//         }
//     };

//     useEffect(() => {
//         if (!cookieReady) return;

//         fetchCandidate({
//             id: candidate_id,
//             token: cookieData?.token
//         }).unwrap()

//     }, [cookieReady, candidate_id]);

//     if (isLoading || dataLoading) {
//         return <FullScreenLoader />
//     }

//     if (fetchDetailError || isError) {
//         return <Unauthorized />
//     }

//     return (
//         <>
//             <Header />
//             {/* Main Profile UI (unchanged) */}
// <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-8">
//     <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden"
//     >
//         <div className="absolute top-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse" />
//         <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse" />

//         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">

//             {/* Left Profile Section */}
//             <div className="flex flex-col items-center md:items-start">
//                 <motion.img
//                     src={userImg}
//                     alt="Profile"
//                     className="w-36 h-36 rounded-full border-2 border-[#dfe4e7] shadow-lg mb-4"
//                     whileHover={{ scale: 1.05 }}
//                 />
//                 <h2 className="text-3xl font-bold text-[#286a94] mb-3">{candidateData?.candidate?.first_name + " " + candidateData?.candidate?.last_name}</h2>
//                 {/* Left Profile Section
//                                         */}
//                 {/* <p className="text-gray-600 mb-4">MERN Stack Developer | 2+ years experience</p>                                                     */}

//                 <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 shadow-inner w-full">
//                     <h3 className="text-[#286a94] font-semibold mb-2">Profile Details</h3>
//                     <ul className="space-y-1">
//                         <li><strong>Email:</strong> {candidateData?.candidate?.email ?? "N/A"}</li>
//                         <li><strong>Phone:</strong> {'+' + candidateData?.candidate?.mobile ?? "N/A"}</li>
//                         <li><strong>Nationality:</strong> {candidateData?.candidate?.nationality ?? "N/A"} </li>
//                         <li><strong>Country of Residence:</strong> {candidateData?.candidate?.country_of_residence ?? "N/A"} </li>
//                         <li><strong>Birth Country:</strong> {candidateData?.candidate?.birth_country ?? "N/A"} </li>
//                     </ul>
//                 </div>
//             </div>

//             {/* Right Test Section */}
//             <div className="flex flex-col justify-center space-y-4">
//                 <motion.h2
//                     className="text-2xl font-bold text-[#286a94]"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                 >
//                     🧩 Introduction Test Overview
//                 </motion.h2>

//                 <p className="text-gray-700 leading-relaxed">
//                     In this test, you’ll record a short video introducing yourself.
//                     Talk about your background, skills, and interests.
//                 </p>

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">📋 Duration</h4>
//                         <p>60 seconds</p>
//                     </div>
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">🎯 Objective</h4>
//                         <p>Self Introduction</p>
//                     </div>
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">🎥 Camera</h4>
//                         <p>Required</p>
//                     </div>
//                     <div className="bg-gray-50 border rounded-xl p-4">
//                         <h4 className="text-[#286a94] font-semibold mb-1">💾 Format</h4>
//                         <p>MP4 Upload</p>
//                     </div>
//                 </div>

//                 {/* Start Test → open OTP popup */}
//                 <motion.button
//                     onClick={() => setIsOtpOpen(true)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="bg-[#286a94] hover:bg-[#5992b6] text-white font-semibold py-3 px-6 rounded-xl shadow-lg mt-6"
//                 >
//                     🚀 Start Your Introduction
//                 </motion.button>
//             </div>
//         </div>
//     </motion.div>
// </div>

//             {/* OTP Popup Over Same UI */}
//             {isOtpOpen && (
//                 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//                     <motion.div
//                         initial={{ scale: 0.8, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
//                     >
//                         <h2 className="text-xl font-semibold text-[#286a94] text-center mb-4">
//                             🔐 Verify OTP
//                         </h2>
//                         <p className='text-sm text-blue-500 text-center mb-4'>OTP has been send in your test link Pls check your mail</p>
//                         <input
//                             type="text"
//                             inputMode="numeric"
//                             pattern="\d{6}"
//                             maxLength={6}
//                             value={otp}
//                             onChange={handleOtpChange}
//                             placeholder="Enter 6 digit OTP"
//                             className="w-full border px-4 py-2 rounded-lg text-center text-lg tracking-widest"
//                         />
//
//                         <button
//                             onClick={handleVerify}
//                             className="w-full mt-4 bg-[#286a94] text-white font-semibold py-2 rounded-lg hover:bg-[#3b7aa7]"
//                         >
//                             Verify OTP
//                         </button>

//                         <button
//                             onClick={() => [setIsOtpOpen(false), setOtp("")]}
//                             className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm"
//                         >
//                             Cancel
//                         </button>
//                     </motion.div>
//                 </div>
//             )}
//         </>
//     );
// }

// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// // import { toast } from "react-toastify";


// ── Small primitives ──────────────────────────────────────────────────────────
function Chip({ children }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-500 whitespace-nowrap">
            {children}
        </span>
    );
}

function Tag({ children, accent }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
            style={accent ? { background: accent + "18", color: accent, borderColor: accent + "40" } : { background: "#f1f5f9", color: "#64748b", borderColor: "#e2e8f0" }}
        >
            {children}
        </span>
    );
}

function DarkTag({ children }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900 text-slate-100 border border-slate-900">
            {children}
        </span>
    );
}

function StatBox({ val, label }) {
    return (
        <div className="bg-slate-50 rounded-lg px-3.5 py-2.5 text-center min-w-[72px]">
            <div className="text-base font-semibold text-slate-900 leading-tight">{val}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
        </div>
    );
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ sec, accent }) {
    return (
        <div
            className={`bg-white rounded-xl border p-4 flex flex-col gap-2 hover:border-slate-300 transition-colors`}
            style={sec.star ? { borderColor: "#FDE68A" } : { borderColor: "#e2e8f0" }}
        >
            <div className="flex items-start gap-2">
                <span className="text-[11px] text-slate-300 font-semibold mt-0.5 w-5 flex-shrink-0">{sec.sectionId}</span>
                <span className="text-base leading-none mt-0.5">{sec.icon}</span>
                <span className="text-[13px] font-medium text-slate-800 leading-snug flex-1">{sec?.name || sec?.title}</span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed pl-7">{sec.description}</p>
            <div className="flex flex-wrap items-center gap-1.5 pl-7">
                {sec.qs && <Tag>{sec.qs}</Tag>}
                <Tag accent={accent}>⏱ {sec.timeLimit}</Tag>
                {/* {sec.marks && <DarkTag>{sec.marks}</DarkTag>} */}
                {sec.star && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "#FFFBEB", color: "#B45309", border: "0.5px solid #FDE68A" }}>
                        ★ Highest weightage
                    </span>
                )}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [agreed, setAgreed] = useState(false);

    const candidate_id = searchParams.get("candidate_id");
    const token = searchParams.get("token");

    const [isOtpOpen, setIsOtpOpen] = useState(true);
    const [otp, setOtp] = useState("");

    const [verifyOtp] = useVerifyUserOtpMutation();
    // Loading state for starting the test
    const [beginLoader, setBeginLoader] = useState(false);

    const {
        data: cookieData,
        isSuccess: cookieReady,
        isError,
        isLoading: dataLoading,
        refetch
    } = useCookiesGenerateQuery({ candidate_id, token });

    const [
        fetchCandidate,
        {
            data: candidateData,
            isLoading,
            isError: fetchDetailError
        }
    ] = useLazyGetProfileQuery();


    // console.log("candidateData--000", candidateData);
    const CANDIDATE = candidateData?.candidate || { name: "fjdkjf", age: "32", phone: "9876543210" };

    const TEST = candidateData?.test || { levelName: "MERN", title: "Introduction Test", subtitle: "Self Introduction", icon: "fi-fi-rr-user", accentColor: "#286a94", accentBackground: "#f0f7fd", totalQuestions: 10, totalMarks: "N/A", cutoffPercentage: 80, isAiInterview: false };

    const lv = {
        key: candidateData?.level_id || '1',
        bc: TEST?.levelName,
        title: TEST?.title,
        sub: TEST?.subtitle,
        icon: TEST?.icon,
        accent: TEST?.accentColor,
        accentBg: TEST?.accentBackground,
        dotColor: TEST?.accentColor,
        duration: TEST?.duration || "N/A",
        questions: TEST?.totalQuestions || 0,
        marks: TEST?.totalMarks || "N/A",
        cutoff: TEST?.cutoffPercentage
            ? `${TEST.cutoffPercentage}%`
            : "N/A",
        isAI: TEST?.isAiInterview,
        sections: TEST?.sections || [],
        rules: TEST?.guidelines?.map(item => item.rule) || [],
    };

    // 🔐 OTP VERIFY
    const handleVerify = async () => {
        if (otp.length < 6) {
            toast.warning("Enter valid 6 digit OTP");
            return;
        }

        const form = new FormData();
        form.append("candidate_id", candidate_id);
        form.append("otp", otp);

        try {
            const res = await verifyOtp(form).unwrap();

            if (res?.status) {
                toast.success("Authentication Successfully");

                // 🔥 Refetch cookie to update verified status
                await refetch();

                setIsOtpOpen(false);
            } else {
                setOtp("");
            }
        } catch (err) {
            toast.error(err?.data?.detail ?? "Something went wrong");
        }
    };

    // 🔐 OTP input validation handler
    const handleOtpChange = (e) => {
        // Remove any non-digit characters
        const raw = e.target.value;
        const cleaned = raw.replace(/\D/g, "");
        setOtp(cleaned);
    };

    // 📦 Fetch data ONLY AFTER verification
    useEffect(() => {
        if (!cookieData?.verified) return;

        fetchCandidate({
            id: candidate_id,
            token: token
        });
    }, [cookieData?.verified, candidate_id, token]);

    const [beginTest] = useBeginTestMutation();

    async function startHandler() {
        // console.log("bajjj", candidateData)

        // Show loader while processing navigation
        setBeginLoader(true);
        const res=await beginTest().unwrap()
        // debugger;

        if (candidateData?.level_id == "LEVEL_001") {
            setTimeout(() => {
                navigate("/record", { state: { data: token } })
                setBeginLoader(false)
            }, 2000)
        }
        if (candidateData?.level_id == "LEVEL_002") {
            setTimeout(() => {
                navigate("/code-test");
                setBeginLoader(false)
            }, 2000)
        }
    }

    // ⏳ Loader
    if (dataLoading || isLoading) {
        return <FullScreenLoader />;
    }

    // ❌ Unauthorized
    if (fetchDetailError || isError) {
        return <Unauthorized />;
    }

    // 🔐 OTP SCREEN FIRST
    if (!cookieData?.verified && isOtpOpen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
                >
                    <h2 className="text-xl font-semibold text-[#286a94] text-center mb-4">
                        🔐 Verify OTP
                    </h2>

                    <p className="text-sm text-blue-500 text-center mb-4">
                        OTP has been sent to your email
                    </p>

                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter 6 digit OTP"
                        className="w-full border px-4 py-2 rounded-lg text-center text-lg tracking-widest"
                    />

                    <button
                        onClick={handleVerify}
                        className="w-full mt-4 bg-[#286a94] text-white font-semibold py-2 rounded-lg hover:bg-[#3b7aa7]"
                    >
                        Verify OTP
                    </button>
                </motion.div>
            </div>
        );
    }


    return (
        <>
            <div className="min-h-screen bg-slate-100 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

                {/* ── Topbar ── */}
                <header className="bg-white border-b border-slate-200 h-[52px] flex items-center px-6 gap-2.5 sticky top-0 z-50 flex-shrink-0">
                    <div className="w-7 h-7 bg-slate-900 rounded-lg grid place-items-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-slate-900">eBench Campus</span>
                    <span className="text-slate-300 text-base font-light">·</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">Candidate Portal</span>
                    <div className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        Identity verified
                    </div>
                </header>

                {/* ── Hero ── */}
                <div className=" border-slate-200 px-6 py-6">
                    <div className="max-w-5xl mx-auto">


                        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                            {/* Candidate info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3.5">
                                    <div className="w-11 h-11 rounded-xl bg-slate-900 grid place-items-center text-white font-semibold text-sm flex-shrink-0">
                                        {CANDIDATE?.initials}
                                    </div>
                                    <div>
                                        <div className="text-[17px] font-semibold text-slate-900 leading-tight">{CANDIDATE?.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{CANDIDATE?.email}</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    <Chip>🏛 {CANDIDATE?.college}</Chip>
                                    <Chip>💻 {CANDIDATE?.branch}</Chip>
                                    <Chip>🎓 Batch {CANDIDATE?.batch}</Chip>
                                    <Chip>📱 {CANDIDATE?.phone}</Chip>
                                    <Chip>💼 {CANDIDATE?.role}</Chip>
                                    <Chip>🏢 {CANDIDATE?.company}</Chip>
                                </div>
                            </div>

                            {/* Level switcher */}
                            {/* <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 lg:w-64 flex-shrink-0">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5">Switch level (demo)</p>
                            {Object.values(LEVELS).map((l) => (
                                <button
                                    key={l.key}
                                    onClick={() => handleLevelChange(l.key)}
                                    className={`w-full text-left px-3 py-2 rounded-lg border text-[13px] flex items-center gap-2 mb-1.5 transition-all ${levelKey === l.key ? "bg-white border-slate-300 font-medium text-slate-900" : "bg-transparent border-transparent text-slate-500 hover:bg-white hover:border-slate-200"}`}
                                >
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.dotColor }} />
                                    {l.bc}
                                </button>
                            ))}
                        </div> */}
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 px-6 py-7">
                    <div className="max-w-5xl mx-auto space-y-5">

                        {/* Test header */}
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Test overview</p>
                            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-start gap-4">
                                <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl flex-shrink-0" style={{ background: lv.accentBg }}>
                                    {lv.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[16px] font-semibold text-slate-900 capitalize">{lv?.title}</div>
                                    <div className="text-[13px] text-slate-500 mt-0.5">{lv?.sub}</div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <StatBox val={lv.duration} label="Duration" />
                                    <StatBox val={lv.questions} label="Questions" />
                                    <StatBox val={lv.marks} label="Marks" />
                                    <StatBox val={lv.cutoff} label="Cutoff" />
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Sections</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                                {lv?.sections?.map((sec, i) => (
                                    <SectionCard key={i} sec={sec} accent={lv.accent} />
                                ))}
                            </div>
                        </div>

                        {/* Camera check for Level 3 */}
                        {lv.isAI && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {["Camera access", "Microphone access", "Stable internet"].map((item) => (
                                    <div key={item} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 grid place-items-center flex-shrink-0">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <span className="text-[13px] font-medium text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Bottom two-col: Rules + Agree/CTA */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Guidelines */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3.5">Guidelines</p>
                                <ul className="space-y-2.5">
                                    {lv?.rules?.map((rule, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 grid place-items-center" style={{ background: lv.accentBg }}>
                                                <span className="text-[9px] font-bold" style={{ color: lv?.accent }}>{i + 1}</span>
                                            </div>
                                            <span className="text-[12px] text-slate-600 leading-relaxed">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Agree + CTA */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Before you begin</p>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div
                                        onClick={() => setAgreed(!agreed)}
                                        className="w-[18px] h-[18px] rounded flex-shrink-0 mt-0.5 grid place-items-center border-2 transition-all cursor-pointer"
                                        style={agreed ? { background: lv.accent, borderColor: lv.accent } : { borderColor: "#cbd5e1", background: "#fff" }}
                                    >
                                        {agreed && (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-[12px] text-slate-600 leading-relaxed">
                                        I have read and understood all test guidelines. I agree to attempt this test honestly and acknowledge that violations may lead to disqualification.
                                    </p>
                                </label>


                                <button
                                    onClick={startHandler}
                                    disabled={!agreed || beginLoader}
                                    className="w-full py-2.5 rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                                    style={agreed ? { background: lv.accent, color: "#fff", cursor: "pointer" } : { background: "#f1f5f9", color: "#94a3b8" }}
                                >
                                    {beginLoader ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Begin test
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>


                                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                                    Need help?{" "}
                                    <a href="mailto:support@shilshatech.com" className="text-slate-500 hover:underline">
                                        support@shilshatech.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-9999">
            <div className="w-14 h-14 border-4 border-[#286a94] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};


function Unauthorized() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
            <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md w-full">

                <div className="text-red-500 text-7xl font-bold">401</div>

                <h1 className="text-2xl font-semibold text-gray-800 mt-4">
                    Unauthorized Access
                </h1>

                <p className="text-gray-500 mt-2">
                    Your access link has expired or you do not have permission to view this page.
                </p>

                <p className="text-gray-400 text-sm mt-6">
                    Please contact support if you believe this is a mistake.
                </p>
            </div>
        </div>
    );
}
