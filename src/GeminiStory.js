import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/GeminiStory.css"; // Import CSS for styling

const GeminiStory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageSrc = location.state?.image || "/placeholder.png"; // Received image
  const title = location.state?.title || "Untitled Artwork"; // Received title
  const story = location.state?.story || "No story available."; // Receive the generated story

  // State for Text-to-Speech
  const [speech, setSpeech] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // State for Text Size and Color
  const [textSize, setTextSize] = useState(16); // Default font size
  const [textColor, setTextColor] = useState("#000000"); // Default black color

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Reset playing state when speech ends
      utterance.onend = () => {
        setIsPlaying(false);
      };

      setSpeech({ synth, utterance });
    } else {
      alert("Text-to-Speech is not supported in your browser.");
    }
  }, [story]);

  const handlePlay = () => {
    if (speech && speech.synth) {
      speech.synth.cancel(); // Stop previous speech
      speech.synth.speak(speech.utterance);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (speech && speech.synth) {
      speech.synth.pause();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (speech && speech.synth) {
      speech.synth.resume();
      setIsPlaying(true);
    }
  };

  return (
    <div className="gemini-story-container">
      {/* Home Button (Top Left) */}
      <img
        src="/home.png"
        alt="Home"
        className="home-button"
        onClick={() => navigate("/")} // Navigate back to App.js
      />

      {/* Display Artwork Title */}
      <h1 className="story-title">{title}</h1>

      {/* Display Artwork Image */}
      <img src={imageSrc} alt="Artwork" className="artwork-img" />

      {/* Text Size & Color Controls */}
      <div className="text-controls">
        <div className="text-size-control">
          <label>SIZE:</label>
          <input
            type="range"
            min="12"
            max="32"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
          />
        </div>

        <div className="text-color-control">
          <label>COLOUR:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>
      </div>

      {/* Display Generated Story */}
      <div className="story-output" style={{ fontSize: `${textSize}px`, color: textColor }}>
        <p>{story}</p>

        {/* Text-to-Speech Controls */}
        <div className="tts-controls">
          <button className="tts-button play" onClick={handlePlay} disabled={isPlaying}>
            ▶ Play
          </button>
          <button className="tts-button pause" onClick={handlePause} disabled={!isPlaying}>
            ⏸ Pause
          </button>
          <button className="tts-button resume" onClick={handleResume} disabled={isPlaying}>
            🔄 Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiStory;
