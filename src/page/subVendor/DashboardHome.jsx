// import { useSubvendorDashboardApiQuery } from "../../redux/services/subvendorApi";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

// const DashboardContent = () => {
//   const navigate=useNavigate()

//   const {data,isLoading,isError} = useSubvendorDashboardApiQuery()
//   console.log("dashaboard-details",data);

//   const recentCredits = data?.credits_summary?.plans;
//   const recentUsers = data?.recent_candidates;
//   const lineChartData = data?.charts?.lineChartData ?? []
//   const userData = data?.charts?.barChartData ?? []
//   const statsCards = [
//     { title: 'Credits Left', value: data?.stats?.credits_remaining ?? 0 },
//     { title: 'Credit Used', value: data?.stats?.credits_used ?? 0 },
//     { title: 'Total Candidates', value: data?.stats?.total_candidates??0 },
//     { title: 'Total Test', value: data?.stats?.total_tests },
//   ];

//   if(isLoading){
//     return <>Loading</>
//   }

//   return (
//     <div className="min-h-screen bg-[#fafafa] p-6 pt-5 font-inter text-gray-800">
      
//             {/* ---------------------- STATS CARDS ---------------------- */}
//             <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//               {statsCards.map((card, index) => (
//                 <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
//                   <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//                     <p className="text-gray-400 text-xs tracking-wide mb-1 uppercase">{card.title}</p>
//                     <h3 className="text-2xl font-semibold text-[#286a94]">{card.value}</h3>
//                   </div>
//                 </motion.div>
//               ))}
//             </section>
      
//             <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
//               <div className="flex justify-between">
//                 <div className="text-xl font-semibold text-[#286a94] mb-4">Recently Assigned Subscription</div>
//                 {/* <button
//                   onClick={() => navigate('/subvendor/subscription/view')}
//                   className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button> */}
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-left border-collapse">
//                   <thead className="bg-gray-50 text-gray-500 text-sm">
//                     <tr>
//                       <th className="py-3 px-4">Plan Name</th>
//                       <th className="py-3 px-4">Country</th>
//                       <th className="py-3 px-4">Remaining Credit</th>
//                       <th className="py-3 px-4">Start Date</th>
//                       <th className="py-3 px-4">End Date</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {recentCredits && recentCredits.length > 0 ? (
//                       recentCredits.map((user, i) => (
//                         <tr
//                           key={i}
//                           className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                             } hover:bg-gray-100 transition`}
//                         >
//                           <td className="py-3 px-4">{user?.plan_name || ''}</td>
//                           <td className="py-3 px-4">{user?.country || ''}</td>
//                           <td className="py-3 px-4">{user?.remaining_credits}</td>
//                           <td className="py-3 px-4">
//                             {user?.started_at
//                               ? new Date(user.started_at).toLocaleString()
//                               : ''}
//                           </td>
//                           <td className="py-3 px-4">
//                             {user?.expires_at
//                               ? new Date(user.expires_at).toLocaleString()
//                               : ''}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan={5}
//                           className="py-4 px-4 text-center text-gray-500"
//                         >
//                           No data found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </motion.div>
      
      
//             {/* ---------------------- RECENT USERS TABLE ---------------------- */}
//             <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//               <div className="flex justify-between">
//                 <h3 className="text-xl font-semibold text-[#286a94] mb-4">Recently Added Candidates</h3>
//                 <button
//                   onClick={() => navigate('/subvendor/user-management')}
//                   className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button>
      
//               </div>
      
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-left border-collapse">
//                   <thead className="bg-gray-50 text-gray-500 text-sm">
//                     <tr>
//                       <th className="py-3 px-4">Name</th>
//                       <th className="py-3 px-4">Email</th>
//                       <th className="py-3 px-4">Country</th>
//                       <th className="py-3 px-4">Created At</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {recentUsers && recentUsers.length > 0 ? (
//                       recentUsers.map((user, i) => (
//                         <tr
//                           key={i}
//                           className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                             } hover:bg-gray-100 transition`}
//                         >
//                           <td className="py-3 px-4">{`${user?.first_name} ${user?.last_name}`}</td>
//                           <td className="py-3 px-4">{user.email}</td>
//                           <td className="py-3 px-4">{user.country}</td>
//                           <td className="py-3 px-4">
//                             {new Date(user?.created_at).toLocaleString()}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="py-4 px-4 text-center text-gray-500"
//                         >
//                           No data found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
      
//                 </table>
//               </div>
//             </motion.div>
      
      
//             {/* ---------------------- BAR GRAPH ---------------------- */}
//             <section className="flex justify-between mt-10">
//               <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
//                 <h3 className=" font-semibold text-[#286a94] mb-4">Monthly Users & Credits</h3>
//                 {
//                   userData?.length > 0 ?
//                   <div className="w-full h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={userData} barSize={25}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="users" fill="#1a80bb" radius={[6, 6, 0, 0]} />
//                         <Bar dataKey="credits" fill="#ea801c" radius={[6, 6, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>:<div className=" text-sm">N/A</div>
//                 }
      
//               </motion.div>
      
//               {/* ---------------------- LINE GRAPH ---------------------- */}
//               <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
//                 <h3 className=" font-semibold text-[#286a94] mb-4">New Users Growth</h3>
//                 {
//                   lineChartData?.length > 0 ?
//                   <div className="w-full h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={lineChartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="newUsers" stroke="#286a94" strokeWidth={3} dot={{ r: 5 }} />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>:<div className=" text-sm">N/A</div>
//                 }
//               </motion.div>
      
      
//             </section>
      
//     </div>
//   );
// };

// export default DashboardContent;


//================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── Mock Data ──────────────────────────────────────────────────────────────
const employee = {
  name: "Arjun Sharma",
  id: "EMP-20241",
  designation: "Senior HR Manager",
  department: "Human Resources",
  avatar: "AS",
  company: "eBench Campus",
  branch: "Mumbai, India",
};

const stats = [
  { label: "Total Candidates", value: 248, icon: "👥", color: "from-blue-500 to-blue-600", light: "bg-blue-50 text-blue-600" },
  { label: "Tests Sent", value: 192, icon: "📩", color: "from-indigo-500 to-indigo-600", light: "bg-indigo-50 text-indigo-600" },
  { label: "Tests Completed", value: 156, icon: "✅", color: "from-emerald-500 to-emerald-600", light: "bg-emerald-50 text-emerald-600" },
  { label: "Pending Tests", value: 36, icon: "⏳", color: "from-amber-500 to-amber-600", light: "bg-amber-50 text-amber-600" },
  { label: "Active Plan", value: "Pro", icon: "💳", color: "from-purple-500 to-purple-600", light: "bg-purple-50 text-purple-600" },
  { label: "Remaining Credits", value: 52, icon: "🎯", color: "from-rose-500 to-rose-600", light: "bg-rose-50 text-rose-600" },
];

const candidates = [
  { name: "Priya Mehta", email: "priya@email.com", mobile: "+91 9823456701", status: "Completed", score: 87, statusColor: "bg-emerald-100 text-emerald-700" },
  { name: "Rohan Verma", email: "rohan@email.com", mobile: "+91 9823456702", status: "Pending", score: null, statusColor: "bg-amber-100 text-amber-700" },
  { name: "Sneha Gupta", email: "sneha@email.com", mobile: "+91 9823456703", status: "Completed", score: 72, statusColor: "bg-emerald-100 text-emerald-700" },
  { name: "Amit Tiwari", email: "amit@email.com", mobile: "+91 9823456704", status: "Link Sent", score: null, statusColor: "bg-blue-100 text-blue-700" },
  { name: "Kavita Nair", email: "kavita@email.com", mobile: "+91 9823456705", status: "Completed", score: 94, statusColor: "bg-emerald-100 text-emerald-700" },
  { name: "Dev Pandey", email: "dev@email.com", mobile: "+91 9823456706", status: "Failed", score: 41, statusColor: "bg-rose-100 text-rose-700" },
];

const performanceData = [
  { name: "Jan", score: 68 }, { name: "Feb", score: 74 }, { name: "Mar", score: 71 },
  { name: "Apr", score: 85 }, { name: "May", score: 79 }, { name: "Jun", score: 92 },
];

const monthlyTests = [
  { name: "Jan", sent: 28, completed: 22 }, { name: "Feb", sent: 34, completed: 28 },
  { name: "Mar", sent: 29, completed: 24 }, { name: "Apr", sent: 41, completed: 35 },
  { name: "May", sent: 38, completed: 30 }, { name: "Jun", sent: 47, completed: 40 },
];

const passFailData = [
  { name: "Pass", value: 68, color: "#10b981" },
  { name: "Fail", value: 18, color: "#f43f5e" },
  { name: "Pending", value: 14, color: "#f59e0b" },
];

const completionData = [
  { name: "Week 1", rate: 72 }, { name: "Week 2", rate: 81 }, { name: "Week 3", rate: 78 },
  { name: "Week 4", rate: 89 }, { name: "Week 5", rate: 85 }, { name: "Week 6", rate: 93 },
];

const activities = [
  { type: "added", icon: "👤", msg: "Priya Mehta added as candidate", time: "2 min ago", color: "bg-blue-100 text-blue-600" },
  { type: "sent", icon: "📩", msg: "Test link sent to Rohan Verma", time: "18 min ago", color: "bg-indigo-100 text-indigo-600" },
  { type: "result", icon: "📊", msg: "Result published for Kavita Nair — 94%", time: "1 hr ago", color: "bg-emerald-100 text-emerald-600" },
  { type: "renew", icon: "🔄", msg: "Pro subscription auto-renewed", time: "2 days ago", color: "bg-purple-100 text-purple-600" },
  { type: "added", icon: "👤", msg: "Dev Pandey added as candidate", time: "3 days ago", color: "bg-blue-100 text-blue-600" },
];

const notifications = [
  { icon: "⚠️", title: "Subscription Expiring Soon", desc: "Pro plan expires in 12 days. Renew now.", color: "border-l-amber-400 bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  { icon: "🕒", title: "Pending Candidate Tests", desc: "36 candidates haven't completed their tests.", color: "border-l-blue-400 bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  { icon: "📋", title: "New Result Available", desc: "Sneha Gupta's test result is ready to view.", color: "border-l-emerald-400 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
];

const quickActions = [
  { label: "View Candidate", icon: "👥", color: "bg-blue-600 hover:bg-blue-700", textColor: "text-white",to:'/subvendor/user-management' },
  // { label: "Send Test Link", icon: "📩", color: "bg-indigo-600 hover:bg-indigo-700", textColor: "text-white" },
  { label: "View Results", icon: "📊", color: "bg-emerald-600 hover:bg-emerald-700", textColor: "text-white",to:'/subvendor/result-management' },
  // { label: "Subscription", icon: "💳", color: "bg-purple-600 hover:bg-purple-700", textColor: "text-white" },
  // { label: "Candidate List", icon: "👥", color: "bg-slate-700 hover:bg-slate-800", textColor: "text-white" },
  { label: "View Profile", icon: "📅", color: "bg-rose-600 hover:bg-rose-700", textColor: "text-white",to:'/subvendor/profile' },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function useDateTime() {
  const [dt, setDt] = useState(new Date());

  useEffect(() => { 
    const id = setInterval(() => setDt(new Date()), 1000); 
    return () => clearInterval(id); }, []);
  return dt;
}

function greeting(hour) {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function Avatar({ initials, size = "md" }) {
  const s = size === "lg" ? "w-14 h-14 text-lg" : size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${s} rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0`}>
      {initials}
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${stat.light} flex items-center justify-center text-xl shrink-0`}>
        {stat.icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-slate-800">{children}</h2>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const dt = useDateTime();
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F4F9FF] to-[#E6F1FB] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        body, .font-sans { font-family: 'Sora', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { animation: fadeSlideUp 0.4s ease both; }
        .anim-1 { animation-delay: 0.05s; }
        .anim-2 { animation-delay: 0.10s; }
        .anim-3 { animation-delay: 0.15s; }
        .anim-4 { animation-delay: 0.20s; }
        .anim-5 { animation-delay: 0.25s; }
        .anim-6 { animation-delay: 0.30s; }
        .progress-bar { transition: width 1s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div className="max-w-7xl mx-auto  sm:px-8 lg:px-2  space-y-8">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <div className="anim bg-white rounded-3xl shadow-lg border border-[#B5D4F4] overflow-hidden">
          <div className="bg-linear-to-r from-[#042C53] to-[#185FA5] px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left: Greeting + Employee Info */}
              <div className="flex items-center gap-4">
                <Avatar initials={employee.avatar} size="lg" />
                <div>
                  <p className="text-blue-200 text-xs font-medium mb-0.5">
                    {greeting(dt.getHours())} 👋
                  </p>
                  <h1 className="text-white text-xl font-bold leading-tight">{employee.name}</h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                    <span className="text-blue-100 text-xs">🪪 {employee.id}</span>
                    <span className="text-blue-100 text-xs">💼 {employee.designation}</span>
                    <span className="text-blue-100 text-xs">🏢 {employee.department}</span>
                  </div>
                </div>
              </div>

              {/* Right: Company + Time */}
              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">N</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{employee.company}</p>
                    <p className="text-blue-200 text-xs">📍 {employee.branch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg tabular-nums">
                    {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </p>
                  <p className="text-blue-200 text-xs">
                    {dt.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-8 py-6 bg-[#F4F9FF]/80">
            <p className="text-sm font-semibold text-[#042C53] uppercase tracking-wider mb-4">Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => navigate(a.to)}
                  className={`${a.color} cursor-pointer ${a.textColor} px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-150 hover:scale-105 active:scale-95 shadow-md`}>
                  <span>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS CARDS ─────────────────────────────────────── */}
        <div className="anim anim-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-[#B5D4F4] hover:shadow-xl transition-shadow duration-300 flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl ${s.light} flex items-center justify-center text-xl shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-[#042C53]">{s.value}</p>
                <p className="text-xs text-[#378ADD] mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── NOTIFICATIONS & ACTIVITY ───────────────────────────── */}
        <div className="anim anim-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications Panel */}
          <div className="bg-white rounded-3xl shadow-lg border border-[#B5D4F4] p-8">
            {/* <SectionTitle sub="Alerts & reminders">Notifications</SectionTitle> */}
            {/* <div className="space-y-4">
              {notifications.map((n, i) => (
                <div key={i} className={`${n.color} border-l-4 rounded-r-2xl p-5`}>
                  <div className="flex items-start gap-4">
                    <span className="text-xl mt-1">{n.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#042C53] text-base">{n.title}</p>
                      <p className="text-[#378ADD] text-sm mt-1 leading-relaxed">{n.desc}</p>
                      <button className={`mt-3 ${n.badge} text-sm px-4 py-2 rounded-xl font-medium hover:opacity-80 transition`}>Take Action</button>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Activity Feed */}
            <div className="border-[#B5D4F4]">
              <SectionTitle sub="What happened recently">Recent Activity</SectionTitle>
    
              <div className="space-y-4 ">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${a.color} rounded-full flex items-center justify-center text-sm shrink-0`}>{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#042C53] font-medium leading-snug">{a.msg}</p>
                      <p className="text-sm text-[#378ADD] mt-1">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats & Info */}
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="bg-white rounded-3xl shadow-lg border border-[#B5D4F4] p-8">
              <SectionTitle sub="Your performance at a glance">Performance Overview</SectionTitle>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-[#F4F9FF] rounded-2xl">
                  <div className="text-4xl font-bold text-[#185FA5]">87%</div>
                  <div className="text-sm text-[#378ADD] mt-2">Avg Test Score</div>
                </div>
                <div className="text-center p-6 bg-[#E6F1FB] rounded-2xl">
                  <div className="text-4xl font-bold text-[#185FA5]">156</div>
                  <div className="text-sm text-[#378ADD] mt-2">Tests Completed</div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-3xl shadow-lg border border-[#B5D4F4] p-8">
              <SectionTitle sub="Your latest accomplishments">Recent Achievements</SectionTitle>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <p className="font-semibold text-[#042C53]">Top Performer</p>
                    <p className="text-sm text-[#378ADD]">Highest completion rate this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <p className="font-semibold text-[#042C53]">Perfect Score</p>
                    <p className="text-sm text-[#378ADD]">5 candidates scored 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW ──────────────────────────────────────── */}
        <div className="anim anim-3 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Performance Chart */}
          <div className="bg-white rounded-3xl shadow-lg border border-[#B5D4F4] p-8">
            <SectionTitle sub="Average score per month">Performance Trend</SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={performanceData} margin={{ top: 8, right: 16, left: -32, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B5D4F4" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#378ADD" }} />
                <YAxis tick={{ fontSize: 12, fill: "#378ADD" }} domain={[60, 100]} />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="score" stroke="#185FA5" strokeWidth={3} dot={{ r: 5, fill: "#185FA5" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Tests Chart */}
          <div className="bg-white rounded-3xl shadow-lg border border-[#B5D4F4] p-8">
            <SectionTitle sub="Sent vs Completed">Monthly Test Activity</SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyTests} margin={{ top: 8, right: 16, left: -32, bottom: 0 }} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B5D4F4" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#378ADD" }} />
                <YAxis tick={{ fontSize: 12, fill: "#378ADD" }} />
                <Tooltip contentStyle={{ fontSize: 13, borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="sent" fill="#378ADD" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" fill="#185FA5" radius={[6, 6, 0, 0]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── SUBSCRIPTION SECTION ────────────────────────────── */}
        <div className="anim anim-4 bg-white rounded-3xl shadow-lg border border-[#B5D4F4] overflow-hidden">
          <div className="px-8 pt-8 pb-6 flex items-start justify-between">
            <SectionTitle sub="Your current plan details">Subscription Overview</SectionTitle>
            <span className="px-4 py-2 bg-[#185FA5] text-white text-sm font-bold rounded-full">PRO</span>
          </div>
          <div className="px-8 pb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8">
            {[
              { label: "Plan Name", value: "Pro Annual", icon: "💳" },
              { label: "Valid Till", value: "12 May 2025", icon: "📅" },
              { label: "Candidate Limit", value: "300", icon: "👥" },
              { label: "Used Credits", value: "248", icon: "🔴" },
              { label: "Remaining", value: "52", icon: "🟢" },
              { label: "Renewal", value: "Auto", icon: "🔄" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 bg-[#F4F9FF] rounded-2xl">
                <p className="text-sm text-[#378ADD] font-medium">{item.icon} {item.label}</p>
                <p className="font-bold text-[#042C53] text-lg">{item.value}</p>
              </div>
            ))}
          </div>
          {/* Progress */}
          <div className="px-8 pb-8">
            <div className="flex justify-between text-sm text-[#378ADD] mb-3">
              <span>Credit Usage</span>
              <span className="font-semibold text-[#042C53]">248 / 300 used</span>
            </div>
            <div className="h-4 bg-[#E6F1FB] rounded-full overflow-hidden">
              <div className="progress-bar h-full rounded-full bg-linear-to-r from-[#185FA5] to-[#378ADD]" style={{ width: "82.7%" }} />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-[#378ADD]">82.7% used</span>
              <span className="text-amber-600 font-medium">⚠️ 52 credits remaining</span>
            </div>
          </div>
          <div className="px-8 pb-8 flex gap-4">
            <button className="px-6 py-3 bg-[#185FA5] hover:bg-[#0C447C] text-white text-base font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg">
              Upgrade Plan
            </button>
            <button className="px-6 py-3 bg-[#F4F9FF] hover:bg-[#E6F1FB] text-[#042C53] text-base font-semibold rounded-2xl transition border border-[#B5D4F4]">
              View Invoice
            </button>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <div className="anim anim-5 text-center text-sm text-[#378ADD] pb-6">
          © 2024 eBench Campus · Employee Dashboard · All rights reserved
        </div>

      </div>
    </div>
  );
}