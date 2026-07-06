import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import {
  useAddTestConfigLevelMutation,
  useEditTestConfigLevelMutation,

  useGetTestConfigQuery,
  useAddDifficultyMutation,
  useEditDifficultyMutation,
  // useDeleteDifficultyMutation, // removed delete
  useToggleLevelStatusMutation,
  useToggleDifficultyStatusMutation,
  useDeleteTestConfigLevelMutation,
} from "../../redux/services/adminApi";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_ICONS = { 1: "🎙", 2: "📝", 3: "🎥" };
const LEVEL_COLORS = {
  1: { ring: "ring-green-400", bg: "bg-green-50", icon: "bg-green-600", badge: "bg-green-100 text-green-700", dot: "bg-green-500", label: "text-green-700" },
  2: { ring: "ring-emerald-400", bg: "bg-emerald-50", icon: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "text-emerald-700" },
  3: { ring: "ring-teal-400", bg: "bg-teal-50", icon: "bg-teal-500", badge: "bg-teal-100 text-teal-700", dot: "bg-teal-500", label: "text-teal-700" },
};

const DIFF_META = {
  medium: { color: "amber", bg: "bg-amber-50", ring: "ring-amber-400", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400", text: "text-amber-700" },
  easy: { color: "emerald", bg: "bg-emerald-50", ring: "ring-emerald-400", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400", text: "text-emerald-700" },
  hard: { color: "rose", bg: "bg-rose-50", ring: "ring-rose-400", badge: "bg-rose-100 text-rose-700", dot: "bg-rose-400", text: "text-rose-700" },
  Easy: { color: "emerald", bg: "bg-emerald-50", ring: "ring-emerald-400", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400", text: "text-emerald-700" },
  Medium: { color: "amber", bg: "bg-amber-50", ring: "ring-amber-400", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400", text: "text-amber-700" },
  Hard: { color: "rose", bg: "bg-rose-50", ring: "ring-rose-400", badge: "bg-rose-100 text-rose-700", dot: "bg-rose-400", text: "text-rose-700" },
};

// ─── Tiny Helpers ─────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 flex-shrink-0
      ${checked ? "bg-green-600" : "bg-slate-200"}`}
  >
    <span className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-[18px]" : ""}`} />
  </button>
);

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${className}`}>{children}</span>
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

const SliderField = ({ label, note, min, max, step, value, onChange, unit = "", color = "green" }) => (
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
          {campusOnly && <Badge className="bg-green-100 text-green-700">Campus only</Badge>}
        </div>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <Toggle checked={!disabled && checked} onChange={disabled ? () => { } : onChange} />
    </div>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

const ConfirmDialog = ({ open, title, body, onConfirm, onCancel, loading = false, danger = true }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{body}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70
              ${danger ? "bg-rose-500 hover:bg-rose-600" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading && <span className="animate-spin text-xs">⏳</span>}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Difficulty Edit Modal ────────────────────────────────────────────────────

const DiffModal = ({ diff, levelNum, onSave, onClose, isSaving }) => {
  const [d, setD] = useState({
    ...diff,
    time: diff?._id ? diff?.timeLimit : diff?.time,
    // Initialize counts if undefined
    mcq_count: diff?.mcqCount ?? 0,
    coding_count: diff?.codingCount ?? 0,
    scenario_count: diff?.scenarioCount ?? 0,
    // total questions derived from counts
    questions: (diff?.mcq_count ?? 0) + (diff?.coding_count ?? 0) + (diff?.scenario_count ?? 0),
    randomize: diff?._id ? diff?.randomizeQuestions : diff?.randomize,
    negativeMarking: diff?._id ? diff?.negativeMarking : diff?.negativeMarking,
    sectionTimer: diff?._id ? diff?.sectionTimer : diff?.sectionTimer,
    codingRound: diff?._id ? diff?.codingRound : diff?.codingRound,
  });
  const m = DIFF_META[d.label] || DIFF_META["Easy"];
  const set = (key, val) => setD(prev => ({ ...prev, [key]: val }));

  // Calculate total questions from counts
  const totalQ = (d.mcq_count ?? 0) + (d.coding_count ?? 0) + (d.scenario_count ?? 0);

  console.log("d", d);
  console.log("dif", diff);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b border-slate-100 rounded-t-3xl ${m.bg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${m.dot}`} />
            <div>
              <h2 className="font-bold text-slate-900 text-base">{diff?._id ? 'Edit' : 'Add'} {d.label} Difficulty</h2>
              <p className="text-xs text-slate-500 mt-0.5">Level {levelNum} — {LEVEL_ICONS[levelNum]} Configure assessment rules</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/80 text-slate-400 transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {(!d._id && !d.id) && (
            <div className="">
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
              <select value={d.label} onChange={e => set("label", e.target.value)} className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                {["Easy", "Medium", "Hard"].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            {/* MCQ Count */}
            <SliderField label="MCQ Questions" min={0} max={60} step={1} value={d.mcq_count} onChange={v => set("mcq_count", v)} color="green" />
            {/* Coding Count */}
            <SliderField label="Coding Questions" min={0} max={60} step={1} value={d.coding_count} onChange={v => set("coding_count", v)} color="blue" />
            {/* Scenario Count */}
            <SliderField label="Scenario Questions" min={0} max={60} step={1} value={d.scenario_count} onChange={v => set("scenario_count", v)} color="purple" />
            {/* Total Questions (read-only) */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-slate-700">Total Questions</span>
              <span className="text-lg font-bold text-slate-900">{totalQ}</span>
            </div>
            <SliderField label="Time Limit" min={5} max={120} step={5} value={d.time} onChange={v => set("time", v)} unit=" min" color="sky" />
          </div>

          <div className="bg-slate-50 rounded-2xl px-4">
            <ToggleRow label="Randomize Questions" sub="Shuffle order for each candidate" checked={d.randomize} onChange={v => set("randomize", v)} />
            <ToggleRow label="Negative Marking" sub="−0.25 per wrong answer" checked={d.negativeMarking} onChange={v => set("negativeMarking", v)} />
            <ToggleRow label="Section-wise Timer" sub="Each topic gets its own countdown" checked={d.sectionTimer} onChange={v => set("sectionTimer", v)} />
            <ToggleRow
              label="Include Coding Round"
              sub="Add a live coding problem at the end"
              checked={d.codingRound}
              onChange={v => set("codingRound", v)}
            />
          </div>

          {/* Summary */}
          <div className={`rounded-2xl border border-gray-200 ${m.ring} ${m.bg} p-4`}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Summary</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[["Questions", totalQ], ["Duration", `${diff?.time ?? d.time}m`], ["Difficulty", d.label]].map(([k, v]) => (
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
          <button onClick={onClose} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 font-medium transition-colors disabled:opacity-50">
            Discard
          </button>
          <button
            onClick={() => onSave({ ...d, questions: totalQ })}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-sm text-white bg-green-600 hover:bg-green-700 font-semibold transition-colors shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && <span className="animate-spin text-xs">⏳</span>}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// ─── Level Edit / Add Modal ───────────────────────────────────────────────────

const LevelModal = ({ level, onSave, onClose, isNew, isSaving }) => {
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
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-slate-700"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={l.description ?? ""}
              onChange={e => set("description", e.target.value)}
              rows={2}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-slate-700 resize-none"
            />
          </Field>
          <Field label="Estimated Duration">
            <input
              value={l.duration ?? ""}
              onChange={e => set("duration", e.target.value)}
              placeholder="e.g. 30–45 min"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-slate-700"
            />
          </Field>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 font-medium transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={() => { if (l.name.trim()) onSave(l); }}
            disabled={!l.name.trim() || isSaving}
            className="px-6 py-2.5 rounded-xl text-sm text-white bg-green-600 hover:bg-green-700 font-semibold transition-colors shadow-md shadow-green-200 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <span className="animate-spin text-xs">⏳</span>}
            {isNew ? "Create Level" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── New Difficulty Modal (label picker → reuses DiffModal) ───────────────────

const NewDiffModal = ({ levelNum, existing, onSave, onClose, isSaving }) => {
  const available = ["Easy", "Medium", "Hard"].filter(l => !existing.includes(l));
  const [label] = useState(available[0] || "Easy");
  const blank = {
    label,
    mcq_count: 6,
    coding_count: 4,
    scenario_count: 0,
    time: 20,
    randomize: false,
    negativeMarking: false,
    sectionTimer: false,
    codingRound: false,
  };
  return (
    <DiffModal
      diff={blank}
      levelNum={levelNum}
      onSave={onSave}
      onClose={onClose}
      isSaving={isSaving}
    />
  );
};

// ─── Difficulty Row ───────────────────────────────────────────────────────────



// ─── Level Card ───────────────────────────────────────────────────────────────

const LevelCard = ({ level, expanded, onToggle, onEditLevel, onToggleLevel, onEditDiff, onDeleteDiff, onAddDiff, onToggleDiff, isLoading }) => {
  const c = LEVEL_COLORS[level.num] || LEVEL_COLORS[2];
  const totalQ = level?.difficulties?.reduce((s, d) => s + (d.questions || 0), 0) ?? 0;
  const maxTime = level?.difficulties?.reduce((m, d) => Math.max(m, d.timeLimit || 0), 0) ?? 0;
  // console.log(level, "level")
  return (
    <div className={`rounded-3xl border border-gray-200 shadow-md bg-white transition-all duration-300 ${expanded ? `${c.ring} shadow-lg` : "border-slate-100 hover:border-slate-200 hover:shadow-sm"}`}>

      {/* Header row */}
      <div
        className={`flex items-center gap-4 p-5 cursor-pointer select-none ${expanded ? c.bg : "bg-white"} rounded-3xl transition-colors duration-200`}
        onClick={onToggle}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${expanded ? c.icon + " shadow-md" : "bg-slate-100"}`}>
          {LEVEL_ICONS[level.num] || "📋"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="font-bold text-green-900 text-base truncate">{level.name}</h3>
            <Badge className={level?.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}>{level?.isActive ? 'Active' : 'Inactive'}</Badge>
          </div>
          {/* Support both `desc` and `description` from API */}
          <p className="text-sm text-slate-400 mt-0.5 truncate">{level.description ?? level.desc}</p>
        </div>

        <div className="hidden sm:flex items-center gap-5 text-center shrink-0">
          <div><div className="font-bold text-green-800">{level?.difficulties?.length ?? 0}</div><div className="text-xs text-slate-400">Difficulties</div></div>
          <div><div className="font-bold text-green-800">{totalQ}</div><div className="text-xs text-slate-400">Total Qs</div></div>
          <div><div className="font-bold text-green-800">{maxTime}m</div><div className="text-xs text-slate-400">Max Time</div></div>
          <div><div className="font-bold text-green-800">{level.duration ?? level.total_duration ?? "—"}</div><div className="text-xs text-slate-400">Duration</div></div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <button onClick={onEditLevel} className="w-8 h-8 cursor-pointer rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-green-600 hover:border-green-300 transition-all">
            <Pencil size={14} />
          </button>
          <button
            onClick={onToggleLevel}
            disabled={isLoading}
            className={`px-3 h-8 cursor-pointer rounded-xl flex items-center justify-center transition-all
                ${!level?.isActive ? "bg-green-100 text-green-600 border-green-300 hover:bg-green-200" : "bg-red-100 text-red-600 border-red-300 hover:bg-red-200"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : (
              <span className="text-xs font-medium">{level?.isActive ? "Deactivate" : "Activate"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded difficulties table */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <div className="flex items-center justify-between mt-4 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty Configurations</span>
            <button
              onClick={onAddDiff}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span className="text-base leading-none">+</span> Add Difficulty
            </button>
          </div>

          {!level.difficulties?.length ? (
            <div className="py-10 text-center text-sm text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
              No difficulty levels yet. Add one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75">
                    {["Difficulty", "Status", "Questions", "Time", "Rules & Flags", "Actions"].map(h => (
                      <th key={h} className={`py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {level.difficulties.map(diff => (
                    <DiffRow
                      key={diff._id ?? diff.id}
                      diff={diff}
                      onEditDiff={() => onEditDiff(diff)}
                      onToggle={() => onToggleDiff(level._id, diff._id ?? diff.id, diff.isActive)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DiffRow = ({ diff, onEditDiff, onToggle }) => {
  const m = DIFF_META[diff.label];
  console.log("dii", diff, m)
  return (
    <tr className="group hover:bg-slate-50/60 transition-colors duration-150 border-b border-slate-100 last:border-0">
      {/* Difficulty */}
      <td className="py-4 px-4 align-middle">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${m?.dot}`} />
          <Badge className={m.badge}>{diff.label}</Badge>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4 align-middle text-sm font-semibold text-slate-700 tabular-nums">
        <Badge className={diff?.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}>{diff?.isActive ? 'Active' : 'Inactive'}</Badge>
      </td>
      {/* Questions */}
      <td className="py-4 px-4 align-middle text-sm font-semibold text-slate-700 tabular-nums">
        {diff?.questions}
      </td>
      {/* Time Limit */}
      <td className="py-4 px-4 align-middle text-sm font-semibold text-slate-700 tabular-nums">
        {diff.timeLimit} min
      </td>

      {/* Rules & Flags */}
      <td className="py-4 px-4 align-middle">
        <div className="flex flex-wrap gap-1.5">
          {diff?.randomizeQuestions && <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">Randomize</Badge>}
          {diff?.negativeMarking && <Badge className="bg-rose-50 text-rose-700 ring-1 ring-rose-600/10">−ve Mark</Badge>}
          {diff?.sectionTimer && <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-600/10">Sec. Timer</Badge>}
          {diff?.codingRound && <Badge className="bg-green-50 text-green-700 ring-1 ring-green-600/10">Coding</Badge>}
          {!diff?.randomizeQuestions && !diff?.negativeMarking && !diff?.sectionTimer && !diff?.codingRound && (
            <span className="text-xs text-slate-400 font-normal italic">Default settings</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4 align-middle text-right">
        <div className="flex items-center justify-end gap-2 opacity-100  transition-opacity duration-150">
          <button
            onClick={onEditDiff}
            className="px-3 py-1.5 text-xs cursor-pointer font-semibold rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onToggle}
            className={`px-3 py-1.5 text-xs cursor-pointer font-semibold rounded-xl ${diff.isActive ? "bg-rose-50 text-rose-500 hover:bg-rose-100" : "bg-green-50 text-green-600 hover:bg-green-100"} transition-colors`}
          >
            {diff.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
};



export default function AssessmentManagement() {
  const [expanded, setExpanded] = useState(null);
  const [editLevelModal, setEditLevelModal] = useState(null);
  const [newLevelModal, setNewLevelModal] = useState(false);
  const [editDiffModal, setEditDiffModal] = useState(null);
  const [addDiffModal, setAddDiffModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const { data: apiData, error: fetchError, isLoading: isFetchingLevels, refetch } = useGetTestConfigQuery();

  const [addLevel, { isLoading: isAddingLevel }] = useAddTestConfigLevelMutation();
  const [editLevel, { isLoading: isEditingLevel }] = useEditTestConfigLevelMutation();
  const [deleteLevel, { isLoading: isDeletingLevel }] = useDeleteTestConfigLevelMutation();
  const [toggleLevelStatus, { isLoading: isTogglingLevel }] = useToggleLevelStatusMutation();
  const [togglingLevelId, setTogglingLevelId] = useState(null);

  const [addDiff, { isLoading: isAddingDiff }] = useAddDifficultyMutation();
  const [editDiff, { isLoading: isEditingDiff }] = useEditDifficultyMutation();
  // const [deleteDiff, { isLoading: isDeletingDiff }] = useDeleteDifficultyMutation();
  const [toggleDifficultyStatus, { isLoading: isTogglingDiff }] = useToggleDifficultyStatusMutation();

  const levels = apiData?.levels ?? [];

  useEffect(() => {
    if (fetchError) toast.error(fetchError?.data?.message || "Failed to load levels");
  }, [fetchError]);

  const handleSaveNewLevel = async (data) => {
    try {
      await addLevel({
        name: data.name,
        description: data.description,
        duration: data.duration,
      }).unwrap();
      toast.success("Level created successfully.");
      setNewLevelModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create level");
    }
  };

  const handleSaveEditLevel = async (data) => {
    try {
      await editLevel({ levelId: data._id, data }).unwrap();
      toast.success("Level updated.");
      setEditLevelModal(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update level");
    }
  };

  const handleToggleLevel = async (level) => {
    setTogglingLevelId(level._id);
    try {
      await toggleLevelStatus({ levelId: level._id, is_active: !level.isActive }).unwrap();
      toast.success(`Level ${level.isActive ? 'deactivated' : 'activated'} successfully.`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to toggle level status');
    } finally {
      setTogglingLevelId(null);
    }
  };

  const handleToggleDifficulty = async (levelId, diffId, isActive) => {
    try {
      await toggleDifficultyStatus({ levelId, diffId, is_active: !isActive }).unwrap();
      toast.success("Difficulty status updated.");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to toggle difficulty status");
    }
  };

  const handleConfirmDeleteLevel = async () => {
    try {
      await deleteLevel({ levelId: confirmDel.levelId }).unwrap();
      toast.success("Level deleted.");
      if (expanded === confirmDel.levelId) setExpanded(null);
      setConfirmDel(null);
      refetch();
    } catch (err) {
      console.log(err, 'error')
      toast.error(err?.data?.detail || "Failed to delete level");
    }
  };

  // ─── Difficulty Handlers ─────────────────────────────────────────────────────

  const handleSaveNewDiff = async (data) => {
    try {
      const total = (data.mcq_count ?? 0) + (data.coding_count ?? 0) + (data.scenario_count ?? 0);
      await addDiff({
        levelId: addDiffModal._id,
        data: {
          label: data.label,
          questions: (data.mcq_count ?? 0) + (data.coding_count ?? 0) + (data.scenario_count ?? 0),
          mcq_count: data.mcq_count,
          coding_count: data.coding_count,
          scenario_count: data.scenario_count,
          time_limit: data.time,
          randomize_questions: data.randomize,
          negative_marking: data.negativeMarking,
          section_timer: data.sectionTimer,
          coding_round: data.codingRound,
        },
      }).unwrap();
      toast.success("Difficulty added.");
      setAddDiffModal(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add difficulty");
    }
  };

  const handleSaveEditDiff = async (data) => {
    console.log(data)

    try {
      await editDiff({
        levelId: editDiffModal.levelId,
        diffId: data._id ?? data.id,
        data: {
          label: data.label,
          questions: (data.mcq_count ?? 0) + (data.coding_count ?? 0) + (data.scenario_count ?? 0),
          mcq_count: data.mcq_count,
          coding_count: data.coding_count,
          scenario_count: data.scenario_count,
          time_limit: data.time,
          topics: data.topics,
          randomize_questions: data.randomize,
          negative_marking: data.negativeMarking,
          section_timer: data.sectionTimer,
          coding_round: data.codingRound,
        },
      }).unwrap();
      toast.success("Difficulty updated.");
      setEditDiffModal(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update difficulty");
    }
  };

  const handleConfirmDeleteDiff = async () => {
    console.log(confirmDel);
    try {
      await deleteDiff({
        levelId: confirmDel.levelId,
        diffId: confirmDel.diffId,
      }).unwrap();
      toast.success("Difficulty removed.");
      setConfirmDel(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete difficulty");
    }
  };

  // ─── Confirm dispatch ────────────────────────────────────────────────────────

  const handleConfirm = () => {
    if (confirmDel?.type === "level") handleConfirmDeleteLevel();
    else if (confirmDel?.type === "diff") handleConfirmDeleteDiff();
  };

  const isConfirmLoading = isDeletingLevel;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">

      {/* Page header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-[98%] mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-green-200">A</div>
            <div>
              <h1 className="font-bold text-green-900 text-lg leading-tight">Assessment Management</h1>
              <p className="text-xs text-gray-400">Configure levels, difficulties &amp; rules</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="text-center"><span className="font-bold text-slate-800">{levels.length}</span> <span className="text-slate-400 text-xs">Levels</span></div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="text-center"><span className="font-bold text-slate-800">{levels.filter(l => l.isActive).length}</span> <span className="text-slate-400 text-xs">Active</span></div>
            </div>



            <button
              onClick={() => setNewLevelModal(true)}
              disabled={isAddingLevel}
              className={`flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-md shadow-green-200 transition-all duration-200 ${isAddingLevel ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isAddingLevel ? <span className="animate-spin text-base leading-none">⏳</span> : <span className="text-base leading-none">+</span>}
              Add Level
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[99%] mx-auto px-6 py-8 space-y-4">



        {/* Loading skeleton */}
        {isFetchingLevels && (
          <div className="py-20 text-center text-slate-400">
            <div className="text-4xl mb-3 animate-pulse">⏳</div>
            <div className="text-sm">Loading levels…</div>
          </div>
        )}

        {/* Empty state */}
        {!isFetchingLevels && levels.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">📋</div>
            <div className="font-semibold text-slate-600 mb-2">No assessment levels yet</div>
            <div className="text-sm text-slate-400 mb-6">Create your first level to start configuring assessments.</div>
            <button onClick={() => setNewLevelModal(true)} className="bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:bg-green-700 transition-colors shadow-md shadow-green-200">
              + Add First Level
            </button>
          </div>
        )}

        {/* Level cards */}
        {!isFetchingLevels && levels.map(level => (
          <LevelCard
            level={level}
            expanded={expanded === level._id}
            onToggle={() => setExpanded(prev => prev === level._id ? null : level._id)}
            onEditLevel={() => setEditLevelModal(level)}
            onToggleLevel={() => handleToggleLevel(level)}
            isLoading={togglingLevelId === level._id}
            // isTogglingLevel prop removed     
            onToggleDiff={handleToggleDifficulty}
            onEditDiff={(diff) => setEditDiffModal({ levelId: level._id, levelNum: level.num, diff })}
            onAddDiff={() => {
              const existingLabels = level.difficulties?.map(d => d.label) || [];
              const available = ["Easy", "Medium", "Hard"].filter(x => !existingLabels.includes(x));
              if (available.length === 0) {
                toast("All 3 difficulty levels already added.", { icon: "⚠️" });
                return;
              }
              setAddDiffModal(level);
              setEditLevelModal(null);
            }}
          />
        ))}
      </div>

      {/* ── Modals ── */}

      {newLevelModal && (
        <LevelModal
          level={{ name: "", description: "", duration: "" }}
          onSave={handleSaveNewLevel}
          onClose={() => setNewLevelModal(false)}
          isNew
          isSaving={isAddingLevel}
        />
      )}

      {editLevelModal && (
        <LevelModal
          level={editLevelModal}
          onSave={handleSaveEditLevel}
          onClose={() => setEditLevelModal(null)}
          isNew={false}
          isSaving={isEditingLevel}
        />
      )}

      {addDiffModal && (
        <NewDiffModal
          levelNum={addDiffModal.num}
          existing={addDiffModal.difficulties?.map(d => d.label) || []}
          onSave={handleSaveNewDiff}
          onClose={() => setAddDiffModal(null)}
          isSaving={isAddingDiff}
        />
      )}

      {editDiffModal && (
        <DiffModal
          diff={editDiffModal.diff}
          levelNum={editDiffModal.levelNum}
          onSave={handleSaveEditDiff}
          onClose={() => setEditDiffModal(null)}
          isSaving={isEditingDiff}
        />
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!confirmDel}
        title={confirmDel?.type === "level" ? "Delete Level?" : "Delete Difficulty?"}
        body={
          confirmDel?.type === "level"
            ? "This will permanently remove the level and all its difficulty configurations."
            : "This will permanently remove this difficulty configuration."
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDel(null)}
        loading={isConfirmLoading}
      />
    </div>
  );
}
