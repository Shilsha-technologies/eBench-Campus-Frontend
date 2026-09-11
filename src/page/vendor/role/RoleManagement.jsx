import { useState, useRef, useEffect } from 'react'
import { Pagination } from '../user/UserManagement'
import { Eye, KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetCountryDataQuery } from '../../../redux/services/externalApi'
import { getStatesByCountry, getCitiesByState } from '../../../services/locationApi'
import { useActiveDeactiveSubVendorMutation, useAssignSubVendorSubscriptionMutation, useListofSubscriptionQuery, useListofSubVendorQuery, useRegisterSubVendorMutation } from '../../../redux/services/vendorApi'
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from 'react-hot-toast'
import {
  MoreVertical,
  CheckCircle,
  XCircle
} from "lucide-react";
import PortalModal from '../../../libs/PortalModal'
import Select from "react-select";
import Loader from '../../../libs/Loader'
import { Input } from '../../../libs/Ui'
import { getCountryFromTimeZone } from '../Profile'

// Shared react-select styling so country/state/city match the app's normal
// input look (border, radius, red border on validation error).
const getSelectStyles = (hasError) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderRadius: "0.25rem",
    borderColor: hasError ? "#ef4444" : state.isFocused ? "#9ca3af" : "#d1d5db",
    boxShadow: "none",
    "&:hover": { borderColor: hasError ? "#ef4444" : "#9ca3af" },
  }),
  placeholder: (base) => ({ ...base, color: "#6b7280", fontSize: "0.875rem" }),
  singleValue: (base) => ({ ...base, color: "#6b7280", fontSize: "0.875rem" }),
  option: (base) => ({ ...base, fontSize: "0.875rem" }),
});

// ─── Shared Google Maps script loader (avoids injecting the script twice when
// two AddressAutocomplete inputs are mounted in the same modal) ──────────────
let googleMapsLoaderPromise = null;
const loadGoogleMapsScript = () => {
  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve();
  }
  if (googleMapsLoaderPromise) return googleMapsLoaderPromise;

  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps-places]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.dataset.googleMapsPlaces = 'true';
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return googleMapsLoaderPromise;
};

// ─── Google Places address input ─────────────────────────────────────────────
// Reusable across Branch Address / POC Address. Pass `onPlaceSelected` to react
// to country/state/city/pincode/lat-lng once the user picks a place; pass
// `countryRestriction` (ISO2, e.g. "IN") to scope suggestions to that country.
const AddressAutocomplete = ({
  value,
  setAddress,
  setLocation,
  onPlaceSelected,
  countryRestriction,
  disabled,
  placeholder = "Enter address",
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && value !== undefined && inputRef.current.value !== value) {
      inputRef.current.value = value || "";
    }
  }, [value]);

  useEffect(() => {
    let autocomplete;
    let listener;
    let cancelled = false;

    loadGoogleMapsScript().then(() => {
      if (cancelled || !inputRef.current || !window.google) return;

      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: countryRestriction
          ? { country: countryRestriction.toLowerCase() }
          : undefined,
        fields: ["formatted_address", "address_components", "geometry"],
      });

      listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        const getComponent = (type) =>
          place.address_components?.find((component) => component.types.includes(type));

        const country = getComponent("country");
        const state = getComponent("administrative_area_level_1");
        const city =
          getComponent("locality") ||
          getComponent("administrative_area_level_2") ||
          getComponent("sublocality");
        const postal = getComponent("postal_code");

        const locationData = {
          address: place.formatted_address || "",
          countryCode: country?.short_name || "",
          stateCode: state?.short_name || "",
          city: city?.long_name || "",
          pincode: postal?.long_name || "",
          latitude: place.geometry?.location?.lat(),
          longitude: place.geometry?.location?.lng(),
        };

        setAddress(locationData.address);
        setLocation?.({ lat: locationData.latitude, lng: locationData.longitude });
        onPlaceSelected?.(locationData);
      });
    });

    return () => {
      cancelled = true;
      if (listener) window.google?.maps?.event?.removeListener(listener);
    };
  }, [countryRestriction]);

  const handleManualChange = (e) => {
    const newVal = e.target.value;
    setAddress(newVal);
    if (!newVal) {
      setLocation?.({ lat: undefined, lng: undefined });
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleManualChange}
      className={`border outline-none rounded px-3 text-gray-500 py-2 w-full ${disabled ? "bg-gray-50 cursor-default border-gray-100" : "border-gray-300"
        }`}
    />
  );
};

const RoleManagement = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [editing, setEditing] = useState(false)
  const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();

  const userCountry = getCountryFromTimeZone() || 'IN';
  const [query, setQuery] = useState({
    search: '',
    active: '',
    plan: '',
    page: page,
    size: pageSize,
  });

  const { data: users, isLoading, isError } = useListofSubVendorQuery(query)

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page, size: pageSize }));
  }, [page, pageSize]);

  const { data: subscriptionList } = useListofSubscriptionQuery()
  const [registerSubVendor, { isLoading: subVendorLoading, isError: subVendorError }] = useRegisterSubVendorMutation()
  const [activeInactiveSubVendor, { isLoading: aciveLoading, isError: activeError }] = useActiveDeactiveSubVendorMutation()
  const globalId = subscriptionList?.subscriptions?.find((item) => item?.country === "global")

  const filteredSubscription = subscriptionList?.subscriptions?.filter((item) => item?.country !== "global")

  if (isError) {
    return <>Something went wrong</>
  }

  const total = users?.total

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      country: "",
      state: "",
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      pocName: "",
      pocEmail: "",
      pocCountryCode: "+91",
      pocMobile: "",
      pocGender: "",
      pocAddress: "",
    }
  });

  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [statesCache, setStatesCache] = useState({});
  const [citiesCache, setCitiesCache] = useState({});
  const [loadingState, setLoadingState] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  // ── ISO-keyed state/city loaders, shared by the country/state selects and
  // the Google autocomplete on Branch Address ──────────────────────────────
  const loadStatesForCountry = async (countryIso) => {
    if (!countryIso) return;
    if (statesCache[countryIso]) {
      setStateOptions(statesCache[countryIso]);
      return;
    }
    setLoadingState(true);
    try {
      const states = await getStatesByCountry(countryIso);
      setStateOptions(states);
      setStatesCache((prev) => ({ ...prev, [countryIso]: states }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingState(false);
    }
  };

  const loadCitiesForState = async (countryIso, stateIso) => {
    if (!countryIso || !stateIso) return;
    const countryCache = citiesCache[countryIso] || {};
    if (countryCache[stateIso]) {
      setCityOptions(countryCache[stateIso]);
      return;
    }
    setLoadingCity(true);
    try {
      const cities = await getCitiesByState(countryIso, stateIso);
      setCityOptions(cities);
      setCitiesCache((prev) => ({
        ...prev,
        [countryIso]: {
          ...(prev[countryIso] || {}),
          [stateIso]: cities,
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCity(false);
    }
  };

  const save = async (data) => {
    const {
      country,
      state,
      city,
      address,
      latitude,
      longitude,
      pocName,
      pocEmail,
      pocCountryCode,
      pocMobile,
      pocGender,
      pocAddress,
    } = data;

    // country/state are stored as ISO2 in the form for the cascading APIs —
    // resolve them back to display names for submission.
    const countryName = countryData?.data?.find((c) => c.iso2 === country)?.name || country;
    const stateName = stateOptions?.find((s) => s.iso2 === state)?.name || state;
    const countryCode = pocCountryCode || "+91";


    // Final shape: country/state as full names, phone split into
    // countryCode + a plain local number.
    const submissionData = {
      country: countryName,
      state: stateName,
      city,
      address,
      latitude,
      longitude,
      pocName,
      pocEmail,
      pocCountryCode: countryCode,
      pocMobile,
      pocGender,
      pocAddress,
    };
    console.log(submissionData);

    const formdata = new FormData()
    formdata.append('state', stateName)
    formdata.append('city', city)
    formdata.append('email', pocEmail)
    formdata.append('name', pocName)
    formdata.append('country', countryName)
    formdata.append('company_address', address)
    formdata.append('gender', pocGender)
    formdata.append('sub_vendor_address', pocAddress)
    formdata.append('phone', pocMobile)
    formdata.append('country_code', countryCode)
    // if (latitude) formdata.append('latitude', latitude)
    // if (longitude) formdata.append('longitude', longitude)

    try {
      const data = await registerSubVendor(formdata)

      if (data?.error) {
        return toast.error(data?.error?.data?.detail)
      }
      if (data?.data) {
        setTimeout(() => {
          setEditing(false);
          reset();
          setStateOptions([]);
          setCityOptions([]);
        }, 500)
      }
    } catch (err) {
      toast.error(err?.message)
    }

  };

  function handleClose() {
    setAssignPermission(false);
    reset();
    setStateOptions([]);
    setCityOptions([]);
  }

  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [assignPermission, setAssignPermission] = useState(false)


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenId(null);
      }
    }
    // Watch country selection to load states (ISO2-keyed)
    const subscription = watch((value, { name }) => {
      if (name === "country") {
        const selectedCountry = value.country;
        if (selectedCountry) {
          loadStatesForCountry(selectedCountry);
        } else {
          setStateOptions([]);
        }
        // Reset state and city when country changes
        setValue('state', '');
        setValue('city', '');
        setCityOptions([]);
        setLoadingCity(false);
      }
      if (name === "state") {
        const selectedState = value.state;
        const selectedCountry = value.country;
        if (selectedState && selectedCountry) {
          loadCitiesForState(selectedCountry, selectedState);
        }
        setValue('city', '');
      }
    });

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      subscription.unsubscribe && subscription.unsubscribe();
    };
  }, []);


  const [confirmStatusModal, setConfirmStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const handleActiveInactive = async () => {
    const { active, id } = selectedUser
    const formdata = new FormData();
    formdata.append("active", !active)

    try {
      const result = await activeInactiveSubVendor({ id, formdata })
      if (result?.data) {
        setTimeout(() => {
          setSelectedUser(null)
          setConfirmStatusModal(false)
          toast.success(result?.data?.message)
        })
      }
      if (activeError) {
        return toast.error(result?.error?.data?.detail)
      }
    } catch (err) {
      toast.error(err?.message ?? "Internal Server Error")
    }
  }

  const {
    control: subControl,
    register: subscriptionRegister,
    handleSubmit: subscriptionHandleSubmit,
    watch: subscriptionWatch,
    resetField,
    formState: { errors: subscriptionErrors }
  } = useForm({
    defaultValues: {
      subscriptionType: "",
      subscription_id: "",
      subscriptionCountry: [],
    }
  });

  const subscriptionType = subscriptionWatch("subscriptionType");
  const [assignPermissionFunction, { isLoading: assignisLoading, assignisError }] = useAssignSubVendorSubscriptionMutation()

  const subscriptionSave = async (data) => {
    const details = {}
    if (data?.subscriptionType == "global") {
      details.selected_country = data?.subscriptionCountry?.map((item) => item?.value)
      details.subscription_ids = [globalId?.subscription_id]

    } else {
      details.subscription_ids = data?.subscriptionCountry?.map((item) => item?.value)
    }
    let id = selectedUser?.id;

    try {
      const result = await assignPermissionFunction({ id, details }).unwrap();
      if (result?.status) {
        setAssignPermission(!assignPermission)
        setSelectedUser(null)
        setTimeout(() => {
          toast.success(result?.message)
        }, 1000)
      }
    } catch (err) {
      if (err?.data) {
        toast.error(err?.data?.detail ?? "Internal Server Error")
      }
      console.log(err)
    }

  }

  const countryOptions =
    countryData?.data?.map((c) => ({
      value: c.name,
      label: c.name,
    })) || [];

  // ISO2 of the currently selected employee country — scopes the Branch
  // Address autocomplete to that country's places.
  const selectedCountryIso = watch("country");

  return (
    <div className="p-6 pt-3 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sub Admin (Employee)</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {total ?? 0} total sub admin added
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              + Add Sub Admin
            </button>

          </div>
        </div>


        <div className="bg-white my-5 rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-48">
            <input placeholder="&#x1f50d; Search by name or email..." value={query.search}
              onChange={(e) => setQuery({ ...query, search: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50" />
          </div>


        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>

                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Address
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : users?.sub_vendors?.length == 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  users?.sub_vendors?.map((u, index) => (
                    <tr
                      key={u.id}
                      className={`text-sm text-gray-600 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                    >
                      <td className="px-6 py-4">{u?.name}</td>

                      <td className="px-6 py-2">
                        {u?.email}
                      </td>

                      <td className="px-6 py-4">{u.country}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
      ${u.active
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-100 text-red-700 border border-red-200'}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${u.active ? 'bg-green-500' : 'bg-red-500'
                              }`}
                          ></span>

                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {'+' + u?.phone}
                      </td>

                      <td className="px-6 py-4">
                        {u?.sub_vendor_address}
                      </td>

                      <td className="px-8 py-4  relative text-right">
                        {/* Three Dots Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            const rect = e.currentTarget.getBoundingClientRect();

                            setDropdownPos({
                              top: rect.bottom + window.scrollY,
                              left: rect.right - 192 // width of dropdown
                            });

                            setOpenId(openId === u.id ? null : u.id);
                          }}
                          className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition duration-200"
                        >
                          <MoreVertical size={18} />
                        </button>


                        {/* Animated Dropdown */}
                        {openId === u.id &&
                          (
                            <div
                              ref={dropdownRef}
                              style={{
                                position: "fixed",
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                              }}
                              className="w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-9999
               transform transition-all duration-200 ease-out
               animate-in fade-in zoom-in-95"
                            >

                              {/* View */}
                              <button
                                onClick={() => {
                                  navigate(`/vendor/employee/view?id=${u.id}`);
                                  setOpenId(null);
                                }}
                                className="flex items-center cursor-pointer gap-3 w-full px-4 py-2 text-sm text-gray-700
                     hover:bg-gray-50 transition duration-150"
                              >
                                <Eye size={16} className="text-blue-500" />
                                View
                              </button>

                              {/* Activate / Deactivate */}
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setConfirmStatusModal(true);
                                  setOpenId(null);
                                }}
                                className="flex items-center cursor-pointer gap-3 w-full px-4 py-2 text-sm
                     hover:bg-gray-50 transition duration-150"
                              >
                                {u.active ? (
                                  <>
                                    <XCircle size={16} className="text-red-500" />
                                    <span className="text-red-600">Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={16} className="text-green-500" />
                                    <span className="text-green-600">Activate</span>
                                  </>
                                )}
                              </button>
                              {/* assign permission */}
                              <button
                                onClick={() => {
                                  setAssignPermission(true)
                                  setSelectedUser(u)
                                  setOpenId(null);
                                }}
                                className="flex items-center cursor-pointer gap-3 w-full px-4 py-2 text-sm text-gray-700
                               hover:bg-gray-50 transition duration-150"
                              >
                                <KeyRound size={16} className="text-blue-500" />
                                Assign Permission
                              </button>

                            </div>
                          )}
                      </td>


                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* Pagination */}
          {users?.sub_vendors?.length > 0 && (
            <div className="p-4  flex items-center justify-between">
              <div className="text-sm text-[#286a94]">
                Showing {Math.min((page - 1) * pageSize + 1, total)}-
                {Math.min(page * pageSize, total)} of {total} employees
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#286a94]">Rows</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-2 py-1 rounded-md border border-[#286a94] text-[#286a94] bg-white"
                  >
                    {[10, 20, 50].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <Pagination
                  page={page}
                  totalPages={users?.total_pages}
                  setPage={setPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {
        editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={handleClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-xl overflow-y-auto max-h-80 md:max-h-full p-6 bg-white rounded-lg shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">Add Employee</h2>
              <hr className=" text-gray-300 mb-4" />
              <form className="space-y-4" onSubmit={handleSubmit(save)}>
                <div className="grid md:grid-cols-2 gap-4">

                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 font-semibold mb-1" htmlFor="country">
                      Country
                    </label>
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field }) => {
                        const options =
                          countryData?.data?.map((item) => ({
                            value: item?.iso2,
                            label: item?.name,
                          })) || [];
                        return (
                          <Select
                            inputId="country"
                            options={options}
                            isClearable
                            isLoading={countryLoading}
                            placeholder="Select Country"
                            classNamePrefix="rs"
                            styles={getSelectStyles(!!errors.country)}
                            value={options.find((opt) => opt.value === field.value) || null}
                            onChange={(selected) => field.onChange(selected?.value || "")}
                            onBlur={field.onBlur}
                          />
                        );
                      }}
                    />
                    {errors.country && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.country.message}
                      </span>
                    )}
                  </div>
                  {/* State Select — value is ISO2, used directly in getCitiesByState */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 font-semibold mb-1" htmlFor="state">
                      State
                    </label>
                    <Controller
                      name="state"
                      control={control}
                      rules={{ required: "State is required" }}
                      render={({ field }) => {
                        const options = stateOptions?.map((st) => ({ value: st.iso2, label: st.name })) || [];
                        return (
                          <Select
                            inputId="state"
                            options={options}
                            isClearable
                            isLoading={loadingState}
                            isDisabled={!watch("country")}
                            placeholder="Select State"
                            classNamePrefix="rs"
                            styles={getSelectStyles(!!errors.state)}
                            value={options.find((opt) => opt.value === field.value) || null}
                            onChange={(selected) => field.onChange(selected?.value || "")}
                            onBlur={field.onBlur}
                          />
                        );
                      }}
                    />
                    {errors.state && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                  {/* City Select */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 font-semibold mb-1" htmlFor="city">
                      City
                    </label>
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: "City is required" }}
                      render={({ field }) => {
                        const options = cityOptions?.map((c) => ({ value: c.name, label: c.name })) || [];
                        return (
                          <Select
                            inputId="city"
                            options={options}
                            isClearable
                            isLoading={loadingCity}
                            isDisabled={!watch("state")}
                            placeholder="Select City"
                            classNamePrefix="rs"
                            styles={getSelectStyles(!!errors.city)}
                            value={options.find((opt) => opt.value === field.value) || null}
                            onChange={(selected) => field.onChange(selected?.value || "")}
                            onBlur={field.onBlur}
                          />
                        );
                      }}
                    />
                    {errors.city && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  {/* Branch Address — Google Places autocomplete, scoped to the
                      selected country, also drives country/state/city above */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 font-semibold mb-1">
                      Branch Address
                    </label>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: "Branch Address is required" }}
                      render={({ field }) => (
                        <AddressAutocomplete
                          value={field.value}
                          placeholder="Branch Location"
                          countryRestriction={selectedCountryIso}
                          setAddress={(addr) => field.onChange(addr)}
                          setLocation={(loc) => {
                            setValue('latitude', loc.lat);
                            setValue('longitude', loc.lng);
                          }}
                          onPlaceSelected={(loc) => {
                            if (loc.countryCode) {
                              setValue('country', loc.countryCode);
                              loadStatesForCountry(loc.countryCode);
                            }
                            if (loc.stateCode) {
                              setValue('state', loc.stateCode);
                              loadCitiesForState(loc.countryCode, loc.stateCode);
                            }
                            if (loc.city) setValue('city', loc.city);
                          }}
                        />
                      )}
                    />
                    {errors.address && (
                      <span className="text-red-500 text-xs">
                        {errors.address.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <Input
                      label="POC Name"
                      name="pocName"
                      placeholder="Employee Name"
                      {...register("pocName", { required: "POC Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" }, maxLength: { value: 50, message: "Name must be at most 50 characters" }, validate: (value) => value.trim() === value || "Name cannot have leading or trailing spaces" })}
                    />
                    {errors.pocName && (
                      <span className="text-red-500 text-xs">
                        {errors.pocName.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <Input
                      label="POC Email"
                      name="pocEmail"
                      placeholder="Employee Email"
                      {...register("pocEmail", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    {errors.pocEmail && (
                      <span className="text-red-500 text-xs">
                        {errors.pocEmail.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 font-semibold mb-1">
                      Gender
                    </label>
                    <select
                      {...register("pocGender", { required: "Gender is required" })}
                      disabled={!editing}
                      className="border border-gray-300 text-gray-500 rounded p-2 w-full"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.pocGender && (
                      <span className="text-red-500 text-xs">
                        {errors.pocGender.message}
                      </span>
                    )}
                  </div>

                  {/* POC Address — Google Places autocomplete, unrestricted
                      (this is the employee's own address, independent of the
                      branch's country/state/city) */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 font-semibold mb-1">
                      POC Address
                    </label>
                    <Controller
                      name="pocAddress"
                      control={control}
                      rules={{ required: "POC Address is required" }}
                      render={({ field }) => (
                        <AddressAutocomplete
                          value={field.value}
                          placeholder="Employee Address"
                          setAddress={(addr) => field.onChange(addr)}
                        />
                      )}
                    />
                    {errors.pocAddress && (
                      <span className="text-red-500 text-xs">
                        {errors.pocAddress.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-semibold mb-1">
                      POC Phone
                    </label>
                    <Controller
                      name="pocMobile"
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
                          return true;
                        },
                      }}

                      render={({ field }) => (
                        <PhoneInput
                          country={userCountry.toLowerCase()}
                          value={
                            field.value
                              ? `${(watch("pocCountryCode") || "+91").replace("+", "")}${field.value}`
                              : ""
                          }
                          inputStyle={{ width: "100%" }}
                          onChange={(val, countryData) => {
                            // Split the dial code from the local number so
                            // `pocMobile` and `pocCountryCode` stay separate.
                            const localNumber = val.startsWith(countryData.dialCode)
                              ? val.substring(countryData.dialCode.length)
                              : val;
                            field.onChange(localNumber);
                            setValue("pocCountryCode", `+${countryData.dialCode}`);
                          }}

                        />
                      )}
                    />
                    {errors.pocMobile && (
                      <span className="text-red-500 text-xs">
                        {errors.pocMobile.message}
                      </span>
                    )}
                  </div>

                </div>

                <div className="flex flex-row gap-3">
                  <button
                    type="submit"
                    className="px-4 cursor-pointer py-1.5 rounded-md bg-[#1b68c0]  text-white hover:bg-blue-500 transition"
                  >
                    {subVendorLoading ? 'Saving...' : 'Save'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleClose(); setEditing(false) }}
                    className="px-4 cursor-pointer py-1.5 rounded-md bg-red-500 text-white hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {/* ================ x =============================== x ====================== */}
            </div>
          </div>
        )
      }


      {
        assignPermission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* modal */}
            <div className="relative w-full max-h-10/12 max-w-2xl bg-white rounded-xl shadow-2xl overflow-y-auto animate-fadeIn">

              {/* HEADER */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Assign Subsciption Permission
                </h2>
                <p className="text-sm text-gray-500">
                  provide sub-vendor with subscription access
                </p>
              </div>

              {/* FORM */}
              <form
                onSubmit={subscriptionHandleSubmit(subscriptionSave)}
                className="p-6 space-y-6"
              >

                {/* ================= SUBSCRIPTION TYPE ================= */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Choose Subscription Type <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-2 gap-4 mt-3">

                    {/* GLOBAL */}
                    <label
                      className={`cursor-pointer border rounded-xl p-4 transition-all block
        ${subscriptionType === "global"
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-400"
                        }`}
                    >
                      <input
                        type="radio"
                        value="global"
                        {...subscriptionRegister("subscriptionType", {
                          required: "Subscription type is required"
                        })}
                        className="hidden"
                      />
                      <div className="text-lg font-semibold">🌍 Global</div>
                    </label>

                    {/* COUNTRY */}
                    <label
                      className={`cursor-pointer border rounded-xl p-4 transition-all block
        ${subscriptionType === "country"
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-400"
                        }`}
                      onClick={() => resetField("subscriptionCountry")}
                    >
                      <input
                        type="radio"
                        value="country"
                        {...subscriptionRegister("subscriptionType", {
                          required: "Subscription type is required"
                        })}
                        className="hidden"
                      />
                      <div className="text-lg font-semibold">🏳️ Country Specific</div>
                    </label>
                  </div>

                  {subscriptionErrors.subscriptionType && (
                    <p className="text-red-500 text-xs mt-2">
                      {subscriptionErrors.subscriptionType.message}
                    </p>
                  )}
                </div>

                {subscriptionType === "global" && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Select Region
                    </label>

                    <Controller
                      name="subscriptionCountry"
                      control={subControl}
                      rules={{
                        validate: (value) =>
                          subscriptionType === "global"
                            ? (value && value.length > 0) || "At least one region is required"
                            : true,
                      }}
                      render={({ field }) => (
                        <Select
                          options={countryOptions}
                          isMulti
                          placeholder="Select regions"
                          className="mt-2"
                          value={field.value}
                          onChange={(selected) => field.onChange(selected)}
                        />
                      )}
                    />
                  </div>
                )}

                {/* COUNTRY */}
                {subscriptionType === "country" && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Country
                    </label>

                    <Controller
                      name="subscriptionCountry"
                      control={subControl}
                      rules={{
                        validate: (value) =>
                          subscriptionType === "country"
                            ? (value && value.length > 0) || "At least one country is required"
                            : true,
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isMulti   // ⭐ enables multi select
                          options={
                            filteredSubscription?.map((c) => ({
                              value: c.subscription_id,
                              label: `${c.country} - ${c.plan_name}`,
                            })) || []
                          }
                          placeholder="Select countries"
                          className="mt-2"
                          value={field.value || []}
                          onChange={(selectedOptions) => field.onChange(selectedOptions)}
                        />
                      )}
                    />

                    {subscriptionErrors.subscriptionCountry && (
                      <p className="text-red-500 text-xs mt-1">
                        {subscriptionErrors.subscriptionCountry.message}
                      </p>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg cursor-pointer bg-blue-600 text-white"
                >
                  {assignisLoading ? 'Loading' : 'Assign Permission'}
                </button>
              </form>
            </div>
          </div>
        )
      }

      {
        confirmStatusModal && (
          <PortalModal>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[380px] shadow-lg">

                <h3 className="text-lg font-semibold mb-2">
                  {selectedUser?.active ? "Deactivate Employee" : "Activate Employee"}
                </h3>

                <p className="text-gray-600 mb-5">
                  Are you sure you want to{" "}
                  <span className="font-semibold">
                    {selectedUser?.active ? "deactivate" : "activate"}
                  </span>{" "}
                  this employee?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmStatusModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleActiveInactive}
                    className={`px-4 py-2 text-white rounded-lg ${selectedUser?.active ? "bg-red-600" : "bg-green-600"
                      }`}
                  >
                    {aciveLoading ? 'Loading' : 'Confirm'}
                  </button>
                </div>

              </div>
            </div>
          </PortalModal>
        )
      }
    </div >
  )
}

export default RoleManagement