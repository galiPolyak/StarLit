import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/LoadingScreen.css"; // Import CSS for styling

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { image, title } = location.state || {};

  useEffect(() => {
    const generateStory = async () => {
      const GEMINI_API_KEY = "AIzaSyCADiHvj7uQ0Ekovs_Gg1zQYoZtYUKqDNQ";
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

      if (!image || !title) {
        navigate("/ArtWorkDesc"); // Redirect back if missing data
        return;
      }

      // Retrieve user preferences from local storage
      const readingLevel = localStorage.getItem("readingLevel") || "Grade 1";
      const contentFilters = localStorage.getItem("contentFilters") || "";

      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64Image = reader.result.split(",")[1]; // Extract Base64

          const payload = {
            contents: [
              {
                parts: [
                  { 
                    text: `Create a short story suitable for a ${readingLevel} reading level. 
                           Ensure the story is engaging and avoids the following topics: ${contentFilters}.
                           The story is based on the artwork titled '${title}' Please start by writing the story only.`
                  },
                  { inline_data: { mime_type: "image/png", data: base64Image } },
                ],
              },
            ],
          };

          const apiResponse = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await apiResponse.json();

          // Extract story from API response
          const generatedStory =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            data?.candidates?.[0]?.content?.text ||
            "No story received from Gemini.";

          // Navigate to GeminiStory with the generated story
          navigate("/GeminiStory", { state: { image, title, story: generatedStory } });
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error generating story:", error);
        navigate("/ArtWorkDesc"); // Redirect back if an error occurs
      }
    };

    generateStory();
  }, [image, title, navigate]); // ✅ Ensures dependencies are properly tracked

  return (
    <div className="loading-screen">
      <img src="/load_screen.png" alt="Loading" className="loading-image" />
    </div>
  );
};

export default LoadingScreen;
