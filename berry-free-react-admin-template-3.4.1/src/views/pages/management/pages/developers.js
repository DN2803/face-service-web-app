import React, { useEffect, useState } from 'react';
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
import { BACKEND_ENDPOINTS } from 'services/constant';
const DeveloperManagement = () => {
    const { callAPI } = useCallAPI();
    const admin_info = useSelector(state => state.auth);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [developers, setDevelopers] = useState([]);
    const [editDeveloper, setEditDeveloper] = useState(null);
    const collections = useSelector((state) => state.collections.collections);
    const collectionMap = collections.reduce((map, collection) => {
        map[collection.id] = collection.name;
        return map;
    }, {});
    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const res = await callAPI(`${BACKEND_ENDPOINTS.user.project.team}`, "GET", null, true);
                console.log(res);
                if (res && res.data) {

                    setDevelopers(res.data.team || []);
                }
            } catch (error) {
                console.error("Error fetching developers", error);
            }
        };

        fetchDevelopers();
    }, []);

    const handleOpen = () => {
        setEditDeveloper(null)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (values) => {
        try {
            if (editDeveloper) {
                // TODO: Update develop feature
                const newScope = new Set(values.collection_id);
                const oldScope = new Set(JSON.parse(editDeveloper.scope));
                const body = {
                    dev_key: editDeveloper.key, 
                    scope: {
                        'new_col_ids': [...newScope.difference(oldScope)],
                        'removed_col_ids': [...oldScope.difference(newScope)]
                       }
                }
                if (body.scope.new_col_ids.length === 0 && body.scope.removed_col_ids.length === 0) {
                    throw new Error("new_col_ids and removed_col_ids cannot both be empty.");
                }
                console.log(body);
                const res =  await callAPI(BACKEND_ENDPOINTS.user.project.team, "PATCH", body, true);
                setDevelopers(prevDevelopers =>
                    prevDevelopers.map(dev =>
                        dev.id === editDeveloper.id ? { ...dev, scope: JSON.stringify(res.data.new_scope) } : dev
                    )
                );
    
            }
            else {
                const body = {
                    "dev_token": values.devToken,
                    "scope": values.collection_id
                }
                const res = await callAPI(BACKEND_ENDPOINTS.user.project.team, "POST", body, true);
                console.log(res);
                if (res) {
                    const newDev =
                    {
                        key: res.data.dev_key,
                        name: values.devName,
                        email: values.email,
                        scope: values.collection_id
                    }
                    setDevelopers((prevDevelopers) => [...prevDevelopers, newDev]);
                }
            }
            handleClose();
        } catch (error){
            console.error("Error submiting developers", error);
            alert(error.response.data.error);
        }

    };
    const onEdit = (developerToEdit) => {
        if (developerToEdit) {
            setEditDeveloper(developerToEdit);
            setOpen(true);
        }
    }
    const onDelete = async (deletedDeveloper) => {
        if (window.confirm("Are you sure you want to delete this developer?")) {
            const param = {
                'dev_key': deletedDeveloper.key
            }
            try {
                await callAPI(`${BACKEND_ENDPOINTS.user.project.team}`, "DELETE", null, true, null, param);
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
                flexDirection: { xs: 'column', md: 'row' }, 
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
            <DialogForm open={open} onClose={handleClose} title={editDeveloper ? "Edit Developer Details" : "Add Developer Details"}>
                <DeveloperForm
                    onSubmit={handleSubmit}
                    developer={editDeveloper} 
                    developers={developers}// Nếu chỉnh sửa, truyền developer; nếu thêm, truyền null
                />
            </DialogForm>
            {/* Table Section */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#a61d24' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>API Key</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Name </TableCell>
                            <TableCell sx={{ color: '#fff' }}>Organizational Email</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Assigned Collection</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Last Used</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell><ApiKeyDisplay apiKey={admin_info.apiKey} /></TableCell>
                            <TableCell>{admin_info.user.username}</TableCell>
                            <TableCell>{admin_info.user.email}</TableCell>
                            <TableCell>All</TableCell>
                            <TableCell> </TableCell>
                            <TableCell> </TableCell>

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
                                    <TableCell><ApiKeyDisplay apiKey={developer.key} /></TableCell>
                                    <TableCell>{developer.name}</TableCell>
                                    <TableCell>{developer.email}</TableCell>
                                    <TableCell>{JSON.parse(developer.scope).map(id => collectionMap[id]) 
                                    .filter(Boolean)
                                    .join(', ')}</TableCell>
                                    <TableCell> {developer.lastUsed} </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => onEdit(developer)} color="primary">
                                            <EditIcon />
                                        </IconButton>

                                       
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
