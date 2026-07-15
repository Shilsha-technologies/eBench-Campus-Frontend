// import { useState, useRef, useEffect } from 'react';
// import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useDownloadCandidateResultMutation, useViewResultByUserIdQuery } from '../redux/services/vendorApi';
// import PageLoader from '../libs/PageLoader';
// import { base } from '../redux/services/api';
// import toast from 'react-hot-toast';
// import { useViewResultByUserIdBySubVendorQuery } from '../redux/services/subvendorApi';

// export default function IntroAnalysisApp() {
//     const [step, setStep] = useState('result');
//     const [searchParams] = useSearchParams();
//     const candidateId = searchParams.get("candidateId");
//     const resultId = searchParams.get("resultId");
//     const role = localStorage.getItem('role')
// const { data, isLoading } = role === "sub_vendor" ? useViewResultByUserIdBySubVendorQuery({ candidateId, resultId }) : useViewResultByUserIdQuery({ candidateId, resultId })


//     const navigate = useNavigate()
//     const [dummyReport, setDummyReport] = useState(null);


//     function mapApiResultToReport(api) {
//         const clamp = (val) => Math.max(0, Math.min(100, Math.round(val * 100)));
//         // console.log("api", api)
//         const feedback = api?.metrics_json?.feedback || {};

//         // 🔥 Transform for UI
//         const feedbackUI = transformFeedbackForUI(feedback);
//         return {
//             profileImage: 'https://randomuser.me/api/portraits/men/44.jpg', // fallback / static
//             name: `${api?.first_name} ${api.last_name}`,
//             email: api.email,
//             mobile: '+91' + api?.mobile,
//             country_of_residence: api?.country_of_residence,
//             candidate_id: api?.candidate_id,
//             // Visual
//             visualScore: clamp(
//                 (api.eye_contact + api.posture_score + api.gaze_score + api.smile_score) / 4
//             ),
//             postureScore: clamp(api.posture_score),
//             eyeContactScore: clamp(api.eye_contact),

//             // Audio
//             audioScore: clamp(api.audio_confidence),
//             fillersScore: clamp(1 - api.filler_density),
//             prosodyScore: clamp(
//                 (api.metrics_json.audio.prosody.pitch_std > 0 ? 0.7 : 0.5) +
//                 (api.metrics_json.audio.prosody.energy_std > 0 ? 0.3 : 0.2)
//             ),
//             // feedback: api?.metrics_json?.feedback,
//             feedbackUI,
//             // Overall
//             overallScore: clamp(api.final_score),
//             transcript: api?.transcript,

//             // Prosody timeline (synthetic but consistent)
//             prosodyTimeline: Array.from({ length: 40 }).map((_, i) => ({
//                 t: i,
//                 pitch:
//                     api.prosody_pitch_mean +
//                     Math.sin(i / 4) * api.prosody_pitch_std * 0.01,
//                 energy:
//                     api.prosody_energy_mean +
//                     Math.abs(Math.sin(i / 5)) * api.prosody_energy_std * 0.05,
//             })),

//             // Fillers
//             fillersDetected: Object.entries(
//                 api.metrics_json.audio.fillers.by_word
//             )
//                 .filter(([, count]) => count > 0)
//                 .map(([word]) => word),

//             // Sentiment mapping
//             sentiment: {
//                 positive: api.sentiment >= 0.6 ? 6 : 3,
//                 neutral: api.sentiment >= 0.4 && api.sentiment < 0.6 ? 5 : 3,
//                 negative: api.sentiment < 0.4 ? 4 : 1,
//             },

//             highlights: [
//                 api.eye_contact > 0.8 && 'Excellent eye contact',
//                 api.audio_confidence > 0.9 && 'Strong vocal confidence',
//                 api.filler_density === 0 && 'No filler words detected',
//                 api.posture_score > 0.8 && 'Good posture maintained',
//             ].filter(Boolean),

//         };
//     }

//     function transformFeedbackForUI(feedback) {
//         return [
//             {
//                 tab: "Parent",
//                 key: "Parent",
//                 sections: [
//                     { title: "Strengths", type: "list", data: feedback?.parent?.strengths || [] },
//                     { title: "Areas of Improvement", type: "list", data: feedback?.parent?.areas_of_improvement || [] },
//                     { title: "Guidance", type: "list", data: feedback?.parent?.parent_guidance || [] },
//                     { title: "Summary", type: "text", data: feedback?.parent?.overall_summary || "" },
//                     { title: "Encouragement", type: "text", data: feedback?.parent?.encouragement || "" },
//                     {
//                         title: "Levels",
//                         type: "badges",
//                         data: {
//                             confidence: feedback?.parent?.confidence_level,
//                             communication: feedback?.parent?.communication_level
//                         }
//                     }
//                 ]
//             },
//             {
//                 tab: "Vendor",
//                 key: "Vendor",
//                 sections: [
//                     { title: "Key Strengths", type: "list", data: feedback?.vendor?.key_strengths || [] },
//                     { title: "Critical Issues", type: "list", data: feedback?.vendor?.critical_issues || [] },
//                     { title: "Training Focus", type: "list", data: feedback?.vendor?.training_focus || [] },
//                     { title: "Recommendations", type: "list", data: feedback?.vendor?.recommendations || [] },
//                     { title: "Skill Assessment", type: "badges", data: feedback?.vendor?.skill_assessment || {} },
//                     {
//                         title: "Final Decision",
//                         type: "highlight",
//                         data: {
//                             hire: feedback?.vendor?.hire_recommendation,
//                             performance: feedback?.vendor?.performance_summary
//                         }
//                     }
//                 ]
//             },
//             {
//                 tab: "Candidate",
//                 key: "Candidate",
//                 sections: [
//                     { title: "Strengths", type: "list", data: feedback?.candidate?.strengths || [] },
//                     { title: "Areas to Improve", type: "list", data: feedback?.candidate?.areas_to_improve || [] },
//                     { title: "Recommendations", type: "list", data: feedback?.candidate?.recommendations || [] },
//                     { title: "Tips", type: "list", data: feedback?.candidate?.tips || [] }
//                 ]
//             }
//         ];
//     }

//     useEffect(() => {
//         if (data) {
//             const mappedReport = mapApiResultToReport(data);
//             setDummyReport(mappedReport);
//         }
//     }, [data])

//     const [pdfLoader, setPdfLoader] = useState(false);
//     const downloadPDF = async () => {
//         let resultId = data?.result_id
//         try {
//             setPdfLoader(true)
//             const response = localStorage.getItem('role') === "sub_vendor" ? await fetch(`${base}/vendor/result/download?result_id=${resultId}&format=pdf`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': 'Bearer ' + localStorage.getItem('token'), // your auth header
//                 },
//             }) :
//                 await fetch(`${base}/vendor/result/download?result_id=${resultId}&format=pdf`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': 'Bearer ' + localStorage.getItem('token'), // your auth header
//                     },
//                 });

//             if (!response.ok) throw new Error('Download failed');

//             // Create blob from binary response
//             const blob = await response.blob();

//             // Create download link
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `candidate_result_${resultId}.pdf`;
//             document.body.appendChild(link);
//             link.click();

//             // Cleanup
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             toast.error(error?.message ?? "Something went wrong. Pls try again")
//             // console.error('Download error:', error);
//         } finally {
//             setPdfLoader(false)
//         }
//     };

//     if (isLoading || !dummyReport) {
//         return <PageLoader />
//     }

//     return (
//         <>
//             <div className=" bg-linear-to-br from-white to-slate-50 p-6">
//                 <div className="max-w-5xl mx-auto">
//                     {step === 'result' && (
//                         <ResultPage report={dummyReport} pdfLoader={pdfLoader} downloadClickHandler={downloadPDF} onBack={() => navigate(-1)} />)}

//                     <footer className="text-xs text-gray-500 mt-8">Built by ebench team {new Date().getFullYear()}.</footer>
//                 </div>
//             </div>
//         </>

//     );
// }

// function ResultPage({ report, onBack, pdfLoader, downloadClickHandler }) {
//     // console.log("reee", report);
//     if (!report) {
//         return;
//     }
//     const radarData = [
//         { subject: 'Visual', A: report?.visualScore },
//         { subject: 'Audio', A: report?.audioScore },
//         { subject: 'Posture', A: report?.postureScore },
//         { subject: 'Eye Contact', A: report?.eyeContactScore },
//         { subject: 'Fillers', A: report?.fillersScore },
//         { subject: 'Prosody', A: report?.prosodyScore }
//     ];

//     const barData = [
//         { name: 'Visual', score: report.visualScore },
//         { name: 'Audio', score: report.audioScore },
//         { name: 'Posture', score: report.postureScore },
//         { name: 'Eye', score: report.eyeContactScore },
//         { name: 'Fillers', score: report.fillersScore },
//         { name: 'Prosody', score: report.prosodyScore }
//     ];

//     const pieData = [
//         { name: 'Positive', value: report.sentiment.positive },
//         { name: 'Neutral', value: report.sentiment.neutral },
//         { name: 'Negative', value: report.sentiment.negative }
//     ];

//     const COLORS = ['#2a9d8f', '#f4a261', '#e76f51'];
//     const [showId, setShowId] = useState(false);



//     const renderLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
//         // Calculate position for label **outside the slice**
//         const RADIAN = Math.PI / 180;
//         const radius = outerRadius + 23; // distance from slice
//         const x = cx + radius * Math.cos(-midAngle * RADIAN);
//         const y = cy + radius * Math.sin(-midAngle * RADIAN);

//         // Only show label if value > 0
//         if (value <= 0) return null;

//         return (
//             <text
//                 x={x}
//                 y={y}
//                 fill="#6B7280"
//                 fontSize="11"
//                 textAnchor={x > cx ? "start" : "end"} // left/right based on side
//                 dominantBaseline="central"
//             >
//                 {name}
//             </text>
//         );
//     };


//     return (
//         <>
//             {/* <div className='pb-4 font-semibold text-xl text-[#2559b3] '>Candidate Result Details :-</div> */}
//             <div className="bg-white rounded-2xl shadow p-6 space-y-6">
//                 <div className="flex items-start gap-10">
//                     {/* Left: Photo */}
//                     <div className="shrink-0">
//                         <img
//                             src={report.profileImage}
//                             alt="profile"
//                             className="w-32 h-32 rounded-full object-cover shadow-md "
//                         />
//                     </div>

//                     {/* Right: Details */}
//                     <div className="flex-1">
//                         <h3 className="text-xl font-semibold mb-3">
//                             {report.name}
//                         </h3>

//                         {/* Labeled fields */}
//                         <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
//                             <div>
//                                 <span className="text-gray-400 block">Email</span>
//                                 <span className="text-gray-700">{report.email}</span>
//                             </div>

//                             <div>
//                                 <span className="text-gray-400 block">Mobile</span>
//                                 <span className="text-gray-700">{report.mobile}</span>
//                             </div>

//                             <div>
//                                 <span className="text-gray-400 block">Country</span>
//                                 <span className="text-gray-700">
//                                     {report?.country_of_residence}
//                                 </span>
//                             </div>



//                             <div>
//                                 <span className="text-gray-400 block">Candidate ID</span>

//                                 {/* Checkbox */}
//                                 <label className="flex items-center gap-2 text-sm text-gray-600">
//                                     <input
//                                     className='cursor-pointer'
//                                         type="checkbox"
//                                         checked={showId}
//                                         onChange={() => setShowId(!showId)}
//                                     />
//                                     Show Candidate ID
//                                 </label>

//                                 {/* Conditionally show ID */}
//                                 {showId && (
//                                     <span className="text-gray-700 text-xs mt-1">
//                                         {report?.candidate_id}
//                                     </span>
//                                 )}
//                             </div>


//                             <div>
//                                 <span className="text-gray-400 block">Overall Score</span>
//                                 <span className="text-gray-700">
//                                     {report.overallScore} / 100
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>


//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className=" bg-slate-50 rounded-lg p-4">
//                         <h4 className="font-semibold mb-2">Multi-modal scores</h4>
//                         <div className="flex gap-6">
//                             <RadarChart cx={150} cy={120} outerRadius={80} width={300} height={240} data={radarData}>
//                                 <PolarGrid />
//                                 <PolarAngleAxis dataKey="subject" />
//                                 <PolarRadiusAxis angle={30} domain={[0, 100]} />
//                                 <Radar name="Scores" dataKey="A" stroke="#2a7397" fill="#2a7397" fillOpacity={0.35} />
//                             </RadarChart>

//                             {/* <BarChart width={360} height={240} data={barData}>
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Bar dataKey="score" fill="#2a7397" />
//                             </BarChart> */}
//                         </div>
//                     </div>

//                     <div className="bg-slate-50 rounded-lg p-4">
//                         <h4 className="font-semibold mb-2">Sentiment</h4>
//                         {/* <PieChart width={240} height={200}>
//                             <Pie dataKey="value" data={pieData} cx={120} cy={100} outerRadius={60} label>
//                                 {pieData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                         </PieChart> */}
//                         <PieChart width={240} height={200}>
//                             <Pie
//                                 data={pieData}
//                                 dataKey="value"
//                                 cx={120}
//                                 cy={100}
//                                 outerRadius={60}
//                                 label={renderLabel} // custom label
//                             >
//                                 {pieData.map((entry, index) => (
//                                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                         </PieChart>


//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols- gap-6">
//                     {/* <div className="bg-slate-50 rounded-lg p-4">
//                         <h4 className="font-semibold mb-2">Prosody (Pitch / Energy)</h4>
//                         <LineChart width={450} height={240} data={report.prosodyTimeline}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="t" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Line type="monotone" dataKey="pitch" stroke="#8884d8" dot={false} />
//                             <Line type="monotone" dataKey="energy" stroke="#82ca9d" dot={false} />
//                         </LineChart>
//                     </div> */}

//                     <div className="bg-slate-50 rounded-lg p-4">
//                         {/* <h4 className="font-semibold mb-2">Feedback & highlights</h4>
//                         <ul className="list-disc pl-5 text-sm">
//                             {report.highlights.map((h, i) => <li key={i}>{h}</li>)}
//                         </ul> */}

//                         {
//                             report?.feedbackUI?.length > 0 &&
//                             report?.feedbackUI?.map((item) => {
//                                 return <div key={item?.key} className="mt-4 ">
//                                     <h5 className="font-semibold border-b border-gray-200 pb-2 mb-4">{item?.key} feedback</h5>
//                                     <ul className="list-disc pl-5 text-sm flex flex-wrap gap-10">
//                                         {item?.sections?.length ? (
//                                             item.sections.map((section, i) => (
//                                                 <div
//                                                     key={i}
//                                                     className="bg-white w-96 rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
//                                                 >
//                                                     <h5 className="font-semibold text-gray-800 mb-2">
//                                                         {section?.title || "Untitled"}
//                                                     </h5>

//                                                     {/* LIST */}
//                                                     {section?.type === "list" && (
//                                                         <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
//                                                             {Array.isArray(section?.data) && section.data.length > 0 ? (
//                                                                 section.data.map((listItem, idx) => (
//                                                                     <li key={idx}>{listItem || "N/A"}</li>
//                                                                 ))
//                                                             ) : (
//                                                                 <li>No data available</li>
//                                                             )}
//                                                         </ul>
//                                                     )}

//                                                     {/* TEXT */}
//                                                     {section?.type === "text" && (
//                                                         <p className="text-sm text-gray-700">
//                                                             {section?.data || "No data available"}
//                                                         </p>
//                                                     )}

//                                                     {/* BADGES */}
//                                                     {section?.type === "badges" && (
//                                                         <div className="flex flex-wrap gap-2">
//                                                             {section?.data && Object.keys(section.data).length > 0 ? (
//                                                                 Object.entries(section.data).map(([key, value]) => (
//                                                                     <span
//                                                                         key={key}
//                                                                         className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
//                                                                     >
//                                                                         {key}: {value || "N/A"}
//                                                                     </span>
//                                                                 ))
//                                                             ) : (
//                                                                 <span className="text-xs text-gray-500">
//                                                                     No data available
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     )}

//                                                     {/* HIGHLIGHT */}
//                                                     {section?.type === "highlight" && (
//                                                         <div className="text-sm text-gray-700 space-y-1">
//                                                             <p>
//                                                                 <b>Hire:</b> {section?.data?.hire || "N/A"}
//                                                             </p>
//                                                             <p>
//                                                                 <b>Performance:</b> {section?.data?.performance || "N/A"}
//                                                             </p>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <p className="text-gray-500 text-sm">No sections available</p>
//                                         )}
//                                     </ul>
//                                 </div>
//                             })
//                         }

//                     </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                     <div>
//                         <button className="px-4 py-2 rounded bg-[#2a7397] text-white mr-3" onClick={downloadClickHandler}>{pdfLoader ? 'Downloading' : 'Download PDF'} </button>
//                         <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
//                     </div>
//                 </div>
//             </div>
//         </>

//     );
// }


import { useState, useEffect } from "react";
import { useViewResultByUserIdBySubVendorQuery } from "../redux/services/subvendorApi";
import { useViewResultByUserIdQuery } from "../redux/services/vendorApi";
import { useSearchParams } from "react-router-dom";
import Loader from "../libs/Loader";

// ─── Sample data (replace with your API response) ───────────────────────────
// const CANDIDATE_DATA = {
//   result_id: 13,
//   final_score: 0.62,
//   created_at: "2026-05-12T10:11:35.756715",
//   eye_contact: 1.0,
//   blink_score: 0.3247,
//   posture_score: 0.8933,
//   smile_score: 0.0,
//   audio_confidence: 1.0,
//   prosody_pitch_mean: 1318.7478,
//   prosody_pitch_std: 945.7172,
//   prosody_energy_mean: 16.8062,
//   prosody_energy_std: 13.4302,
//   filler_density: 0.0,
//   lexical_ttr: 0.757576,
//   sentiment: 0.5833,
//   semantic_score: 0.6,
//   answer_quality: 0.6,
//   speech_rate_wpm: 220.0,
//   gaze_score: 0.0,
//   nod_score: 0.3247,
//   transcript:
//     "mera naam Khushi Hai Bihar se hun aur Maine MBA karaya NIT college se aur Maine internship karaen University se aur abhi main shirshak Technologies ke sath kam kar rahi hun aur main",
//   detected_language: "Hindi",
//   first_name: "Khushi",
//   last_name: "Doe",
//   email: "wolim14458@ellbit.com",
//   mobile: "9876543210",
//   country_of_residence: "India",
//   metrics_json: {
//     recommendation: {
//       scores: { clarity: 0.632, overall: 0.62, confidence: 0.75, communication: 0.601 },
//       recommendation: "internship_ready",
//       confidence_level: "medium",
//     },
//     feedback: {
//       candidate: {
//         strengths: [
//           "Maintained high eye contact with a score of 1.0",
//           "No filler words used",
//           "High audio confidence of 1.0",
//           "Good posture with a score of 0.8933",
//         ],
//         areas_to_improve: [
//           "Blink score of 0.32 could be improved for a more natural interaction",
//           "Smile score of 0.0 indicates a lack of facial expressions",
//           "Gaze score of 0.0 suggests limited engagement with the audience",
//           "Speech rate of 220 wpm is higher than the ideal range of 110–160",
//           "Semantic score of 0.6 could be improved for stronger relevance",
//         ],
//         tips: [
//           "Record yourself and review your interactions to identify areas for improvement",
//           "Practice in front of a mirror to become more aware of your facial expressions",
//           "Join a public speaking group or take a course to improve your communication skills",
//         ],
//       },
//       vendor: {
//         key_strengths: ["High eye contact", "Good audio confidence", "No filler words"],
//         critical_issues: ["Low smile score", "Low gaze score", "Low nod score"],
//         training_focus: ["Body language", "Clarity and fluency"],
//         skill_assessment: { confidence: "Good", communication: "Fair", technical_clarity: "Fair" },
//         hire_recommendation: "Internship ready",
//       },
//     },
//     audio: {
//       fillers: { total: 0, density: 0.0 },
//       prosody: {
//         pitch_mean: 1318.748,
//         pitch_std: 945.717,
//         energy_mean: 16.806,
//         energy_std: 13.43,
//       },
//       speech_rate_wpm: 220.0,
//     },
//     visual: {
//       nods: { nods: 0, nod_score: 0.3247, nod_rate_per_min: 0.0 },
//       gaze_score: { left_frac: 0.0, gaze_score: 0.0, right_frac: 1.0, center_frac: 0.0 },
//       landmarks_count: 66,
//     },
//     _debug: { duration_seconds: 43.02, num_frames_extracted: 66 },
//   },
// };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pct = (v) => `${Math.round(v * 100)}%`;
const fmt = (v, d = 2) => Number(v).toFixed(d);

function getInitials(first, last) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function recommendationLabel(rec) {
  return rec?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "—";
}

function confidenceBadgeColor(level) {
  if (level === "high") return "bg-green-100 text-green-800";
  if (level === "medium") return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ label, value, color = "bg-blue-500" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.round(value * 100)), 100);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, valueColor = "text-gray-800", sub }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
        <span className="text-base">{icon}</span>
        {label}
      </div>
      <div className={`text-2xl font-medium ${valueColor}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function CircleScore({ value }) {
  const [dash, setDash] = useState(0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  useEffect(() => {
    const t = setTimeout(() => setDash(circumference * (1 - value)), 150);
    return () => clearTimeout(t);
  }, [value, circumference]);
  const pctVal = Math.round(value * 100);
  const color = pctVal >= 70 ? "#16a34a" : pctVal >= 50 ? "#d97706" : "#dc2626";
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="7" />
      <circle
        cx="44" cy="44" r={radius} fill="none"
        stroke={color} strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dash}
        transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dashoffset 0.9s ease" }}
      />
      <text x="44" y="49" textAnchor="middle" fontSize="17" fontWeight="500" fill="#111827">
        {pctVal}%
      </text>
    </svg>
  );
}

function Pill({ children, variant = "neutral" }) {
  const colors = {
    strength: "bg-green-100 text-green-800",
    improve: "bg-amber-100 text-amber-800",
    issue: "bg-red-100 text-red-800",
    neutral: "bg-gray-100 text-gray-700",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 text-sm gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`font-medium text-right text-gray-800 ${valueClass}`}>{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CandidateDetailView() {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const role = localStorage.getItem('role')
  const { data, isLoading } = role === "sub_vendor" ? useViewResultByUserIdBySubVendorQuery({ candidateId }) : useViewResultByUserIdQuery({ candidateId })

  console.log("fff", data)
  const result = data?.results?.[0]?.details || {};
  const m = result.metrics_json || {};
  const rec = m?.recommendation;
  const feedback = m?.feedback;
  const vendor = feedback?.vendor;
  const candidate = feedback?.candidate;

  const scoreColor = (v) => {
    if (v >= 0.7) return "text-green-600";
    if (v >= 0.5) return "text-amber-600";
    return "text-red-600";
  };

  const barColor = (v) => {
    if (v >= 0.7) return "bg-green-500";
    if (v >= 0.5) return "bg-amber-400";
    return "bg-red-400";
  };
  if (isLoading) {
    return <Loader />
  }


  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4">
      <div className=" mx-auto">
        {/* ── Header card ──*/}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 flex items-center gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg shrink-0">
            {getInitials(data?.first_name, data?.last_name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {data?.first_name} {data?.last_name}
              </h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${confidenceBadgeColor(rec?.confidence_level)}`}>
                {rec?.confidence_level?.charAt(0).toUpperCase() + rec?.confidence_level?.slice(1)} confidence
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
                {recommendationLabel(rec?.recommendation)}
              </span>
            </div>
            <div className="flex gap-4 flex-wrap text-xs text-gray-400">
              <span>✉ {data?.email}</span>
              <span>📞 {data?.mobile}</span>
              <span>📍 {data.country_of_residence}</span>
              <span>🗣 {data.detected_language}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-400 mb-0.5">Session date</div>
            <div className="text-sm font-medium text-gray-800">{formatDate(data.created_at)}</div>
            {/* <div className="text-xs text-gray-400 mt-1">
              {fmt(m._debug.duration_seconds, 0)}s · {m.visual.landmarks_count} frames
            </div> */}
          </div>
        </div>

        {/* ── Overall performance ── */}
        <SectionCard title="Overall performance">
          <div className="flex items-center gap-6 flex-wrap">
            <CircleScore value={result?.final_score} />
            <div className="flex-1 min-w-48">
              <ScoreBar label="Confidence" value={rec?.scores?.confidence} color={barColor(rec?.scores?.confidence)} />
              <ScoreBar label="Communication" value={rec?.scores?.communication} color={barColor(rec?.scores?.communication)} />
              <ScoreBar label="Clarity" value={rec?.scores?.clarity} color={barColor(rec?.scores?.clarity)} />
              <ScoreBar label="Semantic quality" value={result?.semantic_score} color={barColor(result?.semantic_score)} />
            </div>
          </div>
        </SectionCard>

        {/* ── Key metrics grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <MetricCard icon="👁" label="Eye contact" value={pct(result?.eye_contact)} valueColor={scoreColor(result?.eye_contact)} sub="Excellent" />
          <MetricCard icon="😊" label="Smile score" value={pct(result?.smile_score)} valueColor={scoreColor(result?.smile_score)} sub="Needs work" />
          <MetricCard icon="🧍" label="Posture" value={pct(result?.posture_score)} valueColor={scoreColor(result?.posture_score)} sub="Good" />
          <MetricCard icon="🎙" label="Audio confidence" value={pct(result?.audio_confidence)} valueColor={scoreColor(result?.audio_confidence)} sub="Excellent" />
          <MetricCard icon="⚡" label="Speech rate" value={`\${Math.round(result?.speech_rate_wpm)} wpm\`} valueColor="text-amber-600" sub="Ideal: 110–160`} />
          <MetricCard icon="🤐" label="Filler words" value={m?.audio?.fillers?.total} valueColor="text-green-600" sub="Excellent" />
        </div>

        {/* ── Transcript ── */}
        <SectionCard title="Transcript">
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 italic leading-relaxed">
            {result?.transcript}
          </div>
          <div className="flex gap-4 flex-wrap mt-2 text-xs text-gray-400">
            <span>🔡 {m?.text?.lexical?.tokens ?? 33} tokens · TTR {fmt(m?.text?.lexical?.ttr ?? data.lexical_ttr, 2)}</span>
            <span>😐 Sentiment {fmt(m?.sentiment, 2)} (neutral+)</span>
          </div>
        </SectionCard>

        {/* ── Strengths & Issues ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <SectionCard title="Strengths">
            <div className="flex flex-wrap gap-2">
              {vendor?.key_strengths && vendor.key_strengths.length > 0 ? (
                vendor?.key_strengths?.map((s) => (
                  <Pill key={s} variant="strength">{s}</Pill>
                ))
              ) : (
                <p className="text-sm text-gray-400">No data available</p>
              )}
            </div>
          </SectionCard>
          <SectionCard title="Critical issues">
            <div className="flex flex-wrap gap-2">
              {vendor?.critical_issues && vendor.critical_issues.length > 0 ? (
                vendor?.critical_issues?.map((i) => (
                  <Pill key={i} variant="issue">{i}</Pill>
                ))
              ) : null}
              {vendor?.training_focus && vendor.training_focus.length > 0 ? (
                vendor?.training_focus?.map((t) => (
                  <Pill key={t} variant="improve">{t}</Pill>
                ))
              ) : null}
              {(!vendor?.critical_issues || vendor.critical_issues.length === 0) && (!vendor?.training_focus || vendor.training_focus.length === 0) && (
                <p className="text-sm text-gray-400">No data available</p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* ── Areas to improve ── */}
        <SectionCard title="Areas to improve">
          <div className="space-y-0">
            {candidate?.areas_to_improve && candidate.areas_to_improve.length > 0 ? (
              candidate?.areas_to_improve?.map((a, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-600 py-2.5 border-b border-gray-50 last:border-0 leading-snug">
                  <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
                  {a}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </div>
        </SectionCard>

        {/* ── Tips for candidate ── */}
        <SectionCard title="Tips for candidate">
          <div>
            {candidate?.tips && candidate.tips.length > 0 ? (
              candidate?.tips?.map((tip, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-600 py-2.5 border-b border-gray-50 last:border-0 leading-snug">
                  <span className="text-blue-400 mt-0.5 shrink-0">💡</span>
                  {tip}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </div>
        </SectionCard>


        {/* ── Visual metrics & Vendor assessment ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <SectionCard title="Visual metrics detail">
            <ScoreBar label="Blink score" value={result?.blink_score} color={barColor(result?.blink_score)} />
            <ScoreBar label="Gaze score" value={result?.gaze_score} color={barColor(result?.gaze_score)} />
            <ScoreBar label="Nod score" value={result?.nod_score} color={barColor(result?.nod_score)} />
            <div className="mt-3">
              <InfoRow label="Gaze right" value={pct(m.visual.gaze_score.right_frac)} />
              <InfoRow label="Gaze center" value={pct(m.visual.gaze_score.center_frac)} />
              <InfoRow label="Nod rate/min" value={fmt(m.visual.nods.nod_rate_per_min, 1)} />
            </div>
          </SectionCard>

          <SectionCard title="Vendor assessment">
            <InfoRow label="Confidence" value={vendor?.skill_assessment?.confidence} valueClass="text-green-600" />
            <InfoRow label="Communication" value={vendor?.skill_assessment?.communication} valueClass="text-amber-600" />
            <InfoRow label="Tech clarity" value={vendor?.skill_assessment?.technical_clarity} valueClass="text-amber-600" />
            <InfoRow label="Hire recommendation" value={vendor?.hire_recommendation} />
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Training focus</p>
              <div className="flex gap-2 flex-wrap">
                {vendor?.training_focus && vendor.training_focus.length > 0 ? (
                  vendor?.training_focus?.map((t) => (
                    <Pill key={t} variant="info">{t}</Pill>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No data available</p>
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Prosody ── */}
        <SectionCard title="Prosody (audio)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Pitch mean", value: `${fmt(m.audio.prosody.pitch_mean, 1)} Hz` },
              { label: "Pitch std", value: `${fmt(m.audio.prosody.pitch_std, 1)} Hz` },
              { label: "Energy mean", value: fmt(m.audio.prosody.energy_mean, 2) },
              { label: "Energy std", value: fmt(m.audio.prosody.energy_std, 2) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-1">{label}</div>
                <div className="text-sm font-medium text-gray-800">{value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Footer ── */}
        <div className="text-center text-xs text-gray-300 pb-6">
          Result ID #{data?.result_id} · Candidate ID {data?.candidate_id ?? "—"}
        </div>
      </div>
    </div>
  );
}