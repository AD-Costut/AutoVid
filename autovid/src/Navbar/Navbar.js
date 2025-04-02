import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        AutoVid <img className="app-logo" src="TemporaryLogo.jpg"></img>
      </Link>
      <ul>
        <CustomLink to="/about">About</CustomLink>
        <CustomLink to="/services">Services</CustomLink>
        <CustomLink to="/contact-us">Contact Us</CustomLink>
        <CustomLink
          to={location.pathname === "/chat" ? "/" : "/login"}
          className="login"
        >
          {location.pathname === "/chat" ? "Logout" : "Login"}
        </CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
