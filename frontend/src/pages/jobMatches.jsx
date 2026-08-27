import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

function JobMatches() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState(null);

    const jobs = location.state?.jobs || [];
    const resume = location.state?.resume || null;

    return (
        <>
            <Navbar />

            <main className="job-matches-page">
                <section className="job-matches-header">
                    <div>
                        <span className="section-label">
                            AI JOB MATCHING
                        </span>

                        <h1>Jobs That Match You</h1>

                        <p>
                            We compared your resume against available
                            job opportunities and ranked the best matches.
                        </p>
                    </div>

                    <button
                        className="back-button"
                        onClick={() => navigate("/results")}
                    >
                        ← Resume Analysis
                    </button>
                </section>

                {jobs.length > 0 ? (
                    <>
                        <div className="match-summary">
                            <div>
                                <strong>{jobs.length}</strong>
                                <span>Jobs Found</span>
                            </div>

                            <div>
                                <strong>
                                    {Number(jobs[0]?.match_score || 0).toFixed(1)}%
                                </strong>
                                <span>Top Match</span>
                            </div>

                            <div>
                                <strong>AI</strong>
                                <span>Powered Matching</span>
                            </div>
                        </div>

                        <section className="jobs-grid">
                            {jobs.map((job, index) => (
                                <JobCard
                                    key={job.id || index}
                                    job={job}
                                    resume={resume}
                                    isSelected={selectedJob?.id === job.id}
                                    onViewDetails={(selected) => {
                                        setSelectedJob(
                                            selectedJob?.id === selected.id
                                                ? null
                                                : selected
                                        );
                                    }}
                                />
                            ))}
                        </section>

                        {selectedJob && (
                            <section className="match-details-card">
                                <div className="details-header">
                                    <div>
                                        <span className="section-label">
                                            MATCH DETAILS
                                        </span>

                                        <h2>{selectedJob.title}</h2>

                                        <p>
                                            {selectedJob.company} · {selectedJob.location}
                                        </p>
                                    </div>

                                    <div className="details-score">
                                        {Number(selectedJob.match_score || 0).toFixed(1)}%
                                        <span>Overall Match</span>
                                    </div>
                                </div>

                                {/* Score Breakdown */}
                                <div className="score-breakdown">
                                    <div className="detail-score-item">
                                        <span>Skill Match</span>
                                        <strong>
                                            {Number(selectedJob.skill_score || 0).toFixed(1)}%
                                        </strong>
                                    </div>

                                    <div className="detail-score-item">
                                        <span>Experience</span>
                                        <strong>
                                            {Number(selectedJob.experience_score || 0).toFixed(1)}%
                                        </strong>
                                    </div>

                                    <div className="detail-score-item">
                                        <span>Education</span>
                                        <strong>
                                            {Number(selectedJob.education_score || 0).toFixed(1)}%
                                        </strong>
                                    </div>

                                    <div className="detail-score-item">
                                        <span>Keywords</span>
                                        <strong>
                                            {Number(selectedJob.keyword_score || 0).toFixed(1)}%
                                        </strong>
                                    </div>
                                </div>

                                {/* Why You Match */}
                                <div className="detail-section">
                                    <h3>Why You Match</h3>

                                    {selectedJob.matched_skills?.length > 0 ? (
                                        <div className="detail-skills">
                                            {selectedJob.matched_skills.map(
                                                (skill, index) => (
                                                    <span
                                                        className="matched-skill"
                                                        key={index}
                                                    >
                                                        ✓ {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p>No matching skills found.</p>
                                    )}
                                </div>

                                {/* Skill Gaps */}
                                <div className="detail-section">
                                    <h3>Skill Gaps</h3>

                                    {selectedJob.missing_skills?.length > 0 ? (
                                        <div className="detail-skills">
                                            {selectedJob.missing_skills.map(
                                                (skill, index) => (
                                                    <span
                                                        className="missing-skill"
                                                        key={index}
                                                    >
                                                        + {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="perfect-match">
                                            🎉 You have all the required skills!
                                        </p>
                                    )}
                                </div>

                                {/* Recommendation */}
                                <div className="recommendation-box">
                                    <h3>Application Insight</h3>

                                    <p>
                                        Your resume currently matches this position at{" "}
                                        <strong>
                                            {Number(selectedJob.match_score || 0).toFixed(1)}%
                                        </strong>
                                        . Review the skill gaps above before applying.
                                    </p>
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <section className="empty-jobs">
                        <div className="empty-icon">🎯</div>

                        <h2>No Job Matches Available</h2>

                        <p>
                            Analyze your resume first to discover
                            jobs that match your skills.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="primary-button"
                        >
                            Analyze Resume
                        </button>
                    </section>
                )}
            </main>
        </>
    );
}

export default JobMatches;