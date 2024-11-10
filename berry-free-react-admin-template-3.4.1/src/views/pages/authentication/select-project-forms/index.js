import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    FormControl,
    InputLabel,
    Button,
    Box,
    Select,
    MenuItem,
} from '@mui/material';
import { callAPI } from 'utils/api_caller';
import { BACKEND_ENDPOINTS } from 'services/constant';
//import { parseCookieToObject } from 'utils/cookies';

const fetchProjects = async () => {
    
    const response = await callAPI(BACKEND_ENDPOINTS.user.project, "POST", {}, null, localStorage.getItem("access_token"));
    // return response.data.project;
    console.log(response.data); 
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { api: 1, name: "hello" },
                { api: 2, name: "test" }
            ]);
        }, 1000);
    });
};

const SelectForm = (... others) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // const authTokenObject = parseCookieToObject('user');

    useEffect(() => {
        const getProjects = async () => {
            try {
                const result = await fetchProjects(); // Fetch collections from database
                setProjects(result);
            } catch (error) {
                console.error("Error fetching projects", error);
            } finally {
                setLoading(false);
            }
        };
        getProjects();
    }, []);

    const handleAccessAPI = async (api) => {
        console.log("Accessed API:", api);
    };

    return (
        <Formik
            initialValues={{

                project: '',
            }}
            validationSchema={Yup.object().shape({
                project: Yup.string().required('Project is required'), 
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    console.log(values.project)
                    await handleAccessAPI(values.project); // Await API call to complete
                    setStatus({ success: true });
                } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ handleBlur, handleChange, handleSubmit, isSubmitting, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    {/* Empty space above Name Field */}
                    <Box sx={{ mb: 2, height: '20px' }} /> {/* Adjust height as needed */}

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="project">Project</InputLabel>
                        <Select
                            id="project"
                            name="project"
                            value={values.project}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Project"
                            disabled={loading} // Disable the select while loading
                        >
                            <MenuItem value="">None</MenuItem>
                            {projects.map((project) => (
                                <MenuItem key={project.api} value={project.api}>
                                    {project.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Submit Button */}
                    <Box>
                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                            Next
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default SelectForm;
