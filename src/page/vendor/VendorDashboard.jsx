import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/ui/Layout/DashboardLayout";
import { StatCard } from "../../libs/Ui";
import { useVendorDashboardApiQuery } from "../../redux/services/vendorApi";
import { useAuth } from "../../libs/AuthProvider";
import { useEffect } from "react";

export default function DashboardPage() {
  // const { candidates,  } = useApp();
  const navigate = useNavigate();

  const { getProfileCompleteness, updateProfileCompleteness } = useAuth();
  let profileCompletion = getProfileCompleteness()
  // debugger;
  if (profileCompletion < 100) {
    return navigate('/vendor/profile')
  }

  const { data, isLoading, isError } = useVendorDashboardApiQuery();

  const { vendor, address, branches, credits_summary, candidates_summary, recent_candidates, recent_activity, dashboard_stats } = data || {};


  useEffect(() => {
    if (data?.credits !== undefined) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      user.remaining_credits = data.credits;

      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [data]);

  // If no data is available, show no data message
  if (!data || (!vendor && !dashboard_stats)) {
    return (
      <div className="p-4 lg:p-3">
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h2>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Dashboard data is currently unavailable. Please check back later or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }
  const totalCandidates = dashboard_stats?.total_candidates ?? 0;
  const testsSent = dashboard_stats?.tests_sent ?? 0;
  const testsCompleted = dashboard_stats?.tests_completed ?? 0;
  const activeCandidates = dashboard_stats?.active_candidates ?? 0;
  const avgScore = dashboard_stats?.average_score ?? 0;
  const passRate = dashboard_stats?.pass_rate ?? 0;


  const RECENT_ACTIVITY = recent_activity ?? []


  return (
    <div className="p-4 lg:p-3 space-y-6">
      {/* Campus Profile Header */}
      <div className="bg-linear-to-r from-indigo-500 to-blue-600 rounded-2xl p-6  text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{`Welcome back, ${vendor?.name} 👋`}</h1>
            <p className="text-sm text-indigo-100 mt-1">Manage placements, candidates, and hiring activities easily</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-indigo-100">
              <span>🏫 {`${vendor?.name}`}</span>
              <span>📍 {`${address?.address}`}</span>
              <span>📧 {`${vendor?.email}`}</span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center"><p className="text-xl font-bold">{candidates_summary?.total_candidates ?? 0}</p><p className="text-xs text-indigo-100">Candidates</p></div>
            <div className="text-center"><p className="text-xl font-bold">{dashboard_stats?.tests_completed ?? 0}</p><p className="text-xs text-indigo-100">Completed</p></div>
            <div className="text-center"><p className="text-xl font-bold">{data?.credits ?? 0}</p><p className="text-xs text-indigo-100">Credits</p></div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your campus placement activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Candidates" value={totalCandidates} icon="👥" color="indigo" change={12} />
        <StatCard label="Tests Sent" value={testsSent} icon="📤" color="blue" change={8} />
        <StatCard label="Tests Completed" value={testsCompleted} icon="✅" color="emerald" change={5} />
        <StatCard label="Remaining Credits" value={data?.credits} icon="💳" color="amber" />
      </div>
      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Active Candidates</div>
          <div className="text-2xl font-bold text-gray-900">{activeCandidates}</div>
          <ProgressBar
            value={Number.isFinite(Math.round((activeCandidates / totalCandidates) * 100))
              ? Math.round((activeCandidates / totalCandidates) * 100)
              : 0}
            showLabel={false}
            color="indigo"
          />
          <div className="text-xs text-gray-400 mt-1">
            {Number.isFinite(activeCandidates / totalCandidates)
              ? `${Math.round((activeCandidates / totalCandidates) * 100)}% of total`
              : '0% of total'}
          </div>        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Average Score</div>
          <div className="text-2xl font-bold text-gray-900">{avgScore ?? 0}</div>
          <ProgressBar value={Number(avgScore) || 0} showLabel={false} color="emerald" />
          <div className="text-xs text-gray-400 mt-1">Out of 100</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Pass Rate</div>
          <div className="text-2xl font-bold text-gray-900">{passRate}%</div>
          <ProgressBar value={passRate} showLabel={false} color={passRate >= 60 ? "emerald" : "amber"} />
          <div className="text-xs text-gray-400 mt-1">Minimum score: 60</div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-white rounded-2xl border  border-gray-100 shadow-sm">
          <div className="flex items-center sticky top-0 bg-white justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>
          <div className="divide-y h-85 overflow-auto divide-gray-50">
            {RECENT_ACTIVITY && RECENT_ACTIVITY.length > 0 ? (
              RECENT_ACTIVITY.map((a, index) => (
                <div key={index} className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm font-medium">No recent activity</p>
                <p className="text-xs mt-1">Your activity will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions + completion */}
        <div className="space-y-4">
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <p className="text-indigo-100 text-sm mt-1 mb-4">Manage candidates and tests efficiently</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate("/vendor/candidates")} className="bg-white/20 hover:bg-white/30 rounded-xl py-2.5 text-sm font-medium transition-colors cursor-pointer">+ Add Candidate</button>
              <button onClick={() => navigate("/vendor/results")} className="bg-white/20 hover:bg-white/30 rounded-xl py-2.5 text-sm font-medium transition-colors cursor-pointer">View Results</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Test Completion Rate</h3>
            <div className="space-y-3">
              <ProgressBar label="Tests Sent" value={totalCandidates > 0 && Number.isFinite(testsSent)
                ? Math.round((testsSent / totalCandidates) * 100)
                : 0} color="indigo" />
              <ProgressBar
                label="Tests Completed"
                value={
                  totalCandidates > 0 && Number.isFinite(testsCompleted)
                    ? Math.round((testsCompleted / totalCandidates) * 100)
                    : 0
                }
                color="emerald"
              />

              <ProgressBar
                label="Pending Tests"
                value={
                  totalCandidates > 0 && Number.isFinite(testsSent - testsCompleted)
                    ? Math.round(((testsSent - testsCompleted) / totalCandidates) * 100)
                    : 0
                }
                color="amber"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}