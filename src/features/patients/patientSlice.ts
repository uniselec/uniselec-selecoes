import { Result, Results, PatientParams, Patient } from "../../types/Patient";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/patients";

function parseQueryParams(params: PatientParams) {
  const query = new URLSearchParams();

  if (params.page) {
    query.append("page", params.page.toString());
  }

  if (params.perPage) {
    query.append("per_page", params.perPage.toString());
  }

  if (params.search) {
    query.append("search", params.search);
  }

  return query.toString();
}

function getPatients({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createPatientMutation(patient: Patient) {
  return { url: endpointUrl, method: "POST", body: patient };
}

function updatePatientMutation(patient: Patient) {
  return {
    url: `${endpointUrl}/${patient.id}`,
    method: "PUT",
    body: patient,
  };
}

function getPatient({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const patientsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getPatients: query<Results, PatientParams>({
      query: getPatients,
      providesTags: ["Patients"],
    }),
    getPatient: query<Result, { id: string }>({
      query: getPatient,
      providesTags: ["Patients"],
    }),
    createPatient: mutation<Result, Patient>({
      query: createPatientMutation,
      invalidatesTags: ["Patients"],
    }),
    updatePatient: mutation<Result, Patient>({
      query: updatePatientMutation,
      invalidatesTags: ["Patients"],
    }),
  }),
});


export const {
  useGetPatientsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useGetPatientQuery,
} = patientsApiSlice;