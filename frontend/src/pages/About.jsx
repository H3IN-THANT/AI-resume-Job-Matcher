
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        <div className="about-container">

          {/* =========================
              HERO
          ========================= */}

          <section className="about-hero">
            <span className="section-label">
              ABOUT THE PROJECT
            </span>

            <h1>CareerLens: AI Resume Analyzer & Job Matcher</h1>

            <p>
              An AI-powered platform that analyzes resumes,
              matches candidates with relevant job opportunities,
              identifies skill gaps, and provides personalized
              learning recommendations.
            </p>
          </section>


          {/* =========================
              WHAT WE BUILT
          ========================= */}

          <section className="about-section">
            <div className="about-card">

              <div className="about-card-heading">
                <div className="about-icon">
                  AI
                </div>

                <div>
                  <h2>What We Built</h2>

                  <p className="about-subtitle">
                    An intelligent career assistance platform
                  </p>
                </div>
              </div>

              <p>
                AI Resume Job Matcher combines AI-powered resume
                analysis with an intelligent job matching engine.
                It helps users understand their strengths, discover
                suitable job opportunities, identify skill gaps,
                and receive personalized learning recommendations.
              </p>

            </div>
          </section>


          {/* =========================
              CORE FEATURES
          ========================= */}

          <section className="about-section">

            <div className="section-heading">
              <span className="section-label">
                WHAT IT DOES
              </span>

              <h2>Core Features</h2>

              <p>
                Everything you need to understand your resume
                and improve your career readiness.
              </p>
            </div>


            <div className="features-grid">

              {/* Resume Analysis */}

              <article className="feature-card">
                <div className="feature-number">
                  01
                </div>

                <h3>Resume Analysis</h3>

                <p>
                  Extract important information and skills
                  from your resume using AI-powered analysis.
                </p>
              </article>


              {/* Job Matching */}

              <article className="feature-card">
                <div className="feature-number">
                  02
                </div>

                <h3>Job Matching</h3>

                <p>
                  Compare your profile with available jobs
                  and calculate intelligent match scores.
                </p>
              </article>


              {/* AI Insights */}

              <article className="feature-card">
                <div className="feature-number">
                  03
                </div>

                <h3>AI Insights</h3>

                <p>
                  Understand why you match a job and discover
                  the strengths that make your profile relevant.
                </p>
              </article>


              {/* Skill Growth */}

              <article className="feature-card">
                <div className="feature-number">
                  04
                </div>

                <h3>Skill Growth</h3>

                <p>
                  Discover skill gaps and receive recommendations
                  on what to learn next.
                </p>
              </article>

            </div>
          </section>


          {/* =========================
              HOW IT WORKS
          ========================= */}

          <section className="about-section">

            <div className="section-heading">
              <span className="section-label">
                OUR WORKFLOW
              </span>

              <h2>How It Works</h2>

              <p>
                From resume upload to personalized career insights.
              </p>
            </div>


            <div className="workflow-grid">

              <div className="workflow-item">
                <span>01</span>

                <div>
                  <h3>Upload Resume</h3>

                  <p>
                    Upload your resume as a PDF file.
                  </p>
                </div>
              </div>


              <div className="workflow-item">
                <span>02</span>

                <div>
                  <h3>AI Analysis</h3>

                  <p>
                    AI extracts your skills, education,
                    experience, projects, and certifications.
                  </p>
                </div>
              </div>


              <div className="workflow-item">
                <span>03</span>

                <div>
                  <h3>Job Matching</h3>

                  <p>
                    Your profile is compared with available
                    job opportunities using a weighted scoring system.
                  </p>
                </div>
              </div>


              <div className="workflow-item">
                <span>04</span>

                <div>
                  <h3>Career Insights</h3>

                  <p>
                    Get explanations, skill gaps, and
                    personalized learning recommendations.
                  </p>
                </div>
              </div>

            </div>

          </section>


          {/* =========================
              TEAM
          ========================= */}

          <section className="team-section">

            <span className="section-label">
              THE TEAM
            </span>

            <h2>Built By</h2>

            <p>
              Co-developed with passion and collaboration.
            </p>


            <div className="team-grid">

              {/* Hein Thant */}

              <article className="team-card">

                <div className="team-avatar">
                  HT
                </div>

                <div className="team-info">
                  <h3>Hein Thant</h3>

                  <p>
                    Co-Developer
                  </p>
                </div>

              </article>


              {/* Myo Min Khant */}

              <article className="team-card">

                <div className="team-avatar">
                  MK
                </div>

                <div className="team-info">
                  <h3>Myo Min Khant</h3>

                  <p>
                    Co-Developer
                  </p>
                </div>

              </article>

            </div>

          </section>


          {/* =========================
              VERSION
          ========================= */}

          <section className="version-section">

            <span className="section-label">
              CURRENT VERSION
            </span>

            <h2>
              AI Resume Job Matcher
            </h2>

            <p>
              Initial release
            </p>

            <span className="version-number">
              v2.0.0
            </span>

          </section>


          {/* =========================
              FOOTER
          ========================= */}

          <footer className="about-footer">
            <p>
              © 2026 AI Resume Job Matcher
            </p>

            <p>
              Built by Hein Thant &amp; Myo Min Khant
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}

export default About;



