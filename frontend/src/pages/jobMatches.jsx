import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

function JobMatches() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState(null);
    const [sortBy, setSortBy] = useState("highest");
    const [scoreFilter, setScoreFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [salaryFilter, setSalaryFilter] = useState("all");
    const [employmentFilter, setEmploymentFilter] = useState("all");

    const jobs = location.state?.jobs || [];
    const resume = location.state?.resume || null;

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        // Search
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();

            result = result.filter((job) => {
                const title = String(job.title || "").toLowerCase();
                const company = String(job.company || "").toLowerCase();
                const description = String(
                    job.description || ""
                ).toLowerCase();

                const skills = (job.job_skills || [])
                    .join(" ")
                    .toLowerCase();

                return (
                    title.includes(search) ||
                    company.includes(search) ||
                    description.includes(search) ||
                    skills.includes(search)
                );
            });
        }

        // Match score filter
        if (scoreFilter !== "all") {
            const minimumScore = Number(scoreFilter);

            result = result.filter(
                (job) =>
                    Number(job.match_score || 0) >=
                    minimumScore
            );
        }

        // Location filter
        if (locationFilter !== "all") {
            result = result.filter((job) =>
                String(job.location || "")
                    .toLowerCase()
                    .includes(locationFilter.toLowerCase())
            );
        }

        // Salary filter
        if (salaryFilter !== "all") {
            const minimumSalary = Number(salaryFilter);

            result = result.filter((job) => {
                const salary = Number(
                    job.salary_min || 0
                );

                return salary >= minimumSalary;
            });
        }

        // Employment filter
        if (employmentFilter !== "all") {
            result = result.filter(
                (job) =>
                    String(job.contract_time || "")
                        .toLowerCase() ===
                    employmentFilter.toLowerCase()
            );
        }

        // Sorting
        result.sort((a, b) => {
            const scoreA = Number(
                a.match_score || 0
            );

            const scoreB = Number(
                b.match_score || 0
            );

            if (sortBy === "highest") {
                return scoreB - scoreA;
            }

            if (sortBy === "lowest") {
                return scoreA - scoreB;
            }

            return 0;
        });

        return result;
    }, [
        jobs,
        searchTerm,
        scoreFilter,
        locationFilter,
        salaryFilter,
        employmentFilter,
        sortBy,
    ]);
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

                        <div className="filter-result-count">
                            Showing <strong>{filteredJobs.length}</strong> of{" "}
                            <strong>{jobs.length}</strong> jobs
                        </div>

                        <div className="job-filter-panel">

                            {/* Search */}
                            <div className="filter-search">
                                <label htmlFor="job-search">
                                    Search Jobs
                                </label>

                                <input
                                    id="job-search"
                                    type="text"
                                    placeholder="Search job title, company or skill..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            {/* Match Score */}
                            <div className="filter-group">
                                <label htmlFor="score-filter">
                                    Match Score
                                </label>

                                <select
                                    id="score-filter"
                                    value={scoreFilter}
                                    onChange={(e) =>
                                        setScoreFilter(e.target.value)
                                    }
                                >
                                    <option value="all">
                                        All Jobs
                                    </option>

                                    <option value="70">
                                        70%+
                                    </option>

                                    <option value="50">
                                        50%+
                                    </option>

                                    <option value="30">
                                        30%+
                                    </option>
                                </select>
                            </div>

                            {/* Location */}
                            <div className="filter-group">
                                <label htmlFor="location-filter">
                                    Location
                                </label>

                                <select
                                    id="location-filter"
                                    value={locationFilter}
                                    onChange={(e) =>
                                        setLocationFilter(e.target.value)
                                    }
                                >
                                    <option value="all">
                                        All Locations
                                    </option>

                                    <option value="remote">
                                        Remote
                                    </option>

                                    <option value="india">
                                        India
                                    </option>

                                    <option value="bengaluru">
                                        Bengaluru
                                    </option>

                                    <option value="hyderabad">
                                        Hyderabad
                                    </option>

                                    <option value="mumbai">
                                        Mumbai
                                    </option>

                                    <option value="delhi">
                                        Delhi
                                    </option>

                                    <option value="chennai">
                                        Chennai
                                    </option>
                                </select>
                            </div>

                            {/* Salary */}
                            <div className="filter-group">
                                <label htmlFor="salary-filter">
                                    Minimum Salary
                                </label>

                                <select
                                    id="salary-filter"
                                    value={salaryFilter}
                                    onChange={(e) =>
                                        setSalaryFilter(e.target.value)
                                    }
                                >
                                    <option value="all">
                                        Any Salary
                                    </option>

                                    <option value="500000">
                                        ₹5 LPA+
                                    </option>

                                    <option value="1000000">
                                        ₹10 LPA+
                                    </option>

                                    <option value="2000000">
                                        ₹20 LPA+
                                    </option>
                                </select>
                            </div>

                            {/* Employment */}
                            <div className="filter-group">
                                <label htmlFor="employment-filter">
                                    Employment
                                </label>

                                <select
                                    id="employment-filter"
                                    value={employmentFilter}
                                    onChange={(e) =>
                                        setEmploymentFilter(e.target.value)
                                    }
                                >
                                    <option value="all">
                                        All Types
                                    </option>

                                    <option value="full_time">
                                        Full-time
                                    </option>

                                    <option value="part_time">
                                        Part-time
                                    </option>

                                    <option value="contract">
                                        Contract
                                    </option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="filter-group">
                                <label htmlFor="sort-jobs">
                                    Sort By
                                </label>

                                <select
                                    id="sort-jobs"
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(e.target.value)
                                    }
                                >
                                    <option value="highest">
                                        Highest Match
                                    </option>

                                    <option value="lowest">
                                        Lowest Match
                                    </option>
                                </select>
                            </div>

                        </div>
                        
                            {/* Clear Filters */}
                            <div className="filter-actions">
                                <button
                                    type="button"
                                    className="clear-filters-button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setScoreFilter("all");
                                        setLocationFilter("all");
                                        setSalaryFilter("all");
                                        setEmploymentFilter("all");
                                        setSortBy("highest");
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>

                        <div className="job-filters">

                        </div>

                        <section className="jobs-grid">
                            {filteredJobs.map((job, index) => (
                                <JobCard
                                    key={job.job_id || index}
                                    job={job}
                                    resume={resume}
                                    isSelected={
                                        selectedJob?.job_id === job.job_id
                                    }
                                    onViewDetails={(selected) => {
                                        setSelectedJob(
                                            selectedJob?.job_id === selected.job_id
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