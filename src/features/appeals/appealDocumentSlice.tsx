import { AppealDocument, Result } from "../../types/AppealDocument";

import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/appeals";

function getDocument({ appealId, appealDocumentId }: { appealId: string, appealDocumentId: string }) {
  return `${endpointUrl}/${appealId}/appeal_documents/${appealDocumentId}`;
}

function createAppealDocumentMutation(document: FormData) {
  const appealId = document.get("appeal_id");
  return {
    url: `${endpointUrl}/${appealId}/appeal_documents`,
    method: "POST",
    body: document,
    formData: true,
  };
}

function deleteAppealDocumentMutation({
  appealId,
  appealDocumentId
}: { appealId: string; appealDocumentId: string }) {
  return {
    url: `${endpointUrl}/${appealId}/appeal_documents/${appealDocumentId}`,
    method: "DELETE"
  };
}

export const appealDocumentApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    createAppealDocument: mutation<Result, FormData>({
      query: createAppealDocumentMutation,
      invalidatesTags: ["AppealDocuments", "Appeals", "Applications"],
    }),
    deleteAppealDocument: mutation<void, { appealId: string; appealDocumentId: string }>({
      query: deleteAppealDocumentMutation,
      invalidatesTags: ["AppealDocuments", "Appeals", "Applications"],
    }),
  }),
});

export const {
  useCreateAppealDocumentMutation,
  useDeleteAppealDocumentMutation,
} = appealDocumentApiSlice;