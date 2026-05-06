import { useState, useEffect } from "react";

// Icons (inline SVG)
const Icon = ({ name, cls = "w-5 h-5" }) => {
  const icons = {
    dashboard: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    test: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    history: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    results: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    credits: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    profile: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    warning: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
    check: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
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

// Stat Card component
function StatCard({ label, value, icon, color, sub }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon name={icon} cls="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

// Skeleton component
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`} />;
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  
  // Mock student data - in real app this would come from context/API
  const student = {
    name: "Aryan Mehta",
    email: "aryan.mehta@gmail.com",
    phone: "+91 9876543210",
    gender: "Male",
    college: "IIT Bombay",
    degree: "B.Tech",
    branch: "Computer Science",
    year: "3rd Year",
    skills: ["React", "Node.js", "Python", "DSA"],
    resume: null,
    avatar: null,
  };
  
  const credits = 5;
  const stats = { total: 12, passed: 8, failed: 4 };
  const tests = [
    { id: "T001", role: "SDE Intern", category: "DSA", date: "2026-04-20", status: "Completed", score: 82 },
    { id: "T002", role: "Frontend Dev", category: "React", date: "2026-04-15", status: "Completed", score: 91 },
    { id: "T003", role: "Data Analyst", category: "Aptitude", date: "2026-04-10", status: "Completed", score: 58 },
    { id: "T004", role: "Backend Intern", category: "Node.js", date: "2026-03-28", status: "Expired", score: null },
    { id: "T005", role: "Full Stack Dev", category: "React", date: "2026-03-20", status: "Completed", score: 76 },
  ];

  const profileScore = [student.phone, student.college, student.degree, student.skills.length > 0, student.resume].filter(Boolean).length;
  const profilePct = Math.round((profileScore / 5) * 100);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const recent = tests.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 p-6 text-white">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-violet-200 text-sm font-medium">Welcome back 👋</p>
            <h1 className="text-2xl font-bold mt-0.5">{student.name}</h1>
            <p className="text-violet-200 text-sm mt-1">{student.college} · {student.branch}</p>
          </div>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
            <Icon name="credits" cls="w-6 h-6 text-yellow-300" />
            <div>
              <p className="text-xs text-violet-200">Credits Remaining</p>
              <p className="text-2xl font-bold">{credits}</p>
            </div>
          </div>
        </div>
        {/* CTA Buttons */}
        <div className="relative z-10 flex gap-3 mt-5 flex-wrap">
          <button 
            onClick={() => window.location.href = '/student/request'} 
            disabled={credits === 0}
            className="px-5 py-2 bg-white text-violet-700 text-sm font-semibold rounded-xl hover:bg-violet-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Request New Test
          </button>
          <button 
            onClick={() => window.location.href = '/student/results'}
            className="px-5 py-2 bg-white/15 border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/25 transition-colors"
          >
            View Results
          </button>
        </div>
      </div>

      {/* Incomplete Profile Warning */}
      {profilePct < 80 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Icon name="warning" cls="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400 flex-1">Your profile is <strong>{profilePct}% complete.</strong> Complete it to increase your chances of being shortlisted.</p>
          <button 
            onClick={() => window.location.href = '/student/profile'} 
            className="text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline flex-shrink-0"
          >
            Complete Now →
          </button>
        </div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Tests Taken" value={stats.total} icon="test" color="blue" />
          <StatCard label="Passed" value={stats.passed} icon="check" color="green" sub={`${Math.round((stats.passed/stats.total)*100)}% pass rate`} />
          <StatCard label="Failed" value={stats.failed} icon="close" color="red" />
          <StatCard label="Credits" value={credits} icon="credits" color="amber" sub="1 credit = 1 test" />
        </div>
      )}

      {/* Recent Activity + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tests */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Tests</h3>
            <button 
              onClick={() => window.location.href = '/student/history'} 
              className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {loading ? [...Array(4)].map((_, i) => (
              <div key={i} className="px-5 py-3 flex gap-3">
                <Skeleton className="w-full h-8" />
              </div>
            )) : recent.map(t => (
              <div key={t.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.role}</p>
                  <p className="text-xs text-slate-400">{t.category} · {t.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {t.score !== null && (
                    <span className={`text-sm font-bold ${t.score >= 60 ? "text-emerald-600" : "text-red-500"}`}>{t.score}%</span>
                  )}
                  <Badge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Activity Timeline</h3>
          <div className="space-y-4">
            {[
              { icon: "test", color: "text-violet-500 bg-violet-50 dark:bg-violet-900/30", text: "Requested SDE Intern test", time: "2 days ago" },
              { icon: "check", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30", text: "Passed React test with 91%", time: "5 days ago" },
              { icon: "credits", color: "text-amber-500 bg-amber-50 dark:bg-amber-900/30", text: "Purchased 5 credits", time: "1 week ago" },
              { icon: "profile", color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30", text: "Updated profile info", time: "2 weeks ago" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon name={item.icon} cls="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-slate-700 dark:text-slate-200">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
