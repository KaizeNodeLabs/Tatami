"use client";

import React, { useEffect, useState, useRef } from "react";
import { ModelRelationship } from "@/utils/detectModelRelationships";

interface ModelPosition {
  id: string;
  element: HTMLElement;
  rect: DOMRect;
}

interface ModelRelationshipsProps {
  relationships: ModelRelationship[];
}

export function ModelRelationships({ relationships }: ModelRelationshipsProps) {
  const [modelPositions, setModelPositions] = useState<ModelPosition[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update model positions when the component mounts or window resizes
  useEffect(() => {
    const updatePositions = () => {
      // Find all model cards in the DOM by their data-model-id attribute
      const modelCards = document.querySelectorAll('[data-model-id]');
      const positions: ModelPosition[] = [];

      modelCards.forEach(card => {
        const modelId = card.getAttribute('data-model-id');
        if (modelId) {
          positions.push({
            id: modelId,
            element: card as HTMLElement,
            rect: card.getBoundingClientRect()
          });
        }
      });

      setModelPositions(positions);

      // Update SVG dimensions based on container
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setSvgDimensions({
          width: containerRect.width,
          height: containerRect.height
        });
      }
    };

    // Initial position calculation
    updatePositions();

    // Set up resize observer for container
    const resizeObserver = new ResizeObserver(updatePositions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Set up mutation observer to detect when model cards are added/removed/moved
    const mutationObserver = new MutationObserver(updatePositions);
    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    // Clean up observers
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [relationships]);

  // Function to calculate path between two model cards
  const calculatePath = (sourceId: string, targetId: string): string => {
    const sourcePosition = modelPositions.find(pos => pos.id === sourceId);
    const targetPosition = modelPositions.find(pos => pos.id === targetId);

    if (!sourcePosition || !targetPosition) return '';

    const sourceRect = sourcePosition.rect;
    const targetRect = targetPosition.rect;

    // Calculate center points relative to the container
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    
    const sourceX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
    const sourceY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
    const targetX = targetRect.left + targetRect.width / 2 - containerRect.left;
    const targetY = targetRect.top + targetRect.height / 2 - containerRect.top;

    // Find the closest points on the edges of the rectangles
    // This creates a better visual by connecting to edges rather than centers
    const sourcePoint = findClosestPointOnRectangle(
      sourceX, sourceY, sourceRect.width, sourceRect.height, targetX, targetY
    );
    const targetPoint = findClosestPointOnRectangle(
      targetX, targetY, targetRect.width, targetRect.height, sourceX, sourceY
    );

    // Create a curved path
    return `M ${sourcePoint.x} ${sourcePoint.y} C ${(sourcePoint.x + targetPoint.x) / 2} ${sourcePoint.y}, ${(sourcePoint.x + targetPoint.x) / 2} ${targetPoint.y}, ${targetPoint.x} ${targetPoint.y}`;
  };

  // Find closest point on a rectangle's edge to a target point
  const findClosestPointOnRectangle = (
    rectCenterX: number, 
    rectCenterY: number,
    rectWidth: number,
    rectHeight: number,
    targetX: number,
    targetY: number
  ) => {
    const halfWidth = rectWidth / 2;
    const halfHeight = rectHeight / 2;
    
    // Rectangle bounds
    const left = rectCenterX - halfWidth;
    const right = rectCenterX + halfWidth;
    const top = rectCenterY - halfHeight;
    const bottom = rectCenterY + halfHeight;
    
    // Calculate intersection of line from center to target with rectangle edges
    const dx = targetX - rectCenterX;
    const dy = targetY - rectCenterY;
    
    if (dx === 0 && dy === 0) {
      return { x: rectCenterX, y: rectCenterY };
    }
    
    // Normalize direction vector
    const length = Math.sqrt(dx * dx + dy * dy);
    const ndx = dx / length;
    const ndy = dy / length;
    
    // Calculate intersections with each edge
    const xTime1 = ndx !== 0 ? (left - rectCenterX) / ndx : Infinity;
    const xTime2 = ndx !== 0 ? (right - rectCenterX) / ndx : Infinity;
    const yTime1 = ndy !== 0 ? (top - rectCenterY) / ndy : Infinity;
    const yTime2 = ndy !== 0 ? (bottom - rectCenterY) / ndy : Infinity;
    
    // Find minimum positive time
    const times = [xTime1, xTime2, yTime1, yTime2].filter(t => t > 0);
    const minTime = Math.min(...times);
    
    return {
      x: rectCenterX + ndx * minTime,
      y: rectCenterY + ndy * minTime
    };
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <svg 
        ref={svgRef}
        width={svgDimensions.width}
        height={svgDimensions.height}
        className="absolute top-0 left-0 pointer-events-none"
      >
        {relationships.map((relation, index) => {
          const path = calculatePath(relation.sourceModelId, relation.targetModelId);
          return (
            <g key={`${relation.sourceModelId}-${relation.targetModelId}-${index}`}>
              <path
                d={path}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="4,4"
                className="relationship-line"
              />
              {/* Arrow head */}
              <marker
                id={`arrowhead-${index}`}
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#FFFFFF" />
              </marker>
              
              {/* Tooltip to show relationship details on hover */}
              <title>
                {relation.relationshipFields.map(field => 
                  `${relation.sourceModel}.${field.sourceField} → ${relation.targetModel}.${field.targetField}`
                ).join('\n')}
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
} 