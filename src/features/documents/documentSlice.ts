import { Result, Results, DocumentParams, Document } from "../../types/Document";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/documents";

function parseQueryParams(params: DocumentParams) {
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

function getDocuments({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createDocumentMutation(document: Document) {
  return { url: endpointUrl, method: "POST", body: document };
}

function updateDocumentMutation(document: Document) {
  return {
    url: `${endpointUrl}/${document.id}`,
    method: "PUT",
    body: document,
  };
}

function getDocument({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const documentsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getDocuments: query<Results, DocumentParams>({
      query: getDocuments,
      providesTags: ["Documents"],
    }),
    getDocument: query<Result, { id: string }>({
      query: getDocument,
      providesTags: ["Documents"],
    }),
    createDocument: mutation<Result, Document>({
      query: createDocumentMutation,
      invalidatesTags: ["Documents"],
    }),
    updateDocument: mutation<Result, Document>({
      query: updateDocumentMutation,
      invalidatesTags: ["Documents"],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useGetDocumentQuery,
} = documentsApiSlice;
