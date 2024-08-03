import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './../../app/store';

const baseUrl = import.meta.env.VITE_API_URL + '/api';

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const timeout = 10000;

const baseQueryWithTimeout = async (args: any, api: any, extraOptions: any) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const result = await baseQuery({ ...args, signal: controller.signal }, api, extraOptions);
  clearTimeout(timeoutId);
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTimeout,
  tagTypes: ["Applications", "Users", "Documents", "StudentSelection"],
  endpoints: (builder) => ({}),
});
