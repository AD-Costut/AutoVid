import "./PromptToVideo.css";
import addButton from "./promt-to-video-images/plus-icon.png";
import messageIcon from "./promt-to-video-images/message-icon.svg";
import logOut from "./promt-to-video-images/log-out-icon.svg";
import upgradePlan from "./promt-to-video-images/upgrade-plan-icon.svg";
export default function PromptToVideo() {
  return (
    <div className="promt-to-video">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <span className="brand">AutoVid</span>{" "}
            <img
              src="/TemporaryLogo.jpg"
              alt="TemporaryLogo"
              className="logo"
            />
          </div>
          <button className="midButton">
            <img src={addButton} alt="new video" className="addButton" />
            New Video
          </button>
          <div className="upperSideButton">
            <button className="query">
              <img src={messageIcon} alt="Query" />
              To be changed!
            </button>
            <button className="query">
              <img src={messageIcon} alt="Query" />
              Work in progress
            </button>
          </div>
        </div>
        <div className="lowerSide">
          <div className="listItems">
            <img src={upgradePlan} alt="" className="listingItemsImage" />{" "}
            Upgrade plan
          </div>{" "}
          <div className="listItems">
            <img src={logOut} alt="" className="listingItemsImage" />
            Log out
          </div>
        </div>
      </div>
      <div className="main"></div>
    </div>
  );
}
