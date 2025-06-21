import LightVideo from "../pages videos/Light Game.mp4";
import "../about/About.css";
import "../CommonlyUsedStyles/TransparentBox.css";
import "../CommonlyUsedStyles/PageStyle.css";

export default function About() {
  return (
    <div className="page">
      <video autoPlay loop muted className="page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="page-content">
        <div className="transparent-box">
          <h2>AutoVid – The Ultimate AI Video Generator 🚀</h2>
          <div className="empty-line"></div>
          <div className="about-description">
            <h3>
              AutoVid is a web app that automates video creation from text
              prompts. Users can generate videos in landscape or portrait mode,
              with AI-generated scripts, voiceovers, and visuals.
            </h3>
            <div className="empty-line"></div>
            <h3 className="end-text">
              Simplify content creation with AutoVid!
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
