import { useState } from "react";

function JobCard({ job }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="job-card">

      <div className="job-header">
        <div>
          <h2>
            {job.title}
          </h2>

          <p className="job-info">
            {job.company}
            {" | "}
            {job.location}
          </p>
        </div>
      </div>


      <div className="match-section">
        <h1>
          {job.match_score}%
        </h1>

        <span>
          MATCH
        </span>
      </div>


      <div className="score-container">
        <div
          className="score-progress"
          style={{
            width: `${job.match_score}%`
          }}
        />
      </div>


      <div className="skills-section">
        <h4>
          Matched Skills
        </h4>

        <div className="job-skills">
          {job.matched_skills?.length > 0 ? (
            job.matched_skills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="skill"
                >
                  {skill}
                </span>
              )
            )
          ) : (
            <p>
              No matched skills
            </p>
          )}
        </div>
      </div>


      {job.missing_skills?.length > 0 && (
        <div className="missing-box">
          ⚠ Missing:{" "}
          {job.missing_skills.join(", ")}
        </div>
      )}


      <button
        className="match-button"
        onClick={() =>
          setShowDetails(!showDetails)
        }
      >
        {showDetails
          ? "Hide Match Details"
          : "View Match Details"}
      </button>


      {showDetails && (
        <div className="match-details">

          <h3>
            Match Details
          </h3>


          <div className="detail-row">
            <span>Overall Match</span>
            <strong>
              {job.match_score}%
            </strong>
          </div>


          <div className="detail-row">
            <span>Skill Match</span>
            <strong>
              {job.skill_score}%
            </strong>
          </div>


          <div className="detail-row">
            <span>Experience Match</span>
            <strong>
              {job.experience_score}%
            </strong>
          </div>


          <div className="detail-row">
            <span>Education Match</span>
            <strong>
              {job.education_score}%
            </strong>
          </div>


          <div className="detail-row">
            <span>Keyword Match</span>
            <strong>
              {job.keyword_score}%
            </strong>
          </div>


          <div className="details-skills">

            <h4>
              Matched Skills
            </h4>

            {job.matched_skills?.length > 0 ? (
              <div className="job-skills">
                {job.matched_skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="skill"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p>No matched skills</p>
            )}

          </div>


          {job.missing_skills?.length > 0 && (
            <div className="details-missing">

              <h4>
                Skills to Improve
              </h4>

              <ul>
                {job.missing_skills.map(
                  (skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}
              </ul>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default JobCard;