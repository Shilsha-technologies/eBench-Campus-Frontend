import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useGetVendorProfileQuery, useUpdateVendorProfileMutation } from "../../redux/services/vendorApi";
import toast from "react-hot-toast";
import { useAuth } from "../../libs/AuthProvider";
import { useLocationData } from "../../hooks/useLocationData";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, showLabel, color }) => (
  <div className="w-full bg-gray-100 rounded-full h-2">
    <div
      className={`h-2 rounded-full transition-all duration-500 ${color === "emerald" ? "bg-emerald-500" : "bg-indigo-500"
        }`}
      style={{ width: `${value}%` }}
    />
  </div>
);


// ─── Input Component ──────────────────────────────────────────────────────────
const Input = ({
  label,
  required,
  disable = false,
  placeholder,
  type = "text",
  error,
  className = "",
  ...props
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      disabled={disable}
      {...props}
      className={`px-3 py-2.5 rounded-xl border text-sm outline-none transition-all
        ${disable ? "bg-gray-50 text-gray-500 cursor-default" : ""}
        ${error
          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          : disable
            ? "border-gray-100"
            : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        }`}
    />
    {error && (
      <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <span>⚠</span> {error.message}
      </span>
    )}
  </div>
);

// ─── Select Component ─────────────────────────────────────────────────────────
const Select = ({ label, required, options = [], error, disable = false, className = "", ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <select
      disabled={disable}
      {...props}
      className={`px-3 py-2.5 rounded-xl border text-sm outline-none transition-all
        ${disable ? "bg-gray-50 text-gray-500 cursor-default border-gray-100" : ""}
        ${error
          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          : disable
            ? ""
            : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        }`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <span>⚠</span> {error}
      </span>
    )}
  </div>
);


// ─── Main Component ───────────────────────────────────────────────────────────
const AddressAutocomplete = ({ value, setAddress, setLocation, disabled, setState, setCity, setPincode }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && value !== undefined && inputRef.current.value !== value) {
      inputRef.current.value = value || "";
    }
  }, [value]);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;

    script.onload = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "in" },
          fields: ["formatted_address", "address_components", "geometry"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        const getComponent = (type) =>
          place.address_components?.find((component) =>
            component.types.includes(type)
          );

        const country = getComponent("country");
        const state = getComponent("administrative_area_level_1");

        const city =
          getComponent("locality") ||
          getComponent("administrative_area_level_2") ||
          getComponent("sublocality");

        const postal = getComponent("postal_code");

        const locationData = {
          address: place.formatted_address || "",

          country: country?.long_name || "",
          countryCode: country?.short_name || "",

          state: state?.long_name || "",
          stateCode: state?.short_name || "",

          city: city?.long_name || "",

          latitude: place.geometry?.location?.lat(),
          longitude: place.geometry?.location?.lng(),
        };

        console.log("Location:", locationData);

        setAddress(locationData.address);

        setLocation({
          lat: locationData.latitude,
          lng: locationData.longitude,
        });

        // Update form fields for state, city, pincode if setters provided
        if (setState) setState(locationData.stateCode);
        if (setCity) setCity(locationData.city);
        if (setPincode && postal) setPincode(postal?.long_name || "");
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [setState, setCity, setPincode, setAddress, setLocation]);

  const handleManualChange = (e) => {
    const newVal = e.target.value;
    setAddress(newVal);

    // if the user cleared or is retyping, the previously-selected
    // place data is no longer valid — clear dependents
    if (!newVal) {
      setLocation({ lat: undefined, lng: undefined });
      if (setState) setState("");
      if (setCity) setCity("");
      if (setPincode) setPincode("");
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Enter address"
      // className="w-full p-2 px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
      className={`px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition-all
        ${disabled ? "bg-gray-50 text-gray-500 cursor-default border-gray-100" : ""}
       `}
      disabled={disabled}
      onChange={handleManualChange}
    />
  );
};

export default function ProfilePage() {
  const { data } = useGetVendorProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateVendorProfileMutation();
  const { updateProfileCompleteness } = useAuth();

  // ── Location data ───────────────────────────────────────────────────────────
  const {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    statesError,
    citiesError,
    handleStateChange,
    handleCityChange,
    getStateCodeByName
  } = useLocationData('IN');

  // ── Edit mode state ──────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      campusName: "",
      university: "",
      established: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      totalStudents: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      countryCode: "+91",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (data) {
      const campusData = data?.campus || {};
      reset({
        campusName: data?.vendor?.name || "",
        university: campusData.university || "",
        established: campusData.established || "",
        address: campusData.address || "",
        city: campusData.city || "",
        state: campusData.state || "",
        pincode: campusData.pincode || "",
        totalStudents: campusData.total_students || "",
        contactEmail: data?.vendor?.email || "",
        contactPhone: campusData.contact_phone || "",
        website: campusData.website || "",
        countryCode: campusData.country_code || "+91",
      });

      // Set initial location data if exists
      if (campusData.state) {
        const stateCode = getStateCodeByName(campusData.state);
        if (stateCode) {
          handleStateChange(stateCode);
          if (campusData.city) {
            handleCityChange(campusData.city);
          }
        }
      }
    }
  }, [data, reset, getStateCodeByName, handleStateChange, handleCityChange]);


  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: "", label: "Select Year" },
    ...Array.from({ length: currentYear - 1950 + 1 }, (_, i) => {
      const year = currentYear - i;
      return { value: year, label: year };
    }),
  ];

  // ── Cancel edit — reset form & exit edit mode ────────────────────────────────
  const handleCancel = () => {
    reset(); // revert any unsaved changes
    setIsEditing(false);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = async (formdata) => {
    try {
      // Get state name from code for submission
      const selectedStateObj = states.find(state => state.iso2 === selectedState);
      const stateName = selectedStateObj ? selectedStateObj.name : '';

      // Prepare form data with proper state and city names
      const submissionData = {
        ...formdata,
        state: stateName,
        city: selectedCity
      };

      const payload = new FormData();
      payload.append("campus", JSON.stringify(submissionData));

      const result = await updateProfile(payload).unwrap();

      if (result?.profile_complete_percentage !== undefined) {
        // console.log("Profile completeness updated to:", result.profile_complete_percentage);
        updateProfileCompleteness(result.profile_complete_percentage);
        toast.success("Profile updated successfully!");
      }

      setIsEditing(false); // exit edit mode after successful save
    } catch (err) {
      toast.error("Update failed!");
      console.error(err);
    }
  };

  const previewCompletion = data?.profile_complete_percentage ?? 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Campus Profile</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Complete your profile to unlock all features
          </p>
        </div>
        {previewCompletion < 100 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <span className="text-amber-500 text-sm">⚠</span>
            <span className="text-xs font-semibold text-amber-700">
              {previewCompletion}% complete
            </span>
          </div>
        )}
      </div>

      {/* ── Progress Card ── */}
      <div
        className={`rounded-2xl p-5 border ${previewCompletion === 100
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-gray-100 shadow-sm"
          }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${previewCompletion === 100 ? "bg-emerald-100" : "bg-indigo-50"
              }`}
          >
            {previewCompletion === 100 ? "" : ""}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {previewCompletion === 100
                ? "Profile Complete! All features unlocked."
                : `Profile ${previewCompletion}% complete`}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">
              {previewCompletion < 100
                ? "Fill all required fields to unlock the dashboard"
                : "Your campus profile is fully set up"}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{previewCompletion}%</div>
        </div>
        <ProgressBar
          value={previewCompletion}
          showLabel={false}
          color={previewCompletion === 100 ? "emerald" : "indigo"}
        />
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Section header with mode badge */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Campus Information</h3>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${isEditing
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
            >
              {isEditing ? "" : ""}
            </span>
          </div>

          {/* Edit mode hint banner */}
          {isEditing && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 mb-5 text-sm text-indigo-700">
              <span></span>
              <span>Fields are now editable — make your changes and click <strong>Save Profile</strong>.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Campus Name — always locked */}
            <Input
              label="Campus Name"
              required
              placeholder="IIET College of Engineering"
              className="sm:col-span-2"
              disable={true}
              error={errors.campusName}
              {...register("campusName", { required: "Campus name is required" })}
            />

            {/* University */}
            <Input
              label="Affiliated University"
              required
              placeholder="JNTU Hyderabad"
              disable={!isEditing}
              error={errors.university}
              {...register("university", {
                required: "University is required",
                validate: (value) =>
                  value?.trim().length > 0 || "University is required",
                setValueAs: (value) => value.trim() || undefined,
              })}
            />

            {/* Established Year */}
            <Select
              label="Established Year"
              required
              options={yearOptions}
              disable={!isEditing}
              error={errors.established?.message}
              {...register("established", { required: "Year is required" })}
            />

            {/* Address Autocomplete */}
            <Controller
              name="address"
              control={control}
              rules={{
                required: "Address is required",
                validate: (value) =>
                  value?.trim().length > 0 || "Address is required",
              }}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Address <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <AddressAutocomplete
                    value={field.value}
                    disabled={!isEditing}
                    setAddress={(addr) => {
                      field.onChange(addr);
                      setValue('address', addr);
                    }}
                    setLocation={(loc) => {
                      setValue('latitude', loc.lat);
                      setValue('longitude', loc.lng);
                    }}
                    setState={(code) => {
                      setValue('state', code);
                      handleStateChange(code);
                    }}
                    setCity={(city) => {
                      setValue('city', city);
                      handleCityChange(city);
                    }}
                    setPincode={(pincode) => {
                      setValue('pincode', pincode);
                    }}
                  />
                  {errors.address && (
                    <span className="text-xs text-red-500 mt-0.5">
                      {errors.address.message}
                    </span>
                  )}
                </div>
              )}
            />
            {/* Hidden fields for lat/lng */}
            {/* <input type="hidden" {...register('latitude')} />
            <input type="hidden" {...register('longitude')} /> */}


            {/* State Dropdown */}
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    State <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    {...field}
                    disabled={!isEditing || loadingStates}
                    value={selectedState}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      handleStateChange(value);
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-sm outline-none transition-all
                      ${!isEditing || loadingStates
                        ? "bg-gray-50 text-gray-500 cursor-default border-gray-100"
                        : errors.state
                          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      }`}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.iso2} value={state.iso2}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {loadingStates && (
                    <span className="text-xs text-gray-500">Loading states...</span>
                  )}
                  {statesError && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                      <span>⚠</span> {statesError}
                    </span>
                  )}
                  {errors.state && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                      <span>⚠</span> {errors.state.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* City Dropdown */}
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    City <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    {...field}
                    required={true}
                    disabled={!isEditing || loadingCities || !selectedState}
                    value={selectedCity}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      handleCityChange(value);
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-sm outline-none transition-all
                      ${!isEditing || loadingCities || !selectedState
                        ? "bg-gray-50 text-gray-500 cursor-default border-gray-100"
                        : errors.city
                          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      }`}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {loadingCities && (
                    <span className="text-xs text-gray-500">Loading cities...</span>
                  )}
                  {citiesError && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                      <span>⚠</span> {citiesError}
                    </span>
                  )}
                  {/* {!selectedState && !loadingStates && (
                    <span className="text-xs text-gray-500">Please select a state first</span>
                  )} */}
                  {errors.city && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                      <span>⚠</span> {errors.city.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Pincode */}
            <Input
              label="Pincode"
              placeholder="500001"
              disable={!isEditing}
              required={true}
              error={errors.pincode}
              {...register("pincode", {
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{4,10}$/,
                  message: "Enter a valid pincode",
                },
              })}
            />

            {/* Total Students */}
            {/* <Input
              label="Total Students"
              placeholder="2500"
              type="number"
              disable={!isEditing}
              error={errors.totalStudents}
              {...register("totalStudents", {
                min: { value: 1, message: "Must be at least 1" },
              })}
            /> */}

            {/* Contact Email — always locked */}
            <Input
              label="Contact Email"
              required
              placeholder="placement@college.edu"
              type="email"
              disable={true}
              error={errors.contactEmail}
              {...register("contactEmail", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {/* Phone */}
            <Controller
              name="contactPhone"
              control={control}
              rules={{
                required: "Phone number is required",
                validate: (value) => {
                  const phone = String(value || "").trim();

                  if (!phone) {
                    return "Phone number is required";
                  }

                  if (phone.startsWith("0")) {
                    return "Phone number cannot start with 0";
                  }

                  if (!/^[1-9][0-9]{9}$/.test(phone)) {
                    return "Enter a valid 10-digit phone number";
                  }

                  return true;
                },
              }}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Contact Phone <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <PhoneInput
                    country="in"
                    disabled={!isEditing}
                    value={field.value ? `${watch("countryCode") || "+91"}${field.value}` : ""}
                    inputStyle={{ width: "100%" }}
                    onChange={(val, countryData) => {
                      // Extract local number without country code
                      const localNumber = val.startsWith(countryData.dialCode)
                        ? val.substring(countryData.dialCode.length)
                        : val;
                      field.onChange(localNumber);
                      // Update country code separately with + symbol
                      setValue("countryCode", `+${countryData.dialCode}`);
                    }}
                    inputProps={{
                      required: true,
                      name: "contactPhone",
                    }}
                  />
                  {errors.contactPhone && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                      <span>⚠</span> {errors.contactPhone.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Website */}
            <Input
              label="Website"
              placeholder="https://college.edu"
              disable={!isEditing}
              required={true}
              error={errors.website}
              {...register("website", {
                pattern: {
                  value: /^https?:\/\/.+\..+/,
                  message: "Enter a valid URL starting with http:// or https://",
                },
              })}
            />
          </div>

          {/* ── Action Buttons ── */}
          <div className="mt-6 flex gap-3 justify-end">
            {isEditing ? (
              <>
                {/* Cancel — revert & exit edit mode */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border cursor-pointer border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ✕ Cancel
                </button>

                {/* Save */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md
                    ${isLoading
                      ? "bg-emerald-400 text-white shadow-emerald-100 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
                    }`}
                >
                  {isLoading ? "Saving..." : "💾 Save Profile"}
                </button>
              </>
            ) : (
              /* Edit button — enter edit mode */
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 cursor-pointer rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}