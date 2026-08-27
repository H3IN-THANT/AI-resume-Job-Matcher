import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";

import { analyzeResume } from "../services/api";

function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (file) => {
    try {
      setLoading(true);
      setError("");

      // 1. Analyze resume
      const resumeData = await analyzeResume(file);

      console.log("BACKEND RESPONSE:", resumeData);

      // 2. Go to Results page
      navigate("/results", {
        state: {
          data: resumeData,
        },
      });
    } catch (error) {
      console.error(error);

      setError(
        "Unable to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="home">
        <section className="hero">
          <h1>AI Resume Analyzer & Job Matcher</h1>

          <p>
            Upload your resume and discover
            jobs that match your skills.
          </p>

          <UploadBox
            onAnalyze={handleAnalyze}
            loading={loading}
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}
        </section>
      </main>
    </>
  );
}

export default Home;