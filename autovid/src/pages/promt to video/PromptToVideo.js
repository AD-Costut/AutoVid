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
import LoadingMessages from "../promt to video/LoadingVideoMessages";
import axios from "axios";

export default function PromptToVideo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [chatLabel, setChatLabel] = useState("Untitled");
  const chatEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedScriptType, setSelectedScriptType] = useState("");
  const INPUT_CHAR_LIMIT = selectedScriptType === "User Script" ? 4500 : 250;
  const [videoUrl, setVideoUrl] = useState([]);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [chatIds, setChatIds] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [scriptOptionsDisabled, setScriptOptionsDisabled] = useState(false);

  const voiceSelectRef = useRef(null);
  const listenButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const [aiResponseDone, setAiResponseDone] = useState(false);

  const [background, setBackground] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPreset, setIsPreset] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [voiceChoice, setVoiceChoice] = useState(Object.keys(googleVoices)[0]);
  const [isLandscape, setIsLandscape] = useState(true);

  const [AddLoadingMessage, setAddLoadingMessage] = useState(false);

  const [selectedVideoType, setSelectedVideoType] = useState("");

  const [message, setMessage] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const [completedLabel, setCompletedLabel] = useState("");

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

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.userId) setUserId(user.userId);
    }
  }, []);

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

    const now = new Date();

    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear().toString().slice(-2);
    const dateStr = `${day}.${month}.${year}`;
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateTimeStr = `${dateStr} ${timeStr}`;

    let snippet = input.trim();

    if (snippet === snippet.toUpperCase()) {
      snippet =
        snippet.charAt(0).toUpperCase() + snippet.slice(1).toLowerCase();
    }
    if (snippet.length > 8) {
      snippet = snippet.substring(0, 8) + "...";
    }

    const completedLabel = `${snippet} (${dateTimeStr})`;

    setVideoList((prevList) => {
      if (prevList.length === 0) {
        return [completedLabel];
      }
      const updatedList = [...prevList];
      updatedList[0] = completedLabel;
      return updatedList;
    });

    setCompletedLabel(completedLabel);

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
      let finalPrompt = input;
      if (
        selectedVideoType === "Quiz" ||
        selectedVideoType === "Slide Show" ||
        selectedVideoType === "Reddit Story"
      ) {
        finalPrompt = input;
      }

      const res = await sendMessageToAi(
        finalPrompt,
        aspectRatio,
        voiceChoice,
        fileToSend,
        selectedVideoType,
        selectedScriptType,
        completedLabel
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
    } else if (selectedScriptType === "User Script") {
      const res = await sendMessageToAi(
        input,
        aspectRatio,
        voiceChoice,
        fileToSend,
        selectedVideoType,
        selectedScriptType,
        completedLabel
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

  useEffect(() => {
    setIsVideoReady(false);
  }, [message]);

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
    setIsVideoReady(false);

    setVideoList((prevList) => {
      if (prevList.length === 0 || !prevList[0].startsWith("Untitled")) {
        return ["Untitled", ...prevList];
      }
      return prevList;
    });

    setChatIds((prevIds) => {
      const newId = `temp-${Date.now()}`;
      return [newId, ...prevIds];
    });

    setVideoUrl((prev) => [null, ...prev]);
    setUserMessages((prev) => [null, ...prev]);
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

  useEffect(() => {
    if (!userId) return;

    const fetchLabels = async () => {
      console.log("Fetching for userId:", userId);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/chatHistory/${userId}`
        );
        console.log("Response received:", res);

        if (!res.data) {
          console.warn("res.data is undefined or null!");
          return;
        }
        if (!Array.isArray(res.data)) {
          console.warn("res.data is not an array:", res.data);
          return;
        }

        const chatIds = res.data.map((item) => item._id);
        const userMessages = res.data.map((item) => item.userMessage);
        const aspectRatios = res.data.map((item) => item.aspectRatio);
        const voiceChoices = res.data.map((item) => item.voiceChoice);
        const fileNames = res.data.map((item) => item.fileName);
        const videoStyles = res.data.map((item) => item.videoStyle);
        const scriptTypes = res.data.map((item) => item.scriptType);
        const completedLabels = res.data
          .map((item) => item.completedLabel)
          .filter((label) => label);
        const createdAts = res.data.map((item) => item.createdAt);
        const videoUrls = res.data.map((item) => item.videoUrl);

        console.log({
          chatIds,
          userMessages,
          aspectRatios,
          voiceChoices,
          fileNames,
          videoStyles,
          scriptTypes,
          completedLabels,
          createdAts,
          videoUrls,
        });

        setChatIds(chatIds);
        setVideoList(completedLabels);
        setVideoUrl(videoUrls);
        setUserMessages(userMessages);
        console.log("user messages", userMessages, "MESSAGES", messages);
        handleNewVideo();
      } catch (err) {
        console.error("Error fetching labels", err);
        handleNewVideo();
      }
    };

    fetchLabels();
  }, [userId]);

  const handleLabelClick = (label, index) => {
    setSelectedIndex(index);

    if (label.toLowerCase() === "untitled") {
      setMessages([
        {
          isBot: true,
          text: {},
          isVideoLoading: false,
        },
      ]);

      chatEnd.current?.scrollIntoView({ behavior: "smooth" });

      return;
    }

    const selectedMessage = userMessages[index];
    const selectedVideoUrl = videoUrl[index];

    setMessages([
      // {
      //   isBot: true,
      //   text: {},
      //   isVideoLoading: false,
      // },
      {
        isBot: false,
        text: selectedMessage,
      },
      {
        isBot: true,
        text: { videoUrl: selectedVideoUrl },
        isVideoLoading: false,
      },
    ]);
  };

  const handleDeleteLabel = async (index) => {
    if (chatIds.length === 1) {
      alert("Cannot delete the last remaining chat.");
      return;
    }

    const chatIdToDelete = chatIds[index];
    if (!chatIdToDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this label?"
    );
    if (!confirmed) return;

    try {
      if (!chatIdToDelete.startsWith("temp-")) {
        await axios.delete(
          `http://localhost:5000/api/chatHistory/${chatIdToDelete}`
        );
      }

      setChatIds((prev) => prev.filter((_, i) => i !== index));
      setVideoList((prev) => prev.filter((_, i) => i !== index));
      setVideoUrl((prev) => prev.filter((_, i) => i !== index));
      setUserMessages((prev) => prev.filter((_, i) => i !== index));
      // setAspectRatio((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete label:", err);
    }
  };

  return (
    <div className="promt-to-video">
      <Sidebar
        handleNewVideo={handleNewVideo}
        addButton={addButton}
        videoList={videoList}
        messageIcon={messageIcon}
        handleLogout={handleLogout}
        logOut={logOut}
        isVideoReady={isVideoReady}
        userId={userId}
        setVideoList={setVideoList}
        setChatIds={setChatIds}
        handleLabelClick={handleLabelClick}
        handleDeleteLabel={handleDeleteLabel}
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
                  ) : message.isVideoLoading ? (
                    <LoadingMessages />
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
                      onCanPlay={() => setIsVideoReady(true)}
                      onError={() => setIsVideoReady(false)}
                    />
                  ) : (
                    <p className="txt">
                      {/* {message.text.error
                        ? message.text.error
                        : "Hi! What kind of video can I help you create today?"} */}
                    </p>
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
                      setAspectRatio={setAspectRatio}
                      isLandscape={isLandscape}
                      hasProfanity={hasProfanity}
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
