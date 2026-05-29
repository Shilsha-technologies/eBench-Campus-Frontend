import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { motion } from 'framer-motion'
import { useGetCountryDataQuery } from "../../../redux/services/externalApi";
import { ClockFading, X } from "lucide-react";
import { useGetDegreeCampusDetailsQuery, useGetDepartmentCampusDetailsQuery, useGetSpecializationCampusDetailsQuery } from "../../../redux/services/vendorApi";

const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required").max(30),
    lastName: yup.string().required("Last Name is required").max(30),

    // birthCountry: yup.object().nullable().required("Birth Country is required"),
    nationality: yup.object().nullable().required("Nationality is required"),
    countryOfResidence: yup.object().nullable().required("Country of Residence is required"),

    email: yup.string().email("Invalid email").required("Email is required"),

    mobileNumber: yup
        .string()
        .required("Mobile number is required"),

    degree: yup.string().when([], {
        then: (schema) => schema.required("Degree is required"),
    }),

    specialization: yup.string().when([], {
        then: (schema) => schema.required("Specialization is required"),
    }),

    enrollmentYear: yup.string().when([], {
        then: (schema) => schema.required("Enrollment year required"),
    }),


    cgpa: yup.string().when([], {
        then: (schema) => schema.required("CGPA required"),
    }),



    department: yup.string().when([], {
        then: (schema) => schema.required("Department required"),
    }),
    skills: yup.array().of(yup.string()).when([], {
        then: (schema) => schema.min(1, "Skills required").required("Skills required"),
    }),
});

const moduleType = localStorage.getItem('module')

export default function UserForm({ onSubmit, isVendorAdding, onClose }) {
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");

    const addSkill = (e) => {
        if (e) e.preventDefault();
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        register("skills");
    }, [register]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            setValue("skills", skills);
            return;
        }
        setValue("skills", skills, { shouldValidate: true });
    }, [skills, setValue]);

    const countryCode = watch("countryCode") || "in";
    const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();
    // const 
    const countryOptions =
        countryData?.data?.map((item) => ({
            label: item?.name,
            value: item?.name,
        })) || [];

    const {
        data: degrees = [],
        isLoading: degLoading,
    } = useGetDegreeCampusDetailsQuery();

    const {
        data: departments = [],
        isLoading: deptLoading,
    } = useGetDepartmentCampusDetailsQuery();

    const {
        data: specializations = [],
        isLoading: specLoading,
    } = useGetSpecializationCampusDetailsQuery();


    const handleFormSubmit = (data) => {
        console.log("koko", data)
        console.log("data ", skills, skillInput)
        debugger;
        const payload = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            mobile: data.mobileNumber,
            birth_country: data.birthCountry?.value,
            nationality: data.nationality?.value,
            country_of_residence: data.countryOfResidence?.value,
            university_name: data.universityName,
            college_name: data.collegeName,
            degree: data.degree,
            specialization: data.specialization,
            enrollment_year: data.enrollmentYear,
            graduation_year: data.graduationYear,
            cgpa: data.cgpa,
            roll_number: data.rollNumber,
            department: data.department,
            is_persuing: data?.isPursuing,
            skills: skills
        };

        onSubmit(payload, false);
    };

    // console.log("specializations",specializations)

    return (
        <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl h-96 md:h-128 overflow-auto shadow-xl w-full max-w-5xl p-6">
                <div className=" mb-5 border-b border-gray-300 pb-3 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-500 ">
                        Add New User
                    </h2>
                    <div>
                        <X className=" cursor-pointer" onClick={onClose} />
                    </div>
                </div>



                <form
                    onSubmit={handleSubmit((data) => handleFormSubmit(data, false))}
                    className="grid grid-cols-2 md:grid-cols-3  gap-5">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            {...register("firstName")}
                            placeholder="Enter first name"
                            className={`w-full border rounded-lg p-2 outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.firstName && (
                            <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            {...register("lastName")}
                            placeholder="Enter last name"
                            className={`w-full border rounded-lg p-2 outline-none ${errors.lastName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.lastName && (
                            <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                        )}
                    </div>



                    {/* Nationality */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nationality
                        </label>
                        <Controller
                            name="nationality"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={countryOptions}
                                    placeholder="Select Nationality"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.nationality ? "#ef4444" : "#d1d5db",
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.nationality && (
                            <p className="text-sm text-red-500 mt-1">{errors.nationality.message}</p>
                        )}
                    </div>

                    {/* Country of Residence */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country of Residence
                        </label>
                        <Controller
                            name="countryOfResidence"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={countryOptions}
                                    placeholder="Select Country of Residence"
                                    classNamePrefix="react-select"
                                    className=" outline-none"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.countryOfResidence ? "#ef4444" : "#d1d5db",
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.countryOfResidence && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.countryOfResidence.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter email"
                            className={`w-full border rounded-lg p-2 outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                        </label>
                        <Controller
                            name="mobileNumber"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    country={countryCode}
                                    onChange={(value, country) => {
                                        setValue("mobileNumber", value.replace(/[^0-9]/g, ""));
                                        setValue("countryCode", country.countryCode);
                                    }}
                                    inputStyle={{
                                        width: "100%",
                                        borderRadius: "0.5rem",
                                        borderColor: errors.mobileNumber ? "#ef4444" : "#d1d5db",
                                        // padding: "10px 12px",
                                    }}
                                    placeholder="Enter phone number"
                                />
                            )}
                        />
                        {errors.mobileNumber && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.mobileNumber.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="font-medium text-sm text-gray-700 mb-1">Degree</label>
                        <select
                            {...register("degree")}
                            className={`w-full border rounded-lg p-2 outline-none ${errors.degree ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">
                                {degLoading ? "Loading..." : "Select Degree"}
                            </option>

                            {degrees?.data?.length > 0 && degrees?.data?.map((deg) => (
                                <option key={deg.id} value={deg.name}>
                                    {deg.name}
                                </option>
                            ))}
                        </select>

                        {errors.degree && (
                            <p className="text-sm text-red-500 mt-1">{errors.degree.message}</p>
                        )}
                    </div>

                    {/* Department */}
                    {/* <div>
                                <label className="font-medium text-sm text-gray-700 mb-1">Department</label>
                                <input {...register("department")}

                                    className={`w-full border rounded-lg p-2 outline-none  ${errors.department ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Department Name"
                                />
                                {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>}
                            </div> */}
                    <div>
                        <label className="font-medium text-sm text-gray-700 mb-1">Department</label>
                        <select
                            {...register("department")}
                            className={`w-full border text-gray-500 rounded-lg p-2 outline-none ${errors.department ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">
                                {deptLoading ? "Loading..." : "Select Department"}
                            </option>

                            {departments?.data?.length > 0 && departments?.data?.map((dept) => (
                                <option key={dept.name} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>

                        {errors.department && (
                            <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>
                        )}
                    </div>

                    {/* Specialization */}
                    {/* <div>
                                <label className="font-medium text-sm text-gray-700 mb-1">Specialization</label>
                                <input {...register("specialization")}
                                    className={`w-full border rounded-lg p-2 outline-none ${errors.specialization ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Specialization"
                                />
                                {errors.specialization && <p className="text-sm text-red-500 mt-1">{errors.specialization.message}</p>}
                            </div> */}
                    <div>
                        <label className="font-medium text-sm text-gray-700 mb-1">
                            Specialization
                        </label>
                        <select
                            {...register("specialization")}
                            className={`w-full border text-gray-500 rounded-lg p-2 outline-none ${errors.specialization ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">
                                {specLoading ? "Loading..." : "Select Specialization"}
                            </option>

                            {specializations?.data?.length > 0 && specializations?.data?.map((spec) => (
                                <option key={spec.name} value={spec.id}>
                                    {spec.name}
                                </option>
                            ))}
                        </select>

                        {errors.specialization && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.specialization.message}
                            </p>
                        )}
                    </div>

                    {/* Enrollment Year */}
                    <div>
                        <label className="font-medium text-sm text-gray-700 mb-1">Enrollment (Month / Year)</label>

                        <input
                            type="month"
                            placeholder="Month Year"
                            {...register("enrollmentYear")}
                            className={`w-full border rounded-lg p-2 text-gray-500 outline-none 
    ${errors.enrollmentYear ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.enrollmentYear && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.enrollmentYear.message}
                            </p>
                        )}
                    </div>

                    {/* Graduation Year */}
                    {/* <div>
                                <label>Graduation Date</label>
                                <input type="date" {...register("graduationYear")}
                                    className={`w-full border rounded-lg p-2 outline-none text-gray-500 ${errors.graduationYear ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.graduationYear && <p className="text-sm text-red-500 mt-1">{errors.graduationYear.message}</p>}
                            </div> */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Graduation (Month / Year)
                        </label>

                        {/* Month Input */}
                        <input
                            type="month"
                            {...register("graduationYear")}
                            disabled={watch("isPursuing")}
                            className={`w-full border rounded-lg p-2 outline-none text-gray-500
    ${errors.graduationYear ? "border-red-500" : "border-gray-300"}
    ${watch("isPursuing") ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />

                        {/* Still Pursuing */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="pursuing"
                                placeholder="Month Year"
                                checked={watch("isPursuing")}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setValue("isPursuing", checked);

                                    // Clear date if pursuing
                                    if (checked) {
                                        setValue("graduationYear", "");
                                    }
                                }}
                            />
                            <label htmlFor="pursuing" className="text-sm text-gray-600">
                                Still Pursuing
                            </label>
                        </div>

                        {/* Error */}
                        {errors.graduationYear && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.graduationYear.message}
                            </p>
                        )}
                    </div>

                    {/* CGPA */}
                    <div>
                        <label className="font-medium text-sm text-gray-700 mb-1">CGPA</label>
                        <input {...register("cgpa")}
                            className={`w-full border rounded-lg p-2 outline-none ${errors.cgpa ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="CGPA"
                        />
                        {errors.cgpa && <p className="text-sm text-red-500 mt-1">{errors.cgpa.message}</p>}
                    </div>

                    {/* Roll Number */}
                    <div>
                        <label className="font-medium text-sm text-gray-700 mb-1">Roll Number (Optional)</label>
                        <input {...register("rollNumber")}
                            className={`w-full border rounded-lg p-2 outline-none ${errors.rollNumber ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Roll Number"
                        />
                        {errors.rollNumber && <p className="text-sm text-red-500 mt-1">{errors.rollNumber.message}</p>}
                    </div>

                    {/* Skills */}
                    <div className="col-span-2  md:col-span-2 space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            Skills
                        </label>

                        <div className="flex gap-2 max-w-md">
                            <input
                                placeholder="Type skill (e.g. React) and click '+'"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                className="flex-1 border border-gray-300 rounded-lg p-2 outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 cursor-pointer shadow-sm"
                            >
                                +
                            </button>
                        </div>
                        {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>}
                        <div className="flex gap-2 mb-2 flex-wrap">
                            {skills.map((s) => (
                                <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200 shadow-sm animate-fade-in">
                                    {s}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(s)}
                                        className="hover:text-red-500 font-bold cursor-pointer transition-colors"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>




                    {/* Buttons */}
                    <div className="col-span-3 flex justify-end gap-4 pt-4">
                        <button
                            type="submit"
                            className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {isVendorAdding ? 'Saving...' : 'Save User'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}


