import { apiSlice } from "../api/apiSlice";
import { EnrollmentVerification } from "../../types/EnrollmentVerification";


export const enrollmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyEnrollment: builder.query<EnrollmentVerification, { code: string }>({
      query: (code) => `/enrollment_verification/${code}`,
    }),
  }),
});

export const {
  useLazyVerifyEnrollmentQuery,
} = enrollmentApiSlice;