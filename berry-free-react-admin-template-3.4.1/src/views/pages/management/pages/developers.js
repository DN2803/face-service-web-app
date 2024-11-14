import React, { useState } from 'react';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import DialogForm from '../DialogForm';
import DeveloperForm from '../forms/developer-form';

const DeveloperManagement = () => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const developers = []; // For demonstration, no collection are added, which will display the "No Collection Found" message.
    // Function to handle dialog open
    const handleOpen = () => {
        setOpen(true);
    };

    // Function to handle dialog close
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (values) => {
        // Handle the form submission logic here
        console.log(values);
        handleClose(); // Close dialog after submission
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
                <DeveloperForm onSubmit={handleSubmit}/>
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
                        {developers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No Developer Found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            developers.map((developer) => (
                                <TableRow key={developer.id}>
                                    <TableCell>{developer.name}</TableCell>
                                    <TableCell>{developer.email}</TableCell>
                                    <TableCell>{developer.collections}</TableCell>
                                    <TableCell> {developer.lastUsed} </TableCell>
                                    <TableCell> {/* Add action buttons here */} </TableCell>
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
