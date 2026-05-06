import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DUMMY_CAMPUSES, DUMMY_STUDENTS, Avatar, StatusTag, getInitials } from "./CampusManagement";

export default function CampusStudents() {
  const navigate = useNavigate();
  const { campusId } = useParams();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [testFilter, setTestFilter] = useState("all");

  const campus = DUMMY_CAMPUSES.find((c) => c._id === campusId);
  
  if (!campus) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1e293b] mb-2">Campus Not Found</h2>
          <p className="text-[#64748b] mb-4">The requested campus does not exist.</p>
          <button
            onClick={() => navigate("/admin/campus-management")}
            className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-all"
          >
            Back to Campuses
          </button>
        </div>
      </div>
    );
  }

  const allStudents = DUMMY_STUDENTS.filter((s) => s.campusId === campusId);

  const filtered = useMemo(() => {
    let r = allStudents;
    
    if (statusFilter !== "all") r = r.filter((s) => s.status === statusFilter);
    if (branchFilter !== "all") r = r.filter((s) => s.branch === branchFilter);
    if (yearFilter !== "all") r = r.filter((s) => s.year === yearFilter);
    if (testFilter !== "all") {
      if (testFilter === "completed") r = r.filter((s) => s.testCompleted);
      else if (testFilter === "pending") r = r.filter((s) => !s.testCompleted);
    }
    
    if (search)
      r = r.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.phone.includes(search)
      );
    
    return r;
  }, [search, statusFilter, branchFilter, yearFilter, testFilter, campusId]);

  const branches = [...new Set(allStudents.map((s) => s.branch))];
  const years = [...new Set(allStudents.map((s) => s.year))];
  
  const stats = {
    total: allStudents.length,
    placed: allStudents.filter((s) => s.status === "placed").length,
    active: allStudents.filter((s) => s.status === "active").length,
    testCompleted: allStudents.filter((s) => s.testCompleted).length,
    avgScore: allStudents
      .filter((s) => s.testCompleted)
      .reduce((acc, s) => acc + s.testScore, 0) / allStudents.filter((s) => s.testCompleted).length || 0,
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-[#1e293b] overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e2e8f0] bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/campus-management")}
              className="px-3 cursor-pointer py-1.5 rounded-lg text-sm text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#1e293b] transition-all"
            >
              ← Back
            </button>
            <div>
              <h1 className="font-extrabold text-[22px] text-[#1e293b] tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                {campus.name} - Students
              </h1>
              <p className="text-xs text-[#64748b] mt-0.5">
                {campus.university} · {campus.location}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)] hover:bg-[rgba(59,130,246,0.15)] transition-all">
            + Add Student
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-2.5 flex-wrap">
          <StatCard label="Total Students" value={stats.total} />
          <StatCard label="Placed" value={stats.placed} accent="#10b981" />
          <StatCard label="Active" value={stats.active} accent="#3b82f6" />
          <StatCard label="Tests Completed" value={stats.testCompleted} accent="#f59e0b" />
          <StatCard 
            label="Average Score" 
            value={`${stats.avgScore.toFixed(2)}%`} 
            accent="#8b5cf6" 
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex-shrink-0">
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <input
            className="flex-1 min-w-[200px] bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)] placeholder:text-[#64748b] transition-colors"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="placed">Placed</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)]"
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)]"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Test Filter */}
          <select
            value={testFilter}
            onChange={(e) => setTestFilter(e.target.value)}
            className="bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)]"
          >
            <option value="all">All Tests</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="flex-1 overflow-auto p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-[#64748b] font-medium">No students found matching your criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((student) => (
              <StudentCard key={student._id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Student Card Component ───────────────────────────────────
function StudentCard({ student: s }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-sm font-bold text-[#64748b] flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
          {getInitials(s.name)}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-[#1e293b]">{s.name}</h3>
            <StatusTag status={s.status} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-[#64748b]">Email:</span>
              <span className="text-[#1e293b] ml-2">{s.email}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Phone:</span>
              <span className="text-[#1e293b] ml-2">{s.phone}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Branch:</span>
              <span className="text-[#1e293b] ml-2">{s.branch}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Year:</span>
              <span className="text-[#1e293b] ml-2">{s.year}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Test Status:</span>
              <span className={`ml-2 font-medium ${s.testCompleted ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                {s.testCompleted ? "Completed" : "Pending"}
              </span>
            </div>
            {s.testCompleted && (
              <div>
                <span className="text-[#64748b]">Score:</span>
                <span className="text-[#1e293b] ml-2 font-semibold">{s.testScore}%</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button className="px-3 py-1.5 bg-[#3b82f6] text-white rounded-lg text-xs font-medium hover:bg-[#2563eb] transition-all">
              View Details
            </button>
            {!s.testCompleted && (
              <button className="px-3 py-1.5 bg-[#10b981] text-white rounded-lg text-xs font-medium hover:bg-[#059669] transition-all">
                Send Test Link
              </button>
            )}
            <button className="px-3 py-1.5 border border-[#e2e8f0] text-[#64748b] rounded-lg text-xs font-medium hover:bg-[#f8fafc] transition-all">
              Edit
            </button>
          </div>
        </div>

        {/* Test Score Badge */}
        {s.testCompleted && (
          <div className="text-center flex-shrink-0">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${
              s.testScore >= 90 ? "bg-[rgba(16,185,129,0.1)] text-[#10b981]" :
              s.testScore >= 80 ? "bg-[rgba(59,130,246,0.1)] text-[#3b82f6]" :
              s.testScore >= 70 ? "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]" :
              "bg-[rgba(239,68,68,0.1)] text-[#ef4444]"
            }`} style={{ fontFamily: "Syne, sans-serif" }}>
              {s.testScore}%
            </div>
            <div className="text-xs text-[#64748b] mt-1">Score</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat Card Component ───────────────────────────────────────
function StatCard({ label, value, accent }) {
  return (
    <div className="flex-1 min-w-[120px] bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 flex flex-col gap-1">
      <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-semibold">
        {label}
      </span>
      <span
        className="text-[24px] font-extrabold leading-none"
        style={{ fontFamily: "Syne, sans-serif", color: accent || "#1e293b" }}
      >
        {value}
      </span>
    </div>
  );
}
