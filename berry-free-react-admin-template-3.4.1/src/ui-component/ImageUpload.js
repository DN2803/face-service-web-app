import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload = ({ handleUpload, uploadedImage = null, sizeAccept = { width: 200, height: 200 } }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;

        if (width <= sizeAccept.width && height <= sizeAccept.height) {
          // Read the image as data URL and set the preview
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageData = reader.result;
            setPreviewImage(imageData);
            handleUpload(imageData); // Trigger parent component upload
            setError(null);
          };
          reader.readAsDataURL(file);
        } else {
          setError(`Image dimensions should not exceed ${sizeAccept.width}x${sizeAccept.height} pixels`);
        }
      };
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
    maxSize: 200000, // Limit file size to 200KB
  });

  // Reset preview when uploadedImage is cleared
  useEffect(() => {
    if (uploadedImage === null) {
      setPreviewImage(null);
    }
  }, [uploadedImage]);

  return (
    <Card
      sx={{
        backgroundColor: '#333',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        width: '400px',
        borderRadius: '8px',
        border: '2px solid #d32f2f',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          border: '2px solid #f00',
        },
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
        }}
      >
        <input {...getInputProps()} />
        {!previewImage ? (
          <>
            <CloudUploadIcon sx={{ fontSize: 100, color: '#ff9800' }} />
            <Typography variant="body1" color="white">
              Upload Image or drag and drop in this space
            </Typography>
            <Typography variant="caption" color="white">
              Image should not exceed {sizeAccept.width}x{sizeAccept.height} PX
            </Typography>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </>
        ) : (
          <img
            src={previewImage}
            alt="preview"
            style={{
              maxHeight: '300px',
              maxWidth: '400px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default ImageUpload;
