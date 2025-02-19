import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // ✅ Import Firebase Firestore config
import "./styles/StoryLibrary.css"; // Import CSS for styling

const StoryLibrary = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Stories from Firestore
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stories"));
        const fetchedStories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStories(fetchedStories);
      } catch (err) {
        setError("Failed to fetch stories. Please try again.");
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // ✅ Function to delete a story
  const handleDeleteStory = async (storyId) => {
    try {
      await deleteDoc(doc(db, "stories", storyId));
      setStories(stories.filter((story) => story.id !== storyId)); // Remove from UI
    } catch (err) {
      console.error("Error deleting story:", err);
      setError("Failed to delete story. Please try again.");
    }
  };

  return (
    <div className="our-library-container">
      {/* Home Button */}
      <img src="/home.png" alt="Home" className="home-button" onClick={() => navigate("/")} />

      {/* Library Title */}
      <img src="/our_library.png" alt="Our Library" className="our-library-img" />

      {/* Loading & Error Handling */}
      {loading && <p className="loading-text">Loading stories...</p>}
      {error && <p className="error-text">{error}</p>}

      {/* Display Stories */}
      <div className="story-list">
        {stories.length > 0 ? (
          stories.map((story) => (
            <div key={story.id} className="story-card">
              {/* Delete Button with Trash Icon (Top Right) */}
              <img
                src="/trash.png"
                alt="Delete"
                className="delete-icon"
                onClick={() => handleDeleteStory(story.id)}
              />

              <h3 className="story-title">{story.title}</h3>
              <img src={story.imageUrl} alt={story.title} className="story-image" />
              <p className="story-text">{story.story}</p>
            </div>
          ))
        ) : (
          !loading && <p className="no-stories-text">No stories available.</p>
        )}
      </div>
    </div>
  );
};

export default StoryLibrary;
