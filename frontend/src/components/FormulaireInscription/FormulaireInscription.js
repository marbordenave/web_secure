import React, { useState } from "react";
import { sendUser } from "../../services/api";
import "./FormulaireInscription.css";

//Function to handle user registration and validation
function FormulaireInscription() {
  const [popup, setPopup] = useState("");

  const [pseudo, setPseudo] = useState("");
  const [pseudoError, setPseudoError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState("");

  const [submitError, setSubmitError] = useState("");

  //Function to reset all components
  function resetAll() {
    setPseudo("");
    setPassword("");
    setMail("");
    setPasswordConfirm("");
    setPasswordSuccess("");
  }

  //Function to handle username changes
  function handleChangePseudo(event) {
    setPseudo(event.target.value);
    checkPseudo(event.target.value);
  }

  //Function to handle password changes
  function handleChangePassword(event) {
    setPassword(event.target.value);
    checkPassword(event.target.value);
  }

  //Function to handle password confirmation changes
  function handleChangePasswordConfirm(event) {
    setPasswordConfirm(event.target.value);
    checkPasswordConfirm(event.target.value);
  }

  //Function to handle email changes
  function handleChangeMail(event) {
    setMail(event.target.value);
    checkMail(event.target.value);
  }

  //Check if username is longer than 5 characters
  const checkPseudo = (value) => {
    if (value.length < 5) {
      setPseudoError("Username must be longer than 5 characters.");
    } else {
      setPseudoError("");
    }
  };

  //Check if password is long enough and contains at least one uppercase letter and one number
  const checkPassword = (value) => {
    let error = "Password must contain:\n";
    setPasswordSuccess("");
    // To check if the string contains at least one uppercase letter, we convert it to lowercase. If the string hasn't changed, it didn't contain any uppercase letters.
    let maj = value.toLowerCase() != value;
    // To check if the string contains at least one lowercase letter, we convert it to uppercase. If the string hasn't changed, it didn't contain any lowercase letters.
    let min = value.toUpperCase() != value;
    // To check if the string contains at least one number, we iterate through the string and try to convert each character to an integer. If parseInt() returns NaN (Not a Number), then it's not a digit.
    let num = false;
    for (let i = 0; i < value.length; i++) {
      if (!isNaN(parseInt(value[i]))) num = true;
    }
    // To check if the string contains at least one special character, we create a string containing all the special characters we want to check. We then iterate through our password and check if each character is in the special characters string.
    let caracters = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let car = false;
    for (let i = 0; i < value.length; i++) {
      if (caracters.includes(value[i])) car = true;
    }

    //If password is less than 9 characters
    if (value.length < 9) {
      error += "-more than 9 characters\n";
    } else {
      setPasswordError("");
    }
    //If password doesn't contain a lowercase letter
    if (!min) {
      error += "-at least one lowercase letter\n";
    } else {
      setPasswordError("");
    }
    //If password doesn't contain an uppercase letter
    if (!maj) {
      error += "-at least one uppercase letter\n";
    } else {
      setPasswordError("");
    }
    //If password doesn't contain at least one number
    if (!num) {
      error += "-at least one number\n";
    } else {
      setPasswordError("");
    }
    //If password doesn't contain at least one special character
    if (!car) {
      error += "-at least one special character\n";
    } else {
      setPasswordError("");
    }
    //If all conditions are met, we update the password
    if (maj == true && min == true && num == true && car == true) {
      setPasswordSuccess("Strong password");
      return setPasswordError("");
    }
    //Otherwise, we return the error
    return setPasswordError(error);
  };

  //Check if the confirmation password matches the original password
  const checkPasswordConfirm = (value) => {
    if (value !== password) {
      setPasswordConfirmError("The entered passwords do not match.");
    } else {
      setPasswordConfirmError("");
    }
  };

  //Check if the email is valid
  const checkMail = (value) => {
    if (value.length < 5 || !value.includes("@")) {
      setMailError("The email address is not valid.");
    } else {
      setMailError("");
    }
  };

  //Register the user
  function handleInscription() {
    //If there are no errors
    if (!mailError && !passwordConfirmError && !passwordError && !pseudoError) {
      setSubmitError(""); // Reset submission error
      // Send user data
      sendUser(mail, password);
      //Show a popup to indicate successful registration
      setPopup(true);
      //Reset sent values
      resetAll();
    }
    //If there are errors, display a message asking to correct them
    else {
      setSubmitError(
        "Please correct the errors before submitting the form."
      );
      if (!pseudo) {
        setPseudoError("Username is required.");
      }
      if (!password) {
        setPasswordError("Password is required.");
      }
      if (!passwordConfirm) {
        setPasswordConfirmError("Password confirmation is required.");
      }
      if (!mail) {
        setMailError("Email address is required.");
      }
    }
  }

  //Close the popup
  const closePopup = () => {
    setPopup(false);
  };

  //Display a form where users can enter their username, password, password confirmation, and email address
  //along with a submit button
  //Also includes a popup that appears when the user is successfully registered
  return (
    <div className="forminscr">
      <div>
        <label htmlFor="pseudo">Username</label>
        <input
          type="text"
          id="pseudo"
          onChange={handleChangePseudo}
          value={pseudo}
        />
        <span className="error">{pseudoError}</span>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id=""
          onChange={handleChangePassword}
          value={password}
        />
        <span className="error">{passwordError}</span>
        <span className="valid">{passwordSuccess}</span>
      </div>
      <div>
        <label htmlFor="re-password">Confirm Password</label>
        <input
          type="password"
          id="re-password"
          onChange={handleChangePasswordConfirm}
          value={passwordConfirm}
        />
        <span className="error">{passwordConfirmError}</span>
      </div>
      <div>
        <label htmlFor="mail">Email</label>
        <input
          type="email"
          id="mail"
          onChange={handleChangeMail}
          value={mail}
        />
        <span className="error">{mailError}</span>
      </div>
      <span className="error">{submitError}</span>
      <button onClick={handleInscription}>Register</button>
      {popup && (
        <div className="popup-bg active">
          <div className="popupDelete">
            <p>You are now registered</p>
            <button className="btn-annuler" onClick={() => closePopup()}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormulaireInscription;
