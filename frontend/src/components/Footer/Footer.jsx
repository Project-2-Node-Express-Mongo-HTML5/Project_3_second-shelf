import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} Second-Shelf</p>
        <p className="footer-sub">
          Buy and review used books from the community
        </p>
      </div>
    </footer>
  );
}

export default Footer;