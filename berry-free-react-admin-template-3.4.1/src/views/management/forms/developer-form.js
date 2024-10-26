import React, { useRef, useState, useEffect } from 'react';
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
    CircularProgress
} from '@mui/material';

// Mock fetch function to simulate database call
const fetchCollections = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(['Collection A', 'Collection B', 'Collection C']);
        }, 1000);
    });
};

const DeveloperForm = ({ onSubmit }) => {
    const scriptedRef = useRef(null); // Reference to handle async logic
    const [collections, setCollections] = useState([]); // Store the collections
    const [loading, setLoading] = useState(true); // Loading state for fetching collections

    useEffect(() => {
        const getCollections = async () => {
            const result = await fetchCollections(); // Fetch collections from database
            setCollections(result);
            setLoading(false);
        };
        getCollections();
    }, []);

    return (
        <Formik
            initialValues={{
                name: '',
                email: '',
                assignedCollection: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().max(255).required('Name is required'),
                email: Yup.string().email('Must be a valid email').required('Email is required'),
                assignedCollection: Yup.string().required('Assigned Collection is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    if (scriptedRef.current) {
                        // Call onSubmit prop to handle form submission
                        await onSubmit(values);
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
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                    {/* Empty space above Name Field */}
                    <Box sx={{ mb: 2, height: '20px' }} />

                    {/* Name Field */}
                    <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ mb: 2 }}>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <OutlinedInput
                            id="name"
                            type="text"
                            value={values.name}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Name*"
                        />
                        {touched.name && errors.name && (
                            <FormHelperText error id="name-error">
                                {errors.name}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Organizational Email Field */}
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

                    {/* Assigned Collection Field */}
                    <FormControl fullWidth error={Boolean(touched.assignedCollection && errors.assignedCollection)} sx={{ mb: 2 }}>
                        <InputLabel id="assigned-collection-label">Assigned Collection</InputLabel>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            <Select
                                labelId="assigned-collection-label"
                                id="assigned-collection"
                                name="assignedCollection"
                                value={values.assignedCollection}
                                onBlur={handleBlur}
                                onChange={(event) => setFieldValue('assignedCollection', event.target.value)}
                                label="Assigned Collection"
                            >
                                <MenuItem value="">Select a collection</MenuItem>
                                {collections.map((collection, index) => (
                                    <MenuItem key={index} value={collection}>
                                        {collection}
                                    </MenuItem>
                                ))}
                                <MenuItem value="All">All</MenuItem> {/* "All" option */}
                            </Select>
                        )}
                        {touched.assignedCollection && errors.assignedCollection && (
                            <FormHelperText error id="assigned-collection-error">
                                {errors.assignedCollection}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Submit Button */}
                    <Box>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting || loading}
                            fullWidth
                        >
                            Submit
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default DeveloperForm;
