# from fastapi import FastAPI, UploadFile, HTTPException, BackgroundTasks, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from starlette.responses import StreamingResponse
# import uuid
# import os
# import io

# from train import detect_people
# from database import get_db, ImageProcessingResult, SessionLocal 

# app = FastAPI()  

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=['http://localhost:3000'],
#     allow_credentials=True,
#     allow_methods=['*'],
#     allow_headers=['*']
# )

# # Thư mục để lưu ảnh đã xử lý
# PROCESSED_IMAGES_DIR = "processed_images"
# os.makedirs(PROCESSED_IMAGES_DIR, exist_ok=True)

# def _save_to_database(image_id: str, processed_image_path: str, person_count: int):
#     db = next(get_db())
#     try:
#         new_result = ImageProcessingResult(
#             image_id=image_id,
#             processed_image_path=processed_image_path,
#             person_count=person_count
#         )
#         db.add(new_result)
#         db.commit()
#     except Exception as e:
#         db.rollback()
#         print(f"Lỗi khi lưu dữ liệu vào database: {e}")
#     finally:
#         db.close()

# # Các endpoint của bạn
# @app.post("/get_predictions")

# async def get_predictions(file:UploadFile, background_tasks: BackgroundTasks):
#     try:
#         # Đọc nội dung tệp đã tải lên
#         image = await file.read()
        
        
#         # Gọi hàm phát hiện
#         visualized_image_data, person_count, error = detect_people(image)

        

#         if error:
#             raise HTTPException(status_code=400, detail=error)
        
#         # Tạo một ID duy nhất cho ảnh này
#         image_id = str(uuid.uuid4())

#         # Lưu ảnh đã xử lý vào hệ thống tệp và lấy đường dẫn
#         output_filename = f"{image_id}.jpg"
#         processed_image_path = os.path.join(PROCESSED_IMAGES_DIR, output_filename)
#         with open(processed_image_path, "wb") as f:
#             f.write(visualized_image_data.getbuffer())

#         # Lưu thông tin vào database
#         background_tasks.add_task(_save_to_database, image_id, processed_image_path, person_count)

#         # Trả về StreamingResponse với dữ liệu ảnh và số lượng người 
#         return StreamingResponse(
#             io.BytesIO(visualized_image_data.getvalue()),
#             media_type="image/jpeg",
#             headers={"Person_Count": str(person_count)}
#         )
        

#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Internal Server Error")
    
# @app.get("/results")
# def get_results(db: SessionLocal = Depends(get_db)):
#     """
#     Endpoint để lấy tất cả các bản ghi từ database.
#     """
#     try:
#         results = db.query(ImageProcessingResult).all()
        
#         response_data = []
#         for r in results:
#             response_data.append({
#                 "image_id": r.image_id,
#                 "person_count": r.person_count,
#                 "processed_image_path": r.processed_image_path,
#                 "processing_timestamp": r.processing_timestamp.isoformat()
#             })
#         return {"data": response_data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error retrieving results: {str(e)}")


from fastapi import FastAPI, UploadFile, HTTPException, BackgroundTasks, Depends, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import uuid
import io
import os
from typing import Optional

from train import detect_people
from database import get_db, ImageProcessingResult, SessionLocal

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
    expose_headers=["Person_Count", "image_id"]
)

PROCESSED_IMAGES_DIR = "processed_images"
os.makedirs(PROCESSED_IMAGES_DIR, exist_ok=True)

def _save_to_database(image_id: str, processed_image_path: str, person_count: int):
    db = next(get_db())
    try:
        new_result = ImageProcessingResult(
            image_id=image_id,
            processed_image_path=processed_image_path,
            person_count=person_count
        )
        db.add(new_result)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Lỗi khi lưu dữ liệu vào database: {e}")
    finally:
        db.close()

@app.post("/get_predictions")
async def get_predictions(file: UploadFile, background_tasks: BackgroundTasks):
    try:
        image = await file.read()
        visualized_image_data, person_count, error = detect_people(image)

        if error:
            raise HTTPException(status_code=400, detail=error)

        image_id = str(uuid.uuid4())
        output_filename = f"{image_id}.jpg"
        processed_image_path = os.path.join(PROCESSED_IMAGES_DIR, output_filename)
        with open(processed_image_path, "wb") as f:
            f.write(visualized_image_data.getbuffer())

        background_tasks.add_task(_save_to_database, image_id, processed_image_path, person_count)

        return StreamingResponse(
            io.BytesIO(visualized_image_data.getvalue()),
            media_type="image/jpeg",
            headers={"image_id": image_id, "Person_Count": str(person_count)}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Thêm endpoint để truy cập ảnh đã xử lý
@app.get("/images/{image_id}")
async def get_image(image_id: str):
    image_path = os.path.join(PROCESSED_IMAGES_DIR, f"{image_id}.jpg")
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    with open(image_path, "rb") as f:
        image_data = f.read()
    
    return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")

# Endpoint đã được nâng cấp để hỗ trợ phân trang, tìm kiếm, lọc
@app.get("/results")
def get_results(
    db: SessionLocal = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    query: Optional[str] = Query(None),
    min_people: Optional[int] = Query(None, ge=0),
    start_date: Optional[datetime] = Query(None)
):
    try:
        # Bắt đầu truy vấn
        base_query = db.query(ImageProcessingResult)
        
        # Áp dụng bộ lọc
        if min_people is not None:
            base_query = base_query.filter(ImageProcessingResult.person_count >= min_people)
        
        if start_date is not None:
            base_query = base_query.filter(ImageProcessingResult.processing_timestamp >= start_date)

        # Áp dụng tìm kiếm
        if query:
            base_query = base_query.filter(ImageProcessingResult.image_id.contains(query))

        # Phân trang
        total_count = base_query.count()
        skip = (page - 1) * page_size
        results = base_query.offset(skip).limit(page_size).all()
        
        response_data = []
        for r in results:
            response_data.append({
                "image_id": r.image_id,
                "Person_Count": r.person_count,
                "processed_image_url": f"/images/{r.image_id}", # Tạo URL động
                "processing_timestamp": r.processing_timestamp.isoformat()
            })
        
        return {
            "total_records": total_count,
            "page": page,
            "page_size": page_size,
            "data": response_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving results: {str(e)}")
    
@app.delete("/results/{image_id}")
async def delete_result(
    image_id: str = Path(..., title="ID của ảnh cần xóa"),
    db: SessionLocal = Depends(get_db)
):
    try:
        # Tìm bản ghi trong database
        result_to_delete = db.query(ImageProcessingResult).filter(ImageProcessingResult.image_id == image_id).first()

        # Kiểm tra nếu bản ghi không tồn tại
        if not result_to_delete:
            raise HTTPException(status_code=404, detail="Result not found")

        # Lấy đường dẫn file ảnh
        processed_image_path = result_to_delete.processed_image_path

        # Xóa bản ghi khỏi database
        db.delete(result_to_delete)
        db.commit()

        # Xóa file ảnh tương ứng trên hệ thống tệp
        if os.path.exists(processed_image_path):
            os.remove(processed_image_path)
        else:
            # Ghi log nếu file không tồn tại, nhưng vẫn xóa bản ghi trong db
            print(f"Cảnh báo: Tệp {processed_image_path} không tồn tại.")

        return {"message": "Record deleted successfully"}

    except HTTPException as e:
        # Trả về lỗi 404 nếu không tìm thấy
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa bản ghi: {str(e)}")