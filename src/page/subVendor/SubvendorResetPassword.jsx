import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
   useSubVendorResetPasswordApproveMutation,
   useSubVendorResetPasswordMutation
} from "../../redux/services/subvendorApi";

const StudentResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [changePassword, { isLoading }] =
    useSubVendorResetPasswordApproveMutation();
  const [resendOtp, { isLoading: resendLoading }] =
    useSubVendorResetPasswordMutation();

  const [showPass, setShowPass] = useState(false);
  const [timer, setTimer] = useState(0);           
  const navigate=useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
      otp: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const password = watch("new_password");

  // cooldown timer for resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // submit handler
  const onSubmit = async (data) => {
    const formdata = new FormData();
    formdata.append("email", data.email);
    formdata.append("otp", data.otp);
    formdata.append("new_password", data.new_password);
    formdata.append("confirm_password", data.confirm_password);

    try {
      const result = await changePassword(formdata);

      if (result?.error) {
        return toast.error(result?.error?.data?.detail);
      }
      if(result?.data){
        const {access_token,name,role,sub_vendor_id,vendor_id}=result?.data
        localStorage.setItem('token',access_token)
        localStorage.setItem('name',name)
        localStorage.setItem('role',role)
        localStorage.setItem('subvendorId',sub_vendor_id)
        localStorage.setItem('vendorId',vendor_id)
        setTimeout(() => {
          navigate('/subvendor/dashboard')
        },500)
      }

      toast.success("Password reset successful 🎉");
    } catch (err) {
      toast.error(err?.data?.message ?? "Internal Server Error");
    }
  };

  // resend OTP handler
  const handleResendOtp = async () => {
    try {
      const formdata=new FormData()
      formdata.append('email',email)
      const res = await resendOtp(formdata);

      if (res?.error) {
        return toast.error(res?.error?.data?.detail);
      }

      toast.success("OTP resent successfully");
      setTimer(60); // 60 sec cooldown
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  
  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-[#0f3c55] to-[#286a94] text-white flex-col justify-center px-14">
        <h1 className="text-4xl font-bold leading-snug mb-4">
          Reset & Get Back to Opportunities 🎓
        </h1>

        <p className="text-lg opacity-90">
          Your next internship, startup role, or dream job is waiting.
          Verify your email and continue your journey.
        </p>
      </div>

      {/* RIGHT SIDE – FORM */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-2 text-center">
            Verify & Reset Password
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter OTP sent to your email and set a new password
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <input
              type="email"
              disabled
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-blue-50"
            />

            {/* OTP */}
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                {...register("otp", {
                  required: "OTP is required",
                  minLength: {
                    value: 4,
                    message: "OTP must be at least 4 digits",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg tracking-widest text-center font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* Resend OTP */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || resendLoading}
                className="text-sm text-indigo-600 font-medium disabled:opacity-50"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="New password"
                  {...register("new_password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters required",
                    },     
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2 cursor-pointer text-sm text-indigo-600"
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirm_password", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={isLoading}
              className="w-full py-2.5 bg-[#397799] hover:bg-[#5498bd] text-white rounded-lg font-semibold transition flex justify-center items-center"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Save"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Secure reset powered by campus verification
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentResetPassword;


// const StudentResetPassword = () => {
//   const [searchParams]=useSearchParams();
//   const email=searchParams.get('email')
//   const [form, setForm] = useState({
//     email: email,
//     otp: "",
//     new_password: "",
//     confirm_password: "",
//   });
//   const [changePassword,{isLoading}] = useSubVendorChangePasswordMutation();

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPass, setShowPass] = useState(false);

//   const handleChange = async(e) => {
//     setError("");
//     setSuccess("");
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formdata=new FormData();
//     formdata.append('email',form.email)
//     formdata.append('otp',form.otp)
//     formdata.append('new_password',form.new_password)
//     formdata.append('confirm_password',form.confirm_password)
    
//     try{
//       const result=await changePassword(formdata);
//       if(result?.error){
//         return toast.error(result?.error?.data?.detail)
//       }
//       console.log(result,"popopopopopo")
//     }catch(err){
//       toast.error(err?.data?.message??"Internal Server Error")
//     }

//   };

//   return (
//     <div className="min-h-screen flex">

//       {/* LEFT SIDE – STUDENT BRAND SECTION */}
//       <div className="hidden lg:flex w-1/2 bg-linear-to-br from-[#0f3c55] to-[#286a94]  text-white flex-col justify-center px-14">

//         <h1 className="text-4xl font-bold leading-snug mb-4">
//           Reset & Get Back to Opportunities 🎓
//         </h1>

//         <p className="text-lg opacity-90">
//           Your next internship, startup role, or dream job is waiting.
//           Verify your email and continue your journey.
//         </p>

//         <div className="mt-10 space-y-4 text-sm opacity-90">
//           <p>🚀 5000+ internships</p>
//           <p>🏢 Top startups hiring</p>
//           <p>🎯 Campus-focused job matches</p>
//         </div>
//       </div>

//       {/* RIGHT SIDE – FORM */}
//       <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">

//         <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

//           <h2 className="text-2xl font-bold mb-2 text-center">
//             Verify & Reset Password
//           </h2>

//           <p className="text-sm text-gray-500 text-center mb-6">
//             Enter OTP sent to your email and set a new password
//           </p>

//           {error && (
//             <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="bg-green-100 text-green-600 p-3 rounded-lg text-sm mb-4">
//               {success}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">

//             {/* Email */}
//             <input
//               type="email"
//               name="email"
//               placeholder="College email ID"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 disabled:bg-blue-50 focus:ring-indigo-500 outline-none"
//               required
//               disabled
//             />

//             {/* OTP */}
//             <input
//               type="text"
//               name="otp"
//               placeholder="Enter OTP"
//               value={form.otp}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg tracking-widest text-center font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
//               required
//             />

//             {/* Password */}
//             <div className="relative">
//               <input
//                 type={showPass ? "text" : "password"}
//                 name="new_password"
//                 placeholder="New password"
//                 value={form.new_password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 required
//               />
//               <span
//                 onClick={() => setShowPass(!showPass)}
//                 className="absolute right-3 top-2 cursor-pointer text-sm text-indigo-600"
//               >
//                 {showPass ? "Hide" : "Show"}
//               </span>
//             </div>

//             {/* Confirm Password */}
//             <input
//               type="password"
//               name="confirm_password"
//               placeholder="Confirm password"
//               value={form.confirm_password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//               required
//             />

//             {/* Submit */}
//             <button
//               disabled={isLoading}
//               className="w-full py-2.5 bg-[#397799] hover:bg-[#5498bd] text-white rounded-lg font-semibold transition flex justify-center items-center"
//             >
//               {isLoading ? (
//                 <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
//               ) : (
//                 "Save"
//               )}
//             </button>

//             <p className="text-xs text-gray-400 text-center">
//               Secure reset powered by campus verification
//             </p>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentResetPassword;