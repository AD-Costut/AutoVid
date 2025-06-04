/* global google */
import "./PromptToVideo.css";
import addButton from "./promt-to-video-images/plus-icon.png";
import messageIcon from "./promt-to-video-images/message-icon.svg";
import logOut from "./promt-to-video-images/log-out-icon.svg";
// import upgradePlan from "./promt-to-video-images/upgrade-plan-icon.svg";
import sendButton from "./promt-to-video-images/send-icon.svg";
import userIcon from "./promt-to-video-images/user-icon.png";
import playIcon from "./promt-to-video-images/play-icon.png";
import dropDownIcon from "./promt-to-video-images/dropdown-icon.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sendMessageToAi } from "./ScriptGenAI";
import { textToSpeech } from "./TextToSpeech";
import { jwtDecode } from "jwt-decode";

export default function PromptToVideo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);

  const chatEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedScriptType, setSelectedScriptType] = useState("");
  const IMPUT_CHAR_LIMIT = selectedScriptType === "User Script" ? 2000 : 250;
  const [showCharLimit, setShowCharLimit] = useState(false);

  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const [scriptOptionsDisabled, setScriptOptionsDisabled] = useState(false);

  const voiceSelectRef = useRef(null);
  const listenButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const [aiResponseDone, setAiResponseDone] = useState(false);

  const [background, setBackground] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPreset, setIsPreset] = useState(false);
  const [presetName, setPresetName] = useState("");

  const [messages, setMessages] = useState([
    {
      text: "Hi! What kind of video can I help you create today?",
      isBot: true,
    },
  ]);

  useEffect(() => {
    if (chatEnd.current) {
      chatEnd.current.scrollTop = chatEnd.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || input.length > IMPUT_CHAR_LIMIT) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);

    if (selectedScriptType === "AI Script") {
      const res = await sendMessageToAi(input);
      if (!res) {
        console.error("AI response is undefined!");
        return;
      }

      setMessages((prev) => [...prev, { text: res, isBot: true }]);
    }

    setOptionsDisabled(true);
    setAiResponseDone(true);

    setInput("");
  };

  const handleOption = (type, group) => {
    if (group === "video") {
      setSelectedOption(type);

      if (type === "Quiz") {
        setSelectedScriptType("AI Script");
        setScriptOptionsDisabled(true);
      } else {
        setScriptOptionsDisabled(false);
      }
    } else if (group === "script" && !scriptOptionsDisabled) {
      setSelectedScriptType(type);
    }
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isQuiz = selectedOption === "Quiz";
    const isReddit = selectedOption === "Reddit Story";

    const allowedTypes = isQuiz
      ? ["image/jpeg", "image/jpg", "image/png"]
      : isReddit
      ? ["video/mp4", "video/webm", "video/quicktime"]
      : ["video/mp4", "video/webm", "video/quicktime"];

    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid file type for ${selectedOption}`);
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setUploadedFile(file);
    setBackground(fileUrl);
    setIsPreset(false);
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (
        !selectedOption ||
        !selectedScriptType ||
        !voiceSelectRef.current?.value ||
        input.length > IMPUT_CHAR_LIMIT ||
        !input.trim() ||
        aiResponseDone
      ) {
        return;
      }

      await handleSend();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    google.accounts.id.disableAutoSelect();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const handleNewVideo = () => {
    const newLabel = `Untitled ${videoList.length + 1}`;
    setVideoList([...videoList, newLabel]);
  };

  useEffect(() => {
    if (
      voiceSelectRef.current &&
      listenButtonRef.current &&
      textareaRef.current
    ) {
      textToSpeech(
        voiceSelectRef.current,
        listenButtonRef.current,
        textareaRef.current
      );
    }
  }, []);

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
          <button
            className="midButton"
            onClick={() => {
              handleNewVideo();
              // window.location.reload();
            }}
          >
            <img src={addButton} alt="new video" className="addButton" />
            New Video
          </button>
          <div className="upperSideButton">
            {videoList.map((label, index) => (
              <button key={index} className="query">
                <img src={messageIcon} alt="Query" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="lowerSide">
          {/* <div className="listItems">
            <img src={upgradePlan} alt="" className="listingItemsImage" />
            Upgrade plan
          </div> */}
          <div
            className="listItems logoutButton"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <img src={logOut} alt="" className="listingItemsImage" />
            Log out
          </div>
        </div>
      </div>
      <div className="main">
        <div className="chats" ref={chatEnd}>
          {messages
            .filter((msg) => msg && typeof msg.isBot !== "undefined")
            .map((message, i) => (
              <div key={i} className={message.isBot ? "chat bot" : "chat"}>
                <img
                  className="chatImg"
                  src={
                    message.isBot
                      ? "/TemporaryLogoCircle.jpg"
                      : user?.picture ?? userIcon
                  }
                  alt=""
                />
                <div>
                  <p className="txt">{message.text}</p>
                  {message.isBot && i === 0 && (
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

                      {(selectedOption === "Quiz" ||
                        selectedOption === "Reddit Story") && (
                        <div className="backgroundSelection">
                          <p>Select a background:</p>
                          <div className="presetBackgrounds">
                            {selectedOption === "Reddit Story" ? (
                              <>
                                <button
                                  onClick={() =>
                                    setBackground("presetVideo1.mp4")
                                  }
                                >
                                  Video Background 1
                                </button>
                                <button
                                  onClick={() =>
                                    setBackground("presetVideo2.mp4")
                                  }
                                >
                                  Video Background 2
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setBackground("bg1.jpg")}
                                >
                                  Background 1
                                </button>
                                <button
                                  onClick={() => setBackground("bg2.jpg")}
                                >
                                  Background 2
                                </button>
                              </>
                            )}
                          </div>

                          <div className="uploadBackground">
                            <label htmlFor="backgroundUpload">
                              Or upload a{" "}
                              {selectedOption === "Reddit Story"
                                ? "video"
                                : "image"}
                              :
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
                            />
                          </div>

                          {/* Afișează background-ul */}
                          <div className="backgroundPreview">
                            {background && selectedOption === "Reddit Story" ? (
                              <video
                                src={background}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: "100%", borderRadius: "8px" }}
                              />
                            ) : background ? (
                              <img
                                src={background}
                                alt="Background preview"
                                style={{ width: "100%", borderRadius: "8px" }}
                              />
                            ) : null}
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
                              selectedScriptType === type
                                ? "selectedOption"
                                : ""
                            }`}
                            onClick={() => handleOption(type, "script")}
                            disabled={optionsDisabled || scriptOptionsDisabled}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="chatFooter">
          <div className="inp">
            <textarea
              ref={textareaRef}
              placeholder="Describe your idea"
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => setInput(e.target.value)}
              maxLength={IMPUT_CHAR_LIMIT}
              disabled={aiResponseDone}
            />

            {selectedScriptType && input.length > 0 && (
              <p
                className="charCount"
                style={{
                  color: input.length > IMPUT_CHAR_LIMIT ? "red" : "gray",
                  fontSize: "1.75rem",
                  margin: "4px",
                  display: "flex",
                  alignItems: "center",
                  width: "5rem",
                }}
              >
                {input.length}/{IMPUT_CHAR_LIMIT} chars
              </p>
            )}

            <button
              className="send"
              onClick={handleSend}
              disabled={
                !selectedOption ||
                !selectedScriptType ||
                !voiceSelectRef.current?.value ||
                input.length > IMPUT_CHAR_LIMIT ||
                !input.trim() ||
                aiResponseDone
              }
            >
              <img src={sendButton} alt="Send" />
            </button>
          </div>
          <p className="disclaimer">
            AutoVid may generate inaccurate or outdated information. Always
            fact-check the content before sharing or publishing.
          </p>
        </div>
      </div>
    </div>
  );
}
