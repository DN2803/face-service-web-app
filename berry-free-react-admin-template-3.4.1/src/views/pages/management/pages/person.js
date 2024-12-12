import React, { useState, useEffect, useRef } from 'react';
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
    IconButton,
    CircularProgress
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import DialogForm from '../DialogForm';
import PersonForm from '../forms/person-form';
import FaceSearchForm from '../forms/face-search-form';
import { useCallAPI } from 'hooks/useCallAPI';
import { BACKEND_ENDPOINTS } from 'services/constant';
const PersonManagement = () => {
    const { callAPI } = useCallAPI();

    // States for managing persons and UI behaviors
    const [search, setSearch] = useState('');
    const [openSearch, setOpenSearch] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [editPerson, setEditPerson] = useState(null);
    const [persons, setPersons] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [lastID, setLastID] = useState(null);
    const observerRef = useRef(null);
    const waitResponseRef = useRef(false);
    // const [searchResult, setSearchResult] = ([]);
    // TODO: add search result in this page, delete multible person

    const { collections, loading } = useSelector((state) => state.collections);
    const collectionMap = collections.reduce((map, collection) => {
        map[collection.id] = collection.name;
        return map;
    }, {});
    const loadPersons = async () => {
        if (loading || !hasMore) return;
        waitResponseRef.current = true;
        try {
            const queryParams = {
                collection_ids: collections.map((collection) => collection.id).join(','),
                limit: 10,
                ...(lastID && { last_id: lastID }),
            };

            const response = await callAPI(`${BACKEND_ENDPOINTS.project.persons}`, "GET", null, true, null, queryParams);
            console.log(response)
            if (response.data.persons.length === 0) {
                setHasMore(false); // Không còn dữ liệu để tải
            } else {
                setPersons((prev) => [...prev, ...response.data.persons]);
                setLastID(response.data.persons[response.data.persons.length - 1]?.id || null);
            }
        } catch (error) {
            console.error("Error loading persons", error);
            alert(error.response.data.error);
        } finally {
            waitResponseRef.current = false;
        }
    };

    useEffect(() => {
        if (!collections.length) return;

        loadPersons();
    }, [collections]);

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
                const res = await callAPI(BACKEND_ENDPOINTS.project.person, "POST", body, true)
                const newPerson = res.data.person_info
                setPersons((prevPersons) => [...prevPersons, newPerson]);
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

    const handleEdit = (person) => {
        if (person) {
            setEditPerson(person);
            setOpenAdd(true);
        }
    };

    const handleDelete = async (person) => {
        if (window.confirm("Are you sure you want to delete this person?")) {
            try {
                await callAPI(`${BACKEND_ENDPOINTS.project.person}/${person.id}`, "DELETE", {}, true, null, { collection_id: person.collection_id });
                setPersons((prev) => prev.filter((p) => p.id !== person.id));
            } catch (error) {
                console.error("Error deleting person", id, error);
            }
        }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
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
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table >
                    <TableHead sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#a61d24',
                        zIndex: 2
                    }}>
                        <TableRow>
                            {["Photo", "Name", "ID", "Birthday", "Nationality", "Collection", "Actions"].map((head) => (
                                <TableCell key={head} sx={{ color: '#fff' }}>{head}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {persons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>No persons found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            persons.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>
                                        <img src={person.images[0].img_url} alt={person.id} width="24" height="24" style={{ borderRadius: '50%' }} />
                                    </TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.birth}</TableCell>
                                    <TableCell>{person.nationality}</TableCell>
                                    <TableCell>{collectionMap[person.collection_id]}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(person)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(person)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        {waitResponseRef.current && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div ref={observerRef} style={{ height: "1px" }}></div>
        </Box >
    );
};

export default PersonManagement;
