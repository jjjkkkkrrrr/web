
import cv2
import numpy as np
from io import BytesIO
import os

from ultralytics import YOLO

# Tải mô hình YOLOv8n đã huấn luyện sẵn
model = YOLO("yolov8n.pt")

# Sửa hàm để nhận dữ liệu nhị phân trực tiếp thay vì đường dẫn
def detect_people(image_data):
    """
    Nhận dữ liệu nhị phân của ảnh, chạy mô hình YOLOv8 để phát hiện người,
    vẽ các hộp giới hạn và trả về ảnh đã trực quan hóa cùng số lượng người.
    """
    try:
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return None, 0, "Không thể giải mã ảnh."

        # Chạy dự đoán trên ảnh
        results = model.predict(img, verbose=False) # Thêm verbose=False để giảm log
        if not results:
            return None, 0, "Không có kết quả phát hiện nào."

        # Lấy đối tượng Results đầu tiên
        first_result = results[0]
        boxes = first_result.boxes.xyxy.cpu().numpy()
        class_ids = first_result.boxes.cls.cpu().numpy()
        names = first_result.names

        person_count = 0
        
        # Vẽ hộp giới hạn và nhãn lên ảnh
        for i in range(len(boxes)):
            x_min, y_min, x_max, y_max = boxes[i]
            class_id = int(class_ids[i])
            
            class_name = names.get(class_id)
            
            if class_name == 'person':
                person_count += 1
                cv2.rectangle(img, (int(x_min), int(y_min)), (int(x_max), int(y_max)), (0, 255, 0), 2)
                label = f'Person '
                
                cv2.putText(img, label, (int(x_min), int(y_min) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Lưu ảnh đã được vẽ
        ret, buffer = cv2.imencode('.jpg', img)
        if not ret:
            return None, 0, "Không thể mã hóa ảnh."
        
        return BytesIO(buffer), person_count, None

    except Exception as e:
        return None, 0, str(e)

def main():
    # ----------------------------------------------------
    # THAY THẾ DÒNG NÀY BẰNG ĐƯỜNG DẪN THỰC TẾ ĐẾN TỆP ẢNH CỦA BẠN
    # VÍ DỤ: image_path = "image.jpg"
    # ----------------------------------------------------
    image_path = r"C:\Users\khanhtruyen\Desktop\test2\fastapi\test.jpg"

    if not os.path.exists(image_path):
        print(f"Lỗi: Không tìm thấy tệp '{image_path}'.")
        return

    print(f"Đang xử lý ảnh: {image_path}...")
    
    # Đọc tệp ảnh dưới dạng dữ liệu nhị phân
    with open(image_path, "rb") as f:
        image_data = f.read()

    # Gọi hàm phát hiện
    visualized_image_data, person_count, error = detect_people(image_data)

    if error:
        print(f"Lỗi: {error}")
        return

    # Lưu ảnh đã được xử lý
    output_path = "detected_" + os.path.basename(image_path)
    with open(output_path, "wb") as f:
        f.write(visualized_image_data.getvalue())

    print("-" * 30)
    print(f"✅ Phát hiện hoàn tất.")
    print(f"    - Số lượng người: {person_count}")
    print(f"    - Ảnh đã xử lý được lưu tại: {output_path}")

if __name__ == "__main__":
    main()
