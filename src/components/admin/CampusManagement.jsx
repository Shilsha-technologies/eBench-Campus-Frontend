import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function CampusManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    let r = DUMMY_CAMPUSES;
    if (statusFilter !== "all") r = r.filter((c) => c.status === statusFilter);
    if (search)
      r = r.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.university.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase())
      );
    return r;
  }, [search, statusFilter]);
  

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-[#1e293b] overflow-hidden font-sans">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-grey-200 border-b border-[#e2e8f0] bg- flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-[22px] text-[#286a94] tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
              Campus Management
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              Manage campuses, their students and placement activities
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2.5 flex-wrap">
          <StatCard label="Total Campuses" value={DUMMY_STATS.totalCampuses} />
          <StatCard label="Active" value={DUMMY_STATS.activeCampuses} accent="#3b82f6" />
          <StatCard label="Inactive" value={DUMMY_STATS.inactiveCampuses} accent="#64748b" />
          <StatCard label="Total Students" value={DUMMY_STATS.totalStudents} accent="#10b981" />
          <StatCard label="Tests Completed" value={DUMMY_STATS.testsCompleted} accent="#f59e0b" />
          <StatCard label="Avg. Score" value={`${DUMMY_STATS.averageScore}%`} accent="#3b82f6" />
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {/* Search + filters */}
        <div className="px-6 py-3  border-[#e2e8f0] bg-[#f8fafc] flex gap-2 flex-shrink-0">
          <input
            className="flex-1 bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)] placeholder:text-[#64748b] transition-colors"
            placeholder="Search campuses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex-shrink-0 ${
                statusFilter === s
                  ? "bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.3)]"
                  : "bg-transparent text-[#64748b] border-[#e2e8f0] hover:bg-white hover:text-[#1e293b]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((campus) => (
              <CampusCard
                key={campus._id}
                campus={campus}
                onClick={() => navigate(`/admin/campus/${campus._id}`)}
              />
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-[#64748b] font-medium">No campuses match your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel Component ───────────────────────────────────
export function CampusDetailPanel({ campus, onClose, onViewStudents }) {
  const [tab, setTab] = useState("overview");
  const [studentFilter, setStudentFilter] = useState("all");
  const [search, setSearch] = useState("");

  const allStudents = DUMMY_STUDENTS.filter((s) => s.campusId === campus._id);

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
  }, [studentFilter, search, campus._id]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "students", label: `Students (${allStudents.length})` },
    { id: "stats", label: "Statistics" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden animate-[slideIn_0.25s_ease]">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-[#e2e8f0] flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={campus.name} color={campus.avatarColor} size={48} />
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg font-extrabold text-[#1e293b]"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {campus.name}
                </h2>
                <StatusTag status={campus.status} />
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                {campus.university} · {campus.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 rounded-lg text-sm text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#1e293b] transition-all"
          >
            ✕
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
      <div className="flex-1 overflow-auto p-5">
        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="grid gap-3">
            {[
              ["Campus Name", campus.name],
              ["University", campus.university],
              ["Email", campus.email],
              ["Phone", campus.phone],
              ["Location", campus.location],
              ["Established", campus.established],
              ["Total Students", campus.totalStudents],
              ["Placement Head", campus.placementHead],
              ["Status", campus.status, true],
            ].map(([k, v, isStatus]) => (
              <div
                key={k}
                className="flex justify-between items-center px-4 py-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]"
              >
                <span className="text-xs text-[#64748b] font-medium">{k}</span>
                {isStatus ? (
                  <StatusTag status={v} />
                ) : (
                  <span className="text-sm text-[#1e293b] font-medium">{v}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Students ── */}
        {tab === "students" && (
          <div>
            {/* Filters */}
            <div className="flex gap-2 flex-wrap mb-3">
              {["all", "active", "placed", "inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStudentFilter(s)}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                    studentFilter === s
                      ? "bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.3)]"
                      : "bg-transparent text-[#64748b] border-[#e2e8f0] hover:text-[#1e293b]"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              className="w-full mb-3 bg-white border border-[#e2e8f0] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(59,130,246,0.4)] placeholder:text-[#64748b] transition-colors"
              placeholder="Search by name, email or branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* View All Students Button */}
            <div className="mb-3">
              <button
                onClick={onViewStudents}
                className="w-full px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-all"
              >
                View All Students ({allStudents.length})
              </button>
            </div>

            {/* Student List */}
            <div className="flex flex-col gap-2">
              {filteredStudents.length === 0 && (
                <p className="text-center text-[#64748b] text-sm py-8">No students found</p>
              )}
              {filteredStudents.slice(0, 5).map((student) => (
                <StudentRow key={student._id} student={student} />
              ))}
              {filteredStudents.length > 5 && (
                <p className="text-center text-[#64748b] text-xs py-2">
                  ...and {filteredStudents.length - 5} more students
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Statistics ── */}
        {tab === "stats" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
              <div className="text-2xl font-bold text-[#3b82f6]">{campus.totalStudents}</div>
              <div className="text-xs text-[#64748b]">Total Students</div>
            </div>
            <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
              <div className="text-2xl font-bold text-[#10b981]">
                {allStudents.filter(s => s.status === "placed").length}
              </div>
              <div className="text-xs text-[#64748b]">Placed Students</div>
            </div>
            <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
              <div className="text-2xl font-bold text-[#f59e0b]">
                {allStudents.filter(s => s.testCompleted).length}
              </div>
              <div className="text-xs text-[#64748b]">Tests Completed</div>
            </div>
            <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
              <div className="text-2xl font-bold text-[#8b5cf6]">
                {allStudents.reduce((acc, s) => acc + (s.testScore || 0), 0) / allStudents.filter(s => s.testCompleted).length || 0}%
              </div>
              <div className="text-xs text-[#64748b]">Average Score</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────
function StudentRow({ student: s }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl">
      {/* Monogram */}
      <div className="w-9 h-9 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-xs font-bold text-[#64748b] flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
        {getInitials(s.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm text-[#1e293b]">{s.name}</span>
          <StatusTag status={s.status} />
        </div>
        <div className="text-xs text-[#64748b]">{s.branch} · {s.year}</div>
        <div className="text-[11px] text-[#64748b] mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
          <span>{s.email}</span>
          <span>·</span>
          <span>{s.phone}</span>
        </div>
      </div>

      {/* Test Score */}
      {s.testCompleted && (
        <span className="text-xs text-[#10b981] font-semibold flex-shrink-0">
          {s.testScore}%
        </span>
      )}
    </div>
  );
}

function CampusCard({ campus, onClick }) {
  const students = DUMMY_STUDENTS.filter((s) => s.campusId === campus._id);
  const placed = students.filter((s) => s.status === "placed").length;
  const testsCompleted = students.filter((s) => s.testCompleted).length;

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-150 bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc] hover:shadow-md"
    >
      <div className="flex gap-3 items-start">
        <Avatar name={campus.name} color={campus.avatarColor} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="font-bold text-sm text-[#1e293b] truncate"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {campus.name}
            </span>
            <StatusTag status={campus.status} />
          </div>
          <div className="text-xs text-[#64748b] mb-2">{campus.university}</div>
          <div className="flex gap-1.5 flex-wrap">
            <Chip color="blue">👥 {students.length} students</Chip>
            <Chip color="green">✓ {placed} placed</Chip>
            {testsCompleted > 0 && <Chip color="amber">📊 {testsCompleted} tests</Chip>}
            <span className="text-[11px] text-[#64748b] flex items-center gap-1">
              📍 {campus.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, color }) {
  const map = {
    blue: "bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.2)]",
    green: "bg-[rgba(16,185,129,0.1)] text-[#10b981] border-[rgba(16,185,129,0.2)]",
    amber: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]",
  };
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${map[color]}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="flex-1 min-w-[110px] bg-white border border-[#e2e8f0] rounded-xl px-5 py-4 flex flex-col gap-1.5">
      <span className="text-[11px] text-[#64748b] uppercase tracking-widest font-semibold">
        {label}
      </span>
      <span
        className="text-[28px] font-extrabold leading-none"
        style={{ fontFamily: "Syne, sans-serif", color: accent || "#1e293b" }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Avatar and Status Components ───────────────────────────────
const COLOR_MAP = {
  blue: { bg: "rgba(59,130,246,0.1)", text: "#3b82f6", border: "rgba(59,130,246,0.2)" },
  green: { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.2)" },
  purple: { bg: "rgba(139,92,246,0.1)", text: "#8b5cf6", border: "rgba(139,92,246,0.2)" },
  amber: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" },
  coral: { bg: "rgba(251,113,133,0.1)", text: "#fb7185", border: "rgba(251,113,133,0.2)" },
  teal: { bg: "rgba(20,184,166,0.1)", text: "#14b8a6", border: "rgba(20,184,166,0.2)" },
};

export const getInitials = (name) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

export function Avatar({ name, color = "blue", size = 36 }) {
  const { bg, text, border } = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: bg,
        color: text,
        border: `1.5px solid ${border}`,
        fontFamily: "Syne, sans-serif",
      }}
    >
      {getInitials(name)}
    </div>
  );
}

const STATUS_STYLES = {
  active: "bg-[rgba(16,185,129,0.1)] text-[#10b981] border-[rgba(16,185,129,0.2)]",
  inactive: "bg-[rgba(100,116,139,0.1)] text-[#64748b] border-[rgba(100,116,139,0.2)]",
  placed: "bg-[rgba(16,185,129,0.1)] text-[#10b981] border-[rgba(16,185,129,0.2)]",
  pending: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]",
};

export function StatusTag({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${
        STATUS_STYLES[status] || STATUS_STYLES.pending
      }`}
    >
      {status}
    </span>
  );
}

// ── Dummy Data ─────────────────────────────────────────────────
export const DUMMY_CAMPUSES = [
  {
    _id: "c001",
    name: "Indian Institute of Technology",
    university: "IIT System",
    email: "placement@iit.edu",
    phone: "+91-11-2659-7135",
    location: "Delhi",
    established: "1961",
    totalStudents: 8500,
    placementHead: "Dr. Rajesh Kumar",
    status: "active",
    avatarColor: "blue",
  },
  {
    _id: "c002",
    name: "National Institute of Technology",
    university: "NIT System",
    email: "placement@nit.edu",
    phone: "+91-80-2360-8201",
    location: "Bangalore",
    established: "1960",
    totalStudents: 6200,
    placementHead: "Prof. Sunita Rao",
    status: "active",
    avatarColor: "green",
  },
  {
    _id: "c003",
    name: "Birla Institute of Technology",
    university: "BITS System",
    email: "placement@bits.edu",
    phone: "+91-33-2322-0321",
    location: "Pilani",
    established: "1964",
    totalStudents: 4500,
    placementHead: "Dr. Amit Patel",
    status: "active",
    avatarColor: "purple",
  },
  {
    _id: "c004",
    name: "Delhi University",
    university: "DU System",
    email: "placement@du.ac.in",
    phone: "+91-11-2700-5900",
    location: "Delhi",
    established: "1922",
    totalStudents: 12000,
    placementHead: "Prof. Meera Singh",
    status: "inactive",
    avatarColor: "amber",
  },
];

export const DUMMY_EMPLOYEES = {
  c001: [
    { _id: "e001", name: "Dr. Rajesh Kumar", email: "rajesh.k@iit.edu", phone: "+91-9810011001", role: "Placement Head", department: "Training & Placement", status: "active", joinDate: "2020-06-01", campusId: "c001", studentsAdded: 2 },
    { _id: "e002", name: "Prof. Sunita Rao", email: "sunita.r@iit.edu", phone: "+91-9810022002", role: "Coordinator", department: "Training & Placement", status: "active", joinDate: "2021-03-15", campusId: "c001", studentsAdded: 1 },
    { _id: "e003", name: "Mr. Anil Desai", email: "anil.d@iit.edu", phone: "+91-9810033003", role: "Admin", department: "Administration", status: "active", joinDate: "2019-08-10", campusId: "c001", studentsAdded: 1 },
  ],
  c002: [
    { _id: "e004", name: "Prof. Meera Singh", email: "meera.s@nit.edu", phone: "+91-9820044004", role: "Placement Head", department: "Training & Placement", status: "active", joinDate: "2020-06-01", campusId: "c002", studentsAdded: 2 },
    { _id: "e005", name: "Dr. Vikram Joshi", email: "vikram.j@nit.edu", phone: "+91-9820055005", role: "Coordinator", department: "Training & Placement", status: "active", joinDate: "2021-09-20", campusId: "c002", studentsAdded: 1 },
  ],
  c003: [
    { _id: "e006", name: "Dr. Amit Patel", email: "amit.p@bits.edu", phone: "+91-9830066006", role: "Placement Head", department: "Training & Placement", status: "active", joinDate: "2020-01-15", campusId: "c003", studentsAdded: 1 },
    { _id: "e007", name: "Prof. Priya Nair", email: "priya.n@bits.edu", phone: "+91-9830077007", role: "Coordinator", department: "Training & Placement", status: "inactive", joinDate: "2022-02-10", campusId: "c003", studentsAdded: 0 },
  ],
  c004: [
    { _id: "e008", name: "Prof. Ishaan Roy", email: "ishaan.r@du.ac.in", phone: "+91-9840088008", role: "Placement Head", department: "Training & Placement", status: "active", joinDate: "2019-11-05", campusId: "c004", studentsAdded: 1 },
  ],
};

export const DUMMY_STUDENTS = [
  // c001 - IIT Delhi
  { _id: "s001", name: "Arjun Sharma", email: "arjun.s@iit.edu", phone: "+91-9876543210", campusId: "c001", campusName: "IIT Delhi", branch: "Computer Science", year: "4th", status: "placed", testCompleted: true, testScore: 92, testDate: "2024-03-10", addedBy: "campus", addedById: null, addedByName: "IIT Delhi" },
  { _id: "s002", name: "Priya Mehta", email: "priya.m@iit.edu", phone: "+91-9812345678", campusId: "c001", campusName: "IIT Delhi", branch: "Electrical", year: "3rd", status: "active", testCompleted: true, testScore: 88, testDate: "2024-03-11", addedBy: "employee", addedById: "e001", addedByName: "Dr. Rajesh Kumar" },
  { _id: "s003", name: "Rohit Kumar", email: "rohit.k@iit.edu", phone: "+91-9823456789", campusId: "c001", campusName: "IIT Delhi", branch: "Mechanical", year: "4th", status: "placed", testCompleted: true, testScore: 85, testDate: "2024-03-09", addedBy: "employee", addedById: "e002", addedByName: "Prof. Sunita Rao" },
  { _id: "s004", name: "Sneha Patel", email: "sneha.p@iit.edu", phone: "+91-9834567890", campusId: "c001", campusName: "IIT Delhi", branch: "Civil", year: "3rd", status: "active", testCompleted: false, testScore: null, testDate: null, addedBy: "employee", addedById: "e003", addedByName: "Mr. Anil Desai" },
  
  // c002 - NIT Bangalore
  { _id: "s005", name: "Vikram Singh", email: "vikram.s@nit.edu", phone: "+91-9845678901", campusId: "c002", campusName: "NIT Bangalore", branch: "Information Technology", year: "4th", status: "placed", testCompleted: true, testScore: 90, testDate: "2024-03-08", addedBy: "campus", addedById: null, addedByName: "NIT Bangalore" },
  { _id: "s006", name: "Anjali Nair", email: "anjali.n@nit.edu", phone: "+91-9856789012", campusId: "c002", campusName: "NIT Bangalore", branch: "Electronics", year: "3rd", status: "active", testCompleted: true, testScore: 87, testDate: "2024-03-12", addedBy: "employee", addedById: "e004", addedByName: "Prof. Meera Singh" },
  { _id: "s007", name: "Rahul Gupta", email: "rahul.g@nit.edu", phone: "+91-9867890123", campusId: "c002", campusName: "NIT Bangalore", branch: "Chemical", year: "4th", status: "placed", testCompleted: true, testScore: 82, testDate: "2024-03-07", addedBy: "employee", addedById: "e005", addedByName: "Dr. Vikram Joshi" },
  
  // c003 - BITS Pilani
  { _id: "s008", name: "Meera Iyer", email: "meera.i@bits.edu", phone: "+91-9878901234", campusId: "c003", campusName: "BITS Pilani", branch: "Computer Science", year: "3rd", status: "active", testCompleted: false, testScore: null, testDate: null, addedBy: "campus", addedById: null, addedByName: "BITS Pilani" },
  { _id: "s009", name: "Karan Malhotra", email: "karan.m@bits.edu", phone: "+91-9889012345", campusId: "c003", campusName: "BITS Pilani", branch: "Electrical", year: "4th", status: "placed", testCompleted: true, testScore: 94, testDate: "2024-03-06", addedBy: "employee", addedById: "e006", addedByName: "Dr. Amit Patel" },
  
  // c004 - Delhi University
  { _id: "s010", name: "Ishaan Roy", email: "ishaan.r@du.ac.in", phone: "+91-9890123456", campusId: "c004", campusName: "Delhi University", branch: "Commerce", year: "3rd", status: "active", testCompleted: true, testScore: 78, testDate: "2024-03-05", addedBy: "employee", addedById: "e008", addedByName: "Prof. Ishaan Roy" },
];

export const DUMMY_STATS = {
  totalCampuses: 4,
  activeCampuses: 3,
  inactiveCampuses: 1,
  totalStudents: 10,
  testsCompleted: 7,
  averageScore: 86,
};
