import React from "react";
import "./Loader.css";

const Loader = () => (
  <div className="tatami-loader-overlay">
    <div className="tatami-loader-content">
      <img src="/Primary%20Logo_Primary%20Color.svg" alt="Tatami Logo" className="tatami-logo" />
      {/* <span className="tatami-loader-text">Loading...</span> */}
    </div>
  </div>
);

export default Loader;