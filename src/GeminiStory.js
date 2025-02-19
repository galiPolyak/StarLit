import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "./firebaseConfig"; // ✅ Import Firebase config
import "./styles/GeminiStory.css"; // Import CSS for styling

const GeminiStory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageSrc = location.state?.image || "/placeholder.png"; // Received image
  const title = location.state?.title || "Untitled Artwork"; // Received title
  const story = location.state?.story || "No story available."; // Received story

  // ✅ Prevent multiple uploads using useRef
  const hasUploaded = useRef(false);

  // ✅ Text-to-Speech (TTS) State
  const [speechSynth, setSpeechSynth] = useState(null);
  const [utterance, setUtterance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [fontSize, setFontSize] = useState(16); // Default font size

  // ✅ Upload Story to Firebase (Only Once)
  const uploadStoryToFirebase = useCallback(async () => {
    if (hasUploaded.current) return; // Prevent duplicate uploads

    try {
      let imageUrl = imageSrc;

      // ✅ Convert image to Blob if needed
      if (imageSrc.startsWith("blob:")) {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], `${Date.now()}_artwork.jpg`, { type: "image/jpeg" });

        // ✅ Upload Image to Firebase Storage
        const storagePath = `artwork/${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
      }

      // ✅ Save Story to Firestore
      await addDoc(collection(db, "stories"), {
        title,
        story,
        imageUrl,
        timestamp: new Date(),
      });

      hasUploaded.current = true; // ✅ Prevent re-uploads
    } catch (error) {
      console.error("❌ Upload Failed:", error);
    }
  }, [imageSrc, title, story]); // ✅ Dependencies added

  // ✅ useEffect runs only once to upload the story
  useEffect(() => {
    uploadStoryToFirebase(); // ✅ Calls upload only once

    // ✅ Initialize Speech Synthesis
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      setSpeechSynth(synth);
      setVoices(synth.getVoices());

      const newUtterance = new SpeechSynthesisUtterance(story);
      newUtterance.lang = "en-US";
      setUtterance(newUtterance);
    } else {
      alert("Text-to-Speech is not supported in your browser.");
    }
  }, [uploadStoryToFirebase, story]); // ✅ Dependencies added to prevent missing dependency warning

  // ✅ Update utterance when rate, pitch, or voice changes
  useEffect(() => {
    if (utterance) {
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.voice = selectedVoice;
    }
  }, [rate, pitch, selectedVoice, utterance]); // ✅ Added `utterance` to dependencies

  // ✅ Handle Play TTS with latest pitch/speed
  const handlePlay = () => {
    if (speechSynth && utterance) {
      speechSynth.cancel();
      utterance.rate = rate;
      utterance.pitch = pitch;
      if (selectedVoice) utterance.voice = selectedVoice;
      speechSynth.speak(utterance);
      setIsPlaying(true);
    }
  };

  // ✅ Handle Pause TTS
  const handlePause = () => {
    if (speechSynth) {
      speechSynth.pause();
      setIsPlaying(false);
    }
  };

  // ✅ Handle Resume TTS with latest pitch/speed
  const handleResume = () => {
    if (speechSynth) {
      speechSynth.resume();
      setIsPlaying(true);
    }
  };

  return (
    <div className="gemini-story-container">
      {/* Home Button */}
      <img src="/home.png" alt="Home" className="home-button" onClick={() => navigate("/")} />

      {/* Display Artwork Title */}
      <h1 className="story-title">{title}</h1>

      {/* Display Artwork Image */}
      <img src={imageSrc} alt="Artwork" className="artwork-img" />

      {/* ✅ Font Size Meter */}
      <div className="font-size-controls">
        <label>Font Size:</label>
        <input
          type="range"
          min="12"
          max="32"
          step="1"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        />
        <span>{fontSize}px</span>
      </div>

      {/* ✅ Story Box */}
      <div className="story-output" style={{ fontSize: `${fontSize}px` }}>
        <p>{story}</p>

        {/* ✅ Text-to-Speech Controls */}
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

        {/* ✅ Voice & Speed Controls */}
        <div className="tts-settings">
          <div className="tts-control-group">
            <label>Voice:</label>
            <select onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}>
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>{voice.name}</option>
              ))}
            </select>
          </div>

          <div className="tts-control-group">
            <label>Speed:</label>
            <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />
          </div>

          <div className="tts-control-group">
            <label>Pitch:</label>
            <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiStory;
