import { useState } from 'react'
import Header from '../../page/Header'
import { LeftScreen } from './Login'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAdminForgotPasswordMutation } from '../../redux/services/authApi';
import toast from 'react-hot-toast';

const AdminForgetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adminRequestOTP, { isLoading, isError, isSuccess }] = useAdminForgotPasswordMutation()
    const [formdata, setFormdata] = useState({
        email: "",
    })

    const [showPassword, setShowPassword] = useState(false);
    function changeHandler(e) {
        const { name, value } = e.target;
        setFormdata({
            ...formdata,
            [name]: value  
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log("formd",formdata)
        try {
            const result = await adminRequestOTP(formdata);
            // console.log("res", result)
            if (result?.data) {
                toast.success(result?.data?.message??"Admin Login Successfully..")
                setTimeout(() => {
                    navigate(`/admin/otp-verify?email=${result?.data?.email}`)
                }, 1000)
            }
            if (result?.error) {
                toast.error(result?.error?.data?.detail ?? "Invalid email or password")
                return null;
            }
        } catch (err) {
            // console.log("err", isError)
            toast.error(err?.data?.detail??"Error occurred..")
    }
}

    return (
        <div className='min-h-screen w-full bg-white flex flex-col'>
            <div className="flex flex-col md:flex-row  flex-1">
                {/* Left Section */}
                <LeftScreen />
                <form onSubmit={handleSubmit} className="flex-1 flex items-center justify-center py-10 bg-gray-50">
                    <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-4xl mb-2">🔑</span>
                            <h2 className="text-2xl font-bold text-blue-950">Admin Password Recovery
                            </h2>
                            <p className="text-gray-500 text-xs text-center mt-1">
                                Enter your registered email address to reset your password and regain access to your secure admin dashboard.                            </p>
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



                        <button type="submit" disabled={isLoading} className="w-full bg-[#1f5377] hover:bg-[#17415c] text-white py-2 rounded-lg font-semibold shadow">
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default AdminForgetPassword