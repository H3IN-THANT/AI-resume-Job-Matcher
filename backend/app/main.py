from typing import Any

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.pdf_extractor import extract_text_from_pdf
from app.analyzer import analyze_resume
from app.matcher import match_resume_to_jobs
from app.advisor import generate_job_advice
from app.job_api import fetch_jobs

app = FastAPI(
    title="AI Resume Job Matcher API"
)


# --------------------------------
# CORS
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# Request Models
# --------------------------------

class MatchJobsRequest(BaseModel):
    profile: dict[str, Any]


class JobAdviceRequest(BaseModel):
    resume: dict[str, Any]
    job: dict[str, Any]


# --------------------------------
# Root
# --------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Resume Job Matcher API is running."
    }


# --------------------------------
# Resume Analysis
# --------------------------------

@app.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...)
):
    # Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF file."
        )

    # Read uploaded file
    file_bytes = await file.read()

    # Extract text
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty or could not be read."
        )

    # Analyze resume using Gemini
    result = analyze_resume(resume_text)

    return {
        "filename": file.filename,
        "profile": result.model_dump()
    }


# --------------------------------
# Job Matching
# --------------------------------

@app.post("/match-jobs")
async def match_jobs(
    request: MatchJobsRequest
):
    try:
        profile = request.profile

        # --------------------------------
        # Build search query from resume
        # --------------------------------

        skills = profile.get(
            "skills",
            []
        )

        if skills:
            query = " ".join(
                skills[:5]
            )
        else:
            query = "software developer"

        print(
            "JOB SEARCH QUERY:",
            query
        )

        # --------------------------------
        # Fetch real jobs from Adzuna
        # --------------------------------

        jobs = fetch_jobs(
            query=query,
            country="in",
            results_per_page=20
        )

        print(
            "REAL JOBS FOUND:",
            len(jobs)
        )

        # --------------------------------
        # Fallback to jobs.json
        # --------------------------------

        if not jobs:

            print(
                "No real jobs found."
                " Using jobs.json fallback."
            )

            matches = match_resume_to_jobs(
                profile
            )

        else:

            matches = match_resume_to_jobs(
                profile,
                jobs
            )

        return {
            "jobs": matches
        }

    except Exception as e:

        print(
            "MATCHING ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Job matching failed: {str(e)}"
        )


# --------------------------------
# AI Job Advice
# --------------------------------

@app.post("/job-advice")
async def job_advice(
    request: JobAdviceRequest
):
    try:
        # Extract profile from resume response
        profile = request.resume.get("profile")

        if not profile:
            raise HTTPException(
                status_code=400,
                detail="Missing 'profile' inside resume data."
            )

        # Generate AI career advice
        advice = generate_job_advice(
            resume_profile=profile,
            job=request.job
        )

        return {
            "advice": advice.model_dump()
        }

    except HTTPException:
        raise

    except Exception as e:
        print("JOB ADVICE ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate job advice: {str(e)}"
        )

