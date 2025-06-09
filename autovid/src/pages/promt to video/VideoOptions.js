import { tiktokVoices } from "./TextToSpeech";

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
  videoFormat,
  setVideoFormat,
  voiceChoice,
  setVoiceChoice,
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
        <div className="backgroundSelection">
          <div className="imageVideoSelection">
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

            <div className="uploadBackground">
              <label
                className="backgroundUplpadLabel"
                htmlFor="backgroundUpload"
              >
                Or upload a{" "}
                {selectedOption === "Reddit Story" ? "video" : "image"}:
              </label>
              <input
                className="input-file"
                type="file"
                id="backgroundUpload"
                accept={
                  selectedOption === "Reddit Story"
                    ? "video/mp4,video/webm,video/quicktime"
                    : ".jpg, .jpeg, .png"
                }
                onChange={handleBackgroundUpload}
                disabled={optionsDisabled}
              />
            </div>
          </div>{" "}
          <div className="imageVideoSelected">
            <div className="backgroundPreview">
              {background && selectedOption === "Reddit Story" ? (
                <video
                  className="preview-video"
                  src={background}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : background ? (
                <img
                  className="preview-img"
                  src={background}
                  alt="Background preview"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
      <div className="aspectRatioSelector">
        Choose aspect ratio:
        <div className="ratio">
          <label>
            <input
              type="radio"
              name="videoFormat"
              value="16:9"
              checked={videoFormat === "16:9"}
              onChange={(e) => setVideoFormat(e.target.value)}
              disabled={optionsDisabled}
            />
            16:9
          </label>
          <label>
            <input
              type="radio"
              name="videoFormat"
              value="9:16"
              checked={videoFormat === "9:16"}
              onChange={(e) => setVideoFormat(e.target.value)}
              disabled={optionsDisabled}
            />
            9:16 (Shorts)
          </label>
        </div>
      </div>
      <div className="voices">
        <select
          className="voicesDropdown"
          ref={voiceSelectRef}
          disabled={optionsDisabled}
          value={voiceChoice ?? Object.keys(tiktokVoices)[0] ?? ""}
          onChange={(e) => setVoiceChoice(e.target.value)}
        >
          {Object.entries(tiktokVoices).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

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
