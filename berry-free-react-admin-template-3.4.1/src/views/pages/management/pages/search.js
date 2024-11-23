import React, { useState } from 'react';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DialogForm from '../DialogForm';
import { useCallAPI } from 'hooks/useCallAPI';
import FaceSearchForm from '../forms/face-search-form';
import { BACKEND_ENDPOINTS } from 'services/constant';

const SearchManagement = () => {
    const { callAPI } = useCallAPI();

    const [search, setSearch] = useState('');
    const [openSeach, setOpenSearch] = useState(false);
    const [persons, setPersons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage] = useState(5); 



    // Function to handle dialog open
    const handleOpenSearch = () => {
        setOpenSearch(true);
    };
    // Function to handle dialog close
    const handleCloseSearch = () => {
        setOpenSearch(false);
    };
    const handleSearchFace = async (values) => {
        console.log(values);
        const body = {
            collection_id: parseInt(values.collection_id,10),
            image: values.image,
            limit: parseInt(values.limit, 10),
            score: values.confidence_score,
        }
        console.log(body);
        const response = await callAPI(BACKEND_ENDPOINTS.project.search, "POST", body, true);
        console.log(response);
        setPersons(response.data.result);
        handleCloseSearch();
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPersons = persons.slice(indexOfFirstItem, indexOfLastItem);
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
                    <Typography variant="h5">Searchs</Typography>
                    <Typography variant="body2">Only show face search results by collection</Typography>
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

                        <Button variant="contained" color="error" startIcon={<SearchIcon />} onClick={handleOpenSearch} >
                            Face Search
                        </Button>

                    </Box>
                </Box>
            </Box>

            <DialogForm open={openSeach} onClose={handleCloseSearch} title="Search Face">
                <FaceSearchForm onSubmit={handleSearchFace} />
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
                        {currentPersons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No Person Found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPersons.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>
                                        <img src={person.images[0]} alt={person.id} width="24" height="24" style={{ borderRadius: '50%' }} /> </TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.birth}</TableCell>
                                    <TableCell>{person.nationality}</TableCell>
                                    <TableCell>{person.updated_at}</TableCell>
                                    <TableCell>{person.collection_id}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Pagination
                    count={Math.ceil(persons.length / itemsPerPage)} // Tổng số trang
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)} // Cập nhật trang
                    color="primary"
                />
            </TableContainer>
        </Box >
    );
};

export default SearchManagement;
