import { useState } from "react";
import { getJobAdvice } from "../services/api";

function JobCard({ job, resume }) {
  const {
    title,
    company,
    location,
    match_score,
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

  const handleViewDetails = async () => {
    setShowDetails(!showDetails);

    // Don't request advice again if already loaded
    if (advice || showDetails) {
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
        "Unable to generate AI job advice."
      );
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <article className="job-card">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

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
            {score.toFixed(1)}%
          </span>

          <small>
            Match
          </small>
        </div>

      </div>


      {/* -------------------------------- */}
      {/* Score Bar */}
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
      {/* Matching Skills */}
      {/* -------------------------------- */}

      <div className="job-section">

        <h4>
          Matching Skills
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


      {/* -------------------------------- */}
      {/* Skill Gaps */}
      {/* -------------------------------- */}

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


      {/* -------------------------------- */}
      {/* Job Information */}
      {/* -------------------------------- */}

      <div className="job-info">

        <div>
          <span>
            Salary
          </span>

          <strong>
            {formatSalary()}
          </strong>
        </div>

        <div>
          <span>
            Employment
          </span>

          <strong>
            {contract_time
              ? contract_time.replace(
                  "_",
                  " "
                )
              : "Not specified"}
          </strong>
        </div>

        <div>
          <span>
            Source
          </span>

          <strong>
            {source || "Unknown"}
          </strong>
        </div>

      </div>


      {/* -------------------------------- */}
      {/* Actions */}
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

          <h4>
            AI Match Analysis
          </h4>

          {loadingAdvice && (
            <p>
              Generating AI analysis...
            </p>
          )}

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {advice && (
            <>

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


              {advice.what_to_learn?.length > 0 && (
                <div className="advice-section">

                  <h5>
                    What To Learn
                  </h5>

                  {advice.what_to_learn.map(
                    (item, index) => (
                      <div
                        className="learning-item"
                        key={index}
                      >

                        <strong>
                          {item.skill}
                        </strong>

                        <span>
                          {item.priority}
                        </span>

                        <p>
                          {item.reason}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}


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

            </>
          )}

        </div>
      )}

    </article>
  );
}

export default JobCard;