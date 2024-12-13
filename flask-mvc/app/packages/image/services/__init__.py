from deepface.modules.modeling import build_model

models = {
    'face_detector': 'yunet',
    'spoofing': 'Fasnet',
    'facial_recognition': 'Facenet512'
}

for task, model_name in models.items():
    try:
        build_model(task, model_name)
    except Exception as e:
        raise Exception(f'Cannot build {model_name} model for {task}. Error: {str(e)}')