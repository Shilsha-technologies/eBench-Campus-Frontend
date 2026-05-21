// import { useState, useEffect, useRef, useCallback } from "react";

// // Monaco Editor loader
// const MONACO_CDN = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs";

// const PROBLEM = {
//   id: 1,
//   title: "Two Sum",
//   difficulty: "Easy",
//   tags: ["Array", "Hash Table"],
//   description: `Given an array of integers <code class="inline-code">nums</code> and an integer <code class="inline-code">target</code>, return <em>indices of the two numbers such that they add up to target</em>.

// You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.

// You can return the answer in any order.`,
//   constraints: [
//     "2 ≤ nums.length ≤ 10⁴",
//     "-10⁹ ≤ nums[i] ≤ 10⁹",
//     "-10⁹ ≤ target ≤ 10⁹",
//     "Only one valid answer exists.",
//   ],
//   examples: [
//     {
//       input: "nums = [2,7,11,15], target = 9",
//       output: "[0,1]",
//       explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
//     },
//     {
//       input: "nums = [3,2,4], target = 6",
//       output: "[1,2]",
//       explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
//     },
//     {
//       input: "nums = [3,3], target = 6",
//       output: "[0,1]",
//       explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
//     },
//   ],
// };

// const TEST_CASES = [
//   { id: 1, input: "nums = [2,7,11,15]\ntarget = 9", expected: "[0,1]" },
//   { id: 2, input: "nums = [3,2,4]\ntarget = 6", expected: "[1,2]" },
//   { id: 3, input: "nums = [3,3]\ntarget = 6", expected: "[0,1]" },
// ];

// const STARTER_CODE = {
//   javascript: `/**
//  * @param {number[]} nums
//  * @param {number} target
//  * @return {number[]}
//  */
// var twoSum = function(nums, target) {
//     const map = new Map();
//     for (let i = 0; i < nums.length; i++) {
//         const complement = target - nums[i];
//         if (map.has(complement)) {
//             return [map.get(complement), i];
//         }
//         map.set(nums[i], i);
//     }
//     return [];
// };`,
//   python: `class Solution:
//     def twoSum(self, nums: List[int], target: int) -> List[int]:
//         seen = {}
//         for i, num in enumerate(nums):
//             complement = target - num
//             if complement in seen:
//                 return [seen[complement], i]
//             seen[num] = i
//         return []`,
//   java: `class Solution {
//     public int[] twoSum(int[] nums, int target) {
//         Map<Integer, Integer> map = new HashMap<>();
//         for (int i = 0; i < nums.length; i++) {
//             int complement = target - nums[i];
//             if (map.containsKey(complement)) {
//                 return new int[] { map.get(complement), i };
//             }
//             map.put(nums[i], i);
//         }
//         return new int[]{};
//     }
// }`,
//   cpp: `class Solution {
// public:
//     vector<int> twoSum(vector<int>& nums, int target) {
//         unordered_map<int, int> map;
//         for (int i = 0; i < nums.size(); i++) {
//             int complement = target - nums[i];
//             if (map.count(complement)) {
//                 return {map[complement], i};
//             }
//             map[nums[i]] = i;
//         }
//         return {};
//     }
// };`,
// };

// const LANG_CONFIG = {
//   javascript: { label: "JavaScript", monaco: "javascript", ext: "js" },
//   python: { label: "Python", monaco: "python", ext: "py" },
//   java: { label: "Java", monaco: "java", ext: "java" },
//   cpp: { label: "C++", monaco: "cpp", ext: "cpp" },
// };

// // Simulated test runner
// function runTestCases(code, lang, testCases) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const results = testCases.map((tc) => {
//         const passed = Math.random() > 0.2;
//         return {
//           id: tc.id,
//           input: tc.input,
//           expected: tc.expected,
//           actual: passed ? tc.expected : "[0,2]",
//           passed,
//           runtime: Math.floor(Math.random() * 80 + 20) + " ms",
//           memory: (Math.random() * 2 + 40).toFixed(1) + " MB",
//         };
//       });
//       resolve(results);
//     }, 1400);
//   });
// }

// // Monaco Editor Component
// function MonacoEditor({ value, onChange, language, theme = "vs-dark" }) {
//   const containerRef = useRef(null);
//   const editorRef = useRef(null);
//   const monacoRef = useRef(null);
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     let cancelled = false;
//     function loadMonaco() {
//       if (window.monaco) { initEditor(); return; }
//       const script = document.createElement("script");
//       script.src = `${MONACO_CDN}/loader.js`;
//       script.onload = () => {
//         window.require.config({ paths: { vs: MONACO_CDN } });
//         window.require(["vs/editor/editor.main"], (monaco) => {
//           if (!cancelled) { monacoRef.current = monaco; initEditor(); }
//         });
//       };
//       document.head.appendChild(script);
//     }

//     function initEditor() {
//       if (!containerRef.current || editorRef.current) return;
//       const monaco = monacoRef.current || window.monaco;
//       if (!monaco) return;

//       const editor = monaco.editor.create(containerRef.current, {
//         value,
//         language: LANG_CONFIG[language]?.monaco || language,
//         theme,
//         fontSize: 14,
//         fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
//         lineHeight: 22,
//         minimap: { enabled: false },
//         scrollBeyondLastLine: false,
//         renderLineHighlight: "line",
//         cursorStyle: "line",
//         cursorBlinking: "smooth",
//         smoothScrolling: true,
//         wordWrap: "on",
//         padding: { top: 16, bottom: 16 },
//         suggest: { showKeywords: true },
//         overviewRulerLanes: 0,
//         hideCursorInOverviewRuler: true,
//         scrollbar: {
//           verticalScrollbarSize: 6,
//           horizontalScrollbarSize: 6,
//         },
//         bracketPairColorization: { enabled: true },
//       });

//       editorRef.current = editor;
//       editor.onDidChangeModelContent(() => onChange(editor.getValue()));
//       setLoaded(true);
//     }

//     loadMonaco();
//     return () => { cancelled = true; };
//   }, []);

//   useEffect(() => {
//     if (!editorRef.current) return;
//     const monaco = monacoRef.current || window.monaco;
//     if (!monaco) return;
//     const model = editorRef.current.getModel();
//     if (model) monaco.editor.setModelLanguage(model, LANG_CONFIG[language]?.monaco || language);
//   }, [language]);

//   useEffect(() => {
//     if (!editorRef.current) return;
//     const current = editorRef.current.getValue();
//     if (current !== value) editorRef.current.setValue(value);
//   }, [value]);

//   return (
//     <div ref={containerRef} style={{ width: "100%", height: "100%" }} className="monaco-container">
//       {!loaded && (
//         <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
//           <div className="flex items-center gap-3 text-zinc-400">
//             <div className="w-4 h-4 border-2 border-zinc-600 border-t-violet-400 rounded-full animate-spin" />
//             <span className="text-sm font-mono">Loading editor…</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Difficulty Badge
// function DifficultyBadge({ level }) {
//   const styles = {
//     Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
//     Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
//     Hard: "text-rose-400 bg-rose-400/10 border-rose-400/20",
//   };
//   return (
//     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[level]}`}>
//       {level}
//     </span>
//   );
// }

// // Tag chip
// function Tag({ label }) {
//   return (
//     <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/50">
//       {label}
//     </span>
//   );
// }

// // Top nav
// function TopNav({ language, setLanguage, onRun, onSubmit, running, submitting }) {
//   return (
//     <header className="h-12 bg-[#0d0d0f] border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
//       <div className="flex items-center gap-3">
//         <div className="flex items-center gap-1.5">
//           <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
//           <span className="text-sm font-bold text-white tracking-tight">CodeArena</span>
//         </div>
//         <span className="text-zinc-700 text-xs">|</span>
//         <span className="text-zinc-500 text-xs">Problems</span>
//         <span className="text-zinc-700">/</span>
//         <span className="text-zinc-300 text-xs">{PROBLEM.title}</span>
//       </div>

//       <div className="flex items-center gap-2">
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="h-7 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-md px-2.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-violet-500 transition-colors"
//           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2371717a'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
//         >
//           {Object.entries(LANG_CONFIG).map(([key, cfg]) => (
//             <option key={key} value={key}>{cfg.label}</option>
//           ))}
//         </select>

//         <button
//           onClick={onRun}
//           disabled={running || submitting}
//           className="h-7 px-3 text-xs font-medium rounded-md border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
//         >
//           {running ? (
//             <><div className="w-3 h-3 border border-zinc-500 border-t-zinc-300 rounded-full animate-spin" /> Running…</>
//           ) : (
//             <><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg> Run Code</>
//           )}
//         </button>

//         <button
//           onClick={onSubmit}
//           disabled={running || submitting}
//           className="h-7 px-3 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
//         >
//           {submitting ? (
//             <><div className="w-3 h-3 border border-violet-300 border-t-white rounded-full animate-spin" /> Submitting…</>
//           ) : (
//             <>Submit</>
//           )}
//         </button>
//       </div>
//     </header>
//   );
// }

// // Problem panel
// function ProblemPanel() {
//   return (
//     <div className="flex flex-col h-full overflow-auto bg-[#111113]">
//       <div className="p-5 border-b border-zinc-800">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-zinc-500 text-xs font-mono">#1</span>
//           <DifficultyBadge level={PROBLEM.difficulty} />
//         </div>
//         <h1 className="text-lg font-bold text-white mt-2 mb-3">{PROBLEM.title}</h1>
//         <div className="flex flex-wrap gap-1.5">
//           {PROBLEM.tags.map(t => <Tag key={t} label={t} />)}
//         </div>
//       </div>

//       <div className="p-5 flex-1 overflow-auto">
//         <div
//           className="text-sm text-zinc-300 leading-relaxed mb-6 problem-desc"
//           dangerouslySetInnerHTML={{ __html: PROBLEM.description }}
//         />

//         <div className="mb-6">
//           {PROBLEM.examples.map((ex, i) => (
//             <div key={i} className="mb-4">
//               <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Example {i + 1}</p>
//               <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono">
//                 <div className="mb-1.5">
//                   <span className="text-zinc-500">Input: </span>
//                   <span className="text-zinc-200">{ex.input}</span>
//                 </div>
//                 <div className="mb-1.5">
//                   <span className="text-zinc-500">Output: </span>
//                   <span className="text-emerald-400">{ex.output}</span>
//                 </div>
//                 {ex.explanation && (
//                   <div className="text-zinc-500 mt-2 pt-2 border-t border-zinc-800">
//                     <span className="text-zinc-600">Explanation: </span>{ex.explanation}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div>
//           <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">Constraints</p>
//           <ul className="space-y-1.5">
//             {PROBLEM.constraints.map((c, i) => (
//               <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-mono">
//                 <span className="text-zinc-600 mt-0.5">•</span>
//                 <span>{c}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Test case result row
// function TestCaseResult({ result }) {
//   const statusColor = result.passed
//     ? "text-emerald-400"
//     : "text-rose-400";
//   const icon = result.passed
//     ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#10b981" /><path d="M4 7l2.5 2.5L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
//     : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#f43f5e" /><path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>;

//   return (
//     <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg overflow-hidden">
//       <div className={`flex items-center justify-between px-3 py-2 border-b border-zinc-800 ${result.passed ? "bg-emerald-500/5" : "bg-rose-500/5"}`}>
//         <div className="flex items-center gap-2">
//           {icon}
//           <span className={`text-xs font-semibold ${statusColor}`}>
//             Case {result.id} — {result.passed ? "Passed" : "Wrong Answer"}
//           </span>
//         </div>
//         <div className="flex items-center gap-3 text-xs text-zinc-500">
//           <span>{result.runtime}</span>
//           <span>{result.memory}</span>
//         </div>
//       </div>
//       <div className="p-3 grid grid-cols-1 gap-2 text-xs font-mono">
//         <div>
//           <span className="text-zinc-500 block mb-0.5">Input</span>
//           <span className="text-zinc-300 whitespace-pre">{result.input}</span>
//         </div>
//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <span className="text-zinc-500 block mb-0.5">Expected</span>
//             <span className="text-emerald-400">{result.expected}</span>
//           </div>
//           <div>
//             <span className="text-zinc-500 block mb-0.5">Output</span>
//             <span className={result.passed ? "text-emerald-400" : "text-rose-400"}>{result.actual}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Bottom panel: test cases + console
// function BottomPanel({ testResults, consoleState, activeTestCase, setActiveTestCase, running }) {
//   const [tab, setTab] = useState("testcases");

//   return (
//     <div className="flex flex-col h-full bg-[#0f0f11] border-t border-zinc-800">
//       <div className="flex items-center gap-0 px-3 pt-2.5 border-b border-zinc-800 shrink-0">
//         {["testcases", "console"].map(t => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`px-3 pb-2 text-xs font-medium transition-colors relative ${
//               tab === t
//                 ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-violet-500 after:rounded-t"
//                 : "text-zinc-500 hover:text-zinc-300"
//             }`}
//           >
//             {t === "testcases" ? "Test Cases" : "Console"}
//             {t === "testcases" && testResults && (
//               <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
//                 testResults.every(r => r.passed) ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
//               }`}>
//                 {testResults.filter(r => r.passed).length}/{testResults.length}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       <div className="flex-1 overflow-auto p-3">
//         {tab === "testcases" && (
//           <div>
//             {!testResults && !running && (
//               <div>
//                 <div className="flex gap-1.5 mb-3">
//                   {TEST_CASES.map(tc => (
//                     <button
//                       key={tc.id}
//                       onClick={() => setActiveTestCase(tc.id)}
//                       className={`px-3 py-1.5 text-xs rounded-md font-medium border transition-all ${
//                         activeTestCase === tc.id
//                           ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
//                           : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-300"
//                       }`}
//                     >
//                       Case {tc.id}
//                     </button>
//                   ))}
//                 </div>
//                 {TEST_CASES.filter(tc => tc.id === activeTestCase).map(tc => (
//                   <div key={tc.id} className="space-y-2">
//                     <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg p-3">
//                       <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Input</p>
//                       <pre className="text-xs text-zinc-300 font-mono">{tc.input}</pre>
//                     </div>
//                     <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg p-3">
//                       <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Expected Output</p>
//                       <pre className="text-xs text-emerald-400 font-mono">{tc.expected}</pre>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {running && (
//               <div className="flex items-center gap-3 text-zinc-400 py-4">
//                 <div className="w-4 h-4 border-2 border-zinc-700 border-t-violet-400 rounded-full animate-spin" />
//                 <span className="text-xs">Running test cases…</span>
//               </div>
//             )}

//             {testResults && !running && (
//               <div className="space-y-2">
//                 {testResults.map(r => <TestCaseResult key={r.id} result={r} />)}
//               </div>
//             )}
//           </div>
//         )}

//         {tab === "console" && (
//           <div>
//             {consoleState.status === "idle" && (
//               <p className="text-xs text-zinc-600 italic py-2">Run your code to see output here.</p>
//             )}
//             {consoleState.status === "loading" && (
//               <div className="flex items-center gap-2 text-zinc-400 py-2">
//                 <div className="w-3 h-3 border border-zinc-600 border-t-violet-400 rounded-full animate-spin" />
//                 <span className="text-xs font-mono">Executing…</span>
//               </div>
//             )}
//             {consoleState.status === "success" && (
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 mb-2">
//                   <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#10b981"/><path d="M3.5 6l2 2L8.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                   <span className="text-xs text-emerald-400 font-semibold">Accepted</span>
//                   <span className="text-xs text-zinc-600">·</span>
//                   <span className="text-xs text-zinc-500">{consoleState.runtime}</span>
//                   <span className="text-xs text-zinc-500">{consoleState.memory}</span>
//                 </div>
//                 <pre className="text-xs font-mono text-zinc-300 bg-[#1a1a1d] rounded-lg p-3 border border-zinc-800 whitespace-pre-wrap">{consoleState.output}</pre>
//               </div>
//             )}
//             {consoleState.status === "error" && (
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#f43f5e"/><path d="M4 4l4 4M8 4l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                   <span className="text-xs text-rose-400 font-semibold">Runtime Error</span>
//                 </div>
//                 <pre className="text-xs font-mono text-rose-300 bg-rose-500/5 rounded-lg p-3 border border-rose-500/20 whitespace-pre-wrap">{consoleState.error}</pre>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Resize handle
// function ResizeHandle({ onMouseDown, horizontal = false }) {
//   return (
//     <div
//       onMouseDown={onMouseDown}
//       className={`${horizontal ? "h-1.5 w-full cursor-row-resize" : "w-1.5 h-full cursor-col-resize"} bg-zinc-800 hover:bg-violet-500/50 transition-colors shrink-0 group`}
//     >
//       <div className={`${horizontal ? "h-px w-8 mx-auto mt-0.5" : "w-px h-8 my-auto ml-0.5"} bg-zinc-600 group-hover:bg-violet-400 transition-colors rounded-full`} />
//     </div>
//   );
// }

// // Main App
// export default function CodeArena() {
//   const [language, setLanguage] = useState("javascript");
//   const [code, setCode] = useState(() => localStorage.getItem("codearena_code_javascript") || STARTER_CODE.javascript);
//   const [running, setRunning] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [testResults, setTestResults] = useState(null);
//   const [activeTestCase, setActiveTestCase] = useState(1);
//   const [consoleState, setConsoleState] = useState({ status: "idle" });
//   const [splitPos, setSplitPos] = useState(42); // % for left panel
//   const [bottomHeight, setBottomHeight] = useState(240); // px
//   const [fullscreen, setFullscreen] = useState(false);
//   const containerRef = useRef(null);

//   // Language change
//   const handleLanguageChange = useCallback((lang) => {
//     const saved = localStorage.getItem(`codearena_code_${lang}`);
//     setCode(saved || STARTER_CODE[lang]);
//     setLanguage(lang);
//   }, []);

//   // Auto-save
//   useEffect(() => {
//     localStorage.setItem(`codearena_code_${language}`, code);
//   }, [code, language]);

//   // Horizontal resize
//   const handleSplitDrag = useCallback((e) => {
//     e.preventDefault();
//     const container = containerRef.current;
//     if (!container) return;
//     const startX = e.clientX;
//     const startPct = splitPos;
//     const onMove = (me) => {
//       const rect = container.getBoundingClientRect();
//       const pct = ((me.clientX - rect.left) / rect.width) * 100;
//       setSplitPos(Math.min(70, Math.max(25, pct)));
//     };
//     const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//   }, [splitPos]);

//   // Vertical resize
//   const handleBottomDrag = useCallback((e) => {
//     e.preventDefault();
//     const startY = e.clientY;
//     const startH = bottomHeight;
//     const onMove = (me) => {
//       const delta = startY - me.clientY;
//       setBottomHeight(Math.min(420, Math.max(120, startH + delta)));
//     };
//     const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//   }, [bottomHeight]);

//   const handleRun = async () => {
//     setRunning(true);
//     setTestResults(null);
//     setConsoleState({ status: "loading" });
//     try {
//       const results = await runTestCases(code, language, TEST_CASES);
//       setTestResults(results);
//       const allPassed = results.every(r => r.passed);
//       setConsoleState({
//         status: allPassed ? "success" : "error",
//         output: results.map(r => `Case ${r.id}: ${r.passed ? "✓" : "✗"}  Output: ${r.actual}`).join("\n"),
//         error: !allPassed ? results.filter(r => !r.passed).map(r => `Case ${r.id}: Expected ${r.expected}, got ${r.actual}`).join("\n") : null,
//         runtime: results[0]?.runtime,
//         memory: results[0]?.memory,
//       });
//     } finally {
//       setRunning(false);
//     }
//   };

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     setTestResults(null);
//     setConsoleState({ status: "loading" });
//     try {
//       const results = await runTestCases(code, language, TEST_CASES);
//       setTestResults(results);
//       const allPassed = results.every(r => r.passed);
//       setConsoleState({
//         status: allPassed ? "success" : "error",
//         output: allPassed ? `All ${results.length} test cases passed!\nRuntime: ${results[0]?.runtime}\nMemory: ${results[0]?.memory}` : "",
//         error: !allPassed ? `${results.filter(r => !r.passed).length} test case(s) failed.\n\n` + results.filter(r => !r.passed).map(r => `Case ${r.id}:\n  Input: ${r.input}\n  Expected: ${r.expected}\n  Got: ${r.actual}`).join("\n\n") : null,
//         runtime: results[0]?.runtime,
//         memory: results[0]?.memory,
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const editorHeight = `calc(100% - ${bottomHeight}px - 6px)`;

//   return (
//     <div className="flex flex-col h-screen bg-[#0a0a0c] text-white select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
//       <style>{`
//         .inline-code { background: #2a2a2e; color: #a78bfa; padding: 1px 5px; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
//         .problem-desc strong { color: #e4e4e7; }
//         .problem-desc em { color: #a1a1aa; }
//         .monaco-container .overflow-guard { border-radius: 0 !important; }
//         * { scrollbar-width: thin; scrollbar-color: #27272a transparent; }
//         ::-webkit-scrollbar { width: 4px; height: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 99px; }
//       `}</style>

//       <TopNav
//         language={language}
//         setLanguage={handleLanguageChange}
//         onRun={handleRun}
//         onSubmit={handleSubmit}
//         running={running}
//         submitting={submitting}
//       />

//       {/* Main split layout */}
//       <div ref={containerRef} className="flex flex-1 overflow-hidden">
//         {/* Left: Problem */}
//         <div style={{ width: `${splitPos}%`, minWidth: 280 }} className="flex flex-col overflow-hidden">
//           <ProblemPanel />
//         </div>

//         {/* Vertical divider */}
//         <ResizeHandle onMouseDown={handleSplitDrag} />

//         {/* Right: Editor + bottom panel */}
//         <div className="flex flex-col flex-1 overflow-hidden">
//           {/* Editor area */}
//           <div style={{ height: editorHeight }} className="overflow-hidden">
//             {/* Editor top bar */}
//             <div className="h-9 bg-[#141416] border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-zinc-700" />
//                 <span className="text-xs text-zinc-500 font-mono">
//                   solution.{LANG_CONFIG[language].ext}
//                 </span>
//               </div>
//               <button
//                 onClick={() => {
//                   const saved = STARTER_CODE[language];
//                   setCode(saved);
//                 }}
//                 className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-0.5 rounded hover:bg-zinc-800"
//               >
//                 Reset
//               </button>
//             </div>
//             <div style={{ height: "calc(100% - 36px)" }}>
//               <MonacoEditor
//                 value={code}
//                 onChange={setCode}
//                 language={language}
//               />
//             </div>
//           </div>

//           {/* Resize handle */}
//           <ResizeHandle onMouseDown={handleBottomDrag} horizontal />

//           {/* Bottom panel */}
//           <div style={{ height: bottomHeight }} className="overflow-hidden">
//             <BottomPanel
//               testResults={testResults}
//               consoleState={consoleState}
//               activeTestCase={activeTestCase}
//               setActiveTestCase={setActiveTestCase}
//               running={running}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//=============================

import { useState, useRef } from "react";

const candidate = {
  name: "Priya Sharma",
  email: "priya.sharma@gmail.com",
  role: "Frontend Developer",
  experience: "2.5 years",
  status: "Shortlisted",
  avatar: "PS",
};

const mcqTopics = [
  "HTML", "CSS", "JavaScript", "React", "Node.js",
  "Aptitude", "DBMS", "OOPs", "Operating System",
];

const difficultyConfig = [
  { label: "Easy", color: "emerald", questions: 10, duration: "10 min", topics: ["HTML", "CSS", "Aptitude"] },
  { label: "Medium", color: "amber", questions: 20, duration: "25 min", topics: ["JavaScript", "React", "OOPs"] },
  { label: "Hard", color: "rose", questions: 15, duration: "25 min", topics: ["Node.js", "DBMS", "OS"] },
];

const interviewQuestions = [
  { id: 1, text: "Tell us about yourself and your journey so far.", duration: "3 min" },
  { id: 2, text: "Why should we hire you for this position?", duration: "3 min" },
  { id: 3, text: "Walk us through your most impactful project.", duration: "5 min" },
  { id: 4, text: "How did you solve a challenging technical problem recently?", duration: "4 min" },
  { id: 5, text: "Describe a situation where you handled conflict in a team.", duration: "3 min" },
];

const ToggleSwitch = ({ checked, onChange, id }) => (
  <button
    role="switch"
    aria-checked={checked}
    id={id}
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

const LevelCard = ({ level, icon, title, desc, duration, active, complete, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 min-w-0 text-left p-4 rounded-2xl border-2 transition-all duration-200 group ${
      active
        ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
        : "border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-slate-100"
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl transition-transform duration-200 group-hover:scale-110 ${active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
      {icon}
    </div>
    <div className={`text-xs font-semibold mb-1 ${active ? "text-indigo-500" : "text-slate-400"}`}>LEVEL {level}</div>
    <div className={`font-semibold text-sm mb-1 ${active ? "text-indigo-900" : "text-slate-700"}`}>{title}</div>
    <div className="text-xs text-slate-400 mb-3 leading-relaxed">{desc}</div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">⏱ {duration}</span>
      {complete && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Configured</span>}
    </div>
  </button>
);

const DifficultyCard = ({ config, selected, onToggle }) => {
  const colors = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
    amber: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700", dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700" },
    rose: { bg: "bg-rose-50", border: "border-rose-300", text: "text-rose-700", dot: "bg-rose-400", badge: "bg-rose-100 text-rose-700" },
  };
  const c = colors[config.color];
  return (
    <button
      onClick={onToggle}
      className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${selected ? `${c.bg} ${c.border} shadow-md` : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${c.dot}`} />
        <span className={`text-sm font-semibold ${selected ? c.text : "text-slate-600"}`}>{config.label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1">{config.questions}</div>
      <div className="text-xs text-slate-400 mb-3">questions · {config.duration}</div>
      <div className="flex flex-wrap gap-1">
        {config.topics.map(t => (
          <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected ? c.badge : "bg-slate-100 text-slate-500"}`}>{t}</span>
        ))}
      </div>
    </button>
  );
};

const QuestionCard = ({ q, onDelete }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group">
    <div className="mt-1 cursor-grab text-slate-300 group-hover:text-slate-400">
      <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor">
        <circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/>
        <circle cx="4" cy="9" r="1.5"/><circle cx="10" cy="9" r="1.5"/>
        <circle cx="4" cy="14" r="1.5"/><circle cx="10" cy="14" r="1.5"/>
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-700 leading-relaxed">{q.text}</p>
      <span className="mt-2 inline-flex text-xs text-slate-400 items-center gap-1">⏱ {q.duration}</span>
    </div>
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 text-xs transition-colors">✎</button>
      <button onClick={() => onDelete(q.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 text-xs transition-colors">✕</button>
    </div>
  </div>
);

const SectionLabel = ({ children }) => (
  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{children}</div>
);

const FormRow = ({ label, children, htmlFor }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
    <label htmlFor={htmlFor} className="text-sm text-slate-600 font-medium">{label}</label>
    <div className="flex items-center gap-3">{children}</div>
  </div>
);

export default function SendTestLinkModal() {
  const [open, setOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState(1);
  const [selectedDifficulties, setSelectedDifficulties] = useState(["Medium"]);
  const [selectedTopics, setSelectedTopics] = useState(["HTML", "CSS", "JavaScript", "React"]);
  const [questions, setQuestions] = useState(interviewQuestions);
  const [toggles, setToggles] = useState({
    webcam: true, mic: true, randomize: true, negMarking: false,
    sectionTimer: false, codingRound: false, recordResponse: true,
    cameraPermission: true, screenShare: false, aiProctor: true, autoReminder: true,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [totalQ, setTotalQ] = useState(30);
  const [timer, setTimer] = useState(45);
  const [l1Duration, setL1Duration] = useState(10);
  const [l3Duration, setL3Duration] = useState(30);
  const [retry, setRetry] = useState(1);
  const [instructions, setInstructions] = useState("Please introduce yourself clearly. Speak about your background, skills, and career goals.");
  const [expiry, setExpiry] = useState("2025-02-28");
  const [language, setLanguage] = useState("English");
  const testLink = "https://assess.hire.io/t/s7k2p9x?token=eyJhbGciOiJIUzI1NiJ9";
  const configuredLevels = [true, true, true];

  const toggleDifficulty = (label) => {
    setSelectedDifficulties(prev =>
      prev.includes(label) ? prev.filter(d => d !== label) : [...prev, label]
    );
  };

  const toggleTopic = (t) => {
    setSelectedTopics(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const setToggle = (key, val) => setToggles(prev => ({ ...prev, [key]: val }));

  const deleteQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id));

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setTimeout(() => setSent(false), 3000); }, 2000);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-6 font-sans">
      {/* Trigger */}
      {!open && (
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">PS</div>
              <div className="text-left">
                <div className="font-semibold text-slate-800 text-sm">Priya Sharma</div>
                <div className="text-xs text-slate-400">Frontend Developer · Shortlisted</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-200 text-sm"
          >
            📤 Send Test Link
          </button>
          <div className="mt-4 text-xs text-slate-400">Click to open the assessment configuration modal</div>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal container */}
          <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-slate-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-7 py-5 bg-white border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Send Assessment Test</h2>
                <p className="text-sm text-slate-400 mt-0.5">Configure candidate evaluation process</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all text-lg"
              >✕</button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 px-7 py-6 space-y-6">

              {/* Candidate Info */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                  {candidate.avatar}
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1">
                  <div className="col-span-2 sm:col-span-1">
                    <div className="font-bold text-slate-900 text-base">{candidate.name}</div>
                    <div className="text-xs text-slate-400">{candidate.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-0.5">Role</div>
                    <div className="text-sm font-medium text-slate-700">{candidate.role}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-0.5">Experience</div>
                    <div className="text-sm font-medium text-slate-700">{candidate.experience}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-0.5">Status</div>
                    <span className="inline-flex text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">{candidate.status}</span>
                  </div>
                </div>
              </div>

              {/* Level Selector */}
              <div>
                <SectionLabel>Select Test Level</SectionLabel>
                <div className="flex flex-col sm:flex-row gap-3">
                  <LevelCard level={1} icon="🎙" title="Communication & Introduction" desc="Self-intro, verbal fluency, confidence" duration="10–15 min" active={activeLevel === 1} complete={configuredLevels[0]} onClick={() => setActiveLevel(1)} />
                  <LevelCard level={2} icon="📝" title="MCQ Assessment" desc="Technical & aptitude quiz" duration="30–45 min" active={activeLevel === 2} complete={configuredLevels[1]} onClick={() => setActiveLevel(2)} />
                  <LevelCard level={3} icon="🎥" title="Video Interview Round" desc="Live structured interview" duration="20–30 min" active={activeLevel === 3} complete={configuredLevels[2]} onClick={() => setActiveLevel(3)} />
                </div>
              </div>

              {/* ── Level 1 ── */}
              {activeLevel === 1 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <SectionLabel>Level 1 — Communication Test</SectionLabel>
                    <div className="flex gap-2">
                      <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">✦ AI Evaluation</span>
                      <span className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-semibold">🎙 Audio/Video</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Duration (minutes)</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={5} max={30} step={5} value={l1Duration} onChange={e => setL1Duration(+e.target.value)} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 w-16 text-right">{l1Duration} min</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Language</label>
                      <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700">
                        <option>English</option><option>Hindi</option><option>Bengali</option><option>Tamil</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Instructions to Candidate</label>
                    <textarea
                      value={instructions}
                      onChange={e => setInstructions(e.target.value)}
                      rows={3}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
                    <FormRow label="Enable Webcam" htmlFor="t-webcam">
                      <ToggleSwitch checked={toggles.webcam} onChange={v => setToggle("webcam", v)} id="t-webcam" />
                    </FormRow>
                    <FormRow label="Enable Microphone" htmlFor="t-mic">
                      <ToggleSwitch checked={toggles.mic} onChange={v => setToggle("mic", v)} id="t-mic" />
                    </FormRow>
                  </div>
                </div>
              )}

              {/* ── Level 2 ── */}
              {activeLevel === 2 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                  <SectionLabel>Level 2 — MCQ Assessment</SectionLabel>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-3">Difficulty Level</div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {difficultyConfig.map(d => (
                        <DifficultyCard key={d.label} config={d} selected={selectedDifficulties.includes(d.label)} onToggle={() => toggleDifficulty(d.label)} />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Total Questions</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={10} max={60} step={5} value={totalQ} onChange={e => setTotalQ(+e.target.value)} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 w-10 text-right">{totalQ}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Timer (minutes)</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={15} max={90} step={5} value={timer} onChange={e => setTimer(+e.target.value)} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 w-16 text-right">{timer} min</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-3">Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {mcqTopics.map(t => (
                        <button
                          key={t}
                          onClick={() => toggleTopic(t)}
                          className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-all duration-150 ${selectedTopics.includes(t) ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"}`}
                        >{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
                    {[
                      ["randomize", "Randomize Questions"],
                      ["negMarking", "Negative Marking"],
                      ["sectionTimer", "Section-wise Timer"],
                      ["codingRound", "Include Coding Round (optional)"],
                    ].map(([k, l]) => (
                      <FormRow key={k} label={l} htmlFor={`t-${k}`}>
                        <ToggleSwitch checked={toggles[k]} onChange={v => setToggle(k, v)} id={`t-${k}`} />
                      </FormRow>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Level 3 ── */}
              {activeLevel === 3 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                  <SectionLabel>Level 3 — Video Interview Round</SectionLabel>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Interview Duration</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={10} max={60} step={5} value={l3Duration} onChange={e => setL3Duration(+e.target.value)} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 w-16 text-right">{l3Duration} min</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Max Retry Attempts</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={3} step={1} value={retry} onChange={e => setRetry(+e.target.value)} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 w-10 text-right">{retry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
                    {[
                      ["recordResponse", "Record Candidate Response"],
                      ["cameraPermission", "Camera Permission Required"],
                      ["screenShare", "Enable Screen Sharing"],
                      ["aiProctor", "AI Proctoring"],
                    ].map(([k, l]) => (
                      <FormRow key={k} label={l} htmlFor={`t-${k}`}>
                        {k === "aiProctor" && toggles.aiProctor && (
                          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">✦ Active</span>
                        )}
                        <ToggleSwitch checked={toggles[k]} onChange={v => setToggle(k, v)} id={`t-${k}`} />
                      </FormRow>
                    ))}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-3">Interview Questions
                      <span className="ml-2 text-slate-300 font-normal normal-case text-xs">drag to reorder</span>
                    </div>
                    <div className="space-y-2">
                      {questions.map(q => <QuestionCard key={q.id} q={q} onDelete={deleteQuestion} />)}
                    </div>
                    <button className="mt-3 w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all duration-200">
                      + Add Question
                    </button>
                  </div>
                </div>
              )}

              {/* ── Email & Link ── */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <SectionLabel>Email & Link Configuration</SectionLabel>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Candidate Email</label>
                    <input
                      type="email"
                      defaultValue={candidate.email}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Link Expiry</label>
                    <input
                      type="date"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
                    />
                  </div>
                </div>

                <FormRow label="Auto Reminder (24h before expiry)" htmlFor="t-reminder">
                  <ToggleSwitch checked={toggles.autoReminder} onChange={v => setToggle("autoReminder", v)} id="t-reminder" />
                </FormRow>

                {/* Email preview */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Email Preview</div>
                  <div className="bg-white rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">H</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-700">HirePlatform Assessment</div>
                        <div className="text-xs text-slate-400">noreply@hire.io → {candidate.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed">
                      Hi <span className="font-semibold">{candidate.name.split(" ")[0]}</span>, 👋<br />
                      <span className="text-slate-500">You've been shortlisted for the <strong>{candidate.role}</strong> position. Please complete your assessment by <strong>{expiry}</strong>.</span>
                    </div>
                  </div>
                </div>

                {/* Test link */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Secure Test Link</div>
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-mono truncate">
                      {testLink}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${copied ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Footer ── */}
            <div className="px-7 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3 shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="sm:order-1 px-5 py-2.5 rounded-2xl text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 font-medium"
              >Cancel</button>

              <div className="flex gap-2 sm:order-2">
                <button className="px-5 py-2.5 rounded-2xl text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-200 font-medium">
                  Save Draft
                </button>
                <button className="px-5 py-2.5 rounded-2xl text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 font-medium">
                  Preview Test
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className={`relative px-6 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all duration-300 min-w-[140px] overflow-hidden shadow-lg ${
                    sent
                      ? "bg-emerald-500 shadow-emerald-200"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 shadow-indigo-300"
                  } ${sending ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  {sending ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                      </svg>
                      Sending…
                    </span>
                  ) : sent ? "✓ Sent!" : "📤 Send Test Link"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}