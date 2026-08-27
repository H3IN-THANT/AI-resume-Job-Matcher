import json
import re
import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


# -----------------------------
# Environment
# -----------------------------

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. "
        "Please add it to your .env file."
    )


client = genai.Client(api_key=API_KEY)


# -----------------------------
# Load jobs
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent
JOBS_FILE = BASE_DIR / "jobs.json"


with open(JOBS_FILE, "r", encoding="utf-8") as file:
    JOBS = json.load(file)


# -----------------------------
# Gemini Insight Model
# -----------------------------

class MatchInsights(BaseModel):
    why_you_match: list[str] = Field(
        default_factory=list,
        description=(
            "Specific reasons why the candidate "
            "matches this job"
        )
    )

    skill_gaps: list[str] = Field(
        default_factory=list,
        description=(
            "Important skills the candidate is "
            "missing for this job"
        )
    )

    what_to_learn: list[str] = Field(
        default_factory=list,
        description=(
            "Practical learning recommendations "
            "for improving job readiness"
        )
    )


# -----------------------------
# Helper functions
# -----------------------------

def normalize_text(text):
    """Convert text to lowercase and normalize spaces."""

    if not text:
        return ""

    return re.sub(
        r"\s+",
        " ",
        str(text).lower()
    ).strip()


def normalize_list(items):
    """Normalize a list of strings."""

    if not items:
        return []

    return [
        normalize_text(item)
        for item in items
        if item
    ]


# -----------------------------
# Skill matching
# -----------------------------

def calculate_skill_match(resume_profile, job):

    resume_skills = set(
        normalize_list(
            resume_profile.get("skills", [])
        )
    )

    job_skills = set(
        normalize_list(
            job.get("skills", [])
        )
    )

    if not job_skills:
        return 0, [], []

    matched_skills = sorted(
        resume_skills.intersection(job_skills)
    )

    missing_skills = sorted(
        job_skills - resume_skills
    )

    score = (
        len(matched_skills)
        / len(job_skills)
    ) * 100

    return (
        score,
        matched_skills,
        missing_skills
    )


# -----------------------------
# Education matching
# -----------------------------

def calculate_education_match(
    resume_profile,
    job
):

    resume_education = normalize_list(
        resume_profile.get(
            "education",
            []
        )
    )

    job_education = normalize_list(
        job.get(
            "education",
            []
        )
    )

    if not job_education:
        return 100

    for resume_item in resume_education:

        for job_item in job_education:

            if (
                resume_item in job_item
                or job_item in resume_item
            ):
                return 100

    return 0


# -----------------------------
# Experience matching
# -----------------------------

def calculate_experience_match(
    resume_profile,
    job
):

    experience = resume_profile.get(
        "experience",
        []
    )

    if not experience:
        return 0

    required_experience = normalize_text(
        job.get(
            "experience",
            ""
        )
    )

    # MVP approach
    if "0-2" in required_experience:
        return 100

    return 50


# -----------------------------
# Keyword matching
# -----------------------------

def calculate_keyword_match(
    resume_profile,
    job
):

    resume_text_parts = []

    resume_text_parts.extend(
        resume_profile.get(
            "skills",
            []
        )
    )

    resume_text_parts.extend(
        resume_profile.get(
            "education",
            []
        )
    )

    resume_text_parts.extend(
        resume_profile.get(
            "certifications",
            []
        )
    )

    resume_text = normalize_text(
        " ".join(
            str(item)
            for item in resume_text_parts
        )
    )

    job_text = normalize_text(
        " ".join([
            job.get("title", ""),
            job.get("description", ""),
            " ".join(
                job.get(
                    "skills",
                    []
                )
            )
        ])
    )

    if not job_text:
        return 0

    job_keywords = set(
        re.findall(
            r"\b[a-zA-Z][a-zA-Z0-9+#.-]*\b",
            job_text
        )
    )

    if not job_keywords:
        return 0

    matched_keywords = [
        keyword
        for keyword in job_keywords
        if keyword.lower() in resume_text
    ]

    return (
        len(matched_keywords)
        / len(job_keywords)
    ) * 100


# -----------------------------
# Final score
# -----------------------------

def calculate_match_score(
    resume_profile,
    job
):

    (
        skill_score,
        matched_skills,
        missing_skills
    ) = calculate_skill_match(
        resume_profile,
        job
    )

    experience_score = (
        calculate_experience_match(
            resume_profile,
            job
        )
    )

    education_score = (
        calculate_education_match(
            resume_profile,
            job
        )
    )

    keyword_score = (
        calculate_keyword_match(
            resume_profile,
            job
        )
    )

    # -------------------------
    # Weighted scoring
    # -------------------------

    final_score = (
        skill_score * 0.50
        + experience_score * 0.20
        + education_score * 0.10
        + keyword_score * 0.10
        + 50 * 0.10
    )

    return {
        "job_id": job["id"],
        "title": job["title"],
        "company": job["company"],
        "location": job["location"],

        "match_score": round(
            final_score,
            2
        ),

        "skill_score": round(
            skill_score,
            2
        ),

        "experience_score": round(
            experience_score,
            2
        ),

        "education_score": round(
            education_score,
            2
        ),

        "keyword_score": round(
            keyword_score,
            2
        ),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,
    }


# -----------------------------
# Gemini Explanation
# -----------------------------

def generate_match_insights(
    resume_profile,
    job,
    match_result
):

    prompt = f"""
You are an expert career advisor.

Analyze the candidate's resume and the target job.

Candidate Resume Profile:
{json.dumps(
    resume_profile,
    indent=2,
    ensure_ascii=False,
)}

Job:
{json.dumps(
    job,
    indent=2,
    ensure_ascii=False,
)}

Matching Results:
{json.dumps(
    match_result,
    indent=2,
    ensure_ascii=False,
)}

Generate useful career guidance.

IMPORTANT RULES:

1. Base your explanation only on the provided
   resume and job information.
2. Do not invent experience, skills, education,
   or achievements.
3. Explain WHY the candidate matches this job.
4. Identify the most important skill gaps.
5. Give practical recommendations for WHAT TO LEARN.
6. Keep recommendations relevant to this specific job.
7. Prioritize the most valuable missing skills.
8. Do not recommend skills that are already clearly
   present in the resume.
9. Keep each explanation concise and professional.
10. Return only structured JSON matching the schema.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": MatchInsights,
        },
    )

    return MatchInsights.model_validate_json(
        response.text
    )


# -----------------------------
# Match resume against all jobs
# -----------------------------

def match_resume_to_jobs(
    resume_profile
):

    results = []

    for job in JOBS:

        result = calculate_match_score(
            resume_profile,
            job
        )

        results.append(result)

    # Highest score first
    results.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return results


# -----------------------------
# Match + AI Insights
# -----------------------------

def match_resume_with_insights(
    resume_profile
):

    results = match_resume_to_jobs(
        resume_profile
    )

    enhanced_results = []

    for result in results:

        # Find original job
        job = next(
            (
                item
                for item in JOBS
                if item["id"] == result["job_id"]
            ),
            None
        )

        if not job:
            enhanced_results.append(
                result
            )
            continue

        try:

            insights = generate_match_insights(
                resume_profile,
                job,
                result
            )

            result["why_you_match"] = (
                insights.why_you_match
            )

            result["skill_gaps"] = (
                insights.skill_gaps
            )

            result["what_to_learn"] = (
                insights.what_to_learn
            )

        except Exception as error:

            print(
                "Gemini insight error:",
                error
            )

            # Fallback if Gemini fails
            result["why_you_match"] = []

            result["skill_gaps"] = (
                result.get(
                    "missing_skills",
                    []
                )
            )

            result["what_to_learn"] = (
                result.get(
                    "missing_skills",
                    []
                )
            )

        enhanced_results.append(
            result
        )

    return enhanced_results


# -----------------------------
# Local test
# -----------------------------

if __name__ == "__main__":

    test_resume = {

        "skills": [
            "Python",
            "FastAPI",
            "Git",
            "SQL"
        ],

        "education": [
            "Computer Science"
        ],

        "experience": [
            {
                "role": "Backend Developer",
                "company": "ABC",
                "duration": "1 year"
            }
        ],

        "certifications": [
            "AWS"
        ]
    }

    results = match_resume_with_insights(
        test_resume
    )

    for result in results:

        print("\n-------------------------")

        print(
            result["title"],
            "→",
            result["match_score"],
            "%"
        )

        print(
            "Matched:",
            result["matched_skills"]
        )

        print(
            "Missing:",
            result["missing_skills"]
        )

        print(
            "\nWhy You Match:"
        )

        for reason in result.get(
            "why_you_match",
            []
        ):
            print(
                "-",
                reason
            )

        print(
            "\nSkill Gaps:"
        )

        for skill in result.get(
            "skill_gaps",
            []
        ):
            print(
                "-",
                skill
            )

        print(
            "\nWhat To Learn:"
        )

        for item in result.get(
            "what_to_learn",
            []
        ):
            print(
                "-",
                item
            )