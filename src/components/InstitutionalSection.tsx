import { Container, Typography, List, ListItem, ListItemText, Link, Box } from "@mui/material";




export const InstitutionalSection: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h3" component="h1" gutterBottom>
      Institucional
    </Typography>

    <Typography variant="h5" component="h2" gutterBottom>
      Licenciamento e créditos
    </Typography>

    <Typography paragraph>
      Este software é distribuído sob a licença <strong>MIT</strong>, permitindo uso, cópia, modificação,
      fusão, publicação, distribuição, sublicenciamento e/ou venda de cópias do UniSelec, desde que o
      aviso de <code>copyright</code> original e esta nota de permissão sejam incluídos em todas as cópias ou
      partes substanciais do software.
    </Typography>

    <Typography paragraph>
      A instância de produção oficial — incluindo este portal <strong>Seleções</strong> — encontra‑se hospedada
      nos servidores da <strong>UNILAB</strong> para atender aos seus processos seletivos internos. Qualquer outra
      instituição é livre para implantar, adaptar e operar sua própria cópia, em conformidade com a
      licença MIT.
    </Typography>

    <Box component="pre" sx={{ whiteSpace: "pre-wrap", p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
{`Copyright (c) 2025 UniSelec Organization

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`}
    </Box>

    <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
      Governança do projeto
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Core Team — define roadmap, revisa PRs críticos e publica releases" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Maintainers — triagem de issues, automação CI e suporte comunitário" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Colaboradores — qualquer pessoa que tenha PR aceito" />
      </ListItem>
    </List>

    <Typography paragraph>
      Para dúvidas institucionais, parcerias ou suporte empresarial, escreva para <Link href="mailto:dti@unilab.edu.br">dti@unilab.edu.br</Link> ou abra uma discussão no
      <Link href="https://github.com/uniselec" sx={{ ml: 0.5 }} target="_blank" rel="noopener">GitHub</Link>.
    </Typography>
  </Container>
);