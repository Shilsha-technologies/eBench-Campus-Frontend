import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import ImportUsers from "./ImportUsers";
import { useActiveInactiveCandidateMutation, useAddCampusVendorMutation, useDeleteCandidateByCandidateIdMutation, useGetAllUserByVendorQuery, useImportCampusVendorMutation, useSendTestLinkToUserMutation } from "../../../redux/services/vendorApi";
import useDebounce from "../../../libs/useDebounce";
import { useGetCountryDataQuery } from "../../../redux/services/externalApi";
import { useActivateInactivateUserBySubVendorMutation, useAddCandidateBySubVendorMutation, useDeleteCandidateByCandidateIdbySubVendorMutation, useGetAllCandidatesBySubVendorQuery, useImportCandidateBySubVendorMutation, useSendTestLinkToCandidatesMutation } from "../../../redux/services/subvendorApi";
import { useGetCandidateOwnerDropdownQuery } from "../../../redux/services/vendorApi";
import { Tooltip } from 'react-tooltip'
import CustomModal from "../../../libs/CustomModal";
import { Badge, Table } from "../../../libs/Ui";
import toast from "react-hot-toast";
import { Eye, Download } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SendTestLinkModal from "../../coding/Code";
import LevelDifficultyPopup from "../../coding/Code";

export default function CandidatesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sub_vendor_id = searchParams.get("sub_vendor_id")
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
  const [showImportModal, setShowImportModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSendTestModal, setShowSendTestModal] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [maxCgpa, setMaxCgpa] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [calViewYear, setCalViewYear] = useState(new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(new Date().getMonth());
  const [ownerFilter, setOwnerFilter] = useState("all");
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
  const [showPopup, setShowPopup] = useState(false);


  const { data: ownerDropdownData } = role === "sub_vendor" ? { dropdown: [] } : useGetCandidateOwnerDropdownQuery();

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
          min_cgpa: minCgpa, max_cgpa: maxCgpa, owner_filter: ownerFilter
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
  console.log("lop", selectedIds)


  const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();

  if (error?.status === 401) {
    window.location.href = "/login";
    localStorage.clear();
    return;
  }


  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filterNationality, filterStatus, pageSize, fromDate, toDate, minCgpa, maxCgpa, ownerFilter]);

  // Handle URL parameter for automatic filtering
  useEffect(() => {
    if (sub_vendor_id && ownerDropdownData?.dropdown) {
      // Find the owner filter value that matches the sub_vendor_id
      const matchedOwner = ownerDropdownData.dropdown.find(item => item.value === sub_vendor_id);
      if (matchedOwner) {
        setOwnerFilter(sub_vendor_id);
      }
    }
  }, [sub_vendor_id, ownerDropdownData]);


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, { isLoading: deleteLoading }] = role == "sub_vendor" ? useDeleteCandidateByCandidateIdbySubVendorMutation() : useDeleteCandidateByCandidateIdMutation();

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
    // debugger
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
        is_persuing,
        skills
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
      formdata.append("is_pursuing", is_persuing ? true : false);

      if (skills && skills.length > 0) {
        formdata.append('skills', JSON.stringify(skills));
      }
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

  // console.log("deactive-model", deleteUserDetails);

  const openAdd = () => {
    setEditCandidate(null);
    setForm({ name: "", email: "", phone: "", branch: "CSE", year: "1st" });
    setErrors({});
    setShowModal(true);
  };


  const total = data?.total ?? 0;

  const [sendTestLinkToUser, { isLoading: isTestWorking }] = localStorage.getItem('role') == "sub_vendor" ? useSendTestLinkToCandidatesMutation() : useSendTestLinkToUserMutation();

  const handleBulkSendTest = () => {
    if (!selectedIds.length) return;
    // setShowSendTestModal(true);
    setShowPopup(true)
  };



  const handleDownloadReference = async () => {
    setIsDownloading(true);
    try {
      // API call to download reference CSV
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/campus/sample-csv`);
      if (!response.ok) {
        throw new Error('Failed to download reference file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'candidate_reference_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download reference file. Please try again.');
    } finally {
      setIsDownloading(false);
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

  // console.log("jo-code", minCgpa, maxCgpa);

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
            className={`${role === "sub_vendor" ? "bg-[#185FA5] hover:bg-[#0C447C]" : "bg-indigo-600 hover:bg-indigo-700"} cursor-pointer text-white px-4 py-2 rounded-xl text-sm transition-colors`}
          >
            + Add Candidate
          </button>

          <label onClick={() => setShowImportModal(true)}
            className={`${role === "sub_vendor" ? "bg-[#185FA5] hover:bg-[#0C447C]" : "bg-indigo-600 hover:bg-indigo-700"} cursor-pointer text-white px-4 py-2 rounded-xl text-sm  transition-colors`}
          >
            Import CSV
          </label>
          <button
            className={`${role === "sub_vendor" ? "bg-[#185FA5] hover:bg-[#0C447C]" : "bg-indigo-600 hover:bg-indigo-700"} cursor-pointer text-white px-4 py-2 rounded-xl text-sm  flex items-center gap-2 transition-colors`}

            onClick={handleDownloadReference}
            disabled={isDownloading}
          >
            <Download size={16} />
            {isDownloading ? 'Downloading...' : 'Reference CSV File'}
          </button>
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


        {/* Owner Filter */}
        {role !== "sub_vendor" && (
          <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}
            className="border max-w-48 outline-none border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
            {ownerDropdownData?.dropdown?.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        )}


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
              onClick={() => [setBulkMode(!bulkMode), setSelectedIds([])]}
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

      {/* Send Test Link Modal */}
      {/* <SendTestLinkModal
        isOpen={showSendTestModal}
        onClose={() => setShowSendTestModal(false)}
        onSend={handleSendTestWithLevel}
      /> */}
      {/* <SendTestLinkModal /> */}
      <LevelDifficultyPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={async ({ level, difficulty, closePopup }) => {
          // use the selected level + difficulty objects here
          // console.log(closePopup, "closePopup")
          const data = {
            candidate_ids: selectedIds,
            level_id: level?._id,
            difficulty_diff_id: difficulty?._id,
          }
          // handleSendTestWithLevel(data, closePopup)
          try {
            const result = await sendTestLinkToUser(data).unwrap();
            // console.log(result, "result");
            if (result?.data) {
              setTimeout(() => {
                toast.success(`Test link sent successfully`);
              }, 200);
              setSelectedIds([]);
              setBulkMode(!bulkMode)
              closePopup();
            }

            if (result?.error) {
              toast.error(result?.error?.data?.message ?? "Failed to send link");
              return;
            }
            // console.log("resss", result);

          } catch (err) {
            toast.error(err?.data?.message ?? "Failed to send link");
            throw err;
          }
          // console.log(data, "hello-print");
        }}
      />

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