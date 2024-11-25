import React, { useState } from 'react';
// material-ui
import { Grid, Divider, Box, Button, Typography } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
// project imports
import MainCard from 'ui-component/cards/MainCard';

import AnimateButton from 'ui-component/extended/AnimateButton';
import ImageUpload from 'ui-component/ImageUpload';
import { ClipLoader } from 'react-spinners';

// Image 
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


import search_demo_img from 'assets/images/data_test_image/search';
import { useCallAPI } from 'hooks/useCallAPI';
import { convertAndCacheImage } from 'utils/imageCache'
import { BACKEND_ENDPOINTS } from 'services/constant';
// ==============================|| SAMPLE PAGE ||============================== //

const FaceSearchPage = () => {
    const { callAPI } = useCallAPI();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const [result, setResult] = useState(null);
    const handleSearch = async (imageData) => {
        // Perform actions with the uploaded file or imageData (base64)
        const body = {
            collection_id: 0,
            image: imageData,
            limit: 1,
            score: 0.7,
        }
        try {
            setIsLoading(true);
            const response = await callAPI(BACKEND_ENDPOINTS.demo_function.search, "POST", body)
            if (response) {
                setResult({name: response.data.name, url: response.data.url})
            }
        } catch (error) {
            console.error("Error: ", error );
        } finally {
            setIsLoading(false);
        }
    };
    const handleReset = () => {
        // Reset the uploaded image to allow re-upload
        setUploadedImage(null);
    };
    return (
        <>
            <MainCard title="Face Search Demo">
                <Grid item>
                    <MuiTypography variant="body1" gutterBottom>
                        Face Search allows you to register Persons and subsequently search for a face amongst previously registered Persons. In the demo below, start by selecting one of the pre-registered Persons or upload your own image for one of the pre-registered celebrities shown below.
                    </MuiTypography>
                </Grid>
            </MainCard>

            <MainCard sx={{ padding: 4 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 4, md: 6 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <MuiTypography variant="subtitle1" gutterBottom> Step 1</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            Select from the following sample of registered person below or upload your own image.
                        </MuiTypography>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ImageList sx={{ width: '80%', height: 450 }} cols={3} rowHeight={164}>
                                {
                                    search_demo_img.map((item, index) => {
                                        convertAndCacheImage(item.path);
                                        const cachedImageSrc = sessionStorage.getItem(item.path) || item.path;
                                        return (
                                            <ImageListItem key={index} onClick={() => handleSearch(cachedImageSrc)}
                                                style={{
                                                    // border: '2px solid #cc0000', // Đường viền màu đỏ
                                                    // borderRadius: '10px', // Bo góc
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    padding: '8px',
                                                    margin: '8px',
                                                    transition: 'transform 0.2s',
                                                }}>
                                                <img

                                                    src={cachedImageSrc}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                                />
                                                <p style={{
                                                     marginTop: '8px', // Khoảng cách phía trên tên
                                                     textAlign: 'center',
                                                     fontSize: '14px',
                                                     fontWeight: 'bold',
                                                     color: '#333',
                                                }}>{item.title}</p>
                                            </ImageListItem>
                                        )
                                    })}
                            </ImageList>
                        </Box>
                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    <Grid item xs={12} sm={6} md={5}>
                        <MuiTypography variant="subtitle1" gutterBottom> Result</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            {"result here"}
                        </MuiTypography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%', // Ensure the Box takes full height
                            }}
                        >
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {isLoading && <ClipLoader size={50} color={"#123abc"} />}
                                {result && 
                                    (<div
                                        className='match'
                                        style={{
                                            backgroundColor: '#e0ffe0', // Màu nền xanh nhạt
                                            padding: '20px',           // Khoảng cách bên trong
                                            borderRadius: '10px',      // Bo góc
                                            textAlign: 'center'        // Canh giữa nội dung
                                        }}
                                    >
                                        <Typography
                                            variant='h2'
                                        >
                                        </Typography>
                                        {/* <img
                                            src={trueImage}
                                            alt=''
                                            style={{
                                                width: '150px',        // Chiều rộng ảnh
                                                height: '150px',       // Chiều cao ảnh
                                                objectFit: 'cover',    // Cắt ảnh vừa khung
                                                borderRadius: '50%'    // Bo tròn ảnh
                                            }}
                                        /> */}
                                    </div>)}
                            </Box>

                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <ImageUpload handleUpload={handleSearch} uploadedImage={uploadedImage} />
                                <Box sx={{ mt: 2, width: '75%' }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            fullWidth
                                            size="large"
                                            type="button"
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    )
};

export default FaceSearchPage;