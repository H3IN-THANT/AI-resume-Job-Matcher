from fastapi import FastAPI, File, UploadFile, HTTPException
from app.pdf_extractor import extract_text_from_pdf
# from pydantic import BaseModel
from app.analyzer import analyze_resume
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=" AI Resume Job Matcher API "
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "AI Resume Job Matcher API is running."
    }


@app.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...)
):
    #Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

    file_bytes = await file.read()

    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(status_code=400, detail="The uploaded PDF is empty or could not be read.")

    result = analyze_resume(resume_text)

    return {
        "filename" : file.filename,
        "profile" : result.model_dump()
    }