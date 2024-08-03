import { Result } from "../../types/StudentSelection";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/student-selection";

export const documentsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query }) => ({
    getStudentSelection: query<Result, void>({
      query: () => endpointUrl,
      providesTags: ["StudentSelection"],
    }),
  }),
});

export const {
  useGetStudentSelectionQuery
} = documentsApiSlice;
