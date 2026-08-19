import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCandidateByIdQuery } from "../../../redux/services/vendorApi";
import { useGetCandidateByIdBySubVendorQuery } from "../../../redux/services/subvendorApi";
import { ArrowLeft, User, Mail, Phone, Calendar, GraduationCap, Award, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, PlayCircle, Download, Eye } from "lucide-react";

export default function CandidateDetailsPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  // Get user role from localStorage
  const role = localStorage.getItem('role');
  const [isParentModalOpen, setParentModalOpen] = useState(false);
  const [parentForm, setParentForm] = useState({
    fatherName: '',
    motherName: '',
    guardianName: '',
    email: '',
    phone: ''
  });

  // Use appropriate API based on role
  const vendorQuery = useGetCandidateByIdQuery(candidateId, {
    skip: !candidateId || role !== 'vendor'
  });

  const subvendorQuery = useGetCandidateByIdBySubVendorQuery(candidateId, {
    skip: !candidateId || role !== 'sub_vendor'
  });

  // Select the appropriate query result based on role
  const { data: candidateData, isLoading, error } = role === 'sub_vendor' ? subvendorQuery : vendorQuery;

  const candidate = candidateData?.candidate;
  // console.log("candidate", candidate)

  useEffect(() => {
    if (error?.status === 401) {
      window.location.href = '/login';
      localStorage.clear();
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="p-6 pt-3 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#286a94]"></div>
              <p className="mt-2 text-gray-500">Loading candidate details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="p-6 pt-3 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Failed to load candidate details</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-[#286a94] text-white rounded-md hover:bg-[#1f5278] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (<>
    <div className="p-6 pt-3 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white cursor-pointer hover:bg-gray-50 rounded-xl transition-all duration-200 group shadow-sm border border-indigo-200"
              >
                <ArrowLeft className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-indigo-900">Candidate Details</h1>
                <p className="text-xs text-indigo-600 mt-1">Complete profile overview and performance analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border ${candidate?.is_active ? 'border-green-200' : 'border-red-200'}`}>
                <div className={`w-2 h-2 ${candidate?.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full`}></div>
                <span className={`text-sm font-medium ${candidate?.is_active ? 'text-green-700' : 'text-red-700'}`}>
                  {candidate?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {/* <button onClick={() => setParentModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Add Parent Details
              </button>
              <ParentModal isOpen={isParentModalOpen} onClose={() => setParentModalOpen(false)} /> */}

            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-indigo-200">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-indigo-800 font-medium">{candidate?.first_name && candidate?.last_name ? `${candidate.first_name} ${candidate.last_name}` : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Mail className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-indigo-800 font-medium">{candidate?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Phone className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-indigo-800 font-medium">{candidate?.mobile ? `+${candidate.mobile}` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm">
              <User className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-900">Personal Information</h2>
              <p className="text-xs text-indigo-600 mt-1">Basic contact and demographic details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
              <p className="text-lg font-bold text-gray-900 mt-2">{candidate.first_name && candidate.last_name ? `${candidate.first_name} ${candidate.last_name}` : 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-base font-medium text-gray-900">{candidate.email || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
              <div className="flex items-center gap-2 mt-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-base font-medium text-gray-900">{candidate.mobile ? `+${candidate.mobile}` : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Birth Country</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.birth_country || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nationality</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.nationality || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country of Residence</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.country_of_residence || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Father's Name</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.father_name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mother's Name</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.mother_name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guardian Name</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.guardian_name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guardian Email</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.guardian_email || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guardian Mobile</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.guardian_mobile || 'N/A'}</p>
            </div>


            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nationality</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.nationality || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country of Residence</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.country_of_residence || 'N/A'}</p>
            </div>
          </div>
        </div>




        {/* Academic Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadowmt-5 duration-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm">
              <GraduationCap className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-900">Academic Information</h2>
              <p className="text-xs text-indigo-600 mt-1">Educational background and academic details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">University</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.university_name || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">College</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.college_name || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Degree</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.degree || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialization</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.specialization || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.department || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CGPA</label>
              <p className="text-lg font-bold text-green-600 mt-2">{candidate.cgpa || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrollment Year</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.enrollment_year || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Graduation Year</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.graduation_year || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll Number</label>
              <p className="text-base font-medium text-gray-900 mt-2">{candidate.roll_number || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Currently Pursuing</label>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${candidate.is_pursuing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {candidate.is_pursuing ? 'Active Student' : 'Graduated'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Statistics Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm">
              <TrendingUp className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-900">Test Statistics</h2>
              <p className="text-xs text-indigo-600 mt-1">Overall test performance and completion metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:from-gray-100 hover:to-gray-150 transition-all duration-200 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{candidate.test_stats?.total_tests || 0}</div>
                <div className="text-sm font-semibold text-gray-600 mt-2">Total Tests</div>
                <div className="w-12 h-1 bg-gray-300 rounded-full mt-3"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 hover:from-green-100 hover:to-emerald-150 transition-all duration-200 border border-green-200">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-green-600">{candidate.test_stats?.completed_tests || 0}</div>
                <div className="text-sm font-semibold text-green-700 mt-2">Completed</div>
                <div className="w-12 h-1 bg-green-400 rounded-full mt-3"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 hover:from-blue-100 hover:to-indigo-150 transition-all duration-200 border border-blue-200">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-600">{candidate.test_stats?.passed_tests || 0}</div>
                <div className="text-sm font-semibold text-blue-700 mt-2">Passed</div>
                <div className="w-12 h-1 bg-blue-400 rounded-full mt-3"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-6 hover:from-amber-100 hover:to-yellow-150 transition-all duration-200 border border-amber-200">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-amber-600">{candidate.test_stats?.average_score_percent || 0}%</div>
                <div className="text-sm font-semibold text-amber-700 mt-2">Average Score</div>
                <div className="w-12 h-1 bg-amber-400 rounded-full mt-3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Test History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm">
              <Clock className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-900">Test History</h2>
              <p className="text-xs text-indigo-600 mt-1">Detailed test attempts and performance records</p>
            </div>
          </div>

          {candidate.test_history && candidate.test_history.length > 0 ? (
            <div className="space-y-4">
              {candidate.test_history.map((test, index) => (
                <div key={test.result_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {test.successful ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium text-gray-900">Test #{index + 1}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.successful ? 'completed' : 'failed')}`}>
                        {test.successful ? 'Completed' : 'Failed'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Score</div>
                        <div className={`text-lg font-bold ${getScoreColor(test.final_score)}`}>
                          {(test.final_score * 100).toFixed(1)}%
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="text-sm text-gray-900">
                          {new Date(test.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  {test.successful && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500">Eye Contact</div>
                        <div className="text-sm font-medium text-gray-900">{(test.eye_contact * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Posture</div>
                        <div className="text-sm font-medium text-gray-900">{(test.posture_score * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Audio Confidence</div>
                        <div className="text-sm font-medium text-gray-900">{(test.audio_confidence * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Speech Rate</div>
                        <div className="text-sm font-medium text-gray-900">{test.speech_rate_wpm} WPM</div>
                      </div>
                    </div>
                  )}

                  {/* AI Feedback */}
                  {test.metrics_json?.feedback?.vendor && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-900 mb-2">AI Feedback</div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-800">
                          <div className="font-medium mb-1">Summary:</div>
                          <p>{test.metrics_json.feedback.vendor.performance_summary}</p>
                          {test.metrics_json.feedback.vendor.recommendations && (
                            <div className="mt-2">
                              <div className="font-medium">Recommendations:</div>
                              <ul className="list-disc list-inside text-sm mt-1">
                                {test.metrics_json.feedback.vendor.recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transcript */}
                  {test.transcript && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-900 mb-2">Transcript</div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 italic">"{test.transcript}"</p>
                        <div className="text-xs text-gray-500 mt-2">
                          Language: {test.detected_language}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No test history available</p>
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm">
              <Award className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-900">Status Information</h2>
              <p className="text-xs text-indigo-600 mt-1">Account status and verification details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Status</label>
              <div className="flex items-center gap-2 mt-3">
                {candidate.is_active ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${candidate.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {candidate.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Status</label>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {candidate.mail_status?.replace('_', ' ') || 'Not sent'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Created</label>
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${candidate.is_account_created ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {candidate.is_account_created ? 'Created' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification Status</label>
              <div className="flex items-center gap-2 mt-3">
                {candidate.verified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <span className={`text-sm font-semibold ${candidate.verified ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                  {candidate.verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Link Expires</label>
              <p className="text-sm font-medium text-gray-900 mt-3">
                {candidate.test_link_expires_at ?
                  new Date(candidate.test_link_expires_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) :
                  'N/A'
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Since</label>
              <p className="text-sm font-medium text-gray-900 mt-3">
                {candidate.created_at ?
                  new Date(candidate.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) :
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

const InputField = ({ label, type = "text", placeholder, value, onChange, icon }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50
                   hover:border-blue-300 focus:border-blue-400 focus:outline-none
                   focus:ring-2 focus:ring-blue-200 transition-colors duration-150
                   text-slate-700 placeholder:text-slate-400"
      />
    </div>
  </div>
);

// Icons
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export function ParentModal({ isOpen, onClose }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [parentForm, setParentForm] = useState({
    fatherName: "",
    motherName: "",
    guardianName: "",
    email: "",
    phone: "",
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 800);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0zM3 12a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-tight">Parent Details</p>
              <p className="text-blue-100 text-xs">Fill in the guardian information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors duration-150"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField label="Father's Name" placeholder="Enter name" icon={<UserIcon />} value={parentForm.fatherName} onChange={(e) => setParentForm({ ...parentForm, fatherName: e.target.value })} />
            <InputField label="Mother's Name" placeholder="Enter name" icon={<UserIcon />} value={parentForm.motherName} onChange={(e) => setParentForm({ ...parentForm, motherName: e.target.value })} />
          </div>

          <div className="mb-4">
            <InputField label="Guardian Name" placeholder="Enter guardian name" icon={<ShieldIcon />} value={parentForm.guardianName} onChange={(e) => setParentForm({ ...parentForm, guardianName: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <InputField label="Email Address" type="email" placeholder="email@example.com" icon={<MailIcon />} value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} />
            <InputField label="Phone Number" type="tel" placeholder="+91 00000 00000" icon={<PhoneIcon />} value={parentForm.phone} onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })} />
          </div>

          <div className="border-t border-slate-100 mb-4" />

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">All fields are required</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-150 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-2 ${saved ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Details
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}