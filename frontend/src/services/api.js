const API_URL = "http://127.0.0.1:8000";


export async function analyzeResume(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/analyze-resume`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to analyze resume"
    );
  }

  return await response.json();
}


export async function matchJobs(resumeData) {
  const response = await fetch(
    `${API_URL}/match-jobs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile: resumeData.profile,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
      "Failed to match jobs"
    );
  }

  const data = await response.json();

  console.log(
    "JOB MATCH API RESPONSE:",
    data
  );

  return data.jobs;
}
export async function getJobAdvice(
  resumeData,
  job
) {
  const response = await fetch(
    `${API_URL}/job-advice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume: resumeData,
        job: job,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
      "Failed to generate job advice"
    );
  }

  const data = await response.json();

  console.log(
    "JOB ADVICE RESPONSE:",
    data
  );

  return data.advice;
}