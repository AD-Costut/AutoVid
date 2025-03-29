import LightVideo from "../pages videos/Light Game.mp4";
import "../services/Services.css";
export default function Services() {
  return (
    <div className="services-page">
      <video autoPlay loop muted className="services-page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="services-page-content">
        <div className="services-box">
          <h2 className="services-title">For free, you can:</h2>
          <div className="services-description">
            <h3>
              🎬 Create Videos Instantly – Just enter a prompt, and AI does the
              rest!
            </h3>
            <h3>
              📱 Choose Your Format – Landscape (16:9) or Portrait (9:16) for
              Shorts & Reels.
            </h3>{" "}
            🎙 AI-Powered Voiceovers & Scripts – No need to record anything!
            <h3>
              🖼 Smart Visuals – Auto-fetch images, GIFs & background music.
            </h3>{" "}
            <h3>
              ✂️ Edit & Customize – Swap visuals, tweak scripts, and regenerate.
            </h3>{" "}
            <h3>
              📢 One-Click Upload – Directly post to YouTube, with AI-generated
              titles & tags!
            </h3>
            <h3>🔥 Effortless content creation, automated for you.</h3>
          </div>
          <h2 className="try-autovid">Try AutoVid today!</h2>
        </div>
      </div>
    </div>
  );
}
