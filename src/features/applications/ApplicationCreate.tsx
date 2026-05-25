// src/features/applications/ApplicationCreate.tsx
import { Box, Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Application } from "../../types/Application";
import {
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useGetApplicationsQuery,
} from "./applicationSlice";
import { ApplicationForm } from "./components/ApplicationForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProcessSelectionQuery } from "../processSelections/processSelectionSlice";
import { ProcessSelection } from "../../types/ProcessSelection";
import { selectIsAuthenticated } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";
import { Register } from "../auth/Register";
import { ApplicationCard } from "./components/ApplicationCard";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import useTranslate from "../polyglot/useTranslate";

export const ApplicationCreate = () => {
  const translate = useTranslate('applicationForm');
  const [showForm, setShowForm] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { id } = useParams();
  const { data: processSelection, isFetching: isFetchingProcess } =
    useGetProcessSelectionQuery({ id: id! });
  const [processSelectionState, setProcessSelectionState] =
    useState({} as ProcessSelection);

  const { enqueueSnackbar } = useSnackbar();
  const [createApplication, status] = useCreateApplicationMutation();
  const [updateApplication, statusUpdate] = useUpdateApplicationMutation();

  const [isdisabled, setIsdisabled] = useState(false);
  const [applicationState, setApplicationState] = useState<Application>({
    form_data: {},
  } as Application);
  const navigate = useNavigate();
  const [options] = useState({
    page: 1,
    perPage: 25,
    search: "",
    filters: { process_selection_id: id! } as Record<string, string>,
  });

  const { data: myAppsData } = useGetApplicationsQuery(options);

  const saveApplication = async (app: Application) => {
    const payload: Application = {
      ...app,
      process_selection_id: processSelectionState.id!,
    };

    if (applicationState?.id) {
      await updateApplication(payload);
    } else {
      await createApplication(payload);
    }
  };

  useEffect(() => {
    if (myAppsData?.data?.length) {
      setApplicationState(myAppsData.data[0]);
      setShowForm(false);
    } else {
      setApplicationState({ form_data: {} } as Application);
      setShowForm(true);
    }
  }, [myAppsData]);

  // helper genérico para tratar erro de create/update
  const handleMutationError = (error: unknown, defaultMsg: string) => {
    const err = error as FetchBaseQueryError;

    // se veio resposta da API (ex.: 403, 422, etc)
    if ("data" in err && err.data) {
      const data = err.data as any;

      // se a API mandou uma mensagem específica (ex.: inscrições fechadas)
      if (data?.message) {
        enqueueSnackbar(translate(data.message), { variant: "error" });
      } else {
        enqueueSnackbar(defaultMsg, { variant: "error" });
      }
    } else {
      // problema de rede / API off / timeout etc
      enqueueSnackbar("Falha de comunicação! Tente novamente mais tarde!", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    // SUCESSO NA CRIAÇÃO
    if (status.isSuccess) {
      enqueueSnackbar("Inscrição realizada com sucesso!", {
        variant: "success",
      });
      setIsdisabled(true);
      navigate("/candidate-dashboard");
    }

    // SUCESSO NA ATUALIZAÇÃO
    if (statusUpdate.isSuccess) {
      enqueueSnackbar("Inscrição atualizada com sucesso!", {
        variant: "success",
      });
      setIsdisabled(true);
      navigate("/candidate-dashboard");
    }

    // ERROS NA CRIAÇÃO
    if (status.error) {
      handleMutationError(status.error, "Falha ao criar inscrição");
    }

    // ERROS NA ATUALIZAÇÃO
    if (statusUpdate.error) {
      handleMutationError(statusUpdate.error, "Falha ao atualizar inscrição");
    }
  }, [
    status.isSuccess,
    status.error,
    statusUpdate.isSuccess,
    statusUpdate.error,
    enqueueSnackbar,
    navigate,
  ]);

  useEffect(() => {
    if (processSelection) {
      setProcessSelectionState({ ...processSelection.data });
    }
  }, [processSelection]);

  if (!isAuthenticated) return <Register />;
  if (processSelection === undefined || isFetchingProcess) return <>LOADING…</>;

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        {(!showForm && applicationState.id) && (
          <ApplicationCard
            application={applicationState}
            processSelection={processSelectionState}
            onEdit={() => setShowForm(true)}
          />
        )}

        {showForm && (
          <ApplicationForm
            isLoading={status.isLoading || statusUpdate.isLoading}
            isdisabled={isdisabled}
            application={applicationState}
            processSelection={processSelectionState}
            handleSubmit={(e, data) => {
              e.preventDefault();
              saveApplication(data);
            }}
          />
        )}
      </Paper>
    </Box>
  );
};
