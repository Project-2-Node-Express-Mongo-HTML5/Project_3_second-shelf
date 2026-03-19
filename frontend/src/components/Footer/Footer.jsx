import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row gy-4">
          {/* Brand */}
          <div className="col-12 col-md-3">
            <h3 className="footer-title">Second-Shelf</h3>
            <p className="footer-text">
              Buy, sell, and review used books from the community.
            </p>
          </div>

          {/* Navigation */}
          {/* <div className="col-6 col-md-3">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div> */}

          {/* Authors */}
          <div className="col-6 col-md-3">
            <h4 className="footer-heading">Authors</h4>
            <p className="footer-text">Allison Avery</p>
            <p className="footer-text">David Ahn</p>
          </div>

          {/* Project */}
          {/* <div className="col-12 col-md-3">
            <h4 className="footer-heading">Project</h4>
            <p className="footer-text">CS 5610 Web Development</p>
            <p className="footer-text">Northeastern University</p>
          </div> */}
        </div>

        <div className="footer-bottom text-center mt-4 pt-3 border-top">
          <p className="mb-0">
            © {new Date().getFullYear()} Second-Shelf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;