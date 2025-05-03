// DraggableDiagram.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { EntityCard, type EntityField } from "./EntityCard";
import Xarrow, { Xwrapper } from "react-xarrows";

interface DraggableEntityProps {
  id: string;
  title: string;
  fields: EntityField[];
  initialPosition?: { x: number; y: number };
}

interface Position {
  x: number;
  y: number;
}

export function DraggableDiagram({ entities, relationships = [] }: {
  entities: DraggableEntityProps[];
  relationships?: { from: string; to: string; fieldName?: string }[];
}) {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newPositions: Record<string, Position> = { ...positions };
    let needsUpdate = false;
    
    entities.forEach((entity, index) => {
      if (!positions[entity.id]) {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const initialX = entity.initialPosition?.x ?? (200 + col * 350);
        const initialY = entity.initialPosition?.y ?? (150 + row * 220);
        newPositions[entity.id] = { x: initialX, y: initialY };
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      setPositions(newPositions);
    }
  }, [entities, positions]);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    const entityElement = document.getElementById(id);
    if (!entityElement) return;
    
    const rect = entityElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragging(id);
    setDragOffset({ x: offsetX, y: offsetY });
    
    if (entityElement) {
      entityElement.style.zIndex = "100";
    }
    
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !diagramRef.current) return;
      
      const diagramRect = diagramRef.current.getBoundingClientRect();
      const scrollX = diagramRef.current.scrollLeft;
      const scrollY = diagramRef.current.scrollTop;
      
      const newX = (e.clientX - diagramRect.left - dragOffset.x + scrollX) / (zoom / 100);
      const newY = (e.clientY - diagramRect.top - dragOffset.y + scrollY) / (zoom / 100);
      
      const boundedX = Math.max(0, newX);
      const boundedY = Math.max(0, newY);
      
      setPositions(prev => ({
        ...prev,
        [dragging]: { x: boundedX, y: boundedY }
      }));
    };
    
    const handleMouseUp = () => {
      if (dragging) {
        const entityElement = document.getElementById(dragging);
        if (entityElement) {
          entityElement.style.zIndex = "1";
        }
      }
      
      setDragging(null);
    };
    
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragOffset, zoom]);

  const updateZoom = (newZoom: number) => {
    setZoom(newZoom);
  };

  useEffect(() => {
    const handleZoomChange = (e: CustomEvent) => {
      updateZoom(e.detail.zoom);
    };

    window.addEventListener('diagramZoomChange' as any, handleZoomChange as EventListener);
    
    return () => {
      window.removeEventListener('diagramZoomChange' as any, handleZoomChange as EventListener);
    };
  }, []);

  return (
    <div 
      ref={diagramRef}
      className="relative w-full h-full overflow-auto bg-black"
      style={{ minHeight: "600px" }}
    >
      <div className="absolute top-2 left-4 text-green-400 text-sm">
        Table
      </div>
      <Xwrapper>
        <div 
          className="absolute top-0 left-0 w-full h-full DraggableDiagram"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left'
          }}
        >
          {entities.map((entity) => (
            <div
              id={entity.id}
              key={entity.id}
              className="absolute cursor-move"
              style={{
                transform: `translate(${positions[entity.id]?.x || 0}px, ${positions[entity.id]?.y || 0}px)`,
                zIndex: dragging === entity.id ? 10 : 1,
              }}
              onMouseDown={(e) => handleMouseDown(entity.id, e)}
            >
              {entity === entities[0] && (
                <div className="absolute inset-0 border-2 border-green-400 -m-1 rounded-md"></div>
              )}
              <EntityCard
                title={entity.title}
                fields={entity.fields}
                className="select-none"
              />
            </div>
          ))}
          
          {relationships.map((rel, index) => (
            <Xarrow
              key={`${rel.from}-${rel.to}-${index}`}
              start={rel.from}
              end={rel.to}
              color="#666"
              strokeWidth={1}
              path="straight"
              showHead={false}
              curveness={0.1}
              startAnchor="right"
              endAnchor="left"
              zIndex={0}
              animateDrawing={0.3}
              dashness={true}
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
}










