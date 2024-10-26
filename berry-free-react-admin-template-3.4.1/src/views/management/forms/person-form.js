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
    Typography,
    Select,
    MenuItem,
} from '@mui/material';

// Mock fetch function to simulate database call
const fetchCollections = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(['Collection A', 'Collection B', 'Collection C']);
        }, 1000);
    });
};

const PersonForm = ({ onSubmit }) => {
    const scriptedRef = useRef(null); // Reference to handle async logic
    const [images, setImages] = useState([]); // State to hold image files
    const [collections, setCollections] = useState([]); // State to hold collection options
    const [loading, setLoading] = useState(true); // State to manage loading state

    // Fetch collections from database on component mount
    useEffect(() => {
        const getCollections = async () => {
            try {
                const result = await fetchCollections(); // Fetch collections from database
                setCollections(result);
            } catch (error) {
                console.error("Error fetching collections", error);
            } finally {
                setLoading(false);
            }
        };
        getCollections();
    }, []);

    // Function to handle file uploads
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to Array
        setImages(prevImages => [...prevImages, ...files]); // Add new images to existing array
    };

    // Function to remove an image from the list
    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <Formik
            initialValues={{
                name: '',
                dob: '',
                nationality: '',
                collection: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().max(255).required('Name is required'),
                dob: Yup.date().required('Date of Birth is required').nullable(),
                nationality: Yup.string().max(255).required('Nationality is required'),
                collection: Yup.string().nullable(), // Optional field for collection
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
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
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
                            label="name*"
                        />
                        {touched.name && errors.name && (
                            <FormHelperText error id="name-error">
                                {errors.name}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Date of Birth Field */}
                    <FormControl fullWidth error={Boolean(touched.dob && errors.dob)} sx={{ mb: 2 }}>
                        <InputLabel htmlFor="dob">Date of Birth</InputLabel>
                        <OutlinedInput
                            id="dob"
                            type="date"
                            value={values.dob}
                            name="dob"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Date of Birth"
                        />
                        {touched.dob && errors.dob && (
                            <FormHelperText error id="dob-error">
                                {errors.dob}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Nationality Field */}
                    <FormControl fullWidth error={Boolean(touched.nationality && errors.nationality)} sx={{ mb: 2 }}>
                        <InputLabel htmlFor="nationality">Nationality</InputLabel>
                        <OutlinedInput
                            id="nationality"
                            type="text"
                            value={values.nationality}
                            name="nationality"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Nationality"
                        />
                        {touched.nationality && errors.nationality && (
                            <FormHelperText error id="nationality-error">
                                {errors.nationality}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Collection Field (Dropdown) */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="collection">Collection (Optional)</InputLabel>
                        <Select
                            id="collection"
                            name="collection"
                            value={values.collection}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Collection"
                            disabled={loading} // Disable the select while loading
                        >
                            <MenuItem value="">None</MenuItem>
                            {collections.map((collection, index) => (
                                <MenuItem key={index} value={collection}>
                                    {collection}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Image Upload Field */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="image-upload">Upload Images</InputLabel>
                        <OutlinedInput
                            id="image-upload"
                            type="file"
                            inputProps={{ multiple: true }} // Allow multiple file uploads
                            onChange={handleFileChange}
                        />
                    </FormControl>

                    {/* List of Uploaded Images */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Uploaded Images:</Typography>
                        {images.length > 0 ? (
                            <Box>
                                {images.map((image, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>{image.name}</Typography>
                                        <Button variant="outlined" color="error" onClick={() => handleRemoveImage(index)}>Remove</Button>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography>No images uploaded.</Typography>
                        )}
                    </Box>

                    {/* Submit Button */}
                    <Box >
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting}
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

export default PersonForm;
