function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          AI Resume Matcher
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#about">About</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;