import React, { useState,  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, Button, Box, IconButton, Card, CardContent, TextField, Tooltip} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { StarOutline } from "@mui/icons-material";
import { IconEdit } from "@tabler/icons";
import { useSelector, useDispatch } from "react-redux";
import { updateProjectName } from "store/actions/projectActions";
import { useCallAPI } from "hooks/useCallAPI";
import { BACKEND_ENDPOINTS } from "services/constant";
import { useFetchCollections } from "hooks/useFetchCollections";
import { fetchCollectionsRequest, fetchCollectionsSuccess, fetchCollectionsFailure } from 'store/actions/collectionsActions';
const Dashboard = () => {

  const { callAPI } = useCallAPI();
  const { fetchCollections } = useFetchCollections();
  const navigate = useNavigate();
  const projectMetadata = useSelector((state) => state.project.selectedProject);
  const dispatch = useDispatch();
  const isAdmin = projectMetadata.role === "admin";
  useEffect(() => {
    const initializeCollections = async () => {
        dispatch(fetchCollectionsRequest());
        try {
            const result = await fetchCollections();
            dispatch(fetchCollectionsSuccess(result));
        } catch (error) {
            dispatch(fetchCollectionsFailure());
            // console.error("Error fetching collections", error);
        }
    };
    initializeCollections();
}, [dispatch, fetchCollections]);

  // State to manage project name editing
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(projectMetadata.name);

  const remainDays = (exp) => {
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.round((exp - currentTime) / (24 * 60 * 60));
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Save changes, e.g., call API or update store
      dispatch(updateProjectName(projectName));
      console.log('Project name changed to:', projectName);

      // call api here
      try {
        await callAPI(BACKEND_ENDPOINTS.project.change_name, "POST", { pname: projectName }, true);
      } catch (err) {
        alert('err');
      }

    }
    setIsEditing(!isEditing);
  };

  const onDetailClick = () => {
    console.log("Detail button clicked");
    navigate('/pages/collection-management')
  };

  return (
    <Box sx={{ padding: 3, minHeight: "100vh" }}>
      <Typography variant="h5" gutterBottom >
        Dashboard
      </Typography>
      <Grid container spacing={3} alignItems="flex-start">
        {/* Project Information Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ paddingBottom: 2, flexGrow: 1 }}>
                <strong>Project name: </strong>
                {/* Editable Project Name */}
                {isEditing ? (
                  <TextField
                    value={projectName}
                    onChange={handleProjectNameChange}
                    variant="outlined"
                    size="small"
                    sx={{ width: '100%' }}
                  />
                ) : (
                  <span>{projectName}</span>
                )}
              </Typography>
              <IconButton
                color="primary"
                onClick={toggleEditMode}
                aria-label="Edit Project Name"
              >
                <IconEdit />
              </IconButton>
            </Box>
            <Typography variant="body1" color="textSecondary">
              <strong>Role:</strong> {projectMetadata.role}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Scopes:</strong> {isAdmin ? "All" : 'detail'}
              <Tooltip title="View Details" arrow>
                <IconButton
                  color="primary"
                  onClick={onDetailClick}
                  aria-label="View Details"
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Typography>
          </Paper>
        </Grid>

        {/* API Developer Key Section */}
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="primary">
              API Developer Key
            </Typography>
            <Typography variant="body1">{projectMetadata.api}</Typography>
          </Paper>
        </Grid>
        {/* Plan Upgrade Section */}
        <Grid item xs={12} sm={6}>
          <Card
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,

            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StarOutline color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Free</Typography>
            </Box>
            <Button variant="contained" color="primary" size="small">
              Upgrade Plan
            </Button>
          </Card>
        </Grid>


        {/* Plan Details and Days Remaining */}
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body1">
              Current plan: <strong>30 Day Trial (15 Free Liveness)</strong>
            </Typography>
            <Typography variant="body1">License expiry: 15 Nov 2024 (UTC +07:00)</Typography>
            <Typography variant="h2" color="error" sx={{ marginTop: 2 }}>
              {remainDays(projectMetadata.exp)}
            </Typography>
            <Typography variant="body1" color="error">
              Days remaining
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Subscribe plan
            </Button>
          </Paper>
        </Grid>



        {/* Credit Usage Section */}
        <Grid item xs={12} sm={6}>
          <Card
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              gap: 2,

            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                height: 50,
                width: 50,

              }}
            >
              <Typography variant="h5" color="primary">
                ▉
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="subtitle1">Credit Usage For Last 30 Days</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <IconButton size="small" color="primary">
                  <InfoOutlinedIcon />
                </IconButton>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Credit details
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ mt: 1 }}>
                0.04 / 25
              </Typography>
              <Typography variant="caption" color="textSecondary">
                0.16% used
              </Typography>
            </CardContent>
          </Card>
        </Grid>



      </Grid>
    </Box>
  );
};

export default Dashboard;
