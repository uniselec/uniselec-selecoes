import { apiSlice } from "../api/apiSlice";
import { Result } from "../../types/EnrollmentVerification";


export const enrollmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyEnrollment: builder.query<Result, string>({
      query: (code) => `/enrollment_verification/${code}`,
    }),
  }),
});

export const {
  useLazyVerifyEnrollmentQuery,
} = enrollmentApiSlice;