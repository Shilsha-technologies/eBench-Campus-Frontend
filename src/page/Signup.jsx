import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";

import Select from "react-select";

import { Eye, EyeOff } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import { Logo } from "../components/landing/Navbar";

import { FormField, inputClass } from "../libs/Divider";

import { useSignupMutation } from "../redux/services/authApi";

import { useGetCountryDataQuery } from "../redux/services/externalApi";

import { validateEmailByRole, getEmailPlaceholder } from "../utils/emailValidation";

function SignupPage({ nav }) {

    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);

    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [signup, { isLoading }] = useSignupMutation();

    const { data: countryList } = useGetCountryDataQuery();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const {

        register,

        handleSubmit,

        watch,

        control,

        setValue,

        formState: { errors },

    } = useForm({

        defaultValues: {

            module: "student",

            name: "",

            email: "",

            password: "",

            confirm_password: "",

            country: null,

        },

    });

    const watchedModule = watch("module");

    const watchedPassword = watch("password");

    // Clear email field when role changes to prevent confusion
    useEffect(() => {
        if (watchedModule) {
            setValue("email", "");
        }
    }, [watchedModule, setValue]);

    // Build react-select options from country list

    const countryOptions = (countryList?.data || []).map((c) => ({

        value: c,

        searchLabel: c.name,

        label: (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img

                    src={c.flag ?? ""}

                    alt={c.name}

                    style={{ width: 20, height: 14, objectFit: "cover" }}

                />
                <span>{c.name}</span>
            </div>

        ),

    }));

    const trialPerks = {

        student: "500 Free Application Tests · Internship Opportunities · Training Programs · Job Placement Support",

        campus: "500 Free Given Credits",

    };

    const onSubmit = async (data) => {

        const payload = {

            name: data.name,

            email: data.email,

            password: data.password,

            confirm_password: data.confirm_password,

            country: data.country?.value?.name || "",

            module: data.module,

        };

        try {

            const result = await signup(payload).unwrap();

            if (result?.status) {

                toast.success("Signup successfully!");

                setTimeout(() => {

                    navigate(`/otp-verify?email=${result?.email}`);

                }, 1000);

            }

        } catch (err) {

            toast.error(err?.data?.detail || "Unable to signup");

        }

    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#F0F7FF] to-[#EBF4FD] flex items-center justify-center p-8">
            <div className="flex max-w-5xl w-full rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(43,127,255,0.15)]">

                {/* ── Left Panel ── */}
                <div className="flex-1 min-w-[320px] bg-linear-to-b from-[#0F2744] to-[#1A3F6E] p-12 flex flex-col">
                    <Logo nav={nav} />
                    <div className="h-8" />

                    <div className="bg-blue-500/18 border border-blue-500/30 rounded-2xl p-5 mb-7">
                        <div className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-wider">

                            🎉 Free Trial Included
                        </div>
                        <div className="text-2xl font-extrabold text-white mb-1">1 Month Free</div>
                        <div className="text-sm text-[#94B8D8]">No credit card required · Cancel anytime</div>
                        <div className="flex flex-wrap gap-2 mt-3">

                            {["500 Free Given Credits"].map((c) => (
                                <span key={c} className="text-xs bg-blue-500/22 text-blue-400 px-2.5 py-1 rounded-full font-semibold">

                                    {c}
                                </span>

                            ))}
                        </div>
                    </div>


                    <p className="text-sm text-[#94B8D8] leading-relaxed mb-6">

                        Join eBench and expand your opportunities by connecting with global clients,

                        streamlining your workflow, and showcasing your services on a powerful AI-driven platform.
                    </p>

                    {[

                        "Access to global clients and recruitment projects.",

                        "AI tools that automate repetitive vendor tasks.",

                        "Insightful dashboards to track performance and analytics.",

                        "Secure onboarding with fast verification and approval.",

                        "Exclusively designed for vendor success and workflow efficiency.",

                    ].map((b) => (
                        <div key={b} className="flex gap-2.5 items-center mb-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500/25 flex items-center justify-center shrink-0 text-xs text-blue-400">

                                ✓
                            </div>
                            <span className="text-sm text-[#94B8D8]">{b}</span>
                        </div>

                    ))}

                    <div className="mt-auto pt-8">
                        <p className="text-sm text-[#94B8D8] opacity-80">
                            Already registered?{" "}
                            <Link
                                to="/login"
                                className="text-white font-semibold hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* ── Right Panel ── */}
                <div className="flex-1 min-w-[340px] bg-white p-10 overflow-y-auto">
                    <h1 className="text-2xl font-extrabold text-[#0F2744] mb-1.5">Create Your Account</h1>
                    <p className="text-sm text-[#6B84A0] mb-6">

                        Already have an account?{" "}
                        <span

                            onClick={() => navigate("/login")}

                            className="text-blue-500 font-semibold cursor-pointer"
                        >

                            Log in →
                        </span>
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                        {/* Registered As */}
                        <FormField label="Registered As">
                            <div className="grid grid-cols-2 gap-3">

                                {["student", "campus"].map((mod) => (
                                    <label

                                        key={mod}

                                        className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition

                      ${watchedModule === mod

                                                ? "border-[#286a94] bg-blue-50"

                                                : "border-gray-300"

                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input

                                                type="radio"

                                                value={mod}

                                                {...register("module")}

                                                className="accent-[#286a94]"

                                            />
                                            <span className="font-medium text-gray-700 capitalize">{mod}</span>
                                        </div>

                                        {watchedModule === mod && (
                                            <span className="text-xs text-[#286a94] font-semibold">Selected</span>

                                        )}
                                    </label>

                                ))}
                            </div>
                        </FormField>

                        {/* Country Select */}
                        <FormField label="Select Country">
                            <Controller

                                name="country"

                                control={control}

                                rules={{ required: "Please select a country" }}

                                render={({ field }) => (
                                    <Select

                                        {...field}

                                        options={countryOptions}

                                        placeholder="Select Country"

                                        getOptionLabel={(option) => option.searchLabel}

                                        isSearchable

                                        styles={{

                                            control: (base, state) => ({

                                                ...base,

                                                borderColor: errors.country

                                                    ? "#ef4444"

                                                    : state.isFocused

                                                        ? "#93c5fd"

                                                        : "#d1d5db",

                                                borderRadius: "0.5rem",

                                                padding: "1px",

                                                boxShadow: state.isFocused ? "0 0 0 2px #dbeafe" : "none",

                                                "&:hover": { borderColor: "#93c5fd" },

                                            }),

                                        }}

                                    />

                                )}

                            />

                            {errors.country && (
                                <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>

                            )}
                        </FormField>

                        {/* Campus / Student Name */}
                        <FormField
                            label={watchedModule === "campus" ? "Campus Name" : "Student Name"}
                        >
                            <div>
                                <input
                                    type="text"
                                    maxLength={100}
                                    placeholder={`Enter your ${watchedModule === "campus" ? "campus" : "student"
                                        } name`}
                                    className={`${inputClass} ${errors.name
                                        ? "border-red-400 focus:ring-red-100"
                                        : ""
                                        }`}
                                    {...register("name", {
                                        required: "Name is required",

                                        validate: {
                                            notWhitespace: (value) =>
                                                value.trim().length > 0 ||
                                                "Name cannot be blank or whitespace only",

                                            validCharacters: (value) =>
                                                /^[A-Za-z &'().-]+$/.test(value.trim()) &&
                                                (value.match(/\(/g)?.length || 0) === (value.match(/\)/g)?.length || 0) ||
                                                "Name contains invalid special characters",

                                            minLengthCheck: (value) =>
                                                value.trim().length >= 2 ||
                                                "Name must be at least 2 characters",

                                            maxLengthCheck: (value) =>
                                                value.trim().length <= 100 ||
                                                "Name must not exceed 100 characters",
                                        },

                                        setValueAs: (value) => value,
                                    })}
                                />

                                {/* Character counter */}
                                <div className="mt-1 flex justify-between text-xs text-gray-500">
                                    <span>
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>

                                        )}
                                    </span>
                                    <span>
                                        {watch("name")?.length || 0}/100
                                    </span>
                                </div>


                            </div>
                        </FormField>

                        {/* Email */}
                        <FormField label="Email Address">
                            <input

                                type="email"

                                placeholder={getEmailPlaceholder(watchedModule)}

                                className={`${inputClass} ${errors.email ? "border-red-400 focus:ring-red-100" : ""}`}

                                {...register("email", {

                                    required: "Email is required",

                                    validate: (value) => {
                                        const validation = validateEmailByRole(value, watchedModule);
                                        return validation.isValid || validation.message;
                                    }

                                })}

                            />

                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>

                            )}

                            {watchedModule && (
                                <p className="text-gray-500 text-xs mt-1">
                                    {watchedModule === "campus"
                                        ? "Use your work email (e.g., work@company.com)"
                                        : "Use your personal email (e.g., personal@gmail.com)"
                                    }
                                </p>
                            )}
                        </FormField>

                        {/* Password */}
                        <FormField label="Password">
                            <div className="relative">
                                <input

                                    type={showPass ? "text" : "password"}

                                    placeholder="Min. 8 characters"

                                    className={`${inputClass} pr-12 ${errors.password ? "border-red-400 focus:ring-red-100" : ""}`}

                                    {...register("password", {

                                        required: "Password is required",

                                        minLength: { value: 8, message: "Password must be at least 8 characters" },

                                        pattern: {

                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,

                                            message: "Must include uppercase, lowercase, and a number",

                                        },

                                    })}

                                />
                                <button

                                    type="button"

                                    onClick={() => setShowPass(!showPass)}

                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent border-0 cursor-pointer"
                                >

                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>

                            )}
                        </FormField>

                        {/* Confirm Password */}
                        <FormField label="Confirm Password">
                            <div className="relative">
                                <input

                                    type={showConfirmPass ? "text" : "password"}

                                    placeholder="Re-enter your password"

                                    className={`${inputClass} pr-12 ${errors.confirm_password ? "border-red-400 focus:ring-red-100" : ""}`}

                                    onPaste={(e) => e.preventDefault()}

                                    onCopy={(e) => e.preventDefault()}

                                    onCut={(e) => e.preventDefault()}

                                    onContextMenu={(e) => e.preventDefault()}

                                    {...register("confirm_password", {

                                        required: "Please confirm your password",

                                        validate: (val) =>

                                            val === watchedPassword || "Passwords do not match",

                                    })}

                                />
                                <button

                                    type="button"

                                    onClick={() => setShowConfirmPass(!showConfirmPass)}

                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent border-0 cursor-pointer"
                                >

                                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.confirm_password && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>

                            )}
                        </FormField>

                        {/* Trial Perks Banner */}

                        {watchedModule && trialPerks[watchedModule] && (
                            <div className="p-4 bg-[#F0F7FF] rounded-xl border border-blue-200">
                                <div className="text-xs font-bold text-blue-500 mb-1">✓ Your Free Trial Includes:</div>
                                <div className="text-xs text-[#3A5068]">{trialPerks[watchedModule]}</div>
                            </div>

                        )}

                        {/* Submit */}
                        <button

                            type="submit"

                            disabled={isLoading}

                            className="w-full py-4 text-base font-bold text-white rounded-xl bg-linear-to-r from-blue-500 to-sky-400 shadow-[0_6px_24px_rgba(43,127,255,0.4)] hover:shadow-[0_10px_32px_rgba(43,127,255,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >

                            {isLoading ? "Creating Account..." : "Create Account — Start Free Trial →"}
                        </button>
                    </form>

                    {/* <p className="text-xs text-[#94B8D8] text-center leading-relaxed mt-3">

                        By signing up, you agree to our{" "}
                        <span className="text-blue-500 cursor-pointer">Terms</span> and{" "}
                        <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
                    </p> */}
                </div>
            </div>
        </div >

    );

}

export default SignupPage;
