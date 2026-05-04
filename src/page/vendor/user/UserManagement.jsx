// import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import ImportUsers from "./ImportUsers";
import { useActiveInactiveCandidateMutation, useAddCampusVendorMutation, useDeleteCandidateByCandidateIdMutation, useGetAllUserByVendorQuery, useImportCampusVendorMutation, useSendTestLinkToUserMutation } from "../../../redux/services/vendorApi";
// import { Trash2 } from "lucide-react";
// import profileImg from '../../../assets/userImg.jpg'
import useDebounce from "../../../libs/useDebounce";
// import Loader from "../../../libs/Loader";
// import toast from "react-hot-toast";
import { useGetCountryDataQuery } from "../../../redux/services/externalApi";
import { useActivateInactivateUserBySubVendorMutation, useAddCandidateBySubVendorMutation, useDeleteCandidateByCandidateIdbySubVendorMutation, useGetAllCandidatesBySubVendorQuery, useImportCandidateBySubVendorMutation, useSendTestLinkToCandidatesMutation } from "../../../redux/services/subvendorApi";
import { Tooltip } from 'react-tooltip'
import CustomModal from "../../../libs/CustomModal";

// export default function UserManagement() {
//   const role = localStorage.getItem('role')
// const [page, setPage] = useState(1);
// const [pageSize, setPageSize] = useState(10);
// const [search, setSearch] = useState("");
// const [filterNationality, setFilterNationality] = useState("");
// const [filterResidence, setFilterResidence] = useState("");
// const debouncedQuery = useDebounce(search, 500);

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showImportModal, setShowImportModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [activeDeactiveModal, setActiveDeactiveModal] = useState(false);

//   // NEW STATES
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showSendLinkModal, setShowSendLinkModal] = useState(false);
//   const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false);
// const [showactiveInactiveModal, setShowActiveInactiveModal] = useState(false);
//   // Your existing API hooks
//   const [addVendor, { isLoading: isVendorAdding }] = role == "sub_vendor" ? useAddCandidateBySubVendorMutation() : useAddVendorMutation();
//   const [importVendor, { isLoading: isVendorImporting }] = role == "sub_vendor" ? useImportCandidateBySubVendorMutation() : useImportVendorMutation();
// const [addCampusVendor, { isLoading: isCampusLoading }] = useAddCampusVendorMutation()
// const [addImportVendor, { isLoading: isCampusImporting }] = useImportCampusVendorMutation()

//   const { data, isLoading, error } = role == "sub_vendor" ? useGetAllCandidatesBySubVendorQuery({ page, pageSize, search: debouncedQuery, filterNationality, filterResidence },
//     { refetchOnMountOrArgChange: false }) : useGetAllUserByVendorQuery(
//       { page, pageSize, search: debouncedQuery, filterNationality, filterResidence },
//       { refetchOnMountOrArgChange: false }
//     );
//   const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();

//   // console.log("isError",error);
//   if (error?.status === 401) {
//     window.location.href = '/login';
//     localStorage.clear()
//     return;
//   }

// const users = data?.candidates ?? [];
// const total = data?.total ?? 0;

//   // console.log("dil",data)

//   // RESET PAGE WHEN FILTERS CHANGE
//   useEffect(() => {
//     setPage(1);
//   }, [debouncedQuery, filterNationality, filterResidence, pageSize]);


//   /** -----------------------------
//    * MULTI SELECT LOGIC
//    * ----------------------------- */
//   const toggleSelectUser = (id) => {
//     setSelectedUsers((prev) =>
//       prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     const validUsers = users.filter((u) => !u?.cooldown_active);
//     const currentIds = validUsers.map((u) => u.id);
//     const allSelected = currentIds.every((id) => selectedUsers.includes(id));

//     if (allSelected) {
//       setSelectedUsers((prev) => prev.filter((id) => !currentIds.includes(id)));
//     } else {
//       setSelectedUsers((prev) => [...new Set([...prev, ...currentIds])]);
//     }

//   };

//   /** -----------------------------
//    * SEND LINK HANDLER
//    * ----------------------------- */
//   const [sendTestLinkToUser, { isLoading: isTestWorking }] = localStorage.getItem('role') == "sub_vendor" ? useSendTestLinkToCandidatesMutation() : useSendTestLinkToUserMutation();
// const [activateInactivateUser, { isLoading: userLoading }] = useActiveInactiveCandidateMutation()
//   const handleSendLink = async () => {
//     try {
//       const result = await sendTestLinkToUser({ candidate_ids: selectedUsers }).unwrap();
//       // console.log("send-link", result)
//       if (result?.status) {
//         setTimeout(() => {
//           toast.success("Test link sent successfully !");
//           setSelectedUsers([]);
//           setIsCheckboxEnabled(prev => !prev);
//           setShowSendLinkModal(false);
//         }, 1000)

//       }

//     } catch (err) {
//       console.log("ererer", err)
//       toast.error(err?.data?.message ?? "Failed to send link");
//     }
//   };

//   function openAddModal() {
//     setShowAddModal(true);
//   }

//   /** -----------------------------
//    * ADD / IMPORT USER
//    * ----------------------------- */

// async function handleFormSubmit(data, status = false) {
//   const formdata = new FormData();
//   if (status) {
//     formdata.append('file', data);
//   } else {
//     const { first_name, last_name, email, mobile, nationality, country_of_residence, birth_country,
//       university_name,
//       college_name,
//       degree,
//       specialization,
//       enrollment_year,
//       graduation_year,
//       cgpa,
//       roll_number,
//       department,
//       is_persuing
//     } = data;
//     formdata.append('first_name', first_name);
//     formdata.append('last_name', last_name);
//     formdata.append('email', email);
//     formdata.append('mobile', mobile);
//     formdata.append('birth_country', birth_country);
//     formdata.append('country_of_residence', country_of_residence);
//     formdata.append('nationality', nationality);
//     // 🎓 Campus-only fields
//     if (moduleType === "campus") {
//       formdata.append("university_name", university_name);
//       formdata.append("college_name", college_name);
//       formdata.append("degree", degree);
//       formdata.append("specialization", specialization);
//       formdata.append("enrollment_year", enrollment_year);
//       formdata.append("graduation_year", graduation_year);
//       formdata.append("cgpa", cgpa);
//       formdata.append("roll_number", roll_number);
//       formdata.append("department", department);
//       formdata.append("is_pursuing",is_persuing)
//     }
//   }

//   try {
//     const result = !status ? moduleType == "campus" ? await addCampusVendor(formdata) : await addVendor(formdata).unwrap() : moduleType == "campus" ? await addImportVendor(formdata) : await importVendor(formdata).unwrap();
//     if (result?.error) {
//       // console.log("eww", result)
//       return toast.error(result?.error?.data?.detail ?? "Pls Fill Correct Info")
//     }
//     if (result?.data?.status) toast.success(result?.data?.message ?? "CAndidate Added Successfully");

//     if (!status) setShowAddModal(false);
//     else setShowImportModal(false);



//   } catch (err) {
//     console.log("first-err", err)
//     toast.error(err?.data?.detail ?? "Internal Server Error")
//   }
// }
// const [deleteUser, { isLoading: deleteLoading }] = useDeleteCandidateByCandidateIdMutation();
// const [deleteUserDetails, setDeleteUserDetails] = useState(null);

// async function handleDelete() {
//   try {
//     const result = await deleteUser(deleteUserDetails?.id).unwrap?.();
//     // console.log("res", result);
//     if (result) {
//       setTimeout(() => {
//         toast.success(result?.message)
//       }, 100)
//       setShowDeleteModal(false)
//     }
//   } catch (err) {
//     toast.error(err?.message ?? "Something went wrong")
//     // console.error(err);
//   }
// }

// async function handleActiveInactive() {
//   // console.log("partner",deleteUserDetails) 
//   const data = {
//     candidate_ids: [deleteUserDetails?.id],
//     is_active: !deleteUserDetails?.is_active
//   }
//   try {
//     const result = await activateInactivateUser(data).unwrap?.();
//     // console.log("res", result);
//     if (result) {
//       setTimeout(() => {
//         toast.success(result?.message)
//       }, 100)
//       setShowActiveInactiveModal(false)
//       setDeleteUserDetails(null)
//     }
//   } catch (err) {
//     toast.error(err?.message ?? "Something went wrong")
//     // console.error(err);
//   }
// }

//   return (
//     <div className="p-6 pt-3 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-baseline mb-5">
//           <div className="">
//             <h1 className="text-xl font-semibold text-[#286a94]">Candidate Management</h1>
//             <p className="text-sm pt-0.5 text-gray-500">Search, filter, import and manage candidates</p>
//           </div>
//         </div>


//         {/* Filters + Buttons */}
//         <div className="flex flex-wrap items-center justify-between mb-6">
//           {
//             <div className="flex flex-wrap items-center gap-3">

//               {/* Search */}
//               <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow shadow-[#dcdedf]">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.196 3.094l3.85 3.85a1 1 0 01-1.414 1.414l-3.85-3.85A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search by name, email or phone"
//                   className="outline-none w-64 placeholder:text-[#286a94]"
//                 />
//               </label>

//               {/* Filters */}
// <select value={filterNationality} onChange={(e) => setFilterNationality(e.target.value)}
//   className="px-3 py-2 outline-none w-48  rounded-md shadow shadow-[#dcdedf] text-[#286a94] bg-white">
//   <option value="">Nationality (All)</option>
//   {
//     countryData?.data?.length > 0 &&
//     countryData?.data?.map((item) => (
//       <option value={item?.name}>{item?.name}</option>
//     ))
//   }
// </select>

//               <select value={filterResidence} onChange={(e) => setFilterResidence(e.target.value)}
//                 className="px-3 py-2 w-48 rounded-md shadow shadow-[#dcdedf] text-[#286a94] bg-white">
//                 <option value="" >Country of Residence (All)</option>
//                 {
//                   countryData?.data?.length > 0 &&
//                   countryData?.data?.map((item) => (
//                     <option value={item?.name}>{item?.name}</option>
//                   ))
//                 }
//               </select>

//             </div>
//           }


//           <div className="flex items-center gap-2">
//             {/* NEW BUTTON */}



//             <button onClick={openAddModal} className="px-4 py-2 cursor-pointer rounded-md bg-[#5197c2] text-white shadow">
//               Add Candidate
//             </button>

// <label onClick={() => setShowImportModal(true)}
//   className="px-4 py-2 rounded-md shadow-md cursor-pointer bg-[#5197c2] text-white">
//   Import CSV
// </label>


//           </div>
//         </div>


//         {/* TABLE */}
//         <div className="bg-white rounded-lg shadow  ">
//           {
//             data?.is_flag &&
//             <div className="pt-2">
//               <button
//                 data-tooltip-variant="warning"
//                 disabled={users?.length === 0}
//                 onClick={() => {
//                   setIsCheckboxEnabled(prev => !prev);
//                   setSelectedUsers([]);
//                 }}
//                 className="px-4 mx-2 py-2 mb-2 rounded-md disabled:bg-[#b1c9d8] bg-[#5197c2] cursor-pointer text-white shadow"
//               >
//                 {isCheckboxEnabled ? "Cancel" : "Send Test Link"}
//               </button>
//               {
//                 isCheckboxEnabled &&
//                 <button
//                   disabled={selectedUsers.length === 0}
//                   onClick={() => setShowSendLinkModal(true)}
//                   className={`px-4 py-2 mx-3 rounded-md shadow text-white ${selectedUsers.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600"
//                     }`}
//                 >
//                   Send
//                 </button>
//               }
//             </div>
//           }


//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-300">

//               {/* HEADER */}
//               <thead className="bg-gray-100">
//                 <tr>
//                   {isCheckboxEnabled && (
//                     <th className="px-6 py-3 w-12">
//                       <input
//                         type="checkbox"
//                         onChange={toggleSelectAll}
//                         checked={
//                           users.length > 0 &&
//                           users.every(u => selectedUsers.includes(u.id))
//                         }
//                       />
//                     </th>
//                   )}

//                   <th className="px-6 py-3 w-52 text- text-sm font-medium text-gray-500">Name</th>
//                   <th className="px-6 py-3 w-40 text- text-sm font-medium text-gray-500">Nationality</th>
//                   <th className="px-6 py-3 w-80 whitespace-nowrap text-sm font-medium text-gray-500">
//                     Residence Country
//                   </th>
//                   <th className="px-6 py-3 w-40 text- text-sm font-medium text-gray-500">Mobile</th>
//                   <th className="px-6 py-3 w-56 text- text-sm font-medium text-gray-500">Email</th>
//                   <th className="px-6 py-3 w-40 text- text-sm font-medium text-gray-500">Status</th>
//                   <th className="px-6 py-3 w-80 whitespace-nowrap text- text-sm font-medium text-gray-500">Test Count</th>
//                   <th className="px-6 py-3 w-32 whitespace-nowrap text- text-sm font-medium text-gray-500">Send Link</th>
//                   <th className="px-6 py-3 w-32 text- text-sm font-medium text-gray-500">Actions</th>
//                 </tr>
//               </thead>

//               {/* BODY */}
//               <tbody className="bg-white divide-y divide-gray-300">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={isCheckboxEnabled ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
//                       <Loader />
//                     </td>
//                   </tr>
//                 ) : users.length === 0 ? (
//                   <tr>
//                     <td colSpan={isCheckboxEnabled ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
//                       No candidates found — try adjusting filters or importing a CSV
//                     </td>
//                   </tr>
//                 ) : (
//                   users.map((u, index) => (
//                     <tr key={u.id} className={`text-sm text-center text-gray-600 ${(index % 2 === 0) ? 'bg-gray-50' : ''}`}>

//                       {/* CHECKBOX */}
//                       {isCheckboxEnabled && (
//                         <td className="px-6 py-4">
//                           <input
//                             id={`not-clickable-${u.id}`}
//                             type="checkbox"
//                             disabled={u?.cooldown_active}
//                             checked={selectedUsers.includes(u.id)}
//                             onChange={() => toggleSelectUser(u.id)}
//                           />

//                           {u?.cooldown_active && (
//                             <Tooltip
//                               anchorSelect={`#not-clickable-${u.id}`}
//                               style={{ zIndex: "999999" }}
//                               place="bottom"
//                             >
//                               {`You have already sent the link. Please try after ${u?.cooldown_remaining_minutes} minutes`}
//                             </Tooltip>
//                           )}
//                         </td>
//                       )}

//                       {/* NAME */}
//                       <td className="px-6 py-4">
//                         <div className=" text-nowrap">
//                           <div className="font-medium text-xs">
//                             {u.first_name} {u.last_name}
//                           </div>
//                           <div className="text-xs text-gray-400">
//                             Joined: {u.created_at
//                               ? new Date(u.created_at).toLocaleString("en-IN", {
//                                 dateStyle: "medium",
//                                 timeStyle: "short",
//                               })
//                               : "-"}
//                           </div>
//                         </div>
//                       </td>

//                       {/* NATIONALITY */}
//                       <td className="px-6 py-4">{u.nationality}</td>

//                       {/* COUNTRY */}
//                       <td className="px-6 py-4">{u.country_of_residence}</td>

//                       {/* MOBILE */}
//                       <td className="px-6 py-4">{'+' + u.mobile}</td>

//                       {/* EMAIL */}
//                       <td className="px-6 py-4 truncate max-w-[220px]">{u.email}</td>

//                       {/* STATUS */}
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${u?.is_active
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                             }`}
//                         >
//                           {u?.is_active ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       {/* TEST COUNT */}
//                       <td className="px-6 py-4">{u.test_sent_count ?? 0}</td>

//                       {/* DISABLED */}
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${!u?.is_disabled
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                             }`}
//                         >
//                           {!u?.is_disabled ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       {/* ACTION */}
//                       <td className="px-6 py-4 text-right">
//                         {
//                           u?.test_sent_count > 0 ?
//                             <button
//                               onClick={() => [setDeleteUserDetails(u), setShowActiveInactiveModal(true)]}
//                               className={`px-3 text-xs cursor-pointer py-2 rounded font- text-white ${u?.is_active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
//                                 } transition-colors`}
//                             >
//                               {u?.is_active ? "Deactivate" : "Activate"}
//                             </button> : <Trash2
//                               onClick={() => [setDeleteUserDetails(u), setShowDeleteModal(true)]}
//                               size={17}
//                               color="red"
//                               className="cursor-pointer"
//                             />
//                         }

//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>


// {/* Pagination */}
// {
//   users?.length > 0 &&
//   <div className="p-4 flex items-center justify-between">
//     <div className="text-sm text-[#286a94]">
//       Showing {Math.min((page - 1) * pageSize + 1, total)}-
//       {Math.min(page * pageSize, total)} of {total} users
//     </div>

//     <div className="flex items-center gap-4">
//       <div className="flex items-center gap-2">
//         <span className="text-sm text-[#286a94]">Rows</span>
//         <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
//           className="px-2 py-1 rounded-md border border-[#286a94] text-[#286a94] bg-white">
//           {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
//         </select>
//       </div>

//       <Pagination page={page} totalPages={data?.total_pages} setPage={setPage} />
//     </div>
//   </div>
// }

//         </div>


// {/* Add Modal */}
// {showAddModal && (
//   <UserForm onSubmit={handleFormSubmit} isVendorAdding={isVendorAdding} onClose={() => setShowAddModal(false)} />
// )}

// {/* Import Modal */}
// {showImportModal && (
//   <ImportUsers onSubmit={handleFormSubmit} isVendorImporting={isVendorImporting} onClose={() => setShowImportModal(false)} />
// )}

//         {/* SEND LINK CONFIRMATION MODAL */}
//         <CustomModal
//           isOpen={showSendLinkModal}
//           onClose={() => setShowSendLinkModal(false)}
//           onConfirm={handleSendLink}
//           title="Send Test Link"
//           confirmText="Yes, Send"
//           loading={isTestWorking}
//         >
//           Are you sure you want to send the test link to{" "}
//           <b>{selectedUsers.length}</b> selected users?
//         </CustomModal>


// {/*  DELETE FUNCTONALITY FOR CANDIDATES */}
// <CustomModal
//   isOpen={showDeleteModal}
//   onClose={() => [setShowDeleteModal(false), setDeleteUserDetails(null)]}
//   onConfirm={handleDelete}
//   title="Delete Candidate"
//   confirmText="Yes, Delete"
//   loading={deleteLoading}
// >
//   Are you sure you want to delete this candidate?

//   <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
//     <p className="font-semibold text-red-700">
//       {deleteUserDetails?.first_name} {deleteUserDetails?.last_name}
//     </p>
//     <p className="text-sm text-gray-600">
//       {deleteUserDetails?.email}
//     </p>
//   </div>

//   <p className="mt-3 text-sm text-gray-500">
//     This action cannot be undone.
//   </p>
// </CustomModal>

// {/* ACTIVATE INACTIVATE FUNCTIONALITY FOR CANDIDATES */}
// <CustomModal
//   isOpen={showactiveInactiveModal}
//   onClose={() => [setShowActiveInactiveModal(false), setDeleteUserDetails(null)]}
//   onConfirm={handleActiveInactive}
//   title={`${deleteUserDetails?.is_active ? `Deactivate Candidate` : 'Activate Candidate  '}`}
//   confirmText={`${deleteUserDetails?.is_active ? `Yes, Deactivate` : 'Yes, Activate  '}`}
//   loading={userLoading}
// >
//   {`Are you sure you want to ${deleteUserDetails?.is_active ? 'Deactivate' : 'Activate'}  this candidate?`}

//   <div
//     className={`mt-3 p-3 border rounded ${deleteUserDetails?.is_active
//         ? "bg-red-50 border-red-200"
//         : "bg-green-50 border-green-200"
//       }`}
//   >
//     <p
//       className={`font-semibold ${deleteUserDetails?.is_active ? "text-red-700" : "text-green-700"
//         }`}
//     >
//       {deleteUserDetails?.first_name} {deleteUserDetails?.last_name}
//     </p>
//     <p className="text-sm text-gray-600">
//       {deleteUserDetails?.email}
//     </p>
//   </div>


// </CustomModal>

//       </div>
//     </div>
//   );
// }


export function Pagination({ page = 0, totalPages = 0, setPage }) {
  return (
    <div className="flex items-center gap-2">
      {/* Prev */}
      <button
        className="px-3 py-1 rounded-md border cursor-pointer border-[#286a94] text-[#286a94] text-xs bg-white hover:bg-gray-50 disabled:opacity-50"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      {/* Current page button */}
      <button
        className="px-3 py-1 text-sm rounded-md border bg-[#598aa8] text-white border-[#598aa8] cursor-pointer"
        disabled
      >
        {page}
      </button>

      {/* Total pages */}
      <span className=" text-[#286a94]">of {' '} {totalPages}</span>

      {/* Next */}
      <button
        className="px-3 py-1 rounded-md border border-[#286a94] text-xs cursor-pointer text-[#286a94] bg-white hover:bg-gray-50 disabled:opacity-50"
        onClick={() => setPage(page + 1)}
        disabled={(totalPages === 0) || totalPages === page}
      >
        Next
      </button>
    </div>
  );
}


//============================================

import { useState } from "react";
import { Badge, Input, Modal, Select, Table } from "../../../libs/Ui";
// import { useApp } from "../context/AppContext";
// import { Modal, Table, Input, Select, Badge } from "../components/ui";

const MOCK_CANDIDATES = [
  { id: 1, name: "Arjun Sharma", email: "arjun.s@college.edu", phone: "9876543210", branch: "CSE", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 87, testDate: "2024-03-10" },
  { id: 2, name: "Priya Mehta", email: "priya.m@college.edu", phone: "9812345678", branch: "ECE", year: "4th", status: "active", testSent: true, testCompleted: false, score: null, testDate: "2024-03-11" },
  { id: 3, name: "Rohit Kumar", email: "rohit.k@college.edu", phone: "9823456789", branch: "ME", year: "3rd", status: "inactive", testSent: false, testCompleted: false, score: null, testDate: null },
  { id: 4, name: "Sneha Patel", email: "sneha.p@college.edu", phone: "9834567890", branch: "CSE", year: "4th", status: "active", testSent: true, testCompleted: true, score: 72, testDate: "2024-03-09" },
  { id: 5, name: "Vikram Singh", email: "vikram.s@college.edu", phone: "9845678901", branch: "IT", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 93, testDate: "2024-03-08" },
  { id: 6, name: "Anjali Nair", email: "anjali.n@college.edu", phone: "9856789012", branch: "CSE", year: "4th", status: "active", testSent: false, testCompleted: false, score: null, testDate: null },
  { id: 7, name: "Rahul Gupta", email: "rahul.g@college.edu", phone: "9867890123", branch: "EEE", year: "3rd", status: "active", testSent: true, testCompleted: true, score: 58, testDate: "2024-03-07" },
  { id: 8, name: "Meera Iyer", email: "meera.i@college.edu", phone: "9878901234", branch: "CSE", year: "2nd", status: "inactive", testSent: false, testCompleted: false, score: null, testDate: null },
];
// export default function CandidatesPage() {
//   const [candidates,serCadidates] =useState(MOCK_CANDIDATES)
//   // const { candidates, setCandidates, sendTestLink, addToast } = useApp();
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterBranch, setFilterBranch] = useState("all");
//   const [showModal, setShowModal] = useState(false);
//   const [editCandidate, setEditCandidate] = useState(null);
//   const [form, setForm] = useState({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
//   const [errors, setErrors] = useState({});

//   const branches = [...new Set(candidates.map(c => c.branch))];

//   const filtered = candidates.filter(c => {
//     const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
//     const matchStatus = filterStatus === "all" || c.status === filterStatus;
//     const matchBranch = filterBranch === "all" || c.branch === filterBranch;
//     return matchSearch && matchStatus && matchBranch;
//   });

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Name is required";
//     if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
//     if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = "Valid 10-digit phone required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;
//     if (editCandidate) {
//       setCandidates(prev => prev.map(c => c.id === editCandidate.id ? { ...c, ...form } : c));
//       addToast("Candidate updated successfully!");
//     } else {
//       setCandidates(prev => [...prev, { id: Date.now(), ...form, status: "active", testSent: false, testCompleted: false, score: null, testDate: null }]);
//       addToast("Candidate added successfully!");
//     }
//     setShowModal(false);
//     setEditCandidate(null);
//     setForm({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
//     setErrors({});
//   };

//   const toggleStatus = (id) => {
//     setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
//     addToast("Candidate status updated.");
//   };

//   const openEdit = (c) => {
//     setEditCandidate(c);
//     setForm({ name: c.name, email: c.email, phone: c.phone, branch: c.branch, year: c.year });
//     setErrors({});
//     setShowModal(true);
//   };

//   const openAdd = () => {
//     setEditCandidate(null);
//     setForm({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
//     setErrors({});
//     setShowModal(true);
//   };

//   const columns = [
//     {
//       key: "name", label: "Name", render: (v, row) => (
//         <div><div className="font-medium text-gray-900">{v}</div><div className="text-xs text-gray-400">{row.email}</div></div>
//       )
//     },
//     { key: "branch", label: "Branch" },
//     { key: "year", label: "Year" },
//     { key: "status", label: "Status", render: v => <Badge variant={v === "active" ? "green" : "red"}>{v}</Badge> },
//     {
//       key: "testSent", label: "Test", render: (v, row) => (
//         v ? <Badge variant={row.testCompleted ? "green" : "amber"}>{row.testCompleted ? "Completed" : "Pending"}</Badge>
//           : <Badge variant="gray">Not Sent</Badge>
//       )
//     },
//     {
//       key: "score", label: "Score", render: v => v != null
//         ? <span className={`font-semibold ${v >= 60 ? "text-emerald-600" : "text-red-600"}`}>{v}</span>
//         : "—"
//     },
//     {
//       key: "actions", label: "Actions", render: (_, row) => (
//         <div className="flex items-center gap-2">
//           {!row.testSent && (
//             <button onClick={() => sendTestLink(row.id)} className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-medium transition-colors">Send Test</button>
//           )}
//           <button onClick={() => openEdit(row)} className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-2.5 py-1 rounded-lg font-medium transition-colors">Edit</button>
//           <button onClick={() => toggleStatus(row.id)} className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${row.status === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
//             {row.status === "active" ? "Deactivate" : "Activate"}
//           </button>
//         </div>
//       )
//     },
//   ];

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-500">Candidates</h2>
//           <p className="text-sm text-gray-500 mt-0.5">{candidates.length} total candidates registered</p>
//         </div>
//         <button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200 flex items-center gap-2">
//           <span>+</span> Add Candidate
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
//         <div className="flex-1 min-w-48">
//           <input placeholder="🔍  Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
//             className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50" />
//         </div>
//         <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white">
//           <option value="all">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//         <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white">
//           <option value="all">All Branches</option>
//           {branches.map(b => <option key={b} value={b}>{b}</option>)}
//         </select>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
//         <Table columns={columns} data={filtered} emptyMessage="No candidates match your search" />
//       </div>

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCandidate ? "Edit Candidate" : "Add New Candidate"}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Input label="Full Name" required placeholder="Arjun Sharma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} className="sm:col-span-2" />
//           <Input label="Email Address" required type="email" placeholder="arjun@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} />
//           <Input label="Phone Number" required placeholder="9876543210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} error={errors.phone} />
//           <Select label="Branch" required value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))}
//             options={["CSE","ECE","ME","EEE","IT","CIVIL","MBA"].map(b => ({ value: b, label: b }))} />
//           <Select label="Year" required value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
//             options={["1st","2nd","3rd","4th"].map(y => ({ value: y, label: `${y} Year` }))} />
//         </div>
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
//           <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200">
//             {editCandidate ? "Update" : "Add Candidate"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CandidatesPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filterNationality, setFilterNationality] = useState("");
  const [filterResidence, setFilterResidence] = useState("");
  const debouncedQuery = useDebounce(search, 500);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterTestStatus, setFilterTestStatus] = useState("all");
  const [sortScore, setSortScore] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false)

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [maxCgpa, setMaxCgpa] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [calViewYear, setCalViewYear] = useState(new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(new Date().getMonth());
  const role = localStorage.getItem("role");

  const [editCandidate, setEditCandidate] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
  const [errors, setErrors] = useState({});

  const [addCampusVendor, { isLoading: isVendorAdding }] = role === "sub_vendor"
    ? useAddCandidateBySubVendorMutation() : useAddCampusVendorMutation()
  const [addImportVendor, { isLoading: isVendorImporting }] = role === "sub_vendor"
    ? useImportCandidateBySubVendorMutation() : useImportCampusVendorMutation()
  const [activateInactivateUser, { isLoading: userLoading }] = role === "sub_vendor"
    ? useActivateInactivateUserBySubVendorMutation() : useActiveInactiveCandidateMutation()


  // ── Bulk selection ──────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);



  const { data, isLoading, error } =
    role === "sub_vendor"
      ? useGetAllCandidatesBySubVendorQuery(
        {
          page, pageSize, search: debouncedQuery, status: filterStatus,
          filterNationality, filterResidence, fromDate, toDate,
          min_cgpa: minCgpa, max_cgpa: maxCgpa
        },
        { refetchOnMountOrArgChange: false }
      )
      : useGetAllUserByVendorQuery(
        {
          page, pageSize, search: debouncedQuery, status: filterStatus,
          filterNationality, filterResidence, fromDate, toDate,
          min_cgpa: minCgpa, max_cgpa: maxCgpa
        },
        { refetchOnMountOrArgChange: false }
      );

  // ── Transform API data ──────────────────────────────────────
  const transformedData =
    data?.candidates?.length > 0
      ? data.candidates.map((item) => ({
        id: item.id,
        name: `${item.first_name} ${item.last_name}`,
        email: item.email,
        country: item.nationality || "—",
        mobile: item?.mobile && `+${item.mobile}` || "—",
        status: item?.is_active ? "active" : "inactive",
        testSent: item.test_sent_count > 0,
        testCompleted: item?.test_status,
        score: item?.final_score ? item?.final_score * 100 : "-",
        cooldown_active: item?.cooldown_active,
        cooldown_remaining_minutes: item?.cooldown_remaining_minutes,
        testCount: item?.test_sent_count
      }))
      : [];

  // ── Filter + Sort (runs on transformedData, not stale mock) ─
  const filteredData = transformedData

  const toggleSelectOne = (id) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const isAllSelected =
    filteredData.length > 0 &&
    filteredData.every((c) => selectedIds.includes(c.id));


  const toggleSelectAll = () => {
    console.log("toggleSelectAll", isAllSelected, filteredData);
    setSelectedIds(isAllSelected ? [] : filteredData?.filter((c) => c?.testSent === false && c?.cooldown_active === false).map(c => c.id));
  };
  // ────────────────────────────────────────────────────────────


  const branches = [...new Set(candidates.map(c => c.branch))];


  const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();

  if (error?.status === 401) {
    window.location.href = "/login";
    localStorage.clear();
    return;
  }


  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filterNationality, filterStatus, pageSize, fromDate, toDate, minCgpa, maxCgpa]);



  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, { isLoading: deleteLoading }] = role=="sub_vendor" ? useDeleteCandidateByCandidateIdbySubVendorMutation() : useDeleteCandidateByCandidateIdMutation();

  const [deleteUserDetails, setDeleteUserDetails] = useState(null);

  async function handleDelete() {
    try {
      const result = await deleteUser(deleteUserDetails?.id).unwrap?.();
      // console.log("res", result);
      if (result) {
        setTimeout(() => {
          toast.success(result?.message)
        }, 100)
        setShowDeleteModal(false)
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong")
      // console.error(err);
    }
  }



  // Clear selections when filters change
  useEffect(() => {
    setSelectedIds([]);
  }, [filterStatus, filterBranch, filterTestStatus, debouncedQuery, sortScore]);
  // ────────────────────────────────────────────────────────────



  async function handleFormSubmit(data, status = false) {
    // debugger;
    // console.log("jojo", data)

    const formdata = new FormData();
    if (status) {
      formdata.append('file', data);
    } else {
      const { first_name, last_name, email, mobile, nationality, country_of_residence,
        degree,
        specialization,
        enrollment_year,
        graduation_year,
        cgpa,
        roll_number,
        department,
        is_persuing
      } = data;
      formdata.append('first_name', first_name);
      formdata.append('last_name', last_name);
      formdata.append('email', email);
      formdata.append('mobile', mobile);
      formdata.append('country_of_residence', country_of_residence);
      formdata.append('nationality', nationality);
      formdata.append("degree", degree);
      formdata.append("specialization", specialization);
      formdata.append("enrollment_year", enrollment_year);
      formdata.append("graduation_year", graduation_year);
      formdata.append("cgpa", cgpa);
      formdata.append("roll_number", roll_number);
      formdata.append("department", department);
      formdata.append("is_pursuing", is_persuing ? true : false)
    }
    try {
      const result = !status ? await addCampusVendor(formdata) : await addImportVendor(formdata);
      if (result?.error) {
        // console.log("eww", result)
        return toast.error(result?.error?.data?.detail ?? "Pls Fill Correct Info")
      }
      if (result?.data?.status) {
        setTimeout(() => {
          toast.success(result?.data?.message ?? "CAndidate Added Successfully");
        }, 200)
        setShowModal(false);
        setShowImportModal(false);
        return;
      }


    } catch (err) {
      console.log("first-err", err)
      toast.error(err?.data?.detail ?? "Internal Server Error")
    }
  }
  const [showactiveInactiveModal, setShowActiveInactiveModal] = useState(false);




  async function handleActiveInactive() {
    // console.log("partner",deleteUserDetails) 
    const data = {
      candidate_ids: [deleteUserDetails?.id],
      is_active: deleteUserDetails?.status == "active" ? false : true
    }
    try {
      const result = await activateInactivateUser(data).unwrap?.();
      // console.log("res", result);
      if (result) {
        setTimeout(() => {
          toast.success(result?.message)
        }, 100)
        setShowActiveInactiveModal(false)
        setDeleteUserDetails(null)
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong")
      // console.error(err);
    }
  }

  console.log("deactive-model", deleteUserDetails);

  const openAdd = () => {
    setEditCandidate(null);
    setForm({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
    setErrors({});
    setShowModal(true);
  };


  const total = data?.total ?? 0;

  const [sendTestLinkToUser, { isLoading: isTestWorking }] = localStorage.getItem('role') == "sub_vendor" ? useSendTestLinkToCandidatesMutation() : useSendTestLinkToUserMutation();

  const handleBulkSendTest = async () => {

    console.log("selectedIds", selectedIds);
    if (!selectedIds.length) return;


    try {
      const result = await sendTestLinkToUser({
        candidate_ids: selectedIds,
      }).unwrap();

      if (result?.status) {
        setTimeout(() => {
          toast.success(`Test link sent successfully`);
        }, 200)
        setSelectedIds([]);
      }

    } catch (err) {
      console.log("error", err);
      toast.error(err?.data?.message ?? "Failed to send link");
    }
  };


  const columns = [
    ...(bulkMode
      ? [
        {
          key: "select",
          label: (
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              // disabled={!data?.some((row) => !row.cooldown_active)}
              className="w-3 h-3 m-auto accent-indigo-600 cursor-pointer"
            />
          ),
          render: (_, row) => (
            <>
              <input
                type="checkbox"
                id={`not-clickable-${row.id}`}
                checked={selectedIds.includes(row.id)}
                onChange={() => toggleSelectOne(row.id)}
                disabled={row?.cooldown_active}
                className={`w-3 h-3 accent-indigo-600 
                  ${row?.cooldown_active
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                  }`}
              />

              {row?.cooldown_active && (
                <Tooltip
                  key={row.id}
                  anchorSelect={`#not-clickable-${row.id}`}
                  style={{ zIndex: "999999" }}
                  place="bottom"
                >
                  {`You have already sent the link. Please try after ${row?.cooldown_remaining_minutes} minutes`}
                </Tooltip>
              )}
            </>
          ),
        },
      ]
      : []),

    {
      key: "name",
      label: "Name",
      render: (v, row) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-400">{row.email}</div>
        </div>
      ),
    },

    { key: "country", label: "Country" },

    { key: "mobile", label: "Contact No." },

    {
      key: "status",
      label: "Status",
      render: (v, row) => {
        console.log("jojo", v, row);

        return (
          <Badge variant={v === "active" ? "green" : "red"}>
            {v === "active" ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },

    {
      key: "testSent",
      label: "Test",
      render: (_, row) => {
        const status = row.testCompleted;

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={
                status === "completed"
                  ? "green"
                  : status === "pending"
                    ? "amber"
                    : "gray"
              }
            >
              {status === "completed"
                ? "Completed"
                : status === "pending"
                  ? "Pending"
                  : "Not Sent"}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "score",
      label: "Score",
      render: (v) =>
        v != null ? (
          <span
            className={`font-semibold ${v >= 60 ? "text-emerald-600" : "text-red-600"
              }`}
          >
            {v}
          </span>
        ) : (
          "—"
        ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_, row) => {
        // <div className="flex items-center gap-2">
        //   {/* Send Test (only if not bulk mode & not sent) */}
        //   {/* {!row.testSent && !bulkMode && (
        //   <button
        //     onClick={() => sendTestLink(row.id)}
        //     className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-medium"
        //   >
        //     Send Test
        //   </button>
        // )} */}

        //   <button
        //     onClick={() => openEdit(row)}
        //     className="text-xs bg-gray-50 cursor-pointer text-gray-700 hover:bg-gray-100 px-2.5 py-1 rounded-lg font-medium"
        //   >
        //     <Eye size={16} />
        //   </button>

        //   <button
        //     onClick={() => toggleStatus(row.id)}
        //     className={`text-xs px-2.5 py-1 rounded-lg font-medium ${row.status === "active"
        //         ? "bg-red-50 text-red-700"
        //         : "bg-emerald-50 text-emerald-700"
        //       }`}
        //   >
        //     {row.status === "active" ? "Deactivate" : "Activate"}
        //   </button>
        // </div>
        // console.log("rr", row)
        return (
          <>
            <div className="flex items-center gap-2">
              {/* Send Test (only if not bulk mode & not sent) */}
              {/* {!row.testSent && !bulkMode && (
          <button
            onClick={() => sendTestLink(row.id)}
            className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg font-medium"
          >
            Send Test
          </button>
        )} */}

              <button
                onClick={() => {
                  const basePath = role === "sub_vendor" ? "/subvendor/user-management" : "/vendor/candidates";
                  navigate(`${basePath}/${row.id}`);
                }}
                className="text-xs bg-gray-50 cursor-pointer text-gray-700 hover:bg-gray-100 px-2.5 py-1 rounded-lg font-medium"
                title="View Details"
              >
                <Eye size={16} />
              </button>

              {/* <button

                className={`text-xs px-2.5 py-1 rounded-lg font-medium ${row.status === "active"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
                  }`}
              >
                {row.status === "active" ? "Deactivate" : "Activate"}
              </button> */}

              {
                row?.testCount > 0 ? (
                  <button
                    onClick={() => {
                      setDeleteUserDetails(row);
                      setShowActiveInactiveModal(true);
                    }}
                    className={`px-3 text-xs cursor-pointer py-2 rounded text-white font-semibold ${row?.status == "active"
                      ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                      : "bg-green-500 hover:bg-green-600"
                      } transition-all transform hover:scale-105 shadow-md`}
                  >
                    {row?.status == "active" ? "Deactivate" : "Activate"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDeleteUserDetails(row);
                      setShowDeleteModal(true);
                    }}
                    className="px-3 text-xs cursor-pointer py-2 rounded text-white bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </button>
                )
              }

            </div>
          </>
        )
      },
    },
  ];

  console.log("jo-code", minCgpa, maxCgpa);

  return (
    <div className="p-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Candidates</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {data?.total} total candidates registered
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            + Add Candidate
          </button>

          <label onClick={() => setShowImportModal(true)}
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Import CSV
          </label>
        </div>
      </div>

      {/* Filters */}
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-48">
          <input placeholder="🔍 Search by name or email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50" />
        </div>

        {/* Status */}
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Nationality */}
        <select value={filterNationality} onChange={(e) => setFilterNationality(e.target.value)}
          className="border max-w-48 outline-none border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
          <option value="">Nationality (All)</option>
          {countryData?.data?.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>

        {/* Date Range Picker */}
        <div className="relative">
          <button onClick={() => setShowCalendar(p => !p)}
            className={`border rounded-xl px-3 py-2.5 text-sm bg-white min-w-[200px] text-left
        ${fromDate && toDate ? 'border-indigo-400 text-indigo-600' : 'border-gray-200 text-gray-500'}`}>
            {fromDate && toDate ? `${fromDate} → ${toDate}` : '📅 Select date range'}
          </button>

          {showCalendar && (
            <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-72">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => { if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear(y => y - 1); } else setCalViewMonth(m => m - 1); }}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">‹</button>
                <span className="text-sm font-semibold">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][calViewMonth]} {calViewYear}
                </span>
                <button onClick={() => { if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear(y => y + 1); } else setCalViewMonth(m => m + 1); }}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">›</button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d =>
                  <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-0.5">
                {Array(new Date(calViewYear, calViewMonth, 1).getDay()).fill(null).map((_, i) =>
                  <div key={`e${i}`} />)}
                {Array(new Date(calViewYear, calViewMonth + 1, 0).getDate()).fill(null).map((_, i) => {
                  const d = i + 1;
                  const key = `${calViewYear}-${String(calViewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                  const isStart = key === fromDate, isEnd = key === toDate;
                  const inRange = fromDate && toDate && key > fromDate && key < toDate;
                  return (
                    <button key={key} onClick={() => {
                      if (!fromDate || (fromDate && toDate)) {
                        setFromDate(key); setToDate(""); setSelectingEnd(true);
                      } else {
                        if (key < fromDate) { setToDate(fromDate); setFromDate(key); }
                        else setToDate(key);
                        setSelectingEnd(false);
                      }
                    }}
                      className={`text-xs py-1.5 rounded-lg text-center transition-colors
                  ${isStart || isEnd ? 'bg-indigo-600 text-white' : ''}
                  ${inRange ? 'bg-indigo-50 text-indigo-700' : ''}
                  ${!isStart && !isEnd && !inRange ? 'hover:bg-gray-100 text-gray-700' : ''}
                `}>
                      {d}
                    </button>
                  );
                })}
              </div>

              {/* Hint */}
              <p className="text-xs text-gray-400 mt-2 text-center">
                {!fromDate ? 'Select start date' : !toDate ? 'Select end date' : `${fromDate} → ${toDate}`}
              </p>

              {/* Footer */}
              <div className="flex justify-between mt-3">
                <button onClick={() => { setFromDate(""); setToDate(""); setSelectingEnd(false); }}
                  className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
                <button onClick={() => setShowCalendar(false)}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg">Apply</button>
              </div>
            </div>
          )}
        </div>

        {/* CGPA Range Dropdown */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (!val) { setMinCgpa(""); setMaxCgpa(""); }
            else { const [mn, mx] = val.split(","); setMinCgpa(mn); setMaxCgpa(mx); }
          }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white">
          <option value="">All CGPA</option>
          <option value="0,4">Below 4.0</option>
          <option value="4,5">4.0 – 5.0</option>
          <option value="5,6">5.0 – 6.0</option>
          <option value="6,7">6.0 – 7.0</option>
          <option value="7,8">7.0 – 8.0</option>
          <option value="8,9">8.0 – 9.0</option>
          <option value="9,10">9.0 – 10.0</option>
        </select>
      </div>

      {/* ── Bulk action bar (visible only when rows are checked) ── */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3">
          <span className="text-sm font-medium text-indigo-700">
            {selectedIds.length} candidate{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs border border-indigo-200 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleBulkSendTest}
              disabled={isTestWorking || selectedIds.length === 0}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm
    ${isTestWorking || selectedIds.length === 0
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {isTestWorking ? "Sending..." : "Send Test to Selected"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {
          data?.candidates?.length > 0 &&
          <div className="py-3 px-4">
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className="bg-indigo-50 cursor-pointer text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              {bulkMode ? 'Cancel' : 'Send Test Link'}
            </button>
          </div>
        }


        <Table
          columns={columns}
          data={filteredData}
          emptyMessage="No candidates match your search"
        />
        {/* Pagination */}
        {
          data?.candidates?.length > 0 &&
          <div className="p-4 flex items-center justify-between">
            <div className="text-xs text-[#286a94]">
              Showing {Math.min((page - 1) * pageSize + 1, total)}-
              {Math.min(page * pageSize, total)} of {total} users
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#286a94]">Rows</span>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 rounded-md text-xs outline-none   border border-[#286a94] text-[#286a94] bg-white">
                  {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <Pagination page={page} totalPages={data?.total_pages} setPage={setPage} />
            </div>
          </div>
        }


      </div>

      {/* Add Modal */}
      {showModal && (
        <UserForm onSubmit={handleFormSubmit} isVendorAdding={isVendorAdding} onClose={() => setShowModal(false)} />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportUsers onSubmit={handleFormSubmit} isVendorImporting={isVendorImporting} onClose={() => setShowImportModal(false)} />
      )}

      {/* ACTIVATE INACTIVATE FUNCTIONALITY FOR CANDIDATES */}
      <CustomModal
        isOpen={showactiveInactiveModal}
        onClose={() => [setShowActiveInactiveModal(false), setDeleteUserDetails(null)]}
        onConfirm={handleActiveInactive}
        title={`${deleteUserDetails?.status == "active" ? `Deactivate Candidate` : 'Activate Candidate  '}`}
        confirmText={`${deleteUserDetails?.status == "active" ? `Yes, Deactivate` : 'Yes, Activate  '}`}
        loading={userLoading}
      >
        {deleteUserDetails?.status == "active" && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Deactivation Warning</h3>
              <p className="text-xs text-red-700 mt-1">This action will immediately revoke the candidate's access and testing privileges.</p>
            </div>
          </div>
        )}

        {deleteUserDetails?.status == "inactive" && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-800">Activation Confirmation</h3>
              <p className="text-xs text-green-700 mt-1">This will restore the candidate's access and testing privileges.</p>
            </div>
          </div>
        )}

        <div className="relative">
          <div
            className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${deleteUserDetails?.status == "active"
              ? "bg-gradient-to-r from-red-500 to-red-600 opacity-10"
              : "bg-gradient-to-r from-green-500 to-green-600 opacity-5"
              }`}
          />
          <div
            className={`relative border rounded-xl p-3 backdrop-blur-sm ${deleteUserDetails?.status == "active"
              ? "bg-white/90 border-red-200 shadow-red-100"
              : "bg-white/90 border-green-200"
              } shadow-xl`}
          >
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-3">
                <h4 className={`text-lg font-semibold text-center ${deleteUserDetails?.status == "active" ? "text-red-900" : "text-green-900"
                  }`}>
                  {deleteUserDetails?.first_name} {deleteUserDetails?.last_name}
                </h4>
                <div className="text-center mt-2 space-y-1">
                  <p className="text-sm text-gray-500">{deleteUserDetails?.email}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                    <span>📍 {deleteUserDetails?.country || "—"}</span>
                    <span>📞 +{deleteUserDetails?.mobile || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-around items-center">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${deleteUserDetails?.status == "active"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                    {deleteUserDetails?.status == "active" ? "● Active" : "○ Inactive"}
                  </div>
                </div>
                {deleteUserDetails?.testCount > 0 && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                      📊 {deleteUserDetails?.testCount} Tests
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


      </CustomModal>

      {/*  DELETE FUNCTONALITY FOR CANDIDATES */}
      <CustomModal
        isOpen={showDeleteModal}
        onClose={() => [setShowDeleteModal(false), setDeleteUserDetails(null)]}
        onConfirm={handleDelete}
        title="Delete Candidate"
        confirmText="Yes, Delete"
        loading={deleteLoading}
      >
        Are you sure you want to delete this candidate?

        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <p className="font-semibold text-red-700">
            {deleteUserDetails?.first_name} {deleteUserDetails?.last_name}
          </p>
          <p className="text-sm text-gray-600">
            {deleteUserDetails?.email}
          </p>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          This action cannot be undone.
        </p>
      </CustomModal>


    </div>
  );
}

