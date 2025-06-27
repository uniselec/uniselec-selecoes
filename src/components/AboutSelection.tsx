import { Container, Typography, List, ListItem, ListItemText, Link, Box } from "@mui/material";

/**
 * Sobre o UniSelec / Institucional
 * Componentes React para páginas estáticas.
 *
 * ▸ <AboutSection />  → /sobre
 * ▸ <InstitutionalSection /> → /institucional
 */

export const AboutSection: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h3" component="h1" gutterBottom>
      Sobre o UniSelec
    </Typography>

    <Typography paragraph>
      O <strong>UniSelec</strong> é um sistema <em>open‑source</em> para gerenciamento de processos
      seletivos de cursos de graduação. Ele centraliza inscrições, análise de documentos,
      classificação de candidatos e publicação de resultados em uma plataforma moderna, construída
      com <strong>Laravel (PHP)</strong> no back‑end e <strong>React</strong> no front‑end.
    </Typography>

    <Typography paragraph>
      Estas páginas pertencem ao módulo <strong>Seleções</strong> — o portal público do UniSelec onde os
      candidatos realizam suas inscrições — disponível em {" "}
      <Link href="https://selecoes.unilab.edu.br" target="_blank" rel="noopener">
        selecoes.unilab.edu.br
      </Link>.
    </Typography>

    <Typography paragraph>
      A implantação oficial roda na infraestrutura da <strong>Universidade da Integração
      Internacional da Lusofonia Afro‑Brasileira (UNILAB)</strong>, atendendo aos processos seletivos da
      instituição. Outras universidades podem clonar, configurar e hospedar suas próprias
      instâncias livremente.
    </Typography>

    <Typography variant="h5" component="h2" gutterBottom>
      Benefícios principais
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Transparência nas etapas e critérios de avaliação" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Flexibilidade para criar editais com diferentes cursos, cotas e bônus" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Escalabilidade para instituições de qualquer porte graças a Docker" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Extensibilidade via API REST para integrações externas" />
      </ListItem>
    </List>

    <Typography paragraph>
      O projeto é mantido de forma colaborativa pela <strong>UniSelec Organization</strong> no GitHub.
      Contribuições de código, testes, documentação e traduções são muito bem‑vindas — consulte o
      arquivo <code>CONTRIBUTING.md</code>.
    </Typography>

    <Typography variant="h5" component="h2" gutterBottom>
      Repositórios oficiais
    </Typography>
    <List>
      <ListItem>
        <ListItemText
          primary={<Link href="https://github.com/uniselec" target="_blank" rel="noopener">
            github.com/uniselec
          </Link>}
          secondary="Organization"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={<Link href="https://github.com/uniselec/uniselec-api" target="_blank" rel="noopener">
            uniselec-api
          </Link>}
          secondary="Back‑end Laravel"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={<Link href="https://github.com/uniselec/uniselec-selecoes" target="_blank" rel="noopener">
            uniselec-selecoes
          </Link>}
          secondary="Seleções – portal público (este front‑end)"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={<Link href="https://github.com/uniselec/uniselec-admin" target="_blank" rel="noopener">
            uniselec-admin
          </Link>}
          secondary="Painel Administrador"
        />
      </ListItem>
    </List>
  </Container>
);