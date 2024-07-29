import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Application } from "../../../types/Application";

type Props = {
  application: Application;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent, checked?: boolean) => void;
  handleAutocompleteChange: (event: any, value: any, field: string) => void;
};

const sexOptions = ["Masculino", "Feminino", "Outro"];
const ufOptions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];
const campuses = ["Campus dos Palmares", "Campus dos Males"];
const vagaOptions = ["Ampla Concorrência", "Cotas"];

export function ApplicationForm({
  application,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  handleAutocompleteChange,
}: Props) {
  const data = application.data || {};

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome Completo"
                value={data.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "name" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="cpf"
                label="CPF do Candidato"
                value={data.cpf || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "cpf" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="enem"
                label="Inscrição do ENEM"
                value={data.enem || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "enem" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="dob"
                label="Data de Nascimento"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={data.dob || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "dob" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={sexOptions}
                getOptionLabel={(option) => option}
                onChange={(event, value) => handleAutocompleteChange(event, value, "sex")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sexo"
                    name="sex"
                    value={data.sex || ""}
                    disabled={isdisabled}
                    inputProps={{ ...params.inputProps, "data-testid": "sex" }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="email"
                label="Email"
                type="email"
                value={data.email || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "email" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="phone1"
                label="Telefone 1"
                value={data.phone1 || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "phone1" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                name="phone2"
                label="Telefone 2"
                value={data.phone2 || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "phone2" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="address"
                label="Endereço"
                value={data.address || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "address" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={ufOptions}
                getOptionLabel={(option) => option}
                onChange={(event, value) => handleAutocompleteChange(event, value, "uf")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="UF"
                    name="uf"
                    value={data.uf || ""}
                    disabled={isdisabled}
                    inputProps={{ ...params.inputProps, "data-testid": "uf" }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="city"
                label="Cidade"
                value={data.city || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "city" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={campuses}
                getOptionLabel={(option) => option}
                onChange={(event, value) => handleAutocompleteChange(event, value, "campus")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Local de Oferta"
                    name="campus"
                    value={data.campus || ""}
                    disabled={isdisabled}
                    inputProps={{ ...params.inputProps, "data-testid": "campus" }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="course"
                label="Curso Pretendido"
                value="Medicina"
                disabled
                inputProps={{ "data-testid": "course" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Autocomplete
                multiple
                options={vagaOptions}
                getOptionLabel={(option) => option}
                onChange={(event, value) => handleAutocompleteChange(event, value, "vaga")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Modalidade de Vaga"
                    name="vaga"
                    value={data.vaga || ""}
                    disabled={isdisabled}
                    inputProps={{ ...params.inputProps, "data-testid": "vaga" }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="publicSchool" />}
              label="Declaro que cursei integralmente o ensino médio em escola pública."
              onChange={(e, checked) => handleChange(e, checked)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Termos de Responsabilidade"
                value="Termos de responsabilidade vão aqui..."
                disabled
                multiline
                rows={4}
                inputProps={{ "data-testid": "terms" }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox required name="termsAgreement" />}
              label="Declaro que li e concordo com o termo de responsabilidade."
              onChange={(e, checked) => handleChange(e, checked)}
            />
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
