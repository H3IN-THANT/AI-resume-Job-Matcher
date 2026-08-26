function JobCard({ job }) {

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
        >
        </div>

      </div>



      <div className="skills-section">

        <h4>
          Matched Skills
        </h4>


        <div className="job-skills">

          {
            job.matched_skills?.length > 0 ?

            job.matched_skills.map(
              (skill,index)=>(
                <span
                  key={index}
                  className="skill"
                >
                  {skill}
                </span>
              )
            )

            :

            <p>
              No matched skills
            </p>

          }

        </div>

      </div>




      {
        job.missing_skills?.length > 0 &&

        <div className="missing-box">

          ⚠ Missing:

          {" "}

          {
            job.missing_skills.join(", ")
          }

        </div>

      }



      <button className="match-button">
        View Match Details
      </button>


    </div>
  )
}


export default JobCard;