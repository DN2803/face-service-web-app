import os

IMAGE_DIR = os.path.join(os.getcwd(), '..', 'Image')
print(IMAGE_DIR)
os.makedirs(IMAGE_DIR, exist_ok=True)

# SOURCE_IMG_DIR = os.path.join(IMAGE_DIR, 'Source')
# os.makedirs(SOURCE_IMG_DIR, exist_ok=True)