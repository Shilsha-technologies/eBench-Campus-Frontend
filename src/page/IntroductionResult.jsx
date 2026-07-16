import { useState } from "react";
import { useViewResultByUserIdBySubVendorQuery } from "../redux/services/subvendorApi";
import { useViewResultByUserIdQuery } from "../redux/services/vendorApi";
import { useSearchParams } from "react-router-dom";
import Loader from "../libs/Loader";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// ---------------- small inline icons (no external icon lib) ----------------
const Icon = {
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  Globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9S9.5 5.7 12 3z" />
    </svg>
  ),
  Mic: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
    </svg>
  ),
  Code: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M8 6 2 12l6 6M16 6l6 6-6 6" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
};

// ---------------- helpers ----------------
const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const scoreColor = (pct) => {
  if (pct >= 70) return { text: "text-emerald-600", ring: "stroke-emerald-500", bg: "bg-emerald-50" };
  if (pct >= 40) return { text: "text-amber-600", ring: "stroke-amber-500", bg: "bg-amber-50" };
  return { text: "text-rose-600", ring: "stroke-rose-500", bg: "bg-rose-50" };
};

// ---------------- Circular score gauge ----------------
function ScoreRing({ value, max = 100, size = 84 }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const c = scoreColor(pct);
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="8"
          fill="none"
          className="stroke-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className={`${c.ring} transition-all duration-700 ease-out`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${c.text}`}>{value}</span>
        <span className="text-[10px] text-slate-400 font-medium">/{max}</span>
      </div>
    </div>
  );
}

// ---------------- Linear sub-score bar ----------------
function ScoreBar({ label, value, max, correct, icon }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const c = scoreColor(pct);
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.bg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className={`text-sm font-semibold ${c.text}`}>
            {value}/{max}
            {correct !== undefined && (
              <span className="ml-1 text-xs font-normal text-slate-400">
                ({correct} correct)
              </span>
            )}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${c.ring.replace("stroke-", "bg-")} transition-all duration-700 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function InfoChip({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

// ---------------- Level 1: Communication ----------------
function CommunicationCard({ level }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const c = scoreColor(level.score);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon.Mic className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Level 1 · Communication</h3>
            <p className="text-xs text-slate-400">{formatDate(level.created_at)}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
          {level.score}%
        </span>
      </div>

      <div className="flex items-center gap-5 mb-4">
        <ScoreRing value={Math.round(level.score)} max={100} size={72} />
        <div className="flex-1 space-y-2">
          <InfoChip
            icon={<Icon.Globe className="h-4 w-4" />}
            value={`Detected language: ${level.detected_language}`}
          />
        </div>
      </div>

      <button
        onClick={() => setShowTranscript((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <span>View transcript</span>
        <Icon.ChevronDown
          className={`h-4 w-4 transition-transform ${showTranscript ? "rotate-180" : ""}`}
        />
      </button>
      {showTranscript && (
        <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 italic">
          "{level.transcript}"
        </p>
      )}
    </div>
  );
}

// ---------------- Level 2: Technical ----------------
function TechnicalCard({ level }) {
  const d = level.details;
  debugger;
  const c = scoreColor(level.score * 10); // small denom score, scale roughly for badge tone

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon.Code className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Level 2 · Technical</h3>
            <p className="text-xs text-slate-400">{formatDate(level.created_at)}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {d.role_label}
        </span>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <ScoreRing value={d.total_score} max={20} size={72} />
        <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-400">Test type</p>
            <p className="font-medium text-slate-700 capitalize">{d.test_type}</p>
          </div>
          <div>
            <p className="text-slate-400">Status</p>
            <p className="font-medium text-slate-700 capitalize">{d.status}</p>
          </div>
          <div>
            <p className="text-slate-400">Tab switches</p>
            <p className="font-medium text-slate-700">{d.tab_switch_count}</p>
          </div>
          <div>
            <p className="text-slate-400">Fullscreen exits</p>
            <p className="font-medium text-slate-700">{d.fullscreen_exit_count}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar
          label="MCQ"
          value={d.mcq_score}
          max={d.mcq_total}
          correct={d.mcq_correct}
          icon={<span className="text-xs font-bold">Q</span>}
        />
        <ScoreBar
          label="Coding"
          value={d.coding_passed_cases}
          max={d.coding_total_cases}
          icon={<Icon.Code className="h-4 w-4" />}
        />
        <ScoreBar
          label="Scenario"
          value={d.scenario_score}
          max={d.scenario_count}
          icon={<span className="text-xs font-bold">S</span>}
        />
      </div>
    </div>
  );
}

// ---------------- Candidate header ----------------
function CandidateHeader({ data }) {
  const fullName = `${data.first_name} ${data.last_name}`.trim();
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold text-white">
          {initials}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold text-slate-800">{fullName}</h2>
          <p className="text-xs text-slate-400 font-mono">{data.candidate_id}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          <InfoChip icon={<Icon.Mail className="h-4 w-4" />} value={data.email} />
          <InfoChip icon={<Icon.Phone className="h-4 w-4" />} value={`+${data.mobile}`} />
          <InfoChip icon={<Icon.Globe className="h-4 w-4" />} value={data.country_of_residence} />
        </div>
      </div>
    </div>
  );
}

// ---------------- Main component ----------------
export default function CandidateResultDisplay() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const role = localStorage.getItem('role')
  const { data, isLoading } = role === "sub_vendor" ? useViewResultByUserIdBySubVendorQuery({ candidateId }) : useViewResultByUserIdQuery({ candidateId })

  console.log("fff", data)

  if (isLoading) {
    return <Loader />
  }


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">

      <div className="mx-auto w-11/12">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="text-sm  cursor-pointer " />
          <span>Back</span>
        </button>
        <CandidateHeader data={data} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.LEVEL_001 && <CommunicationCard level={data.LEVEL_001} />}
          {data.LEVEL_002 && <TechnicalCard level={data.LEVEL_002} />}
        </div>
      </div>
    </div>
  );
}