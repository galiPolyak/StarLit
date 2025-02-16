import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ParentalControl.css"; // Import CSS for styling

const ParentalControl = () => {
  const navigate = useNavigate();
  const [enteredNumber, setEnteredNumber] = useState(""); // Holds entered numbers
  const [notOldEnough, setNotOldEnough] = useState(false); // Controls "Not Old Enough" message

  // Function to handle number click
  const handleNumberClick = (num) => {
    if (enteredNumber.length < 4) {
      setEnteredNumber((prev) => prev + (num === "zero" ? "0" : num)); // Write "0" for zero.png
    }
  };

  // Function to handle backspace
  const handleBackspace = () => {
    setEnteredNumber((prev) => prev.slice(0, -1)); // Remove last character
  };

  // Function to handle check (Age Verification)
  const handleCheck = () => {
    const birthYear = parseInt(enteredNumber, 10);

    if (birthYear > 2006) {
      setNotOldEnough(true); // Show "Not Old Enough" message
    } else if (birthYear <= 2006 && enteredNumber.length === 4) {
      navigate("/ParentalSettings"); // Navigate to ParentalSettings page
    }
  };

  return (
    <div className="parental-control-container">
      {/* Back Arrow (Top-Left) */}
      <img
        src="/back_arrow.png"
        alt="Back"
        className="back-arrow"
        onClick={() => navigate(-1)}
      />

      {/* Display "Not Old Enough" Message */}
      {notOldEnough ? (
        <div className="not-old-enough">
          <button className="not-old-enough-btn">Not Old Enough</button>
          <button className="back-btn" onClick={() => navigate("/")}>
            Back
          </button>
        </div>
      ) : (
        <>
          {/* Center-Left Caregivers Section */}
          <div className="caregiver-section">
            <img src="/caregivers.png" alt="Caregivers" className="caregivers-img" />
            <div className="text-section">
              <div className="caregivers-text">Caregivers</div>
              <div className="dob-text">Please enter your date of birth</div>
              <img src="/four_stars.png" alt="Four Stars" className="stars-img" />
            </div>
          </div>

          {/* Center-Right Keypad */}
          <div className="keypad">
            <div className="keypad-grid">
              {/* Number Buttons */}
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <img
                  key={num}
                  src={`/${num}.png`}
                  alt={num}
                  className="keypad-button"
                  onClick={() => handleNumberClick(num)}
                />
              ))}

              {/* Zero, Backspace, and Check in Last Row */}
              <img
                src="/zero.png"
                alt="Zero"
                className="keypad-button"
                onClick={() => handleNumberClick("0")}
              />
              <img
                src="/backspace.png"
                alt="Backspace"
                className="keypad-button"
                onClick={handleBackspace}
              />
              <img
                src="/check.png"
                alt="Check"
                className="keypad-button"
                onClick={handleCheck}
              />
            </div>

            {/* Entered Number Display */}
            <div className="entered-number">{enteredNumber || " "}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentalControl;
