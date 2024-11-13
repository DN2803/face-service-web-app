import React, { useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Button,
    Box,
} from '@mui/material';



const CollectionForm = ({ onSubmit }) => {
    const scriptedRef = useRef(null); // Reference to handle async logic


    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().max(255).required('Name is required'),
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
                    {/* Empty space above Name Field */}
                    <Box sx={{ mb: 2, height: '20px' }} /> {/* Adjust height as needed */}

                    {/* Name Field */}
                    <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ mb: 2 }}>
                        <InputLabel htmlFor="name">Collection Name</InputLabel>
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

                    {/* Description Field */}
                    <FormControl fullWidth error={Boolean(touched.id && errors.id)} sx={{ mb: 2 }}>
                        <InputLabel htmlFor="id">Description</InputLabel>
                        <OutlinedInput
                            id="id"
                            type="text"
                            value={values.description}
                            name="id"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Description"
                        />
                        {touched.id && errors.id && (
                            <FormHelperText error id="id-error">
                                {errors.id}
                            </FormHelperText>
                        )}
                    </FormControl>

                   
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

export default CollectionForm;
