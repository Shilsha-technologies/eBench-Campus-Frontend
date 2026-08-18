import { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { useGetCountryDataQuery } from "../../../redux/services/externalApi";

import {
    useLazyGetDegreeCampusDetailsQuery,
    useLazyGetDepartmentCampusDetailsQuery,
    useGetSpecializationCampusDetailsQuery,
} from "../../../redux/services/vendorApi";

// =====================================================
// EDUCATION VALIDATION
// =====================================================

const educationSchema = yup.object().shape({
    level: yup
        .string()
        .required("Education level is required"),

    degree: yup
        .string()
        .required("Degree is required"),

    specialization: yup
        .string()
        .required("Specialization is required"),

    enrollmentYear: yup
        .string()
        .required("Enrollment year required"),

    graduationYear: yup
        .string()
        .when("isPursuing", {
            is: false,
            then: (schema) =>
                schema.required("Graduation year required"),
            otherwise: (schema) =>
                schema.notRequired(),
        }),

    cgpa: yup
        .string()
        .required("CGPA required"),

    department: yup
        .string()
        .required("Department required"),

    rollNumber: yup
        .string()
        .notRequired(),

    isPursuing: yup
        .boolean()
        .default(false),
});

// =====================================================
// MAIN VALIDATION
// =====================================================

const validationSchema = yup.object().shape({
    firstName: yup
        .string()
        .required("First Name is required")
        .max(30),

    lastName: yup
        .string()
        .required("Last Name is required")
        .max(30),

    nationality: yup
        .object()
        .nullable()
        .required("Nationality is required"),

    countryOfResidence: yup
        .object()
        .nullable()
        .required("Country of Residence is required"),

    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),

    mobileNumber: yup
        .string()
        .required("Mobile number is required"),

    education: yup
        .array()
        .of(educationSchema)
        .min(1, "At least one education is required")
        .required("Education is required"),

    skills: yup
        .array()
        .of(yup.string())
        .min(1, "Skills required")
        .required("Skills required"),
});

// =====================================================
// EMPTY EDUCATION OBJECT
// =====================================================

const emptyEducation = {
    level: "",
    degree: "",
    specialization: "",
    enrollmentYear: "",
    graduationYear: "",
    cgpa: "",
    department: "",
    rollNumber: "",
    isPursuing: false,
};

// =====================================================
// COMPONENT
// =====================================================

export default function UserForm({
    onSubmit,
    isVendorAdding,
    onClose,
}) {
    // =================================================
    // SKILLS
    // =================================================

    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");

    const addSkill = (e) => {
        if (e) {
            e.preventDefault();
        }

        const trimmed = skillInput.trim();

        if (trimmed && !skills.includes(trimmed)) {
            setSkills([
                ...skills,
                trimmed,
            ]);

            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(
            skills.filter(
                (s) => s !== skillToRemove
            )
        );
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    // =================================================
    // REACT HOOK FORM
    // =================================================

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
    } = useForm({
        resolver: yupResolver(
            validationSchema
        ),

        mode: "onBlur",

        defaultValues: {
            firstName: "",
            lastName: "",

            nationality: null,
            countryOfResidence: null,

            email: "",
            mobileNumber: "",
            countryCode: "in",

            education: [
                {
                    ...emptyEducation,
                },
            ],

            skills: [],
        },
    });

    const values = watch();

    console.log("countryOfResidence", values);


    // =================================================
    // EDUCATION FIELD ARRAY
    // =================================================

    const {
        fields: educationFields,
        append: addEducation,
        remove: removeEducation,
    } = useFieldArray({
        control,
        name: "education",
    });

    // =================================================
    // COUNTRY
    // =================================================

    const countryCode =
        watch("countryCode") || "in";

    const {
        data: countryData,
        isLoading: countryLoading,
    } = useGetCountryDataQuery();

    const countryOptions =
        countryData?.data?.map((item) => ({
            label: item?.name,
            value: item?.name,
        })) || [];

    // =================================================
    // EDUCATION API
    // =================================================

    const [
        triggerDegree,
        {
            data: degrees = [],
            isLoading: degLoading,
        },
    ] = useLazyGetDegreeCampusDetailsQuery();

    const [
        triggerDepartment,
        {
            data: departments = [],
            isLoading: deptLoading,
        },
    ] = useLazyGetDepartmentCampusDetailsQuery();

    // =================================================
    // WATCH EDUCATION
    // =================================================

    const educationWatch = watch("education");

    // =================================================
    // SELECTED DEGREE
    // =================================================

    const [selectedDegreeId, setSelectedDegreeId] =
        useState(null);

    useEffect(() => {
        const degreesSelected = educationWatch
            .map((e) => e.degree)
            .filter(Boolean);

        if (degreesSelected.length) {
            setSelectedDegreeId(
                degreesSelected[
                degreesSelected.length - 1
                ]
            );
        } else {
            setSelectedDegreeId(null);
        }
    }, [educationWatch]);

    // =================================================
    // DEPARTMENT API
    // =================================================

    useEffect(() => {
        if (selectedDegreeId) {
            triggerDepartment(selectedDegreeId);
        }
    }, [
        selectedDegreeId,
        triggerDepartment,
    ]);

    // =================================================
    // SPECIALIZATION API
    // =================================================

    const selectedDepartmentId =
        educationWatch
            .map((e) => e.department)
            .filter(Boolean)
            .pop() || null;

    const {
        data: specializations = [],
        isLoading: specLoading,
    } = useGetSpecializationCampusDetailsQuery(
        selectedDepartmentId,
        {
            skip: !selectedDepartmentId,
        }
    );

    // =================================================
    // LEVEL CHANGE
    // =================================================

    const handleEducationLevelChange = async (
        e,
        index
    ) => {
        const level = e.target.value;

        // Set selected level
        setValue(
            `education.${index}.level`,
            level,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        // Clear dependent fields
        setValue(
            `education.${index}.degree`,
            "",
            {
                shouldValidate: false,
            }
        );

        setValue(
            `education.${index}.department`,
            "",
            {
                shouldValidate: false,
            }
        );

        setValue(
            `education.${index}.specialization`,
            "",
            {
                shouldValidate: false,
            }
        );

        // If no level selected, don't call API
        if (!level) {
            return;
        }

        try {
            console.log(
                "Calling Degree API with level:",
                level
            );

            await triggerDegree(level).unwrap();

            console.log(
                "Degree API called successfully"
            );
        } catch (error) {
            console.error(
                "Degree API error:",
                error
            );
        }
    };

    // =================================================
    // DEGREE CHANGE
    // =================================================

    const handleDegreeChange = async (e, index) => {
        const degreeId = e.target.value;

        // Set selected degree
        setValue(
            `education.${index}.degree`,
            degreeId,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        // Clear dependent fields
        setValue(
            `education.${index}.department`,
            "",
            {
                shouldValidate: false,
            }
        );

        setValue(
            `education.${index}.specialization`,
            "",
            {
                shouldValidate: false,
            }
        );

        // Don't call API if degree is cleared
        if (!degreeId) {
            return;
        }

        try {
            console.log(
                "Calling Department API with degree ID:",
                degreeId
            );

            await triggerDepartment(degreeId).unwrap();

            console.log(
                "Department API called successfully"
            );
        } catch (error) {
            console.error(
                "Department API error:",
                error
            );
        }
    };

    // =================================================
    // DEPARTMENT CHANGE
    // =================================================

    const handleDepartmentChange = (
        e,
        index
    ) => {
        const departmentId = e.target.value;

        setValue(
            `education.${index}.department`,
            departmentId,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        // Clear specialization
        setValue(
            `education.${index}.specialization`,
            "",
            {
                shouldValidate: false,
            }
        );
    };

    // =================================================
    // SYNC SKILLS
    // =================================================

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            setValue(
                "skills",
                skills
            );

            return;
        }

        setValue(
            "skills",
            skills,
            {
                shouldValidate: true,
            }
        );
    }, [
        skills,
        setValue,
    ]);

    // =================================================
    // SUBMIT
    // =================================================

    const handleFormSubmit = (data) => {

        debugger;
        const payload = {
            first_name:
                data.firstName,

            last_name:
                data.lastName,

            email:
                data.email,

            mobile:
                data.mobileNumber,

            nationality:
                data.nationality?.value,

            country_of_residence:
                data.countryOfResidence?.value,

            college_name:
                data.collegeName,

            // =========================================
            // MULTIPLE EDUCATION
            // =========================================

            education:
                data.education.map(
                    (edu) => ({
                        level:
                            edu.level,

                        degree:
                            edu.degree,

                        specialization:
                            edu.specialization,

                        enrollment_year:
                            edu.enrollmentYear,

                        graduation_year:
                            edu.graduationYear,

                        cgpa:
                            edu.cgpa,

                        department:
                            edu.department,

                        roll_number:
                            edu.rollNumber,

                        is_persuing:
                            edu.isPursuing,
                    })
                ),

            // =========================================
            // SKILLS
            // =========================================

            skills: skills,
        };

        console.log(
            "FINAL PAYLOAD",
            payload
        );

        onSubmit(
            payload,
            false
        );
    };

    // =================================================
    // ADD EDUCATION
    // =================================================

    const handleAddEducation = () => {
        addEducation({
            ...emptyEducation,
        });
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <motion.div
            className="
                fixed inset-0
                bg-black/40
                flex items-center
                justify-center
                z-50
            "
        >
            <motion.div
                initial={{
                    scale: 0.8,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                }}
                className="
                    bg-white
                    rounded-2xl
                    h-[90vh]
                    overflow-auto
                    shadow-xl
                    w-full
                    max-w-6xl
                    p-6
                "
            >
                {/* =====================================
                    HEADER
                ====================================== */}

                <div
                    className="
                        mb-5
                        border-b
                        border-gray-300
                        pb-3
                        flex
                        justify-between
                        items-center
                    "
                >
                    <h2
                        className="
                            text-2xl
                            font-semibold
                            text-gray-500
                        "
                    >
                        Add New User
                    </h2>

                    <div>
                        <X
                            className="
                                cursor-pointer
                            "
                            onClick={onClose}
                        />
                    </div>
                </div>

                {/* =====================================
                    FORM
                ====================================== */}

                <form
                    onSubmit={handleSubmit(
                        handleFormSubmit
                    )}
                    className="
                        grid
                        grid-cols-2
                        md:grid-cols-3
                        gap-5
                    "
                >
                    {/* =================================
                        FIRST NAME
                    ================================== */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >
                            First Name
                        </label>

                        <input
                            {...register(
                                "firstName"
                            )}
                            placeholder="Enter first name"
                            className={`
                                w-full
                                border
                                rounded-lg
                                p-2
                                outline-none
                                ${errors.firstName
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.firstName && (
                            <p
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                "
                            >
                                {
                                    errors
                                        .firstName
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================
                        LAST NAME
                    ================================== */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >
                            Last Name
                        </label>

                        <input
                            {...register(
                                "lastName"
                            )}
                            placeholder="Enter last name"
                            className={`
                                w-full
                                border
                                rounded-lg
                                p-2
                                outline-none
                                ${errors.lastName
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.lastName && (
                            <p
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                "
                            >
                                {
                                    errors
                                        .lastName
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================
                        NATIONALITY
                    ================================== */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >
                            Nationality
                        </label>

                        <Controller
                            name="nationality"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={
                                        countryOptions
                                    }
                                    isLoading={
                                        countryLoading
                                    }
                                    placeholder="
                                        Select Nationality
                                    "
                                    classNamePrefix="
                                        react-select
                                    "
                                    styles={{
                                        control: (
                                            base
                                        ) => ({
                                            ...base,

                                            borderColor:
                                                errors
                                                    .nationality
                                                    ? "#ef4444"
                                                    : "#d1d5db",
                                        }),
                                    }}
                                />
                            )}
                        />

                        {errors.nationality && (
                            <p
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                "
                            >
                                {
                                    errors
                                        .nationality
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================
                        COUNTRY OF RESIDENCE
                    ================================== */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >
                            Country of Residence
                        </label>

                        <Controller
                            name="countryOfResidence"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={
                                        countryOptions
                                    }
                                    isLoading={
                                        countryLoading
                                    }
                                    placeholder="
                                        Select Country of Residence
                                    "
                                    classNamePrefix="
                                        react-select
                                    "
                                    styles={{
                                        control: (
                                            base
                                        ) => ({
                                            ...base,

                                            borderColor:
                                                errors
                                                    .countryOfResidence
                                                    ? "#ef4444"
                                                    : "#d1d5db",
                                        }),
                                    }}
                                />
                            )}
                        />

                        {errors.countryOfResidence && (
                            <p
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                "
                            >
                                {
                                    errors
                                        .countryOfResidence
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================
                        EMAIL
                    ================================== */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >
                            Email
                        </label>

                        <input
                            {...register(
                                "email"
                            )}
                            type="email"
                            placeholder="Enter email"
                            className={`
                                w-full
                                border
                                rounded-lg
                                p-2
                                outline-none
                                ${errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.email && (
                            <p
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                "
                            >
                                {
                                    errors
                                        .email
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* =================================
                        MOBILE
                    ================================== */}

                    <div>
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >
                            Mobile Number
                        </label>

                        <Controller
                            name="mobileNumber"
                            control={control}
                            render={() => (
                                <PhoneInput
                                    country={
                                        countryCode
                                    }
                                    onChange={(
                                        value,
                                        country
                                    ) => {
                                        setValue(
                                            "mobileNumber",
                                            value.replace(
                                                /[^0-9]/g,
                                                ""
                                            ),
                                            {
                                                shouldValidate:
                                                    true,
                                            }
                                        );

                                        setValue(
                                            "countryCode",
                                            value
                                        );
                                    }}
                                    inputStyle={{
                                        width: "100%",
                                        borderRadius:
                                            "0.5rem",
                                        borderColor:
                                            errors
                                                .mobileNumber
                                                ? "#ef4444"
                                                : "#d1d5db",
                                    }}
                                    placeholder="
                                        Enter phone number
                                    "
                                />
                            )}
                        />

                        {errors.mobileNumber && (
                            <p
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                "
                            >
                                {
                                    errors
                                        .mobileNumber
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* ==========================================
                        EDUCATION SECTION
                    =========================================== */}

                    <div
                        className="
                            col-span-2
                            md:col-span-3
                        "
                    >
                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                mb-4
                            "
                        >
                            <div>
                                <h3
                                    className="
                                        text-xl
                                        font-semibold
                                        text-gray-700
                                    "
                                >
                                    Education
                                </h3>

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Add one or more UG / PG
                                    qualifications.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleAddEducation
                                }
                                className="
                                    px-4
                                    py-2
                                    bg-green-600
                                    text-white
                                    rounded-lg
                                    text-sm
                                    hover:bg-green-700
                                    transition
                                    cursor-pointer
                                "
                            >
                                + Add Education
                            </button>
                        </div>

                        {/* =================================
                            EDUCATION LIST
                        ================================== */}

                        {educationFields.map(
                            (field, index) => (
                                <div
                                    key={field.id}
                                    className="
                                        border
                                        border-gray-100
                                        rounded-xl
                                        p-5
                                        mb-5
                                        bg-gray-50
                                    "
                                >
                                    {/* HEADER */}

                                    <div
                                        className="
                                            flex
                                            justify-between
                                            items-center
                                            mb-4
                                        "
                                    >
                                        <h4
                                            className="
                                                text-lg
                                                font-semibold
                                                text-gray-700
                                            "
                                        >
                                            Education #
                                            {index + 1}
                                        </h4>

                                        {educationFields.length >
                                            1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeEducation(
                                                            index
                                                        )
                                                    }
                                                    className="
                                                    text-red-500
                                                    hover:text-red-700
                                                    font-medium
                                                "
                                                >
                                                    Remove
                                                </button>
                                            )}
                                    </div>

                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            md:grid-cols-2
                                            lg:grid-cols-3
                                            gap-5
                                        "
                                    >
                                        {/* =====================
                                            LEVEL
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                Education Level
                                            </label>

                                            <select
                                                {...register(
                                                    `education.${index}.level`
                                                )}
                                                onChange={(e) =>
                                                    handleEducationLevelChange(
                                                        e,
                                                        index
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    border
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                    ${errors.education?.[
                                                        index
                                                    ]?.level
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }
                                                `}
                                            >
                                                <option value="">
                                                    Select Level
                                                </option>

                                                <option value="UG">
                                                    UG
                                                </option>

                                                <option value="PG">
                                                    PG
                                                </option>
                                            </select>

                                            {errors.education?.[
                                                index
                                            ]?.level && (
                                                    <p
                                                        className="
                                                        text-sm
                                                        text-red-500
                                                        mt-1
                                                    "
                                                    >
                                                        {
                                                            errors
                                                                .education[
                                                                index
                                                            ].level
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        {/* =====================
                                            DEGREE
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                Degree
                                            </label>

                                            <select
                                                {...register(
                                                    `education.${index}.degree`
                                                )}
                                                onChange={(e) =>
                                                    handleDegreeChange(
                                                        e,
                                                        index
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    border
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                    ${errors.education?.[
                                                        index
                                                    ]?.degree
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }
                                                `}
                                            >
                                                <option value="">
                                                    {degLoading
                                                        ? "Loading..."
                                                        : "Select Degree"}
                                                </option>

                                                {degrees?.data?.map(
                                                    (deg) => (
                                                        <option
                                                            key={
                                                                deg.id
                                                            }
                                                            value={
                                                                deg.id
                                                            }
                                                        >
                                                            {
                                                                deg.name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            {errors.education?.[
                                                index
                                            ]?.degree && (
                                                    <p
                                                        className="
                                                        text-sm
                                                        text-red-500
                                                        mt-1
                                                    "
                                                    >
                                                        {
                                                            errors
                                                                .education[
                                                                index
                                                            ].degree
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        {/* =====================
                                            DEPARTMENT
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                Department
                                            </label>

                                            <select
                                                {...register(
                                                    `education.${index}.department`
                                                )}
                                                onChange={(e) =>
                                                    handleDepartmentChange(
                                                        e,
                                                        index
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    border
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                    ${errors.education?.[
                                                        index
                                                    ]?.department
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }
                                                `}
                                            >
                                                <option value="">
                                                    {deptLoading
                                                        ? "Loading..."
                                                        : "Select Department"}
                                                </option>

                                                {departments?.data?.map(
                                                    (dept) => (
                                                        <option
                                                            key={
                                                                dept.id
                                                            }
                                                            value={
                                                                dept.id
                                                            }
                                                        >
                                                            {
                                                                dept.name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            {errors.education?.[
                                                index
                                            ]?.department && (
                                                    <p
                                                        className="
                                                        text-sm
                                                        text-red-500
                                                        mt-1
                                                    "
                                                    >
                                                        {
                                                            errors
                                                                .education[
                                                                index
                                                            ].department
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        {/* =====================
                                            SPECIALIZATION
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                Specialization
                                            </label>

                                            <select
                                                {...register(
                                                    `education.${index}.specialization`
                                                )}
                                                className={`
                                                    w-full
                                                    border
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                    ${errors.education?.[
                                                        index
                                                    ]?.specialization
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }
                                                `}
                                            >
                                                <option value="">
                                                    {specLoading
                                                        ? "Loading..."
                                                        : "Select Specialization"}
                                                </option>

                                                {specializations?.data?.map(
                                                    (spec) => (
                                                        <option
                                                            key={
                                                                spec.id
                                                            }
                                                            value={
                                                                spec.id
                                                            }
                                                        >
                                                            {
                                                                spec.name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            {errors.education?.[
                                                index
                                            ]?.specialization && (
                                                    <p
                                                        className="
                                                        text-sm
                                                        text-red-500
                                                        mt-1
                                                    "
                                                    >
                                                        {
                                                            errors
                                                                .education[
                                                                index
                                                            ].specialization
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        {/* =====================
                                            ENROLLMENT
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                Enrollment
                                            </label>

                                            <input
                                                type="month"
                                                {...register(
                                                    `education.${index}.enrollmentYear`
                                                )}
                                                className={`
                                                    w-full
                                                    border
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                    ${errors.education?.[
                                                        index
                                                    ]?.enrollmentYear
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }
                                                `}
                                            />

                                            {errors.education?.[
                                                index
                                            ]?.enrollmentYear && (
                                                    <p
                                                        className="
                                                        text-sm
                                                        text-red-500
                                                        mt-1
                                                    "
                                                    >
                                                        {
                                                            errors
                                                                .education[
                                                                index
                                                            ].enrollmentYear
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        {/* =====================
                                            GRADUATION
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                Graduation
                                            </label>

                                            <input
                                                type="month"
                                                {...register(
                                                    `education.${index}.graduationYear`
                                                )}
                                                disabled={watch(
                                                    `education.${index}.isPursuing`
                                                )}
                                                className={`
                                                    w-full
                                                    border
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                    ${errors.education?.[
                                                        index
                                                    ]?.graduationYear
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }

                                                    ${watch(
                                                        `education.${index}.isPursuing`
                                                    )
                                                        ? "bg-gray-100 cursor-not-allowed"
                                                        : ""
                                                    }
                                                `}
                                            />

                                            {/* PURSUING */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    mt-2
                                                "
                                            >
                                                <input
                                                    type="checkbox"
                                                    {...register(
                                                        `education.${index}.isPursuing`
                                                    )}
                                                />

                                                <label
                                                    className="
                                                        text-sm
                                                        text-gray-600
                                                    "
                                                >
                                                    Still Pursuing
                                                </label>
                                            </div>

                                            {errors.education?.[
                                                index
                                            ]?.graduationYear && (
                                                    <p
                                                        className="
                                                        text-sm
                                                        text-red-500
                                                        mt-1
                                                    "
                                                    >
                                                        {
                                                            errors
                                                                .education[
                                                                index
                                                            ].graduationYear
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        {/* =====================
                                            CGPA
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                CGPA
                                            </label>

                                            <input
                                                {...register(
                                                    `education.${index}.cgpa`
                                                )}
                                                placeholder="CGPA"
                                                className={`
                                                    w-full
                                                    border
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                    ${errors.education?.[
                                                        index
                                                    ]?.cgpa
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }
                                                `}
                                            />

                                            {errors.education?.[
                                                index
                                            ]?.cgpa && (
                                                    <p
                                                        className="
                                                        text-sm
                                                        text-red-500
                                                        mt-1
                                                    "
                                                    >
                                                        {
                                                            errors
                                                                .education[
                                                                index
                                                            ].cgpa
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        {/* =====================
                                            ROLL NUMBER
                                        ====================== */}

                                        <div>
                                            <label
                                                className="
                                                    font-medium
                                                    text-sm
                                                    text-gray-700
                                                    mb-1
                                                    block
                                                "
                                            >
                                                Roll Number
                                                (Optional)
                                            </label>

                                            <input
                                                {...register(
                                                    `education.${index}.rollNumber`
                                                )}
                                                placeholder="
                                                    Roll Number
                                                "
                                                className="
                                                    w-full
                                                    border
                                                    border-gray-300
                                                    rounded-lg
                                                    p-2
                                                    outline-none
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                        {/* EDUCATION ERROR */}

                        {typeof errors.education?.message ===
                            "string" && (
                                <p
                                    className="
                                    text-sm
                                    text-red-500
                                    mb-3
                                "
                                >
                                    {
                                        errors.education
                                            .message
                                    }
                                </p>
                            )}
                    </div>

                    {/* ==========================================
                        SKILLS
                    =========================================== */}

                    <div
                        className="
                            col-span-2
                            md:col-span-3
                            space-y-1.5
                        "
                    >
                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Skills
                        </label>

                        <div
                            className="
                                flex
                                gap-2
                                max-w-md
                            "
                        >
                            <input
                                placeholder="
                                    Type skill (e.g. React)
                                "
                                value={
                                    skillInput
                                }
                                onChange={(e) =>
                                    setSkillInput(
                                        e.target.value
                                    )
                                }
                                onKeyDown={
                                    handleSkillKeyDown
                                }
                                className="
                                    flex-1
                                    border
                                    border-gray-300
                                    rounded-lg
                                    p-2
                                    outline-none
                                    text-sm
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                            <button
                                type="button"
                                onClick={
                                    addSkill
                                }
                                className="
                                    px-4
                                    py-2
                                    bg-blue-600
                                    text-white
                                    rounded-lg
                                    font-bold
                                    hover:bg-blue-700
                                "
                            >
                                +
                            </button>
                        </div>

                        {errors.skills && (
                            <p
                                className="
                                    text-sm
                                    text-red-500
                                    mt-1
                                "
                            >
                                {
                                    errors.skills
                                        .message
                                }
                            </p>
                        )}

                        {/* SKILL TAGS */}

                        <div
                            className="
                                flex
                                gap-2
                                mb-2
                                flex-wrap
                            "
                        >
                            {skills.map(
                                (skill) => (
                                    <span
                                        key={
                                            skill
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            px-3
                                            py-1
                                            bg-blue-50
                                            text-blue-700
                                            rounded-full
                                            text-xs
                                            font-semibold
                                            border
                                            border-blue-200
                                        "
                                    >
                                        {skill}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSkill(
                                                    skill
                                                )
                                            }
                                            className="
                                                hover:text-red-500
                                                font-bold
                                                cursor-pointer
                                            "
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    {/* ==========================================
                        BUTTONS
                    =========================================== */}

                    <div
                        className="
                            col-span-2
                            md:col-span-3
                            flex
                            justify-end
                            gap-4
                            pt-4
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            className="
                                px-4
                                py-2
                                border
                                border-gray-300
                                text-gray-600
                                rounded-lg
                                hover:bg-gray-100
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isVendorAdding
                            }
                            className="
                                px-4
                                py-2
                                bg-blue-600
                                text-white
                                rounded-lg
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >
                            {isVendorAdding
                                ? "Saving..."
                                : "Save User"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
