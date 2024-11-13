import * as faceapi from 'face-api.js';

// Load models
export async function loadModels() {
    const MODEL_URL = `${process.env.PUBLIC_URL || ''}/models`;
    
    try {
        // Load specific models needed for face detection
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded successfully");
    } catch (error) {
        console.error("Error loading models:", error);
    }
}

// Detect faces in the provided image
export async function detectFace(image) {
    // Ensure models are loaded before calling this function
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions());
    console.log("Detections:", detections);
    
    return detections.length > 0;
}
