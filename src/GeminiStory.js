import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "./firebaseConfig"; // ✅ Import Firebase config
import "./styles/GeminiStory.css"; // Import CSS for styling

const GeminiStory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageSrc = location.state?.image || "/placeholder.png"; // Received image
  const title = location.state?.title || "Untitled Artwork"; // Received title
  const story = location.state?.story || "No story available."; // Received story

  // ✅ State to Track Upload Status
  const [uploadStatus, setUploadStatus] = useState("Uploading...");

  // ✅ Text-to-Speech (TTS) State
  const [speechSynth, setSpeechSynth] = useState(null);
  const [utterance, setUtterance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const [fontSize, setFontSize] = useState(16); // Default font size

  // ✅ Function to Generate Proper Firebase Storage URL
  const formatFirebaseURL = (filePath) => {
    return `https://firebasestorage.googleapis.com/v0/b/starlit-eac09.appspot.com/o/${encodeURIComponent(filePath)}?alt=media`;
  };

  // ✅ Wrap `uploadStoryToFirebase` in useCallback to prevent re-creation
  const uploadStoryToFirebase = useCallback(async () => {
    try {
      console.log("📤 Checking image format...");

      let imageUrl = imageSrc; // Default to existing image URL

      // ✅ Convert image to Blob if it's a local file (blob:)
      if (imageSrc.startsWith("blob:")) {
        console.log("🖼️ Image is a Blob. Fetching image file...");
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], `${Date.now()}_artwork.jpg`, { type: "image/jpeg" });

        console.log("✅ Image file created:", file.name);

        // ✅ Upload Image to Firebase Storage
        const storagePath = `artwork/${file.name}`;
        const storageRef = ref(storage, storagePath);
        console.log("📂 Uploading image to Firebase Storage:", storageRef.fullPath);
        await uploadBytes(storageRef, file);
        console.log("✅ Image uploaded successfully!");

        // ✅ Get Download URL
        imageUrl = formatFirebaseURL(storagePath);
        console.log("🔗 Image URL (Fixed):", imageUrl);
      } else {
        console.log("🖼️ Image is NOT a Blob. Using existing URL:", imageSrc);
      }

      // ✅ Save Story Details in Firestore
      console.log("📚 Saving story to Firestore...");
      const docRef = await addDoc(collection(db, "stories"), {
        title,
        story,
        imageUrl,
        timestamp: new Date(),
      });

      console.log("✅ Story uploaded successfully! Document ID:", docRef.id);
      setUploadStatus("Upload Successful! 🎉");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploadStatus("Upload Failed ❌");
    }
  }, [imageSrc, title, story]);

  // ✅ `useEffect` now has `uploadStoryToFirebase` as a dependency
  useEffect(() => {
    console.log("🔥 Starting Firebase upload process...");
    uploadStoryToFirebase();

    // ✅ Initialize Speech Synthesis
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      setSpeechSynth(synth);

      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      const newUtterance = new SpeechSynthesisUtterance(story);
      newUtterance.lang = "en-US";
      newUtterance.rate = rate;
      newUtterance.pitch = pitch;
      newUtterance.onend = () => setIsPlaying(false);

      setUtterance(newUtterance);
    } else {
      alert("Text-to-Speech is not supported in your browser.");
    }
  }, [uploadStoryToFirebase, story, rate, pitch]);

  // ✅ Handle Play TTS
  const handlePlay = () => {
    if (speechSynth && utterance) {
      speechSynth.cancel(); // Stop previous speech
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
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

  // ✅ Handle Resume TTS
  const handleResume = () => {
    if (speechSynth) {
      speechSynth.resume();
      setIsPlaying(true);
    }
  };

  // ✅ Handle Stop TTS
  const handleStop = () => {
    if (speechSynth) {
      speechSynth.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="gemini-story-container">
      {/* Home Button */}
      <img src="/home.png" alt="Home" className="home-button" onClick={() => navigate("/")} />

      {/* Upload Status */}
      <div className="upload-status">{uploadStatus}</div>

      {/* Display Artwork Title */}
      <h1 className="story-title">{title}</h1>

      {/* Display Artwork Image */}
      <img src={imageSrc} alt="Artwork" className="artwork-img" />

      {/* ✅ Font Size Meter (Above Story Box) */}
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
          {/* ✅ Voice Selection with Space */}
          <div className="tts-control-group">
            <label>Voice:</label>
            <select onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}>
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>{voice.name}</option>
              ))}
            </select>
          </div>

          {/* ✅ Speed Control with Space */}
          <div className="tts-control-group">
            <label>Speed:</label>
            <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>

          {/* ✅ Pitch Control with Space */}
          <div className="tts-control-group">
            <label>Pitch:</label>
            <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiStory;
