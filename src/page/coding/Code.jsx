import { useState, useEffect, useCallback } from "react";
import { useGetLevelsQuery, useGetDifficultiesByLevelQuery } from "../../redux/services/vendorApi";
import { X, Tag, Clock, BookOpen, Code2, FileText, Layers, ChevronRight, AlertCircle } from "lucide-react";
import Select from "react-select";

// ─── Technical Skills list ───────────────────────────────────────────────────
const technicalSkills = [
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "nodeJS", label: "NodeJS" },
  { value: "react", label: "React" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "golang", label: "Go" },
  { value: "csharp", label: "C#" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "sql", label: "SQL" }
];

// ─── Label helpers ────────────────────────────────────────────────────────────
const LABEL_STYLES = {
  easy: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  hard: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  default: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
};

function getLabelStyle(label = "") {
  return LABEL_STYLES[label.toLowerCase()] ?? LABEL_STYLES.default;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 bg-white rounded-lg border border-gray-100 py-2.5 px-3">
      <Icon size={13} className="text-gray-400 mb-0.5" />
      <span className="text-sm font-medium text-gray-800 leading-none">{value}</span>
      <span className="text-[11px] text-gray-400 leading-none">{label}</span>
    </div>
  );
}

function DifficultyCard({ diff, selected, onClick, animDelay }) {
  // Ensure diff and label exist before rendering
  if (!diff || !diff.label) {
    return null;
  }
  const style = getLabelStyle(diff.label);
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${animDelay}ms` }}
      className={`
        group relative w-full text-left rounded-xl border p-4 transition-all duration-200
        animate-fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
        ${selected
          ? "border-violet-400 bg-violet-50 shadow-sm shadow-violet-100"
          : "border-gray-200 bg-[#fcffff] hover:border-violet-200 hover:bg-white hover:shadow-sm"}
         
      `}
    >
      {/* Selected indicator */}
      {selected && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-violet-500" />
      )}

      {/* Label pill */}
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${style.bg} ${style.text} ${style.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {diff.label}
      </span>

      {/* Difficulty name, render if present */}
      {diff.difficulty_name && (
        <p className="text-[15px] font-semibold text-gray-800 mb-3">{diff.difficulty_name}</p>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {diff.questions !== undefined && (
          <StatPill icon={BookOpen} value={diff.questions} label="Questions" />
        )}
        {diff.timeLimit !== undefined && (
          <StatPill icon={Clock} value={`${diff.timeLimit}m`} label="Time" />
        )}
        {diff.mcqCount !== undefined && (
          <StatPill icon={Tag} value={diff.mcqCount} label="MCQ" />
        )}
        {diff.codingCount !== undefined && (
          <StatPill icon={Code2} value={diff.codingCount} label="Coding" />
        )}
        {diff.scenarioCount !== undefined && (
          <StatPill icon={FileText} value={diff.scenarioCount} label="Scenario" />
        )}
      </div>
    </button>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 h-44">
          <div className="w-16 h-5 bg-gray-200 rounded-full mb-3" />
          <div className="w-28 h-4 bg-gray-200 rounded mb-3" />
          <div className="grid grid-cols-3 gap-1.5">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <AlertCircle size={28} className="text-red-400" />
      <p className="text-sm text-gray-500">{message || "Something went wrong."}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Layers size={28} className="text-gray-300" />
      <p className="text-sm text-gray-400">No difficulties found for this level.</p>
    </div>
  );
}

// ─── Main Popup ───────────────────────────────────────────────────────────────
/**
 * Props:
 *  isOpen       – boolean, controls visibility
 *  onClose      – () => void
 *  onConfirm    – (payload: { level, difficulty }) => void
 */
export default function LevelDifficultyPopup({ isOpen, onClose, onConfirm, isLoading }) {
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedDiffId, setSelectedDiffId] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);


  // console.log("sele", selectedLevelId)
  // ── Fetch levels ────────────────────────────────────────────────────────────
  const {
    data: levelsData,
    isLoading: levelsLoading,
    isError: levelsError,
  } = useGetLevelsQuery(undefined, { skip: !isOpen });

  // ── Auto-select first level once loaded ─────────────────────────────────────
  useEffect(() => {
    if (levelsData?.levels?.length && !selectedLevelId) {
      setSelectedLevelId(levelsData.levels[0]._id);
    }
  }, [levelsData, selectedLevelId]);

  // ── Fetch difficulties for the selected level ───────────────────────────────
  const {
    data: diffsData,
    isLoading: diffsLoading,
    isFetching: diffsFetching,
    isError: diffsError,
  } = useGetDifficultiesByLevelQuery(selectedLevelId, { skip: !selectedLevelId });

  // Reset selected difficulty when level changes
  useEffect(() => { setSelectedDiffId(null); }, [selectedLevelId]);

  // ── Open / close animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimatingOut(false);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setAnimatingOut(true);
    setTimeout(() => {
      setVisible(false);
      setAnimatingOut(false);
      setSelectedLevelId(null);
      setSelectedDiffId(null);
      setSelectedSkills([]);
      onClose?.();
    }, 200);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, handleClose]);

  if (!visible) return null;

  // ── Derived data ────────────────────────────────────────────────────────────
  const levels = levelsData?.levels ?? [];
  const difficulties = diffsData?.difficulties ?? [];
  const selectedLevel = levels.find((l) => l._id === selectedLevelId);
  const selectedDiff = difficulties.find((d) => d._id === selectedDiffId);

  function handleConfirm() {
    if (!selectedDiff) return;
    onConfirm?.({ level: selectedLevel, difficulty: selectedDiff, skills: selectedSkills, closePopup: handleClose });
    // handleClose();
  }
  const isValid =
    !!selectedDiff &&
    (selectedLevelId === "LEVEL_001" ||
      (selectedSkills && selectedSkills.length > 0));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm transition-opacity duration-200
        ${animatingOut ? "opacity-0" : "opacity-100"}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Level and Difficulty Selection"
    >
      <div
        className={`relative w-full max-w-[620px] bg-white rounded-2xl shadow-xl
          border border-gray-50 overflow-hidden flex flex-col max-h-[90vh]
          transition-all duration-200
          ${animatingOut ? "opacity-0 scale-95 translate-y-3" : "opacity-100 scale-100 translate-y-0"}`}
        style={{ animation: animatingOut ? "none" : "popIn 0.28s cubic-bezier(0.22,0.68,0,1.2) both" }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Layers size={16} className="text-violet-500" />
              <h2 className="text-base font-semibold text-gray-900">Select Difficulty</h2>
            </div>
            <p className="text-[13px] text-gray-400">
              {selectedLevel
                ? `${selectedLevel.name} · ${selectedLevel.description}`
                : "Choose a level then pick a difficulty"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg border border-gray-200
              text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Level tabs ── */}
        <div className="px-6 pt-4 pb-0">
          {levelsLoading ? (
            <div className="flex gap-2 animate-pulse">
              {[80, 80].map((w, i) => (
                <div key={i} className="h-8 rounded-lg bg-gray-100" style={{ width: w }} />
              ))}
            </div>
          ) : levelsError ? (
            <p className="text-xs text-red-500 pb-3">Failed to load levels</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin">
              {levels.map((lvl) => (
                <button
                  key={lvl._id}
                  onClick={() => setSelectedLevelId(lvl._id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5
                    text-[13px] font-medium rounded-lg border transition-all duration-150
                    ${selectedLevelId === lvl._id
                      ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600"}`}
                >
                  {lvl.name}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                    ${selectedLevelId === lvl._id ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {lvl.duration}m
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Divider with breadcrumb ── */}
        {selectedLevel && (
          <div className="flex items-center gap-1.5 px-6 py-2 text-[12px] text-gray-400 border-b border-gray-100">
            <span>Levels</span>
            <ChevronRight size={12} />
            <span className="text-violet-600 font-medium">{selectedLevel.name}</span>
            {selectedLevelId !== "LEVEL_001" && <ChevronRight size={12} />}
            {selectedLevelId !== "LEVEL_001" && <span>Difficulties</span>}
          </div>
        )}

        {/* ── Difficulty body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-[220px]">
          {diffsLoading || diffsFetching ? (
            <Skeleton />
          ) : diffsError ? (
            <ErrorState message="Failed to load difficulties. Please try again." />
          ) : difficulties.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {
                selectedLevelId !== "LEVEL_001" &&
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Select Technical Skills
                  </label>
                  <Select
                    isMulti
                    options={technicalSkills}
                    value={selectedSkills}
                    onChange={setSelectedSkills}
                    placeholder="Choose skills (e.g. Java, C++, NodeJS...)"
                    className="text-sm"
                    classNamePrefix="react-select"
                    isClearable
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? '#8b5cf6' : '#e5e7eb',
                        boxShadow: state.isFocused ? '0 0 0 2px rgba(139, 92, 246, 0.2)' : 'none',
                        '&:hover': {
                          borderColor: state.isFocused ? '#8b5cf6' : '#c084fc',
                        },
                        borderRadius: '0.75rem',
                        padding: '2px 4px',
                        outline: 'none',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? '#8b5cf6'
                          : state.isFocused
                            ? '#f3e8ff'
                            : 'white',
                        color: state.isSelected ? 'white' : '#374151',
                        '&:active': {
                          backgroundColor: '#8b5cf6',
                        },
                      }),
                    }}
                  />
                </div>
              }


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {difficulties.map((diff, i) => (
                  <DifficultyCard
                    key={diff._id}
                    diff={diff}
                    selected={selectedDiffId === diff._id}
                    onClick={() => setSelectedDiffId(diff._id)}
                    animDelay={i * 60}
                  />
                ))}
              </div>

            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          {/* Selected summary */}
          <div className="text-[13px] text-gray-500 truncate">
            {selectedDiff ? (
              <span>
                Selected:{" "}
                <span className="font-medium text-gray-800">
                  {selectedLevel?.name} · {selectedDiff.difficulty_name}{selectedSkills && selectedSkills.length > 0 ? ` · ${selectedSkills.map(s => s.label).join(", ")}` : ""}
                </span>
              </span>
            ) : (
              "No difficulty selected"
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleClose}
              className="px-4 py-2 cursor-pointer text-[13px] font-medium text-gray-600 rounded-lg
                border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isValid}
              className={`px-4 py-2 cursor-pointer text-[13px] font-medium rounded-lg transition-all duration-150
    ${isValid
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-200 active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              {isLoading ? "Sending..." : "Confirm selection"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.22s ease both;
        }
      `}</style>
    </div>
  );
}