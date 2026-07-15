import { Pagination } from '../user/UserManagement'

import { useState, useEffect } from "react";
import { Modal, StatCard, Table, Badge } from "../../../libs/Ui";
import { useResultManagementDataQuery } from "../../../redux/services/vendorApi";
import { useResultManagementDetailBySubVendorQuery } from "../../../redux/services/subvendorApi";
import ProgressBar from "../../../libs/Progressbar";
import { useGetCountryDataQuery } from "../../../redux/services/externalApi";
import { Eye, X } from "lucide-react";
import useDebounce from '../../../libs/useDebounce';
import { useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  // Remove filter state as we're using backend-only filtering
  const [selectedResult, setSelectedResult] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedQuery = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [country, setCountry] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const role = localStorage.getItem('role');

  const SCORE_RANGES = [
    { label: 'All Scores', min: '', max: '' },
    { label: 'Below 40%', min: 0, max: 0.39 },
    { label: '40% - 50%', min: 0.40, max: 0.50 },
    { label: '50% - 60%', min: 0.50, max: 0.60 },
    { label: 'Above 60%', min: 0.61, max: 1.0 },
  ];



  // Score filters
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  // Additional filter states
  const [filterNationality, setFilterNationality] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [maxCgpa, setMaxCgpa] = useState('');
  const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [calViewYear, setCalViewYear] = useState(new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(new Date().getMonth());

  const {
    data,
    isLoading,
    isError,
  } = role == 'sub_vendor' ? useResultManagementDetailBySubVendorQuery({
    limit: pageSize,
    page,
    search: debouncedQuery,
    country: filterNationality,
    minScore: minCgpa,
    maxScore: maxCgpa,
    fromDate,
    toDate,
    statusFilter,
  }) : useResultManagementDataQuery({
    limit: pageSize,
    page,
    search: debouncedQuery,
    country: filterNationality,
    minScore: minCgpa,
    maxScore: maxCgpa,
    fromDate,
    toDate,
    statusFilter,
  });
  console.log("ddod", data);

  const candidates = data?.candidates?.map(result => {
    const scorePercentage = Number(result.final_score * 100);
    let status = 'completed';
    if (scorePercentage >= 60) {
      status = 'passed';
    } else if (result.testCompleted && scorePercentage < 60) {
      status = 'failed';
    } else if (!result.testCompleted) {
      status = 'pending';
    }

    return {
      ...result,
      score: scorePercentage,
      status: status,
      name: `${result.first_name} ${result.last_name}`,
      testDate: result.created_at
    };
  }) || [];

  const filtered = candidates;

  const stats = {
    sent: data?.test_sent_count || 0,
    completed: data?.test_completed_count || 0,
    passed: data?.test_passed_count || 0,
    failed: data?.test_failed_count || 0,
    avgScore: data?.average_score_percent || 0,
  };

  const navigate = useNavigate()
  // console.log("ddlj",data)

  const columns = [
    {
      key: "name", label: "Candidate", render: (v, row) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          {/* <div className="text-xs text-gray-400">{row.branch || 'N/A'} • {row.year || 'N/A'} Year</div> */}
        </div>
      )
    },
    // { key: "testDate", label: "Test Date", render: v => v ? new Date(v).toLocaleDateString("en-IN") : "—" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile", render: v => v ? `+${v}` : "—" },
    { key: "country_of_residence", label: "Country" },
    // {
    //   key: "status", label: "Status", render: (v, row) => {
    //     const statusColors = {
    //       pending: "amber",
    //       passed: "green",
    //       failed: "red",
    //       completed: "blue"
    //     };
    //     return <Badge variant={statusColors[v] || "gray"}>{v?.charAt(0).toUpperCase() + v?.slice(1) || "Unknown"}</Badge>;
    //   }
    // },

    {
      key: "result",
      label: (
        <div className="text-center">
          Score
          <hr className="my-1 border-t border-dotted border-gray-500" />          {/* <br /> */}
          <span className="text-xs text-gray-500">Level 1 | Level 2 | Level 3</span>
        </div>
      ),
      render: (v, row) => {
        return (
          <div className="flex items-center justify-between text-xs">
            <div className="font-medium">{row?.LEVEL_001 ?? '-'}</div>
            <div className="border-l border-gray-300 h-4 mx-2" />
            <div className="font-medium">{row?.LEVEL_002 ?? '-'}</div>
            <div className="border-l border-gray-300 h-4 mx-2" />
            <div className="font-medium">{row?.LEVEL_003 ?? "-"}   </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button onClick={() => navigate(`/vendor/results/view?candidateId=${row?.candidate_id}`)} className="text-xs flex justify-center items-center w-full cursor-pointer text-indigo-600 hover:underline font-medium">
          <Eye size={18} />
        </button>
      )
    },
  ];


  const total = data?.total ?? 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filterNationality, pageSize, fromDate, toDate, minCgpa, maxCgpa]);


  return (
    <div className="p-2 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Test & Results</h2>
        <p className="text-sm text-gray-500 mt-0.5">Monitor test attempts, scores and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Tests Sent" value={stats.sent} icon="📤" color="blue" />
        <StatCard label="Completed" value={stats.completed} icon="✅" color="emerald" />
        <StatCard label="Passed" value={stats.passed} icon="🏆" color="emerald" />
        <StatCard label="Failed" value={stats.failed} icon="❌" color="rose" />
        <StatCard label="Avg Score" value={`${stats.avgScore}/100`} icon="📊" color="indigo" />
      </div>

      {stats.completed > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Score Distribution</h3>
          <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
            <div className="bg-emerald-400 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(stats.passed / stats.completed) * 100}%` }}>
              {stats.passed > 0 && `${stats.passed} Passed`}
            </div>
            <div className="bg-red-400 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(stats.failed / stats.completed) * 100}%` }}>
              {stats.failed > 0 && `${stats.failed} Failed`}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Pass rate: {Math.round((stats.passed / stats.completed) * 100)}%</span>
            <span>Fail rate: {Math.round((stats.failed / stats.completed) * 100)}%</span>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-48">
          <input placeholder="🔍 Search by name or email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50" />
        </div>


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
          <option value="0.0,0.4">Below 4.0</option>
          <option value="0.4,0.5">4.0 – 5.0</option>
          <option value="0.5,0.6">5.0 – 6.0</option>
          <option value="0.6,0.7">6.0 – 7.0</option>
          <option value="0.7,0.8">7.0 – 8.0</option>
          <option value="0.8,0.9">8.0 – 9.0</option>
          <option value="0.9,1.0">9.0 – 10.0</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4  border-gray-100 flex gap-2 flex-wrap">
          {["all", "completed", "pending", "passed", "failed"].map(f => (
            <button key={f || 'all'} onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${statusFilter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f || 'all'}
            </button>
          ))}
        </div>
        <div className=" w-[96%] mx-auto">
          <Table columns={columns} data={filtered} emptyMessage="No results found" />
          {
            filtered?.length > 0 &&
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
      </div>

      <Modal isOpen={!!selectedResult} onClose={() => setSelectedResult(null)} title="Result Details" size="sm">
        {selectedResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                {selectedResult.score >= 60 ? "🏆" : "📉"}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{selectedResult.name}</div>
                <div className="text-sm text-gray-500">{selectedResult.branch} • {selectedResult.year} Year</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-500">Score</span><span className={`font-bold text-lg ${selectedResult.score >= 60 ? "text-emerald-600" : "text-red-600"}`}>{selectedResult.score}/100</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Status</span><Badge variant={selectedResult.score >= 60 ? "green" : "red"}>{selectedResult.score >= 60 ? "Passed" : "Failed"}</Badge></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Test Date</span><span className="text-sm font-medium">{new Date(selectedResult.testDate).toLocaleDateString("en-IN")}</span></div>
            </div>
            <ProgressBar label="Score" value={selectedResult.score} color={selectedResult.score >= 60 ? "emerald" : "rose"} />
          </div>
        )}
      </Modal>
    </div>
  );
}