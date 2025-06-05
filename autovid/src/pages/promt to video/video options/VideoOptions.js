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
              {selectedOption === "Reddit Story" ? (
                <>
                  <button
                    className={`optionButton ${
                      selectedBackground === "bg1" ? "selectedOption" : ""
                    }`}
                    onClick={() => {
                      setBackground("presetVideo1.mp4");
                      setIsPreset(true);
                      setSelectedBackground("bg1");
                    }}
                    disabled={optionsDisabled}
                  >
                    Video 1
                  </button>
                  <button
                    className={`optionButton ${
                      selectedBackground === "bg2" ? "selectedOption" : ""
                    }`}
                    onClick={() => {
                      setBackground("presetVideo2.mp4");
                      setIsPreset(true);
                      setSelectedBackground("bg2");
                    }}
                    disabled={optionsDisabled}
                  >
                    Video 2
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`optionButton ${
                      selectedBackground === "bg1" ? "selectedOption" : ""
                    }`}
                    onClick={() => {
                      setBackground("/images/bg1.jpg");
                      setIsPreset(true);
                      setSelectedBackground("bg1");
                    }}
                    disabled={optionsDisabled}
                  >
                    Image 1
                  </button>

                  <button
                    className={`optionButton ${
                      selectedBackground === "bg2" ? "selectedOption" : ""
                    }`}
                    onClick={() => {
                      setBackground("/images/bg2.jpg");
                      setIsPreset(true);
                      setSelectedBackground("bg2");
                    }}
                    disabled={optionsDisabled}
                  >
                    Image 2
                  </button>
                </>
              )}
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
