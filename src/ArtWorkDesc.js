import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/ArtWorkDesc.css"; // Import CSS for styling

const ArtWorkDesc = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageSrc = location.state?.image || "/placeholder.png"; // Use the same image
  const [title, setTitle] = useState(""); // Holds the artwork title

  const handleGenerateStory = () => {
    if (!title.trim()) {
      alert("Please enter a title for your artwork.");
      return;
    }

    // Navigate to the loading screen while the story is being generated
    navigate("/LoadingScreen", { state: { image: imageSrc, title } });
  };

  return (
    <div className="artwork-container">
      {/* Home Button (Top Left) */}
      <img
        src="/home.png"
        alt="Home"
        className="home-button"
        onClick={() => navigate("/")} // Navigate back to App.js
      />

      {/* Title Prompt */}
      <h1 className="artwork-title">Give your Artwork a Title!</h1>

      <img src={imageSrc} alt="Selected Artwork" className="artwork-img" />

      {/* Input Line for Artwork Title */}
      <input
        type="text"
        className="title-input"
        placeholder="Type title here..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Continue Button (Right Side) */}
      <img
        src="/check2.png"
        alt="Continue"
        className="side-button check-button"
        onClick={handleGenerateStory} // Trigger API call and loading screen
      />
    </div>
  );
};

export default ArtWorkDesc;
