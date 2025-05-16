import { Button } from "@/components/ui/button";
import { Expand, Minus, Plus, GitBranch, Minimize } from "lucide-react";
import { useState, useEffect } from "react";

interface DiagramControlsProps {
  onToggleRelationships?: (visible: boolean) => void;
  onZoomChange?: (zoomLevel: number) => void;
  onToggleFullscreen?: () => void;
  zoomLevel: number;
  isFullscreen: boolean;
}

export function DiagramControls({ 
  onToggleRelationships, 
  onZoomChange, 
  onToggleFullscreen,
  zoomLevel = 100,
  isFullscreen = false
}: DiagramControlsProps) {
  const [relationshipsVisible, setRelationshipsVisible] = useState(true);

  const toggleRelationships = () => {
    const newState = !relationshipsVisible;
    setRelationshipsVisible(newState);
    if (onToggleRelationships) {
      onToggleRelationships(newState);
    }

  };

  const handleZoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel + 10, 200); // Maximum zoom of 200%
    if (onZoomChange) {
      onZoomChange(newZoomLevel);
    }
  };

  const handleZoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 10, 25); // Minimum zoom of 25%
    if (onZoomChange) {
      onZoomChange(newZoomLevel);
    }
  };

  const handleToggleFullscreen = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  };

  // Format zoom level for display
  const formattedZoomLevel = `${zoomLevel}%`;

  return (
    <div className="flex justify-between items-center p-2 border-t">
      <Button
        size="icon"
        variant={relationshipsVisible ? "default" : "outline"}
        onClick={toggleRelationships}
        title={relationshipsVisible ? "Hide Relationships" : "Show Relationships"}
        className="ml-2"
      >
        <GitBranch className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          title="Zoom Out"
          disabled={zoomLevel <= 25}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-sm min-w-12 text-center">{formattedZoomLevel}</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          title="Zoom In"
          disabled={zoomLevel >= 200}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}