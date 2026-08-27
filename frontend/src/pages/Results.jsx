import JobCard from "../components/JobCard";

function Results({ data }) {
  if (!data) {
    return (
      <div className="results">
        <h2>No analysis available</h2>
      </div>
    );
  }

  const profile = data.profile;

  // DEBUG: Check job matching data
  console.log("RESULT DATA:", data);
  console.log("MATCHES:", data?.matches);

  return (
    <section className="results">
      <h2>Resume Analysis</h2>


      <div className="profile-card">
        <h3>Personal Information</h3>

        <p>
          <strong>Name:</strong>{" "}
          {profile?.name || "Not available"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {profile?.email || "Not available"}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {profile?.phone || "Not available"}
        </p>
      </div>


      <div className="profile-card">
        <h3>Skills</h3>

        {profile?.skills?.length > 0 ? (
          <div className="skills">
            {profile.skills.map((skill, index) => (
              <span
                className="skill"
                key={index}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p>No skills found.</p>
        )}
      </div>


      <div className="profile-card">
        <h3>Education</h3>

        {profile?.education?.length > 0 ? (
          <ul>
            {profile.education.map((education, index) => (
              <li key={index}>
                {education}
              </li>
            ))}
          </ul>
        ) : (
          <p>No education information found.</p>
        )}
      </div>


      <div className="profile-card">
        <h3>Experience</h3>

        {profile?.experience?.length > 0 ? (
          <div>
            {profile.experience.map((experience, index) => (
              <div
                className="experience-item"
                key={index}
              >
                <h4>
                  {experience.role || "Unknown Role"}
                </h4>

                <p>
                  {experience.company || "Unknown Company"}
                </p>

                <p>
                  {experience.duration ||
                    "Duration not available"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No experience found.</p>
        )}
      </div>


      <div className="profile-card">
        <h3>Projects</h3>

        {profile?.projects?.length > 0 ? (
          <div>
            {profile.projects.map((project, index) => (
              <div
                className="project-item"
                key={index}
              >
                <h4>
                  {project.name || "Unnamed Project"}
                </h4>

                <p>
                  {project.description ||
                    "No description available."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects found.</p>
        )}
      </div>


      <div className="profile-card">
        <h3>Certifications</h3>

        {profile?.certifications?.length > 0 ? (
          <ul>
            {profile.certifications.map(
              (certification, index) => (
                <li key={index}>
                  {certification}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No certifications found.</p>
        )}
      </div>


      {/* ==============================
          JOB MATCHING SECTION
      =============================== */}

      <div
  className="profile-card"
  id="results"
>

  <div className="job-matching-header">

    <div>

      <h3 className="job-matching-title">
        Job Matches
      </h3>

      <p className="job-matching-subtitle">
        Jobs ranked by how well they match your resume.
      </p>

    </div>

  </div>


  {
    data.matches?.length > 0 ? (

      data.matches.map(
        (job, index) => (

          <div key={index}>

            <div className="job-ranking">

              <span>
                Rank #{index + 1}
              </span>

              {
                index === 0 && (
                  <span className="job-ranking-badge">
                    Best Match
                  </span>
                )
              }

            </div>

            <JobCard
              job={job}
            />

          </div>

        )
      )

    )
    :
    (
      <div className="no-results">

        <h4>
          No job matches found
        </h4>

        <p>
          Try uploading a resume with more
          skills and experience information.
        </p>

      </div>
    )
  }

</div>


    </section>
  );
}

export default Results;