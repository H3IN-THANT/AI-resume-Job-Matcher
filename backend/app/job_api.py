import os
from typing import Any

import requests
from dotenv import load_dotenv


load_dotenv()


ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")


if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
    raise RuntimeError(
        "ADZUNA_APP_ID and ADZUNA_APP_KEY must be set "
        "in your .env file."
    )


# --------------------------------
# Configuration
# --------------------------------

ADZUNA_BASE_URL = (
    "https://api.adzuna.com/v1/api"
)


# --------------------------------
# Helpers
# --------------------------------

def normalize_text(text: Any) -> str:
    if not text:
        return ""

    return str(text).strip()


def extract_company(job: dict) -> str:
    company = job.get("company")

    if isinstance(company, dict):
        return normalize_text(
            company.get("display_name")
        )

    return normalize_text(company)


def extract_location(job: dict) -> str:
    location = job.get("location")

    if isinstance(location, dict):
        return normalize_text(
            location.get("display_name")
        )

    return normalize_text(location)


# --------------------------------
# Fetch jobs from Adzuna
# --------------------------------

def fetch_jobs(
    query: str,
    country: str = "in",
    location: str | None = None,
    page: int = 1,
    results_per_page: int = 20,
) -> list[dict]:

    url = (
        f"{ADZUNA_BASE_URL}/jobs/"
        f"{country}/search/{page}"
    )

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": results_per_page,
        "what": query,
        "content-type": "application/json",
    }

    if location:
        params["where"] = location

    try:
        response = requests.get(
            url,
            params=params,
            timeout=15,
        )

        response.raise_for_status()

        data = response.json()

    except requests.RequestException as error:
        print(
            "ADZUNA API ERROR:",
            error
        )

        raise RuntimeError(
            "Unable to fetch jobs from Adzuna."
        )


    results = data.get(
        "results",
        []
    )

    jobs = []

    for job in results:

        normalized_job = {
            "id": str(
                job.get("id", "")
            ),

            "title": normalize_text(
                job.get("title")
            ),

            "company": extract_company(
                job
            ),

            "location": extract_location(
                job
            ),

            "description": normalize_text(
                job.get("description")
            ),

            "job_url": normalize_text(
                job.get("redirect_url")
            ),

            "source": "Adzuna",

            "salary_min": job.get(
                "salary_min"
            ),

            "salary_max": job.get(
                "salary_max"
            ),

            "salary_predicted": job.get(
                "salary_is_predicted"
            ),

            "contract_type": normalize_text(
                job.get("contract_type")
            ),

            "contract_time": normalize_text(
                job.get("contract_time")
            ),

            "created": normalize_text(
                job.get("created")
            ),
        }

        jobs.append(
            normalized_job
        )

    return jobs


# --------------------------------
# Test
# --------------------------------

if __name__ == "__main__":

    jobs = fetch_jobs(
        query="python developer",
        country="in",
        results_per_page=5,
    )

    for job in jobs:

        print("\n-------------------------")

        print(
            "Title:",
            job["title"]
        )

        print(
            "Company:",
            job["company"]
        )

        print(
            "Location:",
            job["location"]
        )

        print(
            "Source:",
            job["source"]
        )

        print(
            "URL:",
            job["job_url"]
        )

        print(
            "Salary:",
            job["salary_min"],
            "-",
            job["salary_max"]
        )  