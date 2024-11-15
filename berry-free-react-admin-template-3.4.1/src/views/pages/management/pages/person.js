import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogForm from '../DialogForm';
import PersonForm from '../forms/person-form';
import { callAPI } from 'utils/api_caller';
import FaceSearchForm from '../forms/face-search-form';


function createData(photo, name, id, dob, nationality, modifiedDate, collection) {
    return {
      photo, 
      id,
      name,
      dob, 
      nationality, 
      modifiedDate,
      collection
    };
  }


  


const PersonManagement = () => {
    const [search, setSearch] = useState('');
    const [openSeach, setOpenSearch] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    const [editPerson, setEditPerson] = useState(null);
    // For demonstration, no persons are added, which will display the "No Person Found" message.

    // const [persons, setPersons] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const persons = [
        createData("photo1.jpg", "John Doe", "123", "1990-01-01", "American", "2023-11-13", "Art Collection"),
        createData("photo2.jpg", "Jane Smith", "124", "1985-05-12", "Canadian", "2023-11-12", "Book Collection"),
        createData("photo3.jpg", "Alice Johnson", "125", "1992-07-21", "British", "2023-11-11", "Music Collection"),
        createData("photo4.jpg", "Michael Brown", "126", "1988-03-15", "Australian", "2023-11-10", "Coin Collection"),
        createData("photo5.jpg", "Emma Wilson", "127", "1995-12-30", "New Zealander", "2023-11-09", "Stamp Collection")
    ];

    // Function to load persons from the server
    const loadPersons = async (page, rowsPerPage) => {
        const data = await callAPI("/get_persons", "GET", {pageIndex: page, maxCount: rowsPerPage });
        setPersons(data.persons);
        setTotalRows(data.totalCount);
    };
    useEffect(() => {
        loadPersons(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };
    // Function to handle dialog open
    const handleOpenSearch = () => {
        setOpenSearch(true);
    };
    const handleOpenAdd = () => {
        setEditPerson(null);
        setOpenAdd(true);
    };

    // Function to handle dialog close
    const handleCloseSearch = () => {
        setOpenSearch(false);
    };
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleSubmit = async (values) => {
        // Handle the form submission logic here
        console.log(values);
        handleCloseAdd(); // Close dialog after submission
    };
    const handleSearchFace = () => {
        console.log ("call backend")
        handleCloseSearch();
    }

    const onEdit = (id) => {
        const personToEdit = persons.find((person) => person.id === id);
        if (personToEdit) {
            setOpenAdd(true);  // Mở dialog "Add Person" nhưng sẽ dùng để chỉnh sửa
            // Truyền dữ liệu người dùng cần chỉnh sửa vào form
            setEditPerson(personToEdit); // Giả sử bạn đã tạo một state để lưu người dùng đang được chỉnh sửa
        }
    }

    const onDelete = async (id) => {
        try {
            // Gửi yêu cầu xóa người dùng từ API
            await callAPI(`/delete_person/${id}`, 'DELETE');
            
            // Sau khi xóa thành công, cập nhật lại danh sách người dùng
            loadPersons(page, rowsPerPage);
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    }
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
            <DialogForm open={openAdd} onClose={handleCloseAdd} title={editPerson ? "Edit person details" : "Add person details"}>
                <PersonForm onSubmit={handleSubmit} person={editPerson}/>
            </DialogForm>
            
            <DialogForm open={openSeach} onClose={handleCloseSearch} title="Search Face">
                <FaceSearchForm onSubmit={handleSearchFace}/>
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
                                    <TableCell> <img src={person.photo} alt={person.id} width="24" height="24" style={{ borderRadius: '50%' }} /> </TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.dob}</TableCell>
                                    <TableCell>{person.nationality}</TableCell>
                                    <TableCell>{person.modifiedDate}</TableCell>
                                    <TableCell>{person.collection}</TableCell>
                                    <TableCell> 
                                        {/* Nút Sửa */}
                                        <IconButton onClick={()=>onEdit(person.id)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        
                                        {/* Nút Xóa */}
                                        <IconButton onClick={() => onDelete(person.id)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
        </Box >
    );
};

export default PersonManagement;
