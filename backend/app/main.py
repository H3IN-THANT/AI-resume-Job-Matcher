from fastapi import FastAPI, File, UploadFile, HTTPException
from app.pdf_extractor import extract_text_from_pdf
# from pydantic import BaseModel
from app.analyzer import analyze_resume
from fastapi.middleware.cors import CORSMiddleware
from app.matcher import match_resume_to_jobs

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

@app.post("/match-jobs")
async def match_jobs(resume_data: dict):
    try:
        profile = resume_data.get("profile")
        if not profile:
            raise HTTPException(status_code=400, detail="Missing 'profile' in request body.")

        matches = match_resume_to_jobs(profile)

        return {
            "matches": matches
        }

    except Exception as e:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))