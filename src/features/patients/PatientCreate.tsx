import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Patient } from "../../types/Patient";
import { useCreatePatientMutation } from "./patientSlice";
import { PatientForm } from "./components/PatientForm";

export const PatientCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createPatient, status] = useCreatePatientMutation();
  const [isdisabled, setIsdisabled] = useState(false);
  const [patientState, setPatientState] = useState<Patient>({} as Patient);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createPatient(patientState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientState({ ...patientState, [name]: value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPatientState({ ...patientState, [name]: checked });
  };

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Patient created successfully", { variant: "success" });
      setIsdisabled(true);
    }
    if (status.error) {
      enqueueSnackbar("Patient not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Patient</Typography>
          </Box>
        </Box>
        <PatientForm
          isLoading={false}
          isdisabled={isdisabled}
          patient={patientState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};