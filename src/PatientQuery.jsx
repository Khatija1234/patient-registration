import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button,
  CircularProgress, Alert, Typography,
  TextField, Stack, InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { queryPatients, setupTabSync, notifyTabsOfUpdate } from '../dbConnection';

const PatientQuery = forwardRef((props, ref) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch patients with optional search query
  const fetchPatients = async (search = '') => {
    try {
      setLoading(true);
      setError(null);

      let sql = "SELECT * FROM patients";
      const params = [];

      if (search) {
        sql += " WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1";
        params.push(`%${search}%`);
      }

      sql += " ORDER BY registered_at DESC";

      const result = await queryPatients(sql, params);
      setPatients(result);
    } catch (err) {
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchPatients to the parent component
  useImperativeHandle(ref, () => ({
    fetchPatients
  }));

  // Initial fetch of patients and tab sync
  useEffect(() => {
    fetchPatients();
    const cleanup = setupTabSync(() => {
      fetchPatients(searchQuery);
    });
    return cleanup;
  }, []);

  // Search query debouncing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle patient deletion
  const deletePatient = async (id) => {
    try {
      await queryPatients("DELETE FROM patients WHERE id = $1", [id]);
      fetchPatients(searchQuery); // Refresh list after delete
      localStorage.setItem('patients-updated', Date.now().toString()); // Update timestamp
      notifyTabsOfUpdate(); // Notify other tabs
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete patient");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
        Patient Records
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          placeholder="Search by name, email or phone"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => deletePatient(patient.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {patients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
});

export default PatientQuery;
