import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Button,
    Box,
    Select,
    MenuItem,
    CircularProgress,
    Checkbox,
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useCallAPI } from 'hooks/useCallAPI';
import { BACKEND_ENDPOINTS } from 'services/constant';

const DeveloperForm = ({ onSubmit, developer = null }) => {
    const scriptedRef = useRef(true);
    const [checkDev, setCheckDev] = useState(developer !== null);
    const [devName, setDevName] = useState('');
    const [devToken, setDevToken] = useState(null);
    const [warning, setWarning] = useState(null);
    const [isCheckingEmail, setIsCheckingEmail] = useState(developer !== null);
    const { callAPI } = useCallAPI();
    const collections = useSelector(state => state.collections.collections);

    const checkEmailExistence = async (email) => {
        setIsCheckingEmail(true);
        try {
            const response = await callAPI(
                BACKEND_ENDPOINTS.auth.login.identify,
                'POST',
                { email },
                true
            );

            const data = response?.data;
            if (data) {
                setCheckDev(true);
                setDevName(data.info?.name || 'Unknown');
                setDevToken(data.refresh_token || '');
                setWarning(null); // Clear previous warnings
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage =
                error.response?.data && typeof error.response.data === 'string'
                    ? error.response.data
                    : 'An unexpected error occurred.';
            setWarning(errorMessage);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const handleSubmit = async (values) => {
        onSubmit({
            ...values,
            devName,
            devToken,
        });
    };

    return (
        <Formik
            initialValues={{
                email: developer?.email || '',
                collection_id: developer ? JSON.parse(developer.scope) || [] : [],
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').required('Email is required'),
                collection_id: Yup.array().min(1, 'At least one collection must be selected'),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    if (scriptedRef.current) {
                        await handleSubmit(values);
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
                <form noValidate onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2, height: '20px' }} />

                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ mb: 2 }}>
                        <InputLabel htmlFor="email">Organizational Email</InputLabel>
                        <OutlinedInput
                            id="email"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Organizational Email"
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="email-error">
                                {errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {!checkDev && (
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting || isCheckingEmail}
                                    fullWidth
                                    size="large"
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => checkEmailExistence(values.email)}
                                    sx={{
                                        transition: 'transform 0.2s',
                                        '&:active': { transform: 'scale(0.95)' },
                                    }}
                                >
                                    {isCheckingEmail ? <CircularProgress size={24} color="inherit" /> : 'Next'}
                                </Button>
                            </AnimateButton>
                        </Box>
                    )}

                    {warning && (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#ff6666', mt: 2 }}>
                            <WarningAmberIcon sx={{ mr: 1 }} />
                            <span>{warning}</span>
                        </Box>
                    )}

                    {checkDev && (
                        <>
                            <FormControl
                                fullWidth
                                error={Boolean(touched.collection_id && errors.collection_id)}
                                sx={{ mb: 2 }}
                            >
                                <InputLabel id="collection-label">Assigned Collection</InputLabel>

                                <Select
                                    id="collection_id"
                                    name="collection_id"
                                    value={values.collection_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Assigned Collection"
                                    multiple
                                >
                                    {collections.map((collection) => (
                                        <MenuItem key={collection.id} value={collection.id}>
                                            <Checkbox checked={values.collection_id.includes(collection.id)} />
                                            {collection.name}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {touched.collection_id && errors.collection_id && (
                                    <FormHelperText error id="collection-error">
                                        {errors.collection_id}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <Box>
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {developer ? 'Update' : 'Submit'}
                                </Button>
                            </Box>
                        </>
                    )}

                </form>
            )}
        </Formik>
    );
};

export default DeveloperForm;
