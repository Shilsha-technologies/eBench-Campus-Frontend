import { useState } from "react";

// Icons (inline SVG)
const Icon = ({ name, cls = "w-5 h-5" }) => {
  const icons = {
    results: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    download: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  };
  return icons[name] || null;
};

// Badge component
function Badge({ status }) {
  const map = {
    Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Expired: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    Pass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Fail: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    Eligible: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Not Eligible": "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

// Card component
function Card({ children, className = "" }) {
  return <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>{children}</div>;
}

export default function ResultsPage() {
  // Mock data - in real app this would come from context/API
  const completedTests = [
    { id: "T001", role: "SDE Intern", category: "DSA", date: "2026-04-20", status: "Completed", score: 82 },
    { id: "T002", role: "Frontend Dev", category: "React", date: "2026-04-15", status: "Completed", score: 91 },
    { id: "T003", role: "Data Analyst", category: "Aptitude", date: "2026-04-10", status: "Completed", score: 58 },
    { id: "T005", role: "Full Stack Dev", category: "React", date: "2026-03-20", status: "Completed", score: 76 },
    { id: "T006", role: "ML Intern", category: "Python", date: "2026-03-10", status: "Completed", score: 44 },
    { id: "T007", role: "SDE Intern", category: "DSA", date: "2026-02-25", status: "Completed", score: 88 },
  ];

  const [selected, setSelected] = useState(completedTests[0]?.id || null);
  const test = completedTests.find(t => t.id === selected);

  const breakdown = test ? [
    { topic: "Core Concepts", correct: Math.round(test.score * 0.4 / 10), total: 4 },
    { topic: "Problem Solving", correct: Math.round(test.score * 0.35 / 10), total: 4 },
    { topic: "Best Practices", correct: Math.round(test.score * 0.25 / 10), total: 3 },
  ] : [];

  const handleDownload = () => {
    // Mock download functionality
    console.log("Downloading PDF result...");
  };

  if (completedTests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
        <Icon name="results" cls="w-14 h-14 opacity-20" />
        <p className="text-base font-medium">No results yet</p>
        <p className="text-sm text-slate-300">Complete a test to see your results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Test Results</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of your performance.</p>
        </div>
        {test && (
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-colors">
            <Icon name="download" cls="w-4 h-4" /> Download PDF
          </button>
        )}
      </div>

      {/* Test Selector */}
      <div className="flex gap-2 flex-wrap">
        {completedTests.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selected === t.id 
                ? "bg-violet-600 text-white border-violet-600" 
                : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-violet-300"
            }`}>
            {t.role} · {t.date}
          </button>
        ))}
      </div>

      {test && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Score Overview */}
          <Card className="p-6 flex flex-col items-center text-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  strokeDasharray={`${test.score * 2.64} 264`}
                  className={test.score >= 60 ? "text-emerald-500" : "text-red-500"}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{test.score}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="space-y-2">
              <Badge status={test.score >= 60 ? "Pass" : "Fail"} />
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{test.role}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{test.category} · {test.date}</p>
              <Badge status={test.score >= 70 ? "Eligible" : "Not Eligible"} />
            </div>
          </Card>

          {/* Topic Breakdown */}
          <Card className="p-5 lg:col-span-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Performance Breakdown</h3>
            <div className="space-y-4">
              {breakdown.map((b, i) => {
                const pct = Math.round((b.correct / b.total) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-slate-700 dark:text-slate-200">{b.topic}</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{b.correct}/{b.total} correct</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all ${pct >= 60 ? "bg-emerald-500" : "bg-red-400"}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {test.score < 60 && (
              <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">💡 Suggestion</p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  You scored below the pass threshold. Review <strong>{test.category}</strong> concepts and retry. You got this! 💪
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
