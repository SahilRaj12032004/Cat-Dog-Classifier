import os
import numpy as np
import cv2
import joblib
import matplotlib.pyplot as plt
from skimage.feature import hog

# Load the saved model
model_filename = "Cat_dog_svm_model.pkl"
svm_model = joblib.load(model_filename)
print("✅ Loaded trained SVM model!")

# Image Preprocessing Function
def extract_hog_features(image):
    return hog(image, orientations=9, pixels_per_cell=(4, 4), cells_per_block=(2, 2), feature_vector=True)

# Function to Predict a Single Image
def predict_image(image_path, model):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return "Invalid image!"
    
    img = cv2.resize(img, (32, 32))
    features = extract_hog_features(img).reshape(1, -1)
    prediction = model.predict(features)[0]
    
    return "Cat" if prediction == 0 else "Dog"

# Test Image Path (Change this to your actual image)
test_img_path = "C:\\Users\\Sahil Raj\\Downloads\\cat-v-dog\\dogs_cats_sample_1000\\test\\dogs\\dog.1001.jpg"

if os.path.exists(test_img_path):
    prediction = predict_image(test_img_path, svm_model)
    print(f"\n🔹 Prediction for {test_img_path}: {prediction}")

    # Display image
    img = cv2.imread(test_img_path)
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.title(f"Predicted: {prediction}")
    plt.axis("off")
    plt.show()
else:
    print("\n⚠ Test image not found. Please specify a valid image path.")
