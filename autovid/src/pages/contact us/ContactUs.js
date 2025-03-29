import LightVideo from "../pages videos/Light Game.mp4";
import "../contact us/ContactUs.css";
import "../CommonlyUsedStyles/TransparentBox.css";
import "../CommonlyUsedStyles/PageStyle.css";

export default function ContactUs() {
  return (
    <div className="page">
      <video autoPlay loop muted className="page-video">
        <source src={LightVideo} autoPlay loop />
      </video>

      <div className="page-content">
        {" "}
        <div className="transparent-box">
          <div className="contact-us">
            <h3>
              We're here to help! Reach out to us through the options below:
            </h3>

            <div className="contact-section">
              <p>
                <div className="empty-line"></div>
                <h3 className="contact-title">Email:</h3>{" "}
                <a href="mailto:support@autovid.com">support@autovid.com</a>
              </p>
            </div>

            <div className="contact-section">
              <ul>
                {" "}
                <div className="empty-line"></div>
                <h3 className="contact-title">Social Media:</h3>
                <li>
                  <a
                    href="https://twitter.com/AutoVidApp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com/AutoVidOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/AutoVidApp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            <div className="contact-section">
              <p>
                <div className="empty-line"></div>
                <h3 className="contact-title">Phone:</h3>
                <>000 000 0000</>
              </p>
              <div className="empty-line"></div>
              <h3 className="contact-title">Available: </h3>
              <p>Monday to Friday, 9:00 AM - 6:00 PM GMT</p>
            </div>

            <div className="contact-section">
              <div className="empty-line"></div>
              <h3 className="contact-title">Office Address:</h3>
              <p>Timișoara, Complex Studențesc</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
