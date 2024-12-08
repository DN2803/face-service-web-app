import React, { useState, useRef, useEffect } from 'react';
import { Formik } from 'formik';
import {
    FormControl,
    InputLabel,
    Button,
    Box,
    Select,
    MenuItem,
    Typography, 
    Checkbox
} from '@mui/material';
import ImageUpload from "ui-component/ImageUpload";
import { useFetchCollections } from 'hooks/useFetchCollections';


const FaceSearchForm = ({ onSubmit, collection = null }) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const scriptedRef = useRef(true);
    const [collections, setCollections] = useState([]); // State to hold collection options
    const [loading, setLoading] = useState(true);
    const { fetchCollections } = useFetchCollections()

    const handleSearch = async (values, image) => {
        onSubmit({
            ...values,
            image,
        });
    };

    const limits = [10, 20, 50];
    const types = [
        { title: "Strict Search", confidence_score: 0.7 },
        { title: "Moderate Search", confidence_score: 0.66 },
        { title: "Find all similar", confidence_score: 0 },
    ];

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
                    collection_id: collection?.id || '',  // Ensure collection_id is always a string or an empty string if not provided
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
                        {/* Collection Field (Dropdown) */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel htmlFor="collection">Collection (Optional)</InputLabel>
                            {/* <Select
                                id="collection"
                                name="collection_id"
                                value={values.collection_id}  // Use collection_id here
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Collection"
                                disabled={loading}
                            >
                                <MenuItem value=''>None</MenuItem> 
                                {collections.map((collection) => (
                                    <MenuItem key={collection.id} value={collection.id}>
                                        {collection.name}
                                    </MenuItem>
                                ))}
                            </Select> */}
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

                        </FormControl>

                        {/* Limit Field (Dropdown) */}
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

                        {/* Type Field (Dropdown) */}
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
