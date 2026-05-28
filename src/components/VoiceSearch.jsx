import React, { useState, useEffect } from 'react';
import useVoice from '../hooks/useVoice';
import './VoiceSearch.css';

const VoiceSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const {
    isListening,
    transcript,
    error,
    success,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoice();

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      onSearch(transcript);
    }
  }, [transcript, onSearch]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
      return;
    }
    resetTranscript();
    startListening();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form className="voice-search" onSubmit={handleSubmit}>
      <div className="voice-search-row">
        <label className="search-field">
          <span className="search-label">Search items</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, descriptions, or items"
            aria-label="Search items"
          />
        </label>
        <button type="submit" className="search-submit">
          Search
        </button>
      </div>

      <div className="voice-search-actions">
        <button
          type="button"
          onClick={handleClick}
          className={`voice-action-btn ${isListening ? 'listening' : ''} ${error ? 'error' : ''}`}
          aria-label={isListening ? 'Stop listening' : 'Start voice search'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 7a7 7 0 0 0 7-7h2a9 9 0 0 1-18 0h2a7 7 0 0 0 7 7Zm-1 3h2v2h-2v-2Z" />
          </svg>
          {isListening ? 'Listening' : 'Voice search'}
        </button>
        {success && <div className="voice-success">{success}</div>}
        {transcript && <div className="voice-transcript">Heard: "{transcript}"</div>}
        {error && <div className="voice-error">{error}</div>}
      </div>
    </form>
  );
};

export default VoiceSearch;
