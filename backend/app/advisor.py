import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


load_dotenv()


API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. "
        "Please add it to your .env file."
    )


client = genai.Client(
    api_key=API_KEY
)


# --------------------------------
# AI Advice Response Models
# --------------------------------

class LearningItem(BaseModel):
    skill: str = Field(
        description="Skill that the candidate should learn"
    )

    reason: str = Field(
        description="Why this skill is important for the target job"
    )

    priority: str = Field(
        description="Priority level: High, Medium, or Low"
    )


class JobAdvice(BaseModel):
    why_you_match: str = Field(
        description="A concise explanation of why the candidate matches the job"
    )

    strengths: list[str] = Field(
        default_factory=list,
        description="The candidate's strongest relevant qualifications"
    )

    skill_gaps: list[str] = Field(
        default_factory=list,
        description="Important skills missing from the candidate's resume"
    )

    what_to_learn: list[LearningItem] = Field(
        default_factory=list,
        description="Recommended skills to learn, with reasons and priorities"
    )

    suggested_project: str = Field(
        description="A practical project the candidate could build to improve their fit"
    )


# --------------------------------
# Generate AI Job Advice
# --------------------------------

def generate_job_advice(
    resume_profile: dict,
    job: dict
) -> JobAdvice:

    matched_skills = job.get(
        "matched_skills",
        []
    )

    missing_skills = job.get(
        "missing_skills",
        []
    )

    prompt = f"""
You are an expert AI career advisor.

Analyze the candidate's resume and the target job.

Your task is to explain why the candidate matches
the job and what they should learn to become a
stronger candidate.

IMPORTANT RULES:

1. Use only information provided in the resume and job data.
2. Do not invent experience, education, certifications, or skills.
3. Be realistic and career-focused.
4. Explain the candidate's strongest relevant qualifications.
5. Identify important skill gaps.
6. Recommend practical skills to learn.
7. Give each learning recommendation a priority:
   High, Medium, or Low.
8. Suggest one practical project related to the target job.
9. Keep explanations concise and useful.
10. Do not claim the candidate is fully qualified unless
    the provided information supports it.

CANDIDATE RESUME:

{resume_profile}


TARGET JOB:

{job}


MATCHED SKILLS:

{matched_skills}


MISSING SKILLS:

{missing_skills}


Generate the structured career advice.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": JobAdvice,
        },
    )

    return JobAdvice.model_validate_json(
        response.text
    )