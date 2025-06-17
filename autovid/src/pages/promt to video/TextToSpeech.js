export function textToSpeech(selectElem, buttonElem, textareaElem) {
  selectElem.innerHTML = "";
  Object.entries(googleVoices).forEach(([voiceKey, voiceLabel], i) => {
    selectElem.options[i] = new Option(voiceLabel, voiceKey);
  });

  buttonElem.onclick = async () => {
    const text = textareaElem.value;
    const voice = selectElem.value;

    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    try {
      const response = await fetch(
        "https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyAVF_TqCTtO_-rbD5eb97RfEYBkj426WFw",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: "en-US",
              name: voice,
            },
            audioConfig: {
              audioEncoding: "MP3",
            },
          }),
        }
      );

      const data = await response.json();
      const base64Audio = data.audioContent;

      if (!base64Audio) {
        alert("Failed to generate audio.");
        return;
      }

      const audio = new Audio("data:audio/mp3;base64," + base64Audio);
      audio.play();
    } catch (err) {
      console.error("Error generating Google TTS:", err);
      alert("Error generating TTS. Check console for details.");
    }
  };
}

export const googleVoices = {
  "en-US-Wavenet-F": "Female (Wavenet F)",
  "en-US-Wavenet-D": "Male (Wavenet D)",
  "en-US-Neural2-J": "Male (Neural2 J)",
  "en-US-Neural2-F": "Female (Neural2 F)",
};
