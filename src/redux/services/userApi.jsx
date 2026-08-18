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
        credentials: "include"
      }),
    }),
    cookiesGenerate: builder.query({
      query: ({ token }) => ({
        url: `/candidate/start_test?t=${token}`,
        method: "GET",
        // no credentials here either
      }),
    }),
    beginTest: builder.mutation({
      query: () => ({
        url: `/candidate/begin_test`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    startTest: builder.query({
      query: () => ({
        url: `/candidate/test/questions`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials handled by base query (include)
      }),
    }),
    getAllQuestions: builder.query({
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
      query: (data) => {
        // console.log("uploadTest payload:", data);
        // debugger;
        return {
          url: "/candidate/upload_test",
          method: "POST",
          body: data,
        };
      },
    }),
    submitMcqAnswers: builder.mutation({
      query: (data) => ({
        url: `/candidate/test/submit-mcq`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    submitScenarioAnswer: builder.mutation({
      query: (data) => ({
        url: `/candidate/scenario/submit`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    submitCoding: builder.mutation({
      query: (data) => ({
        url: `/candidate/coding/submit`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
    }),
    submitFinalTest: builder.mutation({
      query: () => ({
        url: `/candidate/test/submit`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    }),
    runCodingStatus: builder.query({
      query: ({ submission_id }) => ({
        url: `/candidate/coding/run-status`,
        method: 'GET',
        params: { submission_id },
      }),
    }),
    runCoding: builder.mutation({
      query: (data) => ({
        url: `/candidate/coding/run`,
        method: 'POST',
        body: data,
      }),
    })
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useSubmitFinalTestMutation,
  useStartTestQuery,
  useBeginTestMutation,
  useVerifyUserOtpMutation,
  useCookiesGenerateQuery,
  useGetAllQuestionsQuery,
  useSubmitScenarioAnswerMutation,
  useSubmitMcqAnswersMutation,
  useSubmitCodingMutation,
  useRunCodingStatusQuery,
  useRunCodingMutation,
  useLazyRunCodingStatusQuery,
  useUploadTestMutation
} = userApi;
