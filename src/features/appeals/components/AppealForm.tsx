import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { Link } from "react-router-dom";
import { Appeal } from "../../../types/Appeal";
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
const apiUrl = import.meta.env.VITE_API_URL;

import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { IconButton, InputAdornment } from "@mui/material";

import { useSnackbar } from "notistack";
import { useCreateAppealMutation, useUpdateAppealMutation, useGetAppealQuery } from '../appealsSlice';
import { useCreateAppealDocumentMutation, useDeleteAppealDocumentMutation } from '../appealDocumentSlice';

type Props = {
  applicationId: string|int;
  isCreate: boolean;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
  appeal: Appeal;
  setAppeal: React.Dispatch<React.SetStateAction<Appeal>>;
  isAppealReviewed: () => boolean;
};

export function AppealForm({
  applicationId,
  isCreate,
  setIsCreate,
  appeal,
  setAppeal,
  isAppealReviewed,
}: Props) {

  const [createAppeal, statusAppealCreationRequest] = useCreateAppealMutation();
  const [updateAppeal, statusAppealUpdateRequest] = useUpdateAppealMutation();
  const [createAppealDocument, statusAppealDocumentCreationRequest] = useCreateAppealDocumentMutation();
  const [deleteAppealDocument] = useDeleteAppealDocumentMutation();
  const [file, setFile] = useState<File | null>(null);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      let response;
      if (isCreate) {
        response = await createAppeal(appeal).unwrap();
        setIsCreate(false);
      } else {
        response = await updateAppeal(appeal).unwrap();
      }
      setAppeal(response.data);
      enqueueSnackbar("Recurso salvo com sucesso", { variant: "success" });
    } catch (error: any) {
      console.log(error);
      const errorMessage = error?.data?.message || "Erro ao salvar o Recurso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  async function handleSubmitFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("appeal_id", appeal.id);
    formData.append("file", file);
    try {
      await createAppealDocument(formData).unwrap();
      setFile(null);
      enqueueSnackbar("Arquivo enviado com sucesso", { variant: "success" });
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao enviar o arquivo";
      enqueueSnackbar(errorMessage, { variant: "error" });
      console.error(error);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setAppeal({ ...appeal, [name]: value, application_id: applicationId });
  };

  const handleDownload = (docPath: string) => {
    const url = `${apiUrl}/storage/${docPath}`;
    window.open(url, "_blank");
  };

  const handleDeleteFile = async () => {
    try {
      if (appeal.id && appeal.documents?.[0]?.id) {
        await deleteAppealDocument({
          appealId: appeal.id,
          appealDocumentId: appeal.documents?.[0]?.id
        }).unwrap();
        setConfirmDeleteOpen(false);
        setFile(null);
      }
      enqueueSnackbar("Arquivo deletado com sucesso", { variant: "success" });
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.data?.message || "Erro ao deletar o arquivo";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const spaces = "\u00A0".repeat(8); // 6 espaços

  return (
    <Box p={2}>

      <Box sx={{ mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              label={`Justificativa${spaces}`}
              name="justification"
              id="outlined-helperText"
              variant="outlined"
              multiline
              rows="15"
              fullWidth
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "1.4rem",
                },
              }}
              value={appeal.justification}
              onChange={handleChange}
            />
          </FormControl>
          {!isAppealReviewed() && (
            <Button
              sx={{ mt: 1 }}
              variant="contained"
              color="primary"
              type="submit"
              size="small"
              disabled={isAppealReviewed()}
            >
              Salvar
            </Button>
          )}
        </form>
      </Box>

      <Box>
        <form onSubmit={handleSubmitFile}>
          <Tooltip
            title={isCreate ? "O envio do arquivo PDF será habilitado assim que a justificativa for salva." : ""}
            disableHoverListener={!isCreate}
          >
            <Box>
              <Box>
                {/* input file escondido */}
                <input
                  id="upload-pdf"
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  disabled={isCreate || isAppealReviewed()}
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />

                <FormControl fullWidth>
                  <TextField
                    label="Arquivo PDF"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    disabled={isCreate || isAppealReviewed()}
                    value={
                      file?.name ||
                      appeal.documents?.[0]?.original_name ||
                      ""
                    }
                    placeholder="Nenhum arquivo selecionado"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <InsertDriveFileIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">

                          {/* Botão Selecionar */}
                          {!isAppealReviewed() && (
                            <Button
                              component="label"
                              htmlFor="upload-pdf"
                              variant="contained"
                              size="small"
                              disabled={isCreate || isAppealReviewed()}
                              sx={{ mr: 1 }}
                            >
                              Selecionar
                            </Button>
                          )}

                          {/* Botão Excluir */}
                          {(file || appeal.documents?.length > 0) && !isAppealReviewed() && (
                            <IconButton
                              disabled={isAppealReviewed()}
                              color="error"
                              onClick={() => setConfirmDeleteOpen(true)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}

                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </Box>
              {!isAppealReviewed() && (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="small"
                  disabled={isCreate || isAppealReviewed()}
                  startIcon={<UploadIcon />}
                >
                  Enviar PDF
                </Button>
              )}
              {appeal.documents?.length > 0 && !isAppealReviewed() && (
                <Button
                  sx={{ ml: 1 }}
                  startIcon={<DownloadIcon />}
                  variant="outlined"
                  size="small"
                  disabled={isAppealReviewed()}
                  onClick={() => handleDownload(appeal.documents[0].path)}
                >
                  Download
                </Button>
              )}
            </Box>
          </Tooltip>
        </form>
      </Box>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este documento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteFile} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
}