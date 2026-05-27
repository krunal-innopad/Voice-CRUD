import React, { useState, useEffect } from 'react';
import useVoice from '../hooks/useVoice';
import './VoiceForm.css';

const VoiceForm = ({ onAddItem, onUpdateItem, editingItem, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState('title');
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
      alert('Title is required');
      return;
    }

    const itemData = {
      title: title.trim(),
      description: description.trim(),
      completed: editingItem?.completed || false,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
    };

    if (editingItem) {
      onUpdateItem({ ...editingItem, ...itemData });
    } else {
      onAddItem(itemData);
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
        return 'Say the item title';
      case 'description':
        return 'Say the description (or skip)';
      case 'confirm':
        return 'Ready to save?';
      default:
        return '';
    }
  };

  return (
    <div className="voice-form-container">
      <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
      
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
            {isListening ? 'Listening...' : 'Voice Input'}
          </button>
          {success && <div className="voice-success">{success}</div>}
          {transcript && <div className="voice-transcript">"{transcript}"</div>}
          {error && <div className="voice-error">{error}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingItem ? 'Update Item' : 'Add Item'}
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
