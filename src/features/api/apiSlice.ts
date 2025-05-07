import { RootState } from './../../app/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Applications", "Users", "Documents", "ProcessSelections"],
    baseQuery: async (args, api, extraOptions) => {
        const state = api.getState() as RootState;
        const token = state.auth.token;

        const baseUrl = token ? import.meta.env.VITE_API_URL + '/api/client' : import.meta.env.VITE_API_URL + '/api';

        const dynamicBaseQuery = fetchBaseQuery({
            baseUrl,
            prepareHeaders: (headers) => {
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                return headers;
            },
        });

        return dynamicBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({}),
});