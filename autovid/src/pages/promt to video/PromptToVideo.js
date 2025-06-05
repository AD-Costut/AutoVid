/* global google */
import "./PromptToVideo.css";
import addButton from "./promt-to-video-images/plus-icon.png";
import messageIcon from "./promt-to-video-images/message-icon.svg";
import logOut from "./promt-to-video-images/log-out-icon.svg";
// import upgradePlan from "./promt-to-video-images/upgrade-plan-icon.svg";
import sendButton from "./promt-to-video-images/send-icon.svg";
import userIcon from "./promt-to-video-images/user-icon.png";
import playIcon from "./promt-to-video-images/play-icon.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sendMessageToAi } from "./ScriptGenAI";
import { textToSpeech } from "./TextToSpeech";
import VideoOptions from "./VideoOptions";
import { jwtDecode } from "jwt-decode";
import ChatFooter from "./ChatFooter";
import Sidebar from "./SideBar";
import "./ButtonsPrToVid.css";

export default function PromptToVideo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);

  const chatEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedScriptType, setSelectedScriptType] = useState("");
  const IMPUT_CHAR_LIMIT = selectedScriptType === "User Script" ? 2000 : 250;

  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const [scriptOptionsDisabled, setScriptOptionsDisabled] = useState(false);

  const voiceSelectRef = useRef(null);
  const listenButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const [aiResponseDone, setAiResponseDone] = useState(false);

  const [background, setBackground] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPreset, setIsPreset] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState(null);

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
        setBackground("/images/bg1.jpg");
        setSelectedBackground("bg1");
        setIsPreset(true);
        setSelectedScriptType("AI Script");
        setScriptOptionsDisabled(true);
      } else if (type === "Reddit Story") {
        setBackground("presetVideo1.mp4");
        setSelectedBackground("bg1");
        setIsPreset(true);
        setScriptOptionsDisabled(false);
      } else {
        setBackground(null);
        setSelectedBackground(null);
        setIsPreset(false);
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
    setSelectedBackground("upload");
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (
        (!background &&
          (selectedOption === "Quiz" || selectedOption === "Reddit Story")) ||
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
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

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
      <Sidebar
        handleNewVideo={handleNewVideo}
        addButton={addButton}
        videoList={videoList}
        messageIcon={messageIcon}
        handleLogout={handleLogout}
        logOut={logOut}
      />
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
                    <VideoOptions
                      selectedOption={selectedOption}
                      handleOption={handleOption}
                      optionsDisabled={optionsDisabled}
                      selectedBackground={selectedBackground}
                      setBackground={setBackground}
                      setIsPreset={setIsPreset}
                      setSelectedBackground={setSelectedBackground}
                      handleBackgroundUpload={handleBackgroundUpload}
                      background={background}
                      voiceSelectRef={voiceSelectRef}
                      listenButtonRef={listenButtonRef}
                      input={input}
                      selectedScriptType={selectedScriptType}
                      scriptOptionsDisabled={scriptOptionsDisabled}
                      playIcon={playIcon}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
        <ChatFooter
          textareaRef={textareaRef}
          input={input}
          handleEnter={handleEnter}
          setInput={setInput}
          IMPUT_CHAR_LIMIT={IMPUT_CHAR_LIMIT}
          aiResponseDone={aiResponseDone}
          selectedScriptType={selectedScriptType}
          handleSend={handleSend}
          selectedOption={selectedOption}
          voiceSelectRef={voiceSelectRef}
          uploadedFile={uploadedFile}
          selectedBackground={selectedBackground}
          sendButton={sendButton}
        />
      </div>
    </div>
  );
}
