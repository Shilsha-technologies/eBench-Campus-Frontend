// // import { useNavigate } from "react-router-dom";
// // import { Pill } from "../../libs/Divider";
// // import { useState, useEffect } from "react";

// // function HeroDashboard() {
// //   return (
// //     <div className="bg-white rounded-2xl p-6 shadow-[0_24px_80px_rgba(43,127,255,0.14),0_4px_16px_rgba(0,0,0,0.05)] border border-[#E2EDF8]">
// //       <div className="flex justify-between items-center mb-5">
// //         <div>
// //           <div className="text-xs text-[#6B84A0] mb-0.5">AI Analysis Report</div>
// //           <div className="text-base font-bold text-[#0F2744]">Arjun Sharma • B.Tech CS</div>
// //         </div>
// //         <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full">Hire Recommended</span>
// //       </div>
// //       <div className="flex gap-3 mb-5">
// //         {[["Overall Score", "87%", "#2B7FFF"], ["Coding", "92%", "#0FA8E0"], ["Problem Solving", "78%", "#7C3AED"]].map(([l, v, c]) => (
// //           <div key={l} className="flex-1 bg-[#F0F7FF] rounded-xl py-3 text-center">
// //             <div className="text-2xl font-black" style={{ color: c }}>{v}</div>
// //             <div className="text-[10px] text-[#6B84A0] mt-0.5 leading-tight">{l}</div>
// //           </div>
// //         ))}
// //       </div>
// //       {[["Data Structures", 90], ["System Design", 72], ["SQL & Databases", 84]].map(([s, p]) => (
// //         <div key={s} className="mb-3">
// //           <div className="flex justify-between mb-1">
// //             <span className="text-xs font-semibold text-[#3A5068]">{s}</span>
// //             <span className="text-xs font-bold text-blue-500">{p}%</span>
// //           </div>
// //           <div className="h-1.5 bg-[#EBF4FD] rounded-full">
// //             <div
// //               className="h-full bg-linear-to-r from-blue-500 to-sky-400 rounded-full"
// //               style={{ width: `${p}%` }}
// //             />
// //           </div>
// //         </div>
// //       ))}
// //       <div className="mt-4 bg-linear-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-200">
// //         <div className="text-xs font-bold text-blue-500 mb-1.5">🤖 AI INSIGHT</div>
// //         <p className="text-xs text-[#3A5068] leading-relaxed m-0">
// //           Strong algorithmic thinking with exceptional DSA performance. Recommend for senior engineering roles with mentorship in system design.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── HERO ──────────────────────────────────────────────────────────────

// // function Hero({ nav }) {
// //   const navigate = useNavigate();
// //   const phrases = ["Skill Assessment", "Talent Matching", "Team Building", "Hiring Decisions"];

// //   const [displayed, setDisplayed] = useState("");
// //   const [phraseIndex, setPhraseIndex] = useState(0);
// //   const [deleting, setDeleting] = useState(false);

// //   useEffect(() => {
// //     const current = phrases[phraseIndex];
// //     let timeout;

// //     if (!deleting) {
// //       if (displayed.length < current.length) {
// //         timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
// //       } else {
// //         timeout = setTimeout(() => setDeleting(true), 1600);
// //       }
// //     } else {
// //       if (displayed.length > 0) {
// //         timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
// //       } else {
// //         setDeleting(false);
// //         setPhraseIndex((i) => (i + 1) % phrases.length);
// //       }
// //     }

// //     return () => clearTimeout(timeout);
// //   }, [displayed, deleting, phraseIndex]);


// //   return (
// //     <section className="relative px-8 py-10 overflow-hidden bg-linear-to-br from-[#F0F7FF] via-[#EBF4FD] to-[#F7FBFF]">
// //       <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-radial from-blue-500/10 to-transparent pointer-events-none" />
// //       <div className="absolute -bottom-16 -left-20 w-80 h-80 rounded-full bg-gradient-radial from-sky-400/8 to-transparent pointer-events-none" />
// //       <div className="max-w-6xl mx-auto flex flex-wrap gap-16 items-">
// //         <div className="flex-1 min-w-[300px] max-w-[580px]">
// //           <Pill>AI-Powered Campus Hiring Platform</Pill>
// //           <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#0F2744] mb-6 tracking-tight">
// //             Hire Smarter with<br />
// //             <span className="bg-linear-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
// //               AI-Powered
// //             </span>
// //             <p className="">{displayed}</p>
// //           </h1>
// //           <p className="text-lg text-[#3A5068] leading-relaxed mb-10 max-w-[480px]">
// //             Beyond degrees — evaluate real talent with intelligent insights. Coding tests, MCQs, and role-based assessments analyzed by AI in real time.
// //           </p>
// //           <div className="flex flex-wrap gap-3">
// //             <button
// //               onClick={() => navigate("/signup")}
// //               className="text-base cursor-pointer font-bold text-white px-8 py-4 rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_24px_rgba(43,127,255,0.4)] hover:shadow-[0_12px_32px_rgba(43,127,255,0.5)] hover:-translate-y-0.5 transition-all"
// //             >
// //               Start Free Trial →
// //             </button>
// //             <button onClick={() => navigate('/login')} className=" cursor-pointer text-base font-semibold text-blue-500 px-8 py-4 rounded-xl bg-white border-[1.5px] border-blue-200 hover:bg-[#F0F7FF] hover:border-blue-500 transition-all">
// //               Login
// //             </button>
// //           </div>
// //           <div className="mt-12 flex flex-wrap gap-9">
// //             {[["50K+", "Students Assessed"], ["800+", "Companies Hiring"], ["200+", "Colleges Onboard"]].map(([n, l]) => (
// //               <div key={l}>
// //                 <div className="text-2xl font-extrabold text-[#0F2744]">{n}</div>
// //                 <div className="text-xs text-[#6B84A0] mt-0.5">{l}</div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //         <div className="flex-1 min-w-[320px] mt-8 max-w-[520px]">
// //           <HeroDashboard />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // export default Hero


// //==================================  ===================================================================



// /**
//  * HeroCarousel.jsx
//  * Auto-sliding carousel with 3 slides (Campus / Recruiters / Why Us)
//  * Props: none (self-contained)
//  */

// import { useState, useEffect, useCallback } from "react";

// // ─── Slide data ────────────────────────────────────────────────────────────────
// const SLIDES = [
//   {
//     id: "campus",
//     tag: "FOR CAMPUSES",
//     tagColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
//     title: "Place Students Faster",
//     subtitle:
//       "Give your students a competitive edge with structured assessments and direct company connections.",
//     features: [
//       { icon: "📤", text: "Send test links to students in seconds" },
//       { icon: "📊", text: "Track performance across all candidates" },
//       { icon: "🔗", text: "Connect directly with hiring companies" },
//     ],
//     accentFrom: "from-blue-500",
//     accentTo: "to-sky-400",
//     borderColor: "border-blue-500/20",
//     bgColor: "from-[#0f1f45] to-[#162d5c]",
//     visual: "campus",
//   },
//   {
//     id: "recruiter",
//     tag: "FOR RECRUITERS",
//     tagColor: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
//     title: "Hire the Right Talent",
//     subtitle:
//       "Filter thousands of candidates in minutes using technical, aptitude, and role-based assessments.",
//     features: [
//       { icon: "🔍", text: "Filter candidates by score & skill" },
//       { icon: "🧪", text: "Technical & non-technical test builder" },
//       { icon: "📈", text: "Real-time results & AI candidate ranking" },
//     ],
//     accentFrom: "from-violet-500",
//     accentTo: "to-purple-400",
//     borderColor: "border-violet-500/20",
//     bgColor: "from-[#1a0f3d] to-[#2a1060]",
//     visual: "recruiter",
//   },
//   {
//     id: "why",
//     tag: "WHY CHOOSE US",
//     tagColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
//     title: "Built for Modern Hiring",
//     subtitle:
//       "A complete ecosystem designed for campuses, students, and recruiters — all in one place.",
//     features: [
//       { icon: "🤖", text: "Smart AI evaluation engine" },
//       { icon: "💳", text: "Credit-based flexible testing model" },
//       { icon: "📋", text: "Easy campus management dashboard" },
//     ],
//     accentFrom: "from-cyan-500",
//     accentTo: "to-sky-400",
//     borderColor: "border-cyan-500/20",
//     bgColor: "from-[#0b1f2e] to-[#0d2d3d]",
//     visual: "why",
//   },
// ];

// // ─── Slide visuals ─────────────────────────────────────────────────────────────

// function CampusVisual() {
//   return (
//     <div className="mt-4 bg-blue-500/8 border border-blue-500/15 rounded-xl p-4">
//       <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2.5">
//         <div className="w-8 h-8 rounded-lg bg-blue-500/25 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
//           AS
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="text-xs font-semibold text-white">Arjun Sharma</div>
//           <div className="text-[10px] text-slate-400">B.Tech CSE · 3rd Year</div>
//         </div>
//         <div className="text-right flex-shrink-0">
//           <div className="text-base font-extrabold text-blue-400">87%</div>
//           <div className="text-[9px] text-slate-500">Score</div>
//         </div>
//       </div>
//       {[["Data Structures", 90, "from-blue-500 to-sky-400"], ["System Design", 72, "from-blue-400 to-blue-300"]].map(
//         ([label, val, grad]) => (
//           <div key={label} className="mt-3">
//             <div className="flex justify-between text-[10px] text-slate-400 mb-1">
//               <span>{label}</span>
//               <span className="text-blue-400">{val}%</span>
//             </div>
//             <div className="h-1 bg-white/8 rounded-full overflow-hidden">
//               <div
//                 className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-700`}
//                 style={{ width: `${val}%` }}
//               />
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// }

// function RecruiterVisual() {
//   const stats = [
//     { num: "248", label: "Applicants", color: "text-violet-400" },
//     { num: "89", label: "Tests Sent", color: "text-purple-400" },
//     { num: "64", label: "Completed", color: "text-violet-300" },
//     { num: "12", label: "Shortlisted", color: "text-violet-500" },
//   ];
//   return (
//     <div className="mt-4 bg-violet-500/8 border border-violet-500/15 rounded-xl p-4">
//       <div className="grid grid-cols-2 gap-2">
//         {stats.map(({ num, label, color }) => (
//           <div key={label} className="bg-white/4 rounded-lg py-3 text-center">
//             <div className={`text-xl font-extrabold ${color} font-[Sora,sans-serif]`}>{num}</div>
//             <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function WhyVisual() {
//   const items = [
//     { icon: "🎯", title: "Precise Scoring", desc: "AI-graded instantly" },
//     { icon: "⚡", title: "Instant Reports", desc: "No manual evaluation" },
//     { icon: "🔒", title: "Secure Tests", desc: "Anti-cheat monitoring" },
//   ];
//   return (
//     <div className="mt-4 bg-cyan-500/8 border border-cyan-500/15 rounded-xl p-4">
//       <div className="grid grid-cols-3 gap-2">
//         {items.map(({ icon, title, desc }) => (
//           <div key={title} className="bg-white/4 rounded-lg p-2.5 text-center">
//             <div className="text-lg mb-1.5">{icon}</div>
//             <div className="text-[10px] font-semibold text-slate-200">{title}</div>
//             <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{desc}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// const VISUALS = { campus: CampusVisual, recruiter: RecruiterVisual, why: WhyVisual };

// // ─── Carousel ─────────────────────────────────────────────────────────────────
// const AUTOPLAY_MS = 4000;

// export function HeroCarousel() {
//   const [current, setCurrent] = useState(0);
//   const [paused, setPaused] = useState(false);

//   const goTo = useCallback((index) => {
//     setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
//   }, []);

//   const next = useCallback(() => goTo(current + 1), [current, goTo]);
//   const prev = useCallback(() => goTo(current - 1), [current, goTo]);

//   // Autoplay
//   useEffect(() => {
//     if (paused) return;
//     const id = setInterval(next, AUTOPLAY_MS);
//     return () => clearInterval(id);
//   }, [next, paused]);

//   const slide = SLIDES[current];
//   const Visual = VISUALS[slide.visual];

//   return (
//     <div
//       className="relative select-none"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       {/* Slide panel */}
//       <div
//         key={slide.id}
//         className={`bg-gradient-to-br ${slide.bgColor} border ${slide.borderColor} rounded-2xl p-7 transition-all duration-500 animate-fadeIn`}
//       >
//         {/* Tag */}
//         <span className={`inline-block text-[10px] font-bold tracking-widest px-3 py-1 rounded-full mb-4 ${slide.tagColor}`}>
//           {slide.tag}
//         </span>

//         {/* Headline */}
//         <h2 className="text-[22px] font-extrabold text-white leading-snug mb-2"
//           style={{ fontFamily: "'Sora', sans-serif" }}>
//           {slide.title}
//         </h2>
//         <p className="text-sm text-slate-400 leading-relaxed mb-5">{slide.subtitle}</p>

//         {/* Feature list */}
//         <ul className="space-y-2.5 mb-1">
//           {slide.features.map(({ icon, text }) => (
//             <li key={text} className="flex items-start gap-3 text-sm text-slate-300">
//               <span className="text-base leading-tight mt-0.5 flex-shrink-0">{icon}</span>
//               {text}
//             </li>
//           ))}
//         </ul>

//         {/* Visual block */}
//         <Visual />
//       </div>

//       {/* Controls row */}
//       <div className="flex items-center justify-between mt-4 px-1">
//         {/* Dot indicators */}
//         <div className="flex gap-2">
//           {SLIDES.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => goTo(i)}
//               aria-label={`Go to slide ${i + 1}`}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 i === current
//                   ? "w-6 bg-blue-500"
//                   : "w-2 bg-white/20 hover:bg-white/40"
//               }`}
//             />
//           ))}
//         </div>

//         {/* Prev / Next arrows */}
//         <div className="flex gap-2">
//           <button
//             onClick={prev}
//             aria-label="Previous slide"
//             className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 text-slate-400 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 transition-all flex items-center justify-center text-base"
//           >
//             ‹
//           </button>
//           <button
//             onClick={next}
//             aria-label="Next slide"
//             className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 text-slate-400 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 transition-all flex items-center justify-center text-base"
//           >
//             ›
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// /**
//  * Hero.jsx
//  * Split-screen hero section for the Campus Hiring Platform
//  *
//  * Layout:
//  *   Left  → Fixed content (headline, subtext, CTAs, stat highlights)
//  *   Right → HeroCarousel (auto-sliding 3-slide panel)
//  *
//  * Dependencies:
//  *   - Tailwind CSS (JIT, v3+)
//  *   - react-router-dom  (useNavigate)
//  *   - Google Fonts: Sora (loaded in index.html or via @import in index.css)
//  *
//  * Usage:
//  *   import Hero from "./components/Hero/Hero";
//  *   <Hero />
//  */

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import HeroCarousel from "./HeroCarousel";

// // ─── Typewriter hook ──────────────────────────────────────────────────────────
// const PHRASES = ["Skill Assessment", "Talent Matching", "Team Building", "Hiring Decisions"];

// function useTypewriter(phrases, typingSpeed = 80, deletingSpeed = 45, pauseMs = 1800) {
//   const [displayed, setDisplayed] = useState("");
//   const [phraseIdx, setPhraseIdx] = useState(0);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     const current = phrases[phraseIdx];
//     let timeout;

//     if (!deleting) {
//       if (displayed.length < current.length) {
//         timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed);
//       } else {
//         timeout = setTimeout(() => setDeleting(true), pauseMs);
//       }
//     } else {
//       if (displayed.length > 0) {
//         timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed);
//       } else {
//         setDeleting(false);
//         setPhraseIdx((i) => (i + 1) % phrases.length);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [displayed, deleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseMs]);

//   return displayed;
// }

// // ─── Pill badge ───────────────────────────────────────────────────────────────
// function AnnouncementPill() {
//   return (
//     <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
//       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
//       <span className="text-xs font-semibold text-blue-300 tracking-wide">
//         AI-Powered Campus Hiring Platform
//       </span>
//     </div>
//   );
// }

// // ─── Stat highlight ───────────────────────────────────────────────────────────
// function StatHighlight({ icon, value, label, iconBg }) {
//   return (
//     <div className="flex items-center gap-2.5">
//       <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${iconBg}`}>
//         {icon}
//       </div>
//       <div>
//         <div className="text-sm font-bold text-white leading-tight">{value}</div>
//         <div className="text-[11px] text-slate-500 leading-tight">{label}</div>
//       </div>
//     </div>
//   );
// }

// // ─── Hero ─────────────────────────────────────────────────────────────────────
// export default function Hero() {
//   const navigate = useNavigate();
//   const typed = useTypewriter(PHRASES);

//   return (
//     <section className="relative overflow-hidden bg-[#070d1f] min-h-screen flex items-center">

//       {/* Background orbs */}
//       <div className="pointer-events-none">
//         <div className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-blue-600/10 blur-[100px]" />
//         <div className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-violet-600/10 blur-[100px]" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-sky-500/6 blur-[80px]" />
//       </div>

//       {/* Subtle grid overlay */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
//           backgroundSize: "40px 40px",
//         }}
//       />

//       {/* Content */}
//       <div className="relative z-10 max-w-6xl mx-auto w-full px-6 lg:px-12 py-20 lg:py-28">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

//           {/* ── LEFT: Fixed content ── */}
//           <div className="flex flex-col">
//             <AnnouncementPill />

//             {/* Headline */}
//             <h1
//               className="text-4xl md:text-5xl xl:text-[54px] font-extrabold leading-[1.13] text-white tracking-tight mb-5"
//               style={{ fontFamily: "'Sora', sans-serif" }}
//             >
//               Empowering Campuses.{" "}
//               <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
//                 Simplifying Hiring.
//               </span>
//             </h1>

//             {/* Typewriter line */}
//             <div
//               className="text-2xl font-bold mb-6 min-h-[36px] text-slate-300"
//               style={{ fontFamily: "'Sora', sans-serif" }}
//             >
//               {typed}
//               <span className="animate-blink ml-0.5 text-blue-400">|</span>
//             </div>

//             {/* Subheading */}
//             <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-[480px]">
//               Connect students with internships & jobs while helping companies hire smarter through
//               AI-powered assessments built for the real world.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-wrap gap-3 mb-10">
//               <button
//                 onClick={() => navigate("/signup")}
//                 className="bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-[0_6px_24px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_32px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
//               >
//                 Get Started →
//               </button>
//               <button
//                 onClick={() => navigate("/campus")}
//                 className="bg-white/6 text-slate-200 border border-white/12 font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-white/10 hover:border-blue-500/40 transition-all duration-200"
//               >
//                 For Campus
//               </button>
//               <button
//                 onClick={() => navigate("/recruiters")}
//                 className="bg-white/6 text-slate-200 border border-white/12 font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-white/10 hover:border-violet-500/40 transition-all duration-200"
//               >
//                 For Recruiters
//               </button>
//             </div>

//             {/* Stat highlights */}
//             <div className="flex flex-wrap gap-6">
//               <StatHighlight
//                 icon="🎓"
//                 value="1,000+"
//                 label="Students Placed"
//                 iconBg="bg-blue-500/15"
//               />
//               <StatHighlight
//                 icon="🏢"
//                 value="200+"
//                 label="Companies Hiring"
//                 iconBg="bg-violet-500/15"
//               />
//               <StatHighlight
//                 icon="⚡"
//                 value="Instant"
//                 label="Test Evaluation"
//                 iconBg="bg-cyan-500/15"
//               />
//             </div>
//           </div>

//           {/* ── RIGHT: Carousel ── */}
//           <div>
//             <HeroCarousel />
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }


//============================================  ========================================= 


import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Theme Config ─────────────────────────────────────────────────────────────

const THEMES = {

  campus: {

    key: "campus",

    label: "For Campus",

    emoji: "🎓",

    primary: "#6366f1",

    primaryDark: "#4f46e5",

    primaryLight: "#eef2ff",

    primaryBorder: "#c7d2fe",

    shadowColor: "rgba(99,102,241,0.18)",

    gradFrom: "#6366f1",

    gradTo: "#818cf8",

    bgGrad: "radial-gradient(ellipse at 75% 25%, #eef2ff 0%, #f5f3ff 35%, transparent 70%)",

    headline: ["Bridge Campus", "to Careers."],

    sub: "Give your students access to real internships, live job listings, and AI-evaluated assessments — all from one campus dashboard.",

    ctas: [

      { label: "Register Your Campus", style: "primary" },
      { label: "Login as Employee", style: "primary" },

      { label: "Login", style: "outline" },


    ],

    stats: [

      { icon: "🎓", val: "1,200+", label: "Students Placed" },

      { icon: "🏫", val: "150+", label: "Campuses Onboarded" },

      { icon: "📋", val: "50K+", label: "Tests Taken" },

    ],

  },

  student: {

    key: "student",

    label: "For Students",

    emoji: "🧑‍🎓",

    primary: "#10b981",

    primaryDark: "#059669",

    primaryLight: "#d1fae5",

    primaryBorder: "#6ee7b7",

    shadowColor: "rgba(16,185,129,0.18)",

    gradFrom: "#10b981",

    gradTo: "#34d399",

    bgGrad: "radial-gradient(ellipse at 75% 25%, #d1fae5 0%, #a7f3d0 35%, transparent 70%)",

    headline: ["Build Your Career,", "Smarter."],

    sub: "Discover your strengths, improve your skills, and land your dream job - all with AI-powered guidance and assessments.",

    ctas: [

      { label: "Get Started", style: "primary" },

      { label: "Login", style: "outline" },

      // { label: "View Demo", style: "ghost" },

    ],

    stats: [

      { icon: "📈", val: "10K+", label: "Students Empowered" },

      { icon: "📊", val: "95%", label: "Career Success" },

      { icon: "📚", val: "500+", label: "Skills Assessed" },

    ],

  },


};

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function CampusStudentIllus() {

  return (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="150" cy="90" rx="130" ry="78" fill="#eef2ff" />
      <polygon points="150,30 195,55 150,80 105,55" fill="#4f46e5" />
      <rect x="146" y="28" width="8" height="10" fill="#4f46e5" />
      <circle cx="154" cy="24" r="5" fill="#a5b4fc" />
      <line x1="195" y1="55" x2="202" y2="76" stroke="#6366f1" strokeWidth="2" />
      <circle cx="202" cy="79" r="4" fill="#6366f1" />
      <rect x="108" y="65" width="84" height="52" rx="8" fill="#6366f1" />
      <rect x="34" y="70" width="62" height="40" rx="7" fill="white" stroke="#c7d2fe" strokeWidth="1.2" />
      <rect x="42" y="79" width="36" height="4" rx="2" fill="#c7d2fe" />
      <rect x="42" y="88" width="26" height="3" rx="2" fill="#e0e7ff" />
      <rect x="42" y="97" width="22" height="8" rx="4" fill="#6366f1" />
      <text x="53" y="104" fontSize="6" fill="white" textAnchor="middle" fontWeight="700">Apply</text>
      <rect x="206" y="70" width="62" height="40" rx="7" fill="white" stroke="#c7d2fe" strokeWidth="1.2" />
      <rect x="214" y="79" width="36" height="4" rx="2" fill="#c7d2fe" />
      <rect x="214" y="88" width="26" height="3" rx="2" fill="#e0e7ff" />
      <rect x="214" y="97" width="22" height="8" rx="4" fill="#818cf8" />
      <text x="225" y="104" fontSize="6" fill="white" textAnchor="middle" fontWeight="700">Apply</text>

      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={88 + i * 26} cy="148" r="14" fill={["#6366f1", "#818cf8", "#a5b4fc", "#4f46e5", "#7c3aed"][i]} />

      ))}

      {["AK", "SR", "PM", "VT", "RK"].map((t, i) => (
        <text key={i} x={88 + i * 26} y="152" fontSize="7" fill="white" textAnchor="middle" fontWeight="700">{t}</text>

      ))}
    </svg>

  );

}

function CampusAdminIllus() {

  return (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="150" cy="90" rx="130" ry="78" fill="#f5f3ff" />
      <rect x="50" y="25" width="200" height="125" rx="12" fill="white" stroke="#ddd6fe" strokeWidth="1.2" />
      <rect x="50" y="25" width="200" height="28" rx="12" fill="#7c3aed" />
      <text x="90" y="43" fontSize="9" fill="white" fontWeight="700">Campus Dashboard</text>

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="62" y={63 + i * 26} width="176" height="18" rx="4" fill={i === 0 ? "#f5f3ff" : "#fafafa"} />
          <circle cx="74" cy={72 + i * 26} r="6" fill={["#7c3aed", "#a78bfa", "#c4b5fd"][i]} />
          <rect x="84" y={68 + i * 26} width="55" height="3.5" rx="2" fill="#ddd6fe" />
          <rect x="84" y={74 + i * 26} width="38" height="3" rx="2" fill="#ede9fe" />
          <rect x="200" y={67 + i * 26} width="28" height="10" rx="5" fill={["#7c3aed", "#a78bfa", "#c4b5fd"][i]} />
          <text x="214" y={75 + i * 26} fontSize="7" fill="white" textAnchor="middle" fontWeight="700">{["Placed", "Active", "Pending"][i]}</text>
        </g>

      ))}
      <rect x="62" y="144" width="55" height="14" rx="6" fill="#7c3aed" />
      <text x="89" y="154" fontSize="7.5" fill="white" textAnchor="middle" fontWeight="700">Send Test Link</text>
      <rect x="124" y="144" width="55" height="14" rx="6" fill="#ede9fe" />
      <text x="151" y="154" fontSize="7.5" fill="#7c3aed" textAnchor="middle" fontWeight="700">Export CSV</text>
    </svg>

  );

}

function AssessmentIllus() {

  return (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="150" cy="90" rx="130" ry="78" fill="#ecfeff" />
      <rect x="60" y="22" width="180" height="136" rx="12" fill="white" stroke="#a5f3fc" strokeWidth="1.2" />
      <rect x="60" y="22" width="180" height="26" rx="12" fill="#0891b2" />
      <text x="150" y="38" fontSize="9" fill="white" textAnchor="middle" fontWeight="700">Assessment — Q3 of 10</text>
      <rect x="72" y="56" width="156" height="40" rx="7" fill="#f0fdfe" stroke="#a5f3fc" strokeWidth="1" />
      <text x="150" y="72" fontSize="8" fill="#164e63" textAnchor="middle">Which sorting algorithm is O(n log n)?</text>

      {[["Bubble Sort", false], ["Merge Sort", true], ["Selection Sort", false]].map(([opt, sel], i) => (
        <g key={i}>
          <rect x="80" y={106 + i * 18} width="140" height="13" rx="6" fill={sel ? "#cffafe" : "#f8fafc"} stroke={sel ? "#0891b2" : "#e2e8f0"} strokeWidth="1" />
          <circle cx="91" cy={112 + i * 18} r="4" fill={sel ? "#0891b2" : "#e2e8f0"} />
          <text x="100" y={116 + i * 18} fontSize="7" fill={sel ? "#0e7490" : "#6b7280"}>{opt}</text>
        </g>

      ))}
      <rect x="198" y="158" width="34" height="12" rx="5" fill="#0891b2" />
      <text x="215" y="167" fontSize="7.5" fill="white" textAnchor="middle" fontWeight="700">Submit</text>
    </svg>

  );

}

function CompanyTalentIllus() {

  return (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="150" cy="90" rx="130" ry="78" fill="#f0f9ff" />
      <rect x="48" y="20" width="204" height="140" rx="12" fill="white" stroke="#bae6fd" strokeWidth="1.2" />
      <rect x="48" y="20" width="204" height="26" rx="12" fill="#0ea5e9" />
      <text x="80" y="36" fontSize="8.5" fill="white" fontWeight="700">Candidate Search</text>
      <rect x="60" y="52" width="180" height="16" rx="6" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
      <text x="75" y="63" fontSize="7" fill="#94a3b8">Search by skill, college, score...</text>

      {[["Rahul K.", "IIT Delhi", "94%", "#0ea5e9"], ["Sneha M.", "NIT Trichy", "89%", "#38bdf8"], ["Arjun P.", "VIT Vellore", "82%", "#7dd3fc"]].map(([name, col, score, c], i) => (
        <g key={i}>
          <rect x="60" y={76 + i * 26} width="180" height="20" rx="5" fill={i === 0 ? "#e0f2fe" : "#f8fafc"} />
          <circle cx="73" cy={86 + i * 26} r="7" fill={c} />
          <text x="73" y={89 + i * 26} fontSize="6" fill="white" textAnchor="middle" fontWeight="700">{name[0]}</text>
          <text x="86" y={83 + i * 26} fontSize="7" fill="#0c4a6e" fontWeight="600">{name}</text>
          <text x="86" y={91 + i * 26} fontSize="6" fill="#64748b">{col}</text>
          <rect x="204" y={79 + i * 26} width="26" height="11" rx="5" fill={c} />
          <text x="217" y={88 + i * 26} fontSize="7" fill="white" textAnchor="middle" fontWeight="700">{score}</text>
        </g>

      ))}
      <rect x="60" y="155" width="55" height="12" rx="5" fill="#0ea5e9" />
      <text x="87" y="164" fontSize="7" fill="white" textAnchor="middle" fontWeight="700">Invite to Test</text>
    </svg>

  );

}

function CompanyTestIllus() {

  return (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="150" cy="90" rx="130" ry="78" fill="#e0f2fe" />
      <rect x="52" y="20" width="196" height="140" rx="12" fill="white" stroke="#7dd3fc" strokeWidth="1.2" />
      <rect x="52" y="20" width="196" height="26" rx="12" fill="#0284c7" />
      <text x="150" y="36" fontSize="9" fill="white" textAnchor="middle" fontWeight="700">Assessment Builder</text>

      {[["Technical Test", "MCQ + Code", "#0284c7"], ["Aptitude", "Logical + Verbal", "#0ea5e9"], ["Domain Test", "Case Study", "#38bdf8"]].map(([title, sub, c], i) => (
        <g key={i}>
          <rect x="62" y={55 + i * 32} width="176" height="24" rx="7" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
          <circle cx="74" cy={67 + i * 32} r="7" fill={c} />
          <text x="86" y={64 + i * 32} fontSize="7.5" fill="#0c4a6e" fontWeight="700">{title}</text>
          <text x="86" y={73 + i * 32} fontSize="6.5" fill="#64748b">{sub}</text>
          <rect x="207" y={60 + i * 32} width="22" height="12" rx="6" fill={c} />
          <text x="218" y={69 + i * 32} fontSize="7" fill="white" textAnchor="middle">Edit</text>
        </g>

      ))}
      <rect x="62" y="155" width="72" height="14" rx="6" fill="#0284c7" />
      <text x="98" y="165" fontSize="7.5" fill="white" textAnchor="middle" fontWeight="700">+ Add Question</text>
    </svg>

  );

}

function CompanyDashIllus() {

  return (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="150" cy="90" rx="130" ry="78" fill="#f0fdfa" />
      <rect x="48" y="20" width="204" height="140" rx="12" fill="white" stroke="#99f6e4" strokeWidth="1.2" />
      <rect x="48" y="20" width="204" height="26" rx="12" fill="#0f766e" />
      <text x="150" y="36" fontSize="9" fill="white" textAnchor="middle" fontWeight="700">Hiring Dashboard</text>

      {[["8", "Active Jobs"], ["24", "Applicants"], ["6", "Shortlisted"]].map(([val, lbl], i) => (
        <g key={i}>
          <rect x={60 + i * 64} y="54" width="56" height="36" rx="7" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="1" />
          <text x={88 + i * 64} y="72" fontSize="14" fill="#0f766e" textAnchor="middle" fontWeight="800">{val}</text>
          <text x={88 + i * 64} y="82" fontSize="6" fill="#6b7280" textAnchor="middle">{lbl}</text>
        </g>

      ))}

      {[["Frontend Role", "12 Apps", "#0f766e", 90], ["Backend Role", "8 Apps", "#0d9488", 65], ["Data Analyst", "4 Apps", "#14b8a6", 42]].map(([role, apps, c, w], i) => (
        <g key={i}>
          <rect x="60" y={100 + i * 22} width="180" height="16" rx="5" fill="#f8fafc" />
          <rect x="60" y={100 + i * 22} width={w} height="16" rx="5" fill={c} opacity="0.2" />
          <text x="68" y={111 + i * 22} fontSize="7" fill="#134e4a" fontWeight="600">{role}</text>
          <text x="226" y={111 + i * 22} fontSize="6.5" fill="#6b7280" textAnchor="end">{apps}</text>
        </g>

      ))}
      <rect x="62" y="158" width="60" height="12" rx="5" fill="#0f766e" />
      <text x="92" y="167" fontSize="7" fill="white" textAnchor="middle" fontWeight="700">Make Offer</text>
    </svg>

  );

}

// ─── Slide Data ───────────────────────────────────────────────────────────────

const CAMPUS_SLIDES = [

  {

    tag: "Student Portal",

    title: "One Hub for\nEvery Opportunity",

    points: [

      { icon: "💼", text: "Browse curated internships & jobs by skill" },

      { icon: "📊", text: "Real-time placement & performance tracking" },

      { icon: "🔔", text: "Instant alerts for new openings & test invites" },

    ],

    accent: "#6366f1", bg: "#eef2ff", Illus: CampusStudentIllus,

  },

  {

    tag: "Campus Admin",

    title: "Manage Placements\nSmarter",

    points: [

      { icon: "🗂️", text: "Central dashboard for all student records" },

      { icon: "🔗", text: "Send test links to batches in one click" },

      { icon: "📈", text: "Placement reports & analytics at a glance" },

    ],

    accent: "#7c3aed", bg: "#f5f3ff", Illus: CampusAdminIllus,

  },

  {

    tag: "Assessments",

    title: "Evaluate Students\nFairly & Fast",

    points: [

      { icon: "🤖", text: "AI-auto-graded MCQ & coding tests" },

      { icon: "🕐", text: "Results delivered instantly after submission" },

      { icon: "🏅", text: "Ranked leaderboard with detailed breakdown" },

    ],

    accent: "#0891b2", bg: "#ecfeff", Illus: AssessmentIllus,

  },

];

const STUDENT_SLIDES = [

  {

    tag: "Skill Discovery",

    title: "Know Your\nStrengths",

    points: [

      { icon: "🔍", text: "AI-powered skill assessment tests" },

      { icon: "📚", text: "Personalized learning recommendations" },

      { icon: "�", text: "Track your progress over time" },

    ],

    accent: "#10b981", bg: "#d1fae5", Illus: CampusStudentIllus,

  },

  {

    tag: "Career Path",

    title: "Find Your\nDream Job",

    points: [

      { icon: "📊", text: "Curated internships & job opportunities" },

      { icon: "🤝", text: "AI-matched career suggestions" },

      { icon: "📈", text: "Real-time application tracking" },

    ],

    accent: "#059669", bg: "#a7f3d0", Illus: AssessmentIllus,

  },

  {

    tag: "Growth Analytics",

    title: "Track Your\nJourney",

    points: [

      { icon: "�", text: "Detailed performance analytics" },

      { icon: "�", text: "Compare with industry benchmarks" },

      { icon: "🏆", text: "Achievement badges & certificates" },

    ],

    accent: "#047857", bg: "#6ee7b7", Illus: CampusAdminIllus,

  },

];

// ─── Carousel Component ───────────────────────────────────────────────────────

function Carousel({ slides }) {

  const [cur, setCur] = useState(0);

  const [exiting, setExiting] = useState(false);

  const [dir, setDir] = useState("next");

  const timerRef = useRef(null);

  const goTo = useCallback((idx, d = "next") => {

    if (exiting || idx === cur) return;

    setDir(d);

    setExiting(true);

    setTimeout(() => { setCur(idx); setExiting(false); }, 290);

  }, [exiting, cur]);

  const next = useCallback(() => goTo((cur + 1) % slides.length, "next"), [cur, goTo, slides.length]);

  const prev = useCallback(() => goTo((cur - 1 + slides.length) % slides.length, "prev"), [cur, goTo, slides.length]);

  const resetTimer = useCallback(() => {

    clearInterval(timerRef.current);

    timerRef.current = setInterval(next, 4800);

  }, [next]);

  useEffect(() => {

    timerRef.current = setInterval(next, 4800);

    return () => clearInterval(timerRef.current);

  }, [next]);

  useEffect(() => { setCur(0); }, [slides]);

  const slide = slides[cur];

  const Illus = slide.Illus;

  return (
    <div className="flex flex-col h-full">
      <div

        className="flex-1 flex flex-col"

        style={{

          opacity: exiting ? 0 : 1,

          transform: exiting ? `translateX(${dir === "next" ? "-28px" : "28px"})` : "translateX(0)",

          transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.4,0,0.2,1)",

        }}
      >

        {/* Tag */}
        <span

          className="self-start inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1.5 mb-4"

          style={{ background: slide.bg, color: slide.accent }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: slide.accent }} />

          {slide.tag}
        </span>

        {/* Illustration */}
        <div className="w-full mb-3" style={{ height: "160px" }}>
          <Illus />
        </div>

        {/* Title */}
        <h3

          className="text-xl font-extrabold leading-snug mb-3 whitespace-pre-line"

          style={{ color: slide.accent, fontFamily: "'DM Serif Display', Georgia, serif" }}
        >

          {slide.title}
        </h3>

        {/* Points */}
        <ul className="flex flex-col gap-2 flex-1">

          {slide.points.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span

                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-px"

                style={{ background: slide.bg, fontSize: "13px" }}
              >{p.icon}</span>
              <span className="text-sm text-gray-500 leading-relaxed">{p.text}</span>
            </li>

          ))}
        </ul>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-1.5 items-center">

          {slides.map((_, i) => (
            <button

              key={i}

              onClick={() => { goTo(i, i > cur ? "next" : "prev"); resetTimer(); }}

              className="h-2 rounded-full border-none cursor-pointer transition-all duration-300"

              style={{ width: i === cur ? "22px" : "8px", background: i === cur ? slide.accent : "#e2e8f0" }}

            />

          ))}
        </div>
        <div className="flex gap-2">
          <button

            onClick={() => { prev(); resetTimer(); }}

            className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-500 flex items-center justify-center text-sm cursor-pointer hover:border-gray-400"
          >←</button>
          <button

            onClick={() => { next(); resetTimer(); }}

            className="w-9 h-9 rounded-full border-none text-white flex items-center justify-center text-sm cursor-pointer"

            style={{ background: slide.accent }}
          >→</button>
        </div>
      </div>
    </div>

  );

}

// ─── Mode Toggle ──────────────────────────────────────────────────────────────

function ModeToggle({ mode, onChange }) {

  return (
    <div className="inline-flex bg-slate-100 mt-5 md:mt-0 rounded-full p-1 gap-1 mb-8">

      {["campus", "student"].map((m) => {

        const t = THEMES[m];

        const active = mode === m;

        return (
          <button

            key={m}

            onClick={() => onChange(m)}

            className=" px-5 py-2 rounded-full text-xs md:text-sm font-semibold border-none cursor-pointer transition-all duration-250"

            style={{

              background: active ? t.primary : "transparent",

              color: active ? "#fff" : "#94a3b8",

            }}
          >

            {t.emoji} {t.label}
          </button>

        );

      })}
    </div>

  );

}

// ─── Hero Section (default export) ───────────────────────────────────────────

export default function HeroSection() {

  const [mode, setMode] = useState("campus");

  // Auto-toggle between modes every 5 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setMode(prevMode => prevMode === "campus" ? "student" : "campus");
  //   }, 5000); // 5 seconds interval

  //   return () => clearInterval(interval); 
  // }, []);

  const theme = THEMES[mode];

  const navigate = useNavigate();

  const slides = mode === "campus" ? CAMPUS_SLIDES : STUDENT_SLIDES;

  const floatBadges = {

    campus: {

      tr: { icon: "🎉", title: "New Offer!", sub: "Ananya placed at Gurugram", bg: "#eef2ff" },

      bl: { icon: "✅", title: "Result Delivered", sub: "Evaluated in < 2 min", bg: "#dcfce7" },

    },

    student: {

      tr: { icon: "🎯", title: "Skill Mastered!", sub: "JavaScript · Level 8 achieved", bg: "#d1fae5" },

      bl: { icon: "📈", title: "Progress Updated", sub: "85% career readiness score", bg: "#a7f3d0" },

    },

  };

  const badges = floatBadges[mode];

  return (
    <section

      className="relative min-h-screen bg-white overflow-hidden flex items-center transition-all duration-500"

      style={{ fontFamily: "'Outfit', sans-serif" }}
    >

      {/* Decorative bg */}
      <div

        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-all duration-500"

        style={{ background: theme.bgGrad }}

      />
      <div

        className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-[0.06] pointer-events-none transition-all duration-500"

        style={{ background: theme.primary }}

      />
      <div

        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full opacity-[0.04] pointer-events-none"

        style={{ background: theme.gradTo }}

      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 lg:px-12 pb-5">

        {/* Centered Toggle */}
        {/* <div className="flex justify-">
        </div> */}

        {/* Split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── LEFT: Fixed content ── */}
          <div className="flex flex-col gap-6">
            {/* Eyebrow */}
            <div

            // className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 self-start border transition-all duration-300"

            // style={{ background: theme.primaryLight, borderColor: theme.primaryBorder }}
            >

              <ModeToggle mode={mode} onChange={setMode} />

            </div>

            {/* Headline */}
            <div>
              <h1

                className="text-4xl xl:text-5xl font-extrabold leading-tight text-gray-900"

                style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.02em" }}
              >

                {theme.headline[0]}<br />
                <span

                  style={{


                    color: `${theme.gradFrom}`,

                    // WebkitBackgroundClip: "text",

                    // WebkitTextFillColor: "transparent",

                    backgroundClip: "text",

                  }}
                >

                  {theme.headline[1]}
                </span>
              </h1>
              <p className="mt-4 text-[15px] text-gray-500 leading-relaxed max-w-[420px]">

                {theme.sub}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2.5">

              {theme.ctas.map((cta, i) => (
                <button

                  key={i}

                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer font-[inherit] transition-all duration-200 hover:-translate-y-0.5"

                  style={{

                    background: cta.style === "primary"

                      ? `linear-gradient(135deg, ${theme.gradFrom}, ${theme.primaryDark})`

                      : cta.style === "outline" ? theme.primaryLight : "transparent",

                    color: cta.style === "primary" ? "#fff" : theme.primary,

                    border: cta.style === "primary" ? "none"

                      : cta.style === "outline" ? `1px solid ${theme.primaryBorder}`

                        : `1px solid transparent`,

                    boxShadow: cta.style === "primary" ? `0 8px 20px ${theme.shadowColor}` : "none",

                  }}
                  onClick={() => {
                    if (cta.label === "Register Your Campus" || cta.label === "Get Started") {
                      navigate("/signup");
                    } else if (cta.label === "Login") {
                      navigate("/login");
                    } else if (cta.label === "Login as Employee") {
                      navigate("/employee/login");
                    }
                  }}
                >

                  {cta.label}
                </button>

              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-2.5">

              {theme.stats.map((s) => (
                <div

                  key={s.label}

                  className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl px-3.5 py-2.5 shadow-sm"
                >
                  <span style={{ fontSize: "18px" }}>{s.icon}</span>
                  <div>
                    <div className="text-[13px] font-bold text-gray-800 leading-none">{s.val}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                </div>

              ))}
            </div>
          </div>

          {/* ── RIGHT: Carousel card ── */}
          <div className="relative">

            {/* Top-right badge */}
            <div className="absolute -top-4 -right-3 z-10 bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xl border border-gray-100">
              <div

                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"

                style={{ background: badges.tr.bg, fontSize: "15px" }}
              >{badges.tr.icon}</div>
              <div>
                <div className="text-[11px] font-bold text-gray-800 leading-none">{badges.tr.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{badges.tr.sub}</div>
              </div>
            </div>

            {/* Bottom-left badge */}
            <div className="absolute -bottom-4 -left-3 z-10 bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xl border border-gray-100">
              <div

                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"

                style={{ background: badges.bl.bg, fontSize: "15px" }}
              >{badges.bl.icon}</div>
              <div>
                <div className="text-[11px] font-bold text-gray-800 leading-none">{badges.bl.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{badges.bl.sub}</div>
              </div>
            </div>

            {/* Carousel card */}
            <div

              className="bg-white rounded-3xl p-7 relative overflow-hidden flex flex-col"

              style={{

                minHeight: "500px",

                boxShadow: `0 0 0 1px ${theme.primaryBorder}44, 0 20px 60px ${theme.shadowColor}, 0 4px 16px rgba(0,0,0,0.06)`,

                transition: "box-shadow 0.4s",

              }}
            >

              {/* Corner deco */}
              <div

                className="absolute top-0 right-0 w-20 h-20 pointer-events-none"

                style={{

                  borderRadius: "0 24px 0 24px",

                  background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`,

                  opacity: 0.2,

                }}

              />
              <Carousel slides={slides} />
            </div>
          </div>

        </div>
      </div>
    </section>

  );

}
