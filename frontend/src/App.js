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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-96 text-black">
        <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Cat vs Dog Classifier 🐱🐶
        </h1>
        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
          <Upload className="w-5 h-5" />
          Choose File
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>
        )}
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
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