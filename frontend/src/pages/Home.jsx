function Home() {
  return (
    <div className="home">
      <h1>AI Resume Job Matcher</h1>

      <p>
        Upload your resume and discover jobs that match your skills.
      </p>

      <div className="upload-box">
        <h2>Upload Your Resume</h2>

        <input
          type="file"
          accept=".pdf"
        />

        <button>
          Analyze Resume
        </button>
      </div>
    </div>
  );
}

export default Home;