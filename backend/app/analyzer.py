import os
from typing import Optional

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


client = genai.Client(api_key=API_KEY)


class Experience(BaseModel):
    role: str = Field(
        description="Job title or role"
    )
    company: str = Field(
        description="Company or organization name"
    )
    duration: str = Field(
        description="Employment duration if available"
    )


class Project(BaseModel):
    name: str = Field(
        description="Project name"
    )
    description: str = Field(
        description="Short project description"
    )


class ResumeData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    skills: list[str] = Field(
        default_factory=list
    )

    education: list[str] = Field(
        default_factory=list
    )

    experience: list[Experience] = Field(
        default_factory=list
    )

    projects: list[Project] = Field(
        default_factory=list
    )

    certifications: list[str] = Field(
        default_factory=list
    )

    summary: Optional[str] = None


def analyze_resume(resume_text: str) -> ResumeData:

    prompt = f"""
You are an expert resume analyzer.

Analyze the following resume text and extract
the information accurately.

IMPORTANT RULES:

1. Do not invent information.
2. If information is missing, return null or an empty list.
3. Extract skills explicitly mentioned in the resume.
4. Extract education information.
5. Extract work experience.
6. Extract projects.
7. Extract certifications.
8. Return only information supported by the resume.

Resume:

{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": ResumeData,
        },
    )

    return ResumeData.model_validate_json(
        response.text
    )