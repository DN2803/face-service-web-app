import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, Button, Box, IconButton, Card, CardContent, TextField, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FileCopy } from "@mui/icons-material";
import { IconEdit } from "@tabler/icons";
import { useSelector, useDispatch } from "react-redux";
import { updateProjectName } from "store/actions/projectActions";
import { useCallAPI } from "hooks/useCallAPI";
import { BACKEND_ENDPOINTS } from "services/constant";
import { useFetchCollections } from "hooks/useFetchCollections";
import { fetchCollectionsRequest, fetchCollectionsSuccess, fetchCollectionsFailure } from 'store/actions/collectionsActions';
import ApiKeyDisplay from "ui-component/APIKeyDisplay";
const Dashboard = () => {

  const { callAPI } = useCallAPI();
  const { fetchCollections } = useFetchCollections();
  const navigate = useNavigate();
  const projectMetadata = useSelector((state) => state.project.selectedProject);
  const dispatch = useDispatch();
  const isAdmin = projectMetadata.role === "admin";
  const collections = useSelector((state) => state.collections.collections); // Get collections from Redux store

  useEffect(() => {
    // Check if collections are already fetched or empty before triggering fetch
    if (collections && collections.length > 0) {
      return; // Collections already exist, so do not call fetchCollections again
    }

    const initializeCollections = async () => {
      dispatch(fetchCollectionsRequest());
      try {
        const result = await fetchCollections();
        dispatch(fetchCollectionsSuccess(result));
      } catch (error) {
        dispatch(fetchCollectionsFailure());
        console.error("Error fetching collections", error);
      }
    };

    initializeCollections();

  }, [dispatch, fetchCollectionsSuccess]);

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
      try {
        const res = await callAPI(BACKEND_ENDPOINTS.user.project.info, "PATCH", { new_project_name: projectName }, true);
        if (res) {
          dispatch(updateProjectName(projectName));
          console.log('Project name changed to:', projectName);
        }
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
        <Grid container spacing={3} sx={{ height: '100%' }}>
          <Grid item xs={12} sm={7} sx={{ height: '100%' }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3, height: '100%' }}>
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
              {projectMetadata.owner &&
                <Typography variant="body1" color="textSecondary" paddingBottom={"0.75rem"}>
                  <div><strong>Project Owner:</strong> {projectMetadata.owner}</div>
                </Typography>
              }
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
          <Grid item xs={12} sm={5} sx={{ height: '100%' }}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, height: '100%' }}>
              {/* Wrapper Box for horizontal alignment */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" color="primary">
                  API Programming Guide
                </Typography>
                {/* Python SDK Button */}
                <Button
                  variant="text"
                  startIcon={<FileCopy />}
                  sx={{
                    color: 'blue',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => window.open('https://dn2803.github.io/doc-for-face-service/', '_blank')}
                >
                  <Typography variant="h5">Python SDK</Typography>
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.55rem' }}>
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  API Developer Key
                </Typography>
                <Typography variant="body1">
                  <ApiKeyDisplay apiKey={projectMetadata.api} numDisplay={16} />
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>




        {/* Plan Details and Days Remaining */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body1">
              Current plan: <strong>30 Day Trial</strong>
            </Typography>
            <Typography variant="body1">License expiry: 15 Nov 2024 (UTC +07:00)</Typography>
            <Typography variant="h2" color="error" sx={{ marginTop: 2 }}>
              {remainDays(projectMetadata.exp)}
            </Typography>
            <Typography variant="body1" color="error">
              Days remaining
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Upgrade Plan
            </Button>
          </Paper>
        </Grid>



        {/* Credit Usage Section */}
        <Grid item xs={12} sm={8}>
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
