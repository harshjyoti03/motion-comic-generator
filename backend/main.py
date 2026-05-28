from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services.ocr_service import extract_text

import shutil
import os

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

@app.get("/")
def home():
    return {"message": "Motion Comic API Running"}

@app.post("/upload")
async def upload_images(
    files: list[UploadFile] = File(...)
):

    uploaded_results = []

    for file in files:

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # OCR extraction
        extracted_text = extract_text(file_path)

        uploaded_results.append({
            "filename": file.filename,
            "ocr_text": extracted_text
        })

    return {
        "results": uploaded_results,
        "status": "success"
    }