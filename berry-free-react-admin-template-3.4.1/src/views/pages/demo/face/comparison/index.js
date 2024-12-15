import React, { useState } from 'react';
// material-ui
import { Grid, Divider, Box, Button } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { ClipLoader } from 'react-spinners';
// Image Upload Component
import ImageUpload from 'ui-component/ImageUpload';

import { useCallAPI } from 'hooks/useCallAPI';
import { BACKEND_ENDPOINTS } from 'services/constant';

const FaceComparisonPage = () => {
    const { callAPI } = useCallAPI();
    const [uploadedImage1, setUploadedImage1] = useState(null);
    const [uploadedImage2, setUploadedImage2] = useState(null);
    const [comparisonResult, setComparisonResult] = useState(null); // Store the comparison result
    const [result, setResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [reset, setReset] = useState(false);
    const handleCompare = async () => {
        // Simulate face comparison process
        if (uploadedImage1 && uploadedImage2) {
            setIsLoading(true);
            try {
                const response = await callAPI(BACKEND_ENDPOINTS.demo_function.comparison, "POST", {
                    image1: uploadedImage1,
                    image2: uploadedImage2
                });
                // const data = await response.data;
                if (response) {
                    console.log (response.data)
                    setReset(true);
                    setComparisonResult(response.data["result"]["score"]);
                    setResult(response.data["result"]["is_matched"]);
                }
            }
            catch (error){
                console.error("Error:", error)
            } finally {
                // Kết thúc trạng thái loading
                setIsLoading(false);
            }
        } else {
            alert('Please upload both images.');
        } 
    };

    const handleReset = () => {
        // Reset the uploaded images and comparison result
        setUploadedImage1(null);
        setUploadedImage2(null);
        setComparisonResult(null);
        setReset(false);
    };

    return (
        <>
            <MainCard title="Face Comparison Demo">
                <Grid item>
                    <MuiTypography variant="body1" gutterBottom>
                        Face Comparison allows you to tell if two facial images belong to the same person. Unlike Face Search which needs the registration and subsequent storage of face images on our server, Face Comparison works only on the face images provided without storing any data on our server.
                    </MuiTypography>
                </Grid>
            </MainCard>

            <MainCard sx={{ padding: 1 }}>
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={4} sm={8} md={4}> {/* Step 1 */}
                        <MuiTypography variant="subtitle1" gutterBottom> Step 1</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            Upload an image
                        </MuiTypography>
                        <Box sx={{ width: "80%", display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                            <ImageUpload handleUpload={setUploadedImage1} uploadedImage={uploadedImage1} sizeAccept={{ width: 800, height: 800 }} />
                        </Box>
                    </Grid>
                    <Divider orientation="vertical" flexItem /> {/* Optional: Remove if not needed */}

                    <Grid item xs={4} sm={8} md={4}> {/* Step 2 */}
                        <MuiTypography variant="subtitle1" gutterBottom> Step 2</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            Upload another image
                        </MuiTypography>
                        <Box sx={{ width: "80%", display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                            <ImageUpload handleUpload={setUploadedImage2} uploadedImage={uploadedImage2} sizeAccept={{ width: 800, height: 800 }} />
                        </Box>
                    </Grid>

                    <Divider orientation="vertical" flexItem /> {/* Optional: Remove if not needed */}

                    <Grid item xs={4} sm={8} md={3}> {/* Step 3 */}
                        <MuiTypography variant="subtitle1" gutterBottom> Step 3</MuiTypography>
                        <MuiTypography variant="body1" gutterBottom>
                            Score of 66% or more is a match
                        </MuiTypography>
                        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                            <Box sx={{ mt: 2, width: '100%' }}>
                                {isLoading && <ClipLoader size={50} color={"#123abc"} />}
                                {comparisonResult !== null && (
                                    <MuiTypography variant="body1" gutterBottom>
                                        Match Score: {comparisonResult * 100}% {result ? '✅ Match' : '❌ No Match'}
                                    </MuiTypography>
                                )}
                            </Box>

                            {!reset && (<Box sx={{ mt: 2, width: '100%' }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCompare}
                                    >
                                        Compare
                                    </Button>
                                </AnimateButton>
                            </Box>
)}
                            {
                                reset && (<Box sx={{ mt: 2, width: '100%' }}>
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
                                </Box>)
                            }
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    )
}

export default FaceComparisonPage;
