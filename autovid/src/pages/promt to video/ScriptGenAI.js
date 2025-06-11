export async function sendMessageToAi(
  message,
  videoFormat,
  voiceChoice,
  file,
  videoStyle,
  scriptType
) {
  const formData = new FormData();

  formData.append("message", message);
  formData.append("videoFormat", videoFormat);
  formData.append("voiceChoice", voiceChoice);
  formData.append("videoStyle", videoStyle);
  formData.append("scriptType", scriptType);

  console.log("message", message);
  console.log("videoFormat", videoFormat);
  console.log("voiceChoice", voiceChoice);
  console.log("videoStyle", videoStyle);
  console.log("scriptType", scriptType);

  if (file) {
    formData.append("file", file);
  }

  try {
    const response = await fetch("http://localhost:5000/chat/completions", {
      method: "POST",
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
