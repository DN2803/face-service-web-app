import React, { useState } from 'react';
// material-ui
import { Grid, Divider, Box, Button } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
// project imports
import MainCard from 'ui-component/cards/MainCard';

import AnimateButton from 'ui-component/extended/AnimateButton';


// Image 
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageUpload from 'ui-component/ImageUpload';



import search_demo_img from 'assets/images/data_test_image/seach';
import { callAPI } from 'utils/api_caller';
import {convertAndCacheImage} from 'utils/imageCache'
import { BACKEND_ENDPOINTS } from 'services/constant';
// ==============================|| SAMPLE PAGE ||============================== //

const FaceSearchPage = () => {
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleSearch = (imageData) => {
        // Perform actions with the uploaded file or imageData (base64)
        console.log('Image Data (base64):', imageData);

        // You can add your own logic here, such as:
        // 1. Uploading to a server
        // 2. Storing the file for later use
        // 3. Triggering another event
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
                            search_demo_img.map((item) => {
                                convertAndCacheImage(item.path);
                                const cachedImageSrc = sessionStorage.getItem(item.path) || item.path;
                                return (
                                <ImageListItem key={item.img} onClick={() => handleSearch(cachedImageSrc)}
                                    style={{
                                        border: '1px solid #ccc', // Đường viền
                                        borderRadius: '8px', // Góc bo tròn
                                        overflow: 'hidden', // Ẩn phần ảnh bị tràn
                                        cursor: 'pointer', // Đổi con trỏ khi di chuột
                                        transition: 'transform 0.2s', // Hiệu ứng khi hover
                                      }}>
                                        <img
                                            
                                            src={cachedImageSrc}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                        <p>{item.title}</p>
                                </ImageListItem>
                                )})}
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