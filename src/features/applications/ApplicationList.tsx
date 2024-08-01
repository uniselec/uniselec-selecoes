import { Box, Button, Typography } from "@mui/material";
import { useGetApplicationsQuery } from "./applicationSlice";
import { Paper } from "@mui/material";
import { useState } from "react";
import { ApplicationTable } from "./components/ApplicationTable";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

interface PaginationModel {
  pageSize: number;
  page: number;
}

export const ApplicationList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });

  const { data, isFetching, error } = useGetApplicationsQuery(options);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.data && Array.isArray(data.data) && data.data.length === 0) {
      navigate("/applications/create");
    }
  }, [data, navigate]);

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Comprovante de Inscrição</Typography>
          </Box>
          <ApplicationTable applications={data} isFetching={isFetching} />
          <br></br><br></br>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{ mb: 2, mr: 2 }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/applications/create"
            sx={{ mb: 2 }}
          >
            Alterar Inscrição
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
