/* src/features/applications/components/ApplicationForm.tsx */
import {
  Box, Grid, TextField, FormControl, Typography, Checkbox,
  FormControlLabel, Autocomplete, RadioGroup, Radio, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, List, ListItem,
} from '@mui/material';
import { useState, useEffect, FormEvent, SyntheticEvent } from 'react';
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
  /* -------------------------------- estado base ------------------------------- */
  const [formState, setFormState] = useState<ApplicationFormData>(
    application.form_data ?? ({} as ApplicationFormData),
  );

  /* --------------------------- estados auxiliares UI --------------------------- */
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

  /* ------------------------------- usuário logado ----------------------------- */
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

  /* ----------------------- sincronizações automáticas ------------------------ */
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
  return (
    <Box p={2}>
      <form onSubmit={openConfirm}>
        <Grid container spacing={3}>

          {/* ------------------- DADOS PESSOAIS ------------------- */}
          <Grid item xs={12}><Typography variant="h6" gutterBottom>Dados Pessoais</Typography></Grid>

          {/* nome / nome social */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required label="Nome Completo" name="name"
                value={formState.name || ''} disabled
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                label="Nome Social" name="social_name"
                value={formState.social_name || ''}
                onChange={e => setFormState({ ...formState, social_name: e.target.value })}
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
                disabled={isdisabled}
                InputProps={{
                  inputComponent: CPFMask as any,
                }}/>
            </FormControl>
          </Grid>

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

          {/* telefone / endereço */}
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

          {/* inscrição ENEM + ano */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField required label="Número de Inscrição do ENEM" name="enem"
                value={formState.enem || ''}
                onChange={e => setFormState({ ...formState, enem: e.target.value })}
                disabled={isdisabled} />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={processSelection.allowed_enem_years || []}
                getOptionLabel={(option) => option.toString()}
                value={selectedYear}
                onChange={(_, v) => setSelectedYear(v)}
                renderInput={p => <TextField {...p} label="Ano do ENEM" required />}
              />
            </FormControl>
          </Grid>

          {/* modalidades */}
          <Grid item xs={12}>
            <Typography variant="h6">Modalidade</Typography>
            <List>
              {(processSelection.admission_categories || [])
                .filter(cat =>
                  (selectedCourse?.vacanciesByCategory?.[cat.name] ?? 0) > 0)
                .map(cat => (
                  <ListItem key={cat.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isCatChecked(cat)}
                          onChange={e => toggleCat(cat, e.target.checked)}
                        />
                      }
                      label={`${cat.description} (${selectedCourse?.vacanciesByCategory?.[cat.name]} vagas)`}
                    />
                  </ListItem>
                ))}
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
          <Button onClick={sendConfirm} autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
