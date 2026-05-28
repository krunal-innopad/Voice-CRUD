import React, { useState, useRef, useEffect } from "react";
import { useCommandParser } from "../hooks/useCommandParser";
import "./ChatWindow.css";

const ChatWindow = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onSearch,
  onClearSearch,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the voice assistant. You can send commands like:\n- Add an item with title and description\n- Delete an item by title\n- Search for an item\n- Show all items",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { parseCommand } = useCommandParser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, sender = "user") => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleExecuteCommand = (command) => {
    let response = "";

    switch (command.action) {
      case "add":
        if (!command.title) {
          response =
            "Please provide an item title to add. Example: Add an item with title pizza and description cheese.";
        } else {
          onAddItem({
            title: command.title,
            description: command.description || "",
            completed: false,
            createdAt: new Date().toISOString(),
          });
          response = `Item "${command.title}" was added successfully.`;
        }
        break;

      case "update":
        if (!command.oldTitle) {
          response = "❌ Please specify the item to update.";
          break;
        }

        const itemToUpdate = items.find(
          (item) => item.title.toLowerCase() === command.oldTitle.toLowerCase(),
        );

        if (!itemToUpdate) {
          response = `❌ Item "${command.oldTitle}" not found.`;
          break;
        }

        const updatedItem = {
          ...itemToUpdate,
        };

        if (command.updateType === "title") {
          updatedItem.title = command.value;
          response = `✅ Item title updated from "${command.oldTitle}" to "${command.value}".`;
        } else if (command.updateType === "description") {
          updatedItem.description = command.value;
          response = `✅ Description updated for "${command.oldTitle}".`;
        } else if (command.updateType === "both") {
          updatedItem.title = command.title;
          updatedItem.description = command.description;
          response = `✅ Item "${command.oldTitle}" updated with new title "${command.title}" and updated description.`;
        } else {
          response =
            "❌ Update command not recognized. Try updating title, description, or both.";
          break;
        }

        onUpdateItem(updatedItem);
        break;
      case "delete":
        if (!command.title) {
          response =
            "Please provide an item title to delete. Example: Delete item pizza.";
        } else {
          const itemToDelete = items.find(
            (item) => item.title.toLowerCase() === command.title.toLowerCase(),
          );
          if (itemToDelete) {
            onDeleteItem(itemToDelete.id);
            response = `Item "${command.title}" was deleted successfully.`;
          } else {
            response = `Item "${command.title}" was not found. Available items: ${
              items.length > 0
                ? items.map((i) => i.title).join(", ")
                : "No items yet."
            }`;
          }
        }
        break;

      case "search":
        if (!command.query) {
          response = "Please provide a search term. Example: Search pizza.";
        } else {
          onSearch(command.query);
          response = `Searching for "${command.query}"...`;
        }
        break;

      case "list":
        onClearSearch();
        if (items.length === 0) {
          response = "No items found. Add an item to get started.";
        } else {
          response = `Found ${items.length} item(s):\n${items
            .map(
              (item) =>
                `${item.title}${item.description ? ` — ${item.description}` : ""}`,
            )
            .join("\n")}`;
        }
        break;

      case "unknown":
        response =
          "I did not understand that command. Try examples like: Add an item, Delete item, Search, or Show all items.";
        break;

      default:
        response = "Something went wrong. Please try again.";
    }

    return response;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    addMessage(inputValue, "user");
    setInputValue("");
    setIsLoading(true);

    window.setTimeout(() => {
      const command = parseCommand(inputValue);
      const response = handleExecuteCommand(command);
      addMessage(response, "bot");
      setIsLoading(false);
    }, 500);
  };

  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      addMessage("Speech recognition is not supported by this browser.", "bot");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
      setIsLoading(true);
      addMessage("Listening for your command…", "bot");
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsLoading(false);
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript.trim()) {
        addMessage(transcript, "user");
        const command = parseCommand(transcript);
        const response = handleExecuteCommand(command);
        addMessage(response, "bot");
      }
    };

    recognition.onerror = (event) => {
      addMessage(`Speech recognition error: ${event.error}`, "bot");
      setIsListening(false);
      setIsLoading(false);
    };

    recognition.start();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div>
          <h3>AI assistant</h3>
          <p>Run natural language and voice commands.</p>
        </div>
        <span className="chat-status">
          {isListening ? "Listening" : isLoading ? "Processing" : "Ready"}
        </span>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.sender}`}>
            <div className="message-content">{message.text}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message message-bot">
            <div className="message-content loading">
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
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
          aria-label="Chat command input"
        />

        <button
          type="button"
          onClick={handleVoiceInput}
          className="chat-button voice-button"
          disabled={isLoading}
          title="Use voice input"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 7a7 7 0 0 0 7-7h2a9 9 0 0 1-18 0h2a7 7 0 0 0 7 7Zm-1 3h2v2h-2v-2Z" />
          </svg>
        </button>

        <button
          type="submit"
          className="chat-button send-button"
          disabled={isLoading || !inputValue.trim()}
          title="Send command"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.4 20.4L22 12 3.4 3.6v6.5l11.9 1.9-11.9 1.9v6.5Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
