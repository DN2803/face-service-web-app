from app.packages.image.services import MODELS

from deepface import DeepFace
from deepface.modules.modeling import build_model
from deepface.models.Detector import Detector
from deepface.commons.image_utils import load_image
from deepface.modules.detection import align_img_wrt_eyes, project_facial_area
import numpy as np

# customize some DeepFace's functions
def extract_faces(
    img_path, 
    anti_spoofing=False,
    only_one=False,
    align=False,
    return_faces=False
) -> list[dict]:
    """
    Extract faces from a given image

    Args:
    ----
    - img_path (str or np.ndarray): Path to the first image. Accepts exact image path
        as a string, numpy array (BGR), or base64 encoded images.
    - anti_spoofing (boolean): Flag to enable anti spoofing (default is False).
    - only_one (boolean): Flag to check if the given image includes only one face.
    - return_faces: Flag to return detected face image in result.
    Returns:
    ----
    results (List[Dict[str, Any]]): A list of dictionaries, where each dictionary contains:

    - "face" (np.ndarray): The detected face as a NumPy array.

    - "facial_area" (Dict[str, Any]): The detected face's regions as a dictionary containing:
        * keys 'x', 'y', 'w', 'h' with int values
        * keys 'left_eye', 'right_eye' with a tuple of 2 ints as values. left and right eyes
            are eyes on the left and right respectively with respect to the person itself
            instead of observer.
        * "confidence" (float): The confidence score associated with the detected face.
        * "is_real" (boolean): antispoofing analyze result. this key is just available in the
            result only if anti_spoofing is set to True in input arguments.
    """
    if anti_spoofing and only_one == False:
        raise ValueError('Anti_spoofing is True but only_one is False')
    if align and return_faces == False:
        raise ValueError('Align is True but return_faces is False')

    img_np,img_name = load_image(img_path)

    if img_np is None:
        raise ValueError(f"Exception while loading {img_name}")

    face_detector: Detector = build_model(
        'face_detector', model_name=MODELS['face_detector']
    )

    facial_areas = face_detector.detect_faces(img_np)

    if len(facial_areas) == 0:
        if img_name is not None:
            raise ValueError(
                f"Face could not be detected in {img_name}."
                "Please confirm that the picture is a face photo "
                "or consider to set enforce_detection param to False."
            )
        else:
            raise ValueError(
                "Face could not be detected. Please confirm that the picture is a face photo "
                "or consider to set enforce_detection param to False."
            )
    elif only_one:
        raise ValueError("Please confirm that the picture includes only one face.")

    face_objs = []
    for facial_area in facial_areas:
        x = facial_area.x
        y = facial_area.y
        w = facial_area.w
        h = facial_area.h
        left_eye = facial_area.left_eye
        right_eye = facial_area.right_eye
        confidence = facial_area.confidence
        detected_face = None

        # align original image, then find projection of detected face area after alignment
        if align is True:  # and left_eye is not None and right_eye is not None:
            processed_face = __align_preprocess(img_np, x, y, w, h)
            aligned_img, angle = align_img_wrt_eyes(img=processed_face, left_eye=left_eye, right_eye=right_eye)
            rotated_x1, rotated_y1, rotated_x2, rotated_y2 = project_facial_area(
                facial_area=(x, y, x + w, y + h),
                angle=angle,
                size=(processed_face.shape[0], processed_face.shape[1])
            )

            if return_faces:
                detected_face = aligned_img[
                    (rotated_y1) : (rotated_y2), (rotated_x1) : (rotated_x2)
                ]
        elif return_faces:
            detected_face = img_np[(y) : (y + h), (x) : (x + w)] if return_faces else None

        res_obj = {
            'face': detected_face,
            'facial_area': {
                'x': x,
                'y': y,
                'w': w,
                'h': h,
                'left_eye': left_eye,
                'right_eye': right_eye
            },
            'confidence': confidence
        }

        face_objs.append(res_obj)

    if anti_spoofing:
        face_obj = face_objs[0]
        x,y,w,h,_,_ = face_obj['facial_area'].values()
        is_real, antispoof_score = anti_spoofing(img_np, (x,y,w,h))
        face_obj['is_real'] = is_real
        face_obj['antispoof_score'] = antispoof_score

    return face_objs

def anti_spoofing(img_np, facial_area):
    if not __validate_antispoofing_input(img_np, facial_area):
        raise ValueError('The given picture does not meet our input constraints')

    antispoof_model = build_model(task="spoofing", model_name=MODELS['Fasnet'])
    is_real, antispoof_score = antispoof_model.analyze(img_np, facial_area)

    return is_real, antispoof_score

def represent(img_np):
    """ Extract features from a given face image
    Returns:
        result (NDArray): normalize img features
    """
    embedding_objs = DeepFace.represent(
        img_path = img_np,
        model_name = "Facenet512",
        enforce_detection = False,
        detector_backend = 'skip'
    )
    embed = embedding_objs[0]['embedding']
    embed_np = np.array(embed)
    embed_normalize = embed_np/ np.linalg.norm(embed_np)
    return embed_normalize

def verify(img1_path, img2_path, threshold = 0.6):
    face_obj_1 = extract_faces(img1_path, only_one=True)
    face_obj_2 = extract_faces(img2_path, only_one=True)
    embed_1 = represent(face_obj_1[0]['face'])
    embed_2 = represent(face_obj_2[0]['face'])

    sim = np.dot(embed_1, embed_2) #cos_sim for two normalized vector

    if sim > threshold:
        return True, sim
    else:
        return False, sim


def __align_preprocess(img_np, x, y, w, h):
    PERCENTAGE = 0.5
    height_border = int(PERCENTAGE * w)
    width_border = int(PERCENTAGE * h)
    # create a black image
    result = np.full(
        (h+2*height_border, w+2*width_border, img_np.shape[2]),
        (0,0,0),
        dtype=img_np.dtype
    )
    # get all pixel from original img
    x1 = max(0, x - width_border)
    y1 = max(0, y - height_border)
    x2 = min(img_np.shape[0], x + w + width_border)
    y2 = min(img_np.shape[1], y + h + height_border)
    img_cropped = img_np[y1:y2, x1:x2]

    # map to new start point in result
    start_x = max(0, width_border - x)
    start_y = max(0, height_border - y)
    # copy pixels
    result[start_y:start_y + img_cropped.shape[0], start_x:start_x + img_cropped.shape[1]] = img_cropped
    return result

from math import sqrt
__AREA_THRESHOLD = 0.75
__SIDE_RATE = sqrt(__AREA_THRESHOLD)

def __validate_antispoofing_input(img_np, facial_area):
    h, w,_  = img_np.shape
    w_max, h_max = int(w*__SIDE_RATE), int(h*__SIDE_RATE)
    x_floor = int((w - w_max)/2)
    y_floor = int((h - h_max)/2)
    x_ceil, y_ceil = x_floor+w_max, y_floor+h_max

    return (
        facial_area['x'] > x_floor and
        facial_area['y'] > y_floor and
        facial_area['x']+facial_area['w']< x_ceil and
        facial_area['y']+facial_area['h'] < y_ceil
    )