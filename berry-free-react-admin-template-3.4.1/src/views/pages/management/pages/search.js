import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DialogForm from '../DialogForm';
import { useCallAPI } from 'hooks/useCallAPI';
import FaceSearchForm from '../forms/face-search-form';
import PersonForm from '../forms/person-form';
import { BACKEND_ENDPOINTS } from 'services/constant';

const SearchManagement = () => {
    const { callAPI } = useCallAPI();

    const [search, setSearch] = useState('');
    const [openSeach, setOpenSearch] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [persons, setPersons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage] = useState(5); 
    const [editPerson, setEditPerson] = useState(null);

    const collections = useSelector((state) => state.collections.collections);
    const collectionMap = collections.reduce((map, collection) => {
        map[collection.id] = collection.name;
        return map;
    }, {});
    // Function to handle dialog open
    const handleOpenSearch = () => {
        setOpenSearch(true);
    };
    // Function to handle dialog close
    const handleCloseSearch = () => {
        setOpenSearch(false);
    };
    const handleSearchFace = async (values) => {
        const body = {
            collection_ids: values.collection_id,
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

    // Convert image file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };
    // Handle add/edit submission
    const handleSubmit = async (values) => {
        try {
            values.images = await Promise.all(values.images.map(convertToBase64));
            if (editPerson) {
                const body = {
                    name: values.name,
                    nationality: values.nationality,
                    birth: values.dob,
                    new_images: values.images,
                    old_collection_id: editPerson.collection_id,
                    collection_id: values.collection_id,
                    removed_image_ids: values.removeImageIDs
                }
                const response = await callAPI(`${BACKEND_ENDPOINTS.project.person}/${editPerson.id}`, "PATCH", body, true)
                
                setPersons((prevPersons) => {
                    const newPersons = [...prevPersons];
                    const index = newPersons.findIndex(person => person.id === editPerson.id);
                    if (index !== -1) {
                        newPersons[index] = response.data.person;
                    }
                    return newPersons;  // Return the updated array
                });
            }
            else {
                const body = {
                    name: values.name,
                    nationality: values.nationality,
                    birth: values.dob,
                    images: values.images,
                    collection_id: values.collection_id,
                };
                await callAPI(BACKEND_ENDPOINTS.project.person, "POST", body, true)
            }
            handleCloseAdd();
        } catch (error) {
            console.error("Error submitting person", error);
            alert(error.response.data.error);
            setOpenAdd(false);
        }
    };

    const handleEdit = (id) => {
        const person = persons.find((p) => p.id === id);
        if (person) {
            setEditPerson(person);
            setOpenAdd(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this person?")) {
            try {
                const person = persons.find((p) => p.id === id);
                await callAPI(`${BACKEND_ENDPOINTS.project.person}/${id}`, "DELETE", {}, true, null, { collection_id: person.collection_id });
                setPersons((prev) => prev.filter((p) => p.id !== id));
            } catch (error) {
                console.error("Error deleting person", id, error);
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
            <DialogForm open={openAdd} onClose={handleCloseAdd} title={editPerson ? "Edit Person" : "Add Person"}>
                <PersonForm onSubmit={handleSubmit} person={editPerson} />
            </DialogForm>
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
                                        <img src={person.images[0].img_url} alt={person.id} width="24" height="24" style={{ borderRadius: '50%' }} />
                                    </TableCell> 
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.birth}</TableCell>
                                    <TableCell>{person.nationality}</TableCell>
                                    <TableCell>{person.updated_at}</TableCell>
                                    <TableCell>{collectionMap[person.collection_id]}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(person.id)}><EditIcon /></IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(person.id)}><DeleteIcon /></IconButton>
                                    </TableCell>
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
