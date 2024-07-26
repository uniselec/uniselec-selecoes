import { Result, Results, UserParams, User } from "../../types/User";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/users";

function parseQueryParams(params: UserParams) {
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

function getUsers({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createUserMutation(user: User) {
  return { url: endpointUrl, method: "POST", body: user };
}

function updateUserMutation(user: User) {
  return {
    url: `${endpointUrl}/${user.id}`,
    method: "PUT",
    body: user,
  };
}

function getUser({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getUsers: query<Results, UserParams>({
      query: getUsers,
      providesTags: ["Users"],
    }),
    getUser: query<Result, { id: string }>({
      query: getUser,
      providesTags: ["Users"],
    }),
    createUser: mutation<Result, User>({
      query: createUserMutation,
      invalidatesTags: ["Users"],
    }),
    updateUser: mutation<Result, User>({
      query: updateUserMutation,
      invalidatesTags: ["Users"],
    }),
  }),
});


export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} = usersApiSlice;