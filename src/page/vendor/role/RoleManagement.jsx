import { useState, useRef, useEffect } from 'react'
import { Pagination } from '../user/UserManagement'
import { Eye, KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetCountryDataQuery } from '../../../redux/services/externalApi'
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


const RoleManagement = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [editing, setEditing] = useState(false)
  const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();

  const [query, setQuery] = useState({
    search: '',
    active: '',
    plan: '',
    page: 1,
    size: 10,
  });

  const { data: users, isLoading, isError } = useListofSubVendorQuery(query)
  const { data: subscriptionList } = useListofSubscriptionQuery()
  const [registerSubVendor, { isLoading: subVendorLoading, isError: subVendorError }] = useRegisterSubVendorMutation()
  const [activeInactiveSubVendor, { isLoading: aciveLoading, isError: activeError }] = useActiveDeactiveSubVendorMutation()
  // console.log("useListofSubscriptionQuery", subscriptionList)
  const globalId = subscriptionList?.subscriptions?.find((item) => item?.country === "global")
  console.log("globalId", globalId)

  const filteredSubscription = subscriptionList?.subscriptions?.filter((item) => item?.country !== "global")

  // console.log("filteredSubscription", filteredSubscription)
  if (isError) {
    return <>Something went wrong</>
  }

  const total = users?.total

  const {
    register,
    handleSubmit,
    control,
    reset,                                                                       
    formState: { errors }
  } = useForm({
    defaultValues: {
      country: "",
      address: "",
      pocName: "",
      pocEmail: "",
      pocMobile: "",
      pocGender: "",
      pocAddress: "",
    }
  });

  const save = async (data) => {
    console.log("Form Data:", data);
    const {
      country,
      address,
      pocName,
      pocEmail,
      pocMobile,
      pocGender,
      pocAddress,
    } = data;
    const formdata = new FormData()
    formdata.append('email', pocEmail)
    formdata.append('name', pocName)
    formdata.append('country', country)
    formdata.append('company_address', address)
    formdata.append('gender', pocGender)
    formdata.append('sub_vendor_address', pocAddress)
    formdata.append('phone', pocMobile)

    try {
      const data = await registerSubVendor(formdata)
      console.log(data, "hello-data");
      if (subVendorError) {
        return toast.error(data?.error?.data?.detail ?? "Something went wrong")
      }
      if (data?.data) {
        setTimeout(() => {
          setEditing(false);
          reset();
        }, 500)
      }
    } catch (err) {
      console.log("ererer", err)
      toast.error(err?.message ?? "Something went wrong")
    }

  };

  function handleClose() {
    setAssignPermission(false);
    reset();
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      console.log("resi", result);
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
    console.log("saving", data)
    // console.log(data);
    let subscriptionId = null;
    const details = {}
    if (data?.subscriptionType == "global") {
      details.selected_country=data?.subscriptionCountry?.map((item) => item?.value)
      details.subscription_ids =[globalId?.subscription_id]

    } else {
      details.subscription_ids = data?.subscriptionCountry?.map((item) => item?.value)
    }
    // console.log("ooo",subscriptionId)
    // console.log("uu",selectedUser)
    let id = selectedUser?.id;
    // console.log("popopop", details, id)

    try {
      const result = await assignPermissionFunction({ id, details }).unwrap();
      // console.log("resdd", result);
      if (result?.status) {
        assignPermission
        setAssignPermission(!assignPermission)
        setSelectedUser(null)
        setTimeout(() => {
          toast.success(result?.message)
        }, 1000)
      }
    } catch (err) {
      if(err?.data){
        toast.error(err?.data?.detail??"Internal Server Error")
      }
      console.log(err)
    }

  }

  const countryOptions =
    countryData?.data?.map((c) => ({
      value: c.name,
      label: c.name,
    })) || [];

  return (
    <div className="p-6 pt-3 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        
         <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sub Admin (Employee)</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {total??0} total sub admin added
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
      onChange={(e) => setQuery({...query, search: e.target.value})}
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
                      <Loader/>
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
                        {'+'+ u?.phone}
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
                  totalPages={1}
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
              <h2 className="mb-2 text-lg font-semibold">Add Sub-Admin (Employee)</h2>
              <hr className=" text-gray-300 mb-4" />
              <form className="space-y-4" onSubmit={handleSubmit(save)}>
                <div className="grid md:grid-cols-2 gap-4">

                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 font-semibold mb-1" htmlFor="country">
                      Country
                    </label>
                    <select
                      {...register("country", { required: "Country is required" })}
                      className={`border outline-none rounded px-3 text-gray-500 py-2 ${errors.country ? "border-red-500" : "border-gray-300"
                        } ${false ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select Country</option>
                      {countryData?.data?.length > 0 &&
                        countryData?.data?.map((item) => (
                          <option key={item?.name} value={item?.name}>
                            {item?.name}
                          </option>
                        ))}
                    </select>
                    {errors.country && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.country.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <Input
                      label="Branch Address"
                      name="address"
                      placeholder="Branch Location"
                      {...register("address", { required: "Branch Address is required" })}
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
                      {...register("pocName", { required: "POC Name is required" })}
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

                  <div className="flex flex-col">
                    <Input
                      label="POC Address"
                      name="pocAddress"
                      placeholder="Employee Address"
                      {...register("pocAddress", {
                        required: "POC Address is required",
                      })}
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
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <PhoneInput
                          country="in"
                          {...field}
                          inputStyle={{ width: "100%" }}
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
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditing(false)}
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

                {/* REGION */}
                {/* {subscriptionType === "global" && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Select Region
                    </label>

                    <select
                      {...subscriptionRegister("subscriptionCountry", {
                        validate: (value) =>
                          subscriptionType === "global"
                            ? !!value || "Region is required"
                            : true,
                      })}
                      className="mt-2 w-full border border-gray-200 rounded-lg p-2"
                    >
                      <option value="">Select Region</option>
                      {countryData?.data?.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {subscriptionErrors.subscriptionCountry && (
                      <p className="text-red-500 text-xs mt-1">
                        {subscriptionErrors.subscriptionCountry.message}
                      </p>
                    )}
                  </div>
                )} */}
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


//================================

// import { useState } from "react";
// import { Input, Modal, Select, Table } from "../../../libs/Ui";


// export default function EmployeesPage() {
//   const [ employees, setEmployees ] =useState([])
//   const [showModal, setShowModal] = useState(false);
//   const [editEmployee, setEditEmployee] = useState(null);
//   const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Coordinator", department: "Training & Placement" });
//   const [errors, setErrors] = useState({});
//   const [search, setSearch] = useState("");

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
//     if (!form.phone.trim()) e.phone = "Phone is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;
//     if (editEmployee) {
//       setEmployees(prev => prev.map(e => e.id === editEmployee.id ? { ...e, ...form } : e));
//       addToast("Employee updated!");
//     } else {
//       setEmployees(prev => [...prev, { id: Date.now(), ...form, status: "active", joinDate: new Date().toISOString().split("T")[0] }]);
//       addToast("Employee added!");
//     }
//     setShowModal(false);
//     setEditEmployee(null);
//     setForm({ name: "", email: "", phone: "", role: "Coordinator", department: "Training & Placement" });
//   };

//   const openEdit = (emp) => {
//     setEditEmployee(emp);
//     setForm({ name: emp.name, email: emp.email, phone: emp.phone, role: emp.role, department: emp.department });
//     setErrors({});
//     setShowModal(true);
//   };

//   const toggleStatus = (id) => {
//     setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "active" ? "inactive" : "active" } : e));
//     addToast("Employee status updated.");
//   };

//   const filtered = employees.filter(e =>
//     e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
//   );

//   const columns = [
//     {
//       key: "name", label: "Employee", render: (v, row) => (
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600">
//             {v.split(" ").map(w => w[0]).slice(0, 2).join("")}
//           </div>
//           <div><div className="font-medium text-gray-900">{v}</div><div className="text-xs text-gray-400">{row.email}</div></div>
//         </div>
//       )
//     },
//     { key: "role", label: "Role", render: v => <Badge variant="indigo">{v}</Badge> },
//     { key: "department", label: "Department" },
//     { key: "joinDate", label: "Joined", render: v => new Date(v).toLocaleDateString("en-IN") },
//     { key: "status", label: "Status", render: v => <Badge variant={v === "active" ? "green" : "red"}>{v}</Badge> },
//     {
//       key: "actions", label: "Actions", render: (_, row) => (
//         <div className="flex gap-2">
//           <button onClick={() => openEdit(row)} className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-2.5 py-1 rounded-lg font-medium">Edit</button>
//           <button onClick={() => toggleStatus(row.id)} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${row.status === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
//             {row.status === "active" ? "Deactivate" : "Activate"}
//           </button>
//         </div>
//       )
//     },
//   ];
  


//   return (
//     <div className="p-2 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Employees</h2>
//           <p className="text-sm text-gray-500 mt-0.5">{employees.length} employees in your team</p>
//         </div>
//         <button
//           onClick={() => { setEditEmployee(null); setForm({ name: "", email: "", phone: "", role: "Coordinator", department: "Training & Placement" }); setErrors({}); setShowModal(true); }}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200"
//         >
//           + Add Employee
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//         <input placeholder="🔍  Search employees..." value={search} onChange={e => setSearch(e.target.value)}
//           className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50" />
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
//         <Table columns={columns} data={filtered} emptyMessage="No employees found" />
//       </div>

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editEmployee ? "Edit Employee" : "Add Employee"}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Input label="Full Name" required placeholder="Dr. Suresh Verma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} className="sm:col-span-2" />
//           <Input label="Email" required type="email" placeholder="suresh@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} />
//           <Input label="Phone" required placeholder="9700000001" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} error={errors.phone} />
//           <Select label="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
//             options={["Placement Officer","Coordinator","Admin","HR Manager","Faculty","Support Staff"].map(r => ({ value: r, label: r }))} />
//           <Select label="Department" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
//             options={["Training & Placement","Administration","HR","Faculty","IT Support"].map(d => ({ value: d, label: d }))} />
//         </div>
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
//           <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-200">
//             {editEmployee ? "Update" : "Add Employee"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }