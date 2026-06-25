import { useState, useEffect, useCallback } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");
const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
const STORAGE_KEY = "ebench_exam_v2";

// ─── Transform API response → internal sections array ────────────────────────
// Call this once after your RTK Query response arrives.
// Durations are props you pass in (from exam config / backend).

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
        // answers: { [sectionId]: { [questionIndex]: selectedOptionIndex } }
        answers: Object.fromEntries(sections.map((s) => [s.id, {}])),
        // code: { [sectionId]: { [questionIndex]: { language, source } } }
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
    "mcq_questions": [
        {
            "id": 288,
            "question": "What is the primary purpose of garbage collection in Java?",
            "option_a": "To free up system resources",
            "option_b": "To improve code readability",
            "option_c": "To enhance security features",
            "option_d": "To optimize database performance"
        },
        {
            "id": 289,
            "question": "Which of the following is a benefit of using React?",
            "option_a": "Improved memory management",
            "option_b": "Enhanced security features",
            "option_c": "Virtual DOM for efficient rendering",
            "option_d": "Native support for TypeScript"
        },
        {
            "id": 290,
            "question": "What is the main advantage of using Node.js for server-side development?",
            "option_a": "Multi-threading for improved performance",
            "option_b": "Event-driven, non-blocking I/O model for efficient resource utilization",
            "option_c": "Native support for Java",
            "option_d": "Built-in support for React"
        },
        {
            "id": 291,
            "question": "Which of the following TypeScript features helps with memory management?",
            "option_a": "Type inference",
            "option_b": "Interface definitions",
            "option_c": "Null safety and optional chaining",
            "option_d": "All of the above"
        },
        {
            "id": 292,
            "question": "What is the primary goal of the MERN stack?",
            "option_a": "To provide a full-stack development framework for efficient resource utilization",
            "option_b": "To enhance security features for web applications",
            "option_c": "To improve code readability and maintainability",
            "option_d": "To support native mobile app development"
        },
        {
            "id": 293,
            "question": "Which of the following best practices helps with resource efficiency in a MERN stack application?",
            "option_a": "Using excessive caching to reduce database queries",
            "option_b": "Optimizing database queries and indexing for improved performance",
            "option_c": "Using a large number of dependencies to simplify development",
            "option_d": "Ignoring security best practices to reduce development time"
        }
    ],
    "coding_questions": [
        {
            "id": 89,
            "title": "Optimize Memory Usage",
            "description": "Write a Node.js function to optimize memory usage by removing duplicate objects from an array. The input will be an array of objects in JSON format, and the output should be the optimized array with no duplicates.",
            "template_code": "    # Read input from stdin\n    # Write your solution here\n    pass\n",
            "test_cases": [
                {
                    "input": "[{\"id\":1,\"name\":\"John\"},{\"id\":2,\"name\":\"Jane\"},{\"id\":1,\"name\":\"John\"}]",
                    "expected_output": "[{\"id\":1,\"name\":\"John\"},{\"id\":2,\"name\":\"Jane\"}]"
                }
            ]
        },
        {
            "id": 90,
            "title": "Efficient String Concatenation",
            "description": "Write a TypeScript function to efficiently concatenate a list of strings using a StringBuilder-like approach. The input will be an array of strings, and the output should be the concatenated string.",
            "template_code": "    # Read input from stdin\n    # Write your solution here\n    pass\n",
            "test_cases": [
                {
                    "input": "Hello,World,TypeScript",
                    "expected_output": "HelloWorldTypeScript"
                }
            ]
        }
    ],
    "scenario_questions": []
}

export default function ExamPortal({
    apiData = {},
    candidate = { name: "Candidate", rollNo: "—", examTitle: "Campus Assessment" },
    durations = {},
    onSubmit,
}) {
    // Use dummy data if apiData is empty
    const effectiveData = Object.keys(apiData).length ? apiData : dummyApiData;
    // Extract durations from API time_allocation if provided
    const apiDurations = {
        mcq: effectiveData.time_allocation?.mcq_minutes,
        scenario: effectiveData.time_allocation?.scenario_minutes,
        coding: effectiveData.time_allocation?.coding_minutes,
    };
    // Merge with any explicit durations prop (prop takes precedence)
    const mergedDurations = { ...apiDurations, ...durations };
    const sections = buildSectionsFromApiResponse(effectiveData, mergedDurations);
    // If no sections are available (e.g., API data missing), render a fallback UI to avoid errors.
    if (!sections || sections.length === 0) {
        return (
            <div style={{ padding: '20px', fontSize: '16px', color: '#ff4444' }}>
                No exam data available. Please try again later.
            </div>
        );
    }
    const [state, setState] = useState(() => buildInitialState(sections));
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);

    const { currentSection, currentQ, answers, code, sectionStatus, sectionTime, overallTime, violations, darkMode } = state;
    const sec = sections[currentSection];

    // ── Persist ─────────────────────────────────────────────────────────────────

    const persist = useCallback((s) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) { }
        setLastSaved(new Date());
    }, []);

    // ── Toast ────────────────────────────────────────────────────────────────────

    const showToast = useCallback((msg, type = "info") => {
        setToast({ msg, type, id: Date.now() });
        setTimeout(() => setToast(null), 2800);
    }, []);

    // ── Section advance ──────────────────────────────────────────────────────────

    const advanceSection = useCallback((s) => {
        // Submit current section before advancing
        const currentSec = sections[currentSection];
        if (currentSec) {
            submitSection(currentSec);
        }
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
    }, [sections, persist]);

    // ── Timers ───────────────────────────────────────────────────────────────────

    useEffect(() => {
        const tick = setInterval(() => {
            setState((prev) => {
                const newTimes = [...prev.sectionTime];
                if (newTimes[prev.currentSection] > 0) {
                    newTimes[prev.currentSection]--;
                    // 5-min coding warning
                    if (sections[prev.currentSection]?.type === "code" && newTimes[prev.currentSection] === 300) {
                        showToast("⚠ 5 minutes remaining in coding section!", "warn");
                    }
                }
                return { ...prev, sectionTime: newTimes };
            });
        }, 1000);

        const overallTick = setInterval(() => {
            setState((prev) => {
                if (prev.overallTime <= 1) {
                    // Auto-submit all sections before final submission
                    sections.forEach(submitSection);
                    // Persist final state and invoke final submit callback
                    persist(prev);
                    onSubmit?.(buildSubmitPayload());
                    setModal("submitted");
                    return { ...prev, overallTime: 0 };
                }
                return { ...prev, overallTime: prev.overallTime - 1 };
            });
        }, 1000);
        return () => { clearInterval(tick); clearInterval(overallTick); };
    }, [sections, showToast]);



    // Auto-save every 30s
    useEffect(() => {
        const id = setInterval(() => {
            setState((prev) => { persist(prev); return prev; });
            showToast("✓ Progress auto-saved", "success");
        }, 30000);
        return () => clearInterval(id);
    }, [persist, showToast]);

    // Code auto-save every 10s
    useEffect(() => {
        if (sec?.type !== "code") return;
        const id = setInterval(() => setState((prev) => { persist(prev); return prev; }), 10000);
        return () => clearInterval(id);
    }, [sec?.type, persist]);

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

    // Beforeunload
    useEffect(() => {
        const handler = (e) => { persist(state); e.preventDefault(); e.returnValue = ""; };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [state, persist]);

    // Submit a single section based on its type
    const submitSection = async (sec) => {
        try {
            let endpoint = '';
            const payload = {};
            if (sec.type === "mcq") {
                endpoint = 'http://localhost:8000/candidate/test/submit-mcq';
                payload.answers = Object.entries(state.answers.mcq || {}).map(([idx, optionIdx]) => ({
                    question_id: sec.questions[idx]?.id,
                    selected_option: ["A", "B", "C", "D"][optionIdx],
                }));
            } else if (sec.type === "scenario") {
                endpoint = 'http://localhost:8000/candidate/scenario/submit';
                payload.answers = Object.entries(state.answers.scenario || {}).map(([idx, optionIdx]) => ({
                    question_id: sec.questions[idx]?.id,
                    selected_option: ["A", "B", "C", "D"][optionIdx],
                }));
            } else if (sec.type === "code") {
                endpoint = 'http://localhost:8000/candidate/test/submit-coding';
                payload.answers = Object.entries(state.code).map(([idx, val]) => ({
                    question_id: sec.questions[idx]?.id,
                    language: val.language,
                    source_code: val.source,
                }));
            }
            if (!endpoint) return;
            await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch (e) {
            console.error('Section submit failed', e);
        }
    };


    const buildSubmitPayload = () => ({
        mcq_answers: Object.entries(answers.mcq || {}).map(([idx, optionIndex]) => ({
            question_id: sections.find((s) => s.id === "mcq")?.questions[idx]?.id,
            selected_option: ["A", "B", "C", "D"][optionIndex],
        })),
        scenario_answers: Object.entries(answers.scenario || {}).map(([idx, optionIndex]) => ({
            question_id: sections.find((s) => s.id === "scenario")?.questions[idx]?.id,
            selected_option: ["A", "B", "C", "D"][optionIndex],
        })),
        coding_answers: Object.entries(code).map(([idx, val]) => ({
            question_id: sections.find((s) => s.id === "coding")?.questions[idx]?.id,
            language: val.language,
            source_code: val.source,
        })),
        violations,
    });

    // ── Actions ──────────────────────────────────────────────────────────────────

    const selectOption = (optIdx) => {
        setState((prev) => ({
            ...prev,
            answers: {
                ...prev.answers,
                [sec.id]: { ...prev.answers[sec.id], [prev.currentQ]: optIdx },
            },
        }));
    };

    const handleCodeChange = (field, val) => {
        setState((prev) => ({
            ...prev,
            code: {
                ...prev.code,
                [prev.currentQ]: { ...(prev.code[prev.currentQ] || {}), [field]: val },
            },
        }));
    };

    const goToQ = (idx) => setState((prev) => ({ ...prev, currentQ: idx }));
    const prevQ = () => currentQ > 0 && goToQ(currentQ - 1);
    const nextQ = () => currentQ < sec.questions.length - 1 && goToQ(currentQ + 1);

    const clickSection = (si) => {
        const st = sectionStatus[si];
        if (st === "locked") showToast("Complete the current section first.", "warn");
        if (st === "done") showToast("Completed sections cannot be revisited.", "danger");
    };

    const totalAnswered = () => {
        let t = 0;
        sections.forEach((s) => {
            if (s.type !== "code") t += Object.keys(answers[s.id] || {}).length;
            else t += Object.keys(code).length;
        });
        return t;
    };

    const totalQ = sections.reduce((a, s) => a + s.questions.length, 0);
    const secAnswered = sec.type !== "code"
        ? Object.keys(answers[sec.id] || {}).length
        : Object.keys(code).length;

    const st = sectionTime[currentSection];
    const timerCls = st < 120 ? "crit" : st < 300 ? "warn" : "";
    const otCls = overallTime < 300 ? "crit" : overallTime < 600 ? "warn" : "";

    // ── Theme ────────────────────────────────────────────────────────────────────

    const T = darkMode
        ? { appBg: "#0a0f1e", navBg: "#0f1523", sidebarBg: "#141c2e", cardBg: "#1a2238", border: "#2a3555", text1: "#e8eaf0", text2: "#8b95b0", text3: "#4a5568", codeBg: "#0d1526", accentDim: "#1e3a6e" }
        : { appBg: "#f0f4f8", navBg: "#ffffff", sidebarBg: "#f5f7fa", cardBg: "#ffffff", border: "#dde2ee", text1: "#1a202c", text2: "#4a5568", text3: "#718096", codeBg: "#1e293b", accentDim: "#dbeafe" };

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

    // ── Render ───────────────────────────────────────────────────────────────────

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
                        Violations: {violations}
                    </div>
                    <TimerPill label="Section" value={fmt(st)} cls={timerCls} T={T} />
                    <TimerPill label="Overall" value={fmt(overallTime)} cls={otCls} T={T} dim />
                    <button style={btn("outline")} onClick={() => setState((p) => ({ ...p, darkMode: !p.darkMode }))}>{darkMode ? "☀" : "🌙"}</button>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* Sidebar */}
                <div style={{ width: 220, background: T.sidebarBg, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px", color: T.text2 }}>Sections</div>
                    <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
                        {sections.map((s, si) => {
                            const isActive = si === currentSection && sectionStatus[si] === "active";
                            const isDone = sectionStatus[si] === "done";
                            const isLocked = sectionStatus[si] === "locked";
                            const sAns = s.type !== "code" ? Object.keys(answers[s.id] || {}).length : Object.keys(code).length;
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
                                            {s.questions.map((_, qi) => {
                                                const isAns = s.type !== "code" ? answers[s.id]?.[qi] !== undefined : code[qi] !== undefined;
                                                const isCur = qi === currentQ;
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

                {/* Main */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {sectionStatus[currentSection] === "done" ? (
                        <CompletedSection sec={sec} T={T} />
                    ) : (
                        <>
                            {/* Section banner */}
                            <div style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 4, height: 28, borderRadius: 2, background: sec.color }} />
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>{sec.name}</div>
                                        <div style={{ fontSize: 11, color: T.text2 }}>Q{currentQ + 1} of {sec.questions.length}</div>
                                    </div>
                                </div>
                                <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 500, color: timerCls === "crit" ? "#ef4444" : timerCls === "warn" ? "#f59e0b" : T.text1, animation: timerCls === "crit" ? "pulse 1s infinite" : "none" }}>
                                    {fmt(st)}
                                </span>
                            </div>

                            {/* Stats strip */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, padding: "8px 20px", borderBottom: `1px solid ${T.border}`, background: T.navBg, flexShrink: 0 }}>
                                {[{ v: secAnswered, l: "Answered" }, { v: sec.questions.length - secAnswered, l: "Remaining" }, { v: Math.round((secAnswered / sec.questions.length) * 100) + "%", l: "Section %" }, { v: totalAnswered(), l: "Total Done" }].map(({ v, l }) => (
                                    <div key={l} style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 16, fontWeight: 500 }}>{v}</div>
                                        <div style={{ fontSize: 10, color: T.text2, marginTop: 1 }}>{l}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Question area */}
                            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                                {(sec.type === "mcq" || sec.type === "scenario") && (
                                    <MCQQuestion
                                        sec={sec} currentQ={currentQ} answers={answers}
                                        onSelect={selectOption} T={T} accent={accent}
                                    />
                                )}
                                {sec.type === "code" && (
                                    <CodeQuestion
                                        sec={sec} currentQ={currentQ} code={code}
                                        onChange={handleCodeChange} T={T} lastSaved={lastSaved}
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
                    onCancel={() => setModal(null)} onConfirm={advanceSection} />
            )}
            {modal === "submit" && (
                <Modal icon="📋" title="Submit Test?"
                    body={`You've answered ${totalAnswered()} of ${totalQ} questions. This cannot be undone.`}
                    confirm="Submit Test" confirmStyle={btn("danger")}
                    onCancel={() => setModal(null)}
                    onConfirm={() => { persist(state); onSubmit?.(buildSubmitPayload()); setModal("submitted"); }} />
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

function TimerPill({ label, value, cls, T, dim }) {
    const color = cls === "crit" ? "#ef4444" : cls === "warn" ? "#f59e0b" : T.text1;
    return (
        <div style={{ background: T.cardBg, border: `1px solid ${dim ? "#1e3a6e" : T.border}`, borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</span>
            <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 500, color, animation: cls === "crit" ? "pulse 1s infinite" : "none" }}>{value}</span>
        </div>
    );
}

function MCQQuestion({ sec, currentQ, answers, onSelect, T, accent }) {
    const q = sec.questions[currentQ];
    if (!q) return null;
    const selected = answers[sec.id]?.[currentQ];
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
                    <button key={i} onClick={() => onSelect(i)} style={{ background: selected === i ? T.accentDim : T.cardBg, border: `1px solid ${selected === i ? accent : T.border}`, borderRadius: 8, padding: "10px 14px", textAlign: "left", color: T.text1, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, background: selected === i ? accent : "transparent", border: `1px solid ${selected === i ? accent : T.border}`, color: selected === i ? "#fff" : T.text2 }}>
                            {opt.label}
                        </div>
                        {opt.text}
                    </button>
                ))}
            </div>
        </>
    );
}

function CodeQuestion({ sec, currentQ, code, onChange, T, lastSaved }) {
    const q = sec.questions[currentQ];
    if (!q) return null;
    const saved = code[currentQ] || {};
    const lang = saved.language || "python";
    const source = saved.source ?? q.templateCode ?? "";

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

            {/* Test cases */}
            {q.testCases.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: T.text2, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Sample Test Cases</div>
                    {q.testCases.map((tc, i) => (
                        <div key={i} style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 10, color: T.text2, marginBottom: 4 }}>INPUT</div>
                                <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#93c5fd", whiteSpace: "pre-wrap", margin: 0 }}>{tc.input}</pre>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: T.text2, marginBottom: 4 }}>EXPECTED OUTPUT</div>
                                <pre style={{ fontFamily: "monospace", fontSize: 11, color: "#4ade80", whiteSpace: "pre-wrap", margin: 0 }}>{tc.expected_output}</pre>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Editor toolbar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <select
                    value={lang}
                    onChange={(e) => onChange("language", e.target.value)}
                    style={{ background: T.cardBg, border: `1px solid ${T.border}`, color: T.text1, borderRadius: 6, padding: "4px 8px", fontSize: 11 }}
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                </select>
                {lastSaved && (
                    <div style={{ fontSize: 10, color: T.text2, display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                        Saved {lastSaved.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Code editor */}
            <textarea
                value={source}
                onChange={(e) => onChange("source", e.target.value)}
                spellCheck={false}
                style={{ background: T.codeBg, border: `1px solid ${T.border}`, borderRadius: 10, fontFamily: "monospace", fontSize: 13, color: "#e2e8f0", padding: 14, height: 260, width: "100%", resize: "vertical", outline: "none", lineHeight: 1.6 }}
            />
        </>
    );
}

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