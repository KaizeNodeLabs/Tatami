import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Expand, Minus, Plus } from "lucide-react";

export function DiagramControls() {
  const [zoom, setZoom] = useState(100);
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
    updateDiagramZoom(zoom + 25);
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
    updateDiagramZoom(zoom - 25);
  };
  
  const handleReset = () => {
    setZoom(100);
    updateDiagramZoom(100);
  };
  
  // Function to update the diagram's zoom level
  const updateDiagramZoom = (newZoom: number) => {
    const diagramElement = document.querySelector('.DraggableDiagram');
    if (diagramElement) {
      (diagramElement as HTMLElement).style.transform = `scale(${newZoom / 100})`;
      (diagramElement as HTMLElement).style.transformOrigin = 'top left';
    }
  };

  return (
    <div className="flex justify-end items-center p-2 border-t">
      <Button
        size="icon"
        variant="ghost"
        onClick={handleZoomIn}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <span className="font-semibold">{zoom}%</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleZoomOut}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleReset}
      >
        <Expand className="h-4 w-4" />
      </Button>
    </div>
  );
}