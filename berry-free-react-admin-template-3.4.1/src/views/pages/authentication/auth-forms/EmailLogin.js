import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';


import { callAPI } from 'utils/api_caller';
import { BACKEND_ENDPOINTS } from 'services/constant';

import { useUserInfo } from 'hooks';
import { useEmailVerified } from 'hooks';

// ============================|| FIREBASE - VERIFY_EMAIL ||============================ //

const FirebaseEmailLogin = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    // const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const [errorLogin, setErrorLogin] = useState(false);

    const { setUserInfo } = useUserInfo();
    const { isVerified, loading, error } = useEmailVerified();

    useEffect(() => {
        if (!loading && !error && isVerified) {
          navigate('/pages/login/login3');
        }
      }, [loading, error, isVerified, navigate]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    const handleVerifyEmail = async (email) => {
    
        try {
          // Kiểm tra sự tồn tại của email
          const response = await callAPI(BACKEND_ENDPOINTS.auth.login.identify, "POST", { email },  { withCredentials: true });
          const data = response.data;
          console.log(response)
          if (data) {
            setUserInfo({
                username: data['user_name'],
                faceid: data['is_faceid']
              });
            localStorage.setItem('refresh_token', data.refresh_token);
            navigate('/pages/login/login3')
          } else {
            console.error("Email does not exist.");
          }
        } catch (emailError) {
          setErrorLogin(true);
          console.error("Error checking email:", emailError);
        }
      };
    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <AnimateButton>

                    </AnimateButton>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ f: 16, mb: 2 }}>
                        <Typography>Sign in with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            await handleVerifyEmail(values.email);
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {
                            errorLogin && (
                                <div style={{ display: 'flex', alignItems: 'center', color: '#ff6666', marginLeft: '10px' }}>
                                    <WarningAmberIcon style={{ marginRight: '5px' }} />
                                    <p style={{ margin: 10 }}>Account does not exist</p>
                                </div>
                            )
                        }
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                   Next
                                </Button>
                            </AnimateButton>
                        </Box>

                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseEmailLogin;
