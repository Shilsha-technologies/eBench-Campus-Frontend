import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DUMMY_CAMPUSES, DUMMY_EMPLOYEES, DUMMY_STUDENTS, Avatar, StatusTag, getInitials } from "./CampusManagement";

export default function CampusEmployees() {
  const navigate = useNavigate();
  const { campusId } = useParams();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewMode, setViewMode] = useState("employees"); // "employees" or "students"

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

  const employees = DUMMY_EMPLOYEES[campusId] || [];
  const allStudents = DUMMY_STUDENTS.filter((s) => s.campusId === campusId);

  const filteredEmployees = useMemo(() => {
    let r = employees;
    if (statusFilter !== "all") r = r.filter((e) => e.status === statusFilter);
    if (roleFilter !== "all") r = r.filter((e) => e.role === roleFilter);
    if (search)
      r = r.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.email.toLowerCase().includes(search.toLowerCase()) ||
          e.phone.includes(search)
      );
    return r;
  }, [search, statusFilter, roleFilter]);

  const filteredStudents = useMemo(() => {
    let r = allStudents;
    if (search)
      r = r.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.branch.toLowerCase().includes(search.toLowerCase())
      );
    return r;
  }, [search]);

  const campusAddedStudents = allStudents.filter((s) => s.addedBy === "campus");
  const employeeAddedStudents = allStudents.filter((s) => s.addedBy === "employee");

  const roles = [...new Set(employees.map((e) => e.role))];
  
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === "active").length,
    totalStudents: allStudents.length,
    campusAddedStudents: campusAddedStudents.length,
    employeeAddedStudents: employeeAddedStudents.length,
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-[#1e293b] overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e2e8f0] bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/campus/${campusId}`)}
              className="px-3 py-1.5 rounded-lg text-sm text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#1e293b] transition-all"
            >
              ← Back
            </button>
            <div>
              <h1 className="font-extrabold text-[22px] text-[#1e293b] tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                {campus.name} - Employees
              </h1>
              <p className="text-xs text-[#64748b] mt-0.5">
                {campus.university} · {campus.location}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)] hover:bg-[rgba(59,130,246,0.15)] transition-all">
            + Add Employee
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-2.5 flex-wrap">
          <StatCard label="Total Employees" value={stats.totalEmployees} />
          <StatCard label="Active Employees" value={stats.activeEmployees} accent="#10b981" />
          <StatCard label="Total Students" value={stats.totalStudents} accent="#3b82f6" />
          <StatCard label="Campus Added" value={stats.campusAddedStudents} accent="#f59e0b" />
          <StatCard label="Employee Added" value={stats.employeeAddedStudents} accent="#8b5cf6" />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="px-6 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("employees")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "employees"
                ? "bg-[#3b82f6] text-white"
                : "bg-white text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc]"
            }`}
          >
            Employees ({employees.length})
          </button>
          <button
            onClick={() => setViewMode("students")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "students"
                ? "bg-[#3b82f6] text-white"
                : "bg-white text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc]"
            }`}
          >
            Students ({allStudents.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      {viewMode === "employees" && (
        <div className="px-6 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex-shrink-0">
          <div className="flex gap-3 flex-wrap">
            <input
              className="flex-1 min-w-[200px] bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)] placeholder:text-[#64748b] transition-colors"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)]"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {viewMode === "students" && (
        <div className="px-6 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex-shrink-0">
          <div className="flex gap-3 flex-wrap">
            <input
              className="flex-1 min-w-[200px] bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)] placeholder:text-[#64748b] transition-colors"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === "employees" && (
          <div className="grid gap-4">
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">👥</div>
                <p className="text-[#64748b] font-medium">No employees found matching your criteria</p>
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <EmployeeCard key={employee._id} employee={employee} studentsAdded={allStudents.filter(s => s.addedById === employee._id)} />
              ))
            )}
          </div>
        )}

        {viewMode === "students" && (
          <div className="grid gap-4">
            {/* Campus Added Students */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-[#f59e0b] rounded-full"></span>
                Added by Campus ({campusAddedStudents.length})
              </h3>
              <div className="grid gap-3">
                {campusAddedStudents.length === 0 ? (
                  <p className="text-[#64748b] text-center py-4">No students added by campus</p>
                ) : (
                  campusAddedStudents.map((student) => (
                    <StudentRow key={student._id} student={student} addedBy="campus" />
                  ))
                )}
              </div>
            </div>

            {/* Employee Added Students */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-[#8b5cf6] rounded-full"></span>
                Added by Employees ({employeeAddedStudents.length})
              </h3>
              <div className="grid gap-3">
                {employeeAddedStudents.length === 0 ? (
                  <p className="text-[#64748b] text-center py-4">No students added by employees</p>
                ) : (
                  employeeAddedStudents.map((student) => (
                    <StudentRow key={student._id} student={student} addedBy="employee" />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Employee Card Component ───────────────────────────────────
function EmployeeCard({ employee: e, studentsAdded }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-sm font-bold text-[#64748b] flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
          {getInitials(e.name)}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-[#1e293b]">{e.name}</h3>
            <StatusTag status={e.status} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-3">
            <div>
              <span className="text-[#64748b]">Email:</span>
              <span className="text-[#1e293b] ml-2">{e.email}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Phone:</span>
              <span className="text-[#1e293b] ml-2">{e.phone}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Role:</span>
              <span className="text-[#1e293b] ml-2">{e.role}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Department:</span>
              <span className="text-[#1e293b] ml-2">{e.department}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Joined:</span>
              <span className="text-[#1e293b] ml-2">{e.joinDate}</span>
            </div>
          </div>

          {/* Students Added */}
          <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#1e293b]">Students Added</span>
              <span className="text-lg font-bold text-[#3b82f6]">{studentsAdded.length}</span>
            </div>
            {studentsAdded.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {studentsAdded.slice(0, 3).map((student) => (
                  <span key={student._id} className="text-xs bg-[#e0e7ff] text-[#3730a3] px-2 py-1 rounded-full">
                    {student.name}
                  </span>
                ))}
                {studentsAdded.length > 3 && (
                  <span className="text-xs text-[#64748b]">+{studentsAdded.length - 3} more</span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-[#3b82f6] text-white rounded-lg text-xs font-medium hover:bg-[#2563eb] transition-all">
              View Details
            </button>
            <button className="px-3 py-1.5 border border-[#e2e8f0] text-[#64748b] rounded-lg text-xs font-medium hover:bg-[#f8fafc] transition-all">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Student Row Component ───────────────────────────────────
function StudentRow({ student: s, addedBy }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-xs font-bold text-[#64748b] flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
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
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            addedBy === "campus" 
              ? "bg-[#fef3c7] text-[#92400e]" 
              : "bg-[#ede9fe] text-[#5b21b6]"
          }`}>
            {addedBy === "campus" ? "🏢 Campus" : `👤 ${s.addedByName}`}
          </span>
          {s.testCompleted && (
            <span className="text-xs text-[#10b981] font-medium">
              Score: {s.testScore}%
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="px-2 py-1 bg-[#3b82f6] text-white rounded text-xs font-medium hover:bg-[#2563eb] transition-all">
          View
        </button>
        {!s.testCompleted && (
          <button className="px-2 py-1 bg-[#10b981] text-white rounded text-xs font-medium hover:bg-[#059669] transition-all">
            Send Test
          </button>
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
