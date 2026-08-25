import { useState } from "react";

function UploadBox({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = () => {
    if (!file) {
      setError("Please select your resume first.");
      return;
    }

    onAnalyze(file);
  };

  return (
    <div className="upload-box">
      <div className="upload-icon">
        📄
      </div>

      <h2>Upload Your Resume</h2>

      <p>
        Upload your resume in PDF format
        to analyze your skills and experience.
      </p>

      <input
        id="resume-upload"
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
      />

      <label
        htmlFor="resume-upload"
        className="file-label"
      >
        Choose PDF
      </label>

      {file && (
        <p className="file-name">
          Selected: {file.name}
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}

export default UploadBox;