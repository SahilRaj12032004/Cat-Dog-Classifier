from flask import Flask, request, jsonify
import joblib
import numpy as np
import cv2 
from skimage.feature import hog  
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Load the saved SVM model
try:
    model = joblib.load("cat_dog_svm_model.pkl")  # Ensure this file exists
except Exception as e:
    print("Error loading model:", e)
    model = None

# Define image preprocessing function
def preprocess_image(image):
    try:
        image = image.convert("L")  # Convert to grayscale
        image = image.resize((96, 96))  # ✅ Must match training size!
        img_array = np.array(image)
        img_array = cv2.equalizeHist(img_array)  # ✅ Match training contrast enhancement
        
        # ✅ Extract HOG features (same as training)
        features = hog(img_array, orientations=9, pixels_per_cell=(8, 8), 
                       cells_per_block=(2, 2), feature_vector=True)
        
        features = np.array(features).reshape(1, -1)  # ✅ Ensure shape matches training
        print("Processed image shape:", features.shape)  # Debugging output
        return features
    except Exception as e:
        print("Error processing image:", e)
        return None

# Define the prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read()))
    processed_image = preprocess_image(image)
    
    if processed_image is None:
        return jsonify({"error": "Error processing image"}), 500
    
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        prediction = model.predict(processed_image)
        result = "Cat" if prediction[0] == 0 else "Dog"
        return jsonify({"prediction": result})
    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Error in prediction"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)