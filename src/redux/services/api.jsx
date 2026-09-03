import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';

// Base API instance
export const base = import.meta.env.VITE_BASE_URL;

const baseQueryWith401Handling = async (args, api, extraOptions) => {
  // debugger;
  const result = await rawBaseQuery(args, api, extraOptions);
  let localValue = null
  if ((result?.error?.status === 401 || result?.error?.status === 403) && (window.location.pathname !== "/login" && window.location.pathname !== '/admin-login' && window.location.pathname !== '/employee/login')) {
    // ✅ Clear storage
    // debugger;
    // toast.error("Your session has expired. Please sign in again.")
    if (localStorage.getItem('role') == "sub_vendor") {
      localValue = "sub_vendor"
    }
    localStorage.clear();
    sessionStorage.clear();
    // ✅ Redirect to login
    if (localValue == "sub_vendor") {
      setTimeout(() => {
        window.location.replace("/employee/login");
      }, 500)
    } else {
      setTimeout(() => {
        window.location.replace("/");
      }, 500)
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWith401Handling,
  tagTypes: ['Auth', 'User', 'Admin', 'Vendor'],
  endpoints: () => ({}), // endpoints will be injected
});


const rawBaseQuery = fetchBaseQuery({
  baseUrl: base,
  credentials: "include",
});


