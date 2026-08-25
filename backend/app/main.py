from pathlib import Path
import shutil

from fastapi import FastAPI, UploadFile, File

from app.resume_parser import extract_text_from_pdf


app = FastAPI(
    title="AI Resume Job Matcher API",
    version="1.0.0"
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
def root():
    return {
        "message": "AI Resume Job Matcher API is running"
    }


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(str(file_path))

    return {
        "filename": file.filename,
        "text": text
    }