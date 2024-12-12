import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux'
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    FormControl,
    InputLabel,
    Button,
    Box,
    Select,
    MenuItem,
    Tooltip
} from '@mui/material';
import { useFetchProjects } from "hooks/useFetchProjects";
import { setApiKey } from 'store/actions/authActions';
import { setProject } from 'store/actions/projectActions';

const SelectForm = (...others) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fetchProjects } = useFetchProjects();

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
        const project = projects.find((project) => project.api === api);
        dispatch(setProject(project));
        dispatch(setApiKey(api));
        navigate('/dashboard/default');
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
                    console.log(values.project);
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

                    <FormControl fullWidth sx={{ mb: 2 }} disabled={loading}>
                        <InputLabel htmlFor="project">Project</InputLabel>
                        <Select
                            id="project"
                            name="project"
                            value={values.project}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Project"
                            disabled={loading}  // Disable while loading
                        >
                            {projects.map((project) => (
                                <MenuItem key={project.api} value={project.api}>
                                    <Tooltip 
                                        title={(
                                            <>
                                                <div><strong>Project Name:</strong> {project.name}</div>
                                                {project.original_name && <div><strong>Original Name:</strong>{project.original_name}</div>}
                                                {project.owner && <div><strong>Project Owner:</strong> {project.owner}</div>}
                                                <div><strong>Role:</strong> {project.role}</div>
                                            </>
                                        )}
                                        disableInteractive 
                                        arrow 
                                        placement="right"
                                    >
                                        <span>{project.name}</span>
                                    </Tooltip>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Submit Button */}
                    <Box>
                        <Button 
                            disableElevation 
                            disabled={isSubmitting} 
                            fullWidth 
                            size="large" 
                            type="submit" 
                            variant="contained" 
                            color="secondary"
                        >
                            Next
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default SelectForm;
