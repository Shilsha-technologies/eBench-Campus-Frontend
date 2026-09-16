import { useState } from "react";
import { useViewResultByUserIdBySubVendorQuery } from "../redux/services/subvendorApi";
import { useViewResultByUserIdQuery } from "../redux/services/vendorApi";
import { useSearchParams } from "react-router-dom";
import Loader from "../libs/Loader";
import { useNavigate } from "react-router-dom";
import { ArrowLeft,
    ChevronDown,
  Clock,
  AlertTriangle,
  Eye,
  MonitorX,
  CheckCircle2,
 } from "lucide-react";
import { FeedbackList } from "./vendor/user/CandidateDetailsPage";

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
          strokeDashoffset={offset??0}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-bold ${c.text}`}>{value}</span>
        {/* <span className="text-[10px] text-slate-400 font-medium">/{max}</span> */}
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
            {/* {correct !== undefined && (
              <span className="ml-1 text-xs font-normal text-slate-400">
                ({correct} correct)
              </span>
            )} */}
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
function scoreColor1(score) {
  if (score >= 70) return { bg: "bg-emerald-50", text: "text-emerald-600" };
  if (score >= 40) return { bg: "bg-amber-50", text: "text-amber-600" };
  return { bg: "bg-rose-50", text: "text-rose-600" };
}




function scoreBand(pct) {
  if (pct >= 70) return { label: "Strong", color: "#1E824C", bg: "#EAF6EE" };
  if (pct >= 40) return { label: "Moderate", color: "#B8860B", bg: "#FBF3E1" };
  return { label: "Weak", color: "#C4432B", bg: "#FBEAE6" };
}

export function StatBar({ label, passed, total }) {
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-[13px] text-[#4B5566]">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-[#EEF0F3]">
        <div
          className="h-1.5 rounded-full bg-[#0E6B64] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="w-12 shrink-0 text-right text-[13px] tabular-nums"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {passed}/{total}
      </span>
    </div>
  );
}

function FeedbackTabs({ feedback }) {
  const tabs = [
    { key: "vendor", label: "Vendor feedback" },
    { key: "candidate", label: "Candidate feedback" },
    { key: "parent", label: "Parent feedback" },
  ].filter((t) => feedback?.[t.key]);

  const [active, setActive] = useState(tabs[0]?.key);
  const f = feedback?.[active];
  if (!f) return null;

  const listSections = Object.entries(f).filter(
    ([, v]) => Array.isArray(v) && v.length
  );
  const textSections = Object.entries(f).filter(
    ([, v]) => typeof v === "string" && v.trim()
  );
  const objectSections = Object.entries(f).filter(
    ([, v]) => v && typeof v === "object" && !Array.isArray(v)
  );

  const titleCase = (s) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div>
      <div className="flex gap-1 border-b border-[#E2E5EA]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-2 text-[13px] font-medium transition-colors ${
              active === t.key
                ? "border-b-2 border-[#0E6B64] text-[#151A24]"
                : "text-[#8A93A3] hover:text-[#4B5566]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        {textSections.map(([key, val]) => (
          <p key={key} className="text-[13px] leading-relaxed text-[#4B5566]">
            {val}
          </p>
        ))}

        {listSections.map(([key, val]) => (
          <div key={key}>
            <div className="mb-1.5 text-[12px] font-medium text-[#151A24]">
              {titleCase(key)}
            </div>
            <ul className="space-y-1">
              {val.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[13px] leading-relaxed text-[#4B5566]"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#0E6B64]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {objectSections.map(([key, val]) => (
          <div key={key}>
            <div className="mb-1.5 text-[12px] font-medium text-[#151A24]">
              {titleCase(key)}
            </div>
            <dl className="space-y-1.5">
              {Object.entries(val).map(([k, v]) => (
                <div key={k} className="flex gap-2 text-[13px] leading-relaxed">
                  <dt className="shrink-0 text-[#8A93A3]">{titleCase(k)}:</dt>
                  <dd className="text-[#4B5566]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttemptCard({ test, index, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const d = test.details || {};
  const pct = d.overall_score_percentage ?? 0;
  const band = scoreBand(pct);
  const flagged = d?.tab_switch_count > 0 || d.auto_submitted;
  // debugger;

  return (
    <div className="relative pl-6">
      {/* rail */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
        style={{ backgroundColor: band.color }}
      />

      <div className="overflow-hidden rounded-xl border border-[#E2E5EA] bg-white">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left"
        >
          <div>
            <div className="text-[14px] font-medium text-[#151A24]">
              {d.role_label || "Technical test"}{" "}
              <span className="font-normal text-[#8A93A3]">
                · {d.difficulty || "—"}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#8A93A3]">
              <Clock size={12} />
              {test.created_at
                ? new Date(test.created_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—"}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {flagged && (
              <span
                title="Possible integrity flag"
                className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium"
                style={{ backgroundColor: "#FBEAE6", color: "#C4432B" }}
              >
                <AlertTriangle size={12} />
                Review
              </span>
            )}

            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ backgroundColor: band.bg, color: band.color }}
            >
              {band.label}
            </span>

            <div className="text-right">
              <div
                className="text-[18px] font-semibold leading-none tabular-nums"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: band.color }}
              >
                {pct}%
              </div>
              <div className="mt-1 text-[11px] text-[#8A93A3]">
                {test.score}/{test.total_score} pts
              </div>
            </div>

            <ChevronDown
              size={16}
              className={`text-[#8A93A3] transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {open && (
          <div className="space-y-5 border-t border-[#E2E5EA] px-5 py-5">
            <div className="space-y-2.5">
              <StatBar label="MCQ" passed={d.mcq_correct} total={d.total_mcq} />
              <StatBar
                label="Coding"
                passed={d.coding_passed_cases}
                total={d.coding_total_cases}
              />
              {d.attempted_scenario != null && (
                <StatBar
                  label="Scenario"
                  passed={d.scenario_correct ?? 0}
                  total={d.total_scenario ?? 0}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Pill icon={<Eye size={12} />} label={`${d.tab_switch_count ?? 0} tab switches`} warn={d.tab_switch_count > 0} />
              <Pill
                icon={<MonitorX size={12} />}
                label={`${d.fullscreen_exit_count ?? 0} fullscreen exits`}
                warn={d.fullscreen_exit_count > 0}
              />
              <Pill
                icon={<CheckCircle2 size={12} />}
                label={d.auto_submitted ? "Auto-submitted" : "Submitted manually"}
                warn={d.auto_submitted}
              />
            </div>

            {d.ai_feedback && !d.ai_feedback.error && (
              <FeedbackTabs feedback={d.ai_feedback} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ icon, label, warn }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
      style={{
        backgroundColor: warn ? "#FBF3E1" : "#EEF0F3",
        color: warn ? "#B8860B" : "#4B5566",
      }}
    >
      {icon}
      {label}
    </span>
  );
}

export function Level2TestHistory({ level }) {
  if (!level) return null;

  if (level.status === "not_attempted" || !level.tests?.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2E5EA] bg-[#F5F6F8] px-5 py-6 text-center">
        <div className="text-[13px] text-[#8A93A3]">
          {level.message || "No technical test attempted yet."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl bg-[#F5F6F8] p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold text-[#151A24]">
          Technical test history
        </h2>
        <span className="text-[12px] text-[#8A93A3]">
          {level.test_count} attempt{level.test_count !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {level.tests.map((test, i) => (
          <AttemptCard
            key={test.result_id ?? i}
            test={test}
            index={i}
            defaultOpen={i === level.tests.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function getFeedbackText(test) {
  const fb = test.ai_feedback || test.metrics_json?.feedback;
  if (!fb) return "No feedback available";
  if (typeof fb === "string") return fb;
  return fb.message || (fb.issues?.length ? fb.issues.join(", ") : "No feedback available");
}

// Maps every level the candidate has test history for, instead of
// hardcoding just LEVEL_001.
function TestHistoryPanel({ data }) {
  // debugger;
  if (!data) return null;


  if (data?.test_count == 0) {
    return <p className="text-xs text-slate-400">No test history found for this candidate.</p>;
  }
  console.log("dd",data?.tests)

  return (
    <div className="space-y-4">
      {data?.tests?.map((data,index) => (
        <TestHistoryCard key={index} level_name={"Communication"} level={data} />
      ))}
    </div>
  );
}

function TestHistoryCard({ level,level_name }) {
  // debugger;
  const tests = level ;
  // console.log("ttt",tests);  
  const sortedTests = [tests]
  const latest = sortedTests[0];
  const previous = sortedTests[1];
  const latestColor = scoreColor(latest?.score ?? 0);

  const trend =
    latest && previous
      ? Math.round((latest.score ?? 0) - (previous.score ?? 0))
      : null;
 
  const [expandedIds, setExpandedIds] = useState({});
  const toggleExpanded = (id) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 capitalize">
              {level_name}
            </h3>
          </div>
        </div>

        {latest && (
          <div className="flex items-center gap-2">
            {trend !== null && trend !== 0 && (
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  trend > 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {trend > 0 ? "↑" : "↓"}
                {Math.abs(trend)}
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${latestColor.bg} ${latestColor.text}`}
            >
              {latest?.score ?? 0}%
            </span>
          </div>
        )}
      </div>

      {/* Timeline of attempts */}
      {sortedTests.length === 0 ? (
        <p className="text-xs text-slate-400">No tests taken yet.</p>
      ) : (
        <div className="relative">
          {sortedTests.map((test, i) => {
            const id = test.result_id ?? i;
            const isExpanded = !!expandedIds[id];
            const isLatest = i === 0;
            const isLast = i === sortedTests.length - 1;
            const rowColor = scoreColor(test?.score ?? 0);
            const hasError = !!test?.ai_feedback?.error;
            // Not every level type has a transcript (only communication does).
            const hasTranscript = typeof test.transcript === "string" && test.transcript.length > 0;

            return (
              <div key={id} className="relative flex gap-3">
                {/* Rail: dot + connecting line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`mt-3 h-2.5 w-2.5 shrink-0 rounded-full ${
                      hasError
                        ? "bg-slate-300"
                        : isLatest
                        ? rowColor.dot
                        : "bg-slate-300"
                    }`}
                  />
                  {!isLast && <div className="w-px flex-1 bg-slate-200" />}
                </div>

                {/* Attempt content */}
                <div className={`flex-1 min-w-0 ${isLast ? "" : "pb-3"}`}>
                  <button
                    onClick={() => toggleExpanded(id)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50 transition-colors -ml-2.5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-slate-700">
                          {formatDate(test?.created_at)}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {test.detected_language || "—"}
                        {test.speech_rate_wpm ? ` · ${Math.round(test.speech_rate_wpm)} wpm` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {hasError ? (
                        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-500">
                          <AlertTriangle className="h-3 w-3" />
                          Failed
                        </span>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${rowColor.bg} ${rowColor.text}`}
                        >
                          {test?.score ?? 0}%
                        </span>
                      )}
                      <Icon.ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 space-y-3">
                      {hasTranscript && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                            Transcript
                          </p>
                          <p className="rounded-lg bg-white border border-slate-200 p-2.5 text-xs leading-relaxed text-slate-600 italic">
                            "{test.transcript}"
                          </p>
                        </div>
                      )}

                      {test?.ai_feedback && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                            Feedback
                          </p>

                          {hasError ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-semibold text-red-800">
                                  Evaluation Failed
                                </span>
                              </div>
                              <p className="text-sm text-red-700">
                                {test?.ai_feedback?.error?.message ||
                                  "Unable to evaluate this attempt."}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {test?.ai_feedback?.candidate && (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                  <div className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">
                                    For Student
                                  </div>
                                  <FeedbackList
                                    title="Strengths"
                                    items={test?.ai_feedback?.candidate?.strengths}
                                    dotColor="bg-green-500"
                                  />
                                  <FeedbackList
                                    title="Areas to Improve"
                                    items={test?.ai_feedback?.candidate?.areas_to_improve}
                                    dotColor="bg-amber-500"
                                  />
                                  <FeedbackList
                                    title="Recommendations"
                                    items={test?.ai_feedback?.candidate?.recommendations}
                                    dotColor="bg-blue-500"
                                  />
                                  <FeedbackList
                                    title="Tips"
                                    items={test?.ai_feedback?.candidate?.tips}
                                    dotColor="bg-indigo-500"
                                  />
                                </div>
                              )}

                              {test?.ai_feedback?.vendor && (
                                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                                  <div className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">
                                    For Campus
                                  </div>
                                  {test?.ai_feedback?.vendor?.performance_summary && (
                                    <p className="text-sm text-purple-800 mt-1">
                                      {test?.ai_feedback?.vendor?.performance_summary}
                                    </p>
                                  )}
                                  <FeedbackList
                                    title="Key Strengths"
                                    items={test?.ai_feedback?.vendor?.key_strengths}
                                    dotColor="bg-green-500"
                                  />
                                  <FeedbackList
                                    title="Critical Issues"
                                    items={test?.ai_feedback?.vendor?.critical_issues}
                                    dotColor="bg-red-500"
                                  />
                                  <FeedbackList
                                    title="Training Focus"
                                    items={test?.ai_feedback?.vendor?.training_focus}
                                    dotColor="bg-amber-500"
                                  />
                                  <FeedbackList
                                    title="Recommendations"
                                    items={test?.ai_feedback?.vendor?.recommendations}
                                    dotColor="bg-purple-500"
                                  />

                                  {test?.ai_feedback?.vendor?.skill_assessment && (
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      {Object.entries(test.ai_feedback.vendor.skill_assessment).map(
                                        ([key, value]) => (
                                          <div key={key} className="bg-white rounded-md p-2 border border-purple-100">
                                            <div className="text-[10px] font-semibold text-purple-500 uppercase">
                                              {key.replace(/_/g, " ")}
                                            </div>
                                            <div className="text-xs text-gray-700 mt-0.5">{value}</div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}

                                  {test?.ai_feedback?.vendor?.hire_recommendation && (
                                    <div className="mt-3 pt-3 border-t border-purple-200 flex items-center gap-2">
                                      <span className="text-xs font-semibold text-purple-600">Recommendation:</span>
                                      <span className="text-sm text-purple-900">
                                        {test?.ai_feedback?.vendor?.hire_recommendation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {test?.ai_feedback?.parent && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                                  <div className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-1">
                                    For Parents
                                  </div>
                                  {test?.ai_feedback?.parent?.overall_summary && (
                                    <p className="text-sm text-emerald-800 mt-1">
                                      {test?.ai_feedback?.parent?.overall_summary}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {test?.ai_feedback?.parent?.conceptual_knowledge_level && (
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        {test?.ai_feedback?.parent?.conceptual_knowledge_level}
                                      </span>
                                    )}
                                    {test?.ai_feedback?.parent?.problem_solving_level && (
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        {test.ai_feedback.parent.problem_solving_level}
                                      </span>
                                    )}
                                  </div>

                                  <FeedbackList
                                    title="Strengths"
                                    items={test?.ai_feedback?.parent?.strengths}
                                    dotColor="bg-green-500"
                                  />
                                  <FeedbackList
                                    title="Areas of Improvement"
                                    items={test?.ai_feedback?.parent?.areas_of_improvement}
                                    dotColor="bg-amber-500"
                                  />
                                  <FeedbackList
                                    title="Guidance"
                                    items={test?.ai_feedback?.parent?.parent_guidance}
                                    dotColor="bg-emerald-500"
                                  />

                                  {test?.ai_feedback?.parent?.encouragement && (
                                    <p className="text-xs italic text-emerald-700 mt-3 pt-3 border-t border-emerald-200">
                                      {test?.ai_feedback?.parent?.encouragement}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------- Level 2: Technical ----------------
function TechnicalCard({ level }) {
  // console.log("level---card", level)
  // debugger;
  const d = level.details;
  const c = scoreColor(level.score * 10); // small denom score, scale roughly for badge tone
  // debugger;

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
          {d?.role_label}
        </span>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <ScoreRing value={d?.overall_score_percentage} size={72} />
        <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-400">Test type</p>
            <p className="font-medium text-slate-700 capitalize">{d?.test_type}</p>
          </div>
          <div>
            <p className="text-slate-400">Status</p>
            <p className="font-medium text-slate-700 capitalize">{d?.status}</p>
          </div>
          <div>
            <p className="text-slate-400">Tab switches</p>
            <p className="font-medium text-slate-700">{d?.tab_switch_count}</p>
          </div>
          <div>
            <p className="text-slate-400">Fullscreen exits</p>
            <p className="font-medium text-slate-700">{d?.fullscreen_exit_count}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar
          label="MCQ"
          value={d?.mcq_score}
          max={d?.mcq_total}
          correct={d?.mcq_correct}
          icon={<span className="text-xs font-bold">Q</span>}
        />
        <ScoreBar
          label="Coding"
          value={d?.coding_passed_cases}
          max={d?.coding_total_cases}
          icon={<Icon.Code className="h-4 w-4" />}
        />
        <ScoreBar
          label="Scenario"
          value={d?.scenario_score}
          max={d?.scenario_count}
          icon={<span className="text-xs font-bold">S</span>}
        />
      </div>
    </div>
  );
}

// ---------------- Candidate header ----------------
function CandidateHeader({ data }) {
  const fullName = `${data?.first_name} ${data?.last_name}`.trim();
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
          {/* <p className="text-xs text-slate-400 font-mono">{data.candidate_id}</p> */}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          <InfoChip icon={<Icon.Mail className="h-4 w-4" />} value={data.email} />
          <InfoChip icon={<Icon.Phone className="h-4 w-4" />} value={`${data.mobile}`} />
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
  const { data, isLoading, isError,error } = role === "sub_vendor" ? useViewResultByUserIdBySubVendorQuery({ candidateId }) : useViewResultByUserIdQuery({ candidateId })

  console.log("fff", data)

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div className="flex items-center h-full justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">⚠️</div>

          <h1 className="mb-2 text-3xl font-bold text-red-900">
            {error?.data?.detail??"Somthing went wrong"}
          </h1>

          <p className="mb-6 text-gray-600">
            We couldn’t load this page. Please try again.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-gray-900 cursor-pointer px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try again
          </button>
        </div>
      </div>
    )
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
          {data?.LEVEL_001 && <TestHistoryPanel data={data?.LEVEL_001} />}
          {/* {data?.LEVEL_002 && <TechnicalCard level={data?.LEVEL_002} />} */}
          {data?.LEVEL_002 && <Level2TestHistory level={data?.LEVEL_002} />}

        </div>
      </div>
    </div>
  );
}