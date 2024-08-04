import { Typography, Box, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import { useGetStudentSelectionQuery } from '../features/studentSelection/studentSelectionSlice';

export function Footer() {
    const { data, error, isLoading } = useGetStudentSelectionQuery();
    const isInPeriod = data?.studentSelection?.isInPeriod ?? false;
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    return (
        <Box component="footer" sx={{ px: 2, mt: 'auto' }}>

            {(isInPeriod) && (

                <>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        component="p"
                    >
                        <Button
                            component={Link}
                            to="https://wa.me/558533326139"
                            startIcon={<WhatsAppIcon />}
                            variant="contained"
                            color="success"
                        >
                            Suporte Técnico
                        </Button>
                    </Typography><br></br></>)}

            <Typography variant="h6" align="center" gutterBottom>
                Sistema de Seleção de Alunos da UNILAB
            </Typography>

        </Box>
    );
}
