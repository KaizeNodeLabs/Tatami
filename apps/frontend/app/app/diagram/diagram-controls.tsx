import { Button } from "@/components/ui/button";
import { Expand, Minus, Plus, GitBranch, Minimize } from "lucide-react";
import { useDiagramStore } from "@/hooks/useDiagramStore";

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
  const { zoomLevel, zoomIn, zoomOut, isFullscreen } = useDiagramStore();
  
  const toggleRelationships = () => {
    onToggleRelationships(!relationshipsVisible);
  };

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
          title="Zoom In (+15%)"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <span className="font-semibold min-w-[3rem] text-center">{zoomLevel}%</span>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={zoomOut}
          title="Zoom Out (-15%)"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Expand className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}