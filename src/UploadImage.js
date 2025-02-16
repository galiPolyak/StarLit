import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/UploadImage.css"; // Import CSS for styling

const UploadImage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageSrc = location.state?.image || "/placeholder.png"; // Default image

  return (
    <div className="image-container">
      {/* Exit Button (Left Side) */}
      <img
        src="/exit2.png"
        alt="Exit"
        className="side-button exit-button"
        onClick={() => navigate(-1)}
      />

      {/* Two-Layered Yellow Borders Around Image */}
      <div className="image-border-outer">
        <div className="image-border-inner">
          <img src={imageSrc} alt="Selected Art" className="large-rectangle-img" />
        </div>
      </div>

      {/* Continue Button (Right Side) */}
      <img
        src="/check2.png"
        alt="Continue"
        className="side-button check-button"
        onClick={() => navigate("/ArtWorkDesc", { state: { image: imageSrc } })}
      />

      {/* Star Image at Bottom Right */}
      <img src="/star1.png" alt="Star" className="star-icon" />
    </div>
  );
};

export default UploadImage;
