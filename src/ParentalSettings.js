import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ParentalSettings.css"; // Import CSS for styling

const ParentSettings = () => {
  const navigate = useNavigate();

  // Load stored settings or set defaults
  const [readingLevel, setReadingLevel] = useState(
    localStorage.getItem("readingLevel") || "Grade 1"
  );
  const [appTimeLimit, setAppTimeLimit] = useState(
    parseInt(localStorage.getItem("appTimeLimit")) || 20
  );
  const [communitySharing, setCommunitySharing] = useState(
    localStorage.getItem("communitySharing") === "true"
  );
  const [contentFilters, setContentFilters] = useState(
    localStorage.getItem("contentFilters") || ""
  );

  // Log retrieved settings when component mounts
  useEffect(() => {
    console.log("🔍 Loaded settings from localStorage:");
    console.log("📖 Reading Level:", readingLevel);
    console.log("⏳ App Time Limit:", appTimeLimit);
    console.log("🌍 Community Sharing:", communitySharing);
    console.log("🚫 Content Filters:", contentFilters);
  }, []); // Runs only once when component mounts

  // Update localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("readingLevel", readingLevel);
    localStorage.setItem("appTimeLimit", appTimeLimit);
    localStorage.setItem("communitySharing", communitySharing);
    localStorage.setItem("contentFilters", contentFilters);

    console.log("✅ Updated localStorage:");
    console.log("📖 New Reading Level:", readingLevel);
    console.log("⏳ New App Time Limit:", appTimeLimit);
    console.log("🌍 New Community Sharing:", communitySharing);
    console.log("🚫 New Content Filters:", contentFilters);
  }, [readingLevel, appTimeLimit, communitySharing, contentFilters]);

  return (
    <div className="parent-settings-container">
      {/* Exit Button (Top-Left) */}
      <img
        src="/exit.png"
        alt="Exit"
        className="exit-button"
        onClick={() => navigate("/")} // Navigate back to App.js
      />

      {/* Header Section */}
      <div className="header">
        <img src="/caregivers.png" alt="Caregivers" className="caregivers-img" />
        <h1 className="title">Parent Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* Reading Level */}
        <div className="setting">
          <label className="setting-label">Reading Level</label>
          <select
            className="dropdown"
            value={readingLevel}
            onChange={(e) => setReadingLevel(e.target.value)}
          >
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
          </select>
        </div>

        {/* App Time Limit */}
        <div className="setting">
          <label className="setting-label">App Time Limit</label>
          <div className="time-limit">
            <input
              type="number"
              className="time-input"
              value={appTimeLimit}
              onChange={(e) => setAppTimeLimit(e.target.value)}
              min="5"
              max="120"
            />
            <span className="time-unit">minutes</span>
          </div>
        </div>

        {/* Community Sharing Toggle */}
        <div className="setting">
          <label className="setting-label">Community Sharing</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="communitySharing"
              checked={communitySharing}
              onChange={() => setCommunitySharing(!communitySharing)}
            />
            <label htmlFor="communitySharing" className="switch"></label>
          </div>
          <p className="info-text">
            Your personal details remain private. Only images, drawings, and generated stories will be shared.
          </p>
        </div>

        {/* Content Filters */}
        <div className="setting">
          <label className="setting-label">Content Filters</label>
          <p className="info-text">
            Stories can be personalized to exclude specific topics. Please list them below, separated by commas.
          </p>
          <input
            type="text"
            className="content-filter-input"
            placeholder="For example: snakes, clowns, spiders, thunderstorms"
            value={contentFilters}
            onChange={(e) => setContentFilters(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ParentSettings;
