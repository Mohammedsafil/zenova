import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylefiles/Home.css";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    try {
      const response = await axios.get(
        "https://zenova-server.onrender.com/checkAccess",
        {
          withCredentials: true, // Ensures cookies are sent
        }
      );
  
      if (response.status === 200) {
        navigate("/get-started");
      } else {
        alert("Not authorized. Requesting access...");
        await requestAccess();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Access check failed. Requesting access...");
      await requestAccess();
    }
  };
  
  

  const requestAccess = async () => {
    const password = prompt("Enter access password:");
    if (!password) return alert("Password is required.");
  
    try {
      const response = await axios.post(
        "https://zenova-server.onrender.com/getAccess",
        { password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensures cookies are stored
        }
      );
  
      if (response.status === 200) {
        alert("Access granted! Reloading...");
        window.location.reload(); // Ensures the new cookie is used
      } else {
        alert("Incorrect password.");
      }
    } catch (error) {
      alert("Request failed.");
    }
  };
  
  
  

  useEffect(() => {
    const starsContainer = document.querySelector(".stars");
    const starsCount = 100;
    const starsArray = [];

    for (let i = 0; i < starsCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}vw`;
      star.style.animationDuration = `${Math.random() * 2 + 3}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      starsArray.push(star);
    }

    starsArray.forEach((star) => starsContainer.appendChild(star));

    return () => {
      starsArray.forEach((star) => starsContainer.removeChild(star));
    };
  }, []);

  return (
    <>
    {/* <Navbar /> */}
    <div className="home-container">
      <h1 className="title">Do you want to make your home alive...?</h1>
      <div className="button-container">
        <button className="btn btn-primary" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
      <div className="stars"></div>
    </div>
    </>
  );
};

export default Home;
