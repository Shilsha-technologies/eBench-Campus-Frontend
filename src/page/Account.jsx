import { useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/ebench_logo.png";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useLoginMutation } from "../redux/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/Slices/AuthSlice";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateAccount() {
  const [vendorData, setVendorData] = useState({
    email: "",
    password: "",
    module: "company"
  });
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!vendorData?.email || !vendorData?.password) {
      return toast.error("Please fill all required information.");
    }
    try {
      const formData = { ...vendorData };

      const result = await login(formData).unwrap();
      // console.log("rrees",result);
      dispatch(setCredentials({ token: result?.access_token, module: result?.module, user: result.role, detail: { name: result?.name, email: result?.email, id: result?.vendor_id, planName: result?.plan_name, status: result?.is_subscribed } }));
      // console.log("Login successful!");
      // debugger;
      navigate("/vendor/dashboard"); // redirect after login
    } catch (err) {
      toast.error(err?.data?.detail ?? "Internal Server Error")
      // console.error("Login failed:", err);
    }
  }



  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Role Selection */}

        {/* Left Section */}
        <motion.div className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full">
          <h1 className="text-3xl font-bold text-white mb-4">
            Empowering Your Career with <span className="text-white">eBench</span>
          </h1>
          <p className="text-white leading-relaxed">
            With eBench, manage vendor operations, collaborate efficiently, and
            streamline your recruitment process with AI-powered tools.
          </p>

          <div className="mt-8">
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                <span className="text-white">Global vendor network</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                <span className="text-white">Smart workflow automation</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                <span className="text-white">Insightful analytics</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
                <span className="text-white">AI-driven vendor management</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div className="flex-1 flex flex-col px-10 py-16 bg-[#f0f0f0] min-h-full">
          <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
            <img src={logo} alt="eBench Logo" className="w-40 mx-auto mb-6" />
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Login As */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login as
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Company */}
                  <label className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition
      ${vendorData.module === "company"
                      ? "border-[#286a94] bg-blue-50"
                      : "border-gray-300"}`}>

                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="module"
                        value="company"
                        checked={vendorData.module === "company"}
                        onChange={handleChange}
                        className="accent-[#286a94]"
                      />
                      <span className="font-medium text-gray-700">Company</span>
                    </div>

                    {vendorData.module === "company" && (
                      <span className="text-xs text-[#286a94] font-semibold">Selected</span>
                    )}
                  </label>

                  {/* Campus */}
                  <label className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition
      ${vendorData.module === "campus"
                      ? "border-[#286a94] bg-blue-50"
                      : "border-gray-300"}`}>

                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="module"
                        value="campus"
                        checked={vendorData.module === "campus"}
                        onChange={handleChange}
                        className="accent-[#286a94]"
                      />
                      <span className="font-medium text-gray-700">Campus</span>
                    </div>

                    {vendorData.module === "campus" && (
                      <span className="text-xs text-[#286a94] font-semibold">Selected</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={vendorData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Password Field with Eye Icon */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={vendorData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#286a94] text-white font-medium py-2 rounded-lg transition"
              >
                {isLoading ? "Processing..." : "Login"}
              </button>

              {/* Signup Link */}
              <p className="text-center text-gray-600 text-sm">
                Don’t have a vendor account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Signup
                </Link>
              </p>
            </form>
          </div>
        </motion.div>


      </div>
    </div>
  );
}
