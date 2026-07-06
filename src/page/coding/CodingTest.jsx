// import { useState, useEffect, useCallback } from "react";
// import { useStartTestQuery, useSubmitScenarioAnswerMutation, useSubmitMcqAnswersMutation, useSubmitCodingMutation } from "../../redux/services/userApi";

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const pad = (n) => String(n).padStart(2, "0");
// const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
// const STORAGE_KEY = "ebench_exam_v2";

// // ─── Transform API response → internal sections array ────────────────────────
// // Call this once after your RTK Query response arrives.
// // Durations are props you pass in (from exam config / backend).

// export function buildSectionsFromApiResponse(apiData = {}, durations = {}) {
//     const {
//         mcq_questions = [],
//         scenario_questions = [],
//         coding_questions = [],
//     } = apiData;

//     const sections = [];

//     if (mcq_questions.length > 0) {
//         sections.push({
//             id: "mcq",
//             name: "MCQ",
//             type: "mcq",
//             color: "#3b82f6",
//             minutes: durations.mcq ?? 20,
//             questions: mcq_questions.map((q) => ({
//                 id: q.id,
//                 text: q.question,
//                 options: [
//                     { label: "A", text: q.option_a },
//                     { label: "B", text: q.option_b },
//                     { label: "C", text: q.option_c },
//                     { label: "D", text: q.option_d },
//                 ],
//             })),
//         });
//     }

//     if (scenario_questions.length > 0) {
//         sections.push({
//             id: "scenario",
//             name: "Scenario",
//             type: "scenario",
//             color: "#8b5cf6",
//             minutes: durations.scenario ?? 20,
//             questions: scenario_questions.map((q) => ({
//                 id: q.id,
//                 text: q.question,
//                 options: [
//                     { label: "A", text: q.option_a },
//                     { label: "B", text: q.option_b },
//                     { label: "C", text: q.option_c },
//                     { label: "D", text: q.option_d },
//                 ],
//             })),
//         });
//     }

//     if (coding_questions.length > 0) {
//         sections.push({
//             id: "coding",
//             name: "Coding",
//             type: "code",
//             color: "#f59e0b",
//             minutes: durations.coding ?? 30,
//             questions: coding_questions.map((q) => ({
//                 id: q.id,
//                 title: q.title,
//                 description: q.description,
//                 templateCode: q.template_code,
//                 testCases: q.test_cases ?? [],
//             })),
//         });
//     }

//     return sections;
// }

// // ─── Build initial exam state ─────────────────────────────────────────────────

// function buildInitialState(sections) {
//     const saved = (() => {
//         try {
//             const raw = localStorage.getItem(STORAGE_KEY);
//             return raw ? JSON.parse(raw) : null;
//         } catch (_) { return null; }
//     })();

//     // If saved state has matching section count, resume it
//     if (saved && saved.sectionTime?.length === sections.length) return saved;

//     return {
//         currentSection: 0,
//         currentQ: 0,
//         // answers: { [sectionId]: { [questionIndex]: selectedOptionIndex } }
//         answers: Object.fromEntries(sections.map((s) => [s.id, {}])),
//         // code: { [sectionId]: { [questionIndex]: { language, source } } }
//         code: {},
//         sectionStatus: sections.map((_, i) => (i === 0 ? "active" : "locked")),
//         sectionTime: sections.map((s) => s.minutes * 60),
//         overallTime: sections.reduce((a, s) => a + s.minutes, 0) * 60,
//         violations: 0,
//         darkMode: true,
//     };
// }

// // ─── ExamPortal ───────────────────────────────────────────────────────────────
// // Props:
// //   apiData   — raw response from your backend (the shape you showed)
// //   candidate — { name, rollNo, examTitle }
// //   durations — { mcq: 20, scenario: 20, coding: 30 }  (minutes, optional)
// //   onSubmit  — (payload) => void  called with final answers on submit

// const dummyApiData = {
//     "status": "ok",
//     "candidate": {
//         "name": "Jonas Nielsen",
//         "email": "neyipol821@fishnone.com",
//         "level": "LEVEL_002",
//         "level_id": "LEVEL_002",
//         "mcq_total_count": 12,
//         "coding_total_count": 5,
//         "scenario_total_count": 8
//     },
//     "time_allocation": {
//         "mcq_minutes": 24,
//         "total_minutes": 143,
//         "coding_minutes": 75,
//         "scenario_minutes": 44
//     },
//     "mcq_questions": [
//         {
//             "id": 426,
//             "question": "What is the primary purpose of unit testing in software development?",
//             "option_a": "To ensure the entire application works as expected",
//             "option_b": "To identify and fix bugs in the code",
//             "option_c": "To test individual components of the code",
//             "option_d": "To improve code readability"
//         },
//         {
//             "id": 427,
//             "question": "What is a benefit of using a version control system like Git?",
//             "option_a": "It allows for faster deployment of code",
//             "option_b": "It helps to track changes made to the code",
//             "option_c": "It improves code security",
//             "option_d": "It reduces the need for testing"
//         },
//         {
//             "id": 428,
//             "question": "What is the purpose of a debugging tool in software development?",
//             "option_a": "To improve code performance",
//             "option_b": "To identify and fix errors in the code",
//             "option_c": "To test the entire application",
//             "option_d": "To refactor code"
//         },
//         {
//             "id": 429,
//             "question": "What is a best practice for writing high-quality code?",
//             "option_a": "Using long and complex variable names",
//             "option_b": "Using comments to explain the code",
//             "option_c": "Using a consistent coding style",
//             "option_d": "Using a lot of nested if-else statements"
//         },
//         {
//             "id": 430,
//             "question": "What is the purpose of a testing framework like Jest?",
//             "option_a": "To improve code performance",
//             "option_b": "To identify and fix errors in the code",
//             "option_c": "To test React components",
//             "option_d": "To refactor code"
//         },
//         {
//             "id": 431,
//             "question": "What is a benefit of using a continuous integration and continuous deployment (CI/CD) pipeline?",
//             "option_a": "It reduces the need for manual testing",
//             "option_b": "It improves code quality and reduces errors",
//             "option_c": "It increases the time spent on debugging",
//             "option_d": "It reduces the need for version control"
//         },
//         {
//             "id": 432,
//             "question": "What is the purpose of a code review in software development?",
//             "option_a": "To identify and fix bugs in the code",
//             "option_b": "To improve code performance",
//             "option_c": "To ensure the code meets the requirements",
//             "option_d": "To provide feedback on code quality and best practices"
//         },
//         {
//             "id": 433,
//             "question": "What is a best practice for writing efficient code?",
//             "option_a": "Using a lot of nested loops",
//             "option_b": "Using a lot of conditional statements",
//             "option_c": "Using caching and memoization",
//             "option_d": "Using a lot of recursion"
//         },
//         {
//             "id": 434,
//             "question": "What is the purpose of a logging mechanism in software development?",
//             "option_a": "To improve code performance",
//             "option_b": "To identify and fix errors in the code",
//             "option_c": "To track user activity",
//             "option_d": "To provide feedback on code quality"
//         },
//         {
//             "id": 435,
//             "question": "What is a benefit of using a modular design in software development?",
//             "option_a": "It reduces code reusability",
//             "option_b": "It improves code maintainability",
//             "option_c": "It reduces code scalability",
//             "option_d": "It improves code complexity"
//         },
//         {
//             "id": 436,
//             "question": "What is the purpose of a code formatter in software development?",
//             "option_a": "To improve code performance",
//             "option_b": "To identify and fix errors in the code",
//             "option_c": "To enforce a consistent coding style",
//             "option_d": "To refactor code"
//         },
//         {
//             "id": 437,
//             "question": "What is a best practice for handling errors in software development?",
//             "option_a": "To ignore errors and continue execution",
//             "option_b": "To log errors and continue execution",
//             "option_c": "To handle errors and provide user-friendly error messages",
//             "option_d": "To use a lot of try-catch blocks"
//         }
//     ],
//     "coding_questions": [
//         {
//             "id": 141,
//             "title": "Sum of Array Elements",
//             "description": "Write a Java function to calculate the sum of all elements in an array.",
//             "template_code": "    # Read input from stdin\n    # Write your solution here\n    pass\n",
//             "test_cases": [
//                 {
//                     "input": "5\n1 2 3 4 5",
//                     "expected_output": "15"
//                 }
//             ]
//         },
//         {
//             "id": 142,
//             "title": "String Reversal",
//             "description": "Write a Node.js function to reverse a given string.",
//             "template_code": "    # Read input from stdin\n    # Write your solution here\n    pass\n",
//             "test_cases": [
//                 {
//                     "input": "hello",
//                     "expected_output": "olleh"
//                 }
//             ]
//         },
//         {
//             "id": 143,
//             "title": "React Component",
//             "description": "Write a React function component to display a list of items.",
//             "template_code": "    # Read input from stdin\n    # Write your solution here\n    pass\n",
//             "test_cases": [
//                 {
//                     "input": "item1 item2 item3",
//                     "expected_output": "<ul><li>item1</li><li>item2</li><li>item3</li></ul>"
//                 }
//             ]
//         },
//         {
//             "id": 144,
//             "title": "MERN Stack API",
//             "description": "Write a MERN stack API to create a new user.",
//             "template_code": "    # Read input from stdin\n    # Write your solution here\n    pass\n",
//             "test_cases": [
//                 {
//                     "input": "{\"name\":\"John\",\"email\":\"john@example.com\"}",
//                     "expected_output": "{\"message\":\"User created successfully\"}"
//                 }
//             ]
//         },
//         {
//             "id": 145,
//             "title": "DevOps Pipeline",
//             "description": "Write a DevOps pipeline to deploy a Node.js application.",
//             "template_code": "    # Read input from stdin\n    # Write your solution here\n    pass\n",
//             "test_cases": [
//                 {
//                     "input": "",
//                     "expected_output": "Deployment successful"
//                 }
//             ]
//         }
//     ],
//     "scenario_questions": [
//         {
//             "id": 34,
//             "title": "Underperforming Team Member",
//             "situation": "One of your team members is not meeting the project's coding standards, resulting in delays and impacting the overall project timeline. Despite previous discussions, the issue persists, and you need to address it. The team member is a junior developer with potential but lacks experience.",
//             "question": "How would you approach the conversation with the underperforming team member, and what steps would you take to help them improve their coding skills?",
//             "skill_tag": "Devops",
//             "difficulty": "Fresher"
//         },
//         {
//             "id": 35,
//             "title": "Difficult Code Review",
//             "situation": "You are conducting a code review for a React application, and the developer is becoming defensive about the feedback provided. The developer's code does not meet the team's standards, and you need to find a way to convey this without discouraging them. The project deadline is approaching, and the code needs to be refactored ASAP.",
//             "question": "How would you handle the difficult conversation, and what strategies would you use to ensure the developer understands and implements the necessary changes?",
//             "skill_tag": "React",
//             "difficulty": "Fresher"
//         },
//         {
//             "id": 36,
//             "title": "Communication Breakdown",
//             "situation": "A team member is struggling to communicate effectively with the rest of the team, leading to misunderstandings and delays in the MERN project. You have noticed that the team member is not participating in discussions and is not providing updates on their tasks. The team's morale is starting to suffer as a result.",
//             "question": "How would you address the communication breakdown, and what steps would you take to help the team member improve their communication skills?",
//             "skill_tag": "Mern",
//             "difficulty": "Fresher"
//         },
//         {
//             "id": 37,
//             "title": "Lack of Feedback",
//             "situation": "One of your team members is not receiving regular feedback on their work, leading to confusion about their performance. The team member is working on a NodeJS project and is eager to learn and grow but lacks direction. You need to find a way to provide constructive feedback that will help the team member improve.",
//             "question": "How would you provide feedback to the team member, and what strategies would you use to ensure they understand and act on the feedback?",
//             "skill_tag": "NodeJS",
//             "difficulty": "Fresher"
//         },
//         {
//             "id": 38,
//             "title": "Performance Improvement Plan",
//             "situation": "A team member is consistently underperforming and not meeting the expectations of their role. You have decided to create a performance improvement plan to help them get back on track. The team member is working on a Java-based project and needs to improve their coding skills and attention to detail.",
//             "question": "What would you include in the performance improvement plan, and how would you monitor the team member's progress?",
//             "skill_tag": "Java",
//             "difficulty": "Fresher"
//         },
//         {
//             "id": 39,
//             "title": "Conflict with a Colleague",
//             "situation": "Two team members are having a disagreement about the best approach to a DevOps project. The disagreement is starting to affect the team's morale and productivity. You need to find a way to resolve the conflict and get the team back on track.",
//             "question": "How would you handle the conflict, and what strategies would you use to ensure the team members can work together effectively?",
//             "skill_tag": "Devops",
//             "difficulty": "Fresher"
//         },
//         {
//             "id": 40,
//             "title": "Team Member Burnout",
//             "situation": "A team member is showing signs of burnout, including decreased motivation and increased absenteeism. The team member is working on a critical MERN project and is responsible for meeting a tight deadline. You need to find a way to support the team member and prevent burnout.",
//             "question": "What steps would you take to support the team member, and how would you help them manage their workload and prevent burnout?",
//             "skill_tag": "Mern",
//             "difficulty": "Fresher"
//         },
//         {
//             "id": 41,
//             "title": "New Team Member Onboarding",
//             "situation": "A new team member is joining the team, and you need to ensure they have a smooth transition and are set up for success. The new team member will be working on a NodeJS project and needs to get up to speed quickly. You need to develop an onboarding plan that will help them get familiar with the team's processes and expectations.",
//             "question": "What would you include in the onboarding plan, and how would you ensure the new team member receives the necessary support and feedback?",
//             "skill_tag": "NodeJS",
//             "difficulty": "Fresher"
//         }
//     ]
// }

// export default function ExamPortal({
//     apiData = {},
//     candidate = { name: "Candidate", rollNo: "—", examTitle: "Campus Assessment" },
//     durations = {},
//     onSubmit,
// }) {
//     // const { data: apiResponse, isLoading, error } = useStartTestQuery();
//     const apiResponse = null
//     const effectiveData = apiResponse || dummyApiData;

//     console.log("effective-data", effectiveData)
//     // Extract durations from API time_allocation if provided
//     const apiDurations = {
//         mcq: effectiveData.time_allocation?.mcq_minutes,
//         scenario: effectiveData.time_allocation?.scenario_minutes,
//         coding: effectiveData.time_allocation?.coding_minutes,
//     };
//     // Merge with any explicit durations prop (prop takes precedence)
//     const mergedDurations = { ...apiDurations, ...durations };
//     const sections = buildSectionsFromApiResponse(effectiveData, mergedDurations);

//     console.log("sections", sections)
//     // console.log("api-dur", apiDurations)
//     // ── State hooks ────────────────────────────────────────────────────────
//     // ── State hooks ────────────────────────────────────────────────────────
//     // Initialise state to null; we will populate it once `sections` are ready.
//     const [state, setState] = useState(null);
//     const [modal, setModal] = useState(null);
//     const [toast, setToast] = useState(null);
//     const [lastSaved, setLastSaved] = useState(null);
//     const [submitMcq] = useSubmitMcqAnswersMutation();
//     const [submitScenario] = useSubmitScenarioAnswerMutation();
//     const [submitCoding] = useSubmitCodingMutation();
//     console.log("2017 me kaha tha ", state)


//     const persist = useCallback((s) => {
//         try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) { }
//         setLastSaved(new Date());
//     }, []);


//     // Populate `state` after the sections array is built.
//     // This runs only when `sections` changes and avoids using a lazy initializer
//     useEffect(() => {
//         if (!sections) return;
//         if (state && state.sectionTime?.length === sections.length) return;
//         setState(buildInitialState(sections));
//     }, [sections]);

//     const {
//         currentSection = 0,
//         currentQ = 0,
//         answers = {},
//         code = {},
//         sectionStatus = [],
//         sectionTime = [],
//         overallTime = 0,
//         violations = 0,
//         darkMode = true,
//     } = state || {};

//     const sec = sections?.[currentSection];



//     const buildSubmitPayload = () => ({
//         mcq_answers: Object.entries(answers.mcq || {}).map(([idx, optionIndex]) => ({
//             question_id: sections.find((s) => s.id === "mcq")?.questions[idx]?.id,
//             selected_option: ["A", "B", "C", "D"][optionIndex],
//         })),
//         scenario_answers: Object.entries(answers.scenario || {}).map(([idx, answerText]) => ({
//             question_id: sections.find(s => s.id === "scenario")?.questions[idx]?.id,
//             candidate_answer: answerText
//         })),
//         coding_answers: Object.entries(code).map(([idx, val]) => ({
//             question_id: sections.find((s) => s.id === "coding")?.questions[idx]?.id,
//             language: val.language,
//             source_code: val.source,
//         })),
//         // state?.violations,
//     });

//     // ── Actions ──────────────────────────────────────────────────────────────────

//     const selectOption = (optIdx) => {
//         const { opt, q } = optIdx;

//         setState((prev) => ({
//             ...prev,
//             answers: {
//                 ...prev.answers,
//                 [sec.id]: { ...prev.answers[sec.id], [q?.id]: opt?.label },
//             },
//         }));
//     };


//     const handleCodeChange = (field, val) => {
//         console.log("field", field, val);
//         setState((prev) => ({
//             ...prev,
//             code: {
//                 ...prev.code,
//                 [prev.currentQ]: { ...(prev.code[prev.currentQ] || {}), [field]: val },
//             },
//         }));
//     };

//     const goToQ = (idx) => setState((prev) => ({ ...prev, currentQ: idx }));
//     const prevQ = () => currentQ > 0 && goToQ(currentQ - 1);
//     const nextQ = () => currentQ < sec.questions.length - 1 && goToQ(currentQ + 1);

//     const clickSection = (si) => {
//         const st = sectionStatus[si];
//         if (st === "locked") showToast("Complete the current section first.", "warn");
//         if (st === "done") showToast("Completed sections cannot be revisited.", "danger");
//     };

//     const totalAnswered = () => {
//         let t = 0;
//         sections?.forEach((s) => {
//             if (s.type !== "code") t += Object.keys(state?.answers[s.id] || {}).length;
//             else t += Object.keys(state?.code || {}).length;
//         });
//         return t;
//     };

//     const totalQ = sections.reduce((a, s) => a + s.questions.length, 0);
//     // console.log(sectionTime, "sectionTime")
//     // const secAnswered = sec?.type !== "code"
//     //     ? Object.keys(answers[sec.id] || {}).length
//     //     : Object.keys(code).length;

//     const st = state?.sectionTime[state?.currentSection];
//     const timerCls = st < 120 ? "crit" : st < 300 ? "warn" : "";
//     const otCls = state?.overallTime < 300 ? "crit" : state?.overallTime < 600 ? "warn" : "";

//     // ── Theme ────────────────────────────────────────────────────────────────────

//     const T = state?.darkMode
//         ? { appBg: "#0a0f1e", navBg: "#0f1523", sidebarBg: "#141c2e", cardBg: "#1a2238", border: "#2a3555", text1: "#e8eaf0", text2: "#8b95b0", text3: "#4a5568", codeBg: "#0d1526", accentDim: "#1e3a6e" }
//         : { appBg: "#f0f4f8", navBg: "#ffffff", sidebarBg: "#f5f7fa", cardBg: "#ffffff", border: "#dde2ee", text1: "#1a202c", text2: "#4a5568", text3: "#718096", codeBg: "#1e293b", accentDim: "#dbeafe" };

//     const accent = "#3b82f6";

//     const btn = (v) => {
//         const base = { padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none" };
//         return {
//             primary: { ...base, background: accent, color: "#fff" },
//             outline: { ...base, background: "transparent", border: `1px solid ${T.border}`, color: T.text2 },
//             success: { ...base, background: "#052010", border: "1px solid #0a4020", color: "#22c55e" },
//             danger: { ...base, background: "#300", border: "1px solid #600", color: "#fc8181" },
//             warn: { ...base, background: "#3a2000", border: "1px solid #7a4500", color: "#f59e0b" },
//         }[v] || base;
//     };



//     // Handle Next button: advance question or section
//     const handleNext = () => {
//         if (currentQ < sec.questions.length - 1) {
//             goToQ(currentQ + 1);
//         } else {
//             // Last question in section, open confirmation modal
//             setModal("nextSection");
//         }
//     };

//     const advanceSection = useCallback(() => {
//         // Submit current section before advancing
//         const currentSec = sections[currentSection];
//         setState((prev) => {
//             const next = { ...prev, sectionStatus: [...prev.sectionStatus] };
//             next.sectionStatus[prev.currentSection] = "done";
//             const nextIdx = prev.currentSection + 1;
//             if (nextIdx >= sections.length) {
//                 setModal("submitted");
//                 return next;
//             }
//             next.sectionStatus[nextIdx] = "active";
//             next.currentSection = nextIdx;
//             next.currentQ = 0;
//             persist(next);
//             return next;
//         });
//         // Close the next-section confirmation modal
//         setModal(null);
//     }, [sections, persist, currentSection]);

//     // ── Render ───────────────────────────────────────────────────────────────────


//     // if (error) { this function has to uncommnet
//     //     return (
//     //         <div style={{ padding: '20px', fontSize: '16px', color: '#ff4444' }}>
//     //             Failed to load exam data. Please try again later.
//     //         </div>
//     //     );
//     // }

//     // If no sections are available (e.g., API data missing), render a fallback UI to avoid errors.
//     // if (!sections || sections.length === 0) { this is has to uncommnet
//     //     return (
//     //         <div style={{ padding: '20px', fontSize: '16px', color: '#ff4444' }}>
//     //             No exam data available. Please try again later.
//     //         </div>
//     //     );
//     // }

//     return (
//         <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.appBg, color: T.text1, fontSize: 14, fontFamily: "system-ui,sans-serif", overflow: "hidden", position: "relative" }}>

//             {/* Topbar */}
//             <div style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{ fontSize: 15, fontWeight: 500 }}>e<span style={{ color: accent }}>Bench</span> <span style={{ color: T.text2, fontWeight: 400 }}>Campus</span></div>
//                     <div style={{ width: 1, height: 20, background: T.border }} />
//                     <div style={{ fontSize: 12, color: T.text2 }}>{candidate.name} &nbsp;|&nbsp; {candidate.rollNo} &nbsp;|&nbsp; {candidate.examTitle}</div>
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{ background: "#2a1515", border: "1px solid #5a2020", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#fc8181" }}>
//                         Violations: {state?.violations}
//                     </div>
//                     <TimerPill label="Section" value={fmt(st)} cls={timerCls} T={T} />
//                     <TimerPill label="Overall" value={fmt(state?.overallTime)} cls={otCls} T={T} dim />
//                     <button style={btn("outline")} onClick={() => setState((p) => ({ ...p, darkMode: !p.darkMode }))}>{state?.darkMode ? "☀" : "🌙"}</button>
//                 </div>
//             </div>

//             {/* Body */}
//             <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

//                 {/* Sidebar */}
//                 <div style={{ width: 220, background: T.sidebarBg, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
//                     <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px", color: T.text2 }}>Sections</div>
//                     <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
//                         {sections.map((s, si) => {
//                             const isActive = si === state?.currentSection && state?.sectionStatus[si] === "active";
//                             const isDone = state?.sectionStatus[si] === "done";
//                             const isLocked = state?.sectionStatus[si] === "locked";
//                             const sAns = s.type !== "code" ? Object.keys(state?.answers[s.id] || {}).length : Object.keys(state?.code || {}).length;
//                             return (
//                                 <div key={s.id} style={{ borderRadius: 8, marginBottom: 4, overflow: "hidden" }}>
//                                     <div onClick={() => clickSection(si)} style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: isActive ? "default" : "pointer", background: isActive ? T.accentDim : isDone ? (darkMode ? "#0a2010" : "#f0fdf4") : "transparent", opacity: isLocked ? .5 : 1 }}>
//                                         <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
//                                         <div style={{ flex: 1, fontWeight: 500 }}>{s.name}</div>
//                                         <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: isActive ? accent : isDone ? (darkMode ? "#0a3020" : "#dcfce7") : T.border, color: isActive ? "#fff" : isDone ? "#22c55e" : T.text3 }}>
//                                             {isActive ? "Active" : isDone ? "Done" : "🔒"}
//                                         </span>
//                                     </div>
//                                     {isActive && (
//                                         <div style={{ padding: "4px 10px 8px", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3 }}>
//                                             {s.questions.map((pi, qi) => {
//                                                 const isAns = s.type !== "code" ? state?.answers[s.id]?.[pi?.id] !== undefined : state?.code[qi] !== undefined;
//                                                 const isCur = qi === state?.currentQ;
//                                                 return (
//                                                     <div key={qi} onClick={() => goToQ(qi)} style={{ width: 20, height: 20, borderRadius: 4, fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${isCur ? "#f59e0b" : isAns ? accent : T.border}`, background: isAns ? accent : T.cardBg, color: isAns ? "#fff" : isCur ? "#f59e0b" : T.text2 }}>
//                                                         {qi + 1}
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>
//                     <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.text2, marginBottom: 6 }}>
//                             <span>Overall Progress</span><span>{Math.round((totalAnswered() / totalQ) * 100)}%</span>
//                         </div>
//                         <div style={{ background: T.border, borderRadius: 4, height: 5 }}>
//                             <div style={{ width: `${Math.round((totalAnswered() / totalQ) * 100)}%`, background: accent, borderRadius: 4, height: 5, transition: "width .3s" }} />
//                         </div>
//                         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.text2, marginTop: 6 }}>
//                             <span>{totalAnswered()} answered</span><span>{totalQ} total</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main */}
//                 <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//                     {state?.sectionStatus[state?.currentSection] === "done" ? (
//                         <CompletedSection sec={sec} T={T} />
//                     ) : (
//                         <>
//                             {/* Section banner */}
//                             <div style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
//                                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                                     <div style={{ width: 4, height: 28, borderRadius: 2, background: this?.sec?.color }} />
//                                     <div>
//                                         <div style={{ fontSize: 14, fontWeight: 500 }}>{this?.sec.name}</div>
//                                         <div style={{ fontSize: 14, fontWeight: 500 }}>{sec?.name}</div>
//                                         <div style={{ fontSize: 11, color: T.text2 }}>Q{state?.currentQ + 1} of {sec?.questions?.length}</div>
//                                     </div>
//                                 </div>
//                                 <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 500, color: timerCls === "crit" ? "#ef4444" : timerCls === "warn" ? "#f59e0b" : T.text1, animation: timerCls === "crit" ? "pulse 1s infinite" : "none" }}>
//                                     {fmt(st)}
//                                 </span>
//                             </div>

//                             {/* Question area */}
//                             <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
//                                 {sec?.type === "mcq" && (
//                                     <MCQQuestion
//                                         sec={sec}
//                                         currentQ={currentQ}
//                                         answers={answers}
//                                         onSelect={selectOption}
//                                         T={T}
//                                         accent={accent}
//                                     />
//                                 )}
//                                 {sec?.type === "scenario" && (
//                                     <ScenarioQuestion
//                                         sec={sec}
//                                         currentQ={currentQ}
//                                         answers={answers}
//                                         onAnswer={(q, text) => {
//                                             setState((prev) => ({
//                                                 ...prev,
//                                                 answers: {
//                                                     ...prev.answers,
//                                                     [sec.id]: { ...(prev.answers[sec.id] || {}), [q.id]: text },
//                                                 },
//                                             }));
//                                         }}
//                                         T={T}
//                                         accent={accent}
//                                     />
//                                 )}
//                                 {sec?.type === "code" && (
//                                     <CodeQuestion
//                                         sec={sec}
//                                         currentQ={currentQ}
//                                         code={code}
//                                         onChange={handleCodeChange}
//                                         T={T}
//                                         lastSaved={lastSaved}
//                                     />
//                                 )}
//                             </div>

//                             {/* Footer */}
//                             <div style={{ display: "flex", gap: 10, padding: "10px 20px", borderTop: `1px solid ${T.border}`, background: T.navBg, flexShrink: 0 }}>
//                                 <button style={btn("outline")} onClick={prevQ}>← Prev</button>
//                                 <button style={btn("warn")} onClick={() => showToast("Marked for review", "warn")}>🔖 Mark</button>
//                                 <div style={{ flex: 1 }} />
//                                 <button style={btn("outline")} onClick={nextQ}>Next →</button>
//                                 <button
//                                     style={btn(currentSection === sections.length - 1 ? "danger" : "success")}
//                                     onClick={() => setModal(currentSection === sections.length - 1 ? "submit" : "nextSection")}
//                                 >
//                                     {currentSection === sections.length - 1 ? "Submit Test" : "Next Section →"}
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>

//             {/* Toast */}
//             {toast && <Toast msg={toast.msg} type={toast.type} />}

//             {/* Modals */}
//             {modal === "nextSection" && (
//                 <Modal icon="⏩" title={`Move to ${sections[currentSection + 1]?.name}?`}
//                     body="All answers are saved. You cannot return to this section."
//                     confirm="Next Section →" confirmStyle={btn("primary")}
//                     onConfirm={advanceSection}
//                     onCancel={() => setModal(null)} />
//             )}
//             {modal === "submit" && (
//                 <Modal icon="📋" title="Submit Test?"
//                     body={`You've answered ${totalAnswered()} of ${totalQ} questions. This cannot be undone.`}
//                     confirm="Submit Test" confirmStyle={btn("danger")}
//                     onCancel={() => setModal(null)}
//                     onConfirm={async () => {
//                         persist(state);
//                         try {
//                             const mcqPayload = {
//                                 answers: Object.entries(answers.mcq || {}).map((item) =>
//                                 ({
//                                     question_id: item[0],
//                                     selected_option: item[1]
//                                 }))
//                             };
//                             const scenarioPayload = {
//                                 answers: Object.entries(answers.scenario || {}).map(([idx, optionIdx]) => ({
//                                     question_id: sections.find(s => s.id === "scenario")?.questions[idx]?.id,
//                                     selected_option: ["A", "B", "C", "D"][optionIdx]
//                                 }))
//                             };
//                             const codingPayload = {
//                                 answers: Object.entries(code).map(([idx, val]) => ({
//                                     question_id: sections.find(s => s.id === "coding")?.questions[idx]?.id,
//                                     language: val.language,
//                                     source_code: val.source
//                                 }))
//                             };
//                             await Promise.all([
//                                 submitMcq(mcqPayload).unwrap(),
//                                 submitScenario(scenarioPayload).unwrap(),
//                                 submitCoding(codingPayload).unwrap()
//                             ]);
//                         } catch (e) {
//                             console.error('Submit failed', e);
//                         }
//                         setModal("submitted");
//                     }} />
//             )}
//             {modal === "submitted" && (
//                 <Modal icon="🎉" title="Test Submitted!"
//                     body={`All responses saved. ${totalAnswered()}/${totalQ} questions answered.`}
//                     confirm={null} onCancel={null} onConfirm={null} />
//             )}

//             <style>{`
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
//         @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
//       `}</style>
//         </div>
//     );
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function TimerPill({ label, value, cls, T, dim }) {
//     const color = cls === "crit" ? "#ef4444" : cls === "warn" ? "#f59e0b" : T.text1;
//     return (
//         <div style={{ background: T.cardBg, border: `1px solid ${dim ? "#1e3a6e" : T.border}`, borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8 }}>
//             <span style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</span>
//             <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 500, color, animation: cls === "crit" ? "pulse 1s infinite" : "none" }}>{value}</span>
//         </div>
//     );
// }

// function MCQQuestion({ sec, currentQ, answers, onSelect, T, accent }) {
//     const q = sec.questions[currentQ];
//     if (!q) return null;
//     const selected = answers[sec.id]?.[q.id];
//     const badgeColor = sec.type === "scenario" ? { bg: "#2d1b69", color: "#a78bfa" } : { bg: "#1e3a6e", color: accent };
//     // console.log("hello", q);

//     return (
//         <>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//                 <div style={{ fontSize: 12, color: T.text2 }}>
//                     Question <span style={{ color: accent, fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions.length}
//                 </div>
//                 <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: badgeColor.bg, color: badgeColor.color }}>
//                     {sec.type === "scenario" ? "Scenario" : "MCQ"}
//                 </div>
//             </div>
//             <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 14, lineHeight: 1.7, color: T.text1 }}>
//                 {q.text}
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 {q.options.map((opt, i) => (
//                     <button key={i} onClick={() => onSelect({ opt, q })} style={{ background: selected === opt?.label ? T.accentDim : T.cardBg, border: `1px solid ${selected === opt?.label ? accent : T.border}`, borderRadius: 8, padding: "10px 14px", textAlign: "left", color: T.text1, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
//                         <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, background: selected === opt?.label ? accent : "transparent", border: `1px solid ${selected === opt?.label ? accent : T.border}`, color: selected === opt?.label ? "#fff" : T.text2 }}>
//                             {opt?.label}
//                         </div>
//                         {opt?.text}
//                     </button>
//                 ))}
//             </div>
//         </>
//     );
// }

// function CodeQuestion({ sec, currentQ, code, onChange, T, lastSaved }) {
//     const q = sec.questions[currentQ];
//     if (!q) return null;
//     const saved = code[currentQ] || {};
//     const lang = saved.language || "python";
//     const source = saved.source ?? q.templateCode ?? "";

//     return (
//         <>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//                 <div style={{ fontSize: 12, color: T.text2 }}>
//                     Problem <span style={{ color: "#f59e0b", fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions.length}
//                 </div>
//                 <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: "#3a2000", color: "#f59e0b" }}>Coding</div>
//             </div>

//             {/* Problem statement */}
//             <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
//                 <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 14 }}>{q.title}</div>
//                 <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.7 }}>{q.description}</div>
//             </div>

//             {/* Test cases */}
//             {q.testCases.length > 0 && (
//                 <div style={{ marginBottom: 12 }}>
//                     <div style={{ fontSize: 11, color: T.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Sample Test Cases</div>
//                     {q.testCases.map((tc, i) => (
//                         <div key={i} style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                             <div>
//                                 <div style={{ fontSize: 10, color: T.text2, marginBottom: 4 }}>INPUT</div>
//                                 <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#93c5fd", whiteSpace: "pre-wrap", margin: 0 }}>{tc.input}</pre>
//                             </div>
//                             <div>
//                                 <div style={{ fontSize: 10, color: T.text2, marginBottom: 4 }}>EXPECTED OUTPUT</div>
//                                 <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#4ade80", whiteSpace: "pre-wrap", margin: 0 }}>{tc.expected_output}</pre>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Editor toolbar */}
//             <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
//                 <select
//                     value={lang}
//                     onChange={(e) => onChange("language", e.target.value)}
//                     style={{ background: T.cardBg, border: `1px solid ${T.border}`, color: T.text1, borderRadius: 6, padding: "4px 8px", fontSize: 11 }}
//                 >
//                     <option value="python">Python</option>
//                     <option value="javascript">JavaScript</option>
//                     <option value="java">Java</option>
//                     <option value="cpp">C++</option>
//                 </select>
//                 {lastSaved && (
//                     <div style={{ fontSize: 10, color: T.text2, display: "flex", alignItems: "center", gap: 4 }}>
//                         <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
//                         Saved {lastSaved.toLocaleTimeString()}
//                     </div>
//                 )}
//             </div>

//             {/* Code editor */}
//             <textarea
//                 value={source}
//                 onChange={(e) => onChange("source", e.target.value)}
//                 spellCheck={false}
//                 style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 10, fontFamily: "monospace", fontSize: 13, color: "#e2e8f0", padding: 14, height: 260, width: "100%", resize: "vertical", outline: "none", lineHeight: 1.6 }}
//             />
//         </>
//     );
// }

// function ScenarioQuestion({ sec, currentQ, answers, onAnswer, T, accent }) {
//     const q = sec.questions[currentQ];
//     if (!q) return null;
//     const answer = answers[sec.id]?.[q.id] ?? "";
//     const badgeColor = { bg: "#2d1b69", color: "#a78bfa" };
//     return (
//         <>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//                 <div style={{ fontSize: 12, color: T.text2 }}>
//                     Question <span style={{ color: accent, fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions.length}
//                 </div>
//                 <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: badgeColor.bg, color: badgeColor.color }}>
//                     Scenario
//                 </div>
//             </div>
//             <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 14, lineHeight: 1.7, color: T.text1 }}>
//                 {q.text}
//             </div>
//             <textarea
//                 value={answer}
//                 onChange={(e) => onAnswer(q, e.target.value)}
//                 placeholder="Type your answer here..."
//                 rows={6}
//                 style={{ width: "100%", resize: "vertical", padding: 10, borderRadius: 6, border: `1px solid ${T.border}`, background: T.cardBg, color: T.text1, fontSize: 14, lineHeight: 1.5 }}
//             />
//         </>
//     );
// }


// function CompletedSection({ sec, T }) {
//     return (
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: T.text2 }}>
//             <div style={{ fontSize: 48, color: "#22c55e" }}>✓</div>
//             <div style={{ fontSize: 16, fontWeight: 500, color: T.text1 }}>{sec.name} — Completed</div>
//             <div style={{ fontSize: 13 }}>Your answers have been saved</div>
//         </div>
//     );
// }

// function Modal({ icon, title, body, confirm, confirmStyle, onCancel, onConfirm }) {
//     console.log("con", confirm, onConfirm);
//     return (
//         <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
//             <div style={{ background: "#1a2238", border: "1px solid #2a3555", borderRadius: 14, padding: 28, width: 360, textAlign: "center", animation: "slideIn .2s ease" }}>
//                 <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
//                 <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{title}</div>
//                 <div style={{ fontSize: 13, color: "#8b95b0", lineHeight: 1.6, marginBottom: 22 }}>{body}</div>
//                 <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
//                     {onCancel && <button style={{ padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "transparent", border: "1px solid #2a3555", color: "#8b95b0" }} onClick={onCancel}>Stay Here</button>}
//                     {confirm && onConfirm && <button style={confirmStyle} onClick={onConfirm}>{confirm}</button>}
//                 </div>
//             </div>
//         </div>
//     );
// }

// function Toast({ msg, type }) {
//     const c = { success: { bg: "#052010", border: "#0a4020", color: "#4ade80" }, warn: { bg: "#3a2000", border: "#7a4500", color: "#f59e0b" }, danger: { bg: "#300", border: "#600", color: "#fc8181" }, info: { bg: "#0a1a3a", border: "#1e3a6e", color: "#93c5fd" } }[type] || {};
//     return (
//         <div style={{ position: "absolute", top: 60, right: 16, padding: "8px 14px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12, color: c.color, zIndex: 200, animation: "slideIn .2s ease" }}>
//             {msg}
//         </div>
//     );
// }



//======================================== x  =============================


import React, { useState, useEffect, useCallback } from "react";
import {
    useStartTestQuery, useSubmitScenarioAnswerMutation, useSubmitMcqAnswersMutation,
    useSubmitCodingMutation, useRunCodingMutation, useLazyRunCodingStatusQuery
} from "../../redux/services/userApi";
import { useMemo } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");
const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
const STORAGE_KEY = "ebench_exam_v2";

// ─── Default boilerplate per language ─────────────────────────────────────────
// Used as a fallback when the backend doesn't supply per-language templates
// for a question (see "Backend response shape" note near the bottom of this
// file for how to make the backend drive this instead).

const DEFAULT_TEMPLATES = {
    python: `def solve():
    # Read input from stdin
    # Write your solution here
    pass

if __name__ == "__main__":
    solve()
`,
    javascript: `function solve(input) {
  // Write your solution here

}

const input = require('fs').readFileSync('/dev/stdin', 'utf8');
console.log(solve(input));
`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here

    }
}
`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}
`,
};

// Resolve the starter code for a given question + language.
// Priority: backend-supplied per-language template (q.templateCode as an
// object keyed by language) > backend-supplied single template (legacy
// string, used only for the first/default language) > client-side default.
function resolveTemplate(q, lang) {
    if (q?.templateCode && typeof q.templateCode === "object") {
        return q.templateCode[lang] ?? DEFAULT_TEMPLATES[lang];
    }
    if (q?.templateCode && typeof q.templateCode === "string" && lang === "python") {
        return q.templateCode; // legacy single-template behavior
    }
    return DEFAULT_TEMPLATES[lang];
}


export function buildSectionsFromApiResponse(apiData = {}, durations = {}) {
    const {
        mcq_questions = [],
        scenario_questions = [],
        coding_questions = [],
    } = apiData;

    const sections = [];

    if (mcq_questions.length > 0) {
        sections.push({
            id: "mcq",
            name: "MCQ",
            type: "mcq",
            color: "#3b82f6",
            minutes: durations.mcq ?? 20,
            questions: mcq_questions.map((q) => ({
                id: q.id,
                text: q.question,
                options: [
                    { label: "A", text: q.option_a },
                    { label: "B", text: q.option_b },
                    { label: "C", text: q.option_c },
                    { label: "D", text: q.option_d },
                ],
            })),
        });
    }

    if (scenario_questions.length > 0) {
        sections.push({
            id: "scenario",
            name: "Scenario",
            type: "scenario",
            color: "#8b5cf6",
            minutes: durations.scenario ?? 20,
            questions: scenario_questions.map((q) => ({
                id: q.id,
                text: q.question,
                options: [
                    { label: "A", text: q.option_a },
                    { label: "B", text: q.option_b },
                    { label: "C", text: q.option_c },
                    { label: "D", text: q.option_d },
                ],
            })),
        });
    }

    if (coding_questions.length > 0) {
        sections.push({
            id: "coding",
            name: "Coding",
            type: "code",
            color: "#f59e0b",
            minutes: durations.coding ?? 30,
            questions: coding_questions.map((q) => ({
                id: q.id,
                title: q.title,
                description: q.description,
                // templateCode can be either:
                //  - a string (legacy, treated as the python template), or
                //  - an object keyed by language: { python, javascript, java, cpp }
                templateCode: q.template_code,
                testCases: q.test_cases ?? [],
            })),
        });
    }

    return sections;
}

// ─── Build initial exam state ─────────────────────────────────────────────────

function buildInitialState(sections) {
    const saved = (() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (_) { return null; }
    })();

    // If saved state has matching section count, resume it
    if (saved && saved.sectionTime?.length === sections.length) return saved;

    return {
        currentSection: 0,
        currentQ: 0,
        // answers: { [sectionId]: { [questionId]: selectedLabel | text } }
        answers: Object.fromEntries(sections.map((s) => [s.id, {}])),
        // code: { [questionIndex]: { language, sources: { [language]: source }, results, running } }
        code: {},
        sectionStatus: sections.map((_, i) => (i === 0 ? "active" : "locked")),
        sectionTime: sections.map((s) => s.minutes * 60),
        overallTime: sections.reduce((a, s) => a + s.minutes, 0) * 60,
        violations: 0,
        darkMode: true,
    };
}

// ─── ExamPortal ───────────────────────────────────────────────────────────────
// Props:
//   apiData   — raw response from your backend (the shape you showed)
//   candidate — { name, rollNo, examTitle }
//   durations — { mcq: 20, scenario: 20, coding: 30 }  (minutes, optional)
//   onSubmit  — (payload) => void  called with final answers on submit

const dummyApiData = {
    "status": "ok",
    "candidate": {
        "name": "dino joshi",
        "email": "jiyavo6@jc.com",
        "level": "LEVEL_002",
        "level_id": "LEVEL_002",
        "mcq_total_count": 6,
        "coding_total_count": 2,
        "scenario_total_count": 3
    },
    "time_allocation": {
        "mcq_minutes": 12,
        "total_minutes": 65,
        "coding_minutes": 35,
        "scenario_minutes": 18
    },
    "mcq_questions": [
        {
            "id": 547,
            "question": "What is the average time complexity of searching an element in a list?",
            "option_a": "O(1)",
            "option_b": "O(log n)",
            "option_c": "O(n)",
            "option_d": "O(n log n)"
        },
        {
            "id": 548,
            "question": "Which data structure is suitable for implementing a stack?",
            "option_a": "List",
            "option_b": "Dictionary",
            "option_c": "Set",
            "option_d": "Tuple"
        },
        {
            "id": 549,
            "question": "What is the time complexity of the append operation in a Python list?",
            "option_a": "O(1)",
            "option_b": "O(log n)",
            "option_c": "O(n)",
            "option_d": "O(n log n)"
        },
        {
            "id": 550,
            "question": "Which algorithm is used to find the maximum or minimum element in a list?",
            "option_a": "Linear Search",
            "option_b": "Binary Search",
            "option_c": "Depth-First Search",
            "option_d": "Breadth-First Search"
        },
        {
            "id": 551,
            "question": "What is the space complexity of a Python list?",
            "option_a": "O(1)",
            "option_b": "O(log n)",
            "option_c": "O(n)",
            "option_d": "O(n log n)"
        },
        {
            "id": 552,
            "question": "Which data structure is suitable for implementing a queue?",
            "option_a": "List",
            "option_b": "Dictionary",
            "option_c": "Set",
            "option_d": "Tuple"
        }
    ],
    "coding_questions": [
        {
            "id": 186,
            "title": "Find the First Duplicate in an Array",
            "description": "Given an array of integers, find the first duplicate element. If no duplicate is found, return -1.",
            "templates": {
                "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Write solution\n    return 0;\n}\n",
                "java": "import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        // Write solution\n    }\n}\n",
                "python": "def solve():\n    # Read input from stdin\n    pass\n",
                "javascript": "function solve() {\n  // Read input\n}\n"
            },
            "default_language": "python",
            "test_cases": [
                {
                    "input": "5\n1 2 3 4 2",
                    "expected_output": "2"
                }
            ]
        },
        {
            "id": 187,
            "title": "Maximum Subarray Sum",
            "description": "Given an array of integers, find the maximum contiguous subarray sum.",
            "templates": {
                "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Write solution\n    return 0;\n}\n",
                "java": "import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        // Write solution\n    }\n}\n",
                "python": "def solve():\n    # Read input from stdin\n    pass\n",
                "javascript": "function solve() {\n  // Read input\n}\n"
            },
            "default_language": "python",
            "test_cases": [
                {
                    "input": "5\n-2 1 -3 4 -1 2 1 -5 4",
                    "expected_output": "6"
                }
            ]
        }
    ],
    "scenario_questions": [
        {
            "id": 102,
            "title": "Delayed Customer Order",
            "situation": "A customer calls in to report that their order, which was promised to be delivered within 24 hours, has not arrived after 3 days. The customer is understandably frustrated and is threatening to switch to a competitor.",
            "question": "How would you handle this situation, and what steps would you take to rectify the issue and retain the customer?",
            "skill_tag": "Customer Service Recovery",
            "difficulty": "Fresher"
        },
        {
            "id": 103,
            "title": "Incorrect Product Sent",
            "situation": "A customer receives an email from a client complaining that the Python-based software solution your team delivered contains a critical bug that is causing their business operations to stall. The client demands immediate resolution.",
            "question": "How would you prioritize and address the client's concerns, ensuring a swift resolution and maintaining a positive relationship?",
            "skill_tag": "Customer-Centric Thinking",
            "difficulty": "Fresher"
        },
        {
            "id": 104,
            "title": "Miscommunication with Client",
            "situation": "During a project discussion, a client expresses dissatisfaction with the project timeline, claiming it was not clearly communicated. Your team believes the timeline was discussed and agreed upon earlier.",
            "question": "How would you handle this miscommunication, ensure the client's concerns are addressed, and align on a mutually acceptable project timeline?",
            "skill_tag": "Service Recovery",
            "difficulty": "Fresher"
        }
    ]
}



export default function ExamPortal({
    candidate = { name: "Candidate", rollNo: "—", examTitle: "Campus Assessment" },
    durations = {},
    onSubmit,
}) {
    const { data: apiResponse, isLoading, error } = useStartTestQuery();
    // let apiResponse = null;
    const effectiveData = apiResponse || dummyApiData;
    // let isLoading = false;
    const apiDurations = {
        mcq: effectiveData.time_allocation?.mcq_minutes,
        scenario: effectiveData.time_allocation?.scenario_minutes,
        coding: effectiveData.time_allocation?.coding_minutes,
    };
    const mergedDurations = { ...apiDurations, ...durations };
    // const sections = buildSectionsFromApiResponse(effectiveData, mergedDurations);
    const sections = useMemo(
        () => buildSectionsFromApiResponse(effectiveData, mergedDurations),
        [effectiveData, mergedDurations]   // only recompute when the raw API data changes
    );

    const [state, setState] = useState(null);
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);
    const [submitMcq] = useSubmitMcqAnswersMutation();
    const [submitScenario] = useSubmitScenarioAnswerMutation();
    const [submitCoding] = useSubmitCodingMutation();

    console.log("state-ful", state);

    const persist = useCallback((s) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) { }
        setLastSaved(new Date());
    }, []);

    useEffect(() => {
        if (!sections) return;
        if (state && state.sectionTime?.length === sections.length) return;
        setState(buildInitialState(sections));
    }, [sections]);

    const {
        currentSection = 0,
        currentQ = 0,
        answers = {},
        code = {},
        sectionStatus = [],
        sectionTime = [],
        overallTime = 0,
        violations = 0,
        darkMode = true,
    } = state || {};

    const sec = sections?.[currentSection];


    // ── Section timer: ticks every second, auto-advances when it hits 0 ──────────
    useEffect(() => {
        if (!state) return;
        if (state.sectionStatus[state.currentSection] !== "active") return;

        const interval = setInterval(() => {
            setState((prev) => {
                if (!prev) return prev;

                const curSecTime = prev.sectionTime[prev.currentSection];

                // Section timer hit 0 → auto move to next section
                if (curSecTime <= 1) {
                    const newSectionTime = [...prev.sectionTime];
                    newSectionTime[prev.currentSection] = 0;

                    const newStatus = [...prev.sectionStatus];
                    newStatus[prev.currentSection] = "done";

                    const nextIdx = prev.currentSection + 1;
                    const newOverall = Math.max(prev.overallTime - 1, 0);

                    if (nextIdx >= sections.length) {
                        // No more sections — show submitted modal
                        setModal("submitted");
                        return {
                            ...prev,
                            sectionTime: newSectionTime,
                            sectionStatus: newStatus,
                            overallTime: newOverall,
                        };
                    }

                    newStatus[nextIdx] = "active";

                    showToast(`Time up — moved to ${sections[nextIdx].name}`, "warn");

                    return {
                        ...prev,
                        sectionTime: newSectionTime,
                        sectionStatus: newStatus,
                        currentSection: nextIdx,
                        currentQ: 0,
                        overallTime: newOverall,
                    };
                }

                // Normal tick: count down both section timer and overall timer
                const newSectionTime = [...prev.sectionTime];
                newSectionTime[prev.currentSection] = curSecTime - 1;

                return {
                    ...prev,
                    sectionTime: newSectionTime,
                    overallTime: Math.max(prev.overallTime - 1, 0),
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [state?.currentSection, state?.sectionStatus[state?.currentSection]]);




    // ── Actions ──────────────────────────────────────────────────────────────

    const selectOption = useCallback(({ opt, q }) => {
        setState((prev) => ({
            ...prev,
            answers: { ...prev.answers, [sec.id]: { ...prev.answers[sec.id], [q?.id]: opt?.label } },
        }));
    }, [sec?.id]);

    // field: "language" | "source" | "results" | "running"
    const handleCodeChange = (field, val) => {
        // debugger;
        setState((prev) => {
            const qIdx = prev.currentQ;
            const codingSection = sections.find((s) => s.id === "coding");
            const qId = codingSection?.questions[qIdx]?.id;
            const existing = prev.code[qIdx] || { language: "python", sources: {}, results: null, running: false };
            const updated = {
                ...existing,
                question_id: existing.question_id || qId
            };

            // debugger;
            if (field === "language") {
                return { ...prev, code: { ...prev.code, [qIdx]: { ...updated, language: val } } };
            }
            if (field === "source") {
                return {
                    ...prev,
                    code: {
                        ...prev.code,
                        [qIdx]: { ...updated, sources: { ...updated.sources, [updated.language]: val } },
                    },
                };
            }
            if (field === "results") {
                return { ...prev, code: { ...prev.code, [qIdx]: { ...updated, results: val, running: false } } };
            }
            if (field === "running") {
                return { ...prev, code: { ...prev.code, [qIdx]: { ...updated, running: val } } };
            }
            return prev;
        });
    };

    console.log("state-->", state);

    const goToQ = (idx) => setState((prev) => ({ ...prev, currentQ: idx }));
    const prevQ = () => currentQ > 0 && goToQ(currentQ - 1);
    const nextQ = () => currentQ < sec.questions.length - 1 && goToQ(currentQ + 1);

    const clickSection = (si) => {
        const st = sectionStatus[si];
        if (st === "locked") showToast("Complete the current section first.", "warn");
        if (st === "done") showToast("Completed sections cannot be revisited.", "danger");
    };

    const showToast = (msg, type) => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
    };

    const totalAnswered = () => {
        let t = 0;
        sections?.forEach((s) => {
            if (s.type !== "code") t += Object.keys(state?.answers[s.id] || {}).length;
            else t += Object.keys(state?.code || {}).length;
        });
        return t;
    };

    const totalQ = sections.reduce((a, s) => a + s.questions.length, 0);

    const st = state?.sectionTime[state?.currentSection];
    const timerCls = st < 120 ? "crit" : st < 300 ? "warn" : "";
    const otCls = state?.overallTime < 300 ? "crit" : state?.overallTime < 600 ? "warn" : "";

    // ── Theme ────────────────────────────────────────────────────────────────

    const T = useMemo(() => (
        state?.darkMode
            ? { appBg: "#0a0f1e", navBg: "#0f1523", sidebarBg: "#141c2e", cardBg: "#1a2238", border: "#2a3555", text1: "#e8eaf0", text2: "#8b95b0", text3: "#4a5568", codeBg: "#0d1526", accentDim: "#1e3a6e" }
            : { appBg: "#f0f4f8", navBg: "#ffffff", sidebarBg: "#f5f7fa", cardBg: "#ffffff", border: "#dde2ee", text1: "#1a202c", text2: "#4a5568", text3: "#718096", codeBg: "#1e293b", accentDim: "#dbeafe" }
    ), [state?.darkMode])

    const accent = "#3b82f6";

    const btn = (v) => {
        const base = { padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none" };
        return {
            primary: { ...base, background: accent, color: "#fff" },
            outline: { ...base, background: "transparent", border: `1px solid ${T.border}`, color: T.text2 },
            success: { ...base, background: "#052010", border: "1px solid #0a4020", color: "#22c55e" },
            danger: { ...base, background: "#300", border: "1px solid #600", color: "#fc8181" },
            warn: { ...base, background: "#3a2000", border: "1px solid #7a4500", color: "#f59e0b" },
        }[v] || base;
    };

    const handleNext = () => {
        if (currentQ < sec.questions.length - 1) {
            goToQ(currentQ + 1);
        } else {
            setModal("nextSection");
        }
    };

    // Violation tracking
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

    const advanceSection = useCallback(() => {
        setState((prev) => {
            const next = { ...prev, sectionStatus: [...prev.sectionStatus] };
            next.sectionStatus[prev.currentSection] = "done";
            const nextIdx = prev.currentSection + 1;
            if (nextIdx >= sections.length) {
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
    }, [sections, persist, currentSection]);


    if (isLoading) {
        return <>Loading Please Wait...</>
    }

    // ── Render  ───────────────────── Render ──────────────────────────────────────

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.appBg, color: T.text1, fontSize: 14, fontFamily: "system-ui,sans-serif", overflow: "hidden", position: "relative" }}>

            {/* Topbar */}
            <div style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>e<span style={{ color: accent }}>Bench</span> <span style={{ color: T.text2, fontWeight: 400 }}>Campus</span></div>
                    <div style={{ width: 1, height: 20, background: T.border }} />
                    <div style={{ fontSize: 12, color: T.text2 }}>{candidate.name} &nbsp;|&nbsp; {candidate.rollNo} &nbsp;|&nbsp; {candidate.examTitle}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: "#2a1515", border: "1px solid #5a2020", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#fc8181" }}>
                        Violations: {state?.violations}
                    </div>
                    <TimerPill label="Section" value={fmt(st)} cls={timerCls} T={T} />
                    <TimerPill label="Overall" value={fmt(state?.overallTime)} cls={otCls} T={T} dim />
                    <button style={btn("outline")} onClick={() => setState((p) => ({ ...p, darkMode: !p.darkMode }))}>{state?.darkMode ? "☀" : "🌙"}</button>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* Sidebar */}
                <div style={{ width: 220, background: T.sidebarBg, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px", color: T.text2 }}>Sections</div>
                    <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
                        {sections.map((s, si) => {
                            const isActive = si === state?.currentSection && state?.sectionStatus[si] === "active";
                            const isDone = state?.sectionStatus[si] === "done";
                            const isLocked = state?.sectionStatus[si] === "locked";
                            const sAns = s.type !== "code" ? Object.keys(state?.answers[s.id] || {}).length : Object.keys(state?.code || {}).length;
                            return (
                                <div key={s.id} style={{ borderRadius: 8, marginBottom: 4, overflow: "hidden" }}>
                                    <div onClick={() => clickSection(si)} style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: isActive ? "default" : "pointer", background: isActive ? T.accentDim : isDone ? (darkMode ? "#0a2010" : "#f0fdf4") : "transparent", opacity: isLocked ? .5 : 1 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                                        <div style={{ flex: 1, fontWeight: 500 }}>{s.name}</div>
                                        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: isActive ? accent : isDone ? (darkMode ? "#0a3020" : "#dcfce7") : T.border, color: isActive ? "#fff" : isDone ? "#22c55e" : T.text3 }}>
                                            {isActive ? "Active" : isDone ? "Done" : "🔒"}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <div style={{ padding: "4px 10px 8px", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3 }}>
                                            {s.questions.map((pi, qi) => {
                                                const isAns = s.type !== "code" ? state?.answers[s.id]?.[pi?.id] !== undefined : state?.code[qi] !== undefined;
                                                const isCur = qi === state?.currentQ;
                                                return (
                                                    <div key={qi} onClick={() => goToQ(qi)} style={{ width: 20, height: 20, borderRadius: 4, fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${isCur ? "#f59e0b" : isAns ? accent : T.border}`, background: isAns ? accent : T.cardBg, color: isAns ? "#fff" : isCur ? "#f59e0b" : T.text2 }}>
                                                        {qi + 1}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.text2, marginBottom: 6 }}>
                            <span>Overall Progress</span><span>{Math.round((totalAnswered() / totalQ) * 100)}%</span>
                        </div>
                        <div style={{ background: T.border, borderRadius: 4, height: 5 }}>
                            <div style={{ width: `${Math.round((totalAnswered() / totalQ) * 100)}%`, background: accent, borderRadius: 4, height: 5, transition: "width .3s" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.text2, marginTop: 6 }}>
                            <span>{totalAnswered()} answered</span><span>{totalQ} total</span>
                        </div>
                    </div>
                </div>

                {/* Main--- */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {state?.sectionStatus[state?.currentSection] === "done" ? (
                        <CompletedSection sec={sec} T={T} />
                    ) : (
                        <>
                            {/* Section banner---->  */}
                            <div style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 4, height: 28, borderRadius: 2, background: sec?.color }} />
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>{sec?.name}</div>
                                        <div style={{ fontSize: 11, color: T.text2 }}>Q{state?.currentQ + 1} of {sec?.questions?.length}</div>
                                    </div>
                                </div>
                                <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 500, color: timerCls === "crit" ? "#ef4444" : timerCls === "warn" ? "#f59e0b" : T.text1, animation: timerCls === "crit" ? "pulse 1s infinite" : "none" }}>
                                    {fmt(st)}
                                </span>
                            </div>

                            {/* Question area */}
                            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                                {sec?.type === "mcq" && (
                                    <MCQQuestion
                                        sec={sec}
                                        currentQ={currentQ}
                                        answers={answers}
                                        onSelect={selectOption}
                                        T={T}
                                        accent={accent}
                                    />
                                )}
                                {sec?.type === "scenario" && (
                                    <ScenarioQuestion
                                        sec={sec}
                                        currentQ={currentQ}
                                        answers={answers}
                                        onAnswer={(q, text) => {
                                            setState((prev) => ({
                                                ...prev,
                                                answers: {
                                                    ...prev.answers,
                                                    [sec.id]: { ...(prev.answers[sec.id] || {}), [q.id]: text },
                                                },
                                            }));
                                        }}
                                        T={T}
                                        accent={accent}
                                    />
                                )}
                                {sec?.type === "code" && (
                                    <CodeQuestion
                                        sec={sec}
                                        currentQ={currentQ}
                                        code={code}
                                        onChange={handleCodeChange}
                                        T={T}
                                        lastSaved={lastSaved}
                                    />
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{ display: "flex", gap: 10, padding: "10px 20px", borderTop: `1px solid ${T.border}`, background: T.navBg, flexShrink: 0 }}>
                                <button style={btn("outline")} onClick={prevQ}>← Prev</button>
                                <button style={btn("warn")} onClick={() => showToast("Marked for review", "warn")}>🔖 Mark</button>
                                <div style={{ flex: 1 }} />
                                <button style={btn("outline")} onClick={nextQ}>Next →</button>
                                <button
                                    style={btn(currentSection === sections.length - 1 ? "danger" : "success")}
                                    onClick={() => setModal(currentSection === sections.length - 1 ? "submit" : "nextSection")}
                                >
                                    {currentSection === sections.length - 1 ? "Submit Test" : "Next Section →"}
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
                <Modal icon="⏩" title={`Move to ${sections[currentSection + 1]?.name}?`}
                    body="All answers are saved. You cannot return to this section."
                    confirm="Next Section →" confirmStyle={btn("primary")}
                    onConfirm={advanceSection}
                    onCancel={() => setModal(null)} />
            )}
            {modal === "submit" && (
                <Modal icon="📋" title="Submit Test?"
                    body={`You've answered ${totalAnswered()} of ${totalQ} questions. This cannot be undone.`}
                    confirm="Submit Test" confirmStyle={btn("danger")}
                    onCancel={() => setModal(null)}
                    onConfirm={async () => {
                        persist(state);
                        try {
                            const mcqPayload = {
                                answers: Object.entries(answers.mcq || {}).map(([qid, selected]) => ({
                                    question_id: qid,
                                    selected_option: selected,
                                }))
                            };
                            const scenarioPayload = {
                                answers: Object.entries(answers.scenario || {}).map(([qid, text]) => ({
                                    question_id: qid,
                                    candidate_answer: text,
                                }))
                            };
                            const codingPayload = {
                                submissions: Object.entries(code).map(([idx, val]) => ({
                                    question_id: val.question_id || sections.find(s => s.id === "coding")?.questions[idx]?.id,
                                    language: val.language,
                                    submitted_code: val.sources?.[val.language] || "",
                                }))
                            };
                            const res= await Promise.all([
                                submitMcq(mcqPayload).unwrap(),
                                submitScenario(scenarioPayload).unwrap(),
                                submitCoding(codingPayload).unwrap()
                            ]);
                            console.log('Submit responses:', res);
                            setModal("submitted");
                            
                            setTimeout(() => {
                                localStorage.clear();
                                window.location.href = "/";
                            },5000);


                        } catch (e) {
                            console.error('Submit failed', e);
                        }
                    }} />
            )}
            {modal === "submitted" && (
                <Modal icon="🎉" title="Test Submitted!"
                    body={`All responses saved. ${totalAnswered()}/${totalQ} questions answered.`}
                    confirm={null} onCancel={null} onConfirm={null} />
            )}

            <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TimerPill = React.memo(function TimerPill({ label, value, cls, T, dim }) {
    const color = cls === "crit" ? "#ef4444" : cls === "warn" ? "#f59e0b" : T.text1;
    return (
        <div style={{ background: T.cardBg, border: `1px solid ${dim ? "#1e3a6e" : T.border}`, borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</span>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 500, color, animation: cls === "crit" ? "pulse 1s infinite" : "none" }}>{value}</span>
        </div>
    );
})

const MCQQuestion = React.memo(function MCQQuestion({ sec, currentQ, answers, onSelect, T, accent }) {
    const q = sec.questions[currentQ];
    if (!q) return null;
    const selected = answers[sec.id]?.[q.id];
    const badgeColor = sec.type === "scenario" ? { bg: "#2d1b69", color: "#a78bfa" } : { bg: "#1e3a6e", color: accent };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: T.text2 }}>
                    Question <span style={{ color: accent, fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions.length}
                </div>
                <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: badgeColor.bg, color: badgeColor.color }}>
                    {sec.type === "scenario" ? "Scenario" : "MCQ"}
                </div>
            </div>
            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 14, lineHeight: 1.7, color: T.text1 }}>
                {q.text}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt, i) => (
                    <button key={i} onClick={() => onSelect({ opt, q })} style={{ background: selected === opt?.label ? T.accentDim : T.cardBg, border: `1px solid ${selected === opt?.label ? accent : T.border}`, borderRadius: 8, padding: "10px 14px", textAlign: "left", color: T.text1, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, background: selected === opt?.label ? accent : "transparent", border: `1px solid ${selected === opt?.label ? accent : T.border}`, color: selected === opt?.label ? "#fff" : T.text2 }}>
                            {opt?.label}
                        </div>
                        {opt?.text}
                    </button>
                ))}
            </div>
        </>
    );
}
);

// const CodeQuestion = React.memo(function CodeQuestion({ sec, currentQ, code, onChange, T, lastSaved }) {
//     const [runCoding] = useRunCodingMutation();
//     const [triggerRunStatus] = useLazyRunCodingStatusQuery();

//     const q = sec.questions[currentQ];
//     if (!q) return null;

//     const entry = code[currentQ] || { language: "python", sources: {}, results: null, running: false };
//     const lang = entry.language || "python";
//     const source = entry.sources?.[lang] ?? resolveTemplate(q, lang);

//     const handleLangChange = (e) => onChange("language", e.target.value);

//     // Inside CodeQuestion — replace handleRun with this
//     const handleRun = async () => {
//         onChange("running", true);
//         onChange("results", null);

//         try {
//             // ── STEP 1: Submit code to backend ──────────────────────────
//             const submitRes = await runCoding({
//                 "submissions": [
//                     {
//                         question_id: q.id,
//                         language: lang,
//                         submitted_code: source,
//                         test_cases: q.testCases.map((tc) => ({
//                             input: tc.input,
//                             expected_output: tc.expected_output,
//                         }))
//                     }
//                 ]

//             }).unwrap();

//             /* this is api response for submitRes:
//             {
//     "status": "ok",
//     "results": {
//         "question_id": 181,
//         "submission_id": 36
//     },
//     "message": "Code queued for preview run"
// }
//             */

//             debugger;

//             const submission_id = submitRes?.results?.submission_id;

//             if (!submission_id) throw new Error("No submission_id returned");

//             // ── STEP 2: Poll status every 1.5 seconds until done ────────
//             const MAX_POLLS = 20; // 20 × 1.5s = 30s max wait

//             for (let i = 0; i < MAX_POLLS; i++) {
//                 // Wait 1.5 seconds before each check
//                 await new Promise((r) => setTimeout(r, 1500));

//                 const statusRes = await triggerRunStatus({ submission_id }).unwrap();

//                 /* statusRes: i;m getting in response
//                 {
//     "status": "completed",
//     "is_ready": true,
//     "score": 0,
//     "passed": 0,
//     "total": 1,
//     "test_results": [
//         {
//             "test_case_number": 1,
//             "input": "",
//             "expected_output": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
//             "actual_output": "",
//             "status": "fail",
//             "error_message": null
//         }
//     ]
// }
//                 */
//                 debugger;
//                 if (statusRes.status === "completed") {
//                     // ✅ Got results — show them
//                     onChange("results", statusRes.results);
//                     return; // stop polling
//                 }

//                 if (statusRes.status === "error") {
//                     // ❌ Backend execution error
//                     throw new Error(statusRes.error_message || "Execution failed");
//                 }

//                 // status === "running" or "queued" → loop again
//             }

//             throw new Error("Timed out waiting for result");

//         } catch (err) {
//             console.error("Run failed:", err);
//             // Show error in results panel
//             onChange("results", q.testCases.map((tc) => ({
//                 input: tc.input,
//                 expected_output: tc.expected_output,
//                 actual_output: `Error: ${err.message}`,
//                 passed: false,
//                 runtime_ms: 0,
//             })));
//         } finally {
//             onChange("running", false);
//         }
//     };

//     // const handleRun = async () => {
//     //     onChange("running", true);
//     //     try {
//     //         // TODO: pull the real auth token from wherever your app stores it
//     //         // (e.g. Redux auth slice — same place CampusAssessment.jsx reads the JWT)
//     //         const authToken = localStorage.getItem("ebench_jwt");
//     //         const results = await runCodeOnBackend(source, lang, q.testCases, q.id, authToken);
//     //         onChange("results", results);
//     //     } catch (err) {
//     //         console.error("Run failed:", err);
//     //         onChange("results", q.testCases.map((tc) => ({
//     //             input: tc.input,
//     //             expected_output: tc.expected_output,
//     //             actual_output: `Error: ${err.message}`,
//     //             passed: false,
//     //             runtime_ms: 0,
//     //         })));
//     //     }
//     // };

//     return (
//         <>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//                 <div style={{ fontSize: 12, color: T.text2 }}>
//                     Problem <span style={{ color: "#f59e0b", fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions.length}
//                 </div>
//                 <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: "#3a2000", color: "#f59e0b" }}>Coding</div>
//             </div>

//             {/* Problem statement */}
//             <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
//                 <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 14 }}>{q.title}</div>
//                 <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.7 }}>{q.description}</div>
//             </div>

//             {/* Sample test cases (static reference, always visible) */}
//             {q.testCases.length > 0 && (
//                 <div style={{ marginBottom: 12 }}>
//                     <div style={{ fontSize: 11, color: T.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Sample Test Cases</div>
//                     {q.testCases.map((tc, i) => (
//                         <div key={i} style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                             <div>
//                                 <div style={{ fontSize: 10, color: T.text2, marginBottom: 4 }}>INPUT</div>
//                                 <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#93c5fd", whiteSpace: "pre-wrap", margin: 0 }}>{tc.input}</pre>
//                             </div>
//                             <div>
//                                 <div style={{ fontSize: 10, color: T.text2, marginBottom: 4 }}>EXPECTED OUTPUT</div>
//                                 <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#4ade80", whiteSpace: "pre-wrap", margin: 0 }}>{tc.expected_output}</pre>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Editor toolbar */}
//             <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
//                 <select
//                     value={lang}
//                     onChange={handleLangChange}
//                     style={{ background: T.cardBg, border: `1px solid ${T.border}`, color: T.text1, borderRadius: 6, padding: "4px 8px", fontSize: 11 }}
//                 >
//                     <option value="python">Python</option>
//                     <option value="javascript">JavaScript</option>
//                     <option value="java">Java</option>
//                     <option value="cpp">C++</option>
//                 </select>

//                 <button
//                     onClick={handleRun}
//                     disabled={entry.running}
//                     style={{
//                         padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 500,
//                         background: entry.running ? T.border : "#22c55e", color: entry.running ? T.text2 : "#06210f",
//                         border: "none", cursor: entry.running ? "default" : "pointer",
//                     }}
//                 >
//                     {entry.running ? "Running..." : "▶ Run"}
//                 </button>

//                 {lastSaved && (
//                     <div style={{ fontSize: 10, color: T.text2, display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
//                         <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
//                         Saved {lastSaved.toLocaleTimeString()}
//                     </div>
//                 )}
//             </div>

//             {/* Code editor */}
//             <textarea
//                 key={lang} // remount on language switch so cursor/scroll resets cleanly
//                 value={source}
//                 onChange={(e) => onChange("source", e.target.value)}
//                 spellCheck={false}
//                 style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 10, fontFamily: "monospace", fontSize: 13, color: "#e2e8f0", padding: 14, height: 240, width: "100%", resize: "vertical", outline: "none", lineHeight: 1.6 }}
//             />

//             {/* Run results — LeetCode/GFG style */}
//             {entry.results && (
//                 <div style={{ marginTop: 12 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
//                         <div style={{ fontSize: 11, color: T.text2, textTransform: "uppercase", letterSpacing: ".5px" }}>Run Results</div>
//                         <div style={{ fontSize: 11, fontWeight: 500, color: entry.results.every(r => r.passed) ? "#22c55e" : "#f59e0b" }}>
//                             {entry.results.filter(r => r.passed).length} / {entry.results.length} passed
//                         </div>
//                     </div>
//                     {entry.results.map((r, i) => (
//                         <div key={i} style={{
//                             background: T.codeBg, border: `1px solid ${r.passed ? "#0a4020" : "#5a2020"}`,
//                             borderRadius: 8, padding: "10px 12px", marginBottom: 6,
//                         }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//                                 <span style={{ fontSize: 11, fontWeight: 500, color: r.passed ? "#22c55e" : "#fc8181" }}>
//                                     {r.passed ? "✓ Passed" : "✗ Failed"} — Case {i + 1}
//                                 </span>
//                                 <span style={{ fontSize: 10, color: T.text2 }}>{r.runtime_ms} ms</span>
//                             </div>
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
//                                 <div>
//                                     <div style={{ fontSize: 10, color: T.text2, marginBottom: 2 }}>INPUT</div>
//                                     <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#93c5fd", whiteSpace: "pre-wrap", margin: 0 }}>{r.input}</pre>
//                                 </div>
//                                 <div>
//                                     <div style={{ fontSize: 10, color: T.text2, marginBottom: 2 }}>EXPECTED</div>
//                                     <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#4ade80", whiteSpace: "pre-wrap", margin: 0 }}>{r.expected_output}</pre>
//                                 </div>
//                                 <div>
//                                     <div style={{ fontSize: 10, color: T.text2, marginBottom: 2 }}>ACTUAL</div>
//                                     <pre style={{ fontFamily: "monospace", fontSize: 11, color: r.passed ? "#4ade80" : "#fc8181", whiteSpace: "pre-wrap", margin: 0 }}>{r.actual_output}</pre>
//                                 </div>
//                             </div>
//                             {r.stderr && (
//                                 <div style={{ marginTop: 6 }}>
//                                     <div style={{ fontSize: 10, color: T.text2, marginBottom: 2 }}>STDERR</div>
//                                     <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#fc8181", whiteSpace: "pre-wrap", margin: 0 }}>{r.stderr}</pre>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </>
//     );
// })

const CodeQuestion = React.memo(function CodeQuestion({ sec, currentQ, code, onChange, T, lastSaved }) {
    const [runCoding, { isLoading: isLoadingRunCoding }] = useRunCodingMutation();
    const [triggerRunStatus,{isLoading: isLoadingRunStatus}] = useLazyRunCodingStatusQuery();

    const q = sec.questions[currentQ];
    // console.log("qqqq", q);
    if (!q) return null;

    const rawEntry = code[currentQ] || { language: "python", sources: {}, results: null, running: false };
    const entry = {
        ...rawEntry,
        question_id: rawEntry.question_id || q.id
    };
    const lang = entry.language || "python";
    const source = entry.sources?.[lang] ?? resolveTemplate(q, lang);

    const handleLangChange = (e) => onChange("language", e.target.value);
    const [isRunningTest, setIsRunningTest] = React.useState(false);
    const runningState = isRunningTest || isLoadingRunCoding || isLoadingRunStatus;

    // ── LeetCode-style testcase panel state ────────────────────────────────
    // "testcase" = static sample inputs, "result" = last run's actual outputs
    const [viewMode, setViewMode] = React.useState("testcase");
    const [activeCase, setActiveCase] = React.useState(0);

    // Reset the panel whenever the question changes (new sample cases, no results yet)
    React.useEffect(() => {
        setViewMode("testcase");
        setActiveCase(0);
    }, [currentQ]);

    // Clamp activeCase if it goes out of range for the current data set
    const caseCount = viewMode === "result" && entry.results ? entry.results.length : q.testCases.length;
    React.useEffect(() => {
        if (activeCase >= caseCount) setActiveCase(0);
    }, [caseCount, activeCase]);

    const handleRun = async () => {
        setIsRunningTest(true);
        onChange("running", true);
        onChange("results", null);

        try {
            // ── STEP 1: Submit code to backend ──────────────────────────
            const submitRes = await runCoding({
                submissions: [
                    {
                        question_id: q.id,
                        language: lang,
                        submitted_code: source,
                        test_cases: q.testCases.map((tc) => ({
                            input: tc.input,
                            expected_output: tc.expected_output,
                        })),
                    },
                ],
            }).unwrap();

            const submission_id = submitRes?.results?.submission_id;
            if (!submission_id) throw new Error("No submission_id returned");

            // ── STEP 2: Poll status every 1.5 seconds until done ────────
            const MAX_POLLS = 20; // 20 × 1.5s = 30s max wait

            for (let i = 0; i < MAX_POLLS; i++) {
                await new Promise((r) => setTimeout(r, 1500));
                const statusRes = await triggerRunStatus({ submission_id }).unwrap();

                if (statusRes.status === "completed") {
                    const normalized = (statusRes.test_results || []).map((r) => ({
                        input: r.input,
                        expected_output: r.expected_output,
                        actual_output: r.actual_output,
                        passed: r.status === "pass",
                        error_message: r.error_message,
                        runtime_ms: r.runtime_ms ?? null,
                    }));
                    onChange("results", normalized);
                    setViewMode("result");
                    setActiveCase(0);
                    return;
                }

                if (statusRes.status === "error") {
                    throw new Error(statusRes.error_message || "Execution failed");
                }
            }

            throw new Error("Timed out waiting for result");
        } catch (err) {
            console.error("Run failed:", err);
            onChange("results", q.testCases.map((tc) => ({
                input: tc.input,
                expected_output: tc.expected_output,
                actual_output: `Error: ${err.message}`,
                passed: false,
                runtime_ms: 0,
            })));
            setViewMode("result");
            setActiveCase(0);
        } finally {
            onChange("running", false);
            setIsRunningTest(false);
        }
    };

    const passedCount = entry.results ? entry.results.filter((r) => r.passed).length : 0;
    const allPassed = entry.results && passedCount === entry.results.length;

    // Data source for the currently selected tab
    const activeData =
        viewMode === "result" && entry.results
            ? entry.results[activeCase]
            : q.testCases[activeCase];


    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: T.text2 }}>
                    Problem <span style={{ color: "#f59e0b", fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions.length}
                </div>
                <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: "#3a2000", color: "#f59e0b" }}>Coding</div>
            </div>

            {/* Problem statement */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 14 }}>{q.title}</div>
                <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.7 }}>{q.description}</div>
            </div>

            {/* Editor toolbar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <select
                    value={lang}
                    onChange={handleLangChange}
                    style={{ background: T.cardBg, border: `1px solid ${T.border}`, color: T.text1, borderRadius: 6, padding: "4px 8px", fontSize: 11 }}
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                </select>

                <button
                    onClick={handleRun}
                    disabled={runningState}
                    style={{
                        padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                        background: runningState ? T.border : "#22c55e", color: runningState ? T.text2 : "#06210f",
                        border: "none", cursor: runningState ? "default" : "pointer",
                    }}
                >
                    {runningState ? "Running..." : "▶ Run"}
                </button>

                {lastSaved && (
                    <div style={{ fontSize: 10, color: T.text2, display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                        Saved {lastSaved.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Code editor */}
            <textarea
                key={lang} // remount on language switch so cursor/scroll resets cleanly
                value={source}
                onChange={(e) => onChange("source", e.target.value)}
                spellCheck={false}
                style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 10, fontFamily: "monospace", fontSize: 13, color: "#e2e8f0", padding: 14, height: 240, width: "100%", resize: "vertical", outline: "none", lineHeight: 1.6, marginBottom: 12 }}
            />

            {/* ── LeetCode-style Testcase / Test Result panel ─────────────────── */}
            <div style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>

                {/* Mode toggle: Testcase | Test Result */}
                <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
                    <button
                        onClick={() => { setViewMode("testcase"); setActiveCase(0); }}
                        style={{
                            padding: "9px 16px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
                            background: "transparent",
                            color: viewMode === "testcase" ? T.text1 : T.text2,
                            borderBottom: viewMode === "testcase" ? "2px solid #22c55e" : "2px solid transparent",
                        }}
                    >
                        Testcase
                    </button>
                    <button
                        onClick={() => entry.results && (setViewMode("result"), setActiveCase(0))}
                        disabled={!entry.results || runningState}
                        style={{
                            padding: "9px 16px", fontSize: 12, fontWeight: 500, border: "none",
                            cursor: entry.results && !runningState ? "pointer" : "default",
                            background: "transparent",
                            color: !entry.results ? T.text3 : viewMode === "result" ? T.text1 : T.text2,
                            borderBottom: viewMode === "result" ? "2px solid #22c55e" : "2px solid transparent",
                        }}
                    >
                        Test Result{entry.results ? ` · ${passedCount}/${entry.results.length}` : ""}
                    </button>

                    {runningState && (
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, paddingRight: 14, fontSize: 11, color: T.text2 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1s infinite" }} />
                            Running…
                        </div>
                    )}
                    {!entry.running && entry.results && (
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, paddingRight: 14, fontSize: 12, fontWeight: 500, color: allPassed ? "#22c55e" : "#fc8181" }}>
                            {allPassed ? "✓ Accepted" : "✗ Wrong Answer"}
                        </div>
                    )}
                </div>

                <div style={{ padding: 14 }}>
                    {/* Case tabs */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                        {(viewMode === "result" && entry.results ? entry.results : q.testCases).map((c, i) => {
                            const isCur = i === activeCase;
                            const statusColor =
                                viewMode === "result" && entry.results
                                    ? (entry.results[i].passed ? "#22c55e" : "#fc8181")
                                    : null;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActiveCase(i)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                                        cursor: "pointer",
                                        background: isCur ? T.cardBg : "transparent",
                                        border: `1px solid ${isCur ? (statusColor || accentBorder(T)) : T.border}`,
                                        color: isCur ? T.text1 : T.text2,
                                    }}
                                >
                                    {statusColor && (
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
                                    )}
                                    Case {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected case detail */}
                    {activeData && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div>
                                <div style={{ fontSize: 10, color: T.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>Input</div>
                                <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#93c5fd", whiteSpace: "pre-wrap", margin: 0, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px" }}>{activeData.input}</pre>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: T.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>Expected Output</div>
                                <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#4ade80", whiteSpace: "pre-wrap", margin: 0, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px" }}>{activeData.expected_output}</pre>
                            </div>

                            {viewMode === "result" && (
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                        <div style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: ".5px" }}>Actual Output</div>
                                        {activeData.runtime_ms != null && (
                                            <div style={{ fontSize: 10, color: T.text2 }}>{activeData.runtime_ms} ms</div>
                                        )}
                                    </div>
                                    <pre style={{
                                        fontFamily: "monospace", fontSize: 12, whiteSpace: "pre-wrap", margin: 0,
                                        background: T.cardBg, borderRadius: 8, padding: "8px 10px",
                                        border: `1px solid ${activeData.passed ? "#0a4020" : "#5a2020"}`,
                                        color: activeData.passed ? "#4ade80" : "#fc8181",
                                    }}>{activeData.actual_output}</pre>
                                    {activeData.error_message && (
                                        <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#fc8181", whiteSpace: "pre-wrap", margin: "6px 0 0" }}>{activeData.error_message}</pre>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
})

// Small helper: pick an accent border color for the active (unresolved) case tab
function accentBorder(T) {
    return "#f59e0b";
}

const ScenarioQuestion = React.memo(function ScenarioQuestion({ sec, currentQ, answers, onAnswer, T, accent }) {
    const q = sec.questions[currentQ];
    if (!q) return null;
    const answer = answers[sec.id]?.[q.id] ?? "";
    const badgeColor = { bg: "#2d1b69", color: "#a78bfa" };
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: T.text2 }}>
                    Question <span style={{ color: accent, fontWeight: 500 }}>{currentQ + 1}</span> / {sec.questions.length}
                </div>
                <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: badgeColor.bg, color: badgeColor.color }}>
                    Scenario
                </div>
            </div>
            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 14, lineHeight: 1.7, color: T.text1 }}>
                {q.text}
            </div>
            <textarea
                value={answer}
                onChange={(e) => onAnswer(q, e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                style={{ width: "100%", resize: "vertical", padding: 10, borderRadius: 6, border: `1px solid ${T.border}`, background: T.cardBg, color: T.text1, fontSize: 14, lineHeight: 1.5 }}
            />
        </>
    );
})

function CompletedSection({ sec, T }) {
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: T.text2 }}>
            <div style={{ fontSize: 48, color: "#22c55e" }}>✓</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: T.text1 }}>{sec.name} — Completed</div>
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
    const c = { success: { bg: "#052010", border: "#0a4020", color: "#4ade80" }, warn: { bg: "#3a2000", border: "#7a4500", color: "#f59e0b" }, danger: { bg: "#300", border: "#600", color: "#fc8181" }, info: { bg: "#0a1a3a", border: "#1e3a6e", color: "#93c5fd" } }[type] || {};
    return (
        <div style={{ position: "absolute", top: 60, right: 16, padding: "8px 14px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12, color: c.color, zIndex: 200, animation: "slideIn .2s ease" }}>
            {msg}
        </div>
    );
}

/*
─── BACKEND API RESPONSE SHAPE NEEDED ─────────────────────────────────────────

1) Coding question payload (extend your existing coding_questions array item)
   so the editor shows correct syntax per language when the candidate switches:

{
  "id": 141,
  "title": "Sum of Array Elements",
  "description": "Write a function to calculate the sum of all elements in an array.",
  "template_code": {
    "python": "def solve(arr):\n    pass\n",
    "javascript": "function solve(arr) {\n\n}\n",
    "java": "public class Main {\n    public static void main(String[] args) {\n    }\n}\n",
    "cpp": "#include <bits/stdc++.h>\nint main() {\n    return 0;\n}\n"
  },
  "test_cases": [
    { "input": "5\n1 2 3 4 5", "expected_output": "15" }
  ]
}

If template_code stays a plain string (legacy), it's only used for Python and
every other language falls back to DEFAULT_TEMPLATES in this file.

2) POST /api/code/execute  (submit run job)
   Request:
   {
     "question_id": 141,
     "language": "python",
     "source_code": "...",
     "test_cases": [{ "input": "...", "expected_output": "..." }]
   }
   Response:
   { "job_id": "abc123" }

3) GET /api/code/execute/{job_id}/status  (poll)
   Response while running:
   { "status": "queued" }  or  { "status": "running" }

   Response when done:
   {
     "status": "completed",
     "results": [
       {
         "input": "5\n1 2 3 4 5",
         "expected_output": "15",
         "actual_output": "15",
         "passed": true,
         "runtime_ms": 42,
         "stderr": null
       }
     ]
   }

   Response on failure:
   { "status": "error", "error_message": "Compilation failed: ..." }
   */