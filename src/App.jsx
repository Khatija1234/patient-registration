import React, { useRef } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box
} from '@mui/material';
import PatientQuery from './PatientQuery';
import PatientForm from './PatientForm';
import { teal, deepPurple, blue } from '@mui/material/colors';
import HealingIcon from '@mui/icons-material/Healing';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Create a custom theme with healthcare colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Nature green
      light: '#81C784',
      dark: '#1B5E20'
    },
    secondary: {
      main: '#1565C0', // Trustworthy blue
      light: '#5E92F3',
      dark: '#003C8F'
    },
    background: {
      default: '#f8f9fa'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#2E7D32'
    },
    h5: {
      fontWeight: 600,
      color: '#1565C0'
    }
  }
});

export default function App() {
  const queryRef = useRef();

  const handlePatientAdded = () => {
    if (queryRef.current) {
      queryRef.current.fetchPatients();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ 
        mt: 4, 
        mb: 6,
        minHeight: '100vh'
      }}>
        {/* Header with healthcare proverb */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4,
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
        }}>
          <Typography variant="h4" sx={{ 
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <HealingIcon fontSize="large" />
            Patient Management System
            <FavoriteIcon fontSize="large" sx={{ color: '#d32f2f' }} />
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            fontStyle: 'italic',
            color: '#455a64'
          }}>
            "The art of medicine consists of amusing the patient while nature cures the disease." — Voltaire
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Registration Form Column */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ 
              p: 4,
              height: '100%',
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              '&:hover': {
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.15)'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.primary.dark
              }}>
                <HealingIcon color="primary" />
                Patient Registration
              </Typography>
              <PatientForm onPatientAdded={handlePatientAdded} />
            </Paper>
          </Grid>
          
          {/* Patient Records Column */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ 
              p: 3,
              height: '100%',
              borderLeft: `4px solid ${theme.palette.secondary.main}`,
              '&:hover': {
                boxShadow: '0 6px 20px rgba(21, 101, 192, 0.15)'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.secondary.dark
              }}>
                <FavoriteIcon color="secondary" />
                Patient Records
              </Typography>
              <PatientQuery ref={queryRef} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}