import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogForm from '../DialogForm';
import DeveloperForm from '../forms/developer-form';
import ApiKeyDisplay from 'ui-component/APIKeyDisplay';
import { useCallAPI } from 'hooks/useCallAPI';

const DeveloperManagement = () => {
    const { callAPI } = useCallAPI();
    const admin_info = useSelector(state => state.auth);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [developers, setDevelopers] = useState([]); 
    const [editDeveloper, setEditDeveloper] = useState(null);
    // Function to handle dialog open
    const handleOpen = () => {
        setEditDeveloper(null)
        setOpen(true);
    };

    // Function to handle dialog close
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (values) => {
        // Handle the form submission logic here
        const body = {
            "dev-email": values.email,
            "scopes": values.collection_id
        }
        if (editDeveloper) {
            await callAPI(BACKEND_ENDPOINTS.project.team, "PATCH", body, true);
        }
        else {
            await callAPI(BACKEND_ENDPOINTS.project.team, "POST", body, true)
        }
        handleClose(); // Close dialog after submission
    };
    const onEdit = (developerToEdit) => {
        if ( developerToEdit) {
            setEditCollection(collectionToEdit);
            setOpen(true);
        }
    }
    const onDelete = async (deletedDeveloper) => {
        if (window.confirm("Are you sure you want to delete this developer?")) {
            const param = {
                'dev-key': deletedDeveloper.key
            }
            try {
                await callAPI(`${BACKEND_ENDPOINTS.project.team}`, "DELETE", true, null, param);
                setDevelopers((prev) => prev.filter((developer) => developer.key !== deletedDeveloper.key)); // Remove deleted item from state
            } catch (error) {
                console.error("Error deleting developer", error);
            }
        }

    };


    return (
        <Box sx={{ padding: '20px' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Chuyển sang cột trên thiết bị nhỏ
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}>

                {/* Header Section */}
                <Box
                    sx={{
                        flex: { xs: '0 0 100%', md: '0 0 50%' }, // Chiếm 100% trên thiết bị nhỏ và 30% trên thiết bị lớn
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        marginBottom: '20px',
                    }}
                >
                    <Typography variant="h5">Developers</Typography>
                    <Typography variant="body2">Build a team of Developers by adding them here</Typography>
                </Box>

                {/* Search bar and buttons */}
                <Box
                    sx={{
                        flex: { xs: '0 0 100%', md: '0 0 50%' }, // Chiếm 100% trên thiết bị nhỏ và 70% trên thiết bị lớn
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                        alignItems: 'flex-start',
                        marginBottom: '20px',
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Search ..."
                        size="small"
                        InputProps={{
                            endAdornment: <SearchIcon />,
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Box>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<AdminPanelSettingsIcon />}
                            sx={{ marginRight: '10px' }}
                            onClick={handleOpen}
                        >
                            Add Developer
                        </Button>
                    </Box>
                </Box>
            </Box>
            <DialogForm open={open} onClose={handleClose} title="Add Developer details">
                <DeveloperForm onSubmit={handleSubmit} />
            </DialogForm>
            {/* Table Section */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#a61d24' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>Name </TableCell>
                            <TableCell sx={{ color: '#fff' }}>Organizational Email</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Assigned Collection</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Last Used</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell><ApiKeyDisplay apiKey={admin_info.apiKey}/></TableCell>
                            <TableCell>{admin_info.user.username}</TableCell>

                        </TableRow>
                        {developers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No Developer Found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            developers.map((developer, index) => (
                                <TableRow key={index}>
                                    <TableCell><ApiKeyDisplay apiKey={developer.key}/></TableCell>
                                    <TableCell>{developer.email}</TableCell>
                                    <TableCell>{developer.collections}</TableCell>
                                    <TableCell> {developer.lastUsed} </TableCell>
                                    <TableCell> {/* Nút Sửa */}
                                        <IconButton onClick={() => onEdit(developer)} color="primary">
                                            <EditIcon />
                                        </IconButton>

                                        {/* Nút Xóa */}
                                        <IconButton onClick={() => onDelete(developer)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton> 
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );
};

export default DeveloperManagement;
