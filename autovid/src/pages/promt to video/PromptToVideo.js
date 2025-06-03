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

export default function PromptToVideo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);

  const chatEnd = useRef(null);
  const [input, setInput] = useState("");

  const IMPUT_CHAR_LIMIT = 750;

  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedScriptType, setSelectedScriptType] = useState("");
  const [scriptOptionsDisabled, setScriptOptionsDisabled] = useState(false);

  const voiceSelectRef = useRef(null);
  const listenButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const [aiResponseDone, setAiResponseDone] = useState(false);

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
      setOptionsDisabled(true);
      setAiResponseDone(true);
    }

    setInput("");
  };

  const handleOption = (type, group) => {
    if (optionsDisabled) return;

    if (group === "video") {
      setSelectedOption(type);

      if (type === "Quiz") {
        setSelectedScriptType("AI Script");
        setScriptOptionsDisabled(true);
      } else {
        setSelectedScriptType("");
        setScriptOptionsDisabled(false);
      }
    } else if (group === "script" && !scriptOptionsDisabled) {
      setSelectedScriptType(type);
    }
  };

  // const handleOption = (type) => {
  //   if (optionsDisabled) return;
  //   setSelectedOption(type);
  //   setMessages((prev) => [...prev]);
  // };

  // const handleScriptOption = (type) => {
  //   if (optionsDisabled) return;
  //   setSelectedScriptType(type);
  // };

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
                  src={message.isBot ? "/TemporaryLogoCircle.jpg" : userIcon}
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
              maxLength={IMPUT_CHAR_LIMIT + 100}
              disabled={aiResponseDone}
            />
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
