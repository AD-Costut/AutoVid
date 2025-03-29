import HomeVideo from "../pages videos/Rotating Earth.mp4";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="home-page">
      <video autoPlay loop muted className="home-page-video">
        <source src={HomeVideo} autoPlay loop />
      </video>
      <div className="home-page-content">
        <h1>Welcome to AutoVid</h1>
        <h2>Generate Videos in Seconds</h2>
        <div className="home-page-buttons">
          <button className="sign-in" onClick={redirectToLogin}>
            Sign In
          </button>
          <button className="sign-up" onClick={redirectToRegister}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
