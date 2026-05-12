// import { motion } from "framer-motion";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
// import profileImg from '../../assets/userImg.jpg';
// import { useVendorDashboardApiQuery } from "../../redux/services/vendorApi";
// import { useNavigate } from "react-router-dom";
// import PageLoader from "../../libs/PageLoader";
// import ErrorPage from "../../libs/ErrorPage";

// export default function VendorDashboard() {
//   const navigate = useNavigate();

//   const { data, isLoading, isError } = useVendorDashboardApiQuery();
//   // console.log("ddlljj", data);
//   const recentCredits = data?.credits_summary?.plans;
//   const recentUsers = data?.recent_candidates;
//   const lineChartData = data?.charts?.lineChartData ?? []
//   const userData = data?.charts?.barChartData ?? []
//   const statsCards = [
//     !data?.credits_summary?.trial ? { title: 'Remaining Credits', value: data?.credits_summary?.total_remaining_credits ?? 0 } :
//       { title: "Free Credits", value: data?.credits_summary?.trial?.credits_remaining ?? 0 },
//     { title: 'Total Users', value: data?.candidates_summary?.total_candidates ?? 0 },
//   ];

//   if (isLoading) {
//     return <PageLoader />
//   }

//   if (isError) {
//     return <ErrorPage />
//   }


//   return (
//     <div className="min-h-screen bg-[#fafafa] p-6 pt-5 font-inter text-gray-800">
//       {/* ---------------------- PROFILE HEADER WITH IMAGE ---------------------- */}
//       <motion.div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-10 flex items-center gap-8">
//         <img src={profileImg} alt="Vendor Profile" className="w-32 h-32 rounded-2xl border border-gray-300 object-cover" />
//         <div className="flex-1">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-3xl font-semibold text-[#286a94] mb-1">{data?.vendor?.name || 'N/A'}</h2>
//               <p className="text-gray-500 text-sm mb-4">Vendor {data?.vendor?.id}</p>
//             </div>
//             {/* <div>
//               <button className=" p-2 text-sm bg-green-600 animate-pulse px-4 py-2 font-bold text-white rounded-xl">Upgrade your plan</button>
//             </div> */}
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
//             <div><span className="font-medium text-gray-600">Email:</span> {data?.vendor?.email ?? "N/A"}</div>
//             <div>
//               <span className="font-medium text-gray-600">Phone:</span>{" "}
//               {data?.vendor?.phone ? `+${data.vendor.phone}` : "N/A"}
//             </div>
//             <div><span className="font-medium text-gray-600">Country:</span> {data?.vendor?.country ?? 'N/A'}</div>
//             {/* <div><span className="font-medium text-gray-600">Id:</span> {data?.vendor?.id}</div> */}
//             {/* <div><span className="font-medium text-gray-600">Users:</span> 128</div> */}
//             {/* <div><span className="font-medium text-gray-600">Credits Left:</span> 342</div> */}
//           </div>
//         </div>
//       </motion.div>

//       {/* ---------------------- STATS CARDS ---------------------- */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {statsCards.map((card, index) => (
//           <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
//             <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//               <p className="text-gray-400 text-xs tracking-wide mb-1 uppercase">{card.title}</p>
//               <h3 className="text-2xl font-semibold text-[#286a94]">{card.value}</h3>
//             </div>
//           </motion.div>
//         ))}
//       </section>

//       <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
//         <div className="flex justify-between">
//           <div className="text-xl font-semibold text-[#286a94] mb-4">Recently Subscription Details</div>
//           <button
//             onClick={() => navigate('/vendor/subscription/view')}
//             className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-left border-collapse">
//             <thead className="bg-gray-50 text-gray-500 text-sm">
//               <tr>
//                 <th className="py-3 px-4">Plan Name</th>
//                 <th className="py-3 px-4">Country</th>
//                 <th className="py-3 px-4">Remaining Credit</th>
//                 <th className="py-3 px-4">Start Date</th>
//                 <th className="py-3 px-4">End Date</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm">
//               {recentCredits && recentCredits.length > 0 ? (
//                 recentCredits.map((user, i) => (
//                   <tr
//                     key={i}
//                     className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                       } hover:bg-gray-100 transition`}
//                   >
//                     <td className="py-3 px-4">{user?.plan_name || ''}</td>
//                     <td className="py-3 px-4">{user?.country || ''}</td>
//                     <td className="py-3 px-4">{user?.remaining_credits}</td>
//                     <td className="py-3 px-4">
//                       {user?.started_at
//                         ? new Date(user.started_at).toLocaleString()
//                         : ''}
//                     </td>
//                     <td className="py-3 px-4">
//                       {user?.expires_at
//                         ? new Date(user.expires_at).toLocaleString()
//                         : ''}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="py-4 px-4 text-center text-gray-500"
//                   >
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>


//       {/* ---------------------- RECENT USERS TABLE ---------------------- */}
//       <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//         <div className="flex justify-between">
//           <h3 className="text-xl font-semibold text-[#286a94] mb-4">Recently Added Candidates</h3>
//           <button
//             onClick={() => navigate('/vendor/user-management')}
//             className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button>

//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-left border-collapse">
//             <thead className="bg-gray-50 text-gray-500 text-sm">
//               <tr>
//                 <th className="py-3 px-4">Name</th>
//                 <th className="py-3 px-4">Email</th>
//                 <th className="py-3 px-4">Country</th>
//                 <th className="py-3 px-4">Created At</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm">
//               {recentUsers && recentUsers.length > 0 ? (
//                 recentUsers.map((user, i) => (
//                   <tr
//                     key={i}
//                     className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                       } hover:bg-gray-100 transition`}
//                   >
//                     <td className="py-3 px-4">{`${user?.first_name} ${user?.last_name}`}</td>
//                     <td className="py-3 px-4">{user.email}</td>
//                     <td className="py-3 px-4">{user.country}</td>
//                     <td className="py-3 px-4">
//                       {new Date(user?.created_at).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="py-4 px-4 text-center text-gray-500"
//                   >
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>

//           </table>
//         </div>
//       </motion.div>


//       {/* ---------------------- BAR GRAPH ---------------------- */}
//       {
//         userData?.length > 0 &&
//         <section className="flex justify-between mt-10">
//           <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
//             <h3 className=" font-semibold text-[#286a94] mb-4">Monthly Users & Credits</h3>
//             {
//               userData?.length > 0 &&
//               <div className="w-full h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={userData} barSize={25}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="users" fill="#1a80bb" radius={[6, 6, 0, 0]} />
//                     <Bar dataKey="credits" fill="#ea801c" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             }

//           </motion.div>

//           {/* ---------------------- LINE GRAPH ---------------------- */}
//           <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
//             <h3 className=" font-semibold text-[#286a94] mb-4">New Users Growth</h3>
//             {
//               lineChartData?.length > 0 &&
//               <div className="w-full h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={lineChartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="newUsers" stroke="#286a94" strokeWidth={3} dot={{ r: 5 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             }
//           </motion.div>

//         </section>
//       }


//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
// import { useApp, RECENT_ACTIVITY } from "../context/AppContext";
// import { StatCard } from "../components/ui";
import { ProgressBar } from "../../components/ui/Layout/DashboardLayout";
import { StatCard } from "../../libs/Ui";
import { useVendorDashboardApiQuery } from "../../redux/services/vendorApi";
import { useAuth } from "../../libs/AuthProvider";
// import ProgressBar from "../components/ProgressBar";

export default function DashboardPage() {
  // const { candidates,  } = useApp();
  const navigate = useNavigate();

   const { getProfileCompleteness, canAccessManagement } = useAuth();
    let profileCompletion = getProfileCompleteness()
    // debugger;
  if(profileCompletion<100){
    return navigate('/vendor/profile')
  }

  const { data, isLoading, isError } = useVendorDashboardApiQuery();

  const { vendor, branches, credits_summary, candidates_summary, recent_candidates,recent_activity, dashboard_stats } = data || {};

  console.log("ddlj", data)

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
  const totalCandidates = dashboard_stats?.total_candidates??0;
  const testsSent = dashboard_stats?.tests_sent??0;
  const testsCompleted = dashboard_stats?.tests_completed??0;
  const activeCandidates = dashboard_stats?.active_candidates??0;
  const avgScore = dashboard_stats?.average_score??0;
  const passRate = dashboard_stats?.pass_rate??0;

  const activityIcons = { 
  test: "", 
  candidate: "", 
  result: "", 
  credit: "",
  credits_purchased: "" 
};

  // const RECENT_ACTIVITY = [
  //   { id: 1, text: "Test link sent to Arjun Sharma", time: "2 hours ago", type: "test" },
  //   { id: 2, text: "Priya Mehta added as new candidate", time: "4 hours ago", type: "candidate" },
  //   { id: 3, text: "Vikram Singh completed test (Score: 93)", time: "Yesterday", type: "result" },
  //   { id: 5, text: "50 credits purchased (Professional plan)", time: "2 days ago", type: "credit" },
  // ];

  const RECENT_ACTIVITY=recent_activity??[]

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
              <span>📍 Noida, Uttar Pradesh</span>
              <span>📧 {`${vendor?.email}`}</span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center"><p className="text-xl font-bold">{candidates_summary?.total_candidates??0}</p><p className="text-xs text-indigo-100">Candidates</p></div>
            <div className="text-center"><p className="text-xl font-bold">{dashboard_stats?.tests_completed??0}</p><p className="text-xs text-indigo-100">Completed</p></div>
            <div className="text-center"><p className="text-xl font-bold">{data?.credits??0}</p><p className="text-xs text-indigo-100">Credits</p></div>
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
          <ProgressBar value={Math.round((activeCandidates / totalCandidates) * 100)} showLabel={false} color="indigo" />
          <div className="text-xs text-gray-400 mt-1">{Math.round((activeCandidates / totalCandidates) * 100)}% of total</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Average Score</div>
          <div className="text-2xl font-bold text-gray-900">{avgScore || "—"}</div>
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
              <ProgressBar label="Tests Sent" value={Math.round((testsSent / totalCandidates) * 100)} color="indigo" />
              <ProgressBar label="Tests Completed" value={Math.round((testsCompleted / totalCandidates) * 100)} color="emerald" />
              <ProgressBar label="Pending Tests" value={Math.round(((testsSent - testsCompleted) / totalCandidates) * 100)} color="amber" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}