import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ParentalControl.css"; // Import CSS for styling

const ParentalControl = () => {
  const navigate = useNavigate();
  const [enteredPassword, setEnteredPassword] = useState(""); // Holds entered numbers
  const [passwordSet, setPasswordSet] = useState(false); // Track if a password exists
  const [settingPassword, setSettingPassword] = useState(false); // True when user is setting a password
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Confirm new password
  const [errorMessage, setErrorMessage] = useState(""); // Error message display
  const [passwordSuccess, setPasswordSuccess] = useState(false); // Show password set confirmation

  useEffect(() => {
    const storedPassword = localStorage.getItem("parentalPassword");
    if (storedPassword) {
      setPasswordSet(true);
    } else {
      setSettingPassword(true);
    }
  }, []);

  const handleNumberClick = (num) => {
    if (enteredPassword.length < 4) {
      setEnteredPassword((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setEnteredPassword((prev) => prev.slice(0, -1));
  };

  const handleCheck = () => {
    const storedPassword = localStorage.getItem("parentalPassword");

    if (settingPassword) {
      if (enteredPassword.length !== 4) {
        setErrorMessage("Password must be exactly 4 digits.");
        return;
      }

      if (passwordConfirmation === "") {
        setPasswordConfirmation(enteredPassword);
        setEnteredPassword("");
        setErrorMessage("Re-enter the password to confirm.");
      } else if (enteredPassword === passwordConfirmation) {
        localStorage.setItem("parentalPassword", enteredPassword);
        setPasswordSet(true);
        setSettingPassword(false);
        setPasswordConfirmation("");
        setEnteredPassword("");
        setErrorMessage("");
        setPasswordSuccess(true);
        setTimeout(() => setPasswordSuccess(false), 2000);
      } else {
        setErrorMessage("Passwords do not match. Try again.");
        setEnteredPassword("");
        setPasswordConfirmation("");
      }
    } else {
      if (enteredPassword === storedPassword) {
        navigate("/ParentalSettings");
      } else {
        setErrorMessage("Incorrect password. Try again.");
        setEnteredPassword("");
      }
    }
  };

  const handleResetPassword = () => {
    localStorage.removeItem("parentalPassword");
    setPasswordSet(false);
    setSettingPassword(true);
    setEnteredPassword("");
    setPasswordConfirmation("");
    setErrorMessage("");
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 2000);
  };

  return (
    <div className="parental-control-container">
      <img
        src="/back_arrow.png"
        alt="Back"
        className="back-arrow"
        onClick={() => navigate(-1)}
      />

      <div className="caregiver-section">
        <img src="/caregivers.png" alt="Caregivers" className="caregivers-img" />
        <div className="text-section">
          <div className="caregivers-text">Caregivers</div>
          <div className="dob-text">
            {settingPassword ? "Set a 4-digit password" : "Enter your password"}
          </div>
          <img src="/four_stars.png" alt="Four Stars" className="stars-img" />
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="keypad">
        <div className="keypad-grid">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <img
              key={num}
              src={`/${num}.png`}
              alt={num}
              className="keypad-button"
              onClick={() => handleNumberClick(num)}
            />
          ))}
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

        {/* Entered Password Display */}
        <div className="entered-number">{enteredPassword || " "}</div>

        {/* ✅ Success & Error Messages BELOW the Grid ✅ */}
        <div className="message-container">
          {passwordSuccess && <div className="success-message">Password successfully set!</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>

        {passwordSet && (
          <button className="reset-password-btn" onClick={handleResetPassword}>
            Reset Password
          </button>
        )}
      </div>
    </div>
  );
};

export default ParentalControl;
