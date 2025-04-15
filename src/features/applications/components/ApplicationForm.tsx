import {
  Box,
  Grid,
  TextField,
  FormControl,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Autocomplete,
  RadioGroup,
  Radio,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { useState, useEffect, FormEvent, SyntheticEvent } from "react";
import { Application } from "../../../types/Application";
import { useAppSelector } from "../../../app/hooks";
import { selectAuthUser } from "../../auth/authSlice";
import { Link } from "react-router-dom";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProcessSelection } from "../../../types/ProcessSelection";

type CourseOption = {
  id: string;
  name: string;
  academic_unit: {
    name: string;
    state: string;
  };
};

interface ApplicationFormState {
  // campos pessoais
  name: string;
  social_name?: string;
  cpf: string;
  enem: string;
  birtdate: string;
  sex: string;
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  uf: string;
  city: string;

  // campos de candidatura
  edital: string;
  position: string;
  location_position: string;

  // valores que vêm dos autocompletes / seleções
  course?: CourseOption | null;
  enem_year?: number | null;
  modalidade: string[];
  bonus: string | null;
}

type Props = {
  application: Application;
  isdisabled?: boolean;
  isLoading?: boolean;
  processSelection: ProcessSelection;
  handleSubmit: (e: FormEvent<HTMLFormElement>, applicationData2: Application) => void;
};

export function ApplicationForm({
  application,
  isdisabled = false,
  isLoading = false,
  processSelection,
  handleSubmit,
}: Props) {
  // Inicializa o estado com os dados da candidatura e vincula dados default (se necessário)
  const [formState, setFormState] = useState(application.data || {} as ApplicationFormState);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [enemError, setEnemError] = useState<string | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedEnemYear, setSelectedEnemYear] = useState<number | null>(null);
  const [selectedModalidades, setSelectedModalidades] = useState<string[]>([]);
  const [selectedBonus, setSelectedBonus] = useState<string>("none");

  const userAuth = useAppSelector(selectAuthUser);

  // Atualiza o estado com dados default do processo e usuário autenticado
  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      ...application?.data,
      edital: processSelection.name, // O edital será fixo
      position: selectedCourse ? selectedCourse.name : "", // será definido pelo Autocomplete
      location_position: processSelection.courses
      ?.find((course: any) => course.id === selectedCourse?.id)
      ?.academic_unit?.name || "",
    }));
  }, [application, processSelection, selectedCourse]);

  useEffect(() => {
    if (userAuth) {
      setFormState((prevState) => ({
        ...prevState,
        name: userAuth.name,
        email: userAuth.email,
        cpf: userAuth.cpf,
      }));
    }
  }, [userAuth]);

  // Manipulador para mudanças no Autocomplete (genérico)
  const handleAutocompleteChange = (
    event: SyntheticEvent<Element, Event>,
    value: any,
    name: string
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value ? value : "",
    }));
  };

  // Para checkbox de modalidades (usando admission_categories do objeto processSelection)
  const handleModalidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedModalidades((prev) => [...prev, value]);
    } else {
      setSelectedModalidades((prev) => prev.filter((item) => item !== value));
    }
  };

  // Manipulador para a seleção de bônus
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBonus(e.target.value);
  };

  const handleConfirmDialogOpen = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Atualiza o estado final com os valores selecionados
    setFormState(prev => ({
      ...prev,
      ...application?.data,
      edital: processSelection.name,
      position: selectedCourse ? selectedCourse.name : "",
      location_position: processSelection.courses
        ?.find(c => c.id === selectedCourse?.id)
        ?.academic_unit?.name || "",
    }));
    setOpenConfirmDialog(true);
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Submete o formulário com os dados atualizados
    handleSubmit(e as unknown as FormEvent<HTMLFormElement>, { data: { ...formState } } as Application);
  };

  const validateEnemNumber = (enem: string) => {
    // Caso queira implementar validações, descomente e ajuste conforme necessário
    return null;
  };

  const handleEnemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
    const error = validateEnemNumber(value);
    setEnemError(error);
    setFormState((prevState) => ({ ...prevState, enem: value }));
  };

  return (
    <Box p={2}>
      <form onSubmit={handleConfirmDialogOpen}>
        <Grid container spacing={3}>
          {/* Dados Pessoais */}
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Dados Pessoais</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome Completo"
                value={formState.name || ""}
                disabled
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                name="social_name"
                label="Nome Social"
                value={formState.social_name || ""}
                onChange={(e) => setFormState({ ...formState, social_name: e.target.value })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="email"
                label="Email"
                type="email"
                value={formState.email || ""}
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="cpf"
                label="CPF do Candidato"
                value={formState.cpf || ""}
                error={!!cpfError}
                helperText={cpfError || ""}
                disabled={isdisabled}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="birtdate"
                label="Data de Nascimento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formState.birtdate || ""}
                disabled={isdisabled}
                onChange={(e) => setFormState({ ...formState, birtdate: e.target.value })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={["Masculino", "Feminino", "Outro"]}
                onChange={(event, value) => handleAutocompleteChange(event, value, "sex")}
                renderInput={(params) => (
                  <TextField {...params} label="Sexo" required value={formState.sex || ""} disabled={isdisabled} />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="phone1"
                label="Telefone 1"
                value={formState.phone1 || ""}
                onChange={(e) => setFormState({ ...formState, phone1: e.target.value })}
                disabled={isdisabled}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="address"
                label="Endereço"
                value={formState.address || ""}
                onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                disabled={isdisabled}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]}
                onChange={(event, value) => handleAutocompleteChange(event, value, "uf")}
                renderInput={(params) => (
                  <TextField {...params} label="UF" required value={formState.uf || ""} disabled={isdisabled} />
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
                value={formState.city || ""}
                onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                disabled={isdisabled}
              />
            </FormControl>
          </Grid>

          {/* Dados da Candidatura */}
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Dados da Candidatura</Typography>
            </Box>
          </Grid>
          {/* Edital fixo */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography variant="subtitle1">
                {processSelection.name}
              </Typography>
            </FormControl>
          </Grid>
          {/* Curso com Autocomplete */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={processSelection.courses || []}
                getOptionLabel={(option: any) =>
                  `${option.name} - ${option.academic_unit.name} (${option.academic_unit.state})`
                }
                onChange={(event, value) => {
                  setSelectedCourse(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Curso Pretendido" required value={selectedCourse ? `${selectedCourse.name}` : ""} />
                )}
              />
            </FormControl>
          </Grid>
          {/* Local de Oferta fixo, pode ser definido a partir do curso ou diretamente */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="campus"
                label="Local de Oferta"
                value={
                  selectedCourse
                    ? selectedCourse.academic_unit.name
                    : ""
                }
                disabled
              />
            </FormControl>
          </Grid>
          {/* Número do ENEM e Ano do ENEM */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="enem"
                label="Número de Inscrição do ENEM"
                value={formState.enem || ""}
                error={!!enemError}
                helperText={enemError || ""}
                disabled={isdisabled}
                onChange={handleEnemChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={processSelection.allowed_enem_years || []}
                getOptionLabel={(option: any) => option.toString()}
                onChange={(event, value) => setSelectedEnemYear(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Ano do ENEM" required value={selectedEnemYear ? selectedEnemYear.toString() : ""} />
                )}
              />
            </FormControl>
          </Grid>
          {/* Modalidades (Checkboxes) a partir de admission_categories */}
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Modalidade</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Selecione a modalidade de inscrição:
            </Typography>
            <FormGroup>
              {(processSelection.admission_categories || []).map((option: any) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      name="modalidade"
                      value={option.name}
                      checked={selectedModalidades.includes(option.name)}
                      onChange={handleModalidadeChange}
                    />
                  }
                  label={option.description}
                />
              ))}
            </FormGroup>
          </Grid>
          {/* Critérios de Bonificação (Radio Group) */}
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Critérios de Bonificação</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Marque apenas uma opção, se fizer jus:
            </Typography>
            <RadioGroup
              name="bonus"
              value={selectedBonus}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="none"
                control={<Radio disabled={isdisabled} />}
                label="Nenhuma das anteriores"
              />
              {(processSelection.bonus_options || []).map((option: any) => (
                <FormControlLabel
                  key={option.id}
                  value={option.description}
                  control={<Radio disabled={isdisabled} />}
                  label={option.description}
                />
              ))}
            </RadioGroup>
          </Grid>
          {/* Termos de Responsabilidade */}
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Termos de Responsabilidade</Typography>
            </Box>
            <Typography variant="body2" mb={2}>
              1. O candidato deverá ler o Edital, seus anexos e os atos normativos para certificar-se de que preenche todos os requisitos.
            </Typography>
            <Typography variant="body2" mb={2}>
              2. Verifique se os dados digitados estão corretos antes de confirmar o envio.
            </Typography>
            <Typography variant="body2" mb={2}>
              3. A Unilab não se responsabiliza por problemas técnicos ou falhas na comunicação durante a inscrição.
            </Typography>
            <FormControlLabel
              control={<Checkbox required name="termsAgreement" />}
              label="Declaro que li e concordo com os termos de responsabilidade."
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/">
                Página Inicial
              </Button>
              <Button type="submit" variant="contained" color="secondary" disabled={isdisabled || isLoading}>
                {isLoading ? "Loading..." : "Realizar Inscrição"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Modal de Confirmação */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleConfirmDialogClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmar Inscrição</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Por favor, revise os detalhes da inscrição antes de confirmar:
          </DialogContentText>
          <Box mt={2}>
            <Typography variant="body1"><strong>Nome Completo:</strong> {formState.name}</Typography>
            <Typography variant="body1"><strong>Nome Social:</strong> {formState.social_name || "Não informado"}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {formState.email}</Typography>
            <Typography variant="body1"><strong>CPF:</strong> {formState.cpf}</Typography>
            <Typography variant="body1">
              <strong>Data de Nascimento: </strong>
              {formState.birtdate && isValid(parseISO(formState.birtdate))
                ? format(parseISO(formState.birtdate), 'dd/MM/yyyy', { locale: ptBR })
                : 'Data inválida'}
            </Typography>
            <Typography variant="body1"><strong>Sexo:</strong> {formState.sex}</Typography>
            <Typography variant="body1"><strong>Telefone 1:</strong> {formState.phone1}</Typography>
            <Typography variant="body1"><strong>Endereço:</strong> {formState.address}</Typography>
            <Typography variant="body1"><strong>UF:</strong> {formState.uf}</Typography>
            <Typography variant="body1"><strong>Cidade:</strong> {formState.city}</Typography>
            <Typography variant="body1"><strong>Edital:</strong> {processSelection.name}</Typography>
            <Typography variant="body1"><strong>Curso Pretendido:</strong> {selectedCourse ? selectedCourse.name : ""}</Typography>
            <Typography variant="body1"><strong>Local de Oferta:</strong> {selectedCourse ? selectedCourse.academic_unit.name : ""}</Typography>
            <Typography variant="body1"><strong>Número de Inscrição do ENEM:</strong> {formState.enem}</Typography>
            <Typography variant="body1"><strong>Ano do ENEM:</strong> {selectedEnemYear}</Typography>
            <Typography variant="body1"><strong>Modalidades:</strong></Typography>
            <List>
              {selectedModalidades.map((modalidade, index) => (
                <ListItem key={index}>
                  <Typography variant="body2">• {modalidade}</Typography>
                </ListItem>
              ))}
            </List>
            <Typography variant="body1"><strong>Critérios de Bonificação:</strong></Typography>
            <List>
              <ListItem>
                <Typography variant="body2">• {selectedBonus === "none" ? "Nenhuma das anteriores" : selectedBonus}</Typography>
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirmSubmit} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
