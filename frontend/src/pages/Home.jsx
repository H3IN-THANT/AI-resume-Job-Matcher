import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="home">
        <h1>AI Resume Job Matcher</h1>

        <p>
          Upload your resume and discover jobs
          that match your skills.
        </p>

        <div className="upload-box">
          <h2>Upload Your Resume</h2>

          <input
            type="file"
            accept=".pdf,application/pdf"
          />

          <button>
            Analyze Resume
          </button>
        </div>
      </main>
    </>
  );
}

export default Home;