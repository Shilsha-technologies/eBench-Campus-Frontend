import { useState } from "react";

// Icons (inline SVG)
const Icon = ({ name, cls = "w-5 h-5" }) => {
  const icons = {
    history: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    filter: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>,
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

export default function TestHistoryPage() {
  // Mock data - in real app this would come from context/API
  const tests = [
    { id: "T001", role: "SDE Intern", category: "DSA", date: "2026-04-20", status: "Completed", score: 82 },
    { id: "T002", role: "Frontend Dev", category: "React", date: "2026-04-15", status: "Completed", score: 91 },
    { id: "T003", role: "Data Analyst", category: "Aptitude", date: "2026-04-10", status: "Completed", score: 58 },
    { id: "T004", role: "Backend Intern", category: "Node.js", date: "2026-03-28", status: "Expired", score: null },
    { id: "T005", role: "Full Stack Dev", category: "React", date: "2026-03-20", status: "Completed", score: 76 },
    { id: "T006", role: "ML Intern", category: "Python", date: "2026-03-10", status: "Completed", score: 44 },
    { id: "T007", role: "SDE Intern", category: "DSA", date: "2026-02-25", status: "Completed", score: 88 },
    { id: "T008", role: "DevOps", category: "Linux", date: "2026-02-15", status: "Pending", score: null },
  ];

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = tests.filter(t => {
    const statusMatch = filterStatus === "All" || t.status === filterStatus;
    const dateMatch = !filterDate || t.date >= filterDate;
    return statusMatch && dateMatch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Test History</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All your past and pending tests in one place.</p>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap gap-3 items-center">
        <Icon name="filter" cls="w-4 h-4 text-slate-400" />
        <div className="flex gap-2 flex-wrap">
          {["All", "Completed", "Pending", "Expired"].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === s 
                  ? "bg-violet-600 text-white" 
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}>
              {s}
            </button>
          ))}
        </div>
        <input 
          type="date" 
          value={filterDate} 
          onChange={e => { setFilterDate(e.target.value); setPage(1); }}
          className="ml-auto text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400" 
        />
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <Icon name="history" cls="w-12 h-12 opacity-30" />
            <p className="text-sm font-medium">No test history found</p>
            <p className="text-xs text-slate-300">Try changing the filter or request a new test.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    {["Test ID", "Role / Category", "Date", "Status", "Score", "Action"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {paginated.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">{t.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800 dark:text-slate-100">{t.role}</p>
                        <p className="text-xs text-slate-400">{t.category}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{t.date}</td>
                      <td className="px-5 py-3.5"><Badge status={t.status} /></td>
                      <td className="px-5 py-3.5">
                        {t.score !== null ? (
                          <span className={`font-bold ${t.score >= 60 ? "text-emerald-600" : "text-red-500"}`}>{t.score}%</span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {t.status === "Completed" && (
                          <button 
                            onClick={() => window.location.href = '/student/results'} 
                            className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
                          >
                            View Result
                          </button>
                        )}
                        {t.status === "Pending" && (
                          <span className="text-xs text-amber-500">Awaiting</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i+1)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      page === i+1 
                        ? "bg-violet-600 text-white" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}>
                    {i+1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
