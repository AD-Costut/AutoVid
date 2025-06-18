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
import { googleVoices } from "./TextToSpeech";
import { Filter } from "bad-words";

export default function PromptToVideo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);

  const chatEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedScriptType, setSelectedScriptType] = useState("");
  const INPUT_CHAR_LIMIT = selectedScriptType === "User Script" ? 4500 : 250;

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

  const [aspectRatio, setaspectRatio] = useState("16:9");
  const [voiceChoice, setVoiceChoice] = useState(Object.keys(googleVoices)[0]);
  const [isLandscape, setIsLandscape] = useState(true);

  const [AddLoadingMessage, setAddLoadingMessage] = useState(false);

  const [selectedVideoType, setSelectedVideoType] = useState("");

  async function urlToFile(url, filename, mimeType) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  }

  const [messages, setMessages] = useState([
    {
      text: "Hi! What kind of video can I help you create today?",
      isBot: true,
    },
  ]);

  const filter = new Filter();
  const hasProfanity = filter.isProfane(input);

  useEffect(() => {
    if (chatEnd.current) {
      chatEnd.current.scrollTop = chatEnd.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    setOptionsDisabled(true);
    let fileToSend = null;

    if (isLoading || !input.trim() || input.length > INPUT_CHAR_LIMIT) return;

    setIsLoading(true);

    if (!isPreset && uploadedFile) {
      fileToSend = uploadedFile;
    } else if (isPreset && background) {
      const extension = background.split(".").pop().toLowerCase();
      let mimeType = "application/octet-stream";
      if (["mp4", "webm", "mov", "quicktime"].includes(extension)) {
        mimeType = "video/" + extension;
      } else if (["jpg", "jpeg", "png"].includes(extension)) {
        mimeType = "image/" + extension;
      }

      fileToSend = await urlToFile(background, `preset.${extension}`, mimeType);
    }

    setMessages((prev) => [
      ...prev,
      { text: input, isBot: false },
      { isBot: true, isVideoLoading: true, text: null },
    ]);

    if (selectedScriptType === "AI Script") {
      let finalPrompt = "";

      if (selectedVideoType === "Quiz") {
        finalPrompt = `Make 5 questions quiz script about: "${input}".

        Start with a clear title for the quiz enclosed in && markers, like this:
        &&[Title]&&
        
        Then write the entire quiz script inside a single pair of ## delimiters.
        
        The quiz script should start with something like:
        Welcome to today's quiz about the topic.
        
        Then write exactly 5 questions and answers in this format:
        ##
        [1. Short Question 1 text]  
        [A. ]  
        [B. ]  
        [C. ]  
        Correct Answear [ .]  
        
        [2. Short Question 2 text]  
        [A. ]  
        [B. ]  
        [C. ]  
        Correct Answear [ .]  
        
        ...  
        
        [5. Short Question 5 text]  
        [A. ]  
        [B. ]  
        [C. ]  
        Correct Answear [ .]  
        ##
        4500 characters max
        Do NOT include any narrator labels, parentheses, comments, or extra delimiters.`;
      } else if (selectedVideoType === "Slide Show") {
        finalPrompt = `Make a YouTube slideshow narration script about: "${input}" for a youtube video.
  
        Start with a clear title enclosed in && markers, like this:
        &&[Title]&&
        
        Then write the entire narration script inside a single pair of ## delimiters.
        
        Write only the narration text to be spoken throughout the slideshow.
        
        Do NOT include slide notes, timestamps, multiple #%# delimiters, parentheses, or narrator labels.
        
        Example output format:
        
        ##
        [Pure narration script here...]
        ##
        1500 characters max`;
      } else if (selectedVideoType === "Reddit Story") {
        finalPrompt = `Create a Reddit-style story script based on: "${input}" for a YouTube video.
  
        Start with a clear and engaging story title enclosed in && markers, like this:
        &&[Story Title]&&
        
        Then write the entire story script inside a single pair of ## delimiters.
        
        Write the story as pure text, without any narrator labels, parentheses, stage directions, or commentary.
        
        Example output format:
        
        ##
        [Story text here...]
        ##
        4500 characters max`;
      }

      const res = await sendMessageToAi(
        finalPrompt,
        aspectRatio,
        voiceChoice,
        fileToSend,
        selectedVideoType,
        selectedScriptType
      );
      if (!res) {
        console.error("AI response is undefined!");
        return;
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex((msg) => msg.isVideoLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = { text: res, isBot: true };
        }
        return newMessages;
      });

      // if (selectedScriptType === "AI Script") {
      //   let finalPrompt = "";

      //   if (selectedVideoType === "Quiz") {
      //     finalPrompt = input;
      //   } else if (selectedVideoType === "Slide Show") {
      //     finalPrompt = input;
      //   } else if (selectedVideoType === "Reddit Story") {
      //     finalPrompt = input;
      //   }

      //   const res = await sendMessageToAi(
      //     finalPrompt,
      //     aspectRatio,
      //     voiceChoice,
      //     fileToSend,
      //     selectedVideoType,
      //     selectedScriptType
      //   );
      //   if (!res) {
      //     console.error("AI response is undefined!");
      //     return;
      //   }
      //   setMessages((prev) => [...prev, { text: res, isBot: true }]);
    } else if (selectedScriptType === "User Script") {
      const res = await sendMessageToAi(
        input,
        aspectRatio,
        voiceChoice,
        fileToSend,
        selectedVideoType,
        selectedScriptType
      );
      if (!res) {
        console.error("User prompt undefined");
        return;
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex((msg) => msg.isVideoLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = { text: res, isBot: true };
        }
        return newMessages;
      });
    }

    setOptionsDisabled(true);
    setAiResponseDone(true);
    setInput("");
    setIsLoading(false);
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

    if (isReddit) {
      const video = document.createElement("video");
      video.src = fileUrl;
      video.onloadedmetadata = () => {
        const landscape = video.videoWidth >= video.videoHeight;
        setIsLandscape(landscape);
      };
    } else if (isQuiz) {
      const img = new Image();
      img.src = fileUrl;
      img.onload = () => {
        const landscape = img.naturalWidth >= img.naturalHeight;
        setIsLandscape(landscape);
      };
    }
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (filter.isProfane(input)) {
        return;
      }

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
  const isPortrait = aspectRatio === "9:16";

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (AddLoadingMessage) {
      setMessages((prev) => [
        ...prev,
        {
          isBot: true,
          isVideoLoading: true,
          text: null,
        },
      ]);
    }
  }, [AddLoadingMessage]);

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
                  {typeof message.text === "string" ? (
                    <p className="txt">{message.text}</p>
                  ) : message.isVideoLoading ||
                    (message.text && !message.text.videoUrl) ? (
                    <div className="videoLoading">
                      <div className="spinner" />
                      <p>🎬 Video in the making...</p>
                      <p>Please wait...</p>
                      <p>It might take a while... ⏳</p>
                    </div>
                  ) : message.text && message.text.videoUrl ? (
                    <video
                      src={
                        message.text.videoUrl.startsWith("http")
                          ? message.text.videoUrl
                          : `http://localhost:5000${message.text.videoUrl}`
                      }
                      controls
                      style={{
                        maxWidth: isPortrait ? "35%" : "100%",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <p className="txt">Unsupported message format</p>
                  )}

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
                      aspectRatio={aspectRatio}
                      voiceChoice={voiceChoice}
                      setVoiceChoice={setVoiceChoice}
                      setaspectRatio={setaspectRatio}
                      isLandscape={isLandscape}
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
          isLoading={isLoading}
          Filter={Filter}
          hasProfanity={hasProfanity}
        />
      </div>
    </div>
  );
}
