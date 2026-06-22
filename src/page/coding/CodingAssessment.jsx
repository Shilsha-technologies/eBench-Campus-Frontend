// import { useState, useEffect, useRef, useCallback } from "react";

// // Monaco Editor loader
// const MONACO_CDN = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs";

// const PROBLEM = {
//     id: 1,
//     title: "Two Sum",
//     difficulty: "Easy",
//     tags: ["Array", "Hash Table"],
//     description: `Given an array of integers <code class="inline-code">nums</code> and an integer <code class="inline-code">target</code>, return <em>indices of the two numbers such that they add up to target</em>.

// You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.

// You can return the answer in any order.`,
//     constraints: [
//         "2 ≤ nums.length ≤ 10⁴",
//         "-10⁹ ≤ nums[i] ≤ 10⁹",
//         "-10⁹ ≤ target ≤ 10⁹",
//         "Only one valid answer exists.",
//     ],
//     examples: [
//         {
//             input: "nums = [2,7,11,15], target = 9",
//             output: "[0,1]",
//             explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
//         },
//         {
//             input: "nums = [3,2,4], target = 6",
//             output: "[1,2]",
//             explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
//         },
//         {
//             input: "nums = [3,3], target = 6",
//             output: "[0,1]",
//             explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
//         },
//     ],
// };

// const TEST_CASES = [
//     { id: 1, input: "nums = [2,7,11,15]\ntarget = 9", expected: "[0,1]" },
//     { id: 2, input: "nums = [3,2,4]\ntarget = 6", expected: "[1,2]" },
//     { id: 3, input: "nums = [3,3]\ntarget = 6", expected: "[0,1]" },
// ];

// const STARTER_CODE = {
//     javascript: `/**
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
//     python: `class Solution:
//     def twoSum(self, nums: List[int], target: int) -> List[int]:
//         seen = {}
//         for i, num in enumerate(nums):
//             complement = target - num
//             if complement in seen:
//                 return [seen[complement], i]
//             seen[num] = i
//         return []`,
//     java: `class Solution {
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
//     cpp: `class Solution {
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
//     javascript: { label: "JavaScript", monaco: "javascript", ext: "js" },
//     python: { label: "Python", monaco: "python", ext: "py" },
//     java: { label: "Java", monaco: "java", ext: "java" },
//     cpp: { label: "C++", monaco: "cpp", ext: "cpp" },
// };

// // Simulated test runner
// function runTestCases(code, lang, testCases) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const results = testCases.map((tc) => {
//                 const passed = Math.random() > 0.2;
//                 return {
//                     id: tc.id,
//                     input: tc.input,
//                     expected: tc.expected,
//                     actual: passed ? tc.expected : "[0,2]",
//                     passed,
//                     runtime: Math.floor(Math.random() * 80 + 20) + " ms",
//                     memory: (Math.random() * 2 + 40).toFixed(1) + " MB",
//                 };
//             });
//             resolve(results);
//         }, 1400);
//     });
// }

// // Monaco Editor Component
// function MonacoEditor({ value, onChange, language, theme = "vs-dark" }) {
//     const containerRef = useRef(null);
//     const editorRef = useRef(null);
//     const monacoRef = useRef(null);
//     const [loaded, setLoaded] = useState(false);

//     useEffect(() => {
//         let cancelled = false;
//         function loadMonaco() {
//             if (window.monaco) { initEditor(); return; }
//             const script = document.createElement("script");
//             script.src = `${MONACO_CDN}/loader.js`;
//             script.onload = () => {
//                 window.require.config({ paths: { vs: MONACO_CDN } });
//                 window.require(["vs/editor/editor.main"], (monaco) => {
//                     if (!cancelled) { monacoRef.current = monaco; initEditor(); }
//                 });
//             };
//             document.head.appendChild(script);
//         }

//         function initEditor() {
//             if (!containerRef.current || editorRef.current) return;
//             const monaco = monacoRef.current || window.monaco;
//             if (!monaco) return;

//             const editor = monaco.editor.create(containerRef.current, {
//                 value,
//                 language: LANG_CONFIG[language]?.monaco || language,
//                 theme,
//                 fontSize: 14,
//                 fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
//                 lineHeight: 22,
//                 minimap: { enabled: false },
//                 scrollBeyondLastLine: false,
//                 renderLineHighlight: "line",
//                 cursorStyle: "line",
//                 cursorBlinking: "smooth",
//                 smoothScrolling: true,
//                 wordWrap: "on",
//                 padding: { top: 16, bottom: 16 },
//                 suggest: { showKeywords: true },
//                 overviewRulerLanes: 0,
//                 hideCursorInOverviewRuler: true,
//                 scrollbar: {
//                     verticalScrollbarSize: 6,
//                     horizontalScrollbarSize: 6,
//                 },
//                 bracketPairColorization: { enabled: true },
//             });

//             editorRef.current = editor;
//             editor.onDidChangeModelContent(() => onChange(editor.getValue()));
//             setLoaded(true);
//         }

//         loadMonaco();
//         return () => { cancelled = true; };
//     }, []);

//     useEffect(() => {
//         if (!editorRef.current) return;
//         const monaco = monacoRef.current || window.monaco;
//         if (!monaco) return;
//         const model = editorRef.current.getModel();
//         if (model) monaco.editor.setModelLanguage(model, LANG_CONFIG[language]?.monaco || language);
//     }, [language]);

//     useEffect(() => {
//         if (!editorRef.current) return;
//         const current = editorRef.current.getValue();
//         if (current !== value) editorRef.current.setValue(value);
//     }, [value]);

//     return (
//         <div ref={containerRef} style={{ width: "100%", height: "100%" }} className="monaco-container">
//             {!loaded && (
//                 <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
//                     <div className="flex items-center gap-3 text-zinc-400">
//                         <div className="w-4 h-4 border-2 border-zinc-600 border-t-violet-400 rounded-full animate-spin" />
//                         <span className="text-sm font-mono">Loading editor…</span>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // Difficulty Badge
// function DifficultyBadge({ level }) {
//     const styles = {
//         Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
//         Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
//         Hard: "text-rose-400 bg-rose-400/10 border-rose-400/20",
//     };
//     return (
//         <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[level]}`}>
//             {level}
//         </span>
//     );
// }

// // Tag chip
// function Tag({ label }) {
//     return (
//         <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/50">
//             {label}
//         </span>
//     );
// }

// // Top nav
// function TopNav({ language, setLanguage, onRun, onSubmit, running, submitting }) {
//     return (
//         <header className="h-12 bg-[#0d0d0f] border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
//             <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-1.5">
//                     <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
//                     <span className="text-sm font-bold text-white tracking-tight">CodeArena</span>
//                 </div>
//                 <span className="text-zinc-700 text-xs">|</span>
//                 <span className="text-zinc-500 text-xs">Problems</span>
//                 <span className="text-zinc-700">/</span>
//                 <span className="text-zinc-300 text-xs">{PROBLEM.title}</span>
//             </div>

//             <div className="flex items-center gap-2">
//                 <select
//                     value={language}
//                     onChange={(e) => setLanguage(e.target.value)}
//                     className="h-7 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-md px-2.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-violet-500 transition-colors"
//                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2371717a'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
//                 >
//                     {Object.entries(LANG_CONFIG).map(([key, cfg]) => (
//                         <option key={key} value={key}>{cfg.label}</option>
//                     ))}
//                 </select>

//                 <button
//                     onClick={onRun}
//                     disabled={running || submitting}
//                     className="h-7 px-3 text-xs font-medium rounded-md border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
//                 >
//                     {running ? (
//                         <><div className="w-3 h-3 border border-zinc-500 border-t-zinc-300 rounded-full animate-spin" /> Running…</>
//                     ) : (
//                         <><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z" /></svg> Run Code</>
//                     )}
//                 </button>

//                 <button
//                     onClick={onSubmit}
//                     disabled={running || submitting}
//                     className="h-7 px-3 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
//                 >
//                     {submitting ? (
//                         <><div className="w-3 h-3 border border-violet-300 border-t-white rounded-full animate-spin" /> Submitting…</>
//                     ) : (
//                         <>Submit</>
//                     )}
//                 </button>
//             </div>
//         </header>
//     );
// }

// // Problem panel
// function ProblemPanel() {
//     return (
//         <div className="flex flex-col h-full overflow-auto bg-[#111113]">
//             <div className="p-5 border-b border-zinc-800">
//                 <div className="flex items-center gap-2 mb-1">
//                     <span className="text-zinc-500 text-xs font-mono">#1</span>
//                     <DifficultyBadge level={PROBLEM.difficulty} />
//                 </div>
//                 <h1 className="text-lg font-bold text-white mt-2 mb-3">{PROBLEM.title}</h1>
//                 <div className="flex flex-wrap gap-1.5">
//                     {PROBLEM.tags.map(t => <Tag key={t} label={t} />)}
//                 </div>
//             </div>

//             <div className="p-5 flex-1 overflow-auto">
//                 <div
//                     className="text-sm text-zinc-300 leading-relaxed mb-6 problem-desc"
//                     dangerouslySetInnerHTML={{ __html: PROBLEM.description }}
//                 />

//                 <div className="mb-6">
//                     {PROBLEM.examples.map((ex, i) => (
//                         <div key={i} className="mb-4">
//                             <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Example {i + 1}</p>
//                             <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg p-3.5 text-xs font-mono">
//                                 <div className="mb-1.5">
//                                     <span className="text-zinc-500">Input: </span>
//                                     <span className="text-zinc-200">{ex.input}</span>
//                                 </div>
//                                 <div className="mb-1.5">
//                                     <span className="text-zinc-500">Output: </span>
//                                     <span className="text-emerald-400">{ex.output}</span>
//                                 </div>
//                                 {ex.explanation && (
//                                     <div className="text-zinc-500 mt-2 pt-2 border-t border-zinc-800">
//                                         <span className="text-zinc-600">Explanation: </span>{ex.explanation}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div>
//                     <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">Constraints</p>
//                     <ul className="space-y-1.5">
//                         {PROBLEM.constraints.map((c, i) => (
//                             <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-mono">
//                                 <span className="text-zinc-600 mt-0.5">•</span>
//                                 <span>{c}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Test case result row
// function TestCaseResult({ result }) {
//     const statusColor = result.passed
//         ? "text-emerald-400"
//         : "text-rose-400";
//     const icon = result.passed
//         ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#10b981" /><path d="M4 7l2.5 2.5L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
//         : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#f43f5e" /><path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;

//     return (
//         <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg overflow-hidden">
//             <div className={`flex items-center justify-between px-3 py-2 border-b border-zinc-800 ${result.passed ? "bg-emerald-500/5" : "bg-rose-500/5"}`}>
//                 <div className="flex items-center gap-2">
//                     {icon}
//                     <span className={`text-xs font-semibold ${statusColor}`}>
//                         Case {result.id} — {result.passed ? "Passed" : "Wrong Answer"}
//                     </span>
//                 </div>
//                 <div className="flex items-center gap-3 text-xs text-zinc-500">
//                     <span>{result.runtime}</span>
//                     <span>{result.memory}</span>
//                 </div>
//             </div>
//             <div className="p-3 grid grid-cols-1 gap-2 text-xs font-mono">
//                 <div>
//                     <span className="text-zinc-500 block mb-0.5">Input</span>
//                     <span className="text-zinc-300 whitespace-pre">{result.input}</span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                     <div>
//                         <span className="text-zinc-500 block mb-0.5">Expected</span>
//                         <span className="text-emerald-400">{result.expected}</span>
//                     </div>
//                     <div>
//                         <span className="text-zinc-500 block mb-0.5">Output</span>
//                         <span className={result.passed ? "text-emerald-400" : "text-rose-400"}>{result.actual}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Bottom panel: test cases + console
// function BottomPanel({ testResults, consoleState, activeTestCase, setActiveTestCase, running }) {
//     const [tab, setTab] = useState("testcases");

//     return (
//         <div className="flex flex-col h-full bg-[#0f0f11] border-t border-zinc-800">
//             <div className="flex items-center gap-0 px-3 pt-2.5 border-b border-zinc-800 shrink-0">
//                 {["testcases", "console"].map(t => (
//                     <button
//                         key={t}
//                         onClick={() => setTab(t)}
//                         className={`px-3 pb-2 text-xs font-medium transition-colors relative ${tab === t
//                             ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-violet-500 after:rounded-t"
//                             : "text-zinc-500 hover:text-zinc-300"
//                             }`}
//                     >
//                         {t === "testcases" ? "Test Cases" : "Console"}
//                         {t === "testcases" && testResults && (
//                             <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${testResults.every(r => r.passed) ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
//                                 }`}>
//                                 {testResults.filter(r => r.passed).length}/{testResults.length}
//                             </span>
//                         )}
//                     </button>
//                 ))}
//             </div>

//             <div className="flex-1 overflow-auto p-3">
//                 {tab === "testcases" && (
//                     <div>
//                         {!testResults && !running && (
//                             <div>
//                                 <div className="flex gap-1.5 mb-3">
//                                     {TEST_CASES.map(tc => (
//                                         <button
//                                             key={tc.id}
//                                             onClick={() => setActiveTestCase(tc.id)}
//                                             className={`px-3 py-1.5 text-xs rounded-md font-medium border transition-all ${activeTestCase === tc.id
//                                                 ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
//                                                 : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-300"
//                                                 }`}
//                                         >
//                                             Case {tc.id}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 {TEST_CASES.filter(tc => tc.id === activeTestCase).map(tc => (
//                                     <div key={tc.id} className="space-y-2">
//                                         <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg p-3">
//                                             <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Input</p>
//                                             <pre className="text-xs text-zinc-300 font-mono">{tc.input}</pre>
//                                         </div>
//                                         <div className="bg-[#1a1a1d] border border-zinc-800 rounded-lg p-3">
//                                             <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Expected Output</p>
//                                             <pre className="text-xs text-emerald-400 font-mono">{tc.expected}</pre>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {running && (
//                             <div className="flex items-center gap-3 text-zinc-400 py-4">
//                                 <div className="w-4 h-4 border-2 border-zinc-700 border-t-violet-400 rounded-full animate-spin" />
//                                 <span className="text-xs">Running test cases…</span>
//                             </div>
//                         )}

//                         {testResults && !running && (
//                             <div className="space-y-2">
//                                 {testResults.map(r => <TestCaseResult key={r.id} result={r} />)}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {tab === "console" && (
//                     <div>
//                         {consoleState.status === "idle" && (
//                             <p className="text-xs text-zinc-600 italic py-2">Run your code to see output here.</p>
//                         )}
//                         {consoleState.status === "loading" && (
//                             <div className="flex items-center gap-2 text-zinc-400 py-2">
//                                 <div className="w-3 h-3 border border-zinc-600 border-t-violet-400 rounded-full animate-spin" />
//                                 <span className="text-xs font-mono">Executing…</span>
//                             </div>
//                         )}
//                         {consoleState.status === "success" && (
//                             <div className="space-y-2">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#10b981" /><path d="M3.5 6l2 2L8.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
//                                     <span className="text-xs text-emerald-400 font-semibold">Accepted</span>
//                                     <span className="text-xs text-zinc-600">·</span>
//                                     <span className="text-xs text-zinc-500">{consoleState.runtime}</span>
//                                     <span className="text-xs text-zinc-500">{consoleState.memory}</span>
//                                 </div>
//                                 <pre className="text-xs font-mono text-zinc-300 bg-[#1a1a1d] rounded-lg p-3 border border-zinc-800 whitespace-pre-wrap">{consoleState.output}</pre>
//                             </div>
//                         )}
//                         {consoleState.status === "error" && (
//                             <div>
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#f43f5e" /><path d="M4 4l4 4M8 4l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
//                                     <span className="text-xs text-rose-400 font-semibold">Runtime Error</span>
//                                 </div>
//                                 <pre className="text-xs font-mono text-rose-300 bg-rose-500/5 rounded-lg p-3 border border-rose-500/20 whitespace-pre-wrap">{consoleState.error}</pre>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // Resize handle
// function ResizeHandle({ onMouseDown, horizontal = false }) {
//     return (
//         <div
//             onMouseDown={onMouseDown}
//             className={`${horizontal ? "h-1.5 w-full cursor-row-resize" : "w-1.5 h-full cursor-col-resize"} bg-zinc-800 hover:bg-violet-500/50 transition-colors shrink-0 group`}
//         >
//             <div className={`${horizontal ? "h-px w-8 mx-auto mt-0.5" : "w-px h-8 my-auto ml-0.5"} bg-zinc-600 group-hover:bg-violet-400 transition-colors rounded-full`} />
//         </div>
//     );
// }

// // Main App
// export default function CodeArena() {
//     const [language, setLanguage] = useState("javascript");
//     const [code, setCode] = useState(() => localStorage.getItem("codearena_code_javascript") || STARTER_CODE.javascript);
//     const [running, setRunning] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [testResults, setTestResults] = useState(null);
//     const [activeTestCase, setActiveTestCase] = useState(1);
//     const [consoleState, setConsoleState] = useState({ status: "idle" });
//     const [splitPos, setSplitPos] = useState(42); // % for left panel
//     const [bottomHeight, setBottomHeight] = useState(240); // px
//     const [fullscreen, setFullscreen] = useState(false);
//     const containerRef = useRef(null);

//     // Language change
//     const handleLanguageChange = useCallback((lang) => {
//         const saved = localStorage.getItem(`codearena_code_${lang}`);
//         setCode(saved || STARTER_CODE[lang]);
//         setLanguage(lang);
//     }, []);

//     // Auto-save
//     useEffect(() => {
//         localStorage.setItem(`codearena_code_${language}`, code);
//     }, [code, language]);

//     // Horizontal resize
//     const handleSplitDrag = useCallback((e) => {
//         e.preventDefault();
//         const container = containerRef.current;
//         if (!container) return;
//         const startX = e.clientX;
//         const startPct = splitPos;
//         const onMove = (me) => {
//             const rect = container.getBoundingClientRect();
//             const pct = ((me.clientX - rect.left) / rect.width) * 100;
//             setSplitPos(Math.min(70, Math.max(25, pct)));
//         };
//         const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//         window.addEventListener("mousemove", onMove);
//         window.addEventListener("mouseup", onUp);
//     }, [splitPos]);

//     // Vertical resize
//     const handleBottomDrag = useCallback((e) => {
//         e.preventDefault();
//         const startY = e.clientY;
//         const startH = bottomHeight;
//         const onMove = (me) => {
//             const delta = startY - me.clientY;
//             setBottomHeight(Math.min(420, Math.max(120, startH + delta)));
//         };
//         const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
//         window.addEventListener("mousemove", onMove);
//         window.addEventListener("mouseup", onUp);
//     }, [bottomHeight]);

//     const handleRun = async () => {
//         setRunning(true);
//         setTestResults(null);
//         setConsoleState({ status: "loading" });
//         try {
//             // Call startTest API
//             const startResponse = await startTest().unwrap();
//             console.log('Start test response:', startResponse);
//             const results = await runTestCases(code, language, TEST_CASES);
//             setTestResults(results);
//             const allPassed = results.every(r => r.passed);
//             setConsoleState({
//                 status: allPassed ? "success" : "error",
//                 output: results.map(r => `Case ${r.id}: ${r.passed ? "✓" : "✗"}  Output: ${r.actual}`).join("\n"),
//                 error: !allPassed ? results.filter(r => !r.passed).map(r => `Case ${r.id}: Expected ${r.expected}, got ${r.actual}`).join("\n") : null,
//                 runtime: results[0]?.runtime,
//                 memory: results[0]?.memory,
//             });
//         } catch (e) {
//             console.error('Error during run:', e);
//             setConsoleState({ status: "error", error: e.message || "Run failed" });
//         } finally {
//             setRunning(false);
//         }
//     };

//     const handleSubmit = async () => {
//         setSubmitting(true);
//         setTestResults(null);
//         setConsoleState({ status: "loading" });
//         try {
//             const results = await runTestCases(code, language, TEST_CASES);
//             setTestResults(results);
//             const allPassed = results.every(r => r.passed);
//             setConsoleState({
//                 status: allPassed ? "success" : "error",
//                 output: allPassed ? `All ${results.length} test cases passed!\nRuntime: ${results[0]?.runtime}\nMemory: ${results[0]?.memory}` : "",
//                 error: !allPassed ? `${results.filter(r => !r.passed).length} test case(s) failed.\n\n` + results.filter(r => !r.passed).map(r => `Case ${r.id}:\n  Input: ${r.input}\n  Expected: ${r.expected}\n  Got: ${r.actual}`).join("\n\n") : null,
//                 runtime: results[0]?.runtime,
//                 memory: results[0]?.memory,
//             });
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const editorHeight = `calc(100% - ${bottomHeight}px - 6px)`;

//     return (
//         <div className="flex flex-col h-screen bg-[#0a0a0c] text-white select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
//             <style>{`
//         .inline-code { background: #2a2a2e; color: #a78bfa; padding: 1px 5px; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
//         .problem-desc strong { color: #e4e4e7; }
//         .problem-desc em { color: #a1a1aa; }
//         .monaco-container .overflow-guard { border-radius: 0 !important; }
//         * { scrollbar-width: thin; scrollbar-color: #27272a transparent; }
//         ::-webkit-scrollbar { width: 4px; height: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 99px; }
//       `}</style>

//             <TopNav
//                 language={language}
//                 setLanguage={handleLanguageChange}
//                 onRun={handleRun}
//                 onSubmit={handleSubmit}
//                 running={running}
//                 submitting={submitting}
//             />

//             {/* Main split layout */}
//             <div ref={containerRef} className="flex flex-1 overflow-hidden">
//                 {/* Left: Problem */}
//                 <div style={{ width: `${splitPos}%`, minWidth: 280 }} className="flex flex-col overflow-hidden">
//                     <ProblemPanel />
//                 </div>

//                 {/* Vertical divider */}
//                 <ResizeHandle onMouseDown={handleSplitDrag} />

//                 {/* Right: Editor + bottom panel */}
//                 <div className="flex flex-col flex-1 overflow-hidden">
//                     {/* Editor area */}
//                     <div style={{ height: editorHeight }} className="overflow-hidden">
//                         {/* Editor top bar */}
//                         <div className="h-9 bg-[#141416] border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-2 h-2 rounded-full bg-zinc-700" />
//                                 <span className="text-xs text-zinc-500 font-mono">
//                                     solution.{LANG_CONFIG[language].ext}
//                                 </span>
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     const saved = STARTER_CODE[language];
//                                     setCode(saved);
//                                 }}
//                                 className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-0.5 rounded hover:bg-zinc-800"
//                             >
//                                 Reset
//                             </button>
//                         </div>
//                         <div style={{ height: "calc(100% - 36px)" }}>
//                             <MonacoEditor
//                                 value={code}
//                                 onChange={setCode}
//                                 language={language}
//                             />
//                         </div>
//                     </div>

//                     {/* Resize handle */}
//                     <ResizeHandle onMouseDown={handleBottomDrag} horizontal />

//                     {/* Bottom panel */}
//                     <div style={{ height: bottomHeight }} className="overflow-hidden">
//                         <BottomPanel
//                             testResults={testResults}
//                             consoleState={consoleState}
//                             activeTestCase={activeTestCase}
//                             setActiveTestCase={setActiveTestCase}
//                             running={running}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


//===================================== Level-2 page  ========================


import { useState, useEffect, useRef, useCallback } from "react";
import { useStartTestMutation } from "../../redux/services/userApi";

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS = [
    { id: "apt", name: "Aptitude", questions: 20, minutes: 20, color: "#3b82f6", type: "mcq" },
    { id: "lr", name: "Logical Reasoning", questions: 15, minutes: 15, color: "#8b5cf6", type: "mcq" },
    { id: "tech", name: "Technical MCQs", questions: 15, minutes: 25, color: "#06b6d4", type: "mcq" },
    { id: "code", name: "Coding Round", questions: 2, minutes: 30, color: "#f59e0b", type: "code" },
];

const TOTAL_MINUTES = SECTIONS.reduce((a, s) => a + s.minutes, 0); // 90

const MCQ_BANK = {
    apt: [
        { q: "A train travels 360 km in 4 hours. What is its average speed in m/s?", opts: ["25 m/s", "30 m/s", "20 m/s", "35 m/s"], ans: 0 },
        { q: "If 8 workers complete a project in 12 days, how many days will 6 workers take?", opts: ["14 days", "16 days", "18 days", "20 days"], ans: 1 },
        { q: "What is 15% of 480?", opts: ["62", "68", "72", "76"], ans: 2 },
        { q: "A pipe fills a tank in 6 hrs. Another empties it in 10 hrs. How long to fill if both open?", opts: ["12 hrs", "15 hrs", "18 hrs", "20 hrs"], ans: 1 },
        { q: "If A:B = 3:4 and B:C = 5:6, what is A:C?", opts: ["5:8", "5:9", "5:7", "5:6"], ans: 0 },
        { q: "A car covers 30% of a journey at 60 km/h and the rest at 90 km/h. Average speed?", opts: ["70 km/h", "75 km/h", "78 km/h", "80 km/h"], ans: 1 },
        { q: "The simple interest on ₹5000 at 8% per annum for 3 years is?", opts: ["₹1000", "₹1200", "₹1500", "₹1800"], ans: 1 },
        { q: "Find the missing number: 3, 9, 27, 81, ?", opts: ["162", "243", "216", "196"], ans: 1 },
        { q: "Two numbers are in ratio 3:5. Their LCM is 75. What is their HCF?", opts: ["3", "5", "15", "25"], ans: 1 },
        { q: "A shopkeeper gives 20% discount and still earns 20% profit. Cost price is ₹100. Marked price?", opts: ["₹120", "₹140", "₹150", "₹160"], ans: 2 },
        { q: "How many prime numbers are there between 1 and 50?", opts: ["13", "14", "15", "16"], ans: 2 },
        { q: "A triangle has sides 5, 12, 13. What type of triangle is it?", opts: ["Acute", "Obtuse", "Right", "Equilateral"], ans: 2 },
        { q: "Speed of boat in still water is 20 km/h. Speed of stream is 4 km/h. Find upstream speed.", opts: ["14 km/h", "16 km/h", "18 km/h", "24 km/h"], ans: 1 },
        { q: "In how many ways can 5 students be arranged in a row?", opts: ["25", "60", "100", "120"], ans: 3 },
        { q: "Compound interest on ₹8000 at 10% for 2 years?", opts: ["₹1600", "₹1680", "₹1700", "₹1800"], ans: 1 },
        { q: "What is the sum of first 20 natural numbers?", opts: ["190", "200", "210", "220"], ans: 2 },
        { q: "If log(2) = 0.301, find log(8)?", opts: ["0.602", "0.903", "1.204", "2.408"], ans: 1 },
        { q: "A class has 30 students. 60% pass. How many failed?", opts: ["10", "12", "14", "18"], ans: 1 },
        { q: "The perimeter of a square is 64 cm. Its area is?", opts: ["144 cm²", "196 cm²", "225 cm²", "256 cm²"], ans: 3 },
        { q: "In a group of 70, 37 like coffee and 52 like tea. Both like at least one. How many like both?", opts: ["17", "19", "21", "23"], ans: 1 },
    ],
    lr: [
        { q: "All cats are animals. Some animals are dogs. Which conclusion is valid?", opts: ["All cats are dogs", "Some cats are dogs", "No cats are dogs", "Cannot be determined"], ans: 3 },
        { q: "Complete the series: 2, 6, 12, 20, 30, ?", opts: ["40", "42", "44", "46"], ans: 1 },
        { q: "If MANGO is coded as LZMFN, how is APPLE coded?", opts: ["ZOKKD", "BQQMF", "ZOOKD", "APPLD"], ans: 0 },
        { q: "Ram is 8th from left and 12th from right in a row. How many students are in the row?", opts: ["18", "19", "20", "21"], ans: 1 },
        { q: "Odd one out: 3, 5, 7, 9, 11, 15?", opts: ["9", "11", "15", "7"], ans: 0 },
        { q: "A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?", opts: ["Uncle", "Father", "Grandfather", "Brother"], ans: 0 },
        { q: "If 5 * 3 = 28 and 7 * 2 = 47, then 6 * 4 = ?", opts: ["24", "48", "210", "64"], ans: 2 },
        { q: "Find next in series: AZ, BY, CX, DW, ?", opts: ["EV", "EU", "FV", "EW"], ans: 0 },
        { q: "Pointing to a man, a woman says 'His mother is the only daughter of my mother'. How is the woman related to the man?", opts: ["Aunt", "Mother", "Grandmother", "Sister"], ans: 1 },
        { q: "In a code, 'OVER' is written as 'MTAL'. How is 'SURE' written?", opts: ["QSPC", "QTOD", "QSOD", "QSOF"], ans: 0 },
        { q: "Statement: All birds can fly. Sparrows are birds. Conclusion?", opts: ["Sparrows can fly", "Some birds cannot fly", "Sparrows cannot fly", "None of these"], ans: 0 },
        { q: "Which is the missing number: 6, 13, 28, 59, ?", opts: ["112", "122", "120", "115"], ans: 1 },
        { q: "A is 16th from front. B is 16th from back. 3 students between A and B. Total students?", opts: ["31", "34", "35", "37"], ans: 2 },
        { q: "In a certain language TEACHER = 1234567, HEART = ?", opts: ["56321", "54321", "56421", "56341"], ans: 0 },
        { q: "How many triangles are in a regular hexagon divided by all its diagonals?", opts: ["6", "8", "12", "24"], ans: 2 },
    ],
    tech: [
        { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"], ans: 1 },
        { q: "Which data structure uses LIFO principle?", opts: ["Queue", "Stack", "Array", "Linked List"], ans: 1 },
        { q: "What does SQL stand for?", opts: ["Simple Query Language", "Structured Query Language", "Sequential Query Language", "Standard Query Language"], ans: 1 },
        { q: "Which of the following is NOT an OOP concept?", opts: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"], ans: 2 },
        { q: "What is the output of: console.log(typeof null)?", opts: ['"null"', '"undefined"', '"object"', '"boolean"'], ans: 2 },
        { q: "Which HTTP method is idempotent and used to update a resource completely?", opts: ["POST", "PATCH", "PUT", "DELETE"], ans: 2 },
        { q: "In React, what hook is used to run side effects?", opts: ["useState", "useEffect", "useRef", "useMemo"], ans: 1 },
        { q: "What is the worst-case time complexity of QuickSort?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 2 },
        { q: "Which of these is NOT a JavaScript data type?", opts: ["Symbol", "BigInt", "Float", "undefined"], ans: 2 },
        { q: "What does 'normalization' in databases aim to reduce?", opts: ["Query time", "Redundancy", "Index size", "Table count"], ans: 1 },
        { q: "Which design pattern is used by Redux?", opts: ["Observer", "Flux", "Singleton", "Factory"], ans: 1 },
        { q: "In TCP/IP, which layer is responsible for routing?", opts: ["Application", "Transport", "Network", "Data Link"], ans: 2 },
        { q: "What is the output: console.log(0.1 + 0.2 === 0.3)?", opts: ["true", "false", "NaN", "undefined"], ans: 1 },
        { q: "Which Git command creates a new branch and switches to it?", opts: ["git branch new", "git checkout new", "git checkout -b new", "git switch new"], ans: 2 },
        { q: "What is the space complexity of merge sort?", opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], ans: 2 },
    ],
};

const CODE_QUESTIONS = [
    {
        title: "Two Sum",
        desc: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice.",
        examples: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9",
        starter: `function twoSum(nums, target) {
  // your solution here

}`,
    },
    {
        title: "Valid Palindrome",
        desc: "Given a string s, return true if it is a palindrome, or false otherwise. Consider only alphanumeric characters and ignore case.",
        examples: "Input: s = \"A man, a plan, a canal: Panama\"\nOutput: true\n\nInput: s = \"race a car\"\nOutput: false",
        starter: `function isPalindrome(s) {
  // your solution here

}`,
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");
const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

const STORAGE_KEY = "ebench_exam_state_v1";

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (_) { }
    return null;
}

function buildInitialState() {
    const saved = loadState();
    if (saved) return saved;
    return {
        currentSection: 0,
        currentQ: 0,
        answers: { apt: {}, lr: {}, tech: {}, code: {} },
        code: {},
        sectionStatus: ["active", "locked", "locked", "locked"],
        sectionTime: SECTIONS.map((s) => s.minutes * 60),
        overallTime: TOTAL_MINUTES * 60,
        violations: 0,
        darkMode: true,
    };
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ExamPortal() {
    const [state, setState] = useState(buildInitialState);
    const [modal, setModal] = useState(null); // null | "nextSection" | "submit" | "submitted"
    const [toast, setToast] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);
    const codeRef = useRef({});
    const timerRef = useRef({});
    const [startTest] = useStartTestMutation();


    useEffect(() => {
        startTest();
    }, [])

    const {
        currentSection, currentQ, answers, code,
        sectionStatus, sectionTime, overallTime,
        violations, darkMode,
    } = state;

    const sec = SECTIONS[currentSection];

    // ── Persist ───────────────────────────────────────────────────────────────

    const persist = useCallback((s) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) { }
        setLastSaved(new Date());
    }, []);

    // ── Toast ─────────────────────────────────────────────────────────────────

    const showToast = useCallback((msg, type = "info") => {
        setToast({ msg, type, id: Date.now() });
        setTimeout(() => setToast(null), 2800);
    }, []);

    // ── Timers ────────────────────────────────────────────────────────────────

    useEffect(() => {
        const sectionTick = setInterval(() => {
            setState((prev) => {
                if (prev.sectionStatus[prev.currentSection] !== "active") return prev;
                const newTimes = [...prev.sectionTime];
                if (newTimes[prev.currentSection] <= 0) return prev;
                newTimes[prev.currentSection]--;
                // 5-min coding warning
                if (
                    prev.currentSection === 3 &&
                    newTimes[prev.currentSection] === 300
                ) {
                    showToast("⚠ 5 minutes remaining in coding section!", "warn");
                }
                return { ...prev, sectionTime: newTimes };
            });
        }, 1000);

        const overallTick = setInterval(() => {
            setState((prev) => {
                if (prev.overallTime <= 0) return prev;
                return { ...prev, overallTime: prev.overallTime - 1 };
            });
        }, 1000);

        timerRef.current = { sectionTick, overallTick };
        return () => {
            clearInterval(sectionTick);
            clearInterval(overallTick);
        };
    }, [showToast]);

    // Auto-advance when section timer hits 0
    useEffect(() => {
        if (sectionTime[currentSection] === 0 && sectionStatus[currentSection] === "active") {
            showToast("Time's up! Moving to next section.", "warn");
            advanceSection(true);
        }
    }, [sectionTime, currentSection]);

    // Auto-submit when overall timer hits 0
    useEffect(() => {
        if (overallTime === 0) {
            setModal("submitted");
            persist(state);
        }
    }, [overallTime]);

    // ── Auto-save every 30s ───────────────────────────────────────────────────

    useEffect(() => {
        const id = setInterval(() => {
            setState((prev) => { persist(prev); return prev; });
            showToast("✓ Progress auto-saved", "success");
        }, 30000);
        return () => clearInterval(id);
    }, [persist, showToast]);

    // ── Code auto-save every 10s ──────────────────────────────────────────────

    useEffect(() => {
        if (sec.type !== "code") return;
        const id = setInterval(() => {
            setState((prev) => { persist(prev); return prev; });
        }, 10000);
        return () => clearInterval(id);
    }, [sec.type, persist]);

    // ── Violation tracking ────────────────────────────────────────────────────

    useEffect(() => {
        const onHide = () => {
            if (document.hidden) {
                setState((prev) => {
                    const next = { ...prev, violations: prev.violations + 1 };
                    persist(next);
                    return next;
                });
                showToast("⚠ Tab switch detected — violation recorded!", "danger");
            }
        };
        document.addEventListener("visibilitychange", onHide);
        return () => document.removeEventListener("visibilitychange", onHide);
    }, [showToast, persist]);

    // ── Beforeunload warning ──────────────────────────────────────────────────

    useEffect(() => {
        const handler = (e) => {
            persist(state);
            e.preventDefault();
            e.returnValue = "Your test is in progress. Are you sure you want to leave?";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [state, persist]);

    // ── Actions ───────────────────────────────────────────────────────────────

    const advanceSection = useCallback((auto = false) => {
        setState((prev) => {
            const next = { ...prev };
            next.sectionStatus = [...prev.sectionStatus];
            next.sectionStatus[prev.currentSection] = "done";
            const nextIdx = prev.currentSection + 1;
            if (nextIdx >= SECTIONS.length) {
                setModal("submitted");
                return next;
            }
            next.sectionStatus[nextIdx] = "active";
            next.currentSection = nextIdx;
            next.currentQ = 0;
            persist(next);
            return next;
        });
        setModal(null);
    }, [persist]);

    const selectOption = (optIdx) => {
        setState((prev) => {
            const next = {
                ...prev,
                answers: {
                    ...prev.answers,
                    [sec.id]: { ...prev.answers[sec.id], [prev.currentQ]: optIdx },
                },
            };
            return next;
        });
    };

    const handleCodeChange = (val) => {
        setState((prev) => ({
            ...prev,
            code: { ...prev.code, [prev.currentQ]: val },
        }));
    };

    const goToQ = (idx) => setState((prev) => ({ ...prev, currentQ: idx }));
    const prevQ = () => currentQ > 0 && goToQ(currentQ - 1);
    const nextQ = () => currentQ < sec.questions - 1 && goToQ(currentQ + 1);

    const clickSection = (si) => {
        if (sectionStatus[si] === "active") return;
        if (sectionStatus[si] === "locked") showToast("Section locked — complete the current section first.", "warn");
        if (sectionStatus[si] === "done") showToast("Completed sections cannot be revisited.", "danger");
    };

    const totalAnswered = () => {
        let t = 0;
        SECTIONS.forEach((s) => {
            if (s.type === "mcq") t += Object.keys(answers[s.id] || {}).length;
            else t += Object.keys(code).length;
        });
        return t;
    };

    const totalQ = SECTIONS.reduce((a, s) => a + s.questions, 0);
    const secAnswered = sec.type === "mcq"
        ? Object.keys(answers[sec.id] || {}).length
        : Object.keys(code).length;

    const st = sectionTime[currentSection];
    const timerClass = st < 120 ? "crit" : st < 300 ? "warn" : "";
    const otClass = overallTime < 300 ? "crit" : overallTime < 600 ? "warn" : "";

    // ── Styles (inline, Tailwind-free) ────────────────────────────────────────

    const theme = darkMode
        ? {
            appBg: "#0a0f1e", navBg: "#0f1523", sidebarBg: "#141c2e",
            cardBg: "#1a2238", border: "#2a3555",
            text1: "#e8eaf0", text2: "#8b95b0", text3: "#4a5568",
            codeBg: "#0d1526", accentDim: "#1e3a6e",
        }
        : {
            appBg: "#f0f4f8", navBg: "#ffffff", sidebarBg: "#f5f7fa",
            cardBg: "#ffffff", border: "#dde2ee",
            text1: "#1a202c", text2: "#4a5568", text3: "#718096",
            codeBg: "#1e293b", accentDim: "#dbeafe",
        };

    const accent = "#3b82f6";

    const css = {
        app: { display: "flex", flexDirection: "column", height: "100vh", background: theme.appBg, color: theme.text1, fontFamily: "system-ui, sans-serif", fontSize: 14, overflow: "hidden", position: "relative" },
        topbar: { background: theme.navBg, borderBottom: `1px solid ${theme.border}`, padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
        body: { display: "flex", flex: 1, overflow: "hidden" },
        sidebar: { width: 224, background: theme.sidebarBg, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" },
        sidebarScroll: { flex: 1, overflowY: "auto", padding: 8 },
        main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
        banner: { background: theme.navBg, borderBottom: `1px solid ${theme.border}`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
        statsStrip: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, padding: "8px 20px", borderBottom: `1px solid ${theme.border}`, background: theme.navBg, flexShrink: 0 },
        qArea: { flex: 1, overflowY: "auto", padding: "16px 20px" },
        qFooter: { display: "flex", gap: 10, padding: "10px 20px", borderTop: `1px solid ${theme.border}`, background: theme.navBg, flexShrink: 0 },
    };

    const btn = (variant) => {
        const base = { padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "opacity .15s" };
        const variants = {
            primary: { ...base, background: accent, color: "#fff" },
            outline: { ...base, background: "transparent", border: `1px solid ${theme.border}`, color: theme.text2 },
            success: { ...base, background: "#052010", border: "1px solid #0a4020", color: "#22c55e" },
            danger: { ...base, background: "#300", border: "1px solid #600", color: "#fc8181" },
            warn: { ...base, background: "#3a2000", border: "1px solid #7a4500", color: "#f59e0b" },
        };
        return variants[variant] || base;
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div style={css.app}>

            {/* ── Top bar ─────────────────────────────────────────────────────── */}
            <div style={css.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>
                        e<span style={{ color: accent }}>Bench</span>{" "}
                        <span style={{ color: theme.text2, fontWeight: 400 }}>Campus</span>
                    </div>
                    <div style={{ width: 1, height: 20, background: theme.border }} />
                    <div style={{ fontSize: 12, color: theme.text2 }}>
                        Vishal Sharma &nbsp;|&nbsp; Roll: CS2024-047 &nbsp;|&nbsp; Campus Hiring Assessment 2024
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: "#2a1515", border: "1px solid #5a2020", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#fc8181" }}>
                        Violations: {violations}
                    </div>
                    <TimerPill label="Section" value={fmt(st)} cls={timerClass} theme={theme} />
                    <TimerPill label="Overall" value={fmt(overallTime)} cls={otClass} theme={theme} accent />
                    <button style={btn("outline")} onClick={() => setState((p) => ({ ...p, darkMode: !p.darkMode }))}>
                        {darkMode ? "☀" : "🌙"}
                    </button>
                </div>
            </div>

            {/* ── Body ────────────────────────────────────────────────────────── */}
            <div style={css.body}>

                {/* Sidebar */}
                <div style={css.sidebar}>
                    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${theme.border}`, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px", color: theme.text2 }}>
                        Sections
                    </div>
                    <div style={css.sidebarScroll}>
                        {SECTIONS.map((s, si) => {
                            const isActive = si === currentSection && sectionStatus[si] === "active";
                            const isDone = sectionStatus[si] === "done";
                            const isLocked = sectionStatus[si] === "locked";
                            const secAns = s.type === "mcq" ? Object.keys(answers[s.id] || {}).length : Object.keys(code).length;
                            return (
                                <div key={s.id} style={{ borderRadius: 8, marginBottom: 4, overflow: "hidden" }}>
                                    <div
                                        onClick={() => clickSection(si)}
                                        style={{
                                            padding: "8px 10px", display: "flex", alignItems: "center", gap: 8,
                                            fontSize: 12, cursor: isActive ? "default" : "pointer",
                                            background: isActive ? theme.accentDim : isDone ? (darkMode ? "#0a2010" : "#f0fdf4") : "transparent",
                                            opacity: isLocked ? .5 : 1,
                                        }}
                                    >
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                                        <div style={{ flex: 1, fontWeight: 500, color: theme.text1 }}>{s.name}</div>
                                        <span style={{
                                            fontSize: 10, padding: "2px 6px", borderRadius: 4,
                                            background: isActive ? accent : isDone ? (darkMode ? "#0a3020" : "#dcfce7") : theme.border,
                                            color: isActive ? "#fff" : isDone ? "#22c55e" : theme.text3,
                                        }}>
                                            {isActive ? "Active" : isDone ? "Done" : "🔒"}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <div style={{ padding: "4px 10px 8px", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3 }}>
                                            {Array.from({ length: s.questions }, (_, q) => {
                                                const isAns = s.type === "mcq" ? answers[s.id]?.[q] !== undefined : code[q] !== undefined;
                                                const isCur = q === currentQ;
                                                return (
                                                    <div
                                                        key={q}
                                                        onClick={() => goToQ(q)}
                                                        style={{
                                                            width: 20, height: 20, borderRadius: 4, fontSize: 9, cursor: "pointer",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            border: `1px solid ${isCur ? "#f59e0b" : isAns ? accent : theme.border}`,
                                                            background: isAns ? accent : theme.cardBg,
                                                            color: isAns ? "#fff" : isCur ? "#f59e0b" : theme.text2,
                                                        }}
                                                    >
                                                        {q + 1}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ padding: "10px 12px", borderTop: `1px solid ${theme.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: theme.text2, marginBottom: 6 }}>
                            <span>Overall Progress</span>
                            <span>{Math.round((totalAnswered() / totalQ) * 100)}%</span>
                        </div>
                        <div style={{ background: theme.border, borderRadius: 4, height: 5 }}>
                            <div style={{ width: `${Math.round((totalAnswered() / totalQ) * 100)}%`, background: accent, borderRadius: 4, height: 5, transition: "width .3s" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: theme.text2, marginTop: 6 }}>
                            <span>{totalAnswered()} answered</span>
                            <span>{totalQ} total</span>
                        </div>
                    </div>
                </div>

                {/* Main */}
                <div style={css.main}>
                    {sectionStatus[currentSection] === "done" ? (
                        <CompletedSection sec={sec} theme={theme} />
                    ) : (
                        <>
                            {/* Section banner */}
                            <div style={css.banner}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 4, height: 28, borderRadius: 2, background: sec.color }} />
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>{sec.name}</div>
                                        <div style={{ fontSize: 11, color: theme.text2 }}>
                                            Q{currentQ + 1} of {sec.questions} &nbsp;·&nbsp; {sec.type === "code" ? "Coding" : "MCQ"}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 11, color: theme.text2 }}>Section timer</span>
                                    <span style={{
                                        fontFamily: "monospace", fontSize: 18, fontWeight: 500,
                                        color: timerClass === "crit" ? "#ef4444" : timerClass === "warn" ? "#f59e0b" : theme.text1,
                                        animation: timerClass === "crit" ? "pulse 1s infinite" : "none",
                                    }}>
                                        {fmt(st)}
                                    </span>
                                </div>
                            </div>

                            {/* Stats strip */}
                            <div style={css.statsStrip}>
                                {[
                                    { v: secAnswered, l: "Answered" },
                                    { v: sec.questions - secAnswered, l: "Remaining" },
                                    { v: Math.round((secAnswered / sec.questions) * 100) + "%", l: "Section %" },
                                    { v: totalAnswered(), l: "Total Done" },
                                ].map(({ v, l }) => (
                                    <div key={l} style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 16, fontWeight: 500, color: theme.text1 }}>{v}</div>
                                        <div style={{ fontSize: 10, color: theme.text2, marginTop: 1 }}>{l}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Question area */}
                            <div style={css.qArea}>
                                {sec.type === "mcq" ? (
                                    <MCQQuestion
                                        sec={sec}
                                        currentQ={currentQ}
                                        answers={answers}
                                        onSelect={selectOption}
                                        theme={theme}
                                        accent={accent}
                                        bank={MCQ_BANK}
                                    />
                                ) : (
                                    <CodeQuestion
                                        currentQ={currentQ}
                                        code={code}
                                        onChange={handleCodeChange}
                                        theme={theme}
                                        lastSaved={lastSaved}
                                    />
                                )}
                            </div>

                            {/* Footer */}
                            <div style={css.qFooter}>
                                <button style={btn("outline")} onClick={prevQ}>← Prev</button>
                                <button style={btn("warn")} onClick={() => showToast("Question marked for review", "warn")}>
                                    🔖 Mark
                                </button>
                                <div style={{ flex: 1 }} />
                                <button style={btn("outline")} onClick={nextQ}>Next →</button>
                                <button
                                    style={btn(currentSection === SECTIONS.length - 1 ? "danger" : "success")}
                                    onClick={() => setModal(currentSection === SECTIONS.length - 1 ? "submit" : "nextSection")}
                                >
                                    {currentSection === SECTIONS.length - 1 ? "Submit Test" : "Next Section →"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Toast */}
            {toast && <Toast msg={toast.msg} type={toast.type} />}

            {/* Modals */}
            {modal === "nextSection" && (
                <Modal
                    icon="⏩"
                    title="Move to next section?"
                    body="You still have time remaining. All answers are saved. You cannot return to this section."
                    confirm="Next Section →"
                    confirmStyle={btn("primary")}
                    onCancel={() => setModal(null)}
                    onConfirm={() => advanceSection(false)}
                />
            )}
            {modal === "submit" && (
                <Modal
                    icon="📋"
                    title="Submit Test?"
                    body="You are about to submit your entire test. This action cannot be undone."
                    confirm="Submit Test"
                    confirmStyle={btn("danger")}
                    onCancel={() => setModal(null)}
                    onConfirm={() => { persist(state); setModal("submitted"); }}
                />
            )}
            {modal === "submitted" && (
                <Modal
                    icon="🎉"
                    title="Test Submitted!"
                    body={`All responses saved. You answered ${totalAnswered()} out of ${totalQ} questions. You may close this window.`}
                    confirm={null}
                    onCancel={null}
                    onConfirm={null}
                />
            )}

            <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TimerPill({ label, value, cls, theme, accent: isAccent }) {
    const color = cls === "crit" ? "#ef4444" : cls === "warn" ? "#f59e0b" : theme.text1;
    return (
        <div style={{
            background: theme.cardBg, border: `1px solid ${isAccent ? "#1e3a6e" : theme.border}`,
            borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8,
        }}>
            <span style={{ fontSize: 10, color: theme.text2, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</span>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 500, color, animation: cls === "crit" ? "pulse 1s infinite" : "none" }}>
                {value}
            </span>
        </div>
    );
}

function MCQQuestion({ sec, currentQ, answers, onSelect, theme, accent, bank }) {
    const questions = bank[sec.id] || [];
    const q = questions[currentQ % questions.length];
    const selected = answers[sec.id]?.[currentQ];

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: theme.text2 }}>
                    Question <span style={{ color: accent, fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions}
                </div>
                <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: "#1e3a6e", color: accent }}>MCQ</div>
            </div>
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 14, lineHeight: 1.7, color: theme.text1 }}>
                {q.q}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["A", "B", "C", "D"].map((letter, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(i)}
                        style={{
                            background: selected === i ? "#1e3a6e" : theme.cardBg,
                            border: `1px solid ${selected === i ? accent : theme.border}`,
                            borderRadius: 8, padding: "10px 14px", textAlign: "left", color: theme.text1,
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                        }}
                    >
                        <div style={{
                            width: 24, height: 24, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 500,
                            background: selected === i ? accent : "transparent",
                            border: `1px solid ${selected === i ? accent : theme.border}`,
                            color: selected === i ? "#fff" : theme.text2,
                        }}>
                            {letter}
                        </div>
                        {q.opts[i]}
                    </button>
                ))}
            </div>
        </>
    );
}

function CodeQuestion({ currentQ, code, onChange, theme, lastSaved }) {
    const q = CODE_QUESTIONS[currentQ];
    const val = code[currentQ] ?? q.starter;
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: theme.text2 }}>
                    Problem <span style={{ color: "#f59e0b", fontWeight: 500 }}>{currentQ + 1}</span> / {CODE_QUESTIONS.length}
                </div>
                <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: "#3a2000", color: "#f59e0b" }}>Coding</div>
            </div>
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 6 }}>{q.title}</div>
                <div style={{ fontSize: 13, color: theme.text2, lineHeight: 1.6, marginBottom: 10 }}>{q.desc}</div>
                <pre style={{ fontFamily: "monospace", fontSize: 12, background: theme.codeBg, padding: "10px 12px", borderRadius: 8, color: "#93c5fd", whiteSpace: "pre-wrap" }}>
                    {q.examples}
                </pre>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <select style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.text1, borderRadius: 6, padding: "4px 8px", fontSize: 11 }}>
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>Java</option>
                    <option>C++</option>
                </select>
                {lastSaved && (
                    <div style={{ fontSize: 10, color: theme.text2, display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                        Saved {lastSaved.toLocaleTimeString()}
                    </div>
                )}
            </div>
            <textarea
                value={val}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                style={{
                    background: theme.codeBg, border: `1px solid ${theme.border}`, borderRadius: 10,
                    fontFamily: "monospace", fontSize: 13, color: "#e2e8f0",
                    padding: 14, height: 240, width: "100%", resize: "vertical", outline: "none", lineHeight: 1.6,
                }}
            />
        </>
    );
}

function CompletedSection({ sec, theme }) {
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: theme.text2 }}>
            <div style={{ fontSize: 48, color: "#22c55e" }}>✓</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: theme.text1 }}>{sec.name} — Completed</div>
            <div style={{ fontSize: 13 }}>Your answers have been saved</div>
        </div>
    );
}

function Modal({ icon, title, body, confirm, confirmStyle, onCancel, onConfirm }) {
    return (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#1a2238", border: "1px solid #2a3555", borderRadius: 14, padding: 28, width: 360, textAlign: "center", animation: "slideIn .2s ease" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#8b95b0", lineHeight: 1.6, marginBottom: 22 }}>{body}</div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    {onCancel && <button style={{ padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "transparent", border: "1px solid #2a3555", color: "#8b95b0" }} onClick={onCancel}>Stay Here</button>}
                    {confirm && onConfirm && <button style={confirmStyle} onClick={onConfirm}>{confirm}</button>}
                </div>
            </div>
        </div>
    );
}

function Toast({ msg, type }) {
    const colors = {
        success: { bg: "#052010", border: "#0a4020", color: "#4ade80" },
        warn: { bg: "#3a2000", border: "#7a4500", color: "#f59e0b" },
        danger: { bg: "#300", border: "#600", color: "#fc8181" },
        info: { bg: "#0a1a3a", border: "#1e3a6e", color: "#93c5fd" },
    };
    const c = colors[type] || colors.info;
    return (
        <div style={{
            position: "absolute", top: 60, right: 16, padding: "8px 14px",
            background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8,
            fontSize: 12, color: c.color, zIndex: 200, animation: "slideIn .2s ease",
        }}>
            {msg}
        </div>
    );
}


//=============================== Student test link page ===============================================




// import { useState } from "react";

// const CANDIDATE = {
//     name: "Arjun Mehta",
//     initials: "AM",
//     email: "arjun.mehta@college.edu",
//     phone: "+91 98765 43210",
//     college: "IIT Roorkee",
//     branch: "CS & Engineering",
//     batch: "2025",
//     role: "Software Engineer – Product",
//     company: "Shilsha Technologies",
// };

// const LEVELS = {
//     "level-001": {
//         key: "level-001",
//         bc: "Level 1 — Communication",
//         title: "Communication assessment",
//         sub: "Verbal & written communication",
//         icon: "💬",
//         accent: "#4F46E5",
//         accentBg: "#EEF2FF",
//         dotColor: "#4F46E5",
//         duration: "45 min", questions: "40", marks: "45", cutoff: "60%",
//         sections: [
//             {
//                 icon: "👤",
//                 num: "01",
//                 name: "Personal Introduction",
//                 desc: "Introduce yourself, your educational background, interests, strengths, and career aspirations. Speak naturally and confidently.",
//                 qs: "Video Part 1",
//                 time: "2–3 min",
//                 marks: "30 marks"
//             },
//             {
//                 icon: "💼",
//                 num: "02",
//                 name: "Skills & Experience",
//                 desc: "Discuss your technical skills, projects, internships, work experience, achievements, and key learnings from your journey.",
//                 qs: "Video Part 2",
//                 time: "2–4 min",
//                 marks: "40 marks"
//             },
//             {
//                 icon: "🎤",
//                 num: "03",
//                 name: "Communication & Presentation",
//                 desc: "Assessment focuses on confidence, fluency, clarity, and professionalism.",
//                 qs: "Video Part 3",
//                 time: "2–3 min",
//                 marks: "30 marks"
//             }
//         ],
//         rules: ["Full-screen mode is mandatory throughout", "Tab switching monitored — 3 violations auto-submit", "No copy-paste in writing sections", "Stable internet connection required"],
//         isAI: false,
//     },
//     "level-002": {
//         key: "level-002",
//         bc: "Level 2 — Aptitude & Coding",
//         title: "Aptitude & coding round",
//         sub: "Technical & analytical ability",
//         icon: "⚙️",
//         accent: "#B45309",
//         accentBg: "#FFFBEB",
//         dotColor: "#B45309",
//         duration: "90 min", questions: "55", marks: "80", cutoff: "55%",
//         sections: [
//             { icon: "🔢", num: "01", name: "Quantitative aptitude", desc: "Arithmetic, percentages, time-speed-distance, and data interpretation.", qs: "20 Qs", time: "75 sec/Q", marks: "20 marks" },
//             { icon: "🧩", num: "02", name: "Logical reasoning", desc: "Sequences, syllogisms, blood relations, and pattern recognition.", qs: "15 Qs", time: "60 sec/Q", marks: "15 marks" },
//             { icon: "💻", num: "03", name: "Programming MCQs", desc: "Output prediction, bug identification, and complexity analysis.", qs: "15 Qs", time: "90 sec/Q", marks: "15 marks" },
//             { icon: "⚡", num: "04", name: "Coding challenges", desc: "Two DSA problems — Easy + Medium. Correctness, efficiency, edge cases.", qs: "2 problems", time: "25 min each", marks: "30 marks", star: true },
//         ],
//         rules: ["Full-screen mode is mandatory throughout", "Tab switching monitored — 3 violations auto-submit", "No external IDE or compiler allowed", "Code auto-saved every 30 seconds", "Languages: C, C++, Java, Python, JavaScript"],
//         isAI: false,
//     },
//     "level-003": {
//         key: "level-003",
//         bc: "Level 3 — AI Interview",
//         title: "AI-powered live interview",
//         sub: "Personality, depth & culture fit",
//         icon: "🤖",
//         accent: "#047857",
//         accentBg: "#ECFDF5",
//         dotColor: "#047857",
//         duration: "30–45 min", questions: "Live", marks: "AI scored", cutoff: "AI scored",
//         sections: [
//             { icon: "🙋", num: "01", name: "Introduction & background", desc: "Brief self-introduction. AI assesses communication clarity and structured thinking.", time: "~5 min" },
//             { icon: "🔬", num: "02", name: "Technical deep dive", desc: "Role-relevant technical questions on concept accuracy and problem-solving approach.", time: "~15 min" },
//             { icon: "🎯", num: "03", name: "Behavioural & situational", desc: "STAR-based scenarios on teamwork, conflict resolution, and leadership potential.", time: "~10 min" },
//             { icon: "🌱", num: "04", name: "Culture fit & motivation", desc: "Why this role? Career goals and alignment with company values.", time: "~10 min" },
//         ],
//         rules: ["Camera and microphone must stay enabled throughout", "Well-lit, quiet environment required", "AI evaluates tone, pace, vocabulary, and structure", "Responses are recorded and reviewed by HR", "Speak naturally — do not read from a script"],
//         isAI: true,
//     },
// };

// // ── Small primitives ──────────────────────────────────────────────────────────
// function Chip({ children }) {
//     return (
//         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-500 whitespace-nowrap">
//             {children}
//         </span>
//     );
// }

// function Tag({ children, accent }) {
//     return (
//         <span
//             className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
//             style={accent ? { background: accent + "18", color: accent, borderColor: accent + "40" } : { background: "#f1f5f9", color: "#64748b", borderColor: "#e2e8f0" }}
//         >
//             {children}
//         </span>
//     );
// }

// function DarkTag({ children }) {
//     return (
//         <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900 text-slate-100 border border-slate-900">
//             {children}
//         </span>
//     );
// }

// function StatBox({ val, label }) {
//     return (
//         <div className="bg-slate-50 rounded-lg px-3.5 py-2.5 text-center min-w-[72px]">
//             <div className="text-base font-semibold text-slate-900 leading-tight">{val}</div>
//             <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
//         </div>
//     );
// }

// // ── Section card ──────────────────────────────────────────────────────────────
// function SectionCard({ sec, accent }) {
//     return (
//         <div
//             className={`bg-white rounded-xl border p-4 flex flex-col gap-2 hover:border-slate-300 transition-colors`}
//             style={sec.star ? { borderColor: "#FDE68A" } : { borderColor: "#e2e8f0" }}
//         >
//             <div className="flex items-start gap-2">
//                 <span className="text-[11px] text-slate-300 font-semibold mt-0.5 w-5 flex-shrink-0">{sec.num}</span>
//                 <span className="text-base leading-none mt-0.5">{sec.icon}</span>
//                 <span className="text-[13px] font-medium text-slate-800 leading-snug flex-1">{sec.name}</span>
//             </div>
//             <p className="text-[12px] text-slate-500 leading-relaxed pl-7">{sec.desc}</p>
//             <div className="flex flex-wrap items-center gap-1.5 pl-7">
//                 {sec.qs && <Tag>{sec.qs}</Tag>}
//                 <Tag accent={accent}>⏱ {sec.time}</Tag>
//                 {sec.marks && <DarkTag>{sec.marks}</DarkTag>}
//                 {sec.star && (
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "#FFFBEB", color: "#B45309", border: "0.5px solid #FDE68A" }}>
//                         ★ Highest weightage
//                     </span>
//                 )}
//             </div>
//         </div>
//     );
// }

// // ── Main ──────────────────────────────────────────────────────────────────────
// export default function CandidateTestDetails() {
//     const [levelKey, setLevelKey] = useState("level-001");
//     const [agreed, setAgreed] = useState(false);
//     const [launching, setLaunching] = useState(false);

//     const lv = LEVELS[levelKey];

//     const handleLevelChange = (key) => { setLevelKey(key); setAgreed(false); };

//     const handleStart = () => {
//         if (!agreed || launching) return;
//         setLaunching(true);
//         setTimeout(() => { setLaunching(false); alert("Redirecting to exam portal…"); }, 1800);
//     };

//     return (
//         <div className="min-h-screen bg-slate-100 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

//             {/* ── Topbar ── */}
//             <header className="bg-white border-b border-slate-200 h-[52px] flex items-center px-6 gap-2.5 sticky top-0 z-50 flex-shrink-0">
//                 <div className="w-7 h-7 bg-slate-900 rounded-lg grid place-items-center flex-shrink-0">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3.5 h-3.5">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//                     </svg>
//                 </div>
//                 <span className="text-[13px] font-semibold text-slate-900">eBench Campus</span>
//                 <span className="text-slate-300 text-base font-light">·</span>
//                 <span className="text-xs text-slate-400 hidden sm:inline">Candidate Portal</span>
//                 <div className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
//                     </svg>
//                     Identity verified
//                 </div>
//             </header>

//             {/* ── Hero ── */}
//             <div className=" border-slate-200 px-6 py-6">
//                 <div className="max-w-5xl mx-auto">


//                     <div className="flex flex-col lg:flex-row lg:items-start gap-5">
//                         {/* Candidate info */}
//                         <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-3.5">
//                                 <div className="w-11 h-11 rounded-xl bg-slate-900 grid place-items-center text-white font-semibold text-sm flex-shrink-0">
//                                     {CANDIDATE.initials}
//                                 </div>
//                                 <div>
//                                     <div className="text-[17px] font-semibold text-slate-900 leading-tight">{CANDIDATE.name}</div>
//                                     <div className="text-xs text-slate-500 mt-0.5">{CANDIDATE.email}</div>
//                                 </div>
//                             </div>
//                             <div className="flex flex-wrap gap-1.5">
//                                 <Chip>🏛 {CANDIDATE.college}</Chip>
//                                 <Chip>💻 {CANDIDATE.branch}</Chip>
//                                 <Chip>🎓 Batch {CANDIDATE.batch}</Chip>
//                                 <Chip>📱 {CANDIDATE.phone}</Chip>
//                                 <Chip>💼 {CANDIDATE.role}</Chip>
//                                 <Chip>🏢 {CANDIDATE.company}</Chip>
//                             </div>
//                         </div>

//                         {/* Level switcher */}
//                         {/* <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 lg:w-64 flex-shrink-0">
//                             <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5">Switch level (demo)</p>
//                             {Object.values(LEVELS).map((l) => (
//                                 <button
//                                     key={l.key}
//                                     onClick={() => handleLevelChange(l.key)}
//                                     className={`w-full text-left px-3 py-2 rounded-lg border text-[13px] flex items-center gap-2 mb-1.5 transition-all ${levelKey === l.key ? "bg-white border-slate-300 font-medium text-slate-900" : "bg-transparent border-transparent text-slate-500 hover:bg-white hover:border-slate-200"}`}
//                                 >
//                                     <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.dotColor }} />
//                                     {l.bc}
//                                 </button>
//                             ))}
//                         </div> */}
//                     </div>
//                 </div>
//             </div>

//             {/* ── Body ── */}
//             <div className="flex-1 px-6 py-7">
//                 <div className="max-w-5xl mx-auto space-y-5">

//                     {/* Test header */}
//                     <div>
//                         <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Test overview</p>
//                         <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-start gap-4">
//                             <div className="w-12 h-12 rounded-xl grid place-items-center text-2xl flex-shrink-0" style={{ background: lv.accentBg }}>
//                                 {lv.icon}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <div className="text-[16px] font-semibold text-slate-900 capitalize">{lv.title}</div>
//                                 <div className="text-[13px] text-slate-500 mt-0.5">{lv.sub}</div>
//                             </div>
//                             <div className="flex gap-2 flex-wrap">
//                                 <StatBox val={lv.duration} label="Duration" />
//                                 <StatBox val={lv.questions} label="Questions" />
//                                 <StatBox val={lv.marks} label="Marks" />
//                                 <StatBox val={lv.cutoff} label="Cutoff" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Sections */}
//                     <div>
//                         <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Sections</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
//                             {lv.sections.map((sec, i) => (
//                                 <SectionCard key={i} sec={sec} accent={lv.accent} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Camera check for Level 3 */}
//                     {lv.isAI && (
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
//                             {["Camera access", "Microphone access", "Stable internet"].map((item) => (
//                                 <div key={item} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2.5">
//                                     <div className="w-5 h-5 rounded-full bg-emerald-500 grid place-items-center flex-shrink-0">
//                                         <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
//                                         </svg>
//                                     </div>
//                                     <span className="text-[13px] font-medium text-slate-700">{item}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* Bottom two-col: Rules + Agree/CTA */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         {/* Guidelines */}
//                         <div className="bg-white border border-slate-200 rounded-xl p-5">
//                             <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3.5">Guidelines</p>
//                             <ul className="space-y-2.5">
//                                 {lv.rules.map((rule, i) => (
//                                     <li key={i} className="flex items-start gap-2.5">
//                                         <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 grid place-items-center" style={{ background: lv.accentBg }}>
//                                             <span className="text-[9px] font-bold" style={{ color: lv.accent }}>{i + 1}</span>
//                                         </div>
//                                         <span className="text-[12px] text-slate-600 leading-relaxed">{rule}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Agree + CTA */}
//                         <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
//                             <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Before you begin</p>
//                             <label className="flex items-start gap-3 cursor-pointer">
//                                 <div
//                                     onClick={() => setAgreed(!agreed)}
//                                     className="w-[18px] h-[18px] rounded flex-shrink-0 mt-0.5 grid place-items-center border-2 transition-all cursor-pointer"
//                                     style={agreed ? { background: lv.accent, borderColor: lv.accent } : { borderColor: "#cbd5e1", background: "#fff" }}
//                                 >
//                                     {agreed && (
//                                         <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
//                                         </svg>
//                                     )}
//                                 </div>
//                                 <p className="text-[12px] text-slate-600 leading-relaxed">
//                                     I have read and understood all test guidelines. I agree to attempt this test honestly and acknowledge that violations may lead to disqualification.
//                                 </p>
//                             </label>

//                             <button
//                                 onClick={handleStart}
//                                 disabled={!agreed || launching}
//                                 className="w-full py-2.5 rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
//                                 style={agreed ? { background: lv.accent, color: "#fff", cursor: "pointer" } : { background: "#f1f5f9", color: "#94a3b8" }}
//                             >
//                                 {launching ? (
//                                     <>
//                                         <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
//                                             <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
//                                         </svg>
//                                         Launching test…
//                                     </>
//                                 ) : (
//                                     <>
//                                         Begin test
//                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
//                                         </svg>
//                                     </>
//                                 )}
//                             </button>

//                             <p className="text-[11px] text-slate-400 text-center leading-relaxed">
//                                 Need help?{" "}
//                                 <a href="mailto:support@shilshatech.com" className="text-slate-500 hover:underline">
//                                     support@shilshatech.com
//                                 </a>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }