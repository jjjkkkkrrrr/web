# from sqlalchemy import create_engine, Column, Integer, String, DateTime
# from sqlalchemy.orm import sessionmaker, declarative_base
# from datetime import datetime
# import uuid


# # Khai báo lớp cơ sở cho các mô hình
# Base = declarative_base()

# # Định nghĩa mô hình cơ sở dữ liệu
# class ImageProcessingResult(Base):
#     __tablename__ = 'image_processing_results'

#     image_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
#     original_image_path = Column(String(255), nullable=True)
#     processed_image_path = Column(String(255), nullable=True)
#     person_count = Column(Integer, nullable=False)
#     processing_timestamp = Column(DateTime, default=datetime.utcnow)

#     def __repr__(self):
#         return f"<ImageProcessingResult(image_id='{self.image_id}', person_count={self.person_count})>"

# # Cấu hình và kết nối database
# DATABASE_URL = "sqlite:///./image_results.db"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# # Tùy chọn `check_same_thread` chỉ cần thiết cho SQLite khi sử dụng trong môi trường đa luồng như FastAPI

# # Tạo tất cả các bảng đã định nghĩa
# Base.metadata.create_all(engine)

# # Tạo một session để tương tác với DB
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Dependency để lấy Session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class ImageProcessingResult(Base):
    __tablename__ = 'image_processing_results'
    image_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    processed_image_path = Column(String(255), nullable=True)
    person_count = Column(Integer, nullable=False)
    processing_timestamp = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ImageProcessingResult(image_id='{self.image_id}', person_count={self.person_count}, visualized image file path={self.processed_image_path})>"

DATABASE_URL = "sqlite:///./detect.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()