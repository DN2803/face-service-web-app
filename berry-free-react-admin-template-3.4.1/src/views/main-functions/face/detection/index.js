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


import detection_demo_img from 'assets/images/data_test_image/detection'
import { callAPI } from 'utils/api_caller';
// ==============================|| SAMPLE PAGE ||============================== //

const FaceDetectionPage = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageResult, setImageResult] = useState(null);
    const [numPeople, setNumPeople] = useState("0");
    // list Image Sample 
    const convert2base64 = async (file) => {
        // Kiểm tra xem có tệp không và xem nó có phải là Blob không
        const fullPath = `${window.location.origin}${file}`;
        try {
            const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const blob = await response.blob(); // Chuyển đổi phản hồi thành Blob
            const reader = new FileReader();
    
            reader.onloadend = () => {
                const base64data = reader.result; // Dữ liệu hình ảnh ở dạng base64
                // Ở đây bạn có thể thêm logic xử lý dữ liệu base64
                handleDetection(base64data)
            };
    
            // Bắt đầu đọc Blob dưới dạng base64
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }
    
    const handleDetection = async (imageData) => {
        
        console.log('Image Data (base64):', imageData);

        // You can add your own logic here, such as:
        // 1. Uploading to a server

        try {
            const response = await callAPI("/demo-detection", "POST", {image: imageData})
            // const data = await response.data;
            if (response) {
                // setNumPeople(data.numPeople.toString());
                // setImageResult(data.resultImage);
            }
            else {
                console.error("Erorr")
            }
        }
        catch {
            console.error("Erorr")
        }
       
        // 2. Storing the file for later use
        // 3. Triggering another event
        const detectedPeopleCount = Math.floor(Math.random() * 10); // Replace with actual face detection logic
        setNumPeople(detectedPeopleCount.toString());
        // Create a white image in base64 format and set it
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const whiteImageData = canvas.toDataURL(); // Get base64 of the white image
        setImageResult(whiteImageData)
        console.log(imageResult)
    };
    const handleReset = () => {
        // Reset the uploaded image to allow re-upload
        setUploadedImage(null);
        setImageResult(null);
    };
    return (
        <>
            <MainCard title="Face Detection Demo">
                <Grid item>
                    <MuiTypography variant="body1" gutterBottom>
                        Face Detection allows you to find faces in an image. Along with the position of the faces, Face Detection also provides key points (eyes, nose, mouth) for each face.
                    </MuiTypography>
                </Grid>
            </MainCard>

            <MainCard sx={{ padding: 4 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 4, md: 6 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <MuiTypography variant="subtitle1" gutterBottom> Step 1</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            Select from the following sample or upload your own image
                        </MuiTypography>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ImageList sx={{ width: '80%', height: 450 }} cols={3} rowHeight={164}>
                                {detection_demo_img.map((item) => (
                                    <ImageListItem key={item.img} onClick={() => convert2base64(item.path)}
                                    style={{
                                        border: '1px solid #ccc', // Đường viền
                                        borderRadius: '8px', // Góc bo tròn
                                        overflow: 'hidden', // Ẩn phần ảnh bị tràn
                                        cursor: 'pointer', // Đổi con trỏ khi di chuột
                                        transition: 'transform 0.2s', // Hiệu ứng khi hover
                                      }}>
                                        <img
                                            srcSet={`{${item.path}}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            src={item.path}
                                            alt={item.title}
                                            loading="lazy"
                                            
                                        // onClick={() => setUploadedImage(item.img)}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    <Grid item xs={12} sm={6} md={5}>
                        <MuiTypography variant="subtitle1" gutterBottom> Result</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            {numPeople === "0"
                                ? "No people detected."
                                : `There are ${numPeople} people detected.`}
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
                                <>
                                    {imageResult ? (
                                        <ImageListItem src={imageResult} />
                                    ) : (
                                        <ImageUpload
                                            handleUpload={handleDetection}
                                            uploadedImage={uploadedImage}
                                            sizeAccept={{ width: 800, height: 800 }}
                                        />
                                    )}
                                </>

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

export default FaceDetectionPage;