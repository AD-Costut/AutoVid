import { useState, useEffect } from "react";

const LoadingMessages = () => {
  const baseMessages = [
    "🎬 Video in the making",
    "🙏 Please wait",
    "⏳ It might take a while",
  ];

  const [index, setIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % baseMessages.length);
    }, 10000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div className="videoLoading">
      <div className="spinner" />
      <p>
        {baseMessages[index]}
        <span className="dots">{dots}</span>
      </p>
    </div>
  );
};

export default LoadingMessages;
