"use client";

import React, { useState, useRef, useEffect } from "react";
import { EntityCard, type EntityField } from "./EntityCard";
import Xarrow, { Xwrapper } from "react-xarrows";

interface DraggableEntityProps {
  id: string;
  title: string;
  fields: EntityField[];
  initialPosition?: { x: number; y: number };
  relationships?: { from: string; to: string }[];
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
  const diagramRef = useRef<HTMLDivElement>(null);

  // Initialize positions if not already set
  useEffect(() => {
    const newPositions: Record<string, Position> = { ...positions };
    let needsUpdate = false;
    
    entities.forEach((entity, index) => {
      if (!positions[entity.id]) {
        // Calculate initial position in a grid layout if not provided
        const initialX = entity.initialPosition?.x ?? (200 + (index % 3) * 300);
        const initialY = entity.initialPosition?.y ?? (100 + Math.floor(index / 3) * 350);
        newPositions[entity.id] = { x: initialX, y: initialY };
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      setPositions(newPositions);
    }
  }, [entities, positions]);

  // Handle mouse down event to start dragging
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    const entityElement = document.getElementById(id);
    if (!entityElement) return;
    
    const rect = entityElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragging(id);
    setDragOffset({ x: offsetX, y: offsetY });
    
    e.preventDefault();
  };

  // Handle mouse move event to update position while dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !diagramRef.current) return;
      
      const diagramRect = diagramRef.current.getBoundingClientRect();
      const scrollX = diagramRef.current.scrollLeft;
      const scrollY = diagramRef.current.scrollTop;
      
      // Calculate new position relative to diagram
      const newX = e.clientX - diagramRect.left - dragOffset.x + scrollX;
      const newY = e.clientY - diagramRect.top - dragOffset.y + scrollY;
      
      // Ensure entity stays within diagram boundaries
      const boundedX = Math.max(0, newX);
      const boundedY = Math.max(0, newY);
      
      setPositions(prev => ({
        ...prev,
        [dragging]: { x: boundedX, y: boundedY }
      }));
    };
    
    const handleMouseUp = () => {
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
  }, [dragging, dragOffset]);

  return (
    <div 
      ref={diagramRef}
      className="relative w-full h-full overflow-auto bg-black"
      style={{ minHeight: "600px" }}
    >
      <Xwrapper>
        <div className="absolute top-0 left-0 w-full h-full">
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
              <EntityCard
                title={entity.title}
                fields={entity.fields}
                className="select-none"
              />
            </div>
          ))}
          
          {/* Render relationships between entities */}
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
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
}