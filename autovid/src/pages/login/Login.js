import React, { useState } from "react";
import LightVideo from "../pages videos/Light Game.mp4";
import google_icon from "./login icons/google-icon.png";
import email_icon from "./login icons/email.png";
import password_icon from "./login icons/password.png";
import { useNavigate } from "react-router-dom";
import "../CommonlyUsedStyles/TransparentBox.css";
import "../CommonlyUsedStyles/PageStyle.css";
import "./Login&Register.css";

const Login = () => {
  const navigate = useNavigate();
  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="page">
      <video autoPlay loop muted className="page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="login-register-page-content">
        <div className="container">
          <div className="header">
            <div className="text">Login</div>
            <div className="underline"></div>{" "}
          </div>{" "}
          <div className="inputs">
            <button className="google-button">
              <img src={google_icon} alt="" />
              <span className="google-text">Login with Google</span>
            </button>
          </div>
          <h2 className="or">Or</h2>{" "}
          <div className="inputs">
            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" placeholder="Email" />
            </div>
            <div className="input">
              <img src={password_icon} alt="" />
              <input type="password" placeholder="Password" />
            </div>{" "}
            <span className="forgot-password" onClick={redirectToRegister}>
              Don't have an accou? Click here!
            </span>
            <div className="submit-container">
              <button className="submit-login-button">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
