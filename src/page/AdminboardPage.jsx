
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageLoader from "../libs/PageLoader";
import { useAdminDashboardQuery } from "../redux/services/adminApi";

export default function Dashboard() {
  const navigate = useNavigate()
  // Simulating fetch from API
  const { data, isLoading, isError } = useAdminDashboardQuery();

  if (isLoading) return <PageLoader />

  if (isError) {
    return <>Something went wrong</>
  }
  const { overview, vendors, subscription_plans, activity } = data;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl text-blue-900 font-bold mb-6">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-blue-900 mb-8">
        <Card title="Total Vendors" value={overview.total_vendors} />
        <Card title="Verified Vendors" value={overview.verified_vendors} />
        <Card title="Active Vendors" value={overview.active_vendors} />
        <Card title="Disabled Vendors" value={overview.disabled_vendors} />
        <Card title="Total Candidates" value={overview.total_candidates} />
        <Card title="Total Tests" value={overview.total_tests} />
        <Card title="Active Subscriptions" value={overview.active_subscriptions} />
        <Card title="Total Revenue" value={`$${overview.total_revenue}`} />
      </div>

      <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <div className="flex justify-between">
          <div className="text-xl font-semibold text-[#286a94] mb-4">Recent Vendor</div>
          <button
            onClick={() => navigate('/admin/vendor-management')}
            className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4">Remaining Credits</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {vendors && vendors.length > 0 ? (
                vendors.map((user, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-4">{user?.name || ''}</td>
                    <td className="py-3 px-4">{user?.email || ''}</td>
                    <td className="py-3 px-4">{user?.country}</td>
                    <td className="py-3 px-4">{user.is_verified ? "✅" : "❌"}</td>
                    <td className="py-3 px-4">{user.active ? "✅" : "❌"}</td>
                    <td className="py-3 px-4">
                      {user?.remaining_credits ?? '0'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Subscription Plans */}
      <Section title="Subscription Plans">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subscription_plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
            >

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Duration:</span>{" "}
                  {plan.duration_days} days
                </p>
                <p>
                  <span className="font-medium text-gray-900">Credits:</span>{" "}
                  {plan.credits}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Amount:</span>{" "}
                  {plan.price}{" "}{plan.currency}
                </p>
              </div>

              {/* Price */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xl font-bold text-blue-900">
                  {plan.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>


      {/* Activity */}
      <Section title="Activity">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card title="Links Sent" value={activity.links_sent} />
          <Card title="Tests Completed" value={activity.tests_completed} />
          <Card title="Tests Pending" value={activity.tests_pending} />
        </div>
      </Section>
    </div>
  );
}

// Small reusable Card
const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center">
    <p className="text-gray-500">{title}</p>
    <p className="text-xl font-semibold">{value ?? "-"}</p>
  </div>
);

// Section Wrapper
const Section = ({ title, children }) => (
  <section className="mb-10 rounded-xl bg-white border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-3 mb-6">
      <span className="h-7 w-1.5 rounded-full bg-blue-300" />
      <h2 className="text-xl font-semibold text-[#286a94] tracking-tight">
        {title}
      </h2>
    </div>

    <div className="text-sm text-gray-600 leading-relaxed">
      {children}
    </div>
  </section>
);

