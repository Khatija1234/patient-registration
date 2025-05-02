import React, { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  InputAdornment
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Cake as AgeIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { queryPatients, notifyTabsOfUpdate } from '../dbConnection';

export default function PatientForm({ onPatientAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({
    email: false,
    phone: false
  });

  const [touched, setTouched] = useState({
    email: false,
    phone: false
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const validateEmail = (email) => {
    if (!email) return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });

    if (field === 'email') {
      setErrors({ ...errors, email: !validateEmail(formData.email) });
    }

    if (field === 'phone') {
      setErrors({ ...errors, phone: !validatePhone(formData.phone) });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email' && touched.email) {
      setErrors({ ...errors, email: !validateEmail(value) });
    }

    if (name === 'phone' && touched.phone) {
      setErrors({ ...errors, phone: !validatePhone(value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValid = validateEmail(formData.email);
    const phoneValid = validatePhone(formData.phone);

    if (!emailValid || !phoneValid) {
      setErrors({
        email: !emailValid,
        phone: !phoneValid
      });
      setTouched({
        email: true,
        phone: true
      });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      await queryPatients(
        `INSERT INTO patients (name, age, email, phone, address) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [formData.name, formData.age, formData.email, formData.phone, formData.address]
      );

      setFormData({ name: '', age: '', email: '', phone: '', address: '' });
      setStatus({ loading: false, error: null, success: true });
      notifyTabsOfUpdate();
      if (onPatientAdded) await onPatientAdded();

      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (err) {
      console.error("Registration error:", err);
      setStatus({
        loading: false,
        error: err.message || 'Failed to register patient',
        success: false
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
        <PersonIcon sx={{ mr: 1 }} /> Patient Registration
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {status.error && <Alert severity="error">{status.error}</Alert>}
          {status.success && (
            <Alert severity="success" icon={<SuccessIcon fontSize="inherit" />}>
              Patient registered successfully!
            </Alert>
          )}

          <TextField
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
          />

          <TextField
            name="age"
            label="Age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            inputProps={{ min: 0, max: 120 }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AgeIcon />
                </InputAdornment>
              )
            }}
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            error={errors.email && touched.email}
            helperText={errors.email && touched.email ? 'Invalid email address' : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color={errors.email && touched.email ? 'error' : 'action'} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            error={errors.phone && touched.phone}
            helperText={errors.phone && touched.phone ? 'Invalid phone number' : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color={errors.phone && touched.phone ? 'error' : 'action'} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            name="address"
            label="Address"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={status.loading}
            startIcon={status.loading ? <CircularProgress size={20} /> : null}
            fullWidth
          >
            {status.loading ? 'Registering...' : 'Register Patient'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
