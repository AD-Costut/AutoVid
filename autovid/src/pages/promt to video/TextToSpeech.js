export function textToSpeech(selectElem, buttonElem, textareaElem) {
  const speech = new SpeechSynthesisUtterance();
  let voices = [];

  function populateVoices() {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0] || null;

    selectElem.innerHTML = "";
    voices.forEach((voice, i) => {
      selectElem.options[i] = new Option(voice.name, i);
    });
  }

  window.speechSynthesis.onvoiceschanged = populateVoices;

  buttonElem.onclick = null;
  selectElem.onchange = null;

  selectElem.onchange = () => {
    const selectedIndex = selectElem.value;
    speech.voice = voices[selectedIndex];
  };

  buttonElem.onclick = () => {
    window.speechSynthesis.cancel();
    speech.text = textareaElem.value;
    window.speechSynthesis.speak(speech);
  };

  populateVoices();
}
