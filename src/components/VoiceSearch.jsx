import React, { useEffect } from 'react';
import useVoice from '../hooks/useVoice';
import './VoiceSearch.css';

const VoiceSearch = ({ onSearch }) => {
  const {
    isListening,
    transcript,
    error,
    success,
    startListening,
    stopListening,
    resetTranscript
  } = useVoice();

  useEffect(() => {
    if (transcript) {
      onSearch(transcript);
    }
  }, [transcript]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <div className="voice-search">
      <button
        onClick={handleClick}
        className={`voice-btn ${isListening ? 'listening' : ''} ${error ? 'error' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      >
        {isListening ? 'Listening...' : 'Voice Search'}
      </button>

      {success && (
        <div className="voice-success">
          {success}
        </div>
      )}

      {transcript && (
        <div className="transcript">
          Heard: "{transcript}"
        </div>
      )}

      {error && (
        <div className="voice-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;