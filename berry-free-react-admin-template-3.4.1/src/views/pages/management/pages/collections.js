import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, IconButton } from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClipLoader } from 'react-spinners';
import DialogForm from '../DialogForm';
import CollectionForm from '../forms/collection-form';
import { BACKEND_ENDPOINTS } from 'services/constant';
import { useCallAPI } from 'hooks/useCallAPI';
import { useFetchCollections } from 'hooks/useFetchCollections';
import { useNavigate } from 'react-router-dom';
const CollectionManagement = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editCollection, setEditCollection] = useState(null);
    const [collections, setCollections] = useState([]);
    const { callAPI } = useCallAPI();
    const { fetchCollections } = useFetchCollections();
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [itemsPerPage] = useState(5); // Số mục hiển thị trên mỗi trang
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCollections = async () => {
            try {
                const result = await fetchCollections(); // Fetch collections from database
                setCollections(result);
            } catch (error) {
                console.error("Error fetching collections", error);
            } finally {
                setLoading(false);
            }
        };
        getCollections();
    }, []);



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
        const body = {
            name: values.name,
            description: values.description
        }
        if (editCollection) {
            await callAPI(BACKEND_ENDPOINTS.project.collection, "PATCH", body, true);
        }
        else {
            await callAPI(BACKEND_ENDPOINTS.project.collection, "POST", body, true)
        }
        handleClose(); // Close dialog after submission
    };
    const onEdit = (id) => {
        const collectionToEdit = collections.find((collection) => collection.id === id);
        if (collectionToEdit) {
            setEditCollection(collectionToEdit); 
            setOpen(true);  
        }
    }
    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this person?")) {
            try {
                await callAPI(`${BACKEND_ENDPOINTS.project.collection}`, "DELETE", { id: id }, true);
                setCollections((prev) => prev.filter((collection) => collection.id !== id)); // Remove deleted item from state
            } catch (error) {
                console.error("Error deleting collection", error);
            }
        }
        
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCollections = collections.slice(indexOfFirstItem, indexOfLastItem);

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
            <DialogForm open={open} onClose={handleClose} title={editCollection ? "Edit collection details" : "Add collection details"}>
                <CollectionForm onSubmit={handleSubmit} collection={editCollection} />
            </DialogForm>
            {/* Table Section */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#a61d24' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>Collection Name </TableCell>
                            <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Description </TableCell>
                            {/* <TableCell sx={{ color: '#fff' }}>Person in this collection</TableCell> */}
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && <ClipLoader size={50} color={"#123abc"} />}
                        {currentCollections.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No Collection Found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentCollections.map((collection) => (
                                <TableRow key={collection.id}>
                                    <TableCell onClick={() => navigate('/pages/collection/poi-management', {state: {collection: collection}})}>{collection.name}</TableCell>
                                    <TableCell>{collection.id}</TableCell>
                                    <TableCell>{collection.description}</TableCell>
                                    <TableCell>
                                        {/* Kiểm tra nếu collection.name là "Base", không hiển thị nút Edit và Delete */}
                                        {collection.name !== "Base" && (
                                            <>
                                                {/* Nút Sửa */}
                                                <IconButton onClick={() => onEdit(collection.id)} color="primary">
                                                    <EditIcon />
                                                </IconButton>

                                                {/* Nút Xóa */}
                                                <IconButton onClick={() => onDelete(collection.id)} color="secondary">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Pagination
                    count={Math.ceil(collections.length / itemsPerPage)} // Tổng số trang
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)} // Cập nhật trang
                    color="primary"
                />
            </TableContainer>
        </Box >
    );
};

export default CollectionManagement;
