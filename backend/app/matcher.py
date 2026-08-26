import json
import re
from pathlib import Path


# -----------------------------
# Load jobs
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent
JOBS_FILE = BASE_DIR / "jobs.json"


with open(JOBS_FILE, "r", encoding="utf-8") as file:
    JOBS = json.load(file)


# -----------------------------
# Helper functions
# -----------------------------

def normalize_text(text):
    """Convert text to lowercase and normalize spaces."""
    if not text:
        return ""

    return re.sub(r"\s+", " ", str(text).lower()).strip()


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
        len(matched_skills) /
        len(job_skills)
    ) * 100

    return score, matched_skills, missing_skills


# -----------------------------
# Education matching
# -----------------------------

def calculate_education_match(resume_profile, job):
    resume_education = normalize_list(
        resume_profile.get("education", [])
    )

    job_education = normalize_list(
        job.get("education", [])
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

def calculate_experience_match(resume_profile, job):
    experience = resume_profile.get(
        "experience",
        []
    )

    if not experience:
        return 0

    required_experience = normalize_text(
        job.get("experience", "")
    )

    # MVP approach:
    # If resume has experience and job
    # accepts 0-2 years, consider it a match.
    if "0-2" in required_experience:
        return 100

    return 50


# -----------------------------
# Keyword matching
# -----------------------------

def calculate_keyword_match(resume_profile, job):
    resume_text_parts = []

    resume_text_parts.extend(
        resume_profile.get("skills", [])
    )

    resume_text_parts.extend(
        resume_profile.get("education", [])
    )

    resume_text_parts.extend(
        resume_profile.get("certifications", [])
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
            " ".join(job.get("skills", []))
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
        len(matched_keywords) /
        len(job_keywords)
    ) * 100


# -----------------------------
# Final score
# -----------------------------

def calculate_match_score(resume_profile, job):
    skill_score, matched_skills, missing_skills = (
        calculate_skill_match(
            resume_profile,
            job
        )
    )

    experience_score = calculate_experience_match(
        resume_profile,
        job
    )

    education_score = calculate_education_match(
        resume_profile,
        job
    )

    keyword_score = calculate_keyword_match(
        resume_profile,
        job
    )

    # Weighted scoring
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
        "match_score": round(final_score, 2),
        "skill_score": round(skill_score, 2),
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
# Match resume against all jobs
# -----------------------------

def match_resume_to_jobs(resume_profile):
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

    results = match_resume_to_jobs(
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