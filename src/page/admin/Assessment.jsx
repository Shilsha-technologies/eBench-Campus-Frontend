import { useState, useRef, useEffect } from "react";

// ─── Default Data ────────────────────────────────────────────────────────────

const LEVEL_ICONS = { 1: "🎙", 2: "📝", 3: "🎥" };
const LEVEL_COLORS = {
  1: { ring: "ring-violet-400", bg: "bg-violet-50", icon: "bg-violet-600", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500", label: "text-violet-700" },
  2: { ring: "ring-sky-400", bg: "bg-sky-50", icon: "bg-sky-600", badge: "bg-sky-100 text-sky-700", dot: "bg-sky-500", label: "text-sky-700" },
  3: { ring: "ring-amber-400", bg: "bg-amber-50", icon: "bg-amber-500", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500", label: "text-amber-700" },
};

const DIFF_META = {
  Easy:   { color: "emerald", bg: "bg-emerald-50",  ring: "ring-emerald-400", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400", text: "text-emerald-700" },
  Medium: { color: "amber",   bg: "bg-amber-50",    ring: "ring-amber-400",   badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400",   text: "text-amber-700"   },
  Hard:   { color: "rose",    bg: "bg-rose-50",     ring: "ring-rose-400",    badge: "bg-rose-100 text-rose-700",     dot: "bg-rose-400",    text: "text-rose-700"    },
};

const TOPICS = ["HTML","CSS","JavaScript","React","Node.js","Aptitude","DBMS","OOPs","OS","Python","SQL","DSA","System Design","Git"];

const makeDiff = (label, questions, time, topics) => ({
  id: crypto.randomUUID(),
  label,
  questions,
  time,
  topics,
  randomize: label !== "Easy",
  negativeMarking: label === "Hard",
  sectionTimer: label === "Hard",
  codingRound: false,
});

const makeLevel = (num, name, desc, duration) => ({
  id: crypto.randomUUID(),
  num,
  name,
  desc,
  duration,
  active: true,
  difficulties: [
    makeDiff("Easy",   10, 15, ["HTML","CSS","Aptitude"]),
    makeDiff("Medium", 20, 30, ["JavaScript","React","OOPs"]),
    makeDiff("Hard",   15, 25, ["Node.js","DBMS","OS"]),
  ],
});

const INITIAL = [
  makeLevel(1, "Communication & Introduction", "Self-intro, verbal fluency, confidence assessment", "10–20 min"),
  makeLevel(2, "MCQ Assessment", "Technical aptitude & subject knowledge quiz", "30–60 min"),
  makeLevel(3, "Video Interview Round", "Live structured interview with AI proctoring", "20–45 min"),
];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 flex-shrink-0
      ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
  >
    <span className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-[18px]" : ""}`} />
  </button>
);

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${className}`}>{children}</span>
);

const Pill = ({ children, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 select-none
      ${active
        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
        : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"}`}
  >{children}</button>
);

const Field = ({ label, note, children }) => (
  <div>
    <div className="flex items-baseline gap-2 mb-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {note && <span className="text-xs text-slate-400 normal-case font-normal">{note}</span>}
    </div>
    {children}
  </div>
);

const SliderField = ({ label, note, min, max, step, value, onChange, unit = "", color = "indigo" }) => (
  <Field label={label} note={note}>
    <div className="flex items-center gap-3">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className={`flex-1 accent-${color}-600`}
      />
      <span className={`text-sm font-bold text-${color}-600 w-16 text-right tabular-nums`}>{value}{unit}</span>
    </div>
    <div className="flex justify-between text-xs text-slate-300 mt-0.5 px-0.5">
      <span>{min}{unit}</span><span>{max}{unit}</span>
    </div>
  </Field>
);

const ToggleRow = ({ label, sub, checked, onChange, campusOnly, isCampus }) => {
  const disabled = campusOnly && !isCampus;
  return (
    <div className={`flex items-center justify-between py-3 border-b border-slate-50 last:border-0 ${disabled ? "opacity-40" : ""}`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">{label}</span>
          {campusOnly && <Badge className="bg-indigo-100 text-indigo-700">Campus only</Badge>}
        </div>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <Toggle checked={!disabled && checked} onChange={disabled ? () => {} : onChange} />
    </div>
  );
};

// ─── Confirmation Dialog ──────────────────────────────────────────────────────

const ConfirmDialog = ({ open, title, body, onConfirm, onCancel, danger = true }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{body}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-medium">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm text-white rounded-xl font-medium transition-colors ${danger ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-700"}`}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

// ─── Difficulty Edit Modal ────────────────────────────────────────────────────

const DiffModal = ({ diff, levelNum, isCampus, onSave, onClose }) => {
  const [d, setD] = useState({ ...diff });
  const m = DIFF_META[d.label];
  const set = (key, val) => setD(prev => ({ ...prev, [key]: val }));
  const toggleTopic = (t) => setD(prev => ({
    ...prev,
    topics: prev.topics.includes(t) ? prev.topics.filter(x => x !== t) : [...prev.topics, t],
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b border-slate-100 rounded-t-3xl ${m.bg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${m.dot}`} />
            <div>
              <h2 className="font-bold text-slate-900 text-base">Edit {d.label} Difficulty</h2>
              <p className="text-xs text-slate-500 mt-0.5">Level {levelNum} — {LEVEL_ICONS[levelNum]} Configure assessment rules</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/80 text-slate-400 transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">

          {/* Questions & Time */}
          <div className="grid grid-cols-2 gap-5">
            <SliderField label="Total Questions" min={5} max={60} step={5} value={d.questions} onChange={v => set("questions", v)} color="indigo" />
            <SliderField label="Time Limit" min={5} max={120} step={5} value={d.time} onChange={v => set("time", v)} unit=" min" color="sky" />
          </div>

          {/* Toggles */}
          <div className="bg-slate-50 rounded-2xl px-4">
            <ToggleRow label="Randomize Questions" sub="Shuffle order for each candidate" checked={d.randomize} onChange={v => set("randomize", v)} />
            <ToggleRow label="Negative Marking" sub="−0.25 per wrong answer" checked={d.negativeMarking} onChange={v => set("negativeMarking", v)} />
            <ToggleRow label="Section-wise Timer" sub="Each topic gets its own countdown" checked={d.sectionTimer} onChange={v => set("sectionTimer", v)} />
            <ToggleRow
              label="Include Coding Round"
              sub="Add a live coding problem at the end"
              checked={d.codingRound}
              onChange={v => set("codingRound", v)}
              campusOnly
              isCampus={isCampus}
            />
          </div>

          {/* Topics */}
          <Field label="Topics Covered">
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <Pill key={t} active={d.topics.includes(t)} onClick={() => toggleTopic(t)}>{t}</Pill>
              ))}
            </div>
            {d.topics.length === 0 && <p className="text-xs text-rose-400 mt-2">Select at least one topic.</p>}
          </Field>

          {/* Summary card */}
          <div className={`rounded-2xl border-2 ${m.ring} ${m.bg} p-4`}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Summary</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["Questions", d.questions],
                ["Duration", `${d.time}m`],
                ["Topics", d.topics.length],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/70 rounded-xl py-2 px-3">
                  <div className={`text-lg font-bold ${m.text}`}>{v}</div>
                  <div className="text-xs text-slate-400">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 font-medium transition-colors">Discard</button>
          <button
            onClick={() => { if (d.topics.length > 0) onSave(d); }}
            disabled={d.topics.length === 0}
            className="px-6 py-2.5 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ─── Level Edit Modal ─────────────────────────────────────────────────────────

const LevelModal = ({ level, onSave, onClose, isNew }) => {
  const [l, setL] = useState({ ...level });
  const set = (k, v) => setL(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">{isNew ? "Add New Level" : "Edit Level"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <Field label="Level Name">
            <input
              value={l.name}
              onChange={e => set("name", e.target.value)}
              placeholder="e.g. Technical Screening"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={l.desc}
              onChange={e => set("desc", e.target.value)}
              rows={2}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 resize-none"
            />
          </Field>
          <Field label="Estimated Duration">
            <input
              value={l.duration}
              onChange={e => set("duration", e.target.value)}
              placeholder="e.g. 30–45 min"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
            />
          </Field>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <div className="text-sm font-medium text-slate-700">Active</div>
              <div className="text-xs text-slate-400">Visible to recruiters when sending tests</div>
            </div>
            <Toggle checked={l.active} onChange={v => set("active", v)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 font-medium transition-colors">Cancel</button>
          <button
            onClick={() => { if (l.name.trim()) onSave(l); }}
            disabled={!l.name.trim()}
            className="px-6 py-2.5 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors shadow-md shadow-indigo-200 disabled:opacity-50"
          >{isNew ? "Create Level" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

// ─── Difficulty Card (in table row) ──────────────────────────────────────────

const DiffRow = ({ diff, onEdit, onDelete, isCampus }) => {
  const m = DIFF_META[diff.label];
  return (
    <div className={`group flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${m.dot}`} />
        <div className="flex-shrink-0">
          <Badge className={m.badge}>{diff.label}</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 flex-1 min-w-0 text-sm">
          <div>
            <div className="text-xs text-slate-400">Questions</div>
            <div className="font-semibold text-slate-800">{diff.questions}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Time</div>
            <div className="font-semibold text-slate-800">{diff.time} min</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-400 mb-1">Topics</div>
            <div className="flex flex-wrap gap-1">
              {diff.topics.slice(0, 4).map(t => (
                <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
              ))}
              {diff.topics.length > 4 && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{diff.topics.length - 4}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-1.5 sm:w-auto">
        {diff.randomize && <Badge className="bg-violet-100 text-violet-700">Randomize</Badge>}
        {diff.negativeMarking && <Badge className="bg-rose-100 text-rose-700">−ve Mark</Badge>}
        {diff.sectionTimer && <Badge className="bg-sky-100 text-sky-700">Sec. Timer</Badge>}
        {diff.codingRound && isCampus && <Badge className="bg-indigo-100 text-indigo-700">Coding</Badge>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
        <button onClick={onEdit} className="px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">Edit</button>
        <button onClick={onDelete} className="px-3 py-1.5 text-xs font-medium rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors">Delete</button>
      </div>
    </div>
  );
};

// ─── Level Card ───────────────────────────────────────────────────────────────

const LevelCard = ({ level, isCampus, expanded, onToggle, onEditLevel, onDeleteLevel, onEditDiff, onDeleteDiff, onAddDiff }) => {
  const c = LEVEL_COLORS[level.num] || LEVEL_COLORS[2];
  const totalQ = level.difficulties.reduce((s, d) => s + d.questions, 0);
  const maxTime = level.difficulties.reduce((m, d) => Math.max(m, d.time), 0);

  return (
    <div className={`rounded-3xl border-2 transition-all duration-300 ${expanded ? `${c.ring} shadow-lg` : "border-slate-100 hover:border-slate-200 hover:shadow-sm"}`}>

      {/* Level header */}
      <div
        className={`flex items-center gap-4 p-5 cursor-pointer select-none ${expanded ? c.bg : "bg-white"} rounded-3xl transition-colors duration-200`}
        onClick={onToggle}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${expanded ? c.icon + " shadow-md" : "bg-slate-100"}`}>
          {LEVEL_ICONS[level.num] || "📋"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="font-bold text-slate-900 text-base truncate">{level.name}</h3>
            {!level.active && <Badge className="bg-slate-100 text-slate-500">Inactive</Badge>}
          </div>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{level.desc}</p>
        </div>

        <div className="hidden sm:flex items-center gap-5 text-center flex-shrink-0">
          <div>
            <div className="font-bold text-slate-800">{level.difficulties.length}</div>
            <div className="text-xs text-slate-400">Difficulties</div>
          </div>
          <div>
            <div className="font-bold text-slate-800">{totalQ}</div>
            <div className="text-xs text-slate-400">Total Qs</div>
          </div>
          <div>
            <div className="font-bold text-slate-800">{maxTime}m</div>
            <div className="text-xs text-slate-400">Max Time</div>
          </div>
          <div>
            <div className="font-bold text-slate-800">{level.duration}</div>
            <div className="text-xs text-slate-400">Duration</div>
          </div>
        </div>

        {/* Level actions */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={onEditLevel}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all text-sm"
          >✎</button>
          <button
            onClick={onDeleteLevel}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all text-sm"
          >🗑</button>
          <div className={`w-6 h-6 flex items-center justify-center text-slate-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>▾</div>
        </div>
      </div>

      {/* Expanded: difficulties */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty Levels</span>
            <button
              onClick={onAddDiff}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span className="text-base leading-none">+</span> Add Difficulty
            </button>
          </div>
          {level.difficulties.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
              No difficulty levels yet. Add one to get started.
            </div>
          )}
          {level.difficulties.map(diff => (
            <DiffRow
              key={diff.id}
              diff={diff}
              isCampus={isCampus}
              onEdit={() => onEditDiff(diff)}
              onDelete={() => onDeleteDiff(diff.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── New Difficulty Modal ─────────────────────────────────────────────────────

const NewDiffModal = ({ levelNum, existing, onSave, onClose, isCampus }) => {
  const available = ["Easy","Medium","Hard"].filter(l => !existing.includes(l));
  const [label, setLabel] = useState(available[0] || "Easy");
  const blank = makeDiff(label, 10, 20, []);

  // reuse DiffModal with blank
  return <DiffModal diff={{ ...blank, label }} levelNum={levelNum} isCampus={isCampus} onSave={onSave} onClose={onClose} />;
};

// ─── Main Module ──────────────────────────────────────────────────────────────

export default function AssessmentManagement() {
  const [levels, setLevels] = useState(INITIAL);
  const [expanded, setExpanded] = useState(INITIAL[0].id);
  const [isCampus, setIsCampus] = useState(false);

  // Modals
  const [editLevelModal, setEditLevelModal] = useState(null);   // level obj or null
  const [newLevelModal, setNewLevelModal]   = useState(false);
  const [editDiffModal, setEditDiffModal]   = useState(null);   // { levelId, diff }
  const [addDiffModal, setAddDiffModal]     = useState(null);   // levelId
  const [confirmDel, setConfirmDel]         = useState(null);   // { type, id, levelId? }
  const [toast, setToast]                   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Level CRUD ──
  const saveEditLevel = (updated) => {
    setLevels(prev => prev.map(l => l.id === updated.id ? { ...l, ...updated } : l));
    setEditLevelModal(null);
    showToast("Level updated successfully.");
  };

  const saveNewLevel = (data) => {
    const num = levels.length + 1;
    setLevels(prev => [...prev, { ...data, id: crypto.randomUUID(), num, difficulties: [] }]);
    setNewLevelModal(false);
    showToast("New level created.");
  };

  const deleteLevel = (id) => {
    setLevels(prev => prev.filter(l => l.id !== id));
    if (expanded === id) setExpanded(null);
    setConfirmDel(null);
    showToast("Level deleted.", "danger");
  };

  // ── Difficulty CRUD ──
  const saveEditDiff = (levelId, updated) => {
    setLevels(prev => prev.map(l =>
      l.id === levelId
        ? { ...l, difficulties: l.difficulties.map(d => d.id === updated.id ? updated : d) }
        : l
    ));
    setEditDiffModal(null);
    showToast("Difficulty saved.");
  };

  const saveNewDiff = (levelId, data) => {
    setLevels(prev => prev.map(l =>
      l.id === levelId ? { ...l, difficulties: [...l.difficulties, { ...data, id: crypto.randomUUID() }] } : l
    ));
    setAddDiffModal(null);
    showToast("Difficulty added.");
  };

  const deleteDiff = (levelId, diffId) => {
    setLevels(prev => prev.map(l =>
      l.id === levelId ? { ...l, difficulties: l.difficulties.filter(d => d.id !== diffId) } : l
    ));
    setConfirmDel(null);
    showToast("Difficulty removed.", "danger");
  };

  const activeCount = levels.filter(l => l.active).length;

  // Blank for new level
  const blankLevel = {
    num: levels.length + 1, name: "", desc: "", duration: "", active: true,
    difficulties: [],
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">A</div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight">Assessment Management</h1>
              <p className="text-xs text-slate-400">Configure levels, difficulties & rules</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="text-center"><span className="font-bold text-slate-800">{levels.length}</span> <span className="text-slate-400 text-xs">Levels</span></div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="text-center"><span className="font-bold text-slate-800">{activeCount}</span> <span className="text-slate-400 text-xs">Active</span></div>
            </div>

            {/* Campus toggle */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
              <span className="text-xs font-semibold text-slate-500">Campus Mode</span>
              <Toggle checked={isCampus} onChange={setIsCampus} />
              {isCampus && <Badge className="bg-indigo-100 text-indigo-700">ON</Badge>}
            </div>

            <button
              onClick={() => setNewLevelModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-md shadow-indigo-200 transition-all duration-200"
            >
              <span className="text-base leading-none">+</span> Add Level
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">

        {/* Campus mode banner */}
        {isCampus && (
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3">
            <span className="text-2xl">🏫</span>
            <div>
              <div className="text-sm font-semibold text-indigo-800">Campus Mode Active</div>
              <div className="text-xs text-indigo-500">Coding Round option is now available in difficulty settings.</div>
            </div>
          </div>
        )}

        {levels.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">📋</div>
            <div className="font-semibold text-slate-600 mb-2">No assessment levels yet</div>
            <div className="text-sm text-slate-400 mb-6">Create your first level to start configuring assessments.</div>
            <button onClick={() => setNewLevelModal(true)} className="bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
              + Add First Level
            </button>
          </div>
        )}

        {levels.map(level => (
          <LevelCard
            key={level.id}
            level={level}
            isCampus={isCampus}
            expanded={expanded === level.id}
            onToggle={() => setExpanded(prev => prev === level.id ? null : level.id)}
            onEditLevel={() => setEditLevelModal(level)}
            onDeleteLevel={() => setConfirmDel({ type: "level", id: level.id })}
            onEditDiff={(diff) => setEditDiffModal({ levelId: level.id, diff })}
            onDeleteDiff={(diffId) => setConfirmDel({ type: "diff", id: diffId, levelId: level.id })}
            onAddDiff={() => setAddDiffModal(level.id)}
          />
        ))}
      </div>

      {/* ── Modals ── */}

      {editLevelModal && (
        <LevelModal level={editLevelModal} onSave={saveEditLevel} onClose={() => setEditLevelModal(null)} isNew={false} />
      )}

      {newLevelModal && (
        <LevelModal level={blankLevel} onSave={saveNewLevel} onClose={() => setNewLevelModal(false)} isNew={true} />
      )}

      {editDiffModal && (
        <DiffModal
          diff={editDiffModal.diff}
          levelNum={levels.find(l => l.id === editDiffModal.levelId)?.num || "?"}
          isCampus={isCampus}
          onSave={(updated) => saveEditDiff(editDiffModal.levelId, updated)}
          onClose={() => setEditDiffModal(null)}
        />
      )}

      {addDiffModal && (() => {
        const lv = levels.find(l => l.id === addDiffModal);
        const existingLabels = lv?.difficulties.map(d => d.label) || [];
        const available = ["Easy","Medium","Hard"].filter(x => !existingLabels.includes(x));
        if (available.length === 0) {
          setAddDiffModal(null);
          showToast("All 3 difficulty levels already added.", "warn");
          return null;
        }
        return (
          <NewDiffModal
            levelNum={lv?.num}
            existing={existingLabels}
            isCampus={isCampus}
            onSave={(data) => saveNewDiff(addDiffModal, data)}
            onClose={() => setAddDiffModal(null)}
          />
        );
      })()}

      <ConfirmDialog
        open={!!confirmDel}
        title={confirmDel?.type === "level" ? "Delete Level?" : "Delete Difficulty?"}
        body={confirmDel?.type === "level"
          ? "This will permanently remove the level and all its difficulty configurations."
          : "This will permanently remove this difficulty configuration."}
        onConfirm={() => {
          if (confirmDel.type === "level") deleteLevel(confirmDel.id);
          else deleteDiff(confirmDel.levelId, confirmDel.id);
        }}
        onCancel={() => setConfirmDel(null)}
      />

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300
          ${toast.type === "danger" ? "bg-rose-500 text-white" : toast.type === "warn" ? "bg-amber-500 text-white" : "bg-slate-900 text-white"}`}>
          <span>{toast.type === "danger" ? "🗑" : toast.type === "warn" ? "⚠️" : "✓"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}