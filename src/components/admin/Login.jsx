import { useState } from "react";
import { useAdminLoginMutation } from "../../redux/services/adminApi";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adminLogin, { isLoading, isError, isSuccess }] = useAdminLoginMutation()
    const [formdata, setFormdata] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false);
    function changeHandler(e) {
        const { name, value } = e.target;
        // console.log("e.taer", name, value)
        setFormdata({
            ...formdata,
            [name]: value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // debugger;
        try {
            const result = await adminLogin(formdata);
            // console.log("res", result)
            if (result?.data) {
                toast.success("Admin Login Successfully..")
                // dispatch(setCredentials({ token: result?.access_token, user: result.role,detail:{name:result?.name,email:result?.email,id:result?.vendor_id} }));
                dispatch(setCredentials({ token: result?.data?.access_token, user: result?.data?.role,detail:{name:result?.data?.name,email:result?.data?.email} }));
                setTimeout(() => {
                    navigate('/admin/dashboard')
                }, 1000)
            }
            if (result?.error) {
                toast.error(result?.error?.data?.detail ?? "Invalid email or password")
                return null;
            }
        } catch (err) {
            // console.log("err", isError)
            toast.error(err?.data?.details??"Error occurred..")
        }
    }

    return (
        <div className="min-h-screen w-full bg-white flex flex-col">
            <div className="flex flex-col md:flex-row  flex-1">
                {/* Left Section */}
                <LeftScreen/>

                {/* Right Section - Login */}
                <form onSubmit={handleSubmit} className="flex-1 flex items-center justify-center py-10 bg-gray-50">
                    <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-4xl mb-2">🔑</span>
                            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Access your secure admin dashboard
                            </p>
                        </div>

                        {/* Email */}
                        <div className="mb-5">
                            <label className="block text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                required={true}
                                onChange={changeHandler}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    required={true}
                                    onChange={changeHandler}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>

                        </div>

                        {/* Button */}
                        <button type="submit" disabled={isLoading} className="w-full bg-[#1f5377] hover:bg-[#17415c] text-white py-2 rounded-lg font-semibold shadow">
                            {isLoading ? 'Logging...' : 'Log In'}
                        </button>

                        <p onClick={() => navigate('/admin/forget-password')} className="text-center text-sm text-gray-500 mt-4 cursor-pointer hover:underline">
                            Forgot your password?
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}



export const LeftScreen = () => {
  return (
    <div className="flex-1 bg-[#1f5377] flex flex-col justify-center text-white px-10 py-16 pt-20">
                    <h1 className="text-3xl font-bold mb-6">
                        Empowering <span className="text-yellow-300">Admin Excellence</span>
                    </h1>

                    <p className="text-white/90 mb-10 max-w-xl">
                        Streamline, supervise, and scale your recruitment ecosystem. Manage every
                        candidate, client, and vendor — all in one smart platform.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                        {/* Card 1 */}
                        <div className="bg-[#31668a] p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-1">Real-time Insights</h3>
                            <p className="text-white/80 text-sm">
                                Get live analytics and actionable hiring data.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#31668a] p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-1">Workflow Control</h3>
                            <p className="text-white/80 text-sm">
                                Oversee operations and approvals effortlessly.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#31668a] p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-1">Secure Access</h3>
                            <p className="text-white/80 text-sm">
                                Enterprise‑grade security for your team and data.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-[#31668a] p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-1">Optimized Performance</h3>
                            <p className="text-white/80 text-sm">
                                Fast, intuitive, and scalable admin operations.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 p-4 bg-[#31668a] rounded-lg max-w-xl">
                        <p className="text-white/90 text-sm">
                            Take control. Drive decisions with data and empower your team to achieve
                            more with eBench.
                        </p>
                    </div>
                </div>
  )
}

