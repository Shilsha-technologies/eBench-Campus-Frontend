// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";

// export default function RecordPage() {
//     const videoRef = useRef(null);
//     const [mediaRecorder, setMediaRecorder] = useState(null);
//     const [recording, setRecording] = useState(false);
//     const [videoURL, setVideoURL] = useState(null);
//     const [timer, setTimer] = useState(0);
//     const navigate = useNavigate();

//     useEffect(() => {
//         async function enableCamera() {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             videoRef.current.srcObject = stream;
//             const recorder = new MediaRecorder(stream);
//             let chunks = [];
//             recorder.ondataavailable = (e) => chunks.push(e.data);
//             recorder.onstop = () => {
//                 const blob = new Blob(chunks, { type: "video/mp4" });
//                 setVideoURL(URL.createObjectURL(blob));
//             };
//             setMediaRecorder(recorder);
//         }
//         enableCamera();
//     }, []);

//     const startRecording = () => {
//         setRecording(true);
//         setTimer(0);
//         mediaRecorder.start();
//         const interval = setInterval(() => {
//             setTimer((t) => {
//                 if (t >= 60) {
//                     clearInterval(interval);
//                     stopRecording();
//                 }
//                 return t + 1;
//             });
//         }, 1000);
//     };

//     const stopRecording = () => {
//         setRecording(false);
//         mediaRecorder.stop();
//     };

//     const uploadVideo = () => {
//         setTimeout(() => navigate("/success"), 1200);
//     }; 

//     function restoreNum(num){
//         let s=0,e=num-1;
//         let ans=-1
//         while(s<=e){
//             let mid=Math.floor(s+(e-s)/2);
//             if(mid*mid === num){
//                 return mid;
//             }else if(mid*mid>num){
//                 e=mid-1
//             }else{
//                 s=mid+1
//                 ans=mid
//             }
//         }
//         return ans;
//     }

//     console.log(restoreNum(20))


//     return (
//         <>
//             <Header />
//             <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-6">
//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center"
//                 >
//                     <h2 className="text-2xl font-bold text-[#286a94]  mb-2">
//                         🎤 Introduction Test Recording
//                     </h2>
//                     <p className="text-gray-600 mb-6">
//                         Please ensure proper lighting and speak clearly. The timer will automatically stop at 60 seconds.
//                     </p>

//                     {/* Camera Frame */}
//                     <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-4 border-blue-400 shadow-lg">
//                         <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
//                         {recording && (
//                             <motion.div
//                                 className="absolute top-3 left-3 bg-red-600 rounded-full w-4 h-4"
//                                 animate={{ opacity: [0, 1, 0] }}
//                                 transition={{ repeat: Infinity, duration: 1 }}
//                             />
//                         )}
//                     </div>

//                     {/* Timer + Actions */}
//                     <div className="mt-5 text-gray-700 font-semibold">
//                         {recording ? `Recording... ${timer}s` : videoURL ? "Preview your video below." : "Ready to start."}
//                     </div>

//                     {videoURL && (
//                         <motion.video
//                             src={videoURL}
//                             controls
//                             className="w-full mt-4 rounded-xl border border-blue-300"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                         />
//                     )}

//                     <div className="mt-6 flex gap-3 justify-center">
//                         {!recording ? (
//                             <motion.button
//                                 onClick={startRecording}
//                                 whileHover={{ scale: 1.05 }}
//                                 className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-lg"
//                             >
//                                 ▶️ Start Recording
//                             </motion.button>
//                         ) : (
//                             <motion.button
//                                 onClick={stopRecording}
//                                 whileHover={{ scale: 1.05 }}
//                                 className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg"
//                             >
//                                 ⏹ Stop
//                             </motion.button>
//                         )}
//                         {videoURL && (
//                             <motion.button
//                                 onClick={uploadVideo}
//                                 whileHover={{ scale: 1.05 }}
//                                 className="bg-[#286a94] hover:bg-[#356583] text-white px-5 py-2 rounded-xl shadow-lg"
//                             >
//                                 ⬆️ Upload Video
//                             </motion.button>
//                         )}
//                     </div>
//                 </motion.div>
//             </div>
//         </>

//     );
// }


// new code 

// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";

// export default function RecordPage() {
//     const videoRef = useRef(null);
//     const [mediaRecorder, setMediaRecorder] = useState(null);
//     const [recording, setRecording] = useState(false);
//     const [videoURL, setVideoURL] = useState(null);
//     const [timer, setTimer] = useState(0);
//     const navigate = useNavigate();

//     useEffect(() => {
//         async function enableCamera() {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: true,
//                 audio: true,
//             });
//             videoRef.current.srcObject = stream;

//             const recorder = new MediaRecorder(stream);
//             let chunks = [];
//             recorder.ondataavailable = (e) => chunks.push(e.data);
//             recorder.onstop = () => {
//                 const blob = new Blob(chunks, { type: "video/mp4" });
//                 setVideoURL(URL.createObjectURL(blob));
//             };
//             setMediaRecorder(recorder);
//         }
//         enableCamera();
//     }, []);

//     const startRecording = () => {
//         setRecording(true);
//         setTimer(0);
//         mediaRecorder.start();

//         const interval = setInterval(() => {
//             setTimer((t) => {
//                 if (t >= 60) {
//                     clearInterval(interval);
//                     stopRecording();
//                 }
//                 return t + 1;
//             });
//         }, 1000);
//     };

//     const stopRecording = () => {
//         setRecording(false);
//         mediaRecorder.stop();
//     };

//     const uploadVideo = () => {
//         navigate("/success");
//     };

//     return (
//         <>
//             <Header />

//             {/* Background */}
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center p-6 relative">

//                 {/* Main Container */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-10 relative overflow-hidden"
//                 >
//                     {/* Floating Camera Box */}
//                     <motion.div
//                         className="absolute right-10 top-10 w-52 h-36 rounded-xl shadow-xl border-2 border-blue-300 overflow-hidden bg-black"
//                         animate={{ y: [0, -5, 0] }}
//                         transition={{ repeat: Infinity, duration: 3 }}
//                     >
//                         <video
//                             ref={videoRef}
//                             autoPlay
//                             muted
//                             className="w-full h-full object-cover"
//                         />

//                         {recording && (
//                             <motion.div
//                                 className="absolute top-2 left-2 bg-red-500 w-3 h-3 rounded-full"
//                                 animate={{ opacity: [0, 1, 0] }}
//                                 transition={{ repeat: Infinity, duration: 1 }}
//                             />
//                         )}
//                     </motion.div>

//                     {/* TITLE */}
//                     <h1 className="text-3xl font-bold text-[#286a94] mb-3">
//                         📝 Introduction Test
//                     </h1>

//                     <p className="text-gray-600 text-lg mb-6">
//                         Read the text below clearly while your video is being recorded.
//                     </p>

//                     {/* SCRIPT TEXT BOX */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-inner mb-8">
//                         <h2 className="text-xl font-semibold text-[#286a94] mb-3">
//                             🔊 Please speak the following text:
//                         </h2>

//                         <p className="text-gray-700 leading-relaxed text-lg">
//                             “Hello, my name is <b>[Your Name]</b>.  
//                             I am excited to participate in this assessment.  
//                             I have a strong interest in this role and look forward to showcasing my skills.  
//                             Thank you for giving me this opportunity.”
//                         </p>
//                     </div>

//                     {/* Timer */}
//                     <div className="text-center text-lg font-semibold text-gray-700 mb-5">
//                         {recording ? (
//                             <span className="text-red-600">
//                                 ⏳ Recording: {timer}s
//                             </span>
//                         ) : videoURL ? (
//                             "🎞 Preview your video below."
//                         ) : (
//                             "Click Start to begin recording."
//                         )}
//                     </div>

//                     {/* VIDEO PREVIEW */}
//                     {videoURL && (
//                         <motion.video
//                             src={videoURL}
//                             controls
//                             className="w-full rounded-2xl border border-blue-300 shadow-lg mb-6"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                         />
//                     )}

//                     {/* ACTION BUTTONS */}
//                     <div className="flex gap-4 justify-center mt-4">
//                         {!recording ? (
//                             <motion.button
//                                 onClick={startRecording}
//                                 whileHover={{ scale: 1.05 }}
//                                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
//                             >
//                                 🎬 Start Recording
//                             </motion.button>
//                         ) : (
//                             <motion.button
//                                 onClick={stopRecording}
//                                 whileHover={{ scale: 1.05 }}
//                                 className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
//                             >
//                                 ⏹ Stop Recording
//                             </motion.button>
//                         )}

//                         {videoURL && (
//                             <motion.button
//                                 onClick={uploadVideo}
//                                 whileHover={{ scale: 1.05 }}
//                                 className="bg-[#286a94] hover:bg-[#1f597a] text-white px-6 py-3 rounded-xl font-semibold"
//                             >
//                                 ⬆️ Upload Video
//                             </motion.button>
//                         )}
//                     </div>
//                 </motion.div>
//             </div>
//         </>
//     );
// }


// new code

// RecordInterviewPage.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";

// /**
//  * AI Interview / Mic Test / Live STT + Recording Page
//  * - Mic Test with waveform (uses WebAudio Analyser)
//  * - Live Speech-to-Text (Web Speech API - Chrome)
//  * - Camera small floating box
//  * - MediaRecorder to capture final video+audio
//  *
//  * Styling: TailwindCSS classes
//  */

// export default function RecordInterviewPage() {
//   const navigate = useNavigate();

//   // refs
//   const localVideoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const sourceRef = useRef(null);

//   // media
//   const mediaStreamRef = useRef(null);
//   const recorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   // ui state
//   const [micTestActive, setMicTestActive] = useState(false);
//   const [micTestPassed, setMicTestPassed] = useState(false);
//   const micLevelRef = useRef(0);

//   const [micLevel, setMicLevel] = useState(0); // 0..1
//   const [listening, setListening] = useState(false); // speech recognition active
//   const [recording, setRecording] = useState(false);
//   const [videoURL, setVideoURL] = useState(null);
//   const [transcript, setTranscript] = useState(""); // final transcript
//   const [interim, setInterim] = useState(""); // interim transcript
//   const [timer, setTimer] = useState(0);

//   // Mic test thresholds
//   const PASS_RMS_THRESHOLD = 0.02; // tweak if too sensitive
//   const PASS_SECONDS_REQUIRED = 0.02;

//   useEffect(() => {
//     // request media (camera+mic) early to speed up interactions
//     async function init() {
//       try {
//         const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         mediaStreamRef.current = s;
//         if (localVideoRef.current) localVideoRef.current.srcObject = s;
//       } catch (err) {
//         console.error("Media permission error:", err);
//       }
//     }
//     init();

//     return () => {
//       // cleanup on unmount
//       stopAllTracks();
//       stopAudioAnalyser();
//       stopRecognition();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* -------------------------
//      AUDIO ANALYSER (WAVEFORM)
//      ------------------------- */
//   const startAudioAnalyser = async () => {
//     if (!mediaStreamRef.current) {
//       try {
//         mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         if (localVideoRef.current) localVideoRef.current.srcObject = mediaStreamRef.current;
//       } catch (err) {
//         console.error("getUserMedia failed:", err);
//         return;
//       }
//     }

//     audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//     analyserRef.current = audioContextRef.current.createAnalyser();
//     analyserRef.current.fftSize = 2048;
//     sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
//     sourceRef.current.connect(analyserRef.current);

//     setMicTestActive(true);
//     drawWaveform();
//     runMicLevelCheck();
//   };

//   const stopAudioAnalyser = () => {
//     setMicTestActive(false);
//     if (audioContextRef.current && audioContextRef.current.state !== "closed") {
//       audioContextRef.current.close().catch(() => {});
//       audioContextRef.current = null;
//       analyserRef.current = null;
//       sourceRef.current = null;
//     }
//     // clear canvas
//     const c = canvasRef.current;
//     if (c) {
//       const ctx = c.getContext("2d");
//       ctx.clearRect(0, 0, c.width, c.height);
//     }
//   };

//   const drawWaveform = () => {
//     const canvas = canvasRef.current;
//     const analyser = analyserRef.current;
//     if (!canvas || !analyser) return;
//     const ctx = canvas.getContext("2d");
//     const bufferLength = analyser.fftSize;
//     const dataArray = new Uint8Array(bufferLength);

//     const draw = () => {
//       if (!analyserRef.current) return; // stopped
//       analyserRef.current.getByteTimeDomainData(dataArray);

//       ctx.fillStyle = "rgba(255,255,255,0.02)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       ctx.lineWidth = 2;
//       ctx.strokeStyle = "#0ea5e9"; // azure-like
//       ctx.beginPath();

//       const sliceWidth = canvas.width / bufferLength;
//       let x = 0;
//       let sum = 0;

//       for (let i = 0; i < bufferLength; i++) {
//         const v = dataArray[i] / 128.0 - 1.0;
//         sum += Math.abs(v);
//         const y = (v * canvas.height) / 2 + canvas.height / 2;
//         if (i === 0) ctx.moveTo(x, y);
//         else ctx.lineTo(x, y);
//         x += sliceWidth;
//       }
//       ctx.lineTo(canvas.width, canvas.height / 2);
//       ctx.stroke();

//       // RMS level (approx)
//       const rms = sum / bufferLength;
//       // setMicLevel(rms);
//       micLevelRef.current = rms

//       requestAnimationFrame(draw);
//     };

//     requestAnimationFrame(draw);
//   };

//   // mic test: check sustained level
//   let micTestTimer = useRef(null);
//   const runMicLevelCheck = () => {
//     let passStart = null;
//     micTestTimer.current = setInterval(() => {
//       const lvl = micLevelRef.current;
//       console.log("lvl",lvl)
//       if (lvl > PASS_RMS_THRESHOLD) {
//         if (!passStart) passStart = performance.now();
//         const held = (performance.now() - passStart) / 1000;
//         if (held >= PASS_SECONDS_REQUIRED) {
//           setMicTestPassed(true);
//           clearInterval(micTestTimer.current);
//           micTestTimer.current = null;
//           // stop analyser but keep stream because it's used for camera/recording
//           stopAudioAnalyser();
//         }
//       } else {
//         passStart = null;
//       }
//     }, 150);
//   };

//   const stopMicLevelCheck = () => {
//     if (micTestTimer.current) {
//       clearInterval(micTestTimer.current);
//       micTestTimer.current = null;
//     }
//   };

//   /* -------------------------
//      SPEECH RECOGNITION (Web Speech API)
//      ------------------------- */
//   const startRecognition = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("SpeechRecognition not supported in this browser. Use Chrome.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;
//     recognition.maxAlternatives = 1;
//     recognition.continuous = true;

//     recognition.onstart = () => {
//       setListening(true);
//     };

//     recognition.onresult = (event) => {
//       let interimText = "";
//       let finalText = transcript || "";
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         const res = event.results[i];
//         if (res.isFinal) {
//           finalText += (finalText ? " " : "") + res[0].transcript.trim();
//         } else {
//           interimText += res[0].transcript;
//         }
//       }
//       setTranscript(finalText);
//       setInterim(interimText);
//     };

//     recognition.onend = () => {
//       setListening(false);
//       // if still recording, restart recognition (some browsers stop)
//       if (recording) {
//         setTimeout(() => {
//           if (recognitionRef.current) recognitionRef.current.start();
//         }, 200);
//       }
//     };

//     recognition.onerror = (e) => {
//       console.warn("Speech recognition error:", e);
//     };

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   const stopRecognition = () => {
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.onend = () => {};
//         recognitionRef.current.stop();
//       } catch (e) {}
//       recognitionRef.current = null;
//       setListening(false);
//     }
//   };

//   /* -------------------------
//      RECORDING (MediaRecorder)
//      ------------------------- */
//   const startRecordingFlow = async () => {
//     // Ensure we have stream
//     if (!mediaStreamRef.current) {
//       try {
//         mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         if (localVideoRef.current) localVideoRef.current.srcObject = mediaStreamRef.current;
//       } catch (err) {
//         alert("Please allow camera and microphone.");
//         return;
//       }
//     }

//     recordedChunksRef.current = [];
//     const options = { mimeType: "video/webm; codecs=vp8,opus" };
//     try {
//       const recorder = new MediaRecorder(mediaStreamRef.current, options);
//       recorder.ondataavailable = (e) => {
//         if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
//       };
//       recorder.onstop = () => {
//         const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
//         const url = URL.createObjectURL(blob);
//         setVideoURL(url);
//       };
//       recorderRef.current = recorder;
//       recorder.start(100); // gather data in 100ms chunks
//     } catch (err) {
//       console.error("MediaRecorder init failed:", err);
//       alert("Recording is not supported in this browser.");
//       return;
//     }

//     // start speech recognition for live transcript
//     startRecognition();

//     setRecording(true);
//     setTimer(0);

//     // timer
//     const tick = setInterval(() => {
//       setTimer((t) => {
//         const nt = t + 1;
//         if (nt >= 120) {
//           // max 2 minutes for safety
//           stopRecordingFlow();
//           clearInterval(tick);
//         }
//         return nt;
//       });
//     }, 1000);
//   };

//   const stopRecordingFlow = () => {
//     // stop recorder
//     if (recorderRef.current && recorderRef.current.state !== "inactive") {
//       try {
//         recorderRef.current.stop();
//       } catch (e) {}
//       recorderRef.current = null;
//     }

//     // stop recognition (it will append final text to transcript)
//     stopRecognition();

//     setRecording(false);
//     stopAllTracks();
//   };

//   const uploadVideo = async () => {
//     // stub: replace with actual upload logic
//     // const blob = await fetch(videoURL).then(r => r.blob());
//     // upload 'blob' via fetch/XHR
//     alert("Upload flow: implement your API call here.");
//     navigate("/success");
//   };

//   /* -------------------------
//      HELPERS
//      ------------------------- */
//   const stopAllTracks = () => {
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach((t) => t.stop());
//       mediaStreamRef.current = null;
//     }
//   };

//   /* -------------------------
//      UI
//      ------------------------- */
//   return (
//     <>
//       <Header />

//       <div className="min-h-screen bg-linear-to-br pt-20 from-slate-50 via-white to-blue-50 p-6 flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: 18 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//           className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
//         >
//           {/* Left: Instructions + script + transcript */}
//           <div className="grid grid-cols-12 gap-6">
//             <div className="col-span-7 pr-4">
//               <div className="mb-4 flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold text-[#0f5e87]">AI Interview — Speaking Test</h2>
//                   <p className="text-sm text-gray-500 mt-1">Mic check → Live transcript → Record video</p>
//                 </div>

//                 {/* Mic test badge */}
//                 <div className="text-right">
//                   <div className="text-xs text-gray-500">Mic Status</div>
//                   <div
//                     className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
//                       micTestPassed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {micTestPassed ? "Ready" : micTestActive ? "Testing..." : "Not tested"}
//                   </div>
//                 </div>
//               </div>

//               {/* SCRIPT BOX */}
//               {/* <div className="mb-4 p-6 border border-blue-100 rounded-xl bg-gradient-to-br from-white to-slate-50 shadow-inner">
//                 <h3 className="font-semibold text-lg text-[#0f5e87] mb-3">Speech Prompt</h3>
//                 <p className="text-gray-700 text-lg leading-relaxed">
//                   Read the script below clearly. While you speak, words will appear on the right in real-time.
//                 </p>

//                 <div className="mt-4 rounded-lg bg-[#f8fafc] border border-blue-50 p-4">
//                   <p className="text-gray-800 text-base leading-relaxed">
//                     “Hello, my name is <strong>[Your Name]</strong>. I am excited to be considered for this role.
//                     I bring strong communication skills and a passion for continuous learning. Thank you for this opportunity.”
//                   </p>
//                 </div>
//               </div> */}

//               {/* TRANSCRIPT PANEL */}
//               <div className="p-4 rounded-xl border border-slate-100 shadow-sm bg-white">
//                 <div className="flex items-center justify-between mb-3">
//                   <h4 className="text-md font-semibold text-[#0f5e87]">Live Transcript</h4>
//                   <div className="text-sm text-gray-500">Interim shown in gray</div>
//                 </div>

//                 <div className="min-h-[140px] max-h-56 overflow-auto p-4 rounded-lg bg-slate-50 border border-slate-100">
//                   <p className="whitespace-pre-wrap text-gray-800">
//                     {transcript}
//                     <span className="text-gray-400"> {interim}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Floating camera + mic test + waveform + actions */}
//             <div className="col-span-5 pl-4">
//               {/* small live camera */}
//               <div className="relative mb-4">
//                 <div className="absolute -top-4 -right-4 p-2 rounded-full bg-gradient-to-br from-[#0f5e87] to-[#2b82a8] text-white text-xs shadow-lg">
//                   AI Mode
//                 </div>

//                 <div className="w-full rounded-xl overflow-hidden border border-slate-100 shadow-lg">
//                   <div className="relative">
//                     <video
//                       ref={localVideoRef}
//                       autoPlay
//                       muted
//                       playsInline
//                       className="w-91 h-48 mx-auto mt-3 rounded-2xl object-cover bg-black"
//                     />
//                     {recording && (
//                       <motion.div
//                         animate={{ opacity: [0.2, 1, 0.2] }}
//                         transition={{ repeat: Infinity, duration: 1.2 }}
//                         className="absolute top-3 left-3 bg-red-500 w-3 h-3 rounded-full shadow"
//                       />
//                     )}
//                   </div>

//                   <div className="p-4 bg-white">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <div className="text-sm text-gray-500">Camera</div>
//                         <div className="font-semibold text-gray-800">Front Camera</div>
//                       </div>
//                       <div className="text-sm text-gray-500">Status: {mediaStreamRef.current ? "Live" : "No camera"}</div>
//                     </div>

//                     {/* waveform canvas */}
//                     <div className="mt-3">
//                       <canvas ref={canvasRef} width={400} height={80} className="w-full rounded-md bg-white" />
//                       <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
//                         <div>Mic level</div>
//                         <div className="flex items-center gap-2">
//                           <div className="text-sm">{(micLevelRef.current * 100).toFixed(0)}%</div>
//                           {micTestPassed ? (
//                             <div className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Passed</div>
//                           ) : (
//                             <div className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">Not passed</div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="space-y-3">
//                 <button
//                   onClick={async () => {
//                     // start or stop mic test
//                     if (!micTestActive && !micTestPassed) {
//                       await startAudioAnalyser();
//                     } else {
//                       stopAudioAnalyser();
//                       stopMicLevelCheck();
//                     }
//                   }}
//                   className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-[#0f5e87] to-[#2b82a8] text-white font-semibold shadow"
//                 >
//                   {micTestPassed ? "Mic Ready ✓" : micTestActive ? "Stop Mic Test" : "Start Mic Test"}
//                 </button>

//                 <button
//                   onClick={() => {
//                     if (!micTestPassed) {
//                       alert("Please pass the mic test first so your audio is loud & clear.");
//                       return;
//                     }
//                     if (!recording) startRecordingFlow();
//                     else stopRecordingFlow();
//                   }}
//                   className={`w-full px-4 py-3 rounded-xl font-semibold shadow ${recording ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
//                 >
//                   {recording ? "⏹ Stop Recording" : "🎬 Start Recording"}
//                 </button>

//                 {videoURL && (
//                   <div className="space-y-2">
//                     <a href={videoURL} target="_blank" rel="noreferrer" className="block text-sm text-blue-700 underline">
//                       Open recorded video
//                     </a>
//                     <div className="flex gap-2">
//                       <button onClick={() => uploadVideo()} className="flex-1 px-4 py-2 rounded-lg bg-[#0f5e87] text-white font-semibold cursor-pointer">⬆ Upload</button>
//                       <a
//                         href={videoURL}
//                         download="interview_recording.webm"
//                         className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-center"
//                       >
//                         ⤓ Download
//                       </a>
//                     </div>
//                   </div>
//                 )}

//                 <div className="text-xs text-center text-gray-400 mt-2">
//                   Tip: Allow microphone & camera. Use Chrome for best STT experience.
//                 </div>
//               </div>
//             </div>
//           </div>

//         </motion.div>
//       </div>
//     </>
//   );
// }


//hello code

// File: hooks/useMediaStream.js
import { useRef, useCallback } from 'react';

export function useMediaStream() {
  const mediaStreamRef = useRef(null);

  const getMediaStream = useCallback(async (constraints = { audio: true, video: true }) => {
    if (mediaStreamRef.current) return mediaStreamRef.current;
    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = s;
      return s;
    } catch (err) {
      throw err;
    }
  }, []);

  const stopAllTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  return { mediaStreamRef, getMediaStream, stopAllTracks };
}

// File: hooks/useMicTest.js
// import {  useState, useCallback, useEffect } from 'react';

export function useMicTest({ mediaStreamRef, canvasRef }) {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const micLevelRef = useRef(0);
  const [micTestActive, setMicTestActive] = useState(false);
  const [micTestPassed, setMicTestPassed] = useState(false);

  const PASS_RMS_THRESHOLD = 0; // tweak
  const PASS_SECONDS_REQUIRED = 0.01;
  const micTimerRef = useRef(null);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0ea5e9';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      let sum = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0 - 1.0;
        sum += Math.abs(v);
        const y = (v * canvas.height) / 2 + canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      micLevelRef.current = sum / bufferLength;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
  }, [canvasRef]);

  const start = useCallback(async () => {
    if (!mediaStreamRef.current) {
      throw new Error('No media stream');
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      // already started
    } else {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      sourceRef.current.connect(analyserRef.current);
    }

    setMicTestActive(true);
    drawWaveform();

    // Run mic-level check
    let passStart = null;
    micTimerRef.current = setInterval(() => {
      const lvl = micLevelRef.current;
      if (lvl > PASS_RMS_THRESHOLD) {
        if (!passStart) passStart = performance.now();
        const held = (performance.now() - passStart) / 1000;
        if (held >= PASS_SECONDS_REQUIRED) {
          setMicTestPassed(true);
          stop();
          clearInterval(micTimerRef.current);
          micTimerRef.current = null;
        }
      } else {
        passStart = null;
      }
    }, 150);
  }, [drawWaveform, mediaStreamRef]);

  const stop = useCallback(() => {
    setMicTestActive(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
      analyserRef.current = null;
      sourceRef.current = null;
    }

    if (micTimerRef.current) {
      clearInterval(micTimerRef.current);
      micTimerRef.current = null;
    }

    // clear canvas
    const c = canvasRef.current;
    if (c) {
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
    }
  }, [canvasRef]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    micTestActive,
    micTestPassed,
    micLevelRef,
    startMicTest: start,
    stopMicTest: stop,
  };
}

// File: hooks/useSpeechToText.js
// import { useRef, useState, useCallback, useEffect } from 'react';

export function useSpeechToText() {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const recordingRef = useRef(false);

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('SpeechRecognition not supported');
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = transcript || '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += (finalText ? ' ' : '') + res[0].transcript.trim();
        } else {
          interimText += res[0].transcript;
        }
      }
      setTranscript(finalText);
      setInterim(interimText);
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e);
    };

    recognition.onend = () => {
      setListening(false);
      // auto-restart if recording is still active
      if (recordingRef.current) {
        setTimeout(() => {
          try {
            if (recognitionRef.current) recognitionRef.current.start();
          } catch (e) { }
        }, 200);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    recordingRef.current = true;
  }, [transcript]);

  const stop = useCallback(() => {
    recordingRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = () => { };
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { listening, transcript, interim, startRecognition: start, stopRecognition: stop, setTranscript };
}

// File: hooks/useRecorder.js
// import { useRef, useState, useCallback } from 'react';

export function useRecorder({ mediaStreamRef, onRecordingStop }) {
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false); // ✅ NEW
  const [videoURL, setVideoURL] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const startRecording = async () => {
    const stream = mediaStreamRef.current;
    if (!stream) throw new Error("No media stream");

    recordedChunksRef.current = [];

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoURL(url);

      if (onRecordingStop) onRecordingStop(blob, url);
    };

    recorderRef.current = recorder;
    recorder.start(200);
    setRecording(true);
    setPaused(false); // ✅ reset
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
    setPaused(false);
  };

  // ✅ NEW: Pause
  const pauseRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.pause();
      setPaused(true);
    }
  };

  // ✅ NEW: Resume
  const resumeRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "paused") {
      recorderRef.current.resume();
      setPaused(false);
    }
  };

  return {
    recording,
    paused, // ✅ expose
    startRecording,
    stopRecording,
    pauseRecording,   // ✅ expose
    resumeRecording,  // ✅ expose
    videoURL,
    setVideoURL,
    recordedBlob,
  };
}

// File: RecordInterviewPage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useUploadTestMutation } from '../redux/services/userApi';
import toast from 'react-hot-toast';
// import { useMediaStream } from './hooks/useMediaStream';
// import { useMicTest } from './hooks/useMicTest';
// import { useSpeechToText } from './hooks/useSpeechToText';
// import { useRecorder } from './hooks/useRecorder';

export default function RecordInterviewPage() {
  const navigate = useNavigate();
  const { mediaStreamRef, getMediaStream, stopAllTracks } = useMediaStream();
  const canvasRef = useRef(null);
  const localVideoRef = useRef(null);
  const location = useLocation();
  const candidateId = location?.state?.data ?? null;
  const [uploadTest, { isLoading }] = useUploadTestMutation();

  // console.log("local-video-ref", localVideoRef);

  const { micTestActive, micTestPassed, micLevelRef, startMicTest, stopMicTest } = useMicTest({ mediaStreamRef, canvasRef });
  const { listening, transcript, interim, startRecognition, stopRecognition, setTranscript } = useSpeechToText();
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const onRecordingStop = (blob, url) => {
    // optional: store blob for upload
    // console.log("Received blob:", blob);
  };

  // const { recording, videoURL, startRecording, stopRecording, recordedBlob, setVideoURL } = useRecorder({ mediaStreamRef, onRecordingStop });
  const {
    recording,
    paused,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    videoURL,
    recordedBlob,
    setVideoURL
  } = useRecorder({ mediaStreamRef, onRecordingStop });
  useEffect(() => {
    // warm-up media to reduce permission friction
    getMediaStream().then((s) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = s;
    }).catch((e) => {
      console.warn('Media init failed:', e);
    });

    return () => {
      stopAllTracks();
      stopMicTest();
      stopRecognition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartMicTest = async () => {
    try {
      if (!mediaStreamRef.current) await getMediaStream();
      await startMicTest();
    } catch (e) {
      alert('Please allow microphone & camera.');
    }
  };

  //   s1 = "ab", s2 = "eidbaooo"
  // Output: true
  // Explanation: s2 contains one permutation of s1 ("ba").

  const startRecordingFlow = async () => {
    try {
      if (!mediaStreamRef.current) await getMediaStream();
      if (localVideoRef.current) localVideoRef.current.srcObject = mediaStreamRef.current;
      // reset transcript
      setTranscript('');
      await startRecording();
      startRecognition();
      setTimer(0);

      // simple timer
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          const nt = t + 1;
          if (nt >= 120) {
            stopRecordingFlow();
          }
          return nt;
        });
      }, 1000);
    } catch (e) {
      alert('Recording failed or not supported in this browser.');
    }
  };

  function recognition(s1, s2) {

  }


  const handlePause = () => {
    pauseRecording();
    stopRecognition();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleResume = () => {
    resumeRecording();
    startRecognition();

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        const nt = t + 1;
        if (nt >= 120) {
          stopRecordingFlow();
        }
        return nt;
      });
    }, 1000);
  };

  const stopRecordingFlow = () => {
    stopRecording();
    stopRecognition();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
    // keep stream active if you want; here we stop it to release camera
    stopAllTracks();
  };


  const uploadVideo = async () => {
    if (!videoURL) return alert('No video to upload');

    const file = new File([recordedBlob], "interview.webm", {
      type: "video/webm",
    });
    // console.log("ffff", file)

    const formData = new FormData();
    formData.append("file", file);
    // debugger;
    try {
      const result = await uploadTest(formData);
      debugger;
      // console.log("result from api", result);
      if (result?.data) {
        toast.success(result?.data?.message ?? "file uploaded successfully..")
        setTimeout(() => {
          navigate('/test-success');
        }, 1500)
      }
    } catch (err) {
      // console.log("ee", e);
      toast.error(err?.message ?? "Something went wrong Pls try again.")
    }

  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br pt-20 from-slate-50 via-white to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 pr-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f5e87]">AI Interview — Speaking Test</h2>
                  <p className="text-sm text-gray-500 mt-1">Mic check → Live transcript → Record video</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">Mic Status</div>
                  <div
                    className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold ${micTestPassed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {micTestPassed ? 'Ready' : micTestActive ? 'Testing...' : 'Not tested'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-[#0f5e87]">Live Transcript</h4>
                  <div className="text-sm text-gray-500">Interim shown in gray</div>
                </div>

                <div className="min-h-[140px] max-h-56 overflow-auto p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="whitespace-pre-wrap text-gray-800">
                    {transcript}
                    <span className="text-gray-400"> {interim}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-5 pl-4">
              <div className="relative mb-4">
                <div className="absolute -top-4 -right-4 p-2 rounded-full bg-gradient-to-br from-[#0f5e87] to-[#2b82a8] text-white text-xs shadow-lg">AI Mode</div>

                <div className="w-full rounded-xl overflow-hidden border border-slate-100 shadow-lg">
                  <div className="relative">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-91 h-48 mx-auto mt-3 rounded-2xl object-cover bg-black"
                    />
                    {/* {recording && (
                      <motion.div
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute top-3 left-3 bg-red-500 w-3 h-3 rounded-full shadow"
                      />
                    )} */}
                    {/* 🔴 Recording Indicator */}
                    {recording && !paused && (
                      <motion.div
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute top-3 left-3 bg-red-500 w-3 h-3 rounded-full shadow"
                      />
                    )}

                    {/* ⏸️ Paused Indicator */}
                    {recording && paused && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold shadow">
                        Paused
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm text-gray-500">Camera</div>
                        <div className="font-semibold text-gray-800">Front Camera</div>
                      </div>
                      <div className="text-sm text-gray-500">Status: {mediaStreamRef.current ? 'Live' : 'No camera'}</div>
                    </div>

                    <div className="mt-3">
                      <canvas ref={canvasRef} width={400} height={80} className="w-full rounded-md bg-white" />
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <div>Mic level</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{(micLevelRef.current * 100).toFixed(0)}%</div>
                          {micTestPassed ? (
                            <div className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Passed</div>
                          ) : (
                            <div className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">Not passed</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {
                  !micTestPassed &&
                  <button
                    onClick={async () => {
                      if (!micTestActive && !micTestPassed) {
                        await handleStartMicTest();
                      } else {
                        stopMicTest();
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-[#0f5e87] to-[#2b82a8] text-white font-semibold shadow"
                  >
                    {micTestPassed ? 'Mic Ready ✓' : micTestActive ? 'Stop Mic Test' : 'Start Mic Test'}
                  </button>
                }


                <button
                  onClick={() => {
                    if (!micTestPassed) {
                      alert('Please pass the mic test first so your audio is loud & clear.');
                      return;
                    }
                    if (!recording) startRecordingFlow();
                    else stopRecordingFlow();
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold shadow ${recording ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                >
                  {recording ? '⏹ Stop Recording' : '🎬 Start Recording'}
                </button>

                {recording && (
                  <button
                    onClick={() => {
                      if (paused) handleResume();
                      else handlePause();
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-yellow-500 text-white font-semibold shadow"
                  >
                    {paused ? '▶ Resume Recording' : '⏸ Pause Recording'}
                  </button>
                )}

                {videoURL && (
                  <div className="space-y-2">
                    <a href={videoURL} target="_blank" rel="noreferrer" className="block text-sm text-blue-700 underline">Open recorded video</a>
                    <div className="flex gap-2">
                      <button onClick={() => uploadVideo()} className="flex-1 px-4 py-2 rounded-lg bg-[#0f5e87] text-white font-semibold cursor-pointer">{isLoading ? 'Uploading' : '⬆ Upload'} </button>
                      {/* <a href={videoURL} download="interview_recording.webm" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-center">⤓ Download</a> */}
                    </div>
                  </div>
                )}

                <div className="text-xs text-center text-gray-400 mt-2">Tip: Allow microphone & camera. Use Chrome for best STT experience.</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
