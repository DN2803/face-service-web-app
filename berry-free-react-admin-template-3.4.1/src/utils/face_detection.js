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
    try{
        const detectionsWithLandmarks = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
                                                    .withFaceLandmarks(); // Detect landmarks
        console.log("Detections with Landmarks:", detectionsWithLandmarks);
        if (detectionsWithLandmarks &&
            isFrontalFace(detectionsWithLandmarks.landmarks)) {
            return detectionsWithLandmarks; // Return true if at least one frontal face
        }else {
            return null
        }
        
    }catch (error) {
        console.error(error)
    }
    
}
export const isBoxInsideRect = (box, rect) => {
    return (
      box.x >= rect.x &&
      box.y >= rect.y &&
      box.x + box.width <= rect.x + rect.width &&
      box.y + box.height <= rect.y + rect.height
    );
  };

export const cropImage = (canvas, detection) => {
    const { x, y, width, height } = detection.alignedRect.box;

    // Kích thước crop mới (320x240)
    const cropWidth = 320;
    const cropHeight = 240;

    // Tính toán vị trí trung tâm của canvas
    const cropX = Math.max(0, x - (cropWidth - width) / 2);
    const cropY = Math.max(0, y - (cropHeight - height) / 2);
    if (!isBoxInsideRect({ x, y, width, height }, {x: cropX, y: cropY, width: cropWidth, height: cropHeight })) {

        console.log ("cắt không hợp lệ")
        return;
    }
    else {
        const areaBox = width * height;
        const areaCrop = cropWidth * cropHeight;

        // Kiểm tra nếu diện tích của hộp cắt chiếm ít nhất 60% diện tích của vùng cắt
        if (areaBox / areaCrop < 0.6) {
            console.log("Diện tích của hộp cắt phải chiếm ít nhất 60% diện tích của vùng cắt.");
            return;
        }
    }

    // Cắt phần ảnh theo bounding box đã tính toán
    const imageData = canvas.getContext('2d').getImageData(cropX, cropY, cropWidth, cropHeight);

    // Tạo canvas mới để chứa phần ảnh cắt
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const croppedContext = croppedCanvas.getContext('2d');

    // Vẽ phần ảnh cắt lên canvas mới
    croppedContext.putImageData(imageData, 0, 0);

    // Chuyển phần ảnh cắt thành DataURL (Base64)
    const croppedImageData = croppedCanvas.toDataURL('image/jpeg');
    return croppedImageData; // Trả về ảnh cắt dưới dạng base64
  };
