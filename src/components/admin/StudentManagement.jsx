import { useState, useMemo, useRef, useEffect } from "react";

import {
  Users,
  UserCheck,
  Clock3,
  Send,
  CircleCheckBig,
  XCircle,
  Star,
  ChartColumnIncreasing,
} from "lucide-react";

// ─── DUMMY DATA ────────────────────────────────────────────────────────────────
const STUDENTS = [
  { id: 1, name: "Arjun Mehta", email: "arjun.mehta@gmail.com", phone: "+91 98765 43210", college: "IIT Delhi", degree: "B.Tech CSE", branch: "Computer Science", year: 2024, skills: ["React", "Node.js", "Python"], test: "Frontend Developer", status: "Shortlisted", score: 92, appliedDate: "2024-03-01", avatar: "AM", linkedin: "linkedin.com/in/arjun", github: "github.com/arjun", testSentDate: "2024-03-05", attemptDate: "2024-03-07", duration: "45 min", address: "New Delhi, India", portfolio: "arjun.dev" },
  { id: 2, name: "Priya Sharma", email: "priya.sharma@outlook.com", phone: "+91 87654 32109", college: "NIT Trichy", degree: "B.Tech IT", branch: "Information Technology", year: 2024, skills: ["Vue.js", "Django", "SQL"], test: "Full Stack Engineer", status: "Completed", score: 78, appliedDate: "2024-03-02", avatar: "PS", linkedin: "linkedin.com/in/priya", github: "github.com/priya", testSentDate: "2024-03-06", attemptDate: "2024-03-08", duration: "60 min", address: "Chennai, India", portfolio: "" },
  { id: 3, name: "Rohan Verma", email: "rohan.v@hotmail.com", phone: "+91 76543 21098", college: "BITS Pilani", degree: "M.Tech", branch: "Software Engineering", year: 2024, skills: ["Java", "Spring Boot", "AWS"], test: "Backend Developer", status: "In Progress", score: null, appliedDate: "2024-03-03", avatar: "RV", linkedin: "linkedin.com/in/rohan", github: "github.com/rohan", testSentDate: "2024-03-07", attemptDate: null, duration: null, address: "Pilani, Rajasthan", portfolio: "rohan.io" },
  { id: 4, name: "Sneha Patel", email: "sneha.patel@gmail.com", phone: "+91 65432 10987", college: "DTU", degree: "B.Tech ECE", branch: "Electronics", year: 2023, skills: ["Angular", "TypeScript", "MongoDB"], test: "Frontend Developer", status: "Test Sent", score: null, appliedDate: "2024-03-04", avatar: "SP", linkedin: "linkedin.com/in/sneha", github: "github.com/sneha", testSentDate: "2024-03-08", attemptDate: null, duration: null, address: "Delhi, India", portfolio: "" },
  { id: 5, name: "Vikram Singh", email: "vikram.singh@yahoo.com", phone: "+91 54321 09876", college: "VIT Vellore", degree: "B.Tech CSE", branch: "Computer Science", year: 2024, skills: ["React Native", "Flutter", "Firebase"], test: "Mobile Developer", status: "Failed", score: 34, appliedDate: "2024-03-05", avatar: "VS", linkedin: "linkedin.com/in/vikram", github: "github.com/vikram", testSentDate: "2024-03-04", attemptDate: "2024-03-06", duration: "55 min", address: "Vellore, TN", portfolio: "" },
  { id: 6, name: "Anjali Gupta", email: "anjali.g@gmail.com", phone: "+91 43210 98765", college: "IIIT Hyderabad", degree: "M.S.", branch: "Data Science", year: 2024, skills: ["Python", "ML", "TensorFlow", "Pandas"], test: "Data Scientist", status: "Shortlisted", score: 95, appliedDate: "2024-03-06", avatar: "AG", linkedin: "linkedin.com/in/anjali", github: "github.com/anjali", testSentDate: "2024-03-09", attemptDate: "2024-03-11", duration: "75 min", address: "Hyderabad, TS", portfolio: "anjali.ml" },
  { id: 7, name: "Karan Joshi", email: "karan.joshi@gmail.com", phone: "+91 32109 87654", college: "Manipal University", degree: "B.Tech CSE", branch: "Computer Science", year: 2023, skills: ["DevOps", "Docker", "Kubernetes"], test: "DevOps Engineer", status: "Pending", score: null, appliedDate: "2024-03-07", avatar: "KJ", linkedin: "linkedin.com/in/karan", github: "github.com/karan", testSentDate: null, attemptDate: null, duration: null, address: "Manipal, Karnataka", portfolio: "" },
  { id: 8, name: "Meera Nair", email: "meera.nair@gmail.com", phone: "+91 21098 76543", college: "NIT Calicut", degree: "B.Tech CSE", branch: "Computer Science", year: 2024, skills: ["UI/UX", "Figma", "React"], test: "UI/UX Designer", status: "Rejected", score: 52, appliedDate: "2024-03-08", avatar: "MN", linkedin: "linkedin.com/in/meera", github: "github.com/meera", testSentDate: "2024-03-10", attemptDate: "2024-03-12", duration: "40 min", address: "Kozhikode, Kerala", portfolio: "meera.design" },
  { id: 9, name: "Aditya Kumar", email: "aditya.k@gmail.com", phone: "+91 10987 65432", college: "Jadavpur University", degree: "B.E. CSE", branch: "Computer Science", year: 2024, skills: ["Go", "Rust", "System Design"], test: "Backend Developer", status: "Completed", score: 88, appliedDate: "2024-03-09", avatar: "AK", linkedin: "linkedin.com/in/aditya", github: "github.com/aditya", testSentDate: "2024-03-11", attemptDate: "2024-03-13", duration: "65 min", address: "Kolkata, WB", portfolio: "" },
  { id: 10, name: "Divya Reddy", email: "divya.reddy@gmail.com", phone: "+91 90876 54321", college: "Osmania University", degree: "B.Tech IT", branch: "Information Technology", year: 2023, skills: ["React", "GraphQL", "PostgreSQL"], test: "Full Stack Engineer", status: "Test Sent", score: null, appliedDate: "2024-03-10", avatar: "DR", linkedin: "linkedin.com/in/divya", github: "github.com/divya", testSentDate: "2024-03-12", attemptDate: null, duration: null, address: "Hyderabad, TS", portfolio: "divya.dev" },
];

const STATUS_CONFIG = {
  Pending:     { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-400"  },
  "Test Sent": { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-400"   },
  "In Progress":{ bg: "bg-teal-50", text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-400" },
  "Completed":   { bg: "bg-teal-50",    text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-400"   },
  "Failed":      { bg: "bg-red-50",     text: "text-red-700",    border: "border-red-200",    dot: "bg-red-400"    },
  "Shortlisted": { bg: "bg-green-50",   text: "text-green-700",  border: "border-green-200",  dot: "bg-green-400"  },
  "Rejected":    { bg: "bg-gray-100",   text: "text-gray-600",   border: "border-gray-200",   dot: "bg-gray-400"   },
};

const AVATAR_COLORS = [
  "bg-green-100 text-green-700", "bg-blue-100 text-blue-700",
  "bg-teal-100 text-teal-700", "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700", "bg-green-100 text-green-700",
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── SCORE PILL ───────────────────────────────────────────────────────────────
function ScorePill({ score }) {
  if (score === null) return <span className="text-gray-400 text-sm">—</span>;
  const color = score >= 80 ? "text-green-700 bg-green-50" : score >= 60 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{score}%</span>;
}

// ─── STATS CARD ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  const colorMap = {
    violet: {
      bg: "bg-violet-50",
      icon: "text-violet-600",
      border: "border-violet-100",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-100",
    },
    teal: {
      bg: "bg-teal-50",
      icon: "text-teal-600",
      border: "border-teal-100",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      border: "border-amber-100",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      border: "border-green-100",
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      border: "border-red-100",
    },
    pink: {
      bg: "bg-pink-50",
      icon: "text-pink-600",
      border: "border-pink-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      border: "border-emerald-100",
    },
  };

  const c = colorMap[color] || colorMap.violet;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>

        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold">
          {sub}
        </span>
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>

      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
// ─── SEND TEST MODAL ──────────────────────────────────────────────────────────
function SendTestModal({ student, onClose }) {
  const [form, setForm] = useState({
    test: student?.test || "",
    email: student?.email || "",
    difficulty: "Medium",
    expiry: "48",
    questions: "30",
    instructions: "Please complete the test in one sitting. No external resources allowed.",
    message: `Hi ${student?.name || "there"},\n\nWe're excited to invite you to take an assessment for the role you applied for.\n\nBest regards,\nHiring Team`,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Send Assessment Link</h2>
              <p className="text-green-200 text-sm mt-0.5">{student ? `To: ${student.name}` : "Bulk send"}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <i className="ti ti-x text-white" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Select Test</label>
              <select value={form.test} onChange={e => set("test", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50">
                <option>Frontend Developer</option>
                <option>Full Stack Engineer</option>
                <option>Backend Developer</option>
                <option>Data Scientist</option>
                <option>DevOps Engineer</option>
                <option>Mobile Developer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Difficulty Level</label>
              <select value={form.difficulty} onChange={e => set("difficulty", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Student Email</label>
            <input value={form.email} onChange={e => set("email", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Expiry Time (hours)</label>
              <input type="number" value={form.expiry} onChange={e => set("expiry", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Total Questions</label>
              <input type="number" value={form.questions} onChange={e => set("questions", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Instructions</label>
            <textarea rows={2} value={form.instructions} onChange={e => set("instructions", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Custom Message</label>
            <textarea rows={4} value={form.message} onChange={e => set("message", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 resize-none" />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <i className="ti ti-send text-base" aria-hidden="true" /> Send Test Link
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT DRAWER ───────────────────────────────────────────────────────────
function StudentDrawer({ student, onClose, onAction }) {
  const [tab, setTab] = useState("personal");
  const colorIdx = student ? student.id % AVATAR_COLORS.length : 0;

  useEffect(() => { setTab("personal"); }, [student?.id]);

  if (!student) return null;

  const tabs = [
    { id: "personal",  label: "Personal"  },
    { id: "professional", label: "Professional" },
    { id: "test",      label: "Test Info" },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <StatusBadge status={student.status} />
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <i className="ti ti-x text-white" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold ${AVATAR_COLORS[colorIdx]}`}>
              {student.avatar}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{student.name}</h2>
              <p className="text-green-200 text-sm">{student.email}</p>
              <p className="text-green-300 text-xs mt-0.5">{student.college} · {student.degree}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t.id ? "text-green-700 border-b-2 border-green-600 bg-white" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === "personal" && (
            <div className="space-y-3">
              {[
                ["Full Name",    student.name],
                ["Email",        student.email],
                ["Phone",        student.phone],
                ["Address",      student.address],
                ["College",      student.college],
                ["Degree",       student.degree],
                ["Branch",       student.branch],
                ["Passing Year", student.year],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-gray-50">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</span>
                  <span className="text-sm text-gray-800 font-medium text-right max-w-[60%]">{v}</span>
                </div>
              ))}
              <div className="pt-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-lg border border-green-100 font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === "professional" && (
            <div className="space-y-3">
              {[
                ["LinkedIn",   student.linkedin  || "Not provided"],
                ["GitHub",     student.github    || "Not provided"],
                ["Portfolio",  student.portfolio || "Not provided"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</span>
                  <span className={`text-sm font-medium ${v !== "Not provided" ? "text-green-600" : "text-gray-400"}`}>{v}</span>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <i className="ti ti-file-type-pdf text-red-600 text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{student.name.split(" ")[0]}_Resume.pdf</p>
                    <p className="text-xs text-gray-400">2.4 MB · PDF</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500">
                  <i className="ti ti-download text-base" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
          {tab === "test" && (
            <div className="space-y-3">
              {[
                ["Requested Test",  student.test],
                ["Test Sent Date",  student.testSentDate || "Not sent"],
                ["Attempt Date",    student.attemptDate  || "Not attempted"],
                ["Duration",        student.duration     || "—"],
                ["Score",           student.score !== null ? `${student.score}%` : "—"],
                ["Result Status",   student.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-gray-50">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</span>
                  <span className="text-sm text-gray-800 font-medium">{k === "Result Status" ? <StatusBadge status={v} /> : v}</span>
                </div>
              ))}
              {student.score !== null && (
                <div className="mt-4 p-4 rounded-2xl bg-gray-50">
                  <p className="text-xs text-gray-400 mb-2">Score Overview</p>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${student.score >= 80 ? "bg-green-500" : student.score >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${student.score}%` }} />
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-1">{student.score} / 100</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Controls */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">Admin Controls</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { onAction("sendTest", student); onClose(); }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors">
              <i className="ti ti-send text-sm" aria-hidden="true" /> Send Test
            </button>
            <button onClick={() => onAction("shortlist", student)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors">
              <i className="ti ti-star text-sm" aria-hidden="true" /> Shortlist
            </button>
            <button onClick={() => onAction("reject", student)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors">
              <i className="ti ti-ban text-sm" aria-hidden="true" /> Reject
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors">
              <i className="ti ti-download text-sm" aria-hidden="true" /> Resume
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          {Array.from({ length: 7 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <tr>
      <td colSpan={8} className="py-16 text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <i className="ti ti-users-off text-3xl text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-600 font-medium">No students found</p>
          <p className="text-gray-400 text-sm">{query ? `No results for "${query}"` : "Try adjusting your filters"}</p>
        </div>
      </td>
    </tr>
  );
}

// ─── ANALYTICS WIDGET ─────────────────────────────────────────────────────────
function AnalyticsSection({ students }) {
  const completed  = students.filter(s => ["Completed", "Shortlisted"].includes(s.status));
  const failed     = students.filter(s => s.status === "Failed");
  const shortlisted = students.filter(s => s.status === "Shortlisted");
  const avgScore   = Math.round(students.filter(s => s.score !== null).reduce((a, b) => a + b.score, 0) / students.filter(s => s.score !== null).length);
  const top = [...students].filter(s => s.score !== null).sort((a, b) => b.score - a.score).slice(0, 5);

  const statusCounts = Object.fromEntries(Object.keys(STATUS_CONFIG).map(k => [k, students.filter(s => s.status === k).length]));
  const total = students.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      {/* Pass vs Fail */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Pass / Fail Ratio</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-600 font-medium">Passed</span>
              <span className="text-gray-500">{completed.length} students</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(completed.length / total) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-500 font-medium">Failed</span>
              <span className="text-gray-500">{failed.length} students</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full" style={{ width: `${(failed.length / total) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-700 font-medium">Shortlisted</span>
              <span className="text-gray-500">{shortlisted.length} students</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(shortlisted.length / total) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {Object.entries(statusCounts).filter(([, v]) => v > 0).slice(0, 3).map(([k, v]) => (
            <div key={k} className="text-center p-2 bg-gray-50 rounded-xl">
              <p className="text-lg font-bold text-gray-800">{v}</p>
              <p className="text-xs text-gray-400 leading-tight">{k}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Performers</h3>
        <div className="space-y-3">
          {top.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-orange-600"}`}>{i + 1}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${AVATAR_COLORS[s.id % AVATAR_COLORS.length]}`}>{s.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                <p className="text-xs text-gray-400 truncate">{s.test}</p>
              </div>
              <ScorePill score={s.score} />
            </div>
          ))}
        </div>
      </div>

      {/* Avg Score + Completion Rate */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Average Score</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{avgScore}</span>
            <span className="text-gray-400 text-sm mb-1">/ 100</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${avgScore}%` }} />
          </div>
        </div>
        <div className="border-t border-gray-50 pt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Completion Rate</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{Math.round(((completed.length + failed.length) / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-teal-500 to-green-500 rounded-full" style={{ width: `${((completed.length + failed.length) / total) * 100}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{completed.length + failed.length} of {total} students completed</p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function StudentManagement() {
  const [students, setStudents]       = useState(STUDENTS);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalStudent, setModalStudent] = useState(null);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [toast, setToast]             = useState(null);
  const [openMenuId, setOpenMenuId]   = useState(null);
  const PER_PAGE = 6;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (action, student) => {
    setOpenMenuId(null);
    if (action === "sendTest") { setModalStudent(student); return; }
    if (action === "shortlist") {
      setStudents(s => s.map(x => x.id === student.id ? { ...x, status: "Shortlisted" } : x));
      showToast(`${student.name} shortlisted!`);
    } else if (action === "reject") {
      setStudents(s => s.map(x => x.id === student.id ? { ...x, status: "Rejected" } : x));
      showToast(`${student.name} rejected.`, "error");
    } else if (action === "delete") {
      setStudents(s => s.filter(x => x.id !== student.id));
      showToast(`${student.name} removed.`, "error");
      if (selectedStudent?.id === student.id) setSelectedStudent(null);
    }
  };

  const statuses = ["All", ...Object.keys(STATUS_CONFIG)];

  const filtered = useMemo(() => {
    let r = students;
    if (search) r = r.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "All") r = r.filter(s => s.status === statusFilter);
    return r;
  }, [students, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => ({
    total:      students.length,
    active:     students.filter(s => !["Rejected"].includes(s.status)).length,
    pending:    students.filter(s => s.status === "Pending").length,
    testsSent:  students.filter(s => s.testSentDate).length,
    completed:  students.filter(s => ["Completed", "Shortlisted", "Failed"].includes(s.status)).length,
    failed:     students.filter(s => s.status === "Failed").length,
    shortlisted:students.filter(s => s.status === "Shortlisted").length,
    avgScore:   Math.round(students.filter(s => s.score !== null).reduce((a, b) => a + b.score, 0) / students.filter(s => s.score !== null).length),
  }), [students]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="min-h-screen bg-green-50/20 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          <i className={`ti ${toast.type === "error" ? "ti-x" : "ti-check"} text-base`} aria-hidden="true" />
          {toast.msg}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#28ba5e]">Student Management</h1>
              <p className="text-gray-500 text-sm mt-0.5">{stats.total} registered students · {stats.shortlisted} shortlisted</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* <button onClick={() => setShowAnalytics(a => !a)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${showAnalytics ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <i className="ti ti-chart-bar text-base" aria-hidden="true" /> Analytics
              </button> */}
              {/* <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <i className="ti ti-download text-base" aria-hidden="true" /> Export
              </button> */}
              {/* <button onClick={() => setModalStudent(null)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-green-200">
                <i className="ti ti-send text-base" aria-hidden="true" /> Send Test Link
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-800 hover:bg-green-900 text-white text-sm font-semibold transition-colors">
                <i className="ti ti-plus text-base" aria-hidden="true" /> Add Student
              </button> */}
            </div>
          </div>
        </div>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
  <StatCard
    icon={Users}
    label="Total Students"
    value={stats.total}
    sub="+12%"
    color="green"
  />

  <StatCard
    icon={UserCheck}
    label="Active Students"
    value={stats.active}
    sub="+8%"
    color="blue"
  />

  <StatCard
    icon={Clock3}
    label="Pending Requests"
    value={stats.pending}
    sub="+2"
    color="amber"
  />

  <StatCard
    icon={Send}
    label="Tests Sent"
    value={stats.testsSent}
    sub="+5%"
    color="emerald"
  />

  <StatCard
    icon={CircleCheckBig}
    label="Completed Tests"
    value={stats.completed}
    sub="+18%"
    color="teal"
  />

  <StatCard
    icon={XCircle}
    label="Failed Students"
    value={stats.failed}
    sub="-3%"
    color="red"
  />

  <StatCard
    icon={Star}
    label="Shortlisted"
    value={stats.shortlisted}
    sub="+20%"
    color="green"
  />

  <StatCard
    icon={ChartColumnIncreasing}
    label="Average Score"
    value={`${stats.avgScore}%`}
    sub="+4%"
    color="pink"
  />
</div>

        {/* ── ANALYTICS ───────────────────────────────────────────────────── */}
        {showAnalytics && <AnalyticsSection students={students} />}

        {/* ── TABLE ───────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true" />
                <input
                  type="text" placeholder="Search name or email…"
                  value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
              {/* Filter */}
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-600">
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="text-sm text-gray-400 ml-auto">{filtered.length} students</span>
            </div>
            {/* Status tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {statuses.map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                <tr>
                  {["Student", "Phone", "College", "Skills", "Test", "Status", "Score", "Applied", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <LoadingSkeleton />
                ) : paginated.length === 0 ? (
                  <EmptyState query={search} />
                ) : paginated.map(student => {
                  const colorIdx = student.id % AVATAR_COLORS.length;
                  return (
                    <tr key={student.id} onClick={() => setSelectedStudent(student)}
                      className="hover:bg-green-50/30 cursor-pointer transition-colors group">
                      {/* Profile */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[colorIdx]}`}>
                            {student.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 whitespace-nowrap">{student.name}</p>
                            <p className="text-xs text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{student.phone}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800 text-xs font-medium whitespace-nowrap">{student.college}</p>
                        <p className="text-gray-400 text-xs">{student.degree}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap max-w-[140px]">
                          {student.skills.slice(0, 2).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md">{s}</span>
                          ))}
                          {student.skills.length > 2 && <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-md">+{student.skills.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">{student.test}</td>
                      <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                      <td className="px-4 py-3"><ScorePill score={student.score} /></td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{student.appliedDate}</td>
                      {/* Actions */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button title="Send Test" onClick={() => setModalStudent(student)}
                            className="p-1.5 rounded-lg hover:bg-green-100 text-gray-400 hover:text-green-600 transition-colors">
                            <i className="ti ti-send text-sm" aria-hidden="true" />
                          </button>
                          <button title="Shortlist" onClick={() => handleAction("shortlist", student)}
                            className="p-1.5 rounded-lg hover:bg-green-100 text-gray-400 hover:text-green-600 transition-colors">
                            <i className="ti ti-star text-sm" aria-hidden="true" />
                          </button>
                          <div className="relative">
                            <button title="More" onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === student.id ? null : student.id); }}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                              <i className="ti ti-dots-vertical text-sm" aria-hidden="true" />
                            </button>
                            {openMenuId === student.id && (
                              <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-gray-100 shadow-xl z-20 overflow-hidden py-1">
                                {[
                                  { label: "View Profile",  icon: "ti-user",     action: () => setSelectedStudent(student) },
                                  { label: "View Result",   icon: "ti-chart-bar",action: () => setSelectedStudent(student) },
                                  { label: "Download Resume",icon: "ti-download", action: () => {} },
                                  { label: "Reject",        icon: "ti-ban",      action: () => handleAction("reject", student), cls: "text-red-600 hover:bg-red-50" },
                                  { label: "Delete",        icon: "ti-trash",    action: () => handleAction("delete", student), cls: "text-red-600 hover:bg-red-50" },
                                ].map(item => (
                                  <button key={item.label} onClick={() => { item.action(); setOpenMenuId(null); }}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${item.cls || ""}`}>
                                    <i className={`ti ${item.icon} text-base`} aria-hidden="true" /> {item.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <i className="ti ti-chevron-left text-sm" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <i className="ti ti-chevron-right text-sm" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS / DRAWERS ─────────────────────────────────────────────── */}
      {modalStudent !== null && (
        <SendTestModal student={modalStudent} onClose={() => setModalStudent(null)} />
      )}
      {selectedStudent && (
        <StudentDrawer
          student={students.find(s => s.id === selectedStudent.id)}
          onClose={() => setSelectedStudent(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
