"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Expand, Minus, Plus, GitBranch, Minimize } from "lucide-react";

interface DiagramControlsProps {
  onToggleRelationships?: (visible: boolean) => void;
  showRelationships?: boolean;
  diagramZoom?: number;
  diagramSectionRef?: React.RefObject<HTMLElement | null>;
}

export function DiagramControls({
  onToggleRelationships,
  showRelationships = true,
  diagramZoom = 100,
  diagramSectionRef = React.createRef<HTMLElement>()
}: DiagramControlsProps) {
  const [relationshipsVisible, setRelationshipsVisible] = useState(showRelationships);
  const [zoomLevel, setZoomLevel] = useState(diagramZoom);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync relationships state with props
  useEffect(() => {
    setRelationshipsVisible(showRelationships);
  }, [showRelationships]);

  // Sync zoom level with props
  useEffect(() => {
    setZoomLevel(diagramZoom);
  }, [diagramZoom]);

  // Toggle relationship visibility
  const toggleRelationships = () => {
    const newState = !relationshipsVisible;
    setRelationshipsVisible(newState);

    if (onToggleRelationships) {
      onToggleRelationships(newState);
    }

    // Toggle class on relationship lines for visibility
    document.querySelectorAll('.relationship-line').forEach(line => {
      if (newState) {
        line.classList.remove('opacity-0');
      } else {
        line.classList.add('opacity-0');
      }
    });
  };

  // Zoom in functionality (increase by 15%)
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 15, 200);
    setZoomLevel(newZoom);
    dispatchZoomEvent(newZoom);
  };

  // Zoom out functionality (decrease by 15%)
  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 15, 25);
    setZoomLevel(newZoom);
    dispatchZoomEvent(newZoom);
  };

  // Dispatch custom zoom event
  const dispatchZoomEvent = (zoom: number) => {
    const zoomEvent = new CustomEvent('diagramZoomChange', {
      detail: { zoomLevel: zoom }
    });
    document.dispatchEvent(zoomEvent);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && diagramSectionRef?.current) {
      diagramSectionRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });

    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
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

  return (
    <div className="flex justify-between items-center p-2 border-t border-zinc-800 bg-black">
      {/* Relationship toggle control */}
      <div>
        <Button
          size="icon"
          variant={relationshipsVisible ? "default" : "outline"}
          onClick={toggleRelationships}
          title={relationshipsVisible ? "Hide Relationships" : "Show Relationships"}
          className="ml-2 bg-zinc-800 hover:bg-zinc-700 text-teal-400 border-zinc-700"
        >
          <GitBranch className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom and fullscreen controls */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          title="Zoom In"
          disabled={zoomLevel >= 200}
          className="text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <span className="font-semibold mx-2 text-zinc-300">{zoomLevel}%</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          title="Zoom Out"
          disabled={zoomLevel <= 25}
          className="text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="ml-2 text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}