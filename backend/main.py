from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
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
async def upload_images(files: List[UploadFile] = File(...)):

    uploaded_files = []

    for file in files:

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        uploaded_files.append(file.filename)

    return {
        "uploaded_files": uploaded_files,
        "status": "uploaded successfully"
    }