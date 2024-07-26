import { Result, Results, OrganizationParams, Organization } from "../../types/Organization";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/organizations";

function parseQueryParams(params: OrganizationParams) {
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

  if (params.isActive) {
    query.append("is_active", params.isActive.toString());
  }

  return query.toString();
}

function getOrganizations({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search, isActive: true };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function deleteOrganizationMutation(category: Organization) {
  return {
    url: `${endpointUrl}/${category.id}`,
    method: "DELETE",
  };
}

function createOrganizationMutation(category: Organization) {
  return { url: endpointUrl, method: "POST", body: category };
}

function updateOrganizationMutation(category: Organization) {
  return {
    url: `${endpointUrl}/${category.id}`,
    method: "PUT",
    body: category,
  };
}

function getOrganization({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const organizationsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getOrganizations: query<Results, OrganizationParams>({
      query: getOrganizations,
      providesTags: ["Organizations"],
    }),
    getOrganization: query<Result, { id: string }>({
      query: getOrganization,
      providesTags: ["Organizations"],
    }),
    createOrganization: mutation<Result, Organization>({
      query: createOrganizationMutation,
      invalidatesTags: ["Organizations"],
    }),
    deleteOrganization: mutation<Result, { id: string }>({
      query: deleteOrganizationMutation,
      invalidatesTags: ["Organizations"],
    }),
    updateOrganization: mutation<Result, Organization>({
      query: updateOrganizationMutation,
      invalidatesTags: ["Organizations"],
    }),
  }),
});


export const {
  useGetOrganizationsQuery,
  useDeleteOrganizationMutation,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useGetOrganizationQuery,
} = organizationsApiSlice;