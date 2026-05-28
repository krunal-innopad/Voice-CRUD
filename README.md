# Voice CRUD Dashboard — Technical README

A technical reference for the Voice CRUD Dashboard, a React + Vite application demonstrating voice-enabled CRUD workflows with a SaaS-style interface.

## Overview

This application provides:

- A voice-enabled quick add flow for creating new items
- Standard and voice search support for item lookup
- A chat-style AI assistant for natural language CRUD commands
- Persistent client-side storage via `localStorage`
- Responsive, modern dashboard UI powered by React components

## Architecture

### Stack

- React for UI composition
- Vite for development and production bundling
- Native Web Speech API for voice recognition
- `localStorage` for persistence

### Design

- Component-driven layout with isolated UI responsibilities
- Hooks for reusable app logic and browser integration
- Minimal dependencies for performance and simplicity

## Key Files and Responsibilities

### `src/App.jsx`

- Manages top-level state: items, search query, list filtering
- Provides CRUD callbacks to child components
- Handles item updates from both form and assistant interfaces

### `src/components/ChatWindow.jsx`

- Renders the AI assistant viewport
- Maintains a fixed-height, scrollable chat history
- Accepts typed commands and voice-assisted text input
- Dispatches parsed commands to app state handlers

### `src/components/VoiceForm.jsx`

- Implements quick add functionality for title/description entry
- Integrates voice input for hands-free item creation

### `src/components/VoiceSearch.jsx`

- Adds voice-driven search capabilities
- Submits spoken search terms to the app filter

### `src/hooks/useCommandParser.js`

- Parses natural-language input into structured actions
- Supports command types:
  - `add`
  - `update` (title, description, or both)
  - `delete`
  - `search`
  - `list`
- Uses regular expressions and simple intent extraction

### `src/hooks/useLocalStorage.js`

- Syncs React state with browser `localStorage`
- Provides persistence across page reloads

## Voice Command Implementation

### Native browser API

The application uses the built-in Web Speech API via:

- `SpeechRecognition`
- `webkitSpeechRecognition`

This means:

- No external speech SDK is required
- Recognition is browser-native
- Support is best in Chromium-based browsers

### Command processing flow

1. User speaks into a mic-enabled control.
2. Speech is transcribed by the browser.
3. The transcript is parsed by `useCommandParser`.
4. The app executes matching CRUD actions.
5. Chat responses are shown in the assistant panel.

## Development

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

- Open the local Vite URL shown in the terminal.
- Voice commands are available in development mode.
- Live reload is enabled for fast iteration.

### Build for production

```bash
npm run build
```

## Usage Patterns

### Voice assistant examples

- `Add item pizza with description cheese`
- `Search for pizza`
- `Update item pizza to tacos`
- `Update item pizza to tacos and description extra cheese`
- `Delete item pizza`
- `Show all items`

### Interaction channels

- Quick add form for manual entry
- Voice quick add for spoken item creation
- Voice search for spoken queries
- AI assistant panel for natural language commands

## Browser support

- Best experience on Chrome, Edge, Opera, or another Chromium-based browser
- `SpeechRecognition` is required for voice capture
- Typed commands remain functional if voice is unavailable

## Notes

- Data is stored locally and is not synced to a backend.
- The project is intended as a lightweight demo of voice-enabled CRUD UX.
