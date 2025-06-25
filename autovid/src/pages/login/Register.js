import React, { useState } from "react";
import LightVideo from "../pages videos/Light Game.mp4";
import email_icon from "../login/login icons/email.png";
import password_icon from "../login/login icons/password.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login&Register.css";

const Register = () => {
  const navigate = useNavigate();
  const handleClickGoToLogIn = () => navigate("/login");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setRegisterConfirmPassword] = useState("");
  const [oneClickOnSubmit, setOneClickOnSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegisterName = (e) => {
    setRegisterEmail(e.target.value);
  };
  const handleRegisterPassword = (e) => {
    setRegisterPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setRegisterConfirmPassword(e.target.value);
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (!emailRegex.test(registerEmail)) {
      setEmailError("❌ Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const passwordErrors = [];

    if (registerPassword !== confirmPassword) {
      passwordErrors.push("❌ Passwords do not match.");
      valid = false;
    }

    if (!passwordRegex.test(registerPassword)) {
      passwordErrors.push(
        "❌ Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      valid = false;
    }

    setPasswordError(passwordErrors.join(" "));

    if (!valid) return;

    setOneClickOnSubmit(true);

    fetch("http://localhost:5000/auth/register", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Successfully registered!", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "custom-toast-success",
          });

          setTimeout(() => {
            handleClickGoToLogIn();
          }, 3000);
        } else if (response.status === 409) {
          return response.json().then((data) => {
            throw new Error(data.message || "Email already exists");
          });
        } else if (response.status === 404) {
          throw new Error("Resource not found");
        } else if (response.status === 500) {
          throw new Error("Internal server error");
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      })
      .catch((error) => {
        setOneClickOnSubmit(false);
        console.error("Fetch error:", error.message);
        setEmailError("");
        setPasswordError(error.message);
      });
  };

  return (
    <div className="page">
      <video autoPlay loop muted className="page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="login-register-page-content">
        <div className="container">
          <div className="register-header">
            <div className="text">Register</div>
            <div className="underline"></div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleClick();
            }}
          >
            <div className="inputs">
              <div className="input">
                <img src={email_icon} alt="" />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleRegisterName}
                  value={registerEmail}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleRegisterPassword}
                  value={registerPassword}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  onChange={handleConfirmPassword}
                  value={confirmPassword}
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "black",
                  cursor: "pointer",
                  fontSize: "1.2vw",
                }}
              >
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleToggleShowPassword}
                  style={{
                    marginRight: "0.5rem",
                    width: "1.2vw",
                    height: "1.2vw",
                    marginBottom: "0.5vw",
                  }}
                />
                Show Password
              </label>
            </div>
            <div style={{ textAlign: "center" }}>
              {emailError && (
                <div
                  style={{
                    color: "red",
                    fontSize: "1.2vw",
                    marginBottom: "0.75vw",
                  }}
                >
                  {emailError}
                </div>
              )}
              {passwordError && (
                <div
                  style={{
                    color: "red",
                    fontSize: "1.2vw",
                    marginBottom: "0.75vw",
                  }}
                >
                  {passwordError}
                </div>
              )}
            </div>
            <div className="submit-container">
              <button
                type="submit"
                className="submit-register-button"
                disabled={oneClickOnSubmit}
              >
                Register
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
