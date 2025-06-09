export function textToSpeech(selectElem, buttonElem, textareaElem) {
  selectElem.innerHTML = "";
  Object.entries(tiktokVoices).forEach(([voiceKey, voiceLabel], i) => {
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
        "https://tiktok-tts.weilnet.workers.dev/api/generation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice }),
        }
      );

      const data = await response.json();
      const base64Audio = data.data;

      if (!base64Audio) {
        alert("Failed to generate audio.");
        return;
      }

      const audio = new Audio("data:audio/mp3;base64," + base64Audio);
      audio.play();
    } catch (err) {
      console.error("Error generating TikTok TTS:", err);
      alert("Error generating TTS. Check console for details.");
    }
  };
}

export const tiktokVoices = {
  en_us_001: "Female (Classic)",
  en_us_006: "Male (Energetic)",
  en_us_007: "Male (Calm)",
  en_us_009: "Female (Warm)",
  en_us_010: "Female (Bright)",
};
