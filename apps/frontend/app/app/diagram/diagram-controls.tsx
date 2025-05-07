// diagram-controls.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Expand, Minus, Plus } from "lucide-react";

export function DiagramControls() {
  const [zoom, setZoom] = useState(100);
  
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 200);
    setZoom(newZoom);
    updateDiagramZoom(newZoom);
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 25);
    setZoom(newZoom);
    updateDiagramZoom(newZoom);
  };
  
  const handleReset = () => {
    setZoom(100);
    updateDiagramZoom(100);
  };
  
  const updateDiagramZoom = (newZoom: number) => {
    const zoomEvent = new CustomEvent('diagramZoomChange', {
      detail: { zoom: newZoom }
    });
    window.dispatchEvent(zoomEvent);
    
    const diagramElement = document.querySelector('.DraggableDiagram');
    if (diagramElement) {
      (diagramElement as HTMLElement).style.transform = `scale(${newZoom / 100})`;
      (diagramElement as HTMLElement).style.transformOrigin = 'top left';
    }
  };

  return (
    <div className="flex justify-end items-center p-2 border-t border-neutral-800">
      <Button
        size="icon"
        variant="ghost"
        onClick={handleZoomIn}
        className="text-white"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <span className="font-semibold text-white mx-2">{zoom}%</span>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleZoomOut}
        className="text-white"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleReset}
        className="text-white"
      >
        <Expand className="h-4 w-4" />
      </Button>
    </div>
  );
}