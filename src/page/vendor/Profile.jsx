// import { SquarePen, Plus, Trash2, UserRoundPen, Key } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useAddBranchDetailsMutation, useAddCompanyProfileMutation, useChangePasswordMutation, useDeleteBranchDetailsMutation, useGetVendorProfileQuery, useUpdateBranchDetailsMutation, useUpdateCompanyProfileMutation, useUpdateVendorProfileMutation } from "../../redux/services/vendorApi";
// import toast from "react-hot-toast";
// import { useGetCountryDataQuery } from "../../redux/services/externalApi";
// import dummyImg from '../../assets/userImg.jpg'

// /* ================= PRESET DATA ================= */




// const EMPTY_BRANCH = {
//     country: "",
//     address: "",
//     pocName: "",
//     pocEmail: "",
//     pocMobile: "",
//     pocGender: "",
// };

// const PRESET_VENDOR = {
//     logo: "https://via.placeholder.com/120",
//     logoFile: null,
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     gender: "",
//     companyName: "",
//     companyRegNo: "",
//     website: "",
//     branches: [],
//     companyLogo: null,
//     companyFileLogo: null
// };

// const REQUIRED_BRANCH_FIELDS = [
//     "country",
//     "address",
//     "pocName",
//     "pocEmail",
//     "pocMobile",
//     "pocGender",
//     "pocAddress"
// ];

// /* ================= COMPONENT ================= */

// export default function VendorProfileMergedForm() {
//     const { data } = useGetVendorProfileQuery();
//     const [vendor, setVendor] = useState(PRESET_VENDOR);
//     const [tempVendor, setTempVendor] = useState(PRESET_VENDOR);
//     const [editing, setEditing] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [updateVendorProfile, { isLoading, isError }] = useUpdateVendorProfileMutation()
//     const [addCompanyDetail, { isLoading: companyLoading, isError: comapnyError }] = useAddCompanyProfileMutation();
//     const [updateCompanyDetail, { isLoading: companyupdatesLoading, isError: companyUpdateError }] = useUpdateCompanyProfileMutation();
//     const [addBranchDetail, { isLoading: addBranchLoader, isError: addBranchError }] = useAddBranchDetailsMutation()
//     const [deleteBranchDetails, { isLoading: deleteLoading }] = useDeleteBranchDetailsMutation();
//     const [updateBrancDetails, { isLoading: updateBranchLoading }] = useUpdateBranchDetailsMutation();
//     const [personalEdit, setPersonalEdit] = useState(false);
//     const [companyEdit, setCompanyEdit] = useState(false);
//     const [open, setOpen] = useState(false);
//     /* ================= LOAD DATA ================= */

//     const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();


//     useEffect(() => {
//         if (!data) return;


//         const { vendor: vendorDetail, company, branches } = data;

//         const merged = {
//             ...PRESET_VENDOR,
//             name: vendorDetail?.name || "",
//             email: vendorDetail?.email || "",
//             phone: vendorDetail?.phone || "",
//             address: vendorDetail?.address || "",
//             gender: vendorDetail?.gender || "",
//             logo: vendorDetail?.profile_image || null,
//             companyName: company?.company_name || "",
//             companyRegNo: company?.registration_number || "",
//             website: company?.website || "",
//             branches: branches?.length
//                 ? branches.map((b) => ({
//                     country: b?.country || "",
//                     address: b?.branch_location || "",
//                     pocName: b?.pocs[0]?.full_name || "",
//                     pocEmail: b?.pocs[0]?.email || "",
//                     pocMobile: b?.pocs[0]?.phone || "",
//                     pocGender: b?.pocs[0]?.gender || "",
//                     pocAddress: b?.pocs[0]?.address || "",
//                     pocId: b?.pocs[0]?.id || null,
//                     id: b?.id || null
//                 }))
//                 : [],
//             companyLogo: company?.company_logo
//         };

//         setVendor(merged);
//         setTempVendor(structuredClone(merged));

//     }, [data]);

//     /* ================= HELPERS ================= */

//     const isBranchValid = (branch) =>
//         REQUIRED_BRANCH_FIELDS.every(
//             (key) => branch[key] && branch[key].toString().trim() !== ""
//         );

//     const validateBranches = () => {
//         const newErrors = {};

//         tempVendor.branches.forEach((b, i) => {
//             REQUIRED_BRANCH_FIELDS.forEach((field) => {
//                 if (!b[field] || b[field].toString().trim() === "") {
//                     newErrors[`branch_${i}_${field}`] = "Required";
//                 }
//             });
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     /* ================= HANDLERS ================= */

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setTempVendor((p) => ({ ...p, [name]: value }));
//     };

//     const handleLogoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setTempVendor((p) => ({
//                 ...p,
//                 companyLogo: URL.createObjectURL(file),
//                 companyFileLogo: file
//             }));
//         }
//     };

//     const handleProfileChange = (e) => {
//         const file = e.target.files[0];
//         console.log("file-come", file);
//         if (file) {
//             setTempVendor((p) => ({
//                 ...p,
//                 logo: URL.createObjectURL(file),
//                 logoFile: file
//             }));

//         }
//     };

//     const edit = () => {
//         setTempVendor(structuredClone(vendor));
//         setEditing(true);
//     };

//     // console.log("vvv", data)

//     const cancel = () => {
//         setTempVendor(structuredClone(vendor));
//         setErrors({});
//         setEditing(false);
//     };


//     const profileUpdateHandler = async (e) => {
//         e.stopPropagation();
//         try {
//             const { name, phone, address, gender
//             } = tempVendor
//             if (!name || !phone || !address || !gender) {
//                 return toast.error("Please Fill all required details")
//             }
//             const formdata = new FormData();
//             formdata.append('vendor', JSON.stringify({
//                 id: data?.vendor?.id || null,
//                 vendor_name: name,
//                 phone,
//                 address: address,
//                 gender: gender,
//             }))


//             if (tempVendor?.logoFile) {
//                 formdata.append('vendor_profile_image', tempVendor?.logoFile)
//             }

//             const result = await updateVendorProfile(formdata)
//             if (result?.data) {
//                 toast.success("profile update sucessfully.")
//                 setPersonalEdit(false);
//             }
//             // console.log("ress", result);
//         } catch (err) {
//             console.log("err in update form", err)
//             toast.error("Something went wrong")
//         }
//     }

//     const companyUpdateHandler = async (e) => {
//         e.stopPropagation();
//         const companyId = data?.company
//         console.log("first", tempVendor)
//         const { companyFileLogo, companyName, companyRegNo,
//             website = "", address
//         } = tempVendor
//         console.log("koko", (!companyName && !website && !address))
//         if (!companyName?.trim() && !website?.trim() && !address?.trim()) {
//             return toast.error("Please fill all required information");
//         }


//         try {
//             const formdata = new FormData();
//             formdata.append('company', JSON.stringify({
//                 ...(companyId?.id && { id: companyId.id }),
//                 company_name: companyName,
//                 registration_number: companyRegNo,
//                 website,
//                 location: address
//             }))
//             console.log("fomdata", formdata);
//             if (tempVendor?.companyFileLogo) {
//                 formdata.append('company_logo', companyFileLogo)
//             }

//             const result = !companyId?.id ? await addCompanyDetail(formdata) : await updateCompanyDetail(formdata);

//             if (result?.data) {
//                 toast.success("profile update sucessfully.")
//                 setCompanyEdit(false);
//             }
//             // console.log("ress", result);
//         } catch (err) {
//             console.log("err in update form", err)
//             toast.error("Something went wrong")
//         }
//     }

//     const [requiredBranchFields, setRequiredBranchFields] = useState({
//         country: "",
//         address: "",
//     });


//     const handlePoChange = (e) => {
//         const { name, value } = e.target;
//         setRequiredBranchFields((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const save = async (e) => {
//         e.preventDefault();
//         console.log("requiredBranchFields", requiredBranchFields)
//         console.log("0909", (requiredBranchFields?.country || requiredBranchFields?.address))
//         if (!requiredBranchFields?.country || !requiredBranchFields?.address
//         ) {
//             toast.error("Please Fill all required information")
//             return;
//         }
//         const formdata = new FormData();
//         if (editId) {
//             formdata.append(
//                 'branch',
//                 JSON.stringify({
//                     // ...(data?.company?.id && { company_id: data.company.id }),
//                     country: requiredBranchFields?.country || "",
//                     branch_location: requiredBranchFields?.address || "",
//                 })
//             );
//         } else {
//             formdata.append(
//                 'branches_data',
//                 JSON.stringify({
//                     ...(data?.company?.id && { company_id: data.company.id }),
//                     country: requiredBranchFields?.country || "",
//                     branch_location: requiredBranchFields?.address || "",
//                 })
//             );
//         }

//         try {
//             const result = editId ? await updateBrancDetails({ id: editId, formdata }) : await addBranchDetail(formdata);
//             console.log("ress", result);
//             if (result?.error) {
//                 return toast.error(result?.error?.data?.detail ?? "Internal Server Error")
//             }

//             if (result?.data) {
//                 toast.success(pocId ? 'poc details update successfully' : "poc details added sucessfully.")
//                 setRequiredBranchFields({
//                     country: "",
//                     address: "",
//                     pocName: "",
//                     pocEmail: "",
//                     pocMobile: "",
//                     pocGender: "",
//                     pocAddress: "",
//                 })
//                 setEditing(false);
//             }
//         } catch (err) {
//             console.log("err in update form", err)
//             toast.error("Something went wrong")
//         }
//     };

//     function handleClose() {
//         setRequiredBranchFields({
//             country: "",
//             address: ""
//         })
//         setEditId(null);
//         setEditing(false)
//     }

//     const [editId, setEditId] = useState(null);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [pocId, setPOCId] = useState(null);

//     const deleteBranch = async () => {
//         if (!deleteId) {
//             return toast.error("Branch Id not exist, Pls try again.")
//         }
//         try {
//             const result = await deleteBranchDetails(deleteId);
//             console.log("ress", result);
//             if (result?.data) {
//                 setTimeout(() => {
//                     toast.success("Branch details deleted successfully.");
//                     setIsDeleteModalOpen(false)
//                 }, 1000)

//             }
//         } catch (err) {
//             console.log("err", err);
//             toast.error("Internal Server Error")
//         }
//     };

//     function EditHandler(param) {
//         setEditId(param?.id)
//         setPOCId(param?.pocId ?? null)
//         const { address, country } = param
//         setRequiredBranchFields({
//             country,
//             address
//         })
//         setEditing(true);
//     }



//     return (
//         <div className="bg-gray-100 min-h-screen py-6 space-y-5">
//             {/* ================= PERSONAL DETAILS ================= */}
//             <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
//                 <div className="flex justify-between items-center">
//                     <h2 className="text-lg font-semibold text-blue-900">
//                         Personal Details
//                     </h2>

//                     {!personalEdit && (

//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => setPersonalEdit(!personalEdit)}
//                                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors duration-200">
//                                 <UserRoundPen size={16} />
//                                 Edit
//                             </button>
//                             <button
//                     onClick={() => setOpen(true)}
//                                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors duration-200">
//                                 <Key size={16} />
//                                 Change Password
//                             </button>
//                         </div>
//                     )}

//                     {personalEdit && (
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setPersonalEdit(!personalEdit)}
//                                 className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
//                             >
//                                 Cancel
//                             </button>

//                             <button onClick={profileUpdateHandler}
//                                 className="px-4 py-1.5 rounded-md bg-[#3189ee] text-white hover:bg-blue-700 transition"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     )}
//                 </div>


//                 <div className="flex gap-6 items-center" >
//                     {/* Profile Image */}
//                     <div className="relative group">
//                         {
//                             <img
//                                 src={tempVendor.logo ?? dummyImg}
//                                 alt="upload img"
//                                 className="w-32 h-32 rounded-full object-cover border border-blue-200app"
//                             />
//                         }

//                         {personalEdit && (
//                             <>
//                                 <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full">
//                                     Choose
//                                 </div>
//                                 <input
//                                     type="file"
//                                     className="absolute inset-0 opacity-0 cursor-pointer"
//                                     onChange={handleProfileChange}
//                                 />
//                             </>
//                         )}

//                     </div>

//                     {/* Personal Fields */}
//                     <div className="grid md:grid-cols-3 gap-4 flex-1">
//                         <Input label="Vendor Name" required value={tempVendor.name} readOnly />
//                         <Input label="Email" required value={tempVendor.email} readOnly />

//                         <div>
//                             <label className="text-sm">Mobile <span className=" text-red-500">*</span>  </label>
// <PhoneInput
//     country="in"
//     disabled={!personalEdit}
//     value={tempVendor.phone}
//     inputStyle={{ width: "100%" }}
//     onChange={(val) =>
//         setTempVendor((p) => ({ ...p, phone: val }))
//     }
//     inputProps={{
//         required: true,
//         name: "phone",
//     }}
// />
//                         </div>

//                         <Input
//                             label="Address"
//                             required
//                             name="address"
//                             placeholder="Address"
//                             value={tempVendor.address}
//                             readOnly={!personalEdit}
//                             onChange={handleChange}
//                             wrapperClassName="md:col-span-2"
//                         />

//                         <div className="flex   flex-col">
//                             <label className="text-sm font-semibold mb-1">Gender <span className=" text-red-500">*</span> </label>
//                             <select
//                                 name="gender"
//                                 value={tempVendor.gender}
//                                 disabled={!personalEdit}
//                                 onChange={(e) =>
//                                     handleChange({
//                                         target: { name: "gender", value: e.target.value },
//                                     })
//                                 }
//                                 className=" rounded border border-gray-300 p-2"
//                             >
//                                 <option disabled value="">Gender</option>
//                                 <option value="male">Male</option>
//                                 <option value="female">Female</option>
//                                 <option value="other">Other</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ================= COMPANY DETAILS ================= */}
//             <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
//                 <div className=" flex justify-between" >
//                     <h2 className="text-lg font-semibold text-blue-900">
//                         Company Details
//                     </h2>
//                     {!companyEdit && (
//                         <button
//                             onClick={() => setCompanyEdit(!companyEdit)}
//                             className="p-2 rounded-md hover:bg-blue-100 transition"
//                         >
//                             <SquarePen size={18} className="text-blue-700 cursor-pointer" />
//                         </button>
//                     )}
//                     {companyEdit && (
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setCompanyEdit(!companyEdit)}
//                                 className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
//                             >
//                                 Cancel
//                             </button>

//                             <button onClick={companyUpdateHandler}
//                                 className="px-4 py-1.5 rounded-md bg-[#3189ee] text-white hover:bg-blue-700 transition"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     )}
//                 </div>


//                 <div className="grid md:grid-cols-3 gap-4">
//                     <Input
//                         label="Company Name"
//                         required
//                         name="companyName"
//                         placeholder="Company Name"
//                         value={tempVendor.companyName}
//                         readOnly={!companyEdit}
//                         onChange={handleChange}
//                     />

//                     <Input
//                         label="Registration No."
//                         value={tempVendor.companyRegNo}
//                         name="companyRegNo"
//                         placeholder="Registration Number"
//                         readOnly={!companyEdit}
//                         onChange={handleChange}
//                     />

//                     <Input
//                         label="Website"
//                         required
//                         name="website"
//                         placeholder="Website"
//                         value={tempVendor.website}
//                         readOnly={!companyEdit}
//                         onChange={handleChange}
//                     />

//                     {/* Company Logo */}
//                     <div className=" relative">
//                         <label className="block mb-2 text-sm font-medium">
//                             Company Logo (Optional)
//                         </label>

//                         <input
//                             type="file"
//                             className="absolute inset-0 opacity-0 cursor-pointer"
//                             onChange={handleLogoChange}
//                         />

//                         <div className="flex gap-4">
//                             <div className="flex items-center justify-center w-full h-20 border-2 border-blue-900 border-dashed rounded-lg">
//                                 Click to upload logo
//                             </div>

//                             {tempVendor.companyLogo && (
//                                 <img
//                                     src={tempVendor.companyLogo}
//                                     className="w-32 h-20 object-cover shadow-lg "
//                                 />
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ================= POINT OF CONTACT DETAILS ================= */}
//             <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
//                 <div className=" flex justify-between" >
//                     <h2 className="text-lg font-semibold text-blue-900">
//                         Branch Details
//                     </h2>
//                 </div>


//                 {tempVendor?.branches?.map((b, i) => (
//                     <div
//                         key={i}
//                         className="border border-gray-200 p-4 rounded space-y-4"
//                     >
//                         <div className="flex justify-between items-center">
//                             <h3 className="font-semibold">
//                                 Branch Details - {i + 1}
//                             </h3>
//                             <div className="flex gap-3">
//                                 <button
//                                     className=" bg-gray-400 cursor-pointer p-2 rounded-full"
//                                     onClick={() => EditHandler(b)}
//                                 >
//                                     <SquarePen size={14} color="white" />
//                                 </button>
//                                 <button
//                                     className="bg-red-100 cursor-pointer p-2 rounded-full"
//                                     onClick={() => [setIsDeleteModalOpen(true), setDeleteId(b?.id ?? null)]}
//                                 >
//                                     <Trash2 size={16} className="text-red-500" />
//                                 </button>
//                             </div>

//                         </div>
//                         <div className="grid md:grid-cols-3 gap-4">
//                             <Input label="Country" name="country" readOnly placeholder="Country" value={b.country} />
//                             <Input label="Branch Address" name="address" readOnly placeholder="Branch Location" value={b.address} />
//                         </div>
//                     </div>
//                 ))}


//                 <button
//                     onClick={() => setEditing(true)}
//                     className="flex items-center gap-2 text-blue-600"
//                 >
//                     <Plus size={16} /> Add Branch
//                 </button>

//             </div>

//             {editing && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center">
//                     {/* Overlay */}
//                     <div
//                         className="absolute inset-0 bg-black opacity-50"
//                         onClick={handleClose}
//                     ></div>

//                     {/* Modal Content */}
//                     <div className="relative w-full max-w-xl overflow-y-auto max-h-80 md:max-h-full p-6 bg-white rounded-lg shadow-lg">
//                         <h2 className="mb-2 text-lg font-semibold">Branch Detail Form</h2>
//                         <hr className=" text-gray-300 mb-4" />
//                         <form className="space-y-4" onSubmit={save}>
//                             <div className="grid md:grid-cols-2 gap-4">
//                                 <div className="flex flex-col" >
//                                     <label className="text-sm text-gray-600 font-semibold mb-1" htmlFor="country">Country</label>
//                                     <select name="country" id="country" onChange={handlePoChange}
//                                         className={`border outline-none rounded px-3 text-gray-500 py-2 ${false ? "border-red-500" : "border-gray-300"
//                                             } ${false ? "bg-gray-100" : ""}`}
//                                         value={requiredBranchFields.country}  >
//                                         <option value="" disabled>Select Country</option>
//                                         {countryData?.data?.length > 0 &&
//                                             countryData?.data?.map((item) => (
//                                                 <option value={item?.name}> {item?.name}</option>
//                                             ))
//                                         }
//                                     </select>
//                                 </div>

//                                 <Input label="Branch Address" name="address" onChange={handlePoChange} placeholder="Branch Location" value={requiredBranchFields.address} />

//                             </div>
//                             <div className="flex flex-row gap-3">
//                                 <button type="submit"
//                                     className="px-4 py-1.5 rounded-md bg-[#1b68c0]  text-white hover:bg-blue-500 transition"
//                                 >
//                                     Save
//                                 </button>
//                                 <button onClick={handleClose}
//                                     className="px-4 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-700 transition"
//                                 >Cancel</button>
//                             </div>

//                         </form>
//                     </div>
//                 </div>
//             )}

//             {isDeleteModalOpen && (
//                 <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs">
//                     <div className="relative w-full max-w-xl p-6 bg-white rounded-xl shadow-2xl animate-scaleIn">

//                         {/* Icon */}
//                         <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
//                             <svg
//                                 className="w-6 h-6 text-red-600"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
//                                 />
//                             </svg>
//                         </div>

//                         {/* Title */}
//                         <h2 className="text-lg font-semibold text-center text-gray-900">
//                             Delete Branch Details
//                         </h2>

//                         {/* Message */}
//                         <p className="mt-2 text-sm text-center text-gray-600">
//                             Are you sure you want to delete this branch?
//                             This action <span className="font-medium text-red-600">cannot be undone</span>.
//                         </p>

//                         {/* Actions */}
//                         <div className="flex justify-end gap-3 mt-6">
//                             <button
//                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                                 onClick={() => setIsDeleteModalOpen(false)}
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
//                                 onClick={deleteBranch}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//             )}

//             {open && <ChangePasswordModal onClose={() => setOpen(false)} />}

//         </div>

//     );
// }

// /* ================= REUSABLE ================= */

// export const Divider = () => <div className="border-t border-gray-200" />;

// export const Input = ({
//     label,
//     required,
//     error,
//     readOnly,
//     wrapperClassName = "",
//     ...props
// }) => (
//     <div className={`flex flex-col ${wrapperClassName}`}>
//         <label className="text-sm text-gray-600 font-semibold mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <input
//             {...props}
//             readOnly={readOnly}
//             className={`border outline-none rounded px-3 py-2 ${error ? "border-red-500" : "border-gray-300"
//                 } ${readOnly ? "bg-gray-100" : ""}`}
//         />
//         {error && <span className="text-xs text-red-500">{error}</span>}
//     </div>
// );

// // import { useState } from "react";
// import { useForm } from "react-hook-form";

// const EyeIcon = ({ open }) =>
//     open ? (
//         <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//         </svg>
//     ) : (
//         <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//         </svg>
//     );



// /* ── floating particles config ── */
// const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
//     id: i,
//     size: 4 + Math.random() * 8,
//     left: 5 + Math.random() * 90,
//     bottom: -20 + Math.random() * 30,
//     dur: 3 + Math.random() * 4,
//     delay: Math.random() * 4,
//     op: 0.15 + Math.random() * 0.25,
//     color: i % 3 === 0 ? "#286a94" : i % 3 === 1 ? "#4fb3e8" : "#a5d8f0",
// }));


// function getStrength(pw) {
//     if (!pw) return { score: 0, label: "", color: "" };
//     let s = 0;
//     if (pw.length >= 8) s++;
//     if (/[A-Z]/.test(pw)) s++;
//     if (/[0-9]/.test(pw)) s++;
//     if (/[^A-Za-z0-9]/.test(pw)) s++;
//     const map = [
//         { label: "Too short", color: "#ef4444" },
//         { label: "Weak", color: "#f97316" },
//         { label: "Fair", color: "#eab308" },
//         { label: "Good", color: "#22c55e" },
//         { label: "Strong 💪", color: "#16a34a" },
//     ];
//     return { score: s, ...map[s] };
// }

// function ChangePasswordModal({ onClose }) {
//     const [phase, setPhase] = useState("entering"); // entering | idle | exiting
//     const [show, setShow] = useState({ cur: false, nw: false, cf: false });
//     const [success, setSuccess] = useState(false);
//     const submitBtnRef = useRef(null);
//     const [submit, { isLoading }] = useChangePasswordMutation()

//     const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ mode: "onChange" });
//     const newPass = watch("newPassword", "");
//     const strength = getStrength(newPass);

//     useEffect(() => {
//         const t = setTimeout(() => setPhase("idle"), 450);
//         return () => clearTimeout(t);
//     }, []);

//     const handleClose = () => {
//         setPhase("exiting");
//         setTimeout(onClose, 300);
//     };

//     const onSubmit = async (data) => {
//         const { confirmPassword, currentPassword, newPassword } = data
//         try {
//             const result = await submit({
//                 current_password: currentPassword,
//                 new_password: newPassword, confirm_password: confirmPassword
//             })
//             if (result?.error) {
//                 throw new Error(result?.error?.data?.detail)
//             }
//             if (result?.data) {
//                 setSuccess(true);
//                 setTimeout(handleClose, 2000);
//             }
//         } catch (err) {
//             toast.error(err?.message ?? "Internal Server Error")
//         }
//     };

//     const toggle = (f) => setShow((p) => ({ ...p, [f]: !p[f] }));

//     const handleRipple = (e) => {
//         const btn = submitBtnRef.current;
//         if (!btn) return;
//         const rect = btn.getBoundingClientRect();
//         const dot = document.createElement("span");
//         const size = Math.max(rect.width, rect.height);
//         dot.style.cssText = `
//       position:absolute; border-radius:50%; pointer-events:none;
//       background:rgba(255,255,255,0.4);
//       width:${size}px; height:${size}px;
//       left:${e.clientX - rect.left - size / 2}px;
//       top:${e.clientY - rect.top - size / 2}px;
//       animation: ripple 0.6s linear;
//     `;
//         btn.appendChild(dot);
//         setTimeout(() => dot.remove(), 600);
//     };

//     const animCls = phase === "idle" ? "" : phase;



//     return (
//         <>
//             <style>{`
//         @keyframes overlayIn  { from{opacity:0} to{opacity:1} }
//         @keyframes overlayOut { from{opacity:1} to{opacity:0} }
//         @keyframes modalIn {
//           0%   { opacity:0; transform:translateY(60px) scale(0.88); }
//           60%  { opacity:1; transform:translateY(-6px) scale(1.01); }
//           100% { opacity:1; transform:translateY(0) scale(1); }
//         }
//         @keyframes modalOut {
//           0%   { opacity:1; transform:translateY(0) scale(1); }
//           100% { opacity:0; transform:translateY(40px) scale(0.92); }
//         }
//         @keyframes floatUp {
//           0%   { transform:translateY(0) scale(1); opacity:0; }
//           15%  { opacity:var(--op); }
//           85%  { opacity:var(--op); }
//           100% { transform:translateY(-120px) scale(0.4); opacity:0; }
//         }
//         @keyframes iconBounce {
//           from { transform:scale(0) rotate(-20deg); }
//           to   { transform:scale(1) rotate(0); }
//         }
//         @keyframes fieldSlide {
//           from { opacity:0; transform:translateX(-18px); }
//           to   { opacity:1; transform:translateX(0); }
//         }
//         @keyframes successPop {
//           from { opacity:0; transform:scale(0.85) translateY(8px); }
//           to   { opacity:1; transform:scale(1) translateY(0); }
//         }
//         @keyframes checkSpin {
//           from { transform:scale(0) rotate(-90deg); }
//           to   { transform:scale(1) rotate(0); }
//         }
//         @keyframes shimmerBar { to { background-position:-300% 0; } }
//         @keyframes blobPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
//         @keyframes errPop { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes ripple { to { transform:scale(4); opacity:0; } }
//         @keyframes spin { to { transform:rotate(360deg); } }

//         .overlay-bg.entering { animation:overlayIn 0.35s ease forwards; }
//         .overlay-bg.exiting  { animation:overlayOut 0.3s ease forwards; }
//         .modal-wrap.entering .modal { animation:modalIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
//         .modal-wrap.exiting  .modal { animation:modalOut 0.3s cubic-bezier(0.4,0,1,1) forwards; }

//         .close-btn:hover { background:#fee2e2 !important; color:#ef4444 !important; transform:rotate(90deg) scale(1.1) !important; }
//         .toggle-eye:hover { color:#286a94; transform:translateY(-50%) scale(1.15); }
//         .btn-submit::after {
//           content:''; position:absolute; inset:0;
//           background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
//           transform:translateX(-100%); transition:transform 0.4s ease;
//         }
//         .btn-submit:hover::after { transform:translateX(0); }
//       `}</style>

//             {/* Overlay */}
//             <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
//                 <div className={`overlay-bg ${animCls}`} onClick={handleClose}
//                     style={{ position: "absolute", inset: 0, background: "rgba(10,30,50,0.55)", backdropFilter: "blur(6px)" }}
//                 />

//                 {/* Floating particles */}
//                 {PARTICLES.map((p) => (
//                     <span key={p.id} style={{
//                         position: "absolute", borderRadius: "50%", pointerEvents: "none",
//                         width: p.size, height: p.size, left: `${p.left}%`, bottom: p.bottom,
//                         background: p.color, zIndex: 1,
//                         animation: `floatUp ${p.dur}s ease-in-out ${p.delay}s infinite`,
//                         "--op": p.op,
//                     }} />
//                 ))}

//                 {/* Modal */}
//                 <div className={`modal-wrap ${animCls}`} style={{ position: "relative", zIndex: 2, width: 430, maxWidth: "95vw" }}>
//                     <div className="modal" style={{
//                         background: "#fff", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
//                         boxShadow: "0 32px 80px rgba(10,30,60,0.22), 0 0 0 1px rgba(255,255,255,0.8) inset",
//                     }}>

//                         {/* Header */}
//                         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
//                             <div style={{ fontSize: 18, fontWeight: 600, color: "#1a2633", display: "flex", alignItems: "center", gap: 10 }}>
//                                 <div style={{
//                                     width: 38, height: 38, borderRadius: 10,
//                                     background: "linear-gradient(135deg,#286a94,#4fb3e8)",
//                                     display: "flex", alignItems: "center", justifyContent: "center",
//                                     boxShadow: "0 4px 12px rgba(40,106,148,0.35)",
//                                     animation: "iconBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
//                                 }}>
//                                     <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                     </svg>
//                                 </div>
//                                 Change Password
//                             </div>
//                             <button className="close-btn" onClick={handleClose} style={{
//                                 width: 32, height: 32, border: "none", background: "#f1f5f9",
//                                 borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center",
//                                 justifyContent: "center", color: "#64748b", transition: "all 0.2s",
//                             }}>
//                                 <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>

//                         {success && (
//                             <div style={{
//                                 background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10,
//                                 padding: "12px 14px", color: "#166534", fontSize: 13, fontWeight: 500,
//                                 display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
//                                 animation: "successPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
//                             }}>
//                                 <div style={{
//                                     width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
//                                     background: "linear-gradient(135deg,#22c55e,#16a34a)",
//                                     display: "flex", alignItems: "center", justifyContent: "center",
//                                     animation: "checkSpin 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
//                                 }}>
//                                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                     </svg>
//                                 </div>
//                                 Password updated successfully!
//                             </div>
//                         )}

//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             {[
//                                 {
//                                     key: "currentPassword", label: "Current Password", showKey: "cur",
//                                     rules: { required: "Current password is required", minLength: { value: 6, message: "At least 6 characters" } }
//                                 },
//                                 {
//                                     key: "newPassword", label: "New Password", showKey: "nw",
//                                     rules: {
//                                         required: "New password is required", minLength: { value: 8, message: "At least 8 characters" },
//                                         validate: v => v !== watch("currentPassword") || "Must differ from current"
//                                     }
//                                 },
//                                 {
//                                     key: "confirmPassword", label: "Confirm New Password", showKey: "cf",
//                                     rules: { required: "Please confirm your password", validate: v => v === newPass || "Passwords do not match" }
//                                 },
//                             ].map(({ key, label, showKey, rules }, i) => (
//                                 <div key={key} style={{ marginBottom: 18, animation: `fieldSlide 0.4s ease ${0.15 + i * 0.07}s both` }}>
//                                     <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{label}</label>
//                                     <div style={{ position: "relative" }}>
//                                         <input
//                                             type={show[showKey] ? "text" : "password"}
//                                             placeholder={`Enter ${label.toLowerCase()}`}
//                                             style={{
//                                                 width: "100%", padding: "11px 42px 11px 14px",
//                                                 border: `1.5px solid ${errors[key] ? "#ef4444" : "#e2e8f0"}`,
//                                                 borderRadius: 10, fontSize: 14, color: "#1a2633", outline: "none",
//                                                 background: "#fafbfc", fontFamily: "inherit",
//                                                 transition: "all 0.2s",
//                                             }}
//                                             onFocus={e => { e.target.style.borderColor = "#286a94"; e.target.style.boxShadow = "0 0 0 3.5px rgba(40,106,148,0.12)"; e.target.style.transform = "translateY(-1px)"; e.target.style.background = "#fff"; }}
//                                             onBlur={e => { e.target.style.borderColor = errors[key] ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.transform = "none"; }}
//                                             {...register(key, rules)}
//                                         />
//                                         <button type="button" onClick={() => toggle(showKey)} style={{
//                                             position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
//                                             background: "none", border: "none", cursor: "pointer",
//                                             color: "#94a3b8", padding: 2, display: "flex", alignItems: "center", transition: "color 0.15s",
//                                         }}>
//                                             <EyeIcon open={show[showKey]} />
//                                         </button>
//                                     </div>
//                                     {/* Strength bar for new password */}
//                                     {key === "newPassword" && newPass && (
//                                         <div style={{ marginTop: 7 }}>
//                                             <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
//                                                 <div style={{ height: "100%", borderRadius: 99, width: `${(strength.score / 4) * 100}%`, background: strength.color, transition: "width 0.4s, background 0.4s" }} />
//                                             </div>
//                                             <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: strength.color }}>{strength.label}</div>
//                                         </div>
//                                     )}
//                                     {errors[key] && (
//                                         <div style={{ fontSize: 12, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4, animation: "errPop 0.2s ease" }}>
//                                             ⚠ {errors[key].message}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}

//                             <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e2e8f0,transparent)", margin: "22px 0" }} />

//                             <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", animation: "fieldSlide 0.4s ease 0.35s both" }}>
//                                 <button type="button" onClick={handleClose} style={{
//                                     padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0",
//                                     background: "#fff", fontSize: 14, fontWeight: 500, color: "#64748b",
//                                     cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
//                                 }}>
//                                     Cancel
//                                 </button>
//                                 <button ref={submitBtnRef} type="submit" disabled={isSubmitting || success} onClick={handleRipple}
//                                     className="btn-submit" style={{
//                                         padding: "10px 22px", borderRadius: 10, border: "none",
//                                         background: "linear-gradient(135deg,#286a94,#3a8cbf)",
//                                         fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer",
//                                         display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
//                                         boxShadow: "0 4px 14px rgba(40,106,148,0.35)", position: "relative", overflow: "hidden",
//                                         transition: "all 0.2s",
//                                     }}>
//                                     {isSubmitting ? (
//                                         <>
//                                             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
//                                                 <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
//                                             </svg>
//                                             Updating…
//                                         </>
//                                     ) : (
//                                         <>
//                                             <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                             </svg>
//                                             Update Password
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }


//=================================  =================================================


// import { useState } from "react";
// import { ProgressBar } from "../../components/ui/Layout/DashboardLayout";
// import {Input} from '../../libs/Ui'
// import { useGetVendorProfileQuery } from "../../redux/services/vendorApi";

// export default function ProfilePage() {
//     let profileCompletion=90
//   const [ profile, setProfile ] = useState({});
//   const [form, setForm] = useState(profile);
//   const [saved, setSaved] = useState(false);
//     const { data } = useGetVendorProfileQuery();
//     console.log("ddl",data)

//   const fields = [
//     { key: "campusName", label: "Campus Name", placeholder: "IIET College of Engineering", required: true, span: 2 },
//     { key: "university", label: "Affiliated University", placeholder: "JNTU Hyderabad", required: true },
//     { key: "established", label: "Established Year", placeholder: "1995", type: "number" },
//     { key: "address", label: "Address", placeholder: "123 Campus Road, Sector 5", required: true, span: 2 },
//     { key: "city", label: "City", placeholder: "Hyderabad", required: true },
//     { key: "state", label: "State", placeholder: "Telangana", required: true },
//     { key: "pincode", label: "Pincode", placeholder: "500001" },
//     { key: "totalStudents", label: "Total Students", placeholder: "2500", type: "number" },
//     { key: "contactEmail", label: "Contact Email", placeholder: "placement@college.edu", type: "email", required: true },
//     { key: "contactPhone", label: "Contact Phone", placeholder: "9000000000", required: true },
//     { key: "website", label: "Website", placeholder: "https://college.edu" },
//   ];

//   const calcCompletion = (f) => {
//     const vals = Object.values(f).filter(v => v !== null);
//     const filled = vals.filter(v => v && String(v).trim() !== "").length;
//     return Math.round((filled / vals.length) * 100);
//   };

//   const handleSave = () => {
//     setProfile(form);
//     setSaved(true);
//     addToast("Profile saved successfully!", "success");
//     setTimeout(() => setSaved(false), 2000);
//   };

//   const previewCompletion = calcCompletion(form);

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Campus Profile</h2>
//           <p className="text-sm text-gray-500 mt-0.5">Complete your profile to unlock all features</p>
//         </div>
//         {profileCompletion < 100 && (
//           <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
//             <span className="text-amber-500 text-sm">⚠</span>
//             <span className="text-xs font-semibold text-amber-700">{profileCompletion}% complete</span>
//           </div>
//         )}
//       </div>

//       <div className={`rounded-2xl p-5 border ${profileCompletion === 100 ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-100 shadow-sm"}`}>
//         <div className="flex items-center gap-4 mb-3">
//           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${profileCompletion === 100 ? "bg-emerald-100" : "bg-indigo-50"}`}>
//             {profileCompletion === 100 ? "✅" : "🏛"}
//           </div>
//           <div className="flex-1">
//             <div className="font-semibold text-gray-900">{profileCompletion === 100 ? "Profile Complete! All features unlocked." : `Profile ${previewCompletion}% complete`}</div>
//             <div className="text-sm text-gray-500 mt-0.5">{profileCompletion < 100 ? "Fill all required fields to unlock the dashboard" : "Your campus profile is fully set up"}</div>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">{previewCompletion}%</div>
//         </div>
//         <ProgressBar value={previewCompletion} showLabel={false} color={previewCompletion === 100 ? "emerald" : "indigo"} />
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//         <h3 className="font-semibold text-gray-900 mb-5">Campus Information</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {fields.map(f => (
//             <Input
//               key={f.key}
//               label={f.label}
//               required={f.required}
//               placeholder={f.placeholder}
//               type={f.type || "text"}
//               value={form[f.key] || ""}
//               onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
//               className={f.span === 2 ? "sm:col-span-2" : ""}
//             />
//           ))}
//         </div>
//         <div className="mt-6 flex gap-3 justify-end">
//           <button onClick={() => setForm(profile)} className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Reset</button>
//           <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${saved ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"}`}>
//             {saved ? "✓ Saved!" : "Save Profile"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


//==================================

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
// import { Select } from "../../libs/Ui";
import { useGetVendorProfileQuery, useUpdateVendorProfileMutation } from "../../redux/services/vendorApi";
import toast from "react-hot-toast";
import { useAuth } from "../../libs/AuthProvider";
import { useLocationData } from "../../hooks/useLocationData";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// --- Mock hooks / components (replace with your actual imports) ---
const addToast = (msg, type) => console.log(`[${type}] ${msg}`);

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

// ─── Country Codes ────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: "+91", flag: "", country: "IN" },
  { code: "+1", flag: "", country: "US" },
  { code: "+44", flag: "", country: "GB" },
  { code: "+61", flag: "", country: "AU" },
  { code: "+971", flag: "", country: "AE" },
  { code: "+65", flag: "", country: "SG" },
  { code: "+49", flag: "", country: "DE" },
  { code: "+33", flag: "", country: "FR" },
  { code: "+81", flag: "", country: "JP" },
  { code: "+86", flag: "", country: "CN" },
];

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
      countryCode: "",
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
              {...register("university", { required: "University is required" })}
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

            {/* Address */}
            <Input
              label="Address"
              required
              placeholder="123 Campus Road, Sector 5"
              className="sm:col-span-2"
              disable={!isEditing}
              error={errors.address}
              {...register("address", { required: "Address is required" })}
            />


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
                  {!selectedState && !loadingStates && (
                    <span className="text-xs text-gray-500">Please select a state first</span>
                  )}
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
                pattern: { value: /^[0-9]{4,10}$/, message: "Enter a valid pincode" },
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