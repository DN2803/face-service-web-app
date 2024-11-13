import React, { useState, useRef } from 'react';
import { Formik } from 'formik';
import {
    FormControl,
    InputLabel,
    Button,
    Box,
    Select,
    MenuItem,
    Typography
} from '@mui/material';
import ImageUpload from "ui-component/ImageUpload";

const FaceSearchForm = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const scriptedRef = useRef(true);

    const handleSearch = async (values, image) => {
        console.log(values);
        console.log(image);
    };

    const limits = [10, 20, 50];
    const types = [
        { title: "Strict Search", confidence_score: 70 },
        { title: "Moderate Search", confidence_score: 66 },
        { title: "Find all similar", confidence_score: 0 },
    ];

    return (
        <>
            <Box
                sx={{
                    padding: 2,
                    marginBottom: 3,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Image Upload
                </Typography>
                <ImageUpload
                    handleUpload={setUploadedImage}
                    uploadedImage={uploadedImage}
                    sizeAccept={{ width: 800, height: 800 }}
                />
            </Box>
            <Formik
                initialValues={{
                    limit: '10',
                    confidence_score: 0,
                }}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            await handleSearch(values, uploadedImage);
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
                {({ handleBlur, handleChange, handleSubmit, isSubmitting, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="limit">Limit</InputLabel>
                            <Select
                                id="limit"
                                name="limit"
                                value={values.limit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Limit"
                            >
                                {limits.map((limit, index) => (
                                    <MenuItem key={index} value={limit}>
                                        {limit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="type">Type</InputLabel>
                            <Select
                                id="type"
                                name="confidence_score"
                                value={values.confidence_score}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Type"
                            >
                                {types.map((type, index) => (
                                    <MenuItem key={index} value={type.confidence_score}>
                                        {type.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                disabled={isSubmitting || !uploadedImage}
                                fullWidth
                            >
                                Submit
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FaceSearchForm;
