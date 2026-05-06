import { api } from './api';

export const SubvendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    employeeLogin: builder.mutation({
      query: (data) => ({
        url: "/subvendor/login",
        method: "POST",
        body: data,
      }),
    }),
    getOrganisationDetail: builder.query({
      query: () => ({
        url: `/subvendor/organizations`,
        method: "GET",
      }),
    }),
    subVendorResetPassword: builder.mutation({
      query: (data) => ({
        url: `/subvendor/request-password-reset`,
        method: "POST",
        body: data
      })
    }),
    subVendorChangePassword: builder.mutation({
      query: (data) => ({
        url: `/subvendor/change-password`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    }),
    subVendorResetPasswordApprove: builder.mutation({
      query: (data) => ({
        url: `/subvendor/reset-password`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    }),
    addCandidateBySubVendor: builder.mutation({
      query: (vendor) => ({
        url: '/subvendor/add_candidate',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Candidates'],
    }),
    importCandidateBySubVendor: builder.mutation({
      query: (vendor) => ({
        url: '/subvendor/import_candidates',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Candidates'],
    }),
    getAllCandidatesBySubVendor: builder.query({
      query: (
        {
           page,
        pageSize,
        search,
        filterNationality,
        filterResidence,
        status,
        university,
        degree,
        min_cgpa,
        max_cgpa,
        fromDate,
        toDate,
        sortBy,
        sortOrder,
        }
      ) => ({
         url: `/subvendor/candidates`,
         params: {
          search,
          nationality: filterNationality,
          country: filterResidence,
          status_filter: status,
          university_name: university,
          degree,
          min_cgpa,
          max_cgpa,
          from_date: fromDate,
          to_date: toDate,
          sort_by: sortBy,
          sort_order: sortOrder,
          page,
          limit: pageSize,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Candidates'],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    sendTestLinkToCandidates: builder.mutation({
      query: (data) => (
        {
          url: '/subvendor/send_candidate_test',
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      ),
      invalidatesTags:["Candidates"]

    }),
    resultManagementDetailBySubVendor: builder.query({
      query: (
        {
          limit = 10,
          page = 1,
          search = '',
          minScore = '',
          maxScore = '',
          country = '',
          fromDate = '',
          toDate = '',
          statusFilter = '',
        }
      ) => ({
        url: `/subvendor/results`,
        method: "GET",
        params: {
          limit,
          page,
          search,
          min_score: minScore,
          max_score: maxScore,
          country_of_residence: country,
          from_date: fromDate,
          to_date: toDate,
          status_filter: statusFilter,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    viewResultByUserIdBySubVendor: builder.query({
      query: ({ resultId, candidateId }) => ({
        url: `/subvendor/result/specific?result_id=${resultId}&candidate_id=${candidateId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    }),
    subvendorDashboardApi: builder.query({
      query: () => ({
        url: `/subvendor/dashboard`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: "GET"
      })
    }),
    subvendorProfile: builder.query({
      query: () => ({
        url: `/subvendor/profile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: "GET"
      })
    }),
    deleteCandidateByCandidateIdbySubVendor: builder.mutation({
      query: (candidateId) => ({
        url: `/subvendor/candidate/${candidateId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["Candidates"]
    }),
    getCandidateByIdBySubVendor: builder.query({
      query: (candidateId) => ({
        url: `/subvendor/candidate/${candidateId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ["Subvendor"],
    }),
    activateInactivateUserBySubVendor: builder.mutation({
      query: (data) => ({
        url: '/subvendor/candidates/status',
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Subvendor','subvendorDashboard','Candidates'],
    }),
    subVendorLogout:builder.mutation({
      query:() =>({
        url:`/subvendor/logout`,
        method:"POST",
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
    })
  })
})

export const { useSubvendorDashboardApiQuery, useDeleteCandidateByCandidateIdbySubVendorMutation, useResultManagementDetailBySubVendorQuery,useViewResultByUserIdBySubVendorQuery, useEmployeeLoginMutation,useSendTestLinkToCandidatesMutation, useImportCandidateBySubVendorMutation, useAddCandidateBySubVendorMutation, useGetAllCandidatesBySubVendorQuery,
  useSubVendorChangePasswordMutation, useSubVendorResetPasswordMutation,useSubVendorLogoutMutation,useSubVendorResetPasswordApproveMutation,
  useGetOrganisationDetailQuery,useSubvendorProfileQuery,useGetCandidateByIdBySubVendorQuery,useActivateInactivateUserBySubVendorMutation } = SubvendorApi