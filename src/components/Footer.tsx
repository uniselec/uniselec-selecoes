import { Typography, Box } from "@mui/material";


export function Footer() {
    return (<Box component="footer">
        <Typography variant="h6" align="center" gutterBottom>
            Esteticplex
        </Typography>
        <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
        >
            Sistema para Clínicas de Estética
        </Typography>
    </Box>);
}