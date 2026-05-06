import { api } from './api';

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserByVendor: builder.query({
      query: ({
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
        owner_filter,
      }) => ({
        url: `/campus/candidates`,
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
          owner_filter,
          page,
          limit: pageSize,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Vendor"],
    }),
    addVendor: builder.mutation({
      query: (vendor) => ({
        url: '/vendor/add_candidate',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Vendor'],
    }),
    importVendor: builder.mutation({
      query: (vendor) => ({
        url: '/vendor/import_candidates',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Vendor'],
    }),
    addCampusVendor: builder.mutation({
      query: (vendor) => ({
        url: '/campus/add_candidate',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Vendor','vendorDashboard'],
    }),
    importCampusVendor: builder.mutation({
      query: (vendor) => ({
        url: '/campus/import_candidates',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Vendor','vendorDashboard'],
    }),
    sendTestLinkToUser: builder.mutation({
      query: (data) => (
        {
          url: '/vendor/send_candidate_test',
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      ),
      invalidatesTags: ['Vendor','vendorDashboard'],
    }),
    activeInactiveCandidate: builder.mutation({
      query: (data) => (
        {
          url: '/vendor/candidates/status',
          method: "PATCH",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      ),
      invalidatesTags: ['Vendor','vendorDashboard'],
    }),
    getVendorProfile: builder.query({
      query: () => ({
        url: `/campus/profile`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ['VendorProfile'],
    }),
    updateVendorProfile: builder.mutation({
      query: (data) => ({
        url: `/campus/profile`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["VendorProfile"]
    }),
    addCompanyProfile: builder.mutation({
      query: (data) => ({
        url: `/vendor/company`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    updateCompanyProfile: builder.mutation({
      query: (data) => ({
        url: `/vendor/company`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    addBranchDetails: builder.mutation({
      query: (data) => ({
        url: `/vendor/company/branch`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    updateBranchDetails: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `/vendor/company/branch/${id}`,
        method: "PUT",
        body: formdata,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/vendor/change-password`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
    }),
    deleteBranchDetails: builder.mutation({
      query: (id) => ({
        url: `/vendor/company/branch/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    getSubscriptionDetail: builder.query({
      query: (param) => ({
        url: `/vendor/subscriptions?selection=${param ?? ''}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    selectVendorSubscription: builder.mutation({
      query: (data) => ({
        url: `/vendor/select_plan`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    viewSubscriptionList: builder.query({
      query: () => ({
        url: `/vendor/get_plans`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    vendorDashboardApi: builder.query({
      query: () => ({
        url: `/vendor/dashboard`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: "GET",
      }),
      providesTags:["vendorDashboard"]
    }),
    resultManagementData: builder.query({
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
        url: `/vendor/results`,
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
    viewResultByUserId: builder.query({
      query: ({ resultId, candidateId }) => ({
        url: `/vendor/result/specific?result_id=${resultId}&candidate_id=${candidateId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    }),
    downloadCandidateResult: builder.mutation({
      query: ({ resultId, format = "pdf" }) => ({
        url: `/vendor/result/download?result_id=${resultId}&format=${format}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return await response.blob();
        },
      })
    }),
    listofSubVendor: builder.query({
      query: ({ search = '', active = '', plan = '', page = '', size = '' }) => ({
        url: `/vendor/sub-vendors?search=${search}&active=${active}&plan=${plan}&page=${page}&limit=${size}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ['subvendor'],
    }),
    listofSubscription: builder.query({
      query: () => ({
        url: `/vendor/subscriptions/dropdown`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    registerSubVendor: builder.mutation({
      query: (data) => ({
        url: `/vendor/sub-vendors/create`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["subvendor"]
    }),
    activeDeactiveSubVendor: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `/vendor/sub-vendors/${id}/status`,
        method: "PATCH",
        body: formdata,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["subvendor"]
    }),
    assignSubVendorSubscription: builder.mutation({
      query: ({ id, details }) => ({
        url: `/vendor/sub-vendors/${id}/assign-plans`,
        method: "POST",
        body: details,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["subvendor"]
    }),
    viewSubVendorDetails: builder.query({
      query: (id) => ({
        url: `/vendor/sub-vendors/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    deleteCandidateByCandidateId: builder.mutation({
      query: (candidateId) => ({
        url: `/vendor/candidate/${candidateId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["Vendor"]
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/vendor/logout`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    getDegreeCampusDetails: builder.query({
      query: (id) => ({
        url: `/campus/degrees`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    getDepartmentCampusDetails: builder.query({
      query: () => ({
        url: `/campus/departments`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    getAddonCredits: builder.query({
      query: () => ({
        url: `/vendor/addon-options`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    addonCreditsCheckout: builder.mutation({
      query: (data) => ({
        url: `/vendor/create_addon_checkout`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["subvendor"]
    }),

    getSpecializationCampusDetails: builder.query({
      query: () => ({
        url: `/campus/specializations`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    getCandidateById: builder.query({
      query: (candidateId) => ({
        url: `/campus/candidate/${candidateId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ["Vendor"],
    }),
    getCandidateOwnerDropdown: builder.query({
      query: () => ({
        url: `/campus/candidate-owner-dropdown`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ["Vendor"],
    }),
  }),
});

export const { useAddonCreditsCheckoutMutation, useChangePasswordMutation, useGetAddonCreditsQuery, useListofSubscriptionQuery, useGetDepartmentCampusDetailsQuery, useGetSpecializationCampusDetailsQuery, useGetDegreeCampusDetailsQuery, useViewSubVendorDetailsQuery, useAssignSubVendorSubscriptionMutation, useGetAllUserByVendorQuery, useAddVendorMutation, useListofSubVendorQuery,
  useSendTestLinkToUserMutation, useImportVendorMutation, useRegisterSubVendorMutation, useActiveDeactiveSubVendorMutation,
  useGetVendorProfileQuery, useUpdateVendorProfileMutation, useAddCompanyProfileMutation, useDeleteCandidateByCandidateIdMutation,
  useUpdateCompanyProfileMutation, useAddBranchDetailsMutation, useDeleteBranchDetailsMutation,
  useUpdateBranchDetailsMutation, useGetSubscriptionDetailQuery, useLazyGetSubscriptionDetailQuery,
  useSelectVendorSubscriptionMutation, useViewSubscriptionListQuery, useVendorDashboardApiQuery,
  useResultManagementDataQuery, useViewResultByUserIdQuery, useDownloadCandidateResultMutation,
  useLogoutMutation, useAddCampusVendorMutation, useImportCampusVendorMutation, useActiveInactiveCandidateMutation, useGetCandidateByIdQuery, useGetCandidateOwnerDropdownQuery
} = vendorApi;
