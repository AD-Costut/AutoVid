const ChatFooter = ({
  textareaRef,
  input,
  handleEnter,
  setInput,
  INPUT_CHAR_LIMIT,
  messageToSend,
  selectedScriptType,
  handleSend,
  selectedOption,
  voiceSelectRef,
  uploadedFile,
  selectedBackground,
  sendButton,
  isLoading,
  hasProfanity,
}) => {
  return (
    <div className="chatFooter">
      <div className="inp">
        <textarea
          ref={textareaRef}
          placeholder={
            selectedScriptType === "User Script"
              ? "Input your script here..."
              : "Describe your idea..."
          }
          value={input}
          onKeyDown={handleEnter}
          onChange={(e) => setInput(e.target.value)}
          maxLength={INPUT_CHAR_LIMIT}
          disabled={messageToSend}
        />

        {selectedScriptType && input.length > 0 && (
          <p
            className="charCount"
            style={{
              color: input.length > INPUT_CHAR_LIMIT ? "red" : "gray",
            }}
          >
            {input.length}/{INPUT_CHAR_LIMIT} chars
          </p>
        )}

        {hasProfanity && (
          <div className="profanityWarning">
            Please remove inappropriate language before submitting your message.
          </div>
        )}

        <button
          className="send"
          onClick={handleSend}
          disabled={
            !selectedOption ||
            !selectedScriptType ||
            !voiceSelectRef.current?.value ||
            input.length > INPUT_CHAR_LIMIT ||
            !input.trim() ||
            messageToSend ||
            isLoading ||
            hasProfanity ||
            (selectedScriptType === "Slide Show" &&
              !uploadedFile &&
              !selectedBackground)
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
