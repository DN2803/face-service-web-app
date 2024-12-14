from deepface.modules.modeling import build_model

MODELS = {
    'face_detector': 'yunet',
    'spoofing': 'Fasnet',
    'facial_recognition': 'Facenet512'
}

import os
os.environ["yunet_score_threshold"] = "0.5"

for task, model_name in MODELS.items():
    try:
        build_model(task, model_name)
    except Exception as e:
        raise Exception(f'Cannot build {model_name} model for {task}. Error: {str(e)}')