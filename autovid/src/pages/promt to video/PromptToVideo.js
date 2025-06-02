/* global google */
import "./PromptToVideo.css";
import addButton from "./promt-to-video-images/plus-icon.png";
import messageIcon from "./promt-to-video-images/message-icon.svg";
import logOut from "./promt-to-video-images/log-out-icon.svg";
// import upgradePlan from "./promt-to-video-images/upgrade-plan-icon.svg";
import sendButton from "./promt-to-video-images/send-icon.svg";
import userIcon from "./promt-to-video-images/user-icon.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sendMessageToAi } from "./ScriptGenAI";

export default function PromptToVideo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);

  const chatEnd = useRef(null);
  const [input, setInput] = useState("");

  const IMPUT_CHAR_LIMIT = 750;
  const [error, setError] = useState("");

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
    if (!input.trim()) return;
    if (input.length > IMPUT_CHAR_LIMIT) return;

    const res = await sendMessageToAi(input);
    if (!res) {
      console.error("AI response is undefined!");
      return;
    }

    setMessages([
      ...messages,
      { text: input, isBot: false },
      { text: res, isBot: true },
    ]);

    setInput("");
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
                <p className="txt">{message.text}</p>
              </div>
            ))}
        </div>
        <div className="chatFooter">
          <div className="inp">
            <textarea
              placeholder="Describe your idea"
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => setInput(e.target.value)}
              maxLength={IMPUT_CHAR_LIMIT + 100}
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
              disabled={input.length > IMPUT_CHAR_LIMIT || !input.trim()}
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
