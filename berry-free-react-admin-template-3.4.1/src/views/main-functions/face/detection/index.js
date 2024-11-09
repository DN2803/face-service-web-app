import React, { useState, useEffect, useRef } from 'react';
// material-ui
import { Grid, Divider, Box, Button } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageUpload from 'ui-component/ImageUpload';
import detection_demo_img from 'assets/images/data_test_image/detection';
import { callAPI } from 'utils/api_caller';
import { convertAndCacheImage } from 'utils/imageCache';
import { BACKEND_ENDPOINTS } from 'services/constant';
const FaceDetectionPage = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageResult, setImageResult] = useState(null);
    const [numPeople, setNumPeople] = useState("0");
    const [landmarks, setLandmarks] = useState([]); // State to store landmarks
    const canvasRef = useRef(null); // Reference to the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (imageResult) {
                const img = new Image();
                img.src = imageResult;
        
                img.onload = () => {
                    // Bước 1: Vẽ hình ảnh và landmarks lên một canvas tạm
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
        
                    // Đặt kích thước canvas tạm theo kích thước gốc của ảnh
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
        
                    // Vẽ ảnh gốc lên canvas tạm
                    tempCtx.drawImage(img, 0, 0);
        
                    // Vẽ landmarks và bounding box lên ảnh gốc trên canvas tạm
                    drawLandmarks(tempCtx, landmarks);
        
                    // Bước 2: Scale canvas tạm xuống kích thước mong muốn và vẽ lên canvas chính
                    const maxWidth = 300;
                    const scale = img.width > maxWidth ? maxWidth / img.width : 1; // Giữ tỉ lệ
                    const newWidth = img.width * scale;
                    const newHeight = img.height * scale;
        
                    // Đặt kích thước canvas chính là kích thước đã scale
                    canvas.width = newWidth;
                    canvas.height = newHeight;
        
                    // Vẽ nội dung từ canvas tạm đã có các landmark và bbox lên canvas chính đã scale
                    ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
                };
            }   
        }
    }, [imageResult, landmarks]);
    const drawLandmarks = (ctx, landmarks) => {
        if (Array.isArray(landmarks)) { // Check if landmarks is an array
            landmarks.forEach((landmark) => {
                ctx.fillStyle = landmark.color; // Màu của điểm
                ctx.beginPath();
                // ctx.arc(landmark.x, landmark.y, 5, 0, Math.PI * 2); // Vẽ hình tròn với bán kính 5
                // Vẽ bounding box
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(landmark.x, landmark.y, landmark.w, landmark.h);

                // Vẽ landmark cho mắt trái
                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(landmark.left_eye[0], landmark.left_eye[1], 5, 0, 2 * Math.PI);
                ctx.fill();

                // Vẽ landmark cho mắt phải
                ctx.beginPath();
                ctx.arc(landmark.right_eye[0], landmark.right_eye[1], 5, 0, 2 * Math.PI);
      
                ctx.fill();
            });
        } else {
            console.error("Landmarks is not an array", landmarks);
        }
    };

    const handleDetection = async (imageData) => {
        console.log(uploadedImage)
        console.log(imageData)
        try {
            const response = await callAPI(BACKEND_ENDPOINTS.demo_function.detection, "POST", { image: imageData });
            if (response) {
                console.log(response.data);
                setLandmarks(response.data["result"]); // Update landmarks
                const detectedPeopleCount = response.data["result"].length; // Assuming landmarks correspond to detected people
                setNumPeople(detectedPeopleCount.toString());
                setImageResult(imageData); // Set the uploaded image to display
            } else {
                console.error("Error");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleReset = () => {
        setUploadedImage(null);
        setImageResult(null);
        setLandmarks([]); // Reset landmarks as well
    };

    return (
        <>
            <MainCard title="Face Detection Demo">
                <Grid item>
                    <MuiTypography variant="body1" gutterBottom>
                        Face Detection allows you to find faces in an image. Along with the position of the faces, Face Detection also provides key points (eyes, nose, mouth) for each face.
                    </MuiTypography>
                    <canvas ref={canvasRef} width={300} height={400} style={{ display: 'none' }} /> {/* Add your canvas here */}
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
                                {detection_demo_img.map((item) => {
                                convertAndCacheImage(item.path);
                                const cachedImageSrc = sessionStorage.getItem(item.path) || item.path;
                                return (
                                <ImageListItem key={item.img} onClick={() => handleDetection(cachedImageSrc)}
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
                                )})}
                            </ImageList>
                        </Box>
                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    <Grid item xs={12} sm={6} md={5}>
                        <MuiTypography variant="subtitle1" gutterBottom> Result</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            {numPeople === "0" ? "No people detected." : `There are ${numPeople} people detected.`}
                        </MuiTypography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {imageResult ? (
                                    <>
                                        <canvas ref={canvasRef} width={300} height={400} style={{ border: '1px solid black' }} />
                                    </>
                                ) : (
                                    <ImageUpload handleUpload={handleDetection} uploadedImage={uploadedImage} sizeAccept={{ width: 800, height: 800 }} />
                                )}
                                <Box sx={{ mt: 2, width: '75%' }}>
                                    <AnimateButton>
                                        <Button disableElevation fullWidth size="large" variant="contained" color="secondary" onClick={handleReset}>
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
    );
};

export default FaceDetectionPage;
