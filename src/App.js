import React from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import "./App.css";

const App = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="container">
      {/* Parental Control Button in Top-Left */}
      <img
        src="/parental_controls.png"
        alt="Parental Control"
        className="parental-control"
        onClick={() => navigate("/ParentalControl")}
      />

      {/* Centered Logo */}
      <div className="center-content">
        <img src="/logo.png" alt="Logo" className="logo" />

        {/* Play Button Below the Logo */}
        <img
          src="/play_button.png"
          alt="Play Button"
          className="play-button"
          onClick={() => navigate("/MyGallery")}
        />
      </div>
    </div>
  );
};

export default App;
