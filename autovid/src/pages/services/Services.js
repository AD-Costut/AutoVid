import LightVideo from "../pages videos/Light Game.mp4";
import "../services/Services.css";
import "../CommonlyUsedStyles/TransparentBox.css";
import "../CommonlyUsedStyles/PageStyle.css";

export default function Services() {
  return (
    <div className="page">
      <video autoPlay loop muted className="page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="page-content">
        <div className="transparent-box">
          <h2 className="services-title">For free, you can:</h2>
          <div className="services-description">
            <h3>
              🎬 Create Videos Instantly – Just enter a prompt, and AI does the
              rest! Or, if you want, you can come with your script.
            </h3>
            <h3>
              📱 Choose Your Format – Landscape (16:9) or Portrait (9:16) for
              Shorts & Reels.
            </h3>{" "}
            🎙 AI-Powered Voiceovers & Scripts – No need to record anything!
            <h3>🖼 Smart Visuals – Auto-fetch images, GIFs.</h3>{" "}
            <h3>🔥 Effortless content creation, automated for you.</h3>
          </div>
          <h2 className="try-autovid">Try AutoVid today!</h2>
        </div>
      </div>
    </div>
  );
}
