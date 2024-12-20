import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import {
    Button,
    TextField,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Pagination,
    IconButton
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import DialogForm from '../DialogForm';
import PersonForm from '../forms/person-form';
import FaceSearchForm from '../forms/face-search-form';
import { useCallAPI } from 'hooks/useCallAPI';
import { BACKEND_ENDPOINTS } from 'services/constant';
const PersonCollectionManagement = () => {
    const { callAPI } = useCallAPI();
    const location = useLocation();
    // States for managing persons and UI behaviors
    const [search, setSearch] = useState('');
    const [openSearch, setOpenSearch] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [editPerson, setEditPerson] = useState(null);
    const [persons, setPersons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const collection = location.state.collection || null;
    const [itemsPerPage] = useState(10); // Số mục hiển thị trên mỗi trang
    const [numPerson, setNumPerson] = useState(0);
    const [lastIDs, setLastIDs] = useState([]);
    const waitResponseRef = useRef(false);

    useEffect(() => {
        const loadPersonsForPage = async () => {
            try {
                console.log(currentPage);
                // Lấy lastID của trang hiện tại (trang đầu tiên là 0)
                const lastID = lastIDs[currentPage - 2] || null;

                // Tạo query params cho API
                const queryParams = {
                    collection_ids: collection.id,
                    limit: itemsPerPage,
                    ...(lastID && {last_id: lastID}) // Thêm lastID vào query để lấy người tiếp theo
                };
                waitResponseRef.current = true;

                // Gọi API để lấy dữ liệu cho trang hiện tại
                const response = await callAPI(`${BACKEND_ENDPOINTS.project.persons}`, "GET", null, true, null, queryParams);
                if (response.data.persons.length === 0) {
                    console.log("No more persons to load.");
                    return;
                }
                if (!lastIDs[currentPage - 1]){
                    setNumPerson(numPerson + response.data.count);
                }
                
                //setPersons((prevPersons) => [...prevPersons, ...response.data.persons]);
                setPersons (response.data.persons)
                // Cập nhật lastID của trang hiện tại
                setLastIDs((prevLastIDs) => {
                    const newLastIDs = [...prevLastIDs];
                    newLastIDs[currentPage - 1] = response.data.persons[response.data.persons.length - 1]?.id || null;
                    return newLastIDs;
                });

            } catch (error) {
                console.error("Error loading persons for page", error);
            } finally {
                waitResponseRef.current = false;
            }
        };

        if (currentPage > 0 && !waitResponseRef.current) {
            loadPersonsForPage();
        }
    }, [currentPage, itemsPerPage]); // Theo dõi currentPage, collections, loading và lastIDs

    const goToNextPage = (event, value) => {
        setCurrentPage(value); // Cập nhật trang
      };
    

    // Convert image file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };


    const handleOpenSearch = () => {
        setOpenSearch(true);
    };

    const handleCloseSearch = () => {
        setOpenSearch(false);
    };
    const handleOpenAdd = () => {
        setEditPerson(null);
        setOpenAdd(true);
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

    const handleSearchFace = async (values) => {
        console.log("Searching face with values:", values);
        const body = {
            collection_id: parseInt(values.collection_id, 10),
            image: values.image,
            max_results: parseInt(values.limit, 10),
            score: values.confidence_score,
        }
        const respone = await callAPI(BACKEND_ENDPOINTS.project.search, "POST", body, true);

        if (respone) {
            // setSearchResult(respone.data.result);
            console.log(respone.data);
        }

        handleCloseSearch();
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h5">Persons of Collection {collection.name}</Typography>
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
                        {/* {searchResult.length !== 0 && (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<PersonAddIcon />}
                                sx={{ marginRight: '10px' }}
                                onClick={removeResult}
                            >
                                Search Result
                            </Button>
                        )} */}

                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<PersonAddIcon />}
                            sx={{ marginRight: '10px' }}
                            onClick={handleOpenAdd}
                        >
                            Add Person
                        </Button>
                        <Button variant="contained" color="error" startIcon={<SearchIcon />} onClick={handleOpenSearch} >
                            Face Search
                        </Button>

                    </Box>
                </Box>
            </Box>
            {/* Dialogs */}
            <DialogForm open={openAdd} onClose={handleCloseAdd} title={editPerson ? "Edit Person" : "Add Person"}>
                <PersonForm onSubmit={handleSubmit} person={editPerson} />
            </DialogForm>
            <DialogForm open={openSearch} onClose={handleCloseSearch} title="Search Face">
                <FaceSearchForm onSubmit={handleSearchFace} />
            </DialogForm>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#a61d24' }}>
                        <TableRow>
                            {["Photo", "Name", "ID", "Birthday", "Nationality", "Modified Date", "Actions"].map((head) => (
                                <TableCell key={head} sx={{ color: '#fff' }}>{head}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {persons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No persons found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            persons.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>
                                        <img src={person.images[0].img_url} alt={person.id} width="24" height="24" style={{ borderRadius: '50%' }} /> </TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.birth}</TableCell>
                                    <TableCell>{person.nationality}</TableCell>
                                    <TableCell>{person.updated_at}</TableCell>
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
                    count={numPerson % 5 == 0? Math.ceil(numPerson / itemsPerPage) + 1 : Math.ceil(numPerson / itemsPerPage)}
                    page={currentPage}
                    onChange={goToNextPage} // Cập nhật trang
                    color="primary"
                />
            </TableContainer>
        </Box >
    );
};

export default PersonCollectionManagement;
