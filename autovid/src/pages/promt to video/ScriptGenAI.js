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
  formData.append("videoStyle", scriptType);

  if (file) {
    formData.append("file", file);
  }

  const response = await fetch("http://localhost:5000/chat/completions", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(`API error: ${response.statusText}`);

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);

  const videoElement = document.getElementById("myVideo");
  videoElement.src = videoUrl;
  videoElement.play();
}
