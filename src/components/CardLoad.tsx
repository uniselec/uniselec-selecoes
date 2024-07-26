import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function CardLoad() {
    return (<>

        <Box sx={{ minWidth: 275 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Carregando dados...
                    </Typography>
                    <CircularProgress disableShrink />
                </CardContent>
            </Card>

        </Box>
    </>);
}