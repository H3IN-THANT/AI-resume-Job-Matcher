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
          <p>No skills found.</p>
        )}
      </div>


      <div className="profile-card">
        <h3>Education</h3>

        {profile?.education?.length > 0 ? (
          <ul>
            {profile.education.map(
              (education, index) => (
                <li key={index}>
                  {education}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No education information found.</p>
        )}
      </div>


      <div className="profile-card">
        <h3>Experience</h3>

        {profile?.experience?.length > 0 ? (
          <div>
            {profile.experience.map(
              (experience, index) => (
                <div
                  className="experience-item"
                  key={index}
                >
                  <h4>
                    {experience.role ||
                      "Unknown Role"}
                  </h4>

                  <p>
                    {experience.company ||
                      "Unknown Company"}
                  </p>

                  <p>
                    {experience.duration ||
                      "Duration not available"}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <p>No experience found.</p>
        )}
      </div>


      <div className="profile-card">
        <h3>Projects</h3>

        {profile?.projects?.length > 0 ? (
          <div>
            {profile.projects.map(
              (project, index) => (
                <div
                  className="project-item"
                  key={index}
                >
                  <h4>
                    {project.name ||
                      "Unnamed Project"}
                  </h4>

                  <p>
                    {project.description ||
                      "No description available."}
                  </p>
                </div>
              )
            )}
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

      <div className="profile-card">

        <h3>
          JOB MATCHING FOR YOUR RESUME
        </h3>


        {
          data.matches?.length > 0 ? (

            data.matches.map(
              (job, index) => (
                <JobCard
                  key={index}
                  job={job}
                />
              )
            )

          )
          :
          (
            <p>
              No job matches found.
            </p>
          )
        }


      </div>


    </section>
  );
}

export default Results;