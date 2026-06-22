import { api, base } from "./api";

export const externalApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getCountryData: builder.query({
      query: () => ({
        url: 'https://countriesnow.space/api/v0.1/countries/flag/images',
        credentials: 'omit'
        // When full URL is provided, RTK Query ignores the original baseUrl
      }),
    }),
    getCountryCurrency: builder.mutation({
      query: (iso2) => ({
        url: 'https://countriesnow.space/api/v0.1/countries/currency',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `iso2=${iso2}`,
        credentials: 'omit'
      }),
    }),
    createCheckoutSubscription: builder.mutation({
      query: (data) => ({
        url: `${base}/vendor/create_subscription_checkout`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      }),
    }),


  }),
});

export const { useGetCountryDataQuery, useGetCountryCurrencyMutation, useCreateCheckoutSubscriptionMutation } = externalApi;


