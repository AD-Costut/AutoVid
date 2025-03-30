import React, { useState } from "react";
import LightVideo from "../pages videos/Light Game.mp4";
import user_icon from "../login/login icons/person.png";
import email_icon from "../login/login icons/email.png";
import password_icon from "../login/login icons/password.png";
import { useNavigate } from "react-router-dom";
import "./Login&Register.css";

const Register = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="page">
      <video autoPlay loop muted className="page-video">
        <source src={LightVideo} autoPlay loop />
      </video>
      <div className="login-register-page-content">
        <div className="container">
          <div className="header">
            <div className="text">Register</div>
            <div className="underline"></div>{" "}
          </div>
          <div className="inputs">
            <div className="input" style={{ marginTop: "1vw" }}>
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Name" />
            </div>
            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" placeholder="Email" />
            </div>
            <div className="input">
              <img src={password_icon} alt="" />
              <input type="password" placeholder="Password" />
            </div>{" "}
          </div>
          <div className="submit-container">
            <button
              className="submit-register-button"
              onClick={redirectToLogin}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
