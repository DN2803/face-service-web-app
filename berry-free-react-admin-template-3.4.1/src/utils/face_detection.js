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

function isFrontalFace(landmarks) {
    if (!landmarks) return false; // Đảm bảo Landmark tồn tại

    const nose = landmarks.getNose();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const mouth = landmarks.getMouth();

    // Đảm bảo Landmark chính tồn tại
    if (!nose || !leftEye || !rightEye || !mouth) return false;

    // Nếu tất cả kiểm tra đều đạt, đây là khuôn mặt trực diện
    return true;
}

// Detect faces in the provided image
export async function detectFace(image) {
    const detectionsWithLandmarks = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(); // Detect landmarks

    console.log("Detections with Landmarks:", detectionsWithLandmarks);

    // Filter only frontal faces
    const frontalFaces = detectionsWithLandmarks.filter(detection => isFrontalFace(detection.landmarks));
    console.log("Frontal Faces:", frontalFaces);

    return frontalFaces.length > 0; // Return true if at least one frontal face
}
