import React, { useRef, useState } from 'react';
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
    Autocomplete, 
    TextField
} from '@mui/material';
import { useSelector } from 'react-redux';
import { format } from "date-fns";
import countries from 'assets/data/countries.json'

const PersonForm = ({ onSubmit, person = null }) => {
    const scriptedRef = useRef(true); // Reference to handle async logic
    const [images, setImages] = useState([]); // Initialize with person images if editing
    const [imagesCurrent, setImagesCurrent] = useState(person?.images || []);
    const collections = useSelector(state => state.collections.collections);
    const [removeImageIDs, setRemoveImageIDs] = useState([]);
    const handleSubmit = async (values) => {
        // Gọi hàm onSubmit với dữ liệu của form và danh sách hình ảnh
        values.dob = format(new Date(values.dob), "yyyy-MM-dd");
        onSubmit({
            ...values,
            images,
            removeImageIDs,
        });
    };

    // Function to handle file uploads
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setImages(prevImages => [...prevImages, ...files]);
    };

    // Function to remove an image from the list
    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };
    const handleRemoveImageCurrent = (id) => {
        setImagesCurrent((prevImages) => prevImages.filter((image) => image.id !== id));
        setRemoveImageIDs((prevIDs) => [...prevIDs, id]);
    }

    return (
        <Formik
            initialValues={{
                name: person?.name || '',
                dob: person?.birth || '',
                nationality: person?.nationality || '',
                collection_id: person?.collection_id || '',
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
                        await handleSubmit(values, images);
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
                            label="Name"
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
                            value={values.dob ? format(new Date(values.dob), "yyyy-MM-dd") : values.dob}
                            name="dob"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Date of Birth"
                            sx={{
                                '& input': {
                                    color: values.dob ? 'inherit' : 'transparent', // Apply transparent color if dob has value
                                    '&:focus': {
                                        color: 'inherit',
                                    },
                                },
                            }}
                        />
                        {touched.dob && errors.dob && (
                            <FormHelperText error id="dob-error">
                                {errors.dob}
                            </FormHelperText>
                        )}
                    </FormControl>


                    {/* Nationality Field */}
                    {/* <FormControl fullWidth error={Boolean(touched.nationality && errors.nationality)} sx={{ mb: 2 }}>
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
                    </FormControl> */}
                    <FormControl fullWidth error={Boolean(touched.nationality && errors.nationality)} sx={{ mb: 2 }}>
                        <Autocomplete
                            id="nationality"
                            options={countries} // countries là danh sách quốc gia từ tệp JSON
                            getOptionLabel={(option) => option.name || ''} // option.name là tên quốc gia
                            value={countries.find((country) => country.name === values.nationality) || null}
                            onChange={(event, newValue) => {
                                handleChange({
                                    target: { name: 'nationality', value: newValue?.name || '' },
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Nationality"
                                    onBlur={handleBlur}
                                    error={Boolean(touched.nationality && errors.nationality)}
                                    helperText={touched.nationality && errors.nationality ? errors.nationality : ''}
                                />
                            )}
                        />
                    </FormControl>

                    {/* Collection Field (Dropdown) */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="collection">Collection (Optional)</InputLabel>
                        <Select
                            id="collection"
                            name="collection_id"
                            value={values.collection_id}  // Use collection_id here
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Collection"
                        >
                            <MenuItem value=''>None</MenuItem>  {/* Use an empty string as the default value */}
                            {collections.map((collection) => (
                                <MenuItem key={collection.id} value={collection.id}>
                                    {collection.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Image Upload Field */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
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
                        {imagesCurrent.map((image, index) => (
                            <Box
                                key={image.id} // Dùng image.id để đảm bảo key là duy nhất
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                }}
                            >
                                <img
                                    src={image.img_url}
                                    alt={`Face ${index}`}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        marginRight: '10px',
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveImageCurrent(image.id)} // Xóa ảnh theo id
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                        {images.length > 0 ? (
                            <Box>
                                {images.map((image, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <img
                                            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                            alt={`Uploaded ${index}`}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                        />
                                        <Typography>{image.name || image}</Typography>
                                        <Button variant="outlined" color="error" onClick={() => handleRemoveImage(index)}>Remove</Button>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography>No images uploaded.</Typography>
                        )}
                    </Box>

                    {/* Submit Button */}
                    <Box>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting || (!person && !images.length) || (!person && !removeImageIDs.length && !images.length)}
                            fullWidth
                        >
                            {person ? 'Update' : 'Submit'}
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default PersonForm;
