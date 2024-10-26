import React, { useState, useRef, useEffect } from 'react';
import { Grid, Fab, Typography, Switch, Avatar, Box } from '@mui/material';
import { AddAPhoto, Face } from '@mui/icons-material';
// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { parseCookieToObject } from 'utils/cookies';
import { callAPI } from 'utils/api_caller';

const FaceAuth = () => {
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const [email, setEmail] = useState("");
    const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false); // Trạng thái sử dụng FaceID
    const [isCreateNew, setIsCreateNew] = useState(false);
    // Dùng useRef để lưu trữ intervalId
    const intervalIdRef = useRef(null);

    // Lấy và giải mã cookie
    const authTokenObject = parseCookieToObject('user');

    useEffect(() => {
        const checkFaceAuth = async (userEmail) => {
            try {
                const response = await callAPI("/face_exist", "POST", {email: userEmail})
                if (response) {
                    setIsFaceIDEnabled(true);
                }
            } catch (error) {
                console.error('Error checking FaceID status:', error);
                setIsFaceIDEnabled(false);
            }
        };
        if (authTokenObject) {
            const user = authTokenObject;
            if (user) {
                setEmail(user.email); // Set email
                checkFaceAuth(user.email); // Kiểm tra trạng thái FaceID
            }
        }
    }, [authTokenObject]);

    const handleToggle = async (event) => {
        const newStatus = event.target.checked; // Trạng thái mới từ toggle

        if (newStatus && !isFaceIDEnabled) {
            // Nếu bật FaceID
            setIsCreateNew(true)
        } else if (!newStatus && isFaceIDEnabled) {
            // Nếu tắt FaceID
            try {
                const response = await callAPI("/remove_face_auth", "POST", {email: email})
                if (response) {
                    setIsFaceIDEnabled(false);
                }
            } catch (error) {
                console.error('Error updating FaceID status:', error);
            }
        }
    };
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play(); // Start video playback
            }
            setCameraActive(true); // Show the video element

            // Start sending images to the server every second
            intervalIdRef.current = setInterval(() => {
                sendFrameToServer();
            }, 1000);
        } catch (err) {
            console.error("Error accessing the camera: ", err);
            alert('Unable to access the camera. Please check your permissions.');
        }
    };

    const sendFrameToServer = async () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth; // Set canvas width to video width
            canvas.height = videoRef.current.videoHeight; // Set canvas height to video height
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height); // Draw the current frame

            // Convert canvas to data URL
            const imageData = canvas.toDataURL('image/jpeg');

            // Send the image data to the server
            try {
                const response = await callAPI("/create_face_auth", "POST", {image: imageData, email: email})
                const data = await response.data;
                if (data){
            
                    console.log('Image sent successfully:', data);
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
                }}
            catch (error) {
                    console.error('Error:', error);
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
                            <Fab size="small" color="secondary" aria-label="add" onClick= {startCamera}>
                                <AddAPhoto />
                            </Fab>
                            {cameraActive && (
                                <div style={{ marginTop: '20px' }}>
                                    <video
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
                                </div>
                            )}
                        </SubCard>}

                </Grid>
            </MainCard>
        </>
    );
};

export default FaceAuth;
