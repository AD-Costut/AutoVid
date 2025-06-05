const ChatFooter = ({
  textareaRef,
  input,
  handleEnter,
  setInput,
  IMPUT_CHAR_LIMIT,
  aiResponseDone,
  selectedScriptType,
  handleSend,
  selectedOption,
  voiceSelectRef,
  uploadedFile,
  selectedBackground,
  sendButton,
}) => {
  return (
    <div className="chatFooter">
      <div className="inp">
        <textarea
          ref={textareaRef}
          placeholder="Describe your idea"
          value={input}
          onKeyDown={handleEnter}
          onChange={(e) => setInput(e.target.value)}
          maxLength={IMPUT_CHAR_LIMIT}
          disabled={aiResponseDone}
        />

        {selectedScriptType && input.length > 0 && (
          <p
            className="charCount"
            style={{
              color: input.length > IMPUT_CHAR_LIMIT ? "red" : "gray",
              fontSize: "1.75rem",
              margin: "4px",
              display: "flex",
              alignItems: "center",
              width: "5rem",
            }}
          >
            {input.length}/{IMPUT_CHAR_LIMIT} chars
          </p>
        )}

        <button
          className="send"
          onClick={handleSend}
          disabled={
            !selectedOption ||
            !selectedScriptType ||
            !voiceSelectRef.current?.value ||
            input.length > IMPUT_CHAR_LIMIT ||
            !input.trim() ||
            aiResponseDone ||
            (!uploadedFile && !selectedBackground)
          }
        >
          <img src={sendButton} alt="Send" />
        </button>
      </div>
      <p className="disclaimer">
        AutoVid may generate inaccurate or outdated information. Always
        fact-check the content before sharing or publishing.
      </p>
    </div>
  );
};

export default ChatFooter;
