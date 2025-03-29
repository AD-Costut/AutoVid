import LightVideo from "../pages videos/Light Game.mp4";
import "../about/About.css";

export default function About() {
  return (
    <div className="about-page">
      <video autoPlay loop muted className="about-page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="about-page-content">
        <div className="about-box">
          <h2>AutoVid – The Ultimate AI Video Generator 🚀</h2>
          <div className="about-description">
            <h3>
              AutoVid is a web app that automates video creation from text
              prompts. Users can generate videos in landscape or portrait mode,
              with AI-generated scripts, voiceovers, and visuals. The platform
              allows editing, thumbnail generation, and direct YouTube uploads
              with scheduled posting.
            </h3>
            <div className="empty-line"></div>
            <h3>Simplify content creation with AutoVid!</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
