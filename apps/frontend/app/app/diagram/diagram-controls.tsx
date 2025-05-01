"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Expand, Minus, Plus, Minimize } from "lucide-react";

export function DiagramControls() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 15, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 15, 25));
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const diagramSection = document.querySelector('.bg-neutral.grid');
      if (diagramSection && diagramSection.requestFullscreen) {
        diagramSection.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  useEffect(() => {
    const zoomEvent = new CustomEvent('diagramZoomChange', {
      detail: { zoomLevel }
    });
    document.dispatchEvent(zoomEvent);
  }, [zoomLevel]);
  
  return (
    <div className="flex justify-end items-center p-2 border-t">
      <Button
        size="icon"
        variant="ghost"
        onClick={handleZoomIn}
        title="Zoom In"
        disabled={zoomLevel >= 200}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <span className="font-semibold mx-2">{zoomLevel}%</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleZoomOut}
        title="Zoom Out"
        disabled={zoomLevel <= 25}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        className="ml-2"
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
      </Button>
    </div>
  );
}