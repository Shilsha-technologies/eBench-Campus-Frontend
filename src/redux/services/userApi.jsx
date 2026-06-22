import { api } from './api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: ({ id, token }) => {
        // console.log("Fetching profile for ID:", token);
        return {
          url: `/candidate/details?candidate_id=${id}`,
          method: "GET",
          // credentials:'include'
        };
      },
      providesTags: ["User"],
    }),
    verifyUserOtp: builder.mutation({
      query: (data) => ({
        url: '/candidate/verify_otp',
        method: 'POST',
        body: data,
      }),
    }),
    cookiesGenerate: builder.query({
      query: ({ candidate_id, token }) => ({
        url: `/candidate/start_test?candidate_id=${candidate_id}&token=${token}`,
        method: "GET",
        // no credentials here either
      }),
    }),
    startTest: builder.mutation({
      query: () => ({
        url: `/candidate/test/questions`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials handled by base query (include)
      }),
    }),
    uploadTest: builder.mutation({
      query: (data) => ({
        url: `/candidate/upload_test`,
        method: "POST",
        body: data
      })
    })
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useStartTestMutation,
  useVerifyUserOtpMutation,
  useCookiesGenerateQuery,

  useUploadTestMutation
} = userApi;
