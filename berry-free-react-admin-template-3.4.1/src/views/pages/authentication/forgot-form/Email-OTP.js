import { useState } from 'react';
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
// import { Password } from '@mui/icons-material';

import { useEmail } from 'hooks/context/EmailContext';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseForgotPassword = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    // const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const [errorLogin, setErrorLogin] = useState(false);
    const { setEmail } = useEmail();
    const [isExistEmail, setIsExistEmail] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const handleSendEmail = async (email) => {
        try {
            const response = await callAPI("/send_otp", "POST", { email: email })
            if (response) {
                setOtpSent(true);
                setIsExistEmail(true);
            } 
            else {
                console.error('Error sending OTP:', response.message);
                setOtpSent(false);
                setErrorLogin(true);
            }
        } catch (error) {
            console.error('Request error:', error);
            setErrorLogin(true);
            setOtpSent(false);
        }
    };
    const handleVerifyOtp = async (email, otp_value) => {
        try {
            const response = await callAPI("/verify_otp", "POST", { email: email, otp: otp_value })
            if (response) {
                setEmail(email);
                navigate('/pages/reset-password');
            } else {
                console.error('Invalid OTP:', response.message);
                setErrorLogin(true);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrorLogin(true);
        }
    }

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <AnimateButton>

                    </AnimateButton>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ f: 16, mb: 2 }}>
                        <Typography>Enter your email address below and we&apos;ll send you password reset OTP.</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    otp_value: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    otp_value: Yup.string().length(6, 'OTP must be 6 digits').when('otpSent', {
                        is: true,
                        then: Yup.string().required('OTP is required')
                      })
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            await handleVerifyOtp(values.email, values.otp_value);
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
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {otpSent && (
                        <FormControl fullWidth error={Boolean(touched.otp && errors.otp)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-otp">Enter OTP</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-otp"
                                type="text"
                                value={values.otp}
                                name="otp"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Enter OTP"
                                inputProps={{ maxLength: 6 }} // OTP typically has 6 digits
                            />
                            {touched.otp && errors.otp && (
                                <FormHelperText error id="standard-weight-helper-text-otp">
                                    {errors.otp}
                                </FormHelperText>
                            )}
                        </FormControl>
                        )}
                        
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

                        {!otpSent &&(<Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="button" variant="contained" color="secondary" onClick={async () => await handleSendEmail(values.email)}>
                                    Send Mail
                                </Button>
                            </AnimateButton>
                        </Box>
                        )}
                        {isExistEmail && (
                            <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                    Reset Password
                                </Button>
                            </AnimateButton>
                        </Box>
                        )}
                        
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseForgotPassword;
