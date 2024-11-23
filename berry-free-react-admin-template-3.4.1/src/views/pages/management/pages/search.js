import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DialogForm from '../DialogForm';
import { useCallAPI } from 'hooks/useCallAPI';
import FaceSearchForm from '../forms/face-search-form';
import { BACKEND_ENDPOINTS } from 'services/constant';

const createData = async (id) => {
    try {
        const response = await callAPI(BACKEND_ENDPOINTS.project.person, "GET", { id }, true);
        if (response) {
            const { photo, name, dob, nationality, modifiedDate, collection } = response.data;
            return { photo, id, name, dob, nationality, modifiedDate, collection };
        }
        throw new Error("Invalid response from API");
    } catch (error) {
        console.error("Error fetching data for ID:", id, error);
        return null; // Trả về null nếu có lỗi
    }
};

const SearchManagement = () => {
    const { callAPI } = useCallAPI();

    const [search, setSearch] = useState('');
    const [openSeach, setOpenSearch] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const [persons, setPersons] = useState([]);
    const [allPersons, setAllPersons] = useState([]);

    useEffect(() => {
        const loadAllPersonID = async () => {
            try {
                const response = await callAPI(BACKEND_ENDPOINTS.project.person, "GET", {}, true);
                if (response) {
                    setAllPersons(response.data);
                }
            } catch (error) {
                console.error("Error loading all persons:", error);
            }
        };
        loadAllPersonID();
    }, [callAPI]);
    // Function to load persons from the server
    const loadPersons = async (page, rowsPerPage) => {
        // const data = await callAPI(BACKEND_ENDPOINTS.project.person, "GET", { pageIndex: page, maxCount: rowsPerPage });
        // Tính toán vị trí bắt đầu và kết thúc cho pagination
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        // Cắt mảng allPersons để lấy dữ liệu của trang hiện tại
        const currentPagePersons = allPersons.slice(startIndex, endIndex);

        // Hàm kiểm tra và tạo dữ liệu nếu cần
        const processedPersons = await Promise.all(
            currentPagePersons.map(async (person) => {
                const requiredFields = ["photo", "id", "name", "dob", "nationality", "modifiedDate", "collection"];
                const isValid = requiredFields.every((field) => field in person);

                if (!isValid) {
                    return await createData(person.id);
                }
                return person;
            })
        );

        setPersons(processedPersons.filter((person) => person !== null));
        // Cập nhật state
        setPersons(processedPersons);
        setTotalRows(allPersons.length); // Tổng số hàng
    };
    useEffect(() => {
        loadPersons(page, rowsPerPage);
    }, [page, rowsPerPage, allPersons]);
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
    // Function to handle dialog close
    const handleCloseSearch = () => {
        setOpenSearch(false);
    };
    const handleSearchFace = async (values) => {
        console.log(values);


        const body = {
            collection_id: parseInt(values.collection_id,10),
            image: values.image,
            max_results: parseInt(values.limit, 10),
            min_score: values.confidence_score,
        }
        console.log(body);
        // const response = await callAPI(BACKEND_ENDPOINTS.project.person, "POST", body, true);
        // console.log(response);
        handleCloseSearch();
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
                        {persons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No Person Found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            persons.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>
                                        <img src={person.photo} alt={person.id} width="24" height="24" style={{ borderRadius: '50%' }} /> </TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.dob}</TableCell>
                                    <TableCell>{person.nationality}</TableCell>
                                    <TableCell>{person.modifiedDate}</TableCell>
                                    <TableCell>{person.collection}</TableCell>
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

export default SearchManagement;
