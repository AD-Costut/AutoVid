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
import Video1 from "../pages videos/Rotating Earth.mp4";
import Video2 from "../pages videos/Light Game.mp4";
import Image1 from "../pages photos/Rotating Earth.jpg";
import Image2 from "../pages photos/Light Game.jpg";

export default function PromptToVideo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);

  const chatEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedScriptType, setSelectedScriptType] = useState("");
  const INPUT_CHAR_LIMIT = selectedScriptType === "User Script" ? 2000 : 250;

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

  const [videoFormat, setVideoFormat] = useState("16:9");

  const [selectedVideoType, setSelectedVideoType] = useState("");

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
    if (!input.trim() || input.length > INPUT_CHAR_LIMIT) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);

    if (selectedScriptType === "AI Script") {
      let finalPrompt = "";

      if (selectedVideoType === "Quiz") {
        finalPrompt = `Make a quiz script about: "${input}" for a 1-3 minutes YouTube video.
      
      Start with a clear title for the quiz enclosed in &^& markers, like this:
      &^&[Title]&^&
      
      Then write the entire quiz script inside a single pair of #%# delimiters.
      
      First, read the input and extract the main idea or topic in a short phrase or few words.
      
      The quiz script should start with:
      Welcome to today's quiz about [main idea extracted from the input]. Get ready to test your knowledge.
      
      &^&[Clear Quiz Title]&^&

      Then write exactly 10 questions and answers in this format:
      
      Question 1: [Question text]
      Answer: [Answer text]
      
      Question 2: [Question text]
      Answer: [Answer text]
      
      ... continuing until Question 10.
      
      Do NOT include any narrator labels, parentheses, comments, or extra delimiters.`;
      } else if (selectedVideoType === "Slide Show") {
        finalPrompt = `Make a YouTube slideshow narration script about: "${input}" for a 1-3 minutes video.
      
      Start with a clear title enclosed in &^& markers, like this:
      &^&[Title]&^&
      
      Then write the entire narration script inside a single pair of #%# delimiters.
      
      Write only the narration text to be spoken throughout the slideshow.
      
      Do NOT include slide notes, timestamps, multiple #%# delimiters, parentheses, or narrator labels.
      
      Example output format:
      
      &^&[Clear Title]&^&
      #%#
      [Pure narration script here...]
      #%#`;
      } else if (selectedVideoType === "Reddit Story") {
        finalPrompt = `Create a Reddit-style story script based on: "${input}" for a 1-3 minutes YouTube video.
      
      Start with a clear and engaging story title enclosed in &^& markers, like this:
      &^&[Story Title]&^&
      
      Then write the entire story script inside a single pair of #%# delimiters.
      
      Write the story as pure text, without any narrator labels, parentheses, stage directions, or commentary.
      
      Example output format:
      
      &^&[Story Title]&^&
      #%#
      [Story text here...]
      #%#`;
      }

      const res = await sendMessageToAi(finalPrompt);
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

  const backgroundPresets = {
    "Reddit Story": [
      { id: "bg1", label: "Video 1", src: Video1 },
      { id: "bg2", label: "Video 2", src: Video2 },
    ],
    Quiz: [
      { id: "bg1", label: "Image 1", src: Image1 },
      { id: "bg2", label: "Image 2", src: Image2 },
    ],
  };

  const handleOption = (type, group) => {
    if (group === "video") {
      setSelectedOption(type);
      setSelectedVideoType(type);
      const defaultBg = backgroundPresets[type]?.[0];
      if (defaultBg) {
        setBackground(defaultBg.src);
        setSelectedBackground(defaultBg.id);
        setIsPreset(true);
      } else {
        setBackground(null);
        setSelectedBackground(null);
        setIsPreset(false);
      }

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
        input.length > INPUT_CHAR_LIMIT ||
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
                      setSelectedScriptType={setSelectedScriptType}
                      backgroundPresets={backgroundPresets}
                      videoFormat={videoFormat}
                      setVideoFormat={setVideoFormat}
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
          INPUT_CHAR_LIMIT={INPUT_CHAR_LIMIT}
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
