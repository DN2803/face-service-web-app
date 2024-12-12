import React, { useState, useRef, useEffect } from 'react';
import { Grid, Fab, Typography, Switch, Avatar, Box } from '@mui/material';
import { AddAPhoto, Face } from '@mui/icons-material';
// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import * as faceapi from 'face-api.js';

import { gridSpacing } from 'store/constant';
import { useCallAPI } from 'hooks/useCallAPI';
import { loadModels, detectFace, isBoxInsideRect} from 'utils/face_detection';
import { BACKEND_ENDPOINTS } from 'services/constant';
const FaceAuth = () => {
    const { callAPI } = useCallAPI();
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [email, setEmail] = useState("");
    const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false); // Trạng thái sử dụng FaceID
    const [isCreateNew, setIsCreateNew] = useState(false);
    // Dùng useRef để lưu trữ intervalId
    const intervalIdRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const waitResponseRef = useRef(false);
    useEffect(() => {
        const loadAllModels = async () => {
            loadModels();
            setModelsLoaded(true);
        };
        loadAllModels();
    }, []);
    useEffect(() => {
        const checkFaceAuth = async () => {
            try {
                const response = await callAPI(BACKEND_ENDPOINTS.user.info, "GET", {}, true);
                if (response) {
                    const info = response.data.info;
                    console.log(info);
                    setEmail(info["email"])
                    setIsFaceIDEnabled(info["verified"]);
                }
            } catch (error) {
                console.error('Error checking FaceID status:', error);
                setIsFaceIDEnabled(false);
            }
        };
        checkFaceAuth()
    }, []);

    const handleToggle = async (event) => {
        const newStatus = event.target.checked; // Trạng thái mới từ toggle

        if (newStatus && !isFaceIDEnabled) {
            // Nếu bật FaceID
            setIsCreateNew(true)
        } else if (!newStatus && isFaceIDEnabled) {
            // Nếu tắt FaceID
            // try {
            //     const response = await callAPI("/remove_face_auth", "POST", {email: email})
            //     if (response) {
            //         setIsFaceIDEnabled(false);
            //     }
            // } catch (error) {
            //     console.error('Error updating FaceID status:', error);
            // }
            setIsFaceIDEnabled(false);
        }
    };
    const startCamera = async () => {
        try {
            if (modelsLoaded == false) return;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play(); // Start video playback
            }
            setCameraActive(true); // Show the video element

            // Start sending images to the server every second
            intervalIdRef.current = setInterval(() => {
                if (!waitResponseRef.current) {
                    sendFrameToServer();
                }
            }, 1000);
        } catch (err) {
            console.error("Error accessing the camera: ", err);
            alert('Unable to access the camera. Please check your permissions.');
        }
    };

    const sendFrameToServer = async () => {
        if (videoRef.current) {
            try {
                // Lấy ngữ cảnh 2D của canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = videoRef.current.videoWidth; // Set canvas width to video width
                canvas.height = videoRef.current.videoHeight; // Set canvas height to video height
                console.log(canvas.width, canvas.height);
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height); // Draw the current frame

                // Clear và vẽ hình chữ nhật tùy chỉnh trước khi thực hiện detection
                const overlay = document.getElementById('overlay');
                overlay.width = videoRef.current.offsetWidth;
                overlay.height = videoRef.current.offsetHeight;
                const overlayContext = overlay.getContext('2d');
                overlayContext.clearRect(0, 0, overlay.width, overlay.height);

                const rectWidth = (2 / 3) * overlay.width; // Chiều rộng = 2/3 chiều rộng canvas
                const rectHeight = (2 / 3) * overlay.height; // Chiều cao = 2/3 chiều cao canvas
                const rectX = (overlay.width - rectWidth) / 2; // Tọa độ X để hình chữ nhật ở giữa
                const rectY = (overlay.height - rectHeight) / 2; // Tọa độ Y để hình chữ nhật ở giữa
                const drawRectangle = (context) => {
                    context.beginPath();
                    context.strokeStyle = 'black'; // Màu đường viền
                    context.lineWidth = 2; // Độ dày của đường viền
                    context.rect(rectX, rectY, rectWidth, rectHeight); // Vẽ hình chữ nhật
                    context.stroke();
                };
                overlayContext.clearRect(0, 0, overlay.width, overlay.height); // Xóa canvas
                drawRectangle(overlayContext); // Vẽ hình chữ nhật tùy chỉnh

                // Thực hiện phát hiện khuôn mặt
                const detections = await detectFace(videoRef.current);

                if (!detections) {
                    waitResponseRef.current = false; // Reset trạng thái nếu không phát hiện khuôn mặt
                    return;
                }

                // Resize kết quả detection về kích thước canvas video
                const displaySize = {
                    width: videoRef.current.offsetWidth,
                    height: videoRef.current.offsetHeight,
                };
                faceapi.matchDimensions(canvasRef.current, displaySize);
                const resizedDetections = faceapi.resizeResults(detections, displaySize);


                // Clear và vẽ lại bounding boxes và landmarks lên canvas overlay
                overlayContext.clearRect(0, 0, overlay.width, overlay.height);

                // Vẽ bounding box sau khi detection
                faceapi.draw.drawDetections(overlay, resizedDetections);
                drawRectangle(overlayContext);
                if (!isBoxInsideRect(resizedDetections.alignedRect.box, {
                    x: rectX,
                    y: rectY,
                    width: rectWidth,
                    height: rectHeight,
                })) {
                    console.log('không hợp lệ')
                    return
                }
                const imageData = canvas.toDataURL('image/jpeg');
                const response = await callAPI(BACKEND_ENDPOINTS.user.register.faceid, "POST", { image: imageData }, true)
                const data = await response.data;
                if (data) {
                    clearInterval(intervalIdRef.current); // Dừng interval
                    alert('Face ID successfully created!');
                    // Dừng stream camera
                    if (videoRef.current && videoRef.current.srcObject) {
                        const stream = videoRef.current.srcObject;
                        const tracks = stream.getTracks();
                        // Stop all tracks (camera stream)
                        tracks.forEach((track) => track.stop());
                        // Clear the interval to stop sending frames
                        clearInterval(intervalIdRef.current);
                        setCameraActive(false); // Update state to hide video component

                    }
                    setIsFaceIDEnabled(true);
                    setIsCreateNew(false);
                }
            }
            catch (error) {
                console.error('Error:', error);
                alert('Failed to register Face ID. Please try again.');
                if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject;
                    const tracks = stream.getTracks();
                    // Stop all tracks (camera stream)
                    tracks.forEach((track) => track.stop());
                    // Clear the interval to stop sending frames
                    clearInterval(intervalIdRef.current);
                    setCameraActive(false); // Update state to hide video component
                }
            } finally {
                waitResponseRef.current = false;
            }
        }
    };

    // Cleanup function to clear the interval when the component unmounts
    useEffect(() => {
        return () => {
            clearInterval(intervalIdRef.current); // Clear interval on component unmount
        };
    }, []);

    return (
        <>
            <MainCard title="Setting" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
                <Grid container spacing={gridSpacing}>
                    <SubCard title="Face ID Settings">
                        <Box display="flex" alignItems="center">
                            <Avatar>
                                <Face />
                            </Avatar>
                            <Box ml={2}>
                                <Typography variant="subtitle1">
                                    {email}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Face ID: {isFaceIDEnabled ? 'Enabled' : 'Disabled'}
                                </Typography>
                            </Box>
                            <Switch
                                checked={isFaceIDEnabled}
                                onChange={handleToggle}
                                color="primary"
                                inputProps={{ 'aria-label': 'Enable/Disable Face ID' }}
                            />
                        </Box>
                    </SubCard>
                    {isCreateNew &&
                        <SubCard title="Create face authentication">
                            <Fab size="small" color="secondary" aria-label="add" onClick={startCamera}>
                                <AddAPhoto />
                            </Fab>
                            {cameraActive && (
                                <div style={{ marginTop: '20px', position: 'relative' }}>
                                    <Typography>Please look directly at the camera.</Typography>
                                    <video
                                        id='video'
                                        ref={videoRef}
                                        width="320"
                                        height="240"
                                        style={{ border: '1px solid black' }}
                                        autoPlay
                                        playsInline
                                    >
                                        {/* Add empty track for accessibility */}
                                        <track kind="captions" />
                                    </video>
                                    <canvas
                                        id='overlay'
                                        ref={canvasRef}
                                        width="320"
                                        height="240"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            pointerEvents: 'none',
                                        }}
                                    />
                                </div>
                            )}
                        </SubCard>}

                </Grid>
            </MainCard>
        </>
    );
};

export default FaceAuth;
