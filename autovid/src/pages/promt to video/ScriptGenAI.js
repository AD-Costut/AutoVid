export async function sendMessageToAi(message, videoFormat, voiceChoice) {
  const response = await fetch("http://localhost:5000/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, videoFormat, voiceChoice }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}
