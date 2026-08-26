import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.data;

  console.log("RESULTS COMPONENT DATA:", data);

  if (!data) {
    return (
      <main className="results">
        <div className="profile-card">
          <h2>No analysis available</h2>

          <p>
            Please upload a resume and analyze it first.
          </p>

          <button onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  const profile = data.profile || {};

  return (
    <main className="results">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="results-header">

        <div>
          <p className="results-eyebrow">
            AI RESUME ANALYSIS
          </p>

          <h1>Resume Dashboard</h1>

          <p>
            Detailed analysis of{" "}
            <strong>
              {data.filename || "your resume"}
            </strong>
          </p>
        </div>

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          ← Analyze Another Resume
        </button>

      </div>


      {/* =====================================
          TOP PROFILE SUMMARY
      ====================================== */}

      <section className="dashboard-grid">

        {/* PERSONAL INFORMATION */}

        <div className="profile-card">

          <div className="card-header">
            <div>
              <span className="card-icon">👤</span>
            </div>

            <div>
              <h3>Personal Profile</h3>
              <p className="card-subtitle">
                Contact information
              </p>
            </div>
          </div>


          <div className="profile-info">

            <div className="info-row">
              <span className="info-label">
                Full Name
              </span>

              <span className="info-value">
                {profile.name || "Not available"}
              </span>
            </div>


            <div className="info-row">
              <span className="info-label">
                Email
              </span>

              <span className="info-value">
                {profile.email || "Not available"}
              </span>
            </div>


            <div className="info-row">
              <span className="info-label">
                Phone
              </span>

              <span className="info-value">
                {profile.phone || "Not available"}
              </span>
            </div>

          </div>

        </div>


        {/* SKILLS */}

        <div className="profile-card">

          <div className="card-header">

            <div>
              <span className="card-icon">🧠</span>
            </div>

            <div>
              <h3>Skills</h3>

              <p className="card-subtitle">
                Detected technical skills
              </p>
            </div>

          </div>


          {profile.skills?.length > 0 ? (

            <div className="skills">

              {profile.skills.map(
                (skill, index) => (
                  <span
                    className="skill"
                    key={index}
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          ) : (

            <div className="empty-section">
              No skills found.
            </div>

          )}

        </div>

      </section>


      {/* =====================================
          EXPERIENCE
      ====================================== */}

      <section className="profile-card full-width-card">

        <div className="card-header">

          <div>
            <span className="card-icon">💼</span>
          </div>

          <div>
            <h3>Professional Experience</h3>

            <p className="card-subtitle">
              Work experience extracted from your resume
            </p>
          </div>

        </div>


        {profile.experience?.length > 0 ? (

          <div className="timeline">

            {profile.experience.map(
              (experience, index) => (

                <div
                  className="timeline-item"
                  key={index}
                >

                  <div className="timeline-dot"></div>

                  <div className="timeline-content">

                    <h4>
                      {experience.role ||
                        "Unknown Role"}
                    </h4>

                    <p className="company-name">
                      {experience.company ||
                        "Unknown Company"}
                    </p>

                    <span className="duration">
                      {experience.duration ||
                        "Duration not available"}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-section">
            No professional experience found.
          </div>

        )}

      </section>


      {/* =====================================
          EDUCATION + CERTIFICATIONS
      ====================================== */}

      <section className="dashboard-grid">

        {/* EDUCATION */}

        <div className="profile-card">

          <div className="card-header">

            <div>
              <span className="card-icon">🎓</span>
            </div>

            <div>
              <h3>Education</h3>

              <p className="card-subtitle">
                Academic background
              </p>
            </div>

          </div>


          {profile.education?.length > 0 ? (

            <ul className="clean-list">

              {profile.education.map(
                (education, index) => (

                  <li key={index}>
                    {education}
                  </li>

                )
              )}

            </ul>

          ) : (

            <div className="empty-section">
              No education information found.
            </div>

          )}

        </div>


        {/* CERTIFICATIONS */}

        <div className="profile-card">

          <div className="card-header">

            <div>
              <span className="card-icon">🏆</span>
            </div>

            <div>
              <h3>Certifications</h3>

              <p className="card-subtitle">
                Professional certifications
              </p>
            </div>

          </div>


          {profile.certifications?.length > 0 ? (

            <ul className="clean-list">

              {profile.certifications.map(
                (certification, index) => (

                  <li key={index}>
                    {certification}
                  </li>

                )
              )}

            </ul>

          ) : (

            <div className="empty-section">
              No certifications found.
            </div>

          )}

        </div>

      </section>


      {/* =====================================
          PROJECTS
      ====================================== */}

      <section className="profile-card full-width-card">

        <div className="card-header">

          <div>
            <span className="card-icon">🚀</span>
          </div>

          <div>
            <h3>Projects</h3>

            <p className="card-subtitle">
              Projects identified from your resume
            </p>
          </div>

        </div>


        {profile.projects?.length > 0 ? (

          <div className="projects-grid">

            {profile.projects.map(
              (project, index) => (

                <div
                  className="project-item"
                  key={index}
                >

                  <div className="project-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>

                    <h4>
                      {project.name ||
                        "Unnamed Project"}
                    </h4>

                    <p>
                      {project.description ||
                        "No description available."}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-section">
            No projects found.
          </div>

        )}

      </section>


      {/* =====================================
          FOOTER ACTION
      ====================================== */}

      <div className="results-footer">

        <div>
          <strong>
            Resume analysis completed
          </strong>

          <p>
            Powered by AI-powered resume extraction.
          </p>
        </div>

        <button
          className="analyze-again-btn"
          onClick={() => navigate("/")}
        >
          Analyze Another Resume →
        </button>

      </div>

    </main>
  );
}

export default Results;