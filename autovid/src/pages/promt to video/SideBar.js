import React, { useEffect } from "react";
import axios from "axios";

const Sidebar = ({
  handleNewVideo,
  addButton,
  videoList,
  setVideoList,
  messageIcon,
  handleLogout,
  logOut,
  isVideoReady,
  userId,
  setChatLabel,
  setChatIds,
  handleLabelClick,
  handleDeleteLabel,
}) => {
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
            window.location.reload();
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
            <div key={index} className="label-item">
              <button
                className="query"
                onClick={() => handleLabelClick(label, index)}
              >
                <div className="query-left">
                  <img src={messageIcon} alt="Query" />
                  <span className="query-text">{label}</span>
                </div>

                {videoList.length > 1 &&
                  label !== "Untitled" &&
                  index !== 0 && (
                    <span
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLabel(index);
                        window.location.reload();
                      }}
                    >
                      🗑️
                    </span>
                  )}
              </button>
            </div>
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
