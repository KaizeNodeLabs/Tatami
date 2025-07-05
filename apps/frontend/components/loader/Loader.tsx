import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./Loader.css";

interface LoaderProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

const loadingMessages = [
  "Initializing Tatami...",
  "Loading components...",
  "Setting up workspace...",
  "Almost ready...",
];

const Loader: React.FC<LoaderProps> = ({
  message,
  progress,
  showProgress = true,
}) => {
  const [currentMessage, setCurrentMessage] = useState(
    message || loadingMessages[0]
  );
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (message) return; // Don't cycle if custom message provided

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const nextIndex = (prev + 1) % loadingMessages.length;
        setCurrentMessage(loadingMessages[nextIndex]);
        return nextIndex;
      });
    }, 600); // Faster message cycling for quicker loading feel

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="tatami-loader-overlay">
      <div className="tatami-loader-content">
        <div className="tatami-logo-container">
          <Image
            src="/Primary Logo_Primary Color.svg"
            alt="Tatami Logo"
            width={96}
            height={96}
            className="tatami-logo animate-pulse"
            priority
          />
        </div>
        <span className="tatami-loader-text">{currentMessage}</span>
        {showProgress && (
          <div className="tatami-progress-bar">
            <div
              className="tatami-progress-fill"
              style={{
                width: progress ? `${progress}%` : undefined,
                animation: progress ? "none" : undefined,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
