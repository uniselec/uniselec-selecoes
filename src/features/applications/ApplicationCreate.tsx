import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Application } from "../../types/Application";
import { useCreateApplicationMutation } from "./applicationSlice";
import { ApplicationForm } from "./components/ApplicationForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetApplicationsQuery, useUpdateApplicationMutation } from "./applicationSlice";
import { useGetProcessSelectionQuery } from "../processSelections/processSelectionSlice";
import { ProcessSelection } from "../../types/ProcessSelection";
import { selectIsAuthenticated } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";
import { Register } from "../auth/Register";
import { ApplicationCard } from "./components/ApplicationCard";

export const ApplicationCreate = () => {
  const [showForm, setShowForm] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { id } = useParams();
  const { data: processSelection, isFetching: isFetchingProcess } = useGetProcessSelectionQuery({ id: id! });
  const [processSelectionState, setProcessSelectionState] = useState({} as ProcessSelection);

  const { enqueueSnackbar } = useSnackbar();
  const [createApplication, status] = useCreateApplicationMutation();
  const [updateApplication, statusUpdate] = useUpdateApplicationMutation();

  const [isdisabled, setIsdisabled] = useState(false);
  const [applicationState, setApplicationState] = useState<Application>({ form_data: {} } as Application);
  const navigate = useNavigate();

  const { data: myAppsData } = useGetApplicationsQuery({    // 🔶
    page: 1,
    perPage: 1,
    process_selection_id: id!,
  });

  const saveApplication = async (app: Application) => {
    const payload: Application = { ...app, process_selection_id: processSelectionState.id! };

    if (applicationState?.id) {
      await updateApplication(payload);                     // já existe → PUT
    } else {
      await createApplication(payload);                     // nova → POST
    }
  };

  useEffect(() => {
    if (myAppsData?.data?.length) {
      setApplicationState(myAppsData.data[0]);
      setShowForm(false);                                   // mostra card primeiro
    } else {
      setApplicationState({ form_data: {} } as Application);
      setShowForm(true);                                    // nenhum registro, já exibe form
    }
  }, [myAppsData]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Inscrição Realizada Com Sucesso", { variant: "success" });
      setIsdisabled(true);
      navigate('/candidate-dashboard');
    }
    if (status.error) {
      enqueueSnackbar("Application not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess, navigate]);

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
            handleSubmit={(e, data) => { e.preventDefault(); saveApplication(data); }}
          />
        )}
      </Paper>
    </Box>
  );
};
