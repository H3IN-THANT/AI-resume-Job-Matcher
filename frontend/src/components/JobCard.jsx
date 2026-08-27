import { useState } from "react";
import { getJobAdvice } from "../services/api";

function JobCard({ job, resume }) {
  const {
    title,
    company,
    location,
    match_score,
    skill_score,
    experience_score,
    education_score,
    keyword_score,
    matched_skills = [],
    missing_skills = [],
  } = job;

  const [showDetails, setShowDetails] =
    useState(false);

  const [advice, setAdvice] = useState(null);

  const [loadingAdvice, setLoadingAdvice] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleViewDetails = async () => {
    setShowDetails(!showDetails);

    // Don't call Gemini again if advice already exists
    if (advice) {
      return;
    }

    try {
      setLoadingAdvice(true);
      setError("");

      const result = await getJobAdvice(
        resume,
        job
      );

      setAdvice(result);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to generate AI advice."
      );

    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <article className="job-card">

      {/* Job Header */}

      <div className="job-card-header">

        <div>
          <span className="job-label">
            JOB MATCH
          </span>

          <h3>{title}</h3>

          <p className="job-company">
            {company} · {location}
          </p>
        </div>

        <div className="match-score">

          <span>
            {Number(match_score).toFixed(1)}%
          </span>

          <small>
            Match
          </small>

        </div>

      </div>


      {/* Score Bar */}

      <div className="score-bar">

        <div
          className="score-bar-fill"
          style={{
            width: `${Math.min(
              Number(match_score),
              100
            )}%`,
          }}
        />

      </div>


      {/* Matching Skills */}

      <div className="job-section">

        <h4>
          ✓ Matching Skills
        </h4>

        <div className="skill-list">

          {matched_skills.length > 0 ? (
            matched_skills.map(
              (skill, index) => (
                <span
                  className="matched-skill"
                  key={index}
                >
                  {skill}
                </span>
              )
            )
          ) : (
            <p>
              No matching skills found.
            </p>
          )}

        </div>

      </div>


      {/* Skill Gaps */}

      <div className="job-section">

        <h4>
          Skill Gaps
        </h4>

        <div className="skill-list">

          {missing_skills.length > 0 ? (
            missing_skills.map(
              (skill, index) => (
                <span
                  className="missing-skill"
                  key={index}
                >
                  {skill}
                </span>
              )
            )
          ) : (
            <p className="perfect-match">
              You have all the listed skills!
            </p>
          )}

        </div>

      </div>


      {/* Details Button */}

      <button
        className="job-details-button"
        onClick={handleViewDetails}
      >
        {showDetails
          ? "Hide Match Details ↑"
          : "View Match Details ↓"}
      </button>


      {/* AI Details */}

      {showDetails && (
        <div className="job-ai-details">

          {loadingAdvice ? (
            <div className="ai-loading">

              <span>
                ✨
              </span>

              <p>
                Gemini is analyzing your match...
              </p>

            </div>
          ) : error ? (
            <p className="error">
              {error}
            </p>
          ) : advice ? (
            <>

              {/* Why You Match */}

              <section className="ai-section">

                <span className="ai-label">
                  AI INSIGHT
                </span>

                <h4>
                  Why You Match
                </h4>

                <p>
                  {advice.why_you_match}
                </p>

              </section>


              {/* Strengths */}

              {advice.strengths?.length > 0 && (
                <section className="ai-section">

                  <h4>
                    Your Strengths
                  </h4>

                  <ul>
                    {advice.strengths.map(
                      (strength, index) => (
                        <li key={index}>
                          {strength}
                        </li>
                      )
                    )}
                  </ul>

                </section>
              )}


              {/* What To Learn */}

              <section className="ai-section">

                <h4>
                  What To Learn
                </h4>

                <div className="learning-list">

                  {advice.what_to_learn?.map(
                    (item, index) => (
                      <div
                        className="learning-item"
                        key={index}
                      >

                        <div>
                          <strong>
                            {item.skill}
                          </strong>

                          <p>
                            {item.reason}
                          </p>
                        </div>

                        <span
                          className={`priority priority-${item.priority.toLowerCase()}`}
                        >
                          {item.priority}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </section>


              {/* Suggested Project */}

              <section className="ai-section project-advice">

                <h4>
                  🚀 Suggested Project
                </h4>

                <p>
                  {advice.suggested_project}
                </p>

              </section>

            </>
          ) : null}

        </div>
      )}

    </article>
  );
}

export default JobCard;