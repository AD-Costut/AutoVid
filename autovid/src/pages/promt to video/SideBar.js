import React, { useEffect } from "react";

const Sidebar = ({
  handleNewVideo,
  addButton,
  videoList,
  messageIcon,
  handleLogout,
  logOut,
  isVideoReady,
}) => {
  useEffect(() => {
    handleNewVideo();
  }, []);

  return (
    <div className="sideBar">
      <div className="upperSide">
        <div className="upperSideTop">
          <span className="brand">AutoVid</span>
          <img src="/TemporaryLogo.jpg" alt="TemporaryLogo" className="logo" />
        </div>
        <button
          className={`midButton ${!isVideoReady ? "locked" : ""}`}
          onClick={() => {
            if (!isVideoReady) return;
            handleNewVideo();
          }}
          disabled={!isVideoReady}
          title={
            !isVideoReady
              ? "Please wait for the video to finish generating."
              : ""
          }
        >
          <img src={addButton} alt="new video" className="addButton" />
          New Video
        </button>

        <div className="upperSideButton">
          {videoList.map((label, index) => (
            <button
              key={index}
              className="query"
              onClick={() => {
                if (label.toLowerCase() === "untitled") {
                  window.location.reload();
                }
              }}
            >
              <img src={messageIcon} alt="Query" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="lowerSide">
        <div className="listItems logoutButton" onClick={handleLogout}>
          <img src={logOut} alt="" className="listingItemsImage" />
          Log out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
