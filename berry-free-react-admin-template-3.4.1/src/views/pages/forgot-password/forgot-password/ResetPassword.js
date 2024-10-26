import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery, Box } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import FirebaseResetPassword from '../forgot-form/ResetPassword';
import AuthFooter from 'ui-component/cards/AuthFooter';

// assets

// ===============================|| RESET PASSWORD ||=============================== //

const ResetPassword3 = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center"> 
                    <Grid item xs={12}>
                        <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                        {/* Forgot Password Text */}
                        <Grid item>
                            <Stack spacing={0.5}>
                            <Typography
                                color={theme.palette.secondary.main}
                                variant={matchDownSM ? 'h3' : 'h2'}
                                sx={{ textAlign: 'left' }} // Left align the title
                            >
                                Reset Password
                            </Typography>
                            <Typography
                                variant="caption"
                                fontSize="16px"
                                sx={{ textAlign: 'left' }} // Left align the subtitle
                            >
                                Enter credentials to continue
                            </Typography>
                            </Stack>
                        </Grid>

                        {/* Logo */}
                        <Grid item>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Align logo to the right */}
                            <Link to="#">
                                <Logo />
                            </Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                  <Grid item xs={12}>
                    <FirebaseResetPassword />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ResetPassword3;
