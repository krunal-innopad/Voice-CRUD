import React, { useState, useRef, useEffect } from 'react';
import { useCommandParser } from '../hooks/useCommandParser';
import './ChatWindow.css';

const ChatWindow = ({ 
  items, 
  onAddItem, 
  onDeleteItem, 
  onSearch, 
  onClearSearch 
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. You can say things like:\n- 'Add a item which name will abc and description xyz'\n- 'Delete item abc'\n- 'Search for xyz'\n- 'Show all items'",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { parseCommand } = useCommandParser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, sender = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleExecuteCommand = (command) => {
    let response = '';

    switch (command.action) {
      case 'add':
        if (!command.title) {
          response = '❌ I need an item name to add. Try: "Add a item which name will pizza and description cheese"';
        } else {
          onAddItem({
            title: command.title,
            description: command.description || '',
            completed: false,
            createdAt: new Date().toISOString(),
          });
          response = `✅ Item "${command.title}" added successfully!${
            command.description ? ` (Description: ${command.description})` : ''
          }`;
        }
        break;

      case 'delete':
        if (!command.title) {
          response = '❌ I need an item name to delete. Try: "Delete item pizza"';
        } else {
          const itemToDelete = items.find(
            (item) => item.title.toLowerCase() === command.title.toLowerCase()
          );
          if (itemToDelete) {
            onDeleteItem(itemToDelete.id);
            response = `✅ Item "${command.title}" deleted successfully!`;
          } else {
            response = `❌ Item "${command.title}" not found. Available items: ${
              items.length > 0
                ? items.map((i) => i.title).join(', ')
                : 'No items yet'
            }`;
          }
        }
        break;

      case 'search':
        if (!command.query) {
          response = '❌ Please provide a search term. Try: "Search pizza"';
        } else {
          onSearch(command.query);
          response = `🔍 Searching for "${command.query}"...`;
        }
        break;

      case 'list':
        onClearSearch();
        if (items.length === 0) {
          response = '📭 No items found. Add some items to get started!';
        } else {
          response = `📋 Found ${items.length} item(s):\n${items
            .map((item) => `• ${item.title}${item.description ? ` (${item.description})` : ''}`)
            .join('\n')}`;
        }
        break;

      case 'unknown':
        response = `🤔 I didn't understand that. Try:\n- "Add a item which name will [name] and description [desc]"\n- "Delete item [name]"\n- "Search [query]"\n- "Show all items"`;
        break;

      default:
        response = 'Something went wrong. Please try again.';
    }

    return response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');
    setInputValue('');
    setIsLoading(true);

    // Simulate slight delay for better UX
    setTimeout(() => {
      const command = parseCommand(inputValue);
      const response = handleExecuteCommand(command);
      addMessage(response, 'bot');
      setIsLoading(false);
    }, 500);
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addMessage('❌ Speech recognition not supported on this browser.', 'bot');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setIsLoading(true);
      addMessage('🎤 Listening...', 'bot');
    };

    recognition.onend = () => {
      setIsLoading(false);
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript.trim()) {
        addMessage(transcript, 'user');
        const command = parseCommand(transcript);
        const response = handleExecuteCommand(command);
        addMessage(response, 'bot');
      }
    };

    recognition.onerror = (event) => {
      addMessage(`❌ Speech recognition error: ${event.error}`, 'bot');
    };

    recognition.start();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>AI Assistant Chat</h3>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message message-${message.sender}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-bot">
            <div className="message-content loading">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a command or use voice..."
          className="chat-input"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          className="voice-btn"
          disabled={isLoading}
          title="Use voice input"
        >
          🎤
        </button>
        <button
          type="submit"
          className="send-btn"
          disabled={isLoading || !inputValue.trim()}
          title="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
