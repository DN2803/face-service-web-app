import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import { AddAPhoto } from '@mui/icons-material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


import { useCallAPI } from 'hooks/useCallAPI';
import { loadModels, detectFace } from 'utils/face_detection';
import { BACKEND_ENDPOINTS } from 'services/constant';

import { useEmailVerified, useUserInfo } from 'hooks';


import { loginSuccess } from 'store/actions/authActions';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const { callAPI } = useCallAPI();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  // Dùng useRef để lưu trữ intervalId
  const intervalIdRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);

  const [onlyLogByPassword, setOnlyLogByPassword] = useState(false);

  const countFalseRef = useRef(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { userInfo } = useUserInfo();
  const { isVerified, loading, error } = useEmailVerified();
  const waitResponseRef = useRef(false);
  const dispatch = useDispatch();
  const redirectRoute = useSelector(state => state.auth.redirectRoute);

  useEffect(() => {
    const checkVerificationAndLoadModels = async () => {
      if (!loading) {
        if (error) {
          console.error("Token decoding error:", error);
          return;
        }
        if (isVerified) {
          await loadModels(); // Load models only if verified
          setModelsLoaded(true);
        } else {
          navigate('/pages/login/verify-email'); // Navigate if not verified
        }
      }
    };

    checkVerificationAndLoadModels();
  }, [loading, error, isVerified, navigate]);


  const handleLogin = async (password) => {
    //console.error('Login:', password);
    try {
      const response = await callAPI(BACKEND_ENDPOINTS.auth.login.password, "POST", { password: password }, true, localStorage.getItem('refresh_token'));
      const data = await response.data;
      if (response) {
        dispatch(loginSuccess(userInfo));
        // Chuyển hướng về route đã lưu trữ trong Redux (nếu có)
        if (redirectRoute) {
          navigate(redirectRoute); // use navigate instead of history.push
        } else {
          navigate('/pages/project');  // navigate to default page
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Lỗi khi gửi request:', error);
      setErrorLogin(true);
    }
  };
  const startCamera = async () => {
    if (modelsLoaded == false) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Start video playback
      }

      // Start sending images to the server every second
      intervalIdRef.current = setInterval(() => {
        if (!waitResponseRef.current)
          sendFrameToServer();
      }, 1000);
    } catch (err) {
      console.error('Error accessing the camera: ', err);
      alert('Unable to access the camera. Please check your permissions.');
    }
  };
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      // Stop all tracks (camera stream)
      tracks.forEach((track) => track.stop());
      // Clear the interval to stop sending frames
      clearInterval(intervalIdRef.current);
      setCameraActive(false); // Update state to hide video component
    }
  };
  const sendFrameToServer = async () => {
    if (waitResponseRef.current) {
      console.log('chờ phản hồi từ server');
      return;
    }
    if (videoRef.current) {
      waitResponseRef.current = true;
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
        
        if (countFalseRef.current >= 5) {
          stopCamera();
          setOnlyLogByPassword(true);
        }

        const response = await callAPI(BACKEND_ENDPOINTS.auth.login.faceid, "POST", { image: imageData }, { withCredentials: true }, localStorage.getItem('refresh_token'));
        // Await the JSON response
        const data = await response.data;
        if (response) {
          dispatch(loginSuccess(userInfo));
          // Chuyển hướng về route đã lưu trữ trong Redux (nếu có)
          if (redirectRoute) {
            navigate(redirectRoute); // use navigate instead of history.push
          } else {
            navigate('/pages/project');  // navigate to default page
          }
          // Tắt camera sau khi đăng nhập thành công
          stopCamera();
          countFalseRef.current = 0;  // Reset countFalse
        } else {
          console.error('Lỗi đăng nhập:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        countFalseRef.current += 1;
      } finally {
        waitResponseRef.current = false;
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // Loading/Error display logic
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>
  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Hello {userInfo.username} </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) {
              // Gọi hàm handleLogin để gửi dữ liệu về server
              await handleLogin(values.password);
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {userInfo.faceid && (
              <>
                <AnimateButton>
                  <Button
                    disableElevation
                    fullWidth
                    size="large"
                    variant="outlined"
                    onClick={() => startCamera(values.email)}
                    sx={{
                      color: 'grey.700',
                      backgroundColor: theme.palette.grey[50],
                      borderColor: theme.palette.grey[100]
                    }}
                  >
                    <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                      <AddAPhoto style={{ marginRight: matchDownSM ? 8 : 16 }} />
                    </Box>
                  </Button>
                </AnimateButton>
                {cameraActive && (
                  <div style={{ marginTop: '20px' }}>
                    <Typography>Please look directly at the camera.</Typography>
                    <video ref={videoRef} width="320" height="240" style={{ border: '1px solid black' }} autoPlay playsInline>
                      {/* Add empty track for accessibility */}
                      <track kind="captions" />
                    </video>
                  </div>
                )}
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                  <Button
                    variant="outlined"
                    sx={{
                      cursor: 'unset',
                      m: 2,
                      py: 0.5,
                      px: 7,
                      borderColor: `${theme.palette.grey[100]} !important`,
                      color: `${theme.palette.grey[900]}!important`,
                      fontWeight: 500,
                      borderRadius: `${customization.borderRadius}px`
                    }}
                    disableRipple
                    disabled
                  >
                    OR
                  </Button>

                  <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                </Box>
              </>
            )}

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            {
              errorLogin && (
                <div style={{ display: 'flex', alignItems: 'center', color: '#ff6666', marginLeft: '10px' }}>
                  <WarningAmberIcon style={{ marginRight: '5px' }} />
                  <p style={{ margin: 10 }}>Account does not exist</p>
                </div>
              )
            }
            {
              onlyLogByPassword && (
                <div style={{ display: 'flex', alignItems: 'center', color: '#ff6666', marginLeft: '10px' }}>
                  <WarningAmberIcon style={{ marginRight: '5px' }} />
                  <p style={{ margin: 10 }}>Face recognition failed multiple times. Please try logging in with your password.</p>
                </div>
              )
            }
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography onClick={() => {
                localStorage.removeItem('refresh_token');
                navigate('/pages/login/verify-email');
              }} variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Go back
              </Typography>
              <Typography onClick={() => navigate('/pages/forgot-password')} variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
