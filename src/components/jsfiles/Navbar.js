import React from 'react';
import '../stylefiles/Navbar.css';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <span className="navbar-title">Home Assistant</span>
      <div className="navbar-links">
        <a href="#home" onClick={() => (navigate("/"))}>Home</a>
        <a href="#status" onClick={()=> navigate("/")}>Status</a>
        <a href="#logs" onClick={() => navigate("/")}>Logs</a>
      </div>
    </nav>
  );
};

export default Navbar;
