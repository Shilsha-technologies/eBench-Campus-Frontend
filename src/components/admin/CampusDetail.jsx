import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DUMMY_CAMPUSES, DUMMY_STUDENTS, DUMMY_EMPLOYEES, Avatar, StatusTag, getInitials } from "./CampusManagement";

export default function CampusDetail() {
  const navigate = useNavigate();
  const { campusId } = useParams();
  
  const [tab, setTab] = useState("overview");
  const [studentFilter, setStudentFilter] = useState("all");
  const [search, setSearch] = useState("");

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
  const employees = DUMMY_EMPLOYEES[campusId] || [];

  const filteredStudents = useMemo(() => {
    let r = allStudents;
    if (studentFilter !== "all") r = r.filter((s) => s.status === studentFilter);
    if (search)
      r = r.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.branch.toLowerCase().includes(search.toLowerCase())
      );
    return r;
  }, [studentFilter, search, campusId]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "students", label: `Students (${allStudents.length})` },
    { id: "employees", label: `Employees (${employees.length})` },
    { id: "stats", label: "Statistics" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-[#1e293b] overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e2e8f0] bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/campus-management")}
              className="px-3 py-1.5 rounded-lg text-sm text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#1e293b] transition-all"
            >
              ← Back
            </button>
            <div>
              <h1 className="font-extrabold text-[22px] text-[#1e293b] tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                {campus.name}
              </h1>
              <p className="text-xs text-[#64748b] mt-0.5">
                {campus.university} · {campus.location}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)] hover:bg-[rgba(59,130,246,0.15)] transition-all">
            Edit Campus
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border-b-2 transition-all ${
                tab === t.id
                  ? "text-[#3b82f6] border-[#3b82f6] bg-[rgba(59,130,246,0.05)]"
                  : "text-[#64748b] border-transparent hover:text-[#1e293b]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-auto p-6">
        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#286a94] to-[#2957a0] rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <span className="text-3xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
                    {campus.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
                      {campus.name}
                    </h2>
                    <StatusTag status={campus.status} />
                  </div>
                  <p className="text-white/90 mb-3">{campus.university}</p>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      📍 {campus.location}
                    </span>
                    <span className="flex items-center gap-1">
                      📧 {campus.email}
                    </span>
                    <span className="flex items-center gap-1">
                      📞 {campus.phone}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-1">{campus.totalStudents}</div>
                  <div className="text-sm text-white/80">Total Students</div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard 
                label="Active Students" 
                value={allStudents.filter(s => s.status === "active").length}
                total={allStudents.length}
                color="blue"
                icon="👥"
              />
              <MetricCard 
                label="Placed Students" 
                value={allStudents.filter(s => s.status === "placed").length}
                total={allStudents.length}
                color="green"
                icon="🎯"
              />
              <MetricCard 
                label="Tests Completed" 
                value={allStudents.filter(s => s.testCompleted).length}
                total={allStudents.length}
                color="amber"
                icon="📊"
              />
              <MetricCard 
                label="Avg. Score" 
                value={`${Math.round(allStudents.reduce((acc, s) => acc + (s.testScore || 0), 0) / allStudents.filter(s => s.testCompleted).length || 0)}%`}
                total="100%"
                color="purple"
                icon="⭐"
              />
            </div>

            {/* Campus Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Basic Info */}
              <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
                <h3 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#3b82f6] rounded-full flex items-center justify-center text-white text-xs">📋</span>
                  Campus Information
                </h3>
                <div className="space-y-3">
                  {[
                    ["Established", campus.established, "📅"],
                    ["Location", campus.location, "📍"],
                    ["Email", campus.email, "📧"],
                    ["Phone", campus.phone, "📞"],
                    ["Placement Head", campus.placementHead, "👔"],
                  ].map(([label, value, icon]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <div className="flex-1">
                        <div className="text-xs text-[#64748b]">{label}</div>
                        <div className="text-sm text-[#1e293b] font-medium">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
                <h3 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#10b981] rounded-full flex items-center justify-center text-white text-xs">📈</span>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    ["Test Completed", "Arjun Sharma scored 92%", "2 hours ago", "🎯"],
                    ["New Student", "Priya Mehta added to CSE", "4 hours ago", "👤"],
                    ["Placement", "Rohit Kumar placed at Google", "Yesterday", "🎉"],
                    ["Test Sent", "Test link sent to 5 students", "2 days ago", "📧"],
                  ].map(([action, detail, time, icon]) => (
                    <div key={action} className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{icon}</span>
                      <div className="flex-1">
                        <div className="text-sm text-[#1e293b] font-medium">{action}</div>
                        <div className="text-xs text-[#64748b]">{detail}</div>
                        <div className="text-xs text-[#94a3b8] mt-1">{time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
                <h3 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#f59e0b] rounded-full flex items-center justify-center text-white text-xs">📊</span>
                  Department Stats
                </h3>
                <div className="space-y-3">
                  {[
                    ["Computer Science", allStudents.filter(s => s.branch === "Computer Science").length, "#3b82f6"],
                    ["Electrical", allStudents.filter(s => s.branch === "Electrical").length, "#10b981"],
                    ["Mechanical", allStudents.filter(s => s.branch === "Mechanical").length, "#f59e0b"],
                    ["Civil", allStudents.filter(s => s.branch === "Civil").length, "#8b5cf6"],
                    ["Information Technology", allStudents.filter(s => s.branch === "Information Technology").length, "#ef4444"],
                    ["Electronics", allStudents.filter(s => s.branch === "Electronics").length, "#06b6d4"],
                  ].map(([dept, count, color]) => (
                    <div key={dept} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="flex-1">
                        <div className="text-sm text-[#1e293b] font-medium">{dept}</div>
                        <div className="w-full bg-[#e2e8f0] rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(100, (count / Math.max(...allStudents.map(s => 1))) * 100)}%`,
                              backgroundColor: color 
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#1e293b]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionButton
                  label="View All Students"
                  description={`See ${allStudents.length} students`}
                  icon="👥"
                  color="blue"
                  onClick={() => navigate(`/admin/campus/${campusId}/students`)}
                />
                <ActionButton
                  label="View Employees"
                  description={`${DUMMY_EMPLOYEES[campusId]?.length || 0} team members`}
                  icon="👤"
                  color="green"
                  onClick={() => navigate(`/admin/campus/${campusId}/employees`)}
                />
                <ActionButton
                  label="Add Student"
                  description="Register new student"
                  icon="➕"
                  color="amber"
                />
                <ActionButton
                  label="Export Report"
                  description="Download campus data"
                  icon="📥"
                  color="purple"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Students ── */}
        {tab === "students" && (
          <div className="max-w-6xl mx-auto">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] mb-4">
              <div className="flex gap-3 flex-wrap items-center">
                <div className="flex-1 min-w-[200px]">
                  <input
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)] placeholder:text-[#64748b] transition-colors"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  {["all", "active", "placed", "inactive"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStudentFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        studentFilter === s
                          ? "bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.3)]"
                          : "bg-transparent text-[#64748b] border-[#e2e8f0] hover:text-[#1e293b]"
                      }`}
                    >
                      {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* View All Students Button */}
            <div className="mb-4 text-center">
              <button
                onClick={() => navigate(`/admin/campus/${campusId}/students`)}
                className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-all"
              >
                View All Students ({allStudents.length})
              </button>
            </div>

            {/* Student List */}
            <div className="grid gap-3">
              {filteredStudents.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-[#e2e8f0]">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-[#64748b] font-medium">No students found matching your criteria</p>
                </div>
              )}
              {filteredStudents.slice(0, 6).map((student) => (
                <StudentCard key={student._id} student={student} />
              ))}
              {filteredStudents.length > 6 && (
                <div className="text-center py-4">
                  <button
                    onClick={() => navigate(`/admin/campus/${campusId}/students`)}
                    className="text-[#3b82f6] font-medium text-sm hover:underline"
                  >
                    View all {filteredStudents.length} students →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Employees ── */}
        {tab === "employees" && (
          <div className="max-w-6xl mx-auto">
            {/* View All Employees Button */}
            <div className="mb-4 text-center">
              <button
                onClick={() => navigate(`/admin/campus/${campusId}/employees`)}
                className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-all"
              >
                View All Employees ({employees.length})
              </button>
            </div>

            {/* Employee List */}
            <div className="grid gap-3">
              {employees.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-[#e2e8f0]">
                  <div className="text-5xl mb-4">👥</div>
                  <p className="text-[#64748b] font-medium">No employees found</p>
                </div>
              ) : (
                employees.slice(0, 6).map((employee) => {
                  const studentsAddedByEmployee = allStudents.filter(s => s.addedById === employee._id);
                  return (
                    <div key={employee._id} className="bg-white border border-[#e2e8f0] rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-xs font-bold text-[#64748b] flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
                          {getInitials(employee.name)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-[#1e293b]">{employee.name}</span>
                            <StatusTag status={employee.status} />
                          </div>
                          <div className="text-xs text-[#64748b]">
                            {employee.role} · {employee.department} · {employee.email}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-[#e0e7ff] text-[#3730a3] px-2 py-0.5 rounded-full">
                              Students Added: {studentsAddedByEmployee.length}
                            </span>
                            <span className="text-xs text-[#64748b]">
                              Joined: {employee.joinDate}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button className="px-2 py-1 bg-[#3b82f6] text-white rounded text-xs font-medium hover:bg-[#2563eb] transition-all">
                            View
                          </button>
                          <button className="px-2 py-1 border border-[#e2e8f0] text-[#64748b] rounded text-xs font-medium hover:bg-[#f8fafc] transition-all">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {employees.length > 6 && (
                <div className="text-center py-4">
                  <button
                    onClick={() => navigate(`/admin/campus/${campusId}/employees`)}
                    className="text-[#3b82f6] font-medium text-sm hover:underline"
                  >
                    View all {employees.length} employees →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Statistics ── */}
        {tab === "stats" && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
                <div className="text-3xl font-bold text-[#3b82f6]">{campus.totalStudents}</div>
                <div className="text-sm text-[#64748b] mt-1">Total Students</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
                <div className="text-3xl font-bold text-[#10b981]">
                  {allStudents.filter(s => s.status === "placed").length}
                </div>
                <div className="text-sm text-[#64748b] mt-1">Placed Students</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
                <div className="text-3xl font-bold text-[#f59e0b]">
                  {allStudents.filter(s => s.testCompleted).length}
                </div>
                <div className="text-sm text-[#64748b] mt-1">Tests Completed</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
                <div className="text-3xl font-bold text-[#8b5cf6]">
                  {(
                    allStudents.reduce((acc, s) => acc + (s.testScore || 0), 0) /
                    allStudents.filter(s => s.testCompleted).length || 0
                  ).toFixed(2).replace(/\.?0+$/, '')}%
                </div>
                <div className="text-sm text-[#64748b] mt-1">Average Score</div>
              </div>
            </div>

            {/* Branch-wise Statistics */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Branch-wise Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Computer Science", "Electrical", "Mechanical", "Civil", "Information Technology", "Electronics"].map((branch) => {
                  const branchStudents = allStudents.filter(s => s.branch === branch);
                  const placedCount = branchStudents.filter(s => s.status === "placed").length;
                  const testCompletedCount = branchStudents.filter(s => s.testCompleted).length;
                  
                  return (
                    <div key={branch} className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                      <div className="font-medium text-[#1e293b] mb-2">{branch}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Total:</span>
                          <span className="font-medium">{branchStudents.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Placed:</span>
                          <span className="font-medium text-[#10b981]">{placedCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Tests:</span>
                          <span className="font-medium text-[#f59e0b]">{testCompletedCount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Metric Card Component ─────────────────────────────────────
function MetricCard({ label, value, total, color, icon }) {
  const colors = {
    blue: "#3b82f6",
    green: "#10b981",
    amber: "#f59e0b",
    purple: "#8b5cf6",
  };

  const percentage = typeof total === "string" ? 100 : Math.round((value / total) * 100);

  return (
    <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#1e293b]" style={{ fontFamily: "Syne, sans-serif" }}>
            {value}
          </div>
          <div className="text-xs text-[#64748b]">{total}</div>
        </div>
      </div>
      <div className="text-sm text-[#64748b] mb-2">{label}</div>
      <div className="w-full bg-[#e2e8f0] rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: colors[color] 
          }}
        ></div>
      </div>
    </div>
  );
}

// ── Action Button Component ───────────────────────────────────
function ActionButton({ label, description, icon, color, onClick }) {
  const colors = {
    blue: "bg-[#3b82f6] hover:bg-[#2563eb] text-white",
    green: "bg-[#10b981] hover:bg-[#059669] text-white",
    amber: "bg-[#f59e0b] hover:bg-[#d97706] text-white",
    purple: "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl text-left transition-all ${colors[color]} hover:shadow-lg transform hover:scale-105`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>
      <div className="text-sm opacity-90">{description}</div>
    </button>
  );
}

// ── Student Card Component ───────────────────────────────────
function StudentCard({ student: s }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-xs font-bold text-[#64748b] flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
          {getInitials(s.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-[#1e293b]">{s.name}</span>
            <StatusTag status={s.status} />
          </div>
          <div className="text-xs text-[#64748b]">
            {s.branch} · {s.year} · {s.email}
          </div>
          {s.testCompleted && (
            <div className="text-xs text-[#10b981] mt-1">
              Test Score: {s.testScore}%
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-[#3b82f6] text-white rounded text-xs font-medium hover:bg-[#2563eb] transition-all">
            View
          </button>
          {!s.testCompleted && (
            <button className="px-3 py-1 bg-[#10b981] text-white rounded text-xs font-medium hover:bg-[#059669] transition-all">
              Send Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
