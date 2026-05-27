import { useState, useCallback, useRef, useEffect } from "react";

const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setSuccess("Microphone enabled and listening...");
      setError("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) =>
            prev ? prev + " " + transcript : transcript,
          );
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      let errorMessage = "";

      switch (event.error) {
        case "not-allowed":
          errorMessage =
            "Microphone permission denied. Please enable microphone access in your browser settings.";
          break;
        case "network":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "no-speech":
          errorMessage = "No speech detected. Please try again.";
          break;
        case "audio-capture":
          errorMessage = "No microphone found. Please check your device.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setError(errorMessage);
      setSuccess("");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setSuccess("");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    setTranscript("");
    setError("");
    setSuccess("");
    setIsListening(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting recognition:", err);
        setError("Could not start listening");
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError("");
    setSuccess("");
  }, []);

  return {
    isListening,
    transcript,
    error,
    success,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useVoice;
