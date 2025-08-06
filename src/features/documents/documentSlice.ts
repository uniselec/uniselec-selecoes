// documentSlice.ts
import { Result, Results, DocumentParams, Document } from "../../types/Document";
import { SelectionDocumentResults } from "../../types/SelectionDocument";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/documents";

function parseQueryParams(params: DocumentParams) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.perPage) query.append("per_page", params.perPage.toString());
  if (params.search) query.append("search", params.search);
  if (params.process_selection_id) query.append("process_selection_id", params.process_selection_id.toString());
  return query.toString();
}

function getDocuments({ page = 1, perPage = 10, search = "", processSelectionId = undefined }: {
  page?: number;
  perPage?: number;
  search?: string;
  processSelectionId?: number | null;
}) {
  const params = {
    page,
    perPage,
    search,
    process_selection_id: processSelectionId ?? undefined
  };
  return `${endpointUrl}?${parseQueryParams(params as any)}`;
}


function createDocumentMutation(document: FormData) {
  return {
    url: endpointUrl,
    method: "POST",
    body: document,
    formData: true,
  };
}

function updateDocumentMutation(document: Partial<Document>) {
  return {
    url: `${endpointUrl}/${document.id}`,
    method: "PUT",
    body: document,
  };
}

function deleteDocumentMutation({ id }: { id: string }) {
  return { url: `${endpointUrl}/${id}`, method: "DELETE" };
}

function getDocument({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

function updateDocumentStatusMutation({ id, status }: { id: string; status: "draft" | "published" | "archived" }) {
  return {
    url: `${endpointUrl}/${id}/status`,
    method: "PATCH",
    body: { status },
  };
}

export const documentsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getDocuments: query<Results, DocumentParams>({
      query: getDocuments,
      providesTags: ["Documents"],
    }),
    getDocumentsByProcessSelection: query<SelectionDocumentResults, { processSelectionId: string }>({
      query: ({ processSelectionId }) => `/documents?process_selection=${processSelectionId}`,
      providesTags: ["Documents"],
    }),
    getDocument: query<Result, { id: string }>({
      query: getDocument,
      providesTags: ["Documents"],
    }),
    createDocument: mutation<Result, FormData>({
      query: createDocumentMutation,
      invalidatesTags: ["Documents"],
    }),
    updateDocument: mutation<Result, Partial<Document>>({
      query: updateDocumentMutation,
      invalidatesTags: ["Documents"],
    }),
    updateDocumentStatus: mutation<Result, { id: string; status: "draft" | "published" | "archived" }>({
      query: updateDocumentStatusMutation,
      invalidatesTags: ["Documents"],
    }),
    deleteDocument: mutation<void, { id: string }>({
      query: deleteDocumentMutation,
      invalidatesTags: ["Documents"],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentsByProcessSelectionQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useGetDocumentQuery,
  useDeleteDocumentMutation,
  useUpdateDocumentStatusMutation,
} = documentsApiSlice;
