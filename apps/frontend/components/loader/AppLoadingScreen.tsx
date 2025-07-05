"use client";

import React, { memo } from "react";
import Image from "next/image";
import "./Loader.css";

interface AppLoadingScreenProps {
  stage: 'initializing' | 'loading-models' | 'loading-editor' | 'ready';
  progress?: number;
}

const loadingStages = {
  initializing: "Initializing Tatami...",
  'loading-models': "Loading Models...",
  'loading-editor': "Loading Code Editor...", 
  ready: "Almost Ready..."
};

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = memo(({ stage, progress = 0 }) => (
  <div className="tatami-loader-overlay">
    <div className="tatami-loader-content">
      <div className="tatami-logo-container">
        <Image 
          src="/Primary Logo_Primary Color.svg" 
          alt="Tatami Logo" 
          width={120}
          height={120}
          className="tatami-logo animate-pulse"
          priority
        />
      </div>
      <span className="tatami-loader-text">{loadingStages[stage]}</span>
      <div className="tatami-progress-bar">
        <div 
          className="tatami-progress-fill" 
          style={{ 
            width: `${Math.min(progress, 100)}%`,
            animation: progress > 0 ? 'none' : undefined
          }}
        />
      </div>
      <div className="text-white/60 text-sm mt-2">
        {progress > 0 && `${Math.round(progress)}%`}
      </div>
    </div>
  </div>
));

AppLoadingScreen.displayName = "AppLoadingScreen";

export default AppLoadingScreen;
