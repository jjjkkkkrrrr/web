// // "use client";

// // import { useState } from 'react';

// // const API_URL = 'http://localhost:8000';

// // const ImageUploader = () => {
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [error, setError] = useState(null);

// //   const handleFileChange = (e) => {
// //     setFile(e.target.files[0]);
// //     setResult(null);
// //     setError(null);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!file) {
// //       setError("Please select an image file.");
// //       return;
// //     }

// //     setLoading(true);
// //     setResult(null);
// //     setError(null);

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const response = await fetch(`${API_URL}/get_predictions`, {
// //         method: 'POST',
// //         body: formData,
// //       });

// //       if (!response.ok) {
// //         const errorDetail = await response.json();
// //         throw new Error(errorDetail.detail || "Error processing image");
// //       }

// //       // Lấy headers để có thông tin về số người
// //       const personCount = response.headers.get('Person_Count');

// //       // Tạo Blob từ response để hiển thị ảnh
// //       const imageBlob = await response.blob();
// //       const imageUrl = URL.createObjectURL(imageBlob);

// //       setResult({
// //         imageUrl,
// //         personCount,
// //       });

// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto my-10">
// //       <h2 className="text-2xl font-bold mb-4 text-center">Upload Image to Detect</h2>
// //       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
// //         <input 
// //           type="file" 
// //           onChange={handleFileChange} 
// //           accept="image/*"
// //           className="block w-full text-sm text-slate-500
// //             file:mr-4 file:py-2 file:px-4
// //             file:rounded-full file:border-0
// //             file:text-sm file:font-semibold
// //             file:bg-blue-50 file:text-blue-700
// //             hover:file:bg-blue-100"
// //         />
// //         <button 
// //           type="submit" 
// //           disabled={loading || !file}
// //           className="bg-green-500 text-white p-2 rounded-md font-semibold hover:bg-green-600 disabled:bg-gray-400"
// //         >
// //           {loading ? "Processing..." : "Detect people"}
// //         </button>
// //       </form>

// //       {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

// //       {result && (
// //         <div className="mt-6 text-center">
// //           <h3 className="text-xl font-semibold mb-2">Detection results</h3>
// //           <p className="text-lg"><span className="font-bold text-blue-600">Number of people detected: {result.personCount}</span></p>
// //           <img src={result.imageUrl} alt="Photo processed" className="mt-4 max-w-full h-auto rounded-lg mx-auto" />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ImageUploader;

// "use client";

// import { useState } from 'react';

// const API_URL = 'http://localhost:8000';

// const ImageUploader = () => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setResult(null);
//     setError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select an image file.");
//       return;
//     }

//     setLoading(true);
//     setResult(null);
//     setError(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch(`${API_URL}/get_predictions`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorDetail = await response.json();
//         throw new Error(errorDetail.detail || "Error processing image");
//       }

//       // Lấy headers để có thông tin về số người và image_id
//       const personCount = response.headers.get('Person_Count');
//       const imageId = response.headers.get('image_id');

//       // Tạo Blob từ response để hiển thị ảnh
//       const imageBlob = await response.blob();
//       const imageUrl = URL.createObjectURL(imageBlob);

//       setResult({
//         imageUrl,
//         personCount,
//         imageId,
//       });

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!result || !result.imageId) {
//       setError("No image to delete.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/results/${result.imageId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorDetail = await response.json();
//         throw new Error(errorDetail.detail || "Error deleting image");
//       }

//       // Xóa kết quả khỏi state sau khi xóa thành công
//       setResult(null);
//       alert("Image deleted successfully!");

//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto my-10">
//       <h2 className="text-2xl font-bold mb-4 text-center">Upload Image to Detect</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input 
//           type="file" 
//           onChange={handleFileChange} 
//           accept="image/*"
//           className="block w-full text-sm text-slate-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded-full file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100"
//         />
//         <button 
//           type="submit" 
//           disabled={loading || !file}
//           className="bg-green-500 text-white p-2 rounded-md font-semibold hover:bg-green-600 disabled:bg-gray-400"
//         >
//           {loading ? "Processing..." : "Detect people"}
//         </button>
//       </form>

//       {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

//       {result && (
//         <div className="mt-6 text-center">
//           <h3 className="text-xl font-semibold mb-2">Detection results</h3>
//           {/* Sửa đổi để in đậm cả dòng */}
//           <p className="text-lg">
//             <span className="font-bold text-blue-600">Number of people detected: {result.personCount}</span>
//           </p>
//           <img src={result.imageUrl} alt="Photo processed" className="mt-4 max-w-full h-auto rounded-lg mx-auto" />
          
//           {/* Thêm nút xóa */}
//           <button
//             onClick={handleDelete}
//             className="mt-4 bg-red-500 text-white p-2 rounded-md font-semibold hover:bg-red-600"
//           >
//             Delete Image
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;

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