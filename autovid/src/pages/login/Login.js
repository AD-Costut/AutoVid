import React, { useState } from "react";
import LightVideo from "../pages videos/Light Game.mp4";
import google_icon from "./login icons/google-icon.png";
import email_icon from "./login icons/email.png";
import password_icon from "./login icons/password.png";
import { useNavigate } from "react-router-dom";
import "../CommonlyUsedStyles/TransparentBox.css";
import "../CommonlyUsedStyles/PageStyle.css";
import "./Login&Register.css";
import { useGoogleLogin } from "@react-oauth/google";

const clientId =
  "117534362421-k51kiuvpnuljpeurcj0jk13uvm28j6gm.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();

  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [oneClickOnSubmit, setOneClickOnSubmit] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  const redirectToChatPage = () => {
    navigate("/promt-to-video");
  };

  const handleLogInEmail = (e) => {
    setLogInEmail(e.target.value);
  };

  const handleLogInPassword = (e) => {
    setLogInPassword(e.target.value);
  };

  const login = useGoogleLogin({
    clientId,
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const userData = await userInfoResponse.json();

        const backendResponse = await fetch(
          "http://localhost:5000/auth/google-login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userData.email,
              name: userData.name,
            }),
          }
        );

        const result = await backendResponse.json();

        if (backendResponse.ok) {
          localStorage.setItem("accessToken", tokenResponse.access_token);
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/promt-to-video");
        } else {
          console.error("Backend login failed:", result.error);
          alert("Backend login failed: " + result.error);
        }
      } catch (error) {
        console.error("Failed to fetch user data or login backend:", error);
      }
    },

    onError: (error) => {
      console.error("Google Login Error:", error);
    },
  });

  const handleLogInSubmit = () => {
    setEmailError("");
    setPasswordError("");

    let emailMissing = !logInEmail;
    let passwordMissing = !logInPassword;

    if (emailMissing && passwordMissing) {
      setPasswordError("❌ Please enter your email and password.");
      return;
    }

    if (emailMissing) {
      setPasswordError("❌ Please enter your email.");
      return;
    }

    if (passwordMissing) {
      setPasswordError("❌ Please enter your password.");
      return;
    }

    setOneClickOnSubmit(true);

    fetch("http://localhost:5000/auth/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: logInEmail,
        password: logInPassword,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 404) {
          throw new Error("Resource not found");
        } else if (response.status === 500) {
          throw new Error("Internal server error");
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      })
      .then((data) => {
        localStorage.setItem("accessToken", data.token);
        redirectToChatPage();
      })
      .catch((error) => {
        setOneClickOnSubmit(false);
        console.error("Fetch error:", error.message);

        if (
          error.message.includes("not found") ||
          error.message.includes("incorrect") ||
          error.message.includes("Unauthorized")
        ) {
          setPasswordError("❌ Email or password is incorrect.");
        } else {
          setPasswordError("❌ Something went wrong. Please try again later.");
        }
      });
  };

  return (
    <div className="page">
      <video autoPlay loop muted className="page-video">
        <source src={LightVideo} type="video/mp4" />
      </video>
      <div className="login-register-page-content">
        <div className="container">
          <div className="login-header">
            <div className="text">Login</div>
            <div className="underline"></div>
          </div>
          <div className="inputs">
            <button className="google-button" onClick={login}>
              <img src={google_icon} alt="Google Icon" />
              <span className="google-text">Login with Google</span>
            </button>
          </div>

          <h2 className="or">Or</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogInSubmit();
            }}
          >
            <div className="inputs">
              <div className="input">
                <img src={email_icon} alt="" />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleLogInEmail}
                />
              </div>
            </div>
            <div className="input">
              <img src={password_icon} alt="" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                onChange={handleLogInPassword}
              />
            </div>
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
                cursor: "pointer",
                fontSize: "1.2vw",
                marginTop: "0.5vw",
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
                  marginTop: "0.5vw",
                }}
              />
              Show Password
            </label>{" "}
            {emailError && (
              <div
                style={{
                  color: "red",
                  fontSize: "1.2vw",
                  marginBottom: "0.325vw",
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
                  marginBottom: "0.325vw",
                }}
              >
                {passwordError}
              </div>
            )}
            <span
              className="do-not-have-an-account"
              onClick={redirectToRegister}
            >
              Don't have an account? Click here!
            </span>
            <div className="submit-container">
              <button
                className="submit-login-button"
                onClick={handleLogInSubmit}
                disabled={oneClickOnSubmit}
              >
                Login
              </button>
            </div>{" "}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
