import { Result, Results, ApplicationParams, Application } from "../../types/Application";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/applications";

function parseQueryParams(params: Record<string, unknown>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.append(key, String(value));
  });
  return qs.toString();
}

function getApplications({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createApplicationMutation(application: Application) {
  return { url: endpointUrl, method: "POST", body: application };
}

function updateApplicationMutation(application: Application) {
  return { url: endpointUrl, method: "POST", body: application };
}

function getApplication({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const applicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getApplications: query<Results, { page: number; perPage: number; filters: Record<string, string> }>({
      query: ({ page, perPage, filters }) => {
        const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        return `${endpointUrl}?${params.toString()}`;
      },
      providesTags: ["Applications"],
    }),
    getApplication: query<Result, { id: string }>({
      query: getApplication,
      providesTags: ["Applications"],
    }),
    createApplication: mutation<Result, Application>({
      query: createApplicationMutation,
      invalidatesTags: ["Applications"],
    }),
    updateApplication: mutation<Result, Application>({
      query: updateApplicationMutation,
      invalidatesTags: ["Applications"],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useGetApplicationQuery,
} = applicationsApiSlice;
