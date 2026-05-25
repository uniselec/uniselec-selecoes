/* src/features/applications/components/ApplicationForm.tsx */
import {
  Box, Grid, TextField, FormControl, Typography, Checkbox,
  FormControlLabel, Autocomplete, RadioGroup, Radio, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, List, ListItem, InputAdornment,
  IconButton
} from '@mui/material';
import { useState, useEffect, useRef, FormEvent, SyntheticEvent } from 'react';
import {
  Application, ApplicationFormData
} from '../../../types/Application';
import { useAppSelector } from '../../../app/hooks';
import { selectAuthUser } from '../../auth/authSlice';
import { Link } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProcessSelection } from '../../../types/ProcessSelection';
import { Course } from '../../../types/Course';
import { AdmissionCategory } from '../../../types/AdmissionCategory';
import { BonusOption } from '../../../types/BonusOption';
import PhoneMask from '../../../components/masks/PhoneMask';
import { CPFMask } from '../../auth/components/LoginForm';
import Tooltip from '@mui/material/Tooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
  application: Application;
  isdisabled?: boolean;
  isLoading?: boolean;
  processSelection: ProcessSelection;
  handleSubmit: (e: FormEvent<HTMLFormElement>, application: Application) => void;
};

export function ApplicationForm({
  application,
  isdisabled = false,
  isLoading = false,
  processSelection,
  handleSubmit,
}: Props) {
  const [showSocialName, setShowSocialName] = useState<boolean>(
    !!application.form_data?.social_name
  );
  const isFirstMount = useRef(true);
  const [formState, setFormState] = useState<ApplicationFormData>(
    application.form_data ?? ({} as ApplicationFormData),
  );

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    application.form_data?.position ?? null,
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(
    application.form_data?.enem_year ?? null,
  );
  const [selectedCats, setSelectedCats] = useState<AdmissionCategory[]>(
    application.form_data?.admission_categories ?? [],
  );
  const [selectedBonus, setSelectedBonus] = useState<BonusOption | null>(
    application.form_data?.bonus ?? null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Erro de validação do ENEM
  const [enemError, setEnemError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setFormState(prev => ({ ...prev, enem: '' }));
    setEnemError(null);
  }, [selectedYear]);

  const userAuth = useAppSelector(selectAuthUser);
  useEffect(() => {
    if (userAuth)
      setFormState(prev => ({
        ...prev,
        name: userAuth.name,
        email: userAuth.email,
        cpf: userAuth.cpf,
      }));
  }, [userAuth]);


  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      edital: processSelection.name,
      position: selectedCourse ?? prev.position,
      location_position: selectedCourse?.academic_unit?.name ?? '',
    }));
  }, [selectedCourse, processSelection]);

  /* ----------------------------- helpers UI ----------------------------------- */
  const isCatChecked = (cat: AdmissionCategory) =>
    selectedCats.some(c => c.id === cat.id);

  const toggleCat = (cat: AdmissionCategory, checked: boolean) =>
    setSelectedCats(prev =>
      checked ? [...prev, cat] : prev.filter(c => c.id !== cat.id),
    );

  /* --------------------------- confirmação / envio ---------------------------- */
  const openConfirm = (e: FormEvent) => {
    e.preventDefault();

    // Validação específica do ENEM antes de abrir o diálogo
    const enemDigits = (formState.enem || '').replace(/\D/g, '');
    const yearPrefix = selectedYear !== null ? String(selectedYear).slice(-2) : '';

    if (!selectedYear) {
      setEnemError('Selecione o ano do ENEM.');
      return;
    }

    if (!enemDigits) {
      setEnemError('Informe o número de inscrição do ENEM.');
      return;
    }

    if (enemDigits.length !== 12) {
      setEnemError('O número de inscrição do ENEM deve ter exatamente 12 dígitos.');
      return;
    }

    if (enemDigits.slice(0, 2) !== yearPrefix) {
      setEnemError(`O número de inscrição deve começar com "${yearPrefix}".`);
      return;
    }

    if (enemError) {
      return;
    }

    setConfirmOpen(true);
  };

  const sendConfirm = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: Application = {
      ...application,                        // mantém id se edição
      form_data: {
        ...formState,
        position: selectedCourse as Course,
        enem_year: selectedYear!,
        admission_categories: selectedCats,
        bonus: selectedBonus!,
      },
    };

    handleSubmit(e as unknown as FormEvent<HTMLFormElement>, payload);
  };


  /* --------------------------------- render ----------------------------------- */
  const MAX_SELECTABLE_ADMISSION_CATEGORIES = 2;
  const admissionCategoryLimtReached = selectedCats.length >= MAX_SELECTABLE_ADMISSION_CATEGORIES && !processSelection.allows_multiple_admission_categories;

  return (
    <Box p={2}>
      <form onSubmit={openConfirm}>
        <Grid container spacing={3}>

          {/* ------------------- DADOS PESSOAIS ------------------- */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" gutterBottom>
                Dados de Registro
              </Typography>
              <IconButton
                size="small"
                component={Link}
                to="/profile/edit"
                aria-label="Editar dados de registro"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required label="Nome Completo" name="name"
                value={formState.name || ''} disabled
              />
            </FormControl>
          </Grid>

          {/* e-mail / cpf */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField required label="Email" name="email" type="email"
                value={formState.email || ''} disabled />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                label="CPF do Candidato"
                name="cpf"
                value={formState.cpf || ''}
                disabled
                InputProps={{
                  inputComponent: CPFMask as any,
                }} />
            </FormControl>
          </Grid>

          <Grid item xs={12}><Typography variant="h6" gutterBottom>Dados Pessoais</Typography></Grid>

          {/* nascimento / sexo */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required type="date" label="Data de Nascimento" name="birthdate"
                InputLabelProps={{ shrink: true }}
                value={formState.birthdate || ''}
                onChange={e => setFormState({ ...formState, birthdate: e.target.value })}
                disabled={isdisabled}
              />
            </FormControl>
          </Grid>

          {!showSocialName && (
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                onClick={() => setShowSocialName(true)}
              >
                Adicionar Nome Social
              </Button>
            </Grid>
          )}

          {showSocialName && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nome Social, conforme Decreto nº 8.727"
                  name="social_name"
                  autoComplete="off"
                  value={formState.social_name || ''}
                  onChange={e =>
                    setFormState({ ...formState, social_name: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="DECRETO Nº 8.727…">
                          <ErrorOutlineIcon />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
          )}

          {/* telefone / sexo */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                label="Telefone"
                name="phone1"
                value={formState.phone1 || ''}
                onChange={(event) => {
                  const rawPhone = event.target.value.replace(/\D/g, '');
                  setFormState(prev => ({ ...prev, phone1: rawPhone }));
                }}
                inputProps={{ maxLength: 15 }}
                InputProps={{ inputComponent: PhoneMask as any }}
                disabled={isdisabled}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={['Masculino', 'Feminino', 'Outro']}
                value={formState.sex ?? null}
                onChange={(_, v) => setFormState({ ...formState, sex: v as string })}
                renderInput={p => <TextField {...p} label="Sexo" required />}
              />
            </FormControl>
          </Grid>

          {/* endereço */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField required label="Endereço" name="address"
                value={formState.address || ''}
                onChange={e => setFormState({ ...formState, address: e.target.value })}
                disabled={isdisabled} />
            </FormControl>
          </Grid>

          {/* uf / cidade */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']}
                value={formState.uf ?? null}
                onChange={(_, v) => setFormState({ ...formState, uf: v as string })}
                renderInput={p => <TextField {...p} label="UF" required />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField required label="Cidade" name="city"
                value={formState.city || ''}
                onChange={e => setFormState({ ...formState, city: e.target.value })}
                disabled={isdisabled} />
            </FormControl>
          </Grid>

          {/* ------------------- DADOS DA CANDIDATURA ------------------- */}
          <Grid item xs={12}><Typography variant="h6" gutterBottom>Dados da Candidatura</Typography></Grid>

          {/* edital (somente exibição) */}
          <Grid item xs={12}><Typography>{processSelection.name}</Typography></Grid>

          {/* curso pretendido */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={processSelection.courses || []}
                getOptionLabel={(o: any) =>
                  `${o.name} - ${o.academic_unit.name} (${o.academic_unit.state})`}
                value={selectedCourse}
                onChange={(_, v) => {
                  setSelectedCourse(v);

                  // --- recalcula categorias marcadas ao escolher curso -----------------
                  const acCat = processSelection.admission_categories
                    ?.find((c: AdmissionCategory) => c.name === 'AC') ?? null;

                  const hasAC = !!v?.vacanciesByCategory?.['AC'] &&
                    v.vacanciesByCategory['AC'] > 0;

                  setSelectedCats(hasAC && acCat ? [acCat] : []);   // AC só se houver vaga
                }}
                renderInput={p => <TextField {...p} label="Curso Pretendido" required />}
              />
            </FormControl>
          </Grid>

          {/* local oferta */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Local de Oferta</Typography>
            <Typography variant="body1">
              {selectedCourse?.academic_unit?.description ?? ''}
            </Typography>
          </Grid>

          {/* ano do ENEM */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={processSelection.allowed_enem_years || []}
                getOptionLabel={(option) => option.toString()}
                value={selectedYear}
                onChange={(_, v) => {
                  setSelectedYear(v);
                }}
                renderInput={p => <TextField {...p} label="Ano do ENEM" required />}
              />
            </FormControl>
          </Grid>

          {/* inscrição do ENEM com validação */}
          {selectedYear && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  required
                  label="Número de Inscrição do ENEM"
                  name="enem"
                  value={formState.enem || ''}
                  disabled={isdisabled}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const limited = raw.slice(0, 12); // limitar exatamente 12
                    setFormState(prev => ({ ...prev, enem: limited }));

                    const prefix = String(selectedYear).slice(-2);

                    if (limited.length === 12 && limited.slice(0, 2) !== prefix) {
                      setEnemError(`O número de inscrição deve começar com "${prefix}".`);
                    } else if (limited.length > 0 && limited.length < 12) {
                      setEnemError('O número de inscrição do ENEM deve ter exatamente 12 dígitos.');
                    } else {
                      setEnemError(null);
                    }
                  }}
                  error={!!enemError}
                  helperText={
                    enemError ||
                    ''
                  }
                />
              </FormControl>
            </Grid>
          )}

          {/* modalidades */}
          <Grid item xs={12}>
            <Typography variant="h6">Modalidade</Typography>
            <List>
              {(processSelection.admission_categories || [])
                .filter(cat =>
                  (selectedCourse?.vacanciesByCategory?.[cat.name] ?? 0) > 0)
                .map(cat => {
                  const isdisabledCategory = admissionCategoryLimtReached && !isCatChecked(cat);
                  return <ListItem key={cat.id}>
                    <FormControlLabel
                      disabled={cat.name === 'AC' || isdisabledCategory}
                      control={
                        <Checkbox
                          checked={isCatChecked(cat)}
                          onChange={e => toggleCat(cat, e.target.checked)}
                          disabled={cat.name === 'AC' || isdisabledCategory}
                        />
                      }
                      label={`${cat.description} (${selectedCourse?.vacanciesByCategory?.[cat.name]} vagas)`}
                    />
                  </ListItem>
                })}
            </List>
          </Grid>

          {/* bonificação */}
          <Grid item xs={12}>
            <Typography variant="h6">Bonificação</Typography>
            <RadioGroup
              value={selectedBonus?.id ?? 0}
              onChange={e => {
                const id = Number(e.target.value);
                const bonus = processSelection.bonus_options
                  ?.find((b: BonusOption) => b.id === id) ?? null;
                setSelectedBonus(bonus);
              }}
            >
              <FormControlLabel value={0} control={<Radio />} label="Nenhuma" />
              {(processSelection.bonus_options || []).map((opt: BonusOption) => (
                <FormControlLabel key={opt.id} value={opt.id}
                  control={<Radio />} label={opt.description} />
              ))}
            </RadioGroup>
          </Grid>

          {/* Termos de Responsabilidade */}
          <Grid item xs={12}>
            <Typography variant="h6" mb={2}>Termos de Responsabilidade</Typography>
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

      {/* diálogo de confirmação */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Inscrição</DialogTitle>
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
              {formState.birthdate && isValid(parseISO(formState.birthdate))
                ? format(parseISO(formState.birthdate), 'dd/MM/yyyy', { locale: ptBR })
                : 'Data inválida'}
            </Typography>
            <Typography variant="body1"><strong>Sexo:</strong> {formState.sex}</Typography>
            <Typography variant="body1"><strong>Telefone:</strong> {formState.phone1}</Typography>
            <Typography variant="body1"><strong>Endereço:</strong> {formState.address}</Typography>
            <Typography variant="body1"><strong>UF:</strong> {formState.uf}</Typography>
            <Typography variant="body1"><strong>Cidade:</strong> {formState.city}</Typography>
            <Typography variant="body1"><strong>Edital:</strong> {processSelection.name}</Typography>
            <Typography variant="body1"><strong>Curso Pretendido:</strong> {selectedCourse ? selectedCourse.name : ""}</Typography>
            <Typography variant="body1"><strong>Local de Oferta:</strong> {selectedCourse ? selectedCourse.academic_unit.name : ""}</Typography>
            <Typography variant="body1"><strong>Número de Inscrição do ENEM:</strong> {formState.enem}</Typography>
          </Box>
          <Typography variant="body2" mt={2}>
            Curso: {selectedCourse?.name}<br />
            Modalidades: {selectedCats.map(c => c.name).join(', ') || '—'}<br />
            Bonificação: {selectedBonus?.name ?? 'Nenhum'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button
            onClick={sendConfirm}
            autoFocus
            disabled={isdisabled || isLoading}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
