
"use client";

import { useState } from 'react';

const API_URL = 'http://localhost:8000';

const ImageUploader = ({ onUpdateHistory }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/get_predictions`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(errorDetail.detail || "Error uploading image");
      }

      setMessage("Image uploaded and processed successfully!");
      onUpdateHistory();
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg bg-white max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload an Image</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {message && <p className={`mt-4 text-center ${message.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
    </div>
  );
};

export default ImageUploader;
