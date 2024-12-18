import React, { useState } from 'react';
// material-ui
import { Grid, Divider, Box, Button, Typography } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
// project imports
import MainCard from 'ui-component/cards/MainCard';

import AnimateButton from 'ui-component/extended/AnimateButton';
import { ClipLoader } from 'react-spinners';

// Image 
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageUpload from 'ui-component/ImageUpload';

import trueImage from 'assets/images/checked1.png'
import falseImage from 'assets/images/wrong.png'


import liveness_demo_img from 'assets/images/data_test_image/liveness';
import { useCallAPI } from 'hooks/useCallAPI';
import { convertAndCacheImage } from 'utils/imageCache'
import { BACKEND_ENDPOINTS } from 'services/constant';
// ==============================|| SAMPLE PAGE ||============================== //

const FaceLivenessPage = () => {
    const { callAPI } = useCallAPI();

    const [uploadedImage, setUploadedImage] = useState(null);
    const [approved, setApproved] = useState(false);
    const [result, setResult] = useState(false);
    const [score, setScore] = useState(0)

    const [isLoading, setIsLoading] = useState(false); 
    const handleLiveness = async (imageData) => {
        // Bắt đầu trạng thái loading
        setIsLoading(true);
        try {
            const response = await callAPI(BACKEND_ENDPOINTS.demo_function.liveness, "POST", { image: imageData });
            if (response) {
                console.log(response.data);
                setResult(true);
                setApproved(response.data["result"]["is_real"] );
                setScore(parseFloat(response.data["result"]["antispoof_score"].toFixed(2)));
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response.data.error);
            setResult(true);
            setApproved(false);
            setScore(0);
        } finally {
            // Kết thúc trạng thái loading
            setIsLoading(false);
        }
    };
    const handleReset = () => {
        // Reset the uploaded image to allow re-upload
        setUploadedImage(null)
        setApproved(false)
        setResult(false)
        setScore(0)
    };
    return (
        <>
            <MainCard title="Liveness Demo">
                <Grid item>
                    <MuiTypography variant="body1" gutterBottom>
                        Welcome to our liveness demo, where we feature our advanced technology that addresses the need for fraud prevention and security in diverse applications. Our liveness feature enables the verification of live human presence, providing assurance that the person in front of the camera is not a still image or pre-recorded video.
                    </MuiTypography>
                </Grid>
            </MainCard>

            <MainCard sx={{ padding: 4 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 4, md: 6 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <MuiTypography variant="subtitle1" gutterBottom> Step 1</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            Select from the following sample image below to verify if they are real or spoofing images.
                        </MuiTypography>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ImageList sx={{ width: '80%', height: 450 }} cols={3} rowHeight={164}>
                                {
                                    liveness_demo_img.map((item) => {
                                        convertAndCacheImage(item.path);
                                        const cachedImageSrc = sessionStorage.getItem(item.path) || item.path;
                                        return (
                                            <ImageListItem key={item.img} onClick={() => handleLiveness(cachedImageSrc)}
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
                                            </ImageListItem>
                                        )
                                    })}
                            </ImageList>
                        </Box>
                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    <Grid item xs={12} sm={6} md={5}>
                        <MuiTypography variant="subtitle1" gutterBottom> Liveness Result</MuiTypography>
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
                                {/* Hiển thị trạng thái loading */}
                                {isLoading && <ClipLoader size={50} color={"#123abc"} />}
                                {result && (approved ?
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
                                            style={{
                                                color: '#008000',      // Màu chữ xanh
                                                fontWeight: 'bold',    // Chữ đậm
                                                marginBottom: '20px'   // Khoảng cách dưới
                                            }}
                                        >
                                            Liveness passed,  score: {score}
                                        </Typography>
                                        <img
                                            src={trueImage}
                                            alt=''
                                            style={{
                                                width: '150px',        // Chiều rộng ảnh
                                                height: '150px',       // Chiều cao ảnh
                                                objectFit: 'cover',    // Cắt ảnh vừa khung
                                                borderRadius: '50%'    // Bo tròn ảnh
                                            }}
                                        />
                                    </div>) : (<div
                                        className='no-match'
                                        style={{
                                            backgroundColor: '#ffe0e0', // Màu nền đỏ nhạt
                                            padding: '20px',           // Khoảng cách bên trong
                                            borderRadius: '10px',      // Bo góc
                                            textAlign: 'center'        // Canh giữa nội dung
                                        }}
                                    >
                                        <Typography
                                            variant='h2'
                                            style={{
                                                color: '#ff0000',      // Màu chữ đỏ
                                                fontWeight: 'bold',    // Chữ đậm
                                                marginBottom: '20px'   // Khoảng cách dưới
                                            }}
                                        >
                                            Spoofing detected, score: {score}
                                        </Typography>
                                        <img
                                            src={falseImage}
                                            alt=''
                                            style={{
                                                width: '150px',        // Chiều rộng ảnh
                                                height: '150px',       // Chiều cao ảnh
                                                objectFit: 'cover',    // Cắt ảnh vừa khung
                                                borderRadius: '50%'    // Bo tròn ảnh
                                            }}
                                        />
                                    </div>))}
                                {
                                    !result && (<ImageUpload handleUpload={handleLiveness} uploadedImage={uploadedImage} sizeAccept={{ width: 800, height: 800 }} />)
                                }
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

export default FaceLivenessPage;