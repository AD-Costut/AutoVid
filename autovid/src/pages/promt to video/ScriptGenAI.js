export async function sendMessageToAi(
  message,
  aspectRatio,
  voiceChoice,
  file,
  videoStyle,
  scriptType,
  completedLabel
) {
  const formData = new FormData();

  formData.append("message", message);
  formData.append("aspectRatio", aspectRatio);
  formData.append("voiceChoice", voiceChoice);
  formData.append("videoStyle", videoStyle);
  formData.append("scriptType", scriptType);
  formData.append("completedLabel", completedLabel);

  console.log("message", message);
  console.log("aspectRatio", aspectRatio);
  console.log("voiceChoice", voiceChoice);
  console.log("videoStyle", videoStyle);
  console.log("scriptType", scriptType);
  console.log("comletedLabel", completedLabel);

  if (file) {
    formData.append("file", file);
  }

  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch("http://localhost:5000/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error(`API error: ${response.statusText}`);
      return null;
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Received JSON:", data);
      return data;
    } else {
      console.warn("Unexpected response type:", contentType);
      return null;
    }
  } catch (error) {
    console.error("Network or server error:", error);
    return null;
  }
}
