import { Box, Button, Typography } from "@mui/material";
import { useGetApplicationsQuery } from "./applicationSlice";
import { Paper } from "@mui/material";
import { useState } from "react";
import { ApplicationTable } from "./components/ApplicationTable";
import { Link } from "react-router-dom";

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

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Minhas Inscrições</Typography>
          </Box>
          <ApplicationTable applications={data} isFetching={isFetching} />
          <br></br><br></br>
          {/* <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{ mb: 2 }}
          >
            Voltar
          </Button> */}
        </Box>
      </Paper>
    </Box>
  );
};
