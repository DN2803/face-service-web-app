import React, { useState } from 'react';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import DialogForm from '../DialogForm';
import PersonForm from '../forms/person-form';

const PersonManagement = () => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const persons = []; // For demonstration, no persons are added, which will display the "No Person Found" message.
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
                    <Typography variant="h5">Persons</Typography>
                    <Typography variant="body2">Register persons for Face Search</Typography>
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
                            startIcon={<PersonAddIcon />}
                            sx={{ marginRight: '10px' }}
                            onClick={handleOpen} 
                        >
                            Add Person
                        </Button>
                        <Button variant="contained" color="error" startIcon={<SearchIcon />}>
                            Face Search
                        </Button>
                    </Box>
                </Box>
            </Box>
            <DialogForm open={open} onClose={handleClose} title="Add person details">
                <PersonForm onSubmit={handleSubmit}/>
            </DialogForm>
            {/* Table Section */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#a61d24' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>Photo</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Date of Birth</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Nationality</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Modified Date</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Collection</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {persons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No Person Found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            persons.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell> {/* Add image here */} </TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.dob}</TableCell>
                                    <TableCell>{person.nationality}</TableCell>
                                    <TableCell>{person.modifiedDate}</TableCell>
                                    <TableCell>{person.collection}</TableCell>
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

export default PersonManagement;
