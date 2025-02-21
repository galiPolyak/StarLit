import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/MyGallery.css"; // Import CSS for styling

// Default images for preloading
const defaultImages = [
  "/defaultImages/image1.jpeg",
  "/defaultImages/image2.jpeg",
  "/defaultImages/image3.jpeg",
  "/defaultImages/image4.jpeg",
  "/defaultImages/image5.jpeg",
  "/defaultImages/image6.jpeg",
  "/defaultImages/image7.png",
  "fbaseImages/fbase1.jpg",
  "fbaseImages/fbase2.jpg",
  "fbaseImages/fbase4.jpg",
];

const MyGallery = () => {
  const navigate = useNavigate();

  const [selectedImages, setSelectedImages] = useState([]); // Holds selected images

  // Preload images when component mounts
  useEffect(() => {
    setSelectedImages(defaultImages);
  }, []);

  // Function to handle manual file selection (Hidden input)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]); // Append new images
  };

  // Function to request access to Photos folder
  const handleFolderAccess = async () => {
    try {
      if ("showDirectoryPicker" in window) {
        const directoryHandle = await window.showDirectoryPicker();
        const images = [];

        // Loop through files in the directory
        for await (const [name, handle] of directoryHandle.entries()) {
          if (handle.kind === "file" && /\.(jpe?g|png|gif|heic)$/i.test(name)) {
            const file = await handle.getFile();
            const url = URL.createObjectURL(file);
            images.push(url);
          }
        }

        // Update state with images
        setSelectedImages((prevImages) => [...prevImages, ...images]);
      } else {
        alert("Your browser does not support direct access to folders.");
      }
    } catch (error) {
      console.error("Error accessing Photos:", error);
    }
  };

  // Function to navigate to UploadImage.js with selected image
  const viewFullScreenImage = (imageSrc) => {
    navigate("/UploadImage", { state: { image: imageSrc } });
  };

  return (
    <div className="my-gallery-container">
      {/* Home Button (Top Left) */}
      <img
        src="/home.png"
        alt="Home"
        className="home-button"
        onClick={() => navigate("/")} // Navigate back to App.js
      />

      {/* My Gallery Image at the Top */}
      <img src="/my_gallery.png" alt="My Gallery" className="my-gallery-img" />

      {/* Upload Files Image (Replaces Access Button) */}
      <img
        src="/uploadFiles.png"
        alt="Upload Files"
        className="upload-files-icon"
        onClick={handleFolderAccess} // Calls the same function as before
      />

      {/* Image Carousel */}
      <div className="carousel-container">
        {selectedImages.length > 0 ? (
          <div className="carousel">
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`User Upload ${index}`}
                className="carousel-img"
                onClick={() => viewFullScreenImage(image)} // Navigate on click
              />
            ))}
          </div>
        ) : (
          <p className="no-images-text">No images loaded. Please add images from your device.</p>
        )}
      </div>

      {/* Hidden File Input for Image Selection */}
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden-file-input"
        onChange={handleImageUpload}
      />

      {/* Upload Image Button (Now Clickable and Navigates to Library.js) */}
      <button className="upload-button" onClick={() => navigate("/StoryLibrary")}>
        <img src="/upload.png" alt="Upload" className="upload-img" />
      </button>
    </div>
  );
};

export default MyGallery;
