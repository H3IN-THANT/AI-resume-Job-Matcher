import { useState } from "react";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import Results from "./Results";

import { analyzeResume } from "../services/api";

function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (file) => {
    try {
      setLoading(true);
      setError("");

      const data = await analyzeResume(file);

      setResult(data);
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
          <h1>
            AI Resume Job Matcher
          </h1>

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

        {result && (
          <Results data={result} />
        )}
      </main>
    </>
  );
}

export default Home;