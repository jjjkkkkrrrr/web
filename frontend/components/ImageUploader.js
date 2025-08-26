
"use client";

import { useState } from 'react';

const API_URL = 'http://localhost:8000';

const ImageUploader = ({ onUpdateHistory }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [personCount, setPersonCount] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null); // State mới để lưu URL của ảnh

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setPersonCount(null);
    setProcessedImageUrl(null); // Reset URL ảnh khi chọn file mới
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Vui lòng chọn một file ảnh trước!");
      return;
    }

    setLoading(true);
    setMessage('');
    setPersonCount(null);
    setProcessedImageUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/get_predictions`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(errorDetail.detail || "Có lỗi khi xử lý ảnh");
      }

      // Lấy số người và ID ảnh từ header của response
      const count = response.headers.get("Person_Count");
      const imageId = response.headers.get("image_id");
      
      setPersonCount(parseInt(count, 10));

      // Xây dựng URL của ảnh và lưu vào state
      if (imageId) {
        setProcessedImageUrl(`${API_URL}/images/${imageId}`);
      }
      
      setMessage("Ảnh đã được tải lên và xử lý thành công!");
      onUpdateHistory();
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Lỗi: ${err.message}`);
      } else {
        setMessage("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg bg-white max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Tải lên một ảnh</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <button 
          type="submit" 
          disabled={loading || !file}
          className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Gửi"}
        </button>
      </form>
      {message && <p className={`mt-4 text-center ${message.startsWith("Lỗi") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
      
      {/* Hiển thị số người nếu có */}
      {personCount !== null && (
        <p className="mt-4 text-lg font-bold text-center text-blue-600">
          Số người được phát hiện: {personCount}
        </p>
      )}

      {/* Hiển thị ảnh đã xử lý nếu có URL */}
      {processedImageUrl && (
        <div className="mt-6 border rounded-lg overflow-hidden shadow-lg">
          <img 
            src={processedImageUrl} 
            alt="Ảnh đã xử lý" 
            className="w-full h-auto object-cover" 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
