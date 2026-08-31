import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveInactiveUserMutation, useGetAllVendorQuery } from "../../redux/services/adminApi";
import { Table, Badge } from "../../libs/Ui";
import toast from "react-hot-toast";
import { Pagination } from "../../page/vendor/user/UserManagement";
import useDebounce from "../../libs/useDebounce";

// Helper function to get initials from name
export const getInitials = (name) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

export default function CampusManagement() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  const [search, setSearch] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sign, setSign] = useState(false)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedQuery = useDebounce(search, 500);

  const [aciveInactive, { isLoading: signLoading, isError: signError, isSuccess }] = useActiveInactiveUserMutation({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const {
    data,
    error,
    isLoading,
    isError,
  } = useGetAllVendorQuery({ search: debouncedQuery, status: statusFilter, page, limit: pageSize });

  useEffect(() => {
    setPage(1)
  }, [statusFilter, debouncedQuery])


  const filtered = data?.vendors || []
  // console.log("campus-management", filtered);


  let total = data?.total ?? 0
  const columns = [
    {
      key: "name",
      label: "Campus Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#28ba5e] text-white flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
            {getInitials(value || 'Unknown')}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="font-semibold text-sm text-[#1e293b] truncate max-w-full"
              title={value || 'N/A'}
            >
              {value && value.length > 15
                ? `${value.slice(0, 15)}...`
                : value || 'N/A'}
            </div>

            {row?.established && (
              <div className="text-xs text-[#64748b]">Est. {row?.established}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (value, row) => (
        <div className="text-sm text-[#1e293b] truncate" title={value || 'N/A'}>
          {value || 'N/A'}
        </div>
      )
    },
    {
      key: "location",
      label: "Location",
      render: (_, row) => {
        const location = row.city ? `${row.city}${row.state ? `, ${row.state}` : ''}` : 'N/A';
        return (
          <div className="text-sm text-[#1e293b] truncate" title={location}>
            {location}
          </div>
        );
      }
    },
    {
      key: "total_students",
      label: "Students",
      render: (value) => (
        <div className="text-sm text-[#1e293b] font-medium">
          {value || 0}
        </div>
      )
    },
    {
      key: "candidate_count",
      label: "Candidates",
      render: (value) => (
        <div className="text-sm text-[#1e293b] font-medium">
          {value || 0}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => (
        <Badge variant={row.is_disabled ? "red" : "green"}>
          {row.is_disabled ? "Inactive" : "Active"}
        </Badge>
      )
    },
    {
      key: "subscription",
      label: "Subscription",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.is_subscribed ? "green" : "gray"}>
            {row.is_subscribed ? "Subscribed" : "Not Subscribed"}
          </Badge>
          {row.total_credits && (
            <span className="text-xs text-[#64748b] whitespace-nowrap" title={`${row.total_credits} credits`}>
              {row.total_credits} credits
            </span>
          )}
        </div>
      )
    },
    {
      key: "university",
      label: "University",
      render: (value, row) => (
        <div className="text-sm text-[#1e293b] truncate" title={value || 'N/A'}>
          {value || 'N/A'}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.is_disabled ? (
            <button
              onClick={() => handleToggleStatus(row)}
              className="px-3 cursor-pointer py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
              title="Activate campus"
            >
              Active
            </button>
          ) : (
            <button
              onClick={() => handleToggleStatus(row)}
              className="px-3 cursor-pointer py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
              title="Deactivate campus"
            >
              Deactive
            </button>
          )}
          <button
            onClick={() => navigate(`/superadmin/campuses/${row.id}`)}
            className={`p-2 rounded-lg cursor-pointer transition-colors ${row.is_disabled
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            title="View campus details"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Handle active/inactive toggle
  const handleToggleStatus = (row) => {
    setSelectedCampus(row);
    setShowConfirmModal(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    if (!selectedCampus) return;
    const formdata = new FormData()
    formdata.append('vendor_ids', selectedCampus?.id)
    formdata.append('is_disabled', !selectedCampus.is_disabled)
    try {
      const result = await aciveInactive(formdata).unwrap();
      // debugger;
      if (result?.status) {
        toast.success('Status updated successfully')
        // console.log('Status updated successfully:', result);
        setShowConfirmModal(false);
        setSelectedCampus(null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Cancel status change
  const cancelStatusChange = () => {
    setShowConfirmModal(false);
    setSelectedCampus(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafb] text-[#1e293b] overflow-hidden font-sans">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-grey-200 border-b border-[rgba(40,186,94,.15)] bg- flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className=" font-extrabold text-[22px] text-[#28ba5e] tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
              Campus Management
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              Manage campuses, their students and placement activities
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2.5 flex-wrap">
          <StatCard label="Total Campuses" value={data?.totalCampuses || 0} />
          <StatCard label="Active" value={data?.activeCampuses || 0} accent="#3b82f6" />
          <StatCard label="Inactive" value={data?.inactiveCampuses || 0} accent="#64748b" />
          <StatCard label="Total Students" value={data?.totalStudents || 0} accent="#10b981" />
          <StatCard label="Tests Sent" value={data?.testsSent || 0} accent="#f59e0b" />
          <StatCard label="Avg. Score" value={`${data?.averageScore || 0}%`} accent="#28ba5e" />
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {/* Search + filters */}
        <div className="px-6 py-3  border-[rgba(40,186,94,.15)] bg-[#f8fafb] flex gap-2 flex-shrink-0">
          <input
            className="flex-1 bg-white border border-[rgba(40,186,94,.15)] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(40,186,94,0.4)] placeholder:text-[#64748b] transition-colors"
            placeholder="Search campuses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex-shrink-0 ${statusFilter === s
                ? "bg-[rgba(40,186,94,0.1)] text-[#28ba5e] border-[rgba(40,186,94,0.3)]"
                : "bg-transparent text-[#64748b] border-[rgba(40,186,94,.15)] hover:bg-white hover:text-[#1e293b]"
                }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-[#64748b]">Loading campuses...</div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-red-500">Error loading campuses: {error?.message || 'Unknown error'}</div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[rgba(40,186,94,.15)] shadow-sm">
              <Table
                columns={columns}
                data={filtered}
                emptyMessage="No campuses match your search"
                headerBg="bg-[#28ba5e]"
                headerTextColor="text-white"
              />
              {/* Pagination */}
              {
                filtered?.length > 0 &&
                <div className="p-4 flex items-center justify-between">
                  <div className="text-xs text-[#28ba5e]">
                    Showing {Math.min((page - 1) * pageSize + 1, total)}-
                    {Math.min(page * pageSize, total)} of {total} users
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#28ba5e]">Rows</span>
                      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 rounded-md text-xs outline-none   border border-[#28ba5e] text-[#28ba5e] bg-white">
                        {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <Pagination page={page} totalPages={data?.total_pages} setPage={setPage} />
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedCampus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={cancelStatusChange} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className={`flex items-center justify-between p-6 ${selectedCampus.is_disabled ? 'bg-green-700' : 'bg-red-700'} border-b border-gray-100`}>
              <h2 className="text-lg font-semibold text-white">
                {selectedCampus.is_disabled ? 'Activate Campus' : 'Deactivate Campus'}
              </h2>
              <button
                onClick={cancelStatusChange}
                className="w-8 h-8 flex text-white items-center cursor-pointer justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black  text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className={`p-4 rounded-lg mb-4 ${selectedCampus.is_disabled
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCampus.is_disabled
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                    }`}>
                    {selectedCampus.is_disabled ? '✓' : '!'}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedCampus.is_disabled ? 'text-green-900' : 'text-red-900'
                      }`}>
                      {selectedCampus.name || 'Unknown Campus'}
                    </h3>
                    <p className={`text-sm ${selectedCampus.is_disabled ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {selectedCampus.is_disabled
                        ? 'This campus will be activated and users will regain access.'
                        : 'This campus will be deactivated and users will lose access.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                Are you sure you want to {selectedCampus.is_disabled ? 'activate' : 'deactivate'} this campus?
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelStatusChange}
                  className="px-4 py-2.5 text-sm cursor-pointer font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  disabled={signLoading}
                  className={`px-4 py-2.5 cursor-pointer text-sm font-medium rounded-lg transition-colors ${selectedCampus.is_disabled
                    ? 'bg-[#28ba5e] hover:bg-[#1e9e4f] text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                    } ${signLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {signLoading ? 'Processing...' : (selectedCampus.is_disabled ? 'Activate' : 'Deactivate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="px-6 py-4 bg-white border-b border-[rgba(40,186,94,.15)] flex-shrink-0">
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
            className="px-2.5 py-1.5 rounded-lg text-sm text-[#64748b] border border-[rgba(40,186,94,.15)] hover:bg-[#f8fafb] hover:text-[#1e293b] transition-all"
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
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border-b-2 transition-all ${tab === t.id
                ? "text-[#28ba5e] border-[#28ba5e] bg-[rgba(40,186,94,0.05)]"
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
                className="flex justify-between items-center px-4 py-2.5 bg-[#f8fafb] rounded-lg border border-[rgba(40,186,94,.15)]"
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
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${studentFilter === s
                    ? "bg-[rgba(40,186,94,0.1)] text-[#28ba5e] border-[rgba(40,186,94,0.3)]"
                    : "bg-transparent text-[#64748b] border-[rgba(40,186,94,.15)] hover:text-[#1e293b]"
                    }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              className="w-full mb-3 bg-white border border-[rgba(40,186,94,.15)] text-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-[rgba(40,186,94,0.4)] placeholder:text-[#64748b] transition-colors"
              placeholder="Search by name, email or branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* View All Students Button */}
            <div className="mb-3">
              <button
                onClick={onViewStudents}
                className="w-full px-4 py-2 bg-[#28ba5e] text-white rounded-lg text-sm font-medium hover:bg-[#1e9e4f] transition-all"
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
            <div className="bg-[#f8fafb] p-4 rounded-lg border border-[rgba(40,186,94,.15)]">
              <div className="text-2xl font-bold text-[#28ba5e]">{campus.totalStudents}</div>
              <div className="text-xs text-[#64748b]">Total Students</div>
            </div>
            <div className="bg-[#f8fafb] p-4 rounded-lg border border-[rgba(40,186,94,.15)]">
              <div className="text-2xl font-bold text-[#10b981]">
                {allStudents.filter(s => s.status === "placed").length}
              </div>
              <div className="text-xs text-[#64748b]">Placed Students</div>
            </div>
            <div className="bg-[#f8fafb] p-4 rounded-lg border border-[rgba(40,186,94,.15)]">
              <div className="text-2xl font-bold text-[#f59e0b]">
                {allStudents.filter(s => s.testCompleted).length}
              </div>
              <div className="text-xs text-[#64748b]">Tests Completed</div>
            </div>
            <div className="bg-[#f8fafb] p-4 rounded-lg border border-[rgba(40,186,94,.15)]">
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
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(40,186,94,.15)] rounded-xl">
      {/* Monogram */}
      <div className="w-9 h-9 rounded-full bg-[#f8fafb] border border-[rgba(40,186,94,.15)] flex items-center justify-center text-xs font-bold text-[#64748b] flex-shrink-0" style={{ fontFamily: "Syne, sans-serif" }}>
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
      className="rounded-xl p-4 cursor-pointer transition-all duration-150 bg-white border border-[rgba(40,186,94,.15)] hover:border-[rgba(40,186,94,.3)] hover:bg-[#f8fafb] hover:shadow-md"
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
    blue: "bg-[rgba(40,186,94,0.1)] text-[#28ba5e] border-[rgba(40,186,94,0.2)]",
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
    <div className="flex-1 min-w-[110px] bg-white border border-[rgba(40,186,94,.15)] rounded-xl px-5 py-4 flex flex-col gap-1.5">
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
  blue: { bg: "rgba(40,186,94,0.1)", text: "#28ba5e", border: "rgba(40,186,94,0.2)" },
  green: { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.2)" },
  purple: { bg: "rgba(139,92,246,0.1)", text: "#8b5cf6", border: "rgba(139,92,246,0.2)" },
  amber: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" },
  coral: { bg: "rgba(251,113,133,0.1)", text: "#fb7185", border: "rgba(251,113,133,0.2)" },
  teal: { bg: "rgba(20,184,166,0.1)", text: "#14b8a6", border: "rgba(20,184,166,0.2)" },
};


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
  active: "bg-[rgba(40,186,94,0.1)] text-[#28ba5e] border-[rgba(40,186,94,0.2)]",
  inactive: "bg-[rgba(100,116,139,0.1)] text-[#64748b] border-[rgba(100,116,139,0.2)]",
  placed: "bg-[rgba(40,186,94,0.1)] text-[#28ba5e] border-[rgba(40,186,94,0.2)]",
  pending: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]",
  subscribed: "bg-[rgba(40,186,94,0.1)] text-[#28ba5e] border-[rgba(40,186,94,0.2)]",
  'not-subscribed': "bg-[rgba(100,116,139,0.1)] text-[#64748b] border-[rgba(100,116,139,0.2)]",
};

export function StatusTag({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${STATUS_STYLES[status] || STATUS_STYLES.pending
        }`}
    >
      {status}
    </span>
  );
}

// ── Dummy Data ─────────────────────────────────────────────────
export const DUMMY_CAMPUSES = [
  {
    _id: "ae1bb893-72b6-4647-80a8-5de655c6bd27",
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