# Sử dụng image Python tiêu chuẩn, có đầy đủ các thư viện cơ bản
FROM python:3.9

# Thiết lập biến môi trường để không có bộ đệm cho các tệp đã biên dịch của Python
ENV PYTHONUNBUFFERED=1

# Cài đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép tệp requirements.txt và cài đặt các dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Cài đặt các thư viện hệ thống cần thiết cho OpenCV và các thư viện xử lý ảnh khác
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng mà ứng dụng backend lắng nghe
EXPOSE 8000

# Lệnh để chạy ứng dụng khi container khởi động
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]