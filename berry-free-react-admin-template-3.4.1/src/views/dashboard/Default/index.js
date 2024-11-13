import React from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import image from 'assets/images/noData.svg';

const Dashboard = () => {
  // Project metadata
  const projectMetadata = {
    name: 'Hello',
    role: 'Developer',
    scopes: 'All '
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>

        {/* Project Information Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h5" color="primary">
              Project: {projectMetadata.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Role:</strong> {projectMetadata.role}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Scopes:</strong> {projectMetadata.scopes}
            </Typography>
          </Paper>
        </Grid>

        {/* API Developer Key Section */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" color="primary">
              API Developer Key
            </Typography>
            <Typography variant="body1">
              8sSgMGiMWVlNDRk***********************
            </Typography>
          </Paper>
        </Grid>

        {/* API Programming Guide Section */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" color="primary">
              API Programming Guide
            </Typography>
            <Typography variant="body1">
              Python SDK • Google Colab • C++ SDK • REST API
            </Typography>
          </Paper>
        </Grid>

        {/* Plan Details and Days Remaining */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              Current plan: <strong>30 Day Trial (15 Free Liveness)</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary">
              License expiry: 15 Nov 2024 (UTC +07:00)
            </Typography>
            <Typography variant="h2" color="error" sx={{ marginTop: 2 }}>
              2
            </Typography>
            <Typography variant="body1" color="error">
              Days remaining
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Subscribe plan
            </Button>
          </Paper>
        </Grid>

        {/* API Calls Status */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
            <img src={image} alt="API Call Icon" style={{ width: 80, height: 80 }} />
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
              You have not made any API calls.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Read the API Programming Guide to get started on your first Face Recognition code.
            </Typography>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
