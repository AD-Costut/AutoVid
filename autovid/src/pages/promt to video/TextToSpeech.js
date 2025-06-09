export function textToSpeech(selectElem, buttonElem, textareaElem) {
  const tiktokVoices = {
    en_us_001: "Female (Classic)",
    en_us_006: "Male (Energetic)",
    en_us_007: "Male (Calm)",
    en_us_009: "Female (Warm)",
    en_us_010: "Female (Bright)",
  };

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

      const srtContent = generateSRT(text, audio.duration || 5);
      downloadFile("tts.srt", srtContent);

      const a = document.createElement("a");
      a.href = audio.src;
      a.download = "tts.mp3";
      a.click();
    } catch (err) {
      console.error("Error generating TikTok TTS:", err);
      alert("Error generating TTS. Check console for details.");
    }
  };
}

function generateSRT(text, durationSec) {
  const words = text.split(/\s+/);
  const wordDuration = durationSec / words.length;
  let srt = "";
  let startTime = 0;

  words.forEach((word, i) => {
    const endTime = startTime + wordDuration;
    srt += `${i + 1}\n`;
    srt += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    srt += `${word}\n\n`;
    startTime = endTime;
  });

  return srt;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
}

function downloadFile(filename, content) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  a.download = filename;
  a.click();
}
