import React, { useState, useRef, useEffect } from 'react';
import { Grid, Fab, Typography, Switch, Avatar, Box } from '@mui/material';
import { AddAPhoto, Face } from '@mui/icons-material';
// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { callAPI } from 'utils/api_caller';
import { loadModels, detectFace } from 'utils/face_detection';
const FaceAuth = () => {
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const [email, setEmail] = useState("");
    const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false); // Trạng thái sử dụng FaceID
    const [isCreateNew, setIsCreateNew] = useState(false);
    // Dùng useRef để lưu trữ intervalId
    const intervalIdRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

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
                const response = await callAPI("/user/my-info", "POST", {}, null, localStorage.getItem('access_token'));
                if (response) {
                    const info = response.data.info;
                    setEmail( info["email"])
                    
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
                sendFrameToServer();
            }, 5000);
        } catch (err) {
            console.error("Error accessing the camera: ", err);
            alert('Unable to access the camera. Please check your permissions.');
        }
    };

    const sendFrameToServer = async () => {
        if (videoRef.current) {
            const detections = await detectFace(videoRef.current);
            if (!detections) {
                return;
            }
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth; // Set canvas width to video width
            canvas.height = videoRef.current.videoHeight; // Set canvas height to video height
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height); // Draw the current frame

            // Convert canvas to data URL
            const imageData = canvas.toDataURL('image/jpeg');

            // Send the image data to the server
            try {
                const response = await callAPI("/register-face-id", "POST", {image: imageData}, {withCredentials: true}, localStorage.getItem('access_token'))
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
                    //alert('Failed to register Face ID. Please try again.');
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
