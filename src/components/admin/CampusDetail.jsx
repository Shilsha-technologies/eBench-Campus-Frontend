import { useParams } from "react-router-dom";
import { useGetCampusDetailsQuery } from "../../redux/services/adminApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


// ─── Helper utils ────────────────────────────────────────────────────────────
function getInitials(name = "") {
  if (!name || typeof name !== 'string') {
    return "NA";
  }
  return name
    .split(" ")
    .filter(Boolean) // Remove empty strings
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Badge({ variant = "neutral", children }) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

function Avatar({ name, index }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColor(index)}`}>
      {getInitials(name)}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold text-gray-800">{value}</span>
        {icon && <span className="text-lg mb-0.5">{icon}</span>}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right max-w-[55%] break-words">{value}</span>
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "students", label: "Students" },
  { key: "staff", label: "SubVendor" },
  { key: "activity", label: "Activity" },
];

// ─── Overview Tab ────────────────────────────────────────────────────────────
function OverviewTab({ vendor }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-6">
        <div className="bg-white border border-green-100/15 rounded-2xl overflow-hidden" style={{
          boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset"
        }}>
          <div className="h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 w-full"></div>
          <div className="p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Campus Details</h3>
            <div>
              <InfoRow label="Campus name" value={vendor.campus_name} />
              <InfoRow label="University" value={vendor.university} />
              <InfoRow label="Established" value={vendor.established} />
              <InfoRow label="Address" value={vendor.campus_address} />
              <InfoRow label="City / State" value={`${vendor.city}, ${vendor.state}`} />
              <InfoRow label="Pincode" value={vendor.pincode} />
              <InfoRow label="Total students" value={vendor.total_students?.toLocaleString()} />
              <InfoRow label="Contact phone" value={vendor.contact_phone} />
              <InfoRow
                label="Website"
                value={
                  <a href={vendor.website} target="_blank" rel="noreferrer"
                    className="text-green-600 hover:underline break-all">
                    {vendor.website}
                  </a>
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100/15 rounded-2xl overflow-hidden" style={{
          boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset"
        }}>
          <div className="h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 w-full"></div>
          <div className="p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Account Details</h3>
            <div>
              <InfoRow label="Email" value={vendor.email} />
              <InfoRow label="Plan ID" value={`#${vendor.selected_plan_id}`} />
              <InfoRow label="Plan price" value={`₹${vendor.selected_plan_price?.toLocaleString()}`} />
              <InfoRow label="Subscribed" value={<Badge variant="success">{vendor.is_subscribed ? "Yes" : "No"}</Badge>} />
              <InfoRow label="Verified" value={<Badge variant="success">{vendor.is_verified ? "Yes" : "No"}</Badge>} />
              <InfoRow label="Disabled" value={<Badge variant={vendor.is_disabled ? "danger" : "neutral"}>{vendor.is_disabled ? "Yes" : "No"}</Badge>} />
              <InfoRow label="Joined" value={formatDate(vendor.created_at)} />
              <InfoRow label="Last login" value={formatDate(vendor.last_login)} />
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <div className="bg-white border border-green-100/15 rounded-2xl overflow-hidden" style={{
          boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset"
        }}>
          <div className="h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 w-full"></div>
          <div className="p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Departments</h3>
            <div className="divide-y divide-gray-100">
              {vendor.departmentStats?.map(([name, count, color]) => (
                <div key={name} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="flex-1 text-gray-700">{name}</span>
                  <span className="font-semibold text-gray-800">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100/15 rounded-2xl overflow-hidden" style={{
          boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset"
        }}>
          <div className="h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 w-full"></div>
          <div className="p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Recent Activity</h3>
            <div className="divide-y divide-gray-100">
              {vendor.recentActivity?.map(([title, desc, time, icon], i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50/50 border border-green-100/50 flex items-center justify-center text-base shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Students Tab ────────────────────────────────────────────────────────────
function StudentsTab({ candidates }) {
  const [search, setSearch] = useState("");

  const filtered = candidates.filter((c) =>
    [c.name, c.email, c.phone, c.branch, c.addedBy]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search students by name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-green-50 rounded-xl overflow-hidden" style={{
        boxShadow: "0 4px 16px rgba(34,197,94,.06)"
      }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Branch</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Added by</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Test</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                    No students match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={c.name} index={i} />
                        <span className="font-medium text-gray-800 capitalize">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-gray-500">{c.phone}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">Branch {c.branch}</Badge>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">{c.addedBy}</td>
                    <td className="px-4 py-3">
                      {c.testCompleted ? (
                        <Badge variant="success">Done — {c.testScore}%</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.status === "active" ? "success" : "danger"}>
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-right">
          {filtered.length} of {candidates.length} students
        </div>
      </div>
    </div>
  );
}

// ─── SubVendor Tab ───────────────────────────────────────────────────────────────
function StaffTab({ staff }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Students added</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staff.map((s, i) => (
              <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} index={i} />
                    <span className="font-medium text-gray-800 capitalize">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{s.email}</td>
                <td className="px-4 py-3 text-gray-500">{s.phone}</td>
                <td className="px-4 py-3">
                  <Badge variant="info">{s.role}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{s.department}</td>
                <td className="px-4 py-3 text-gray-500">{s.joinDate}</td>
                <td className="px-4 py-3 text-center font-medium">{s.studentsAdded}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.status === "active" ? "success" : "danger"}>
                    {s.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Activity Tab ────────────────────────────────────────────────────────────
function ActivityTab({ activities }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 divide-y divide-gray-100">
      {activities.map(([title, desc, time, icon], i) => (
        <div key={i} className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
            <p className="text-xs text-gray-400 mt-1">{time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function VendorDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { campusId } = useParams();
  const navigate = useNavigate();

  const { data: vendorData, isLoading, error } = useGetCampusDetailsQuery(campusId);
  const vendor = vendorData?.vendor;
  const candidates = vendorData?.candidates || [];
  const staff = vendorData?.subvendor || [];
  const stats = vendorData?.statistics || {};

  const onBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
          <p className="text-gray-500 mb-4">The requested vendor does not exist.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All vendors
        </button>

        {/* ── Vendor Header Card ── */}
        <div className="bg-white border border-green-100/15 rounded-2xl overflow-hidden mb-6 shadow-lg" style={{
          boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset"
        }}>
          {/* Green gradient top strip */}
          <div className="h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 w-full"></div>
          {/* Top strip */}
          <div className="flex flex-wrap items-center gap-4 px-6 py-5 border-b border-green-50">
            {/* Logo / initials */}
            <div className="w-14 h-14 rounded-xl bg-green-200 text-green-700 flex items-center justify-center text-xl font-bold shrink-0">
              {getInitials(vendor.campus_name || vendor.name || "Vendor")}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{vendor.campus_name}</h1>
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {vendor.university} &nbsp;·&nbsp; {vendor.city}, {vendor.state}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {vendor.is_verified && <Badge variant="success">Verified</Badge>}
              {vendor.is_subscribed && <Badge variant="info">Subscribed</Badge>}
              {vendor.is_disabled && <Badge variant="danger">Disabled</Badge>}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-green-50">
            {[
              { label: "Total students", value: stats.totalCandidates || 0, icon: "👥" },
              { label: "Tests sent", value: stats.totalTestSent || 0, icon: "📤" },
              { label: "Tests pending", value: stats.totalTestPending || 0, icon: "⏳" },
              { label: "Completed", value: stats.totalTestCompleted || 0, icon: "✅" },
              { label: "SubVendor", value: vendorData?.subvendorCount || staff.length, icon: "🧑‍💼" },
              { label: "Plan credits", value: vendor.subscription_credits || 0, icon: "💳" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="px-5 py-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-bold text-gray-800">{value}</span>
                  <span className="text-base mb-0.5">{icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="border-b border-green-100/30 mb-6">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {TABS.map((tab) => {
              const counts = {
                students: ` (${candidates.length})`,
                staff: ` (${staff.length})`,
              };
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.label}
                  {counts[tab.key] && (
                    <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
                      {tab.key === "students" ? candidates.length : staff.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "overview" && <OverviewTab vendor={vendor} />}
        {activeTab === "students" && <StudentsTab candidates={candidates} />}
        {activeTab === "staff" && <StaffTab staff={staff} />}
        {activeTab === "activity" && <ActivityTab activities={vendor.recentActivity} />}

      </div>
    </div>
  );
}