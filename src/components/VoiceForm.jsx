import React, { useState, useEffect } from 'react';
import useVoice from '../hooks/useVoice';
import './VoiceForm.css';

const VoiceForm = ({ onAddItem, onUpdateItem, editingItem, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState('title');
  const [formError, setFormError] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const { isListening, transcript, error, success, startListening, stopListening, resetTranscript } = useVoice();

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description || '');
      setStep('title');
    }
  }, [editingItem]);

  useEffect(() => {
    if (transcript) {
      handleVoiceInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!formStatus) return undefined;
    const timer = window.setTimeout(() => setFormStatus(''), 3200);
    return () => window.clearTimeout(timer);
  }, [formStatus]);

  const handleVoiceInput = (text) => {
    if (step === 'title') {
      setTitle(text);
      setStep('description');
    } else if (step === 'description') {
      setDescription(text);
      setStep('confirm');
    }
  };

  const handleVoiceSubmit = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }

    setFormError('');
    const itemData = {
      title: title.trim(),
      description: description.trim(),
      completed: editingItem?.completed || false,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
    };

    if (editingItem) {
      onUpdateItem({ ...editingItem, ...itemData });
      setFormStatus('Item updated successfully.');
    } else {
      onAddItem(itemData);
      setFormStatus('Item added successfully.');
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStep('title');
    resetTranscript();
    onCancelEdit?.();
  };

  const getStepPrompt = () => {
    switch (step) {
      case 'title':
        return 'Say the item title.';
      case 'description':
        return 'Say the description, or continue typing.';
      case 'confirm':
        return 'Ready to save the item.';
      default:
        return '';
    }
  };

  return (
    <div className="voice-form-container">
      <h2>{editingItem ? 'Edit item' : 'Add new item'}</h2>

      <form onSubmit={handleSubmit} className="voice-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Item title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item description"
            rows="3"
          />
        </div>

        <div className="voice-control">
          <div className="step-indicator">{getStepPrompt()}</div>
          <button
            type="button"
            onClick={handleVoiceSubmit}
            className={`voice-input-btn ${isListening ? 'listening' : ''} ${error ? 'error' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 7a7 7 0 0 0 7-7h2a9 9 0 0 1-18 0h2a7 7 0 0 0 7 7Zm-1 3h2v2h-2v-2Z" />
            </svg>
            {isListening ? 'Listening…' : 'Voice input'}
          </button>
          {success && <div className="voice-success">{success}</div>}
          {transcript && <div className="voice-transcript">"{transcript}"</div>}
          {error && <div className="voice-error">{error}</div>}
        </div>

        {formError && <div className="form-feedback error">{formError}</div>}
        {formStatus && <div className="form-feedback success">{formStatus}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingItem ? 'Update item' : 'Add item'}
          </button>
          {editingItem && (
            <button type="button" onClick={resetForm} className="btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VoiceForm;
