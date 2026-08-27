const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeResume(file) {
  const formData = new FormData();

  formData.append("file", file);

  // 1. Analyze resume
  const response = await fetch(
    `${API_BASE_URL}/analyze-resume`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to analyze resume");
  }

  const analysisData = await response.json();

  console.log("ANALYSIS DATA:", analysisData);

  // 2. Match jobs
  const matchResponse = await fetch(
    `${API_BASE_URL}/match-jobs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile: analysisData.profile,
      }),
    }
  );

  if (!matchResponse.ok) {
    throw new Error("Failed to match jobs");
  }

  const matchData = await matchResponse.json();

  console.log("MATCH DATA:", matchData);

  // 3. Combine analysis + job matches
  return {
    ...analysisData,
    matches: matchData.matches,
  };
}