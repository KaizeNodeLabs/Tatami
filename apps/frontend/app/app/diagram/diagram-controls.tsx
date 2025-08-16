import { Button } from "@/components/ui/button";
import { Expand, Minus, Plus, GitBranch, Minimize } from "lucide-react";
import { useDiagramStore } from "@/hooks/useDiagramStore";
import { HelpTooltip } from "@/components/ui/help-tooltip";

interface DiagramControlsProps {
  relationshipsVisible: boolean;
  onToggleRelationships: (visible: boolean) => void;
  onToggleFullscreen: () => void;
}

export function DiagramControls({
  relationshipsVisible,
  onToggleRelationships,
  onToggleFullscreen,
}: DiagramControlsProps) {
  const { zoomLevel, zoomIn, zoomOut, resetZoom, isFullscreen } = useDiagramStore();
  
  const toggleRelationships = () => {
    onToggleRelationships(!relationshipsVisible);
  };

  const keyboardShortcuts = [
    "Ctrl/Cmd + + - Zoom In",
    "Ctrl/Cmd + - - Zoom Out", 
    "Ctrl/Cmd + 0 - Reset Zoom",
    "F or F11 - Toggle Fullscreen",
    "ESC - Exit Fullscreen",
    "Ctrl + Wheel - Zoom",
    "Double-click - Reset Zoom",
    "? - Show Help"
  ];

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
      <div className="flex items-center">
        <Button 
          size="icon" 
          variant="ghost"
          onClick={zoomIn}
          title="Zoom In (+15%) - Ctrl/Cmd + Plus"
          disabled={zoomLevel >= 200}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <div className="flex items-center min-w-[4rem] justify-center">
          <span 
            className="font-semibold text-center cursor-pointer hover:text-blue-500 transition-colors" 
            title="Click to reset zoom - Ctrl/Cmd + 0"
            onClick={resetZoom}
          >
            {zoomLevel}%
          </span>
        </div>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={zoomOut}
          title="Zoom Out (-15%) - Ctrl/Cmd + Minus"
          disabled={zoomLevel <= 25}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen - ESC" : "Enter Fullscreen - F or F11"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Expand className="h-4 w-4" />
          )}
        </Button>
        <HelpTooltip shortcuts={keyboardShortcuts} />
      </div>
    </div>
  );
}