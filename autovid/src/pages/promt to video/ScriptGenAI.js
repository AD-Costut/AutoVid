export async function sendMessageToAi(message) {
  const response = await fetch("http://localhost:5000/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  return data.response;
}
