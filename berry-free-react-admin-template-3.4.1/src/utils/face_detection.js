import * as faceapi from 'face-api.js';

// Load models
export async function loadModels() {
    console.log("hihihi")
    console.log(faceapi.nets)

    const MODEL_URL = `${process.env.PUBLIC_URL || ''}/models`
    try {
        // Ensure that the models are located in the /public/models folder
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("Models loaded successfully");
    } catch (error) {
        console.error("Error loading models:", error);
    }
}

// Detect faces in the provided image
export async function detectFace(image) {
    // Make sure models are loaded before calling this function
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
    console.log(detections);
    if (detections.length > 0) {
        return true;
    }
    return false;
}
