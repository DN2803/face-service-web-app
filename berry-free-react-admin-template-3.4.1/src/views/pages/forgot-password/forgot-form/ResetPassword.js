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
    InputAdornment,
    IconButton
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


import { callAPI } from 'utils/api_caller';

import { useEmail } from 'hooks/context/EmailContext';
// ============================|| FIREBASE - RESETPASSWORD ||============================ //

const FirebaseResetPassword = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    // const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    const { email } = useEmail();
    const handleResetPasword = async (newPassword) => {
        try {
            const response = await callAPI("/reset_password", "POST", { email: email, password: newPassword})
            const data = await response.data;
            if (response) {
                navigate('/');
            } else {
                console.error('Lỗi thay đổi mật khẩu:', data.message);
                navigate('/');
            }
        } catch (error) {
            console.error('Lỗi khi gửi request:', error);
            navigate('/');

        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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
                        <Typography>Please choose your new password.</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            // Gọi hàm handleLogin để gửi dữ liệu về server
                            await handleResetPasword(values.password);
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
                        {/* Password Field */}
                        <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Confirm Password Field */}
                        <FormControl fullWidth error={Boolean(touched.confirmPassword && errors.confirmPassword)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-confirm-password-login">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-confirm-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                name="confirmPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm Password"
                                inputProps={{}}
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <FormHelperText error id="standard-weight-helper-text-confirm-password-login">
                                    {errors.confirmPassword}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                    Reset Password
                                </Button>
                            </AnimateButton>
                        </Box>

                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseResetPassword;
