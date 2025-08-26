import React from 'react';

// URL gốc của backend
const API_URL = 'http://localhost:8000';

const HistoryTable = ({ data, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Ảnh
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ảnh đã xử lý
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số người phát hiện
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Xóa</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                Chưa có dữ liệu lịch sử.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.image_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.image_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 w-20 h-20">
                    <img 
                      className="w-full h-full object-cover rounded-md" 
                      src={`${API_URL}${item.processed_image_url}`} 
                      alt={`Ảnh đã xử lý - ${item.image_id}`} 
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.Person_Count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.processing_timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onDelete(item.image_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
