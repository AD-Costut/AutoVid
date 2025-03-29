import LightVideo from "../pages videos/Light Game.mp4";
import "../services/Services.css";
export default function Services() {
  return (
    <div className="services-page">
      <video autoPlay loop muted className="services-page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="services-page-content"></div>
    </div>
  );
}
