import Video1 from "../pages videos/Rotating Earth.mp4";
import Video2 from "../pages videos/Light Game.mp4";
import Image1 from "../pages photos/Rotating Earth.jpg";
import Image2 from "../pages photos/Light Game.jpg";

const VideoOptions = ({
  selectedOption,
  handleOption,
  optionsDisabled,
  selectedBackground,
  setBackground,
  setIsPreset,
  setSelectedBackground,
  handleBackgroundUpload,
  background,
  voiceSelectRef,
  listenButtonRef,
  input,
  selectedScriptType,
  scriptOptionsDisabled,
  playIcon,
  backgroundPresets,
}) => {
  return (
    <div className="videoOptions">
      <div className="videoOptionsButtons">
        {["Quiz", "Slide Show", "Reddit Story"].map((type) => (
          <button
            key={type}
            className={`optionButton ${
              selectedOption === type ? "selectedOption" : ""
            }`}
            onClick={() => handleOption(type, "video")}
            disabled={optionsDisabled}
          >
            {type}
          </button>
        ))}
      </div>

      {(selectedOption === "Quiz" || selectedOption === "Reddit Story") && (
        <div className="backgroundSelection" style={{ display: "flex" }}>
          <div className="imageVideoSelection" style={{ width: "20rem" }}>
            <p>Select a background:</p>
            <div className="presetBackgrounds">
              {backgroundPresets[selectedOption]?.map(({ id, label, src }) => (
                <button
                  key={id}
                  className={`optionButton ${
                    selectedBackground === id ? "selectedOption" : ""
                  }`}
                  onClick={() => {
                    setBackground(src);
                    setIsPreset(true);
                    setSelectedBackground(id);
                  }}
                  disabled={optionsDisabled}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              className="uploadBackground"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="backgroundUpload">
                Or upload a{" "}
                {selectedOption === "Reddit Story" ? "video" : "image"}:
              </label>
              <input
                type="file"
                id="backgroundUpload"
                accept={
                  selectedOption === "Reddit Story"
                    ? "video/mp4,video/webm,video/quicktime"
                    : ".jpg, .jpeg, .png"
                }
                onChange={handleBackgroundUpload}
                disabled={optionsDisabled}
                style={{
                  cursor: optionsDisabled ? "not-allowed" : "pointer",
                }}
              />
            </div>
          </div>
          <div
            className="imageVideoSelected"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="backgroundPreview">
              {background && selectedOption === "Reddit Story" ? (
                <video
                  src={background}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "17.5rem",
                    borderRadius: "8px",
                  }}
                />
              ) : background ? (
                <img
                  src={background}
                  alt="Background preview"
                  style={{
                    width: "17.5rem",
                    borderRadius: "8px",
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="voices">
        <select
          className="voicesDropdown"
          ref={voiceSelectRef}
          disabled={optionsDisabled}
        ></select>

        <button
          className="listen"
          ref={listenButtonRef}
          disabled={optionsDisabled || !input.trim()}
        >
          <img src={playIcon} alt="" />
          Listen
        </button>

        <span
          className={`info-icon ${
            optionsDisabled || !input.trim() ? "flash" : ""
          }`}
          title="Want to hear how a voice sounds? Type something in the input box, pick a voice, then click Listen."
        >
          ℹ️
        </span>
      </div>

      <div className="scriptOptionsButtons">
        {["AI Script", "User Script"].map((type) => (
          <button
            key={type}
            className={`optionButton ${
              selectedScriptType === type ? "selectedOption" : ""
            }`}
            onClick={() => handleOption(type, "script")}
            disabled={optionsDisabled || scriptOptionsDisabled}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoOptions;
