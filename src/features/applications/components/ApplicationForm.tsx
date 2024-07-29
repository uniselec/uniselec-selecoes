import {
    Box,
    Button,
    FormControl,
    Grid,
    TextField,
  } from "@mui/material";

  import { Link } from "react-router-dom";
  import { Application } from "../../../types/Application";

  type Props = {
    application: Application;
    isdisabled?: boolean;
    isLoading?: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

  export function ApplicationForm({
    application,
    isdisabled = false,
    isLoading = false,
    handleSubmit,
    handleChange
  }: Props) {
    return (
      <Box p={2}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  required
                  name="name"
                  label="Name"
                  value={application.data || ""}
                  disabled={isdisabled}
                  onChange={handleChange}
                  inputProps={{ "data-testid": "name" }}
                />
              </FormControl>
            </Grid>




            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button variant="contained" component={Link} to="/applications">
                  Voltar
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isdisabled || isLoading}
                >
                  {isLoading ? "Loading..." : "Realizar Inscrição"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    );
  }