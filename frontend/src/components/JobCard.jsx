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
    salary_min,
    salary_max,
    source,
    job_url,
    contract_time,
  } = job;

  const [showDetails, setShowDetails] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [error, setError] = useState("");

  const score = Number(match_score || 0);

  // --------------------------------
  // Match level
  // --------------------------------

  const getMatchLevel = () => {
    if (score >= 80) {
      return "Strong Match";
    }

    if (score >= 60) {
      return "Good Match";
    }

    if (score >= 40) {
      return "Partial Match";
    }

    return "Low Match";
  };

  // --------------------------------
  // Salary formatting
  // --------------------------------

  const formatSalary = () => {
    if (!salary_min && !salary_max) {
      return "Not specified";
    }

    const min = salary_min
      ? `₹${Number(salary_min).toLocaleString()}`
      : "";

    const max = salary_max
      ? `₹${Number(salary_max).toLocaleString()}`
      : "";

    if (min && max) {
      return `${min} - ${max}`;
    }

    return min || max;
  };

  // --------------------------------
  // AI Job Advice
  // --------------------------------

  const handleViewDetails = async () => {
    if (showDetails) {
      setShowDetails(false);
      return;
    }

    setShowDetails(true);

    // Don't request advice again
    if (advice) {
      return;
    }

    if (!resume) {
      setError(
        "Resume data is unavailable. Please analyze your resume again."
      );
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
      console.error(
        "JOB ADVICE ERROR:",
        error
      );

      setError(
        "Unable to generate AI job advice."
      );
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <article className="job-card">

      {/* -------------------------------- */}
      {/* Job Header */}
      {/* -------------------------------- */}

      <div className="job-card-header">

        <div className="job-card-title">

          <span className="job-label">
            JOB MATCH
          </span>

          <h3>
            {title}
          </h3>

          <p className="job-company">
            {company} · {location}
          </p>

        </div>

        <div className="match-score">

          <span>
            {score.toFixed(1)}%
          </span>

          <small>
            {getMatchLevel()}
          </small>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* Match Progress */}
      {/* -------------------------------- */}

      <div className="score-bar">

        <div
          className="score-bar-fill"
          style={{
            width: `${Math.min(
              score,
              100
            )}%`,
          }}
        />

      </div>


      {/* -------------------------------- */}
      {/* Score Breakdown */}
      {/* -------------------------------- */}

      <div className="score-breakdown">

        <div className="detail-score-item">
          <span>
            Skills
          </span>

          <strong>
            {Number(
              skill_score || 0
            ).toFixed(1)}%
          </strong>
        </div>

        <div className="detail-score-item">
          <span>
            Experience
          </span>

          <strong>
            {Number(
              experience_score || 0
            ).toFixed(1)}%
          </strong>
        </div>

        <div className="detail-score-item">
          <span>
            Education
          </span>

          <strong>
            {Number(
              education_score || 0
            ).toFixed(1)}%
          </strong>
        </div>

        <div className="detail-score-item">
          <span>
            Keywords
          </span>

          <strong>
            {Number(
              keyword_score || 0
            ).toFixed(1)}%
          </strong>
        </div>

      </div>


      {/* -------------------------------- */}
      {/* Matching Skills */}
      {/* -------------------------------- */}

      <div className="job-section">

        <h4>
          Matching Skills
        </h4>

        {matched_skills.length > 0 ? (

          <div className="skill-list">

            {matched_skills.map(
              (skill, index) => (
                <span
                  className="matched-skill"
                  key={index}
                >
                  {skill}
                </span>
              )
            )}

          </div>

        ) : (

          <p className="skill-empty">
            No matching skills found.
          </p>

        )}

      </div>


      {/* -------------------------------- */}
      {/* Skill Gaps */}
      {/* -------------------------------- */}

      <div className="job-section">

        <h4>
          Skills To Improve
        </h4>

        {missing_skills.length > 0 ? (

          <div className="skill-list">

            {missing_skills.map(
              (skill, index) => (
                <span
                  className="missing-skill"
                  key={index}
                >
                  {skill}
                </span>
              )
            )}

          </div>

        ) : (

          <p className="perfect-match">
            You have all the listed skills.
          </p>

        )}

      </div>


      {/* -------------------------------- */}
      {/* Job Information */}
      {/* -------------------------------- */}

      <div className="job-info">

        <div className="job-info-item">

          <span>
            Salary
          </span>

          <strong>
            {formatSalary()}
          </strong>

        </div>

        <div className="job-info-item">

          <span>
            Employment
          </span>

          <strong>
            {contract_time
              ? contract_time
                  .replace(
                    "_",
                    " "
                  )
                  .replace(
                    /\b\w/g,
                    (char) =>
                      char.toUpperCase()
                  )
              : "Not specified"}
          </strong>

        </div>

        <div className="job-info-item">

          <span>
            Source
          </span>

          <strong>
            {source || "Unknown"}
          </strong>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* Action Buttons */}
      {/* -------------------------------- */}

      <div className="job-card-actions">

        <button
          className="job-details-button"
          onClick={handleViewDetails}
        >
          {showDetails
            ? "Hide Match Details"
            : "View Match Details"}
        </button>

        {job_url && (
          <a
            href={job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="view-job-button"
          >
            View Job ↗
          </a>
        )}

      </div>


      {/* -------------------------------- */}
      {/* AI Match Details */}
      {/* -------------------------------- */}

      {showDetails && (

        <div className="job-match-details">

          <div className="ai-details-header">

            <span className="section-label">
              AI CAREER INSIGHT
            </span>

            <h4>
              Match Analysis
            </h4>

          </div>


          {/* Loading */}

          {loadingAdvice && (

            <div className="ai-loading">

              <div className="loading-bar" />

              <p>
                Generating personalized
                career insights...
              </p>

            </div>

          )}


          {/* Error */}

          {error && (

            <div className="advice-error">

              <p>
                {error}
              </p>

            </div>

          )}


          {/* AI Advice */}

          {advice && (

            <div className="ai-advice">


              {/* Why You Match */}

              {advice.why_you_match && (

                <div className="advice-section">

                  <h5>
                    Why You Match
                  </h5>

                  <p>
                    {advice.why_you_match}
                  </p>

                </div>

              )}


              {/* Strengths */}

              {advice.strengths?.length > 0 && (

                <div className="advice-section">

                  <h5>
                    Your Strengths
                  </h5>

                  <div className="skill-list">

                    {advice.strengths.map(
                      (skill, index) => (

                        <span
                          className="matched-skill"
                          key={index}
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* Skill Gaps */}

              {advice.skill_gaps?.length > 0 && (

                <div className="advice-section">

                  <h5>
                    Skills To Improve
                  </h5>

                  <div className="skill-list">

                    {advice.skill_gaps.map(
                      (skill, index) => (

                        <span
                          className="missing-skill"
                          key={index}
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* What To Learn */}

              {advice.what_to_learn?.length > 0 && (

                <div className="advice-section">

                  <h5>
                    What To Learn
                  </h5>

                  <div className="learning-list">

                    {advice.what_to_learn.map(
                      (item, index) => (

                        <div
                          className="learning-item"
                          key={index}
                        >

                          <div className="learning-header">

                            <strong>
                              {item.skill}
                            </strong>

                            <span
                              className={`priority-${String(
                                item.priority || ""
                              ).toLowerCase()}`}
                            >
                              {item.priority}
                            </span>

                          </div>

                          <p>
                            {item.reason}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* Suggested Project */}

              {advice.suggested_project && (

                <div className="advice-section">

                  <h5>
                    Suggested Project
                  </h5>

                  <p>
                    {advice.suggested_project}
                  </p>

                </div>

              )}

            </div>

          )}

        </div>

      )}

    </article>
  );
}

export default JobCard;