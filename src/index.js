import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ParentalControl from "./ParentalControl";
import ArtGallery from "./MyGallery";
import ParentalSettings from "./ParentalSettings"; // Import ParentalSettings
import UploadImage from "./UploadImage";
import ArtWorkDesc from "./ArtWorkDesc";
import GeminiStory from "./GeminiStory";
import LoadingScreen from "./LoadingScreen";
import StoryLibrary from "./StoryLibrary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/ParentalControl" element={<ParentalControl />} />
      <Route path="/MyGallery" element={<ArtGallery />} />
      <Route path="/ParentalSettings" element={<ParentalSettings />} />
      <Route path="/UploadImage" element={<UploadImage />} />
      <Route path="/ArtWorkDesc" element={<ArtWorkDesc />} />
      <Route path="/GeminiStory" element={<GeminiStory />} />
      <Route path="/LoadingScreen" element={<LoadingScreen />} />
      <Route path="/StoryLibrary" element={<StoryLibrary />} />
    </Routes>
  </BrowserRouter>
);
