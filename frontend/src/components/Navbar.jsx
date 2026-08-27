function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <a
          href="/"
          className="navbar-brand"
        >
          <span className="navbar-brand-icon">
            AI
          </span>

          <span>
            Resume Matcher
          </span>
        </a>

        <div className="navbar-links">

          <a
            href="/"
            className="navbar-link"
          >
            Home
          </a>

          <a
            href="#results"
            className="navbar-link"
          >
            Results
          </a>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;