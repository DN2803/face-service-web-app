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
    CircularProgress,
    Checkbox
} from '@mui/material';
import { useFetchCollections } from 'hooks/useFetchCollections';

const DeveloperForm = ({ onSubmit, developer = null }) => {
    const scriptedRef = useRef(true); // Reference to handle async logic
    const [collections, setCollections] = useState([]); // Store the collections
    const [loading, setLoading] = useState(true); // Loading state for fetching collections
    const { fetchCollections } = useFetchCollections();
    const handleSubmit = async (values) => {
        onSubmit({
            ...values,
        });
    };

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
                email: developer?.email || '',
                collection_id: developer?.collection_ids||'',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').required('Email is required'),
                collection_id: Yup.array().min(1, 'At least one collection must be selected')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    console.log(scriptedRef.current)
                    if (scriptedRef.current) {
                        // Call onSubmit prop to handle form submission
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
                    {/* Empty space above Name Field */}
                    <Box sx={{ mb: 2, height: '20px' }} />

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
                                id="collection"
                                name="collection_id"
                                value={values.collection_id || []} // Ensure value is an array for multiple
                                onChange={(event) => {
                                    const { value } = event.target;
                                    // Update the selected values (handle array toggle logic if needed)
                                    handleChange({
                                        target: {
                                            name: "collection_id",
                                            value: typeof value === "string" ? value.split(",") : value,
                                        },
                                    });
                                }}
                                onBlur={handleBlur}
                                label="Collection"
                                disabled={loading}
                                multiple // Allow multiple selection
                                renderValue={(selected) =>
                                    // Render selected collections as comma-separated string
                                    collections
                                        .filter((collection) => selected.includes(collection.id))
                                        .map((collection) => collection.name)
                                        .join(", ")
                                }
                            >
                                {collections.map((collection) => (
                                    <MenuItem key={collection.id} value={collection.id}>
                                        <Checkbox checked={values.collection_id?.includes(collection.id) || false} />
                                        {collection.name}
                                    </MenuItem>
                                ))}
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
