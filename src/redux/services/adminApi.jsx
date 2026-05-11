import { api } from './api';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendor: builder.query({
      query: ({ search, status, page, limit }) => (
        {
          url: `/admin/vendors?search=${search}&status=${status}&page=${page}&limit=${limit}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      ),
      providesTags: ["Admin"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false
    }),
    activeInactiveUser: builder.mutation({
      query: (data) => ({
        url: `/admin/vendor/status`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      }),
      invalidatesTags: ['Admin'],
    }),
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `/admin/login`,
        method: "POST",
        body: data
      })
    }),
    getSubscriptions: builder.query({
      query: ({ plan = '', page = 1, size = 10 }) => (
        {
          url: `/admin/get_plans?q=${plan}&page=${page}&page_size=${size}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      ),
      providesTags: ["Subscription"],
    }),
    getFilteredSubscription: builder.query({
      query: ({ country = '', plan = '', pageNumber = '', size = '' }) => ({
        url: `/admin/get_filtered_plans?country=${country ?? ''}&q=${plan}&page=${pageNumber}&page_size=${size}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ["Subscription"],
    }),
    getAllOptionPlan: builder.query({
      query: () => ({
        url: `/admin/get_filtered_plans?country=&q=&page=1&page_size=10`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    addSubscription: builder.mutation({
      query: (body) => ({
        url: "/subscription",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
    setAddonPrice: builder.mutation({
      query: (data) => ({
        url: `/admin/set_addon_discount`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      }),
      invalidatesTags: ['Subscription']
    }),
    updateSubscription: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/subscription/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
    deleteSubscription: builder.mutation({
      query: (data) => (
        {
          url: `/admin/delete_plan`,
          method: "POST",
          body: new URLSearchParams(data),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }),
      invalidatesTags: ["Subscription"],
    }),
    addPlanByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/add_plan`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      }),
      invalidatesTags: ["Subscription"]
    }),
    updatePlanByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/update_plan`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: data
      }),
      invalidatesTags: ["Subscription"]
    }),
    adminDashboard: builder.query({
      query: () => ({
        url: '/admin/dashboard',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `/admin/logout`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    adminChangePassword: builder.mutation({
      query: (data) => (
        {
          url: "/admin/change-password",
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    }),
    getCampusDetails: builder.query({
      query: (campusId) => ({
        url: `/admin/vendors/${campusId}/details`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ["Admin"],
    }),

  }),
});

export const { useAdminChangePasswordMutation, useGetAllVendorQuery, useActiveInactiveUserMutation, useAdminLoginMutation,
  useAdminDashboardQuery, useAdminLogoutMutation,
  useGetFilteredSubscriptionQuery,
  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useAddPlanByAdminMutation,
  useUpdatePlanByAdminMutation,
  useLazyGetAllOptionPlanQuery,
  useSetAddonPriceMutation,
  useGetCampusDetailsQuery
} = adminApi;


// setCreditPrice: builder.mutation({
//       query: (data) => ({
//         url: "/admin/set_credit_price",
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: data,
//       }),
//       invalidatesTags:["Subscription"]
//     }),