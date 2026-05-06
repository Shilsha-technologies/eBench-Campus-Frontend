import { useSearchParams, useNavigate } from "react-router-dom";
import { useViewSubVendorDetailsQuery } from "../../../redux/services/vendorApi";
import { Eye } from "lucide-react";


const EmployeeView = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const { data, isLoading, isError } = useViewSubVendorDetailsQuery(id);

    if (isLoading) return <Loader />;
    if (isError) return <ErrorState />;

    const emp = data?.sub_vendor;
    const recentCandidates = data?.recent_candidates || [];

    const handleBack = () => {
        navigate(-1);
    };

    const handleViewAllCandidates = () => {
        navigate(`/vendor/candidates?sub_vendor_id=${id}`);
    };

    const handleToggleCandidateStatus = async (candidateId, currentStatus) => {
        // TODO: Implement API call to toggle candidate status
        console.log(`Toggle candidate ${candidateId} status to ${!currentStatus}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="mb-6 cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Header / Identity Block */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-lg bg-gray-900 text-white flex items-center justify-center text-lg font-semibold">
                            {emp?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 capitalize">
                                {emp.name}
                            </h1>
                            <p className="text-sm text-gray-500">{emp.email}</p>

                            <div className="flex gap-3 mt-2">
                                <StatusBadge active={emp.active} />
                                <MetaBadge text={emp.gender} />
                                <MetaBadge text={emp.country} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {/* <div className="flex gap-3">
            <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
              Edit
            </button>
            <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
              Suspend
            </button>
            <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div> */}
                </div>
                {/* Recent Candidates Section */}
                <div className="mt-4">
                    <Card title="Recent Candidates">
                        {recentCandidates.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-600">
                                        Showing {recentCandidates.length} recent candidates
                                    </p>
                                    <button
                                        onClick={handleViewAllCandidates}
                                        className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        View All Candidates →
                                    </button>
                                </div>

                                <div className="overflow-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="text-left px-4 py-3 font-medium">Name</th>
                                                <th className="text-left px-4 py-3 font-medium">Email</th>
                                                <th className="text-left px-4 py-3 font-medium">Mobile</th>
                                                <th className="text-left px-4 py-3 font-medium">Degree</th>
                                                <th className="text-left px-4 py-3 font-medium">Test</th>
                                                <th className="text-left px-4 py-3 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {recentCandidates.map((candidate) => (
                                                <tr key={candidate.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-gray-900">
                                                            {candidate.first_name} {candidate.last_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(candidate.created_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {candidate.email}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {candidate.mobile}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                                                            {candidate.degree}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${candidate.test_status === 'completed'
                                                                ? 'bg-green-100 text-green-700'
                                                                : candidate.test_status === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {candidate.test_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => navigate(`/vendor/candidates/${candidate.id}`)}
                                                                className="text-blue-600 text-center cursor-pointer hover:text-blue-800 text-sm font-medium"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-gray-500">
                                    No recent candidates found
                                </p>
                            </div>
                        )}
                    </Card>
                </div>


                {/* Layout */}
                <div className="grid grid-cols-12 gap-6 mt-6">

                    {/* LEFT — Sticky Profile */}
                    <div className="col-span-12 md:col-span-4 space-y-6">

                        <Card title="Employee Summary">
                            <Info label="Employee ID" value={emp.id} />
                            <Info label="Vendor ID" value={emp.vendor_id} />
                            <Info label="Plan" value={emp.plan_name || "Not Assigned"} />
                            <Info
                                label="Created"
                                value={new Date(emp.created_at).toLocaleString()}
                            />
                        </Card>

                        <Card title="Contact">
                            <Info label="Phone" value={emp.phone} />
                            <Info label="Address" value={emp.sub_vendor_address} />
                            <Info label="Country" value={emp.country} />
                        </Card>
                    </div>

                    {/* RIGHT — Detailed */}
                    <div className="col-span-12 md:col-span-8 space-y-6">

                        <Card title="Organization">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Info label="Company Address" value={emp.company_address} />
                                <Info label="Subscription Plan" value={emp.plan_name || "N/A"} />
                            </div>
                        </Card>

                        <Card title="Personal Information">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Info label="Full Name" value={emp.name} />
                                <Info label="Gender" value={emp.gender} />
                                <Info label="Email" value={emp.email} />
                                <Info label="Active Status" value={emp.active ? "Active" : "Inactive"} />

                            </div>
                        </Card>


                        <Card title="Assigned Subscriptions">
                            {emp?.assigned_subscriptions?.length ? (
                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="text-left px-4 py-3 font-medium">Country</th>
                                                <th className="text-left px-4 w-32 py-3 font-medium">Plan</th>
                                                <th className="text-left px-4 py-3 font-medium">
                                                    Subscription ID
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-blue-50">
                                            {emp.assigned_subscriptions.map((sub) => (
                                                <tr key={sub.subscription_id} className="hover:bg-gray-50">

                                                    {/* Country */}
                                                    <td className="px-4 py-3 text-xs capitalize font-medium text-gray-900">
                                                        {sub.country}
                                                    </td>

                                                    {/* Plan */}
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 text-center text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                                                            {sub.plan_name}
                                                        </span>
                                                    </td>

                                                    {/* Subscription ID */}
                                                    <td className="px-4 text-center text-xs py-3 text-gray-600 break-all">
                                                        {sub.subscription_id}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </Card>


                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------- UI COMPONENTS ---------- */

const EmptyState = () => (
    <div className="text-center py-10">
        <p className="text-sm text-gray-500">
            No subscriptions assigned to this employee
        </p>
    </div>
);

const Card = ({ title, children }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-wide">
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Info = ({ label, value }) => (
    <div className="flex flex-col gap-4 border-b border-gray-300 pb-3 last:border-none">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-[#405780]   wrap-break-word">
            {value || "N/A"}
        </p>
    </div>
);

const StatusBadge = ({ active }) => (
    <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
            }`}
    >
        {active ? "Active" : "Inactive"}
    </span>
);

const MetaBadge = ({ text }) => (
    <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full capitalize">
        {text}
    </span>
);

const Loader = () => (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading employee profile...</p>
    </div>
);

const ErrorState = () => (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-medium">
            Unable to load employee data
        </p>
    </div>
);

export default EmployeeView;