import React, { useState } from 'react';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import SearchIcon from '@mui/icons-material/Search';
import DialogForm from '../DialogForm';
import CollectionForm from '../forms/collection-form';

const CollectionManagement = () => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const collections = []; // For demonstration, no collection are added, which will display the "No Collection Found" message.
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
                    <Typography variant="h5">Collections</Typography>
                    <Typography variant="body2">Group persons into collections</Typography>
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
                            startIcon={<FolderSharedIcon />}
                            sx={{ marginRight: '10px' }}
                            onClick={handleOpen} 
                        >
                            Add Collection
                        </Button>
                    </Box>
                </Box>
            </Box>
            <DialogForm open={open} onClose={handleClose} title="Add person details">
                <CollectionForm onSubmit={handleSubmit}/>
            </DialogForm>
            {/* Table Section */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#a61d24' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>Collection Name </TableCell>
                            <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Description </TableCell>
                            <TableCell sx={{ color: '#fff' }}>Person in this collection</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {collections.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No Collection Found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            collections.map((collection) => (
                                <TableRow key={collection.id}>
                                    <TableCell>{collection.name}</TableCell>
                                    <TableCell>{collection.id}</TableCell>
                                    <TableCell>{collection.description}</TableCell>
                                    <TableCell> {/* number of persion here */} </TableCell>
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

export default CollectionManagement;
