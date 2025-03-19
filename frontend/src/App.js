import React, { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

export default function CatDogClassifier() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    setLoading(true);
    setPrediction("");
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("API Response:", response.data);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.data : error.message);
      setPrediction("Error in prediction");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="p-8 text-center text-black bg-white shadow-lg rounded-xl w-96">
        <h1 className="mb-4 text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
          Cat vs Dog Classifier 🐱🐶
        </h1>
        <label className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
          <Upload className="w-5 h-5" />
          Choose File
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>
        )}
        <button
          onClick={handleUpload}
          className="px-4 py-2 mt-4 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload & Predict"}
        </button>
        {prediction && (
          <div className="mt-4 text-lg font-semibold">
            Prediction: {prediction}
          </div>
        )}
      </div>
    </div>
  );
}