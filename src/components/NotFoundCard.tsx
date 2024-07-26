import React from 'react';
import { Box, Typography, Paper } from "@mui/material";

export const NotFoundCard = () => {
    return (

        <Box>
            <Paper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    p={5}>
                    <Typography variant="h1">404</Typography>
                    <Typography variant="h2">Página não encontrada</Typography>
                </Box>
            </Paper>
        </Box>
    )
}
