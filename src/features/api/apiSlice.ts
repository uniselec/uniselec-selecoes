import { logOut } from '../auth/authSlice';
import { RootState } from './../../app/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "Admins",
    "Users",
    "Documents",
    "EventSupportRequests"
  ],
  baseQuery: async (args, api, extraOptions) => {
    const state = api.getState() as RootState;
    const token = state.auth.token;
    // const role = state.auth?.userDetails?.role;
    const baseUrl = token ? import.meta.env.VITE_API_URL + '/api/client' : import.meta.env.VITE_API_URL + '/api';

    const customFetchBaseQuery = fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        const token = state.auth.token;
        headers.set("Accept", "application/json");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      }
    });

    const result = await customFetchBaseQuery(args, api, extraOptions);

    // // Se o token não for mais válido (erro 401), faça logout e redirecione para login
    // if (result.error && result.error.status === 401) {
    //   api.dispatch(logOut());
    //   window.location.href = '/login';
    // }

    return result;
  },
  endpoints: (builder) => ({}),
});
