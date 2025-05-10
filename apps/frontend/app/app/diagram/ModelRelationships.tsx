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
  diagramContainerElement: HTMLDivElement | null; // The container holding the EntityCards
}

export function ModelRelationships({
  relationships,
  diagramContainerElement,
}: ModelRelationshipsProps) {
  const [modelPositions, setModelPositions] = useState<ModelPosition[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null); // This is the SVG's direct wrapper

  useEffect(() => {
    const updatePositions = () => {
      if (
        !diagramContainerElement &&
        !document.body.contains(
          containerRef.current?.parentElement || document.body
        )
      ) {
        // If the diagram container isn't there, or if our SVG wrapper is detached, bail.
        setModelPositions([]);
        return;
      }

      // Query for model cards. If diagramContainerElement is available, scope the query.
      const cardElements = diagramContainerElement
        ? diagramContainerElement.querySelectorAll<HTMLElement>(
            "[data-model-id]"
          )
        : document.querySelectorAll<HTMLElement>("[data-model-id]"); // Fallback, less ideal

      const positions: ModelPosition[] = [];
      cardElements.forEach((card) => {
        const modelId = card.getAttribute("data-model-id");
        if (modelId) {
          positions.push({
            id: modelId,
            element: card,
            rect: card.getBoundingClientRect(),
          });
        }
      });
      setModelPositions(positions);

      if (containerRef.current) {
        // SVG dimensions should be based on its own wrapper (containerRef),
        // which is styled to fill the diagram area.
        setSvgDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updatePositions();

    const resizeObserver = new ResizeObserver(updatePositions);
    if (containerRef.current) {
      // Observe the SVG's wrapper for resize
      resizeObserver.observe(containerRef.current);
    }

    // The MutationObserver should observe the diagramContainerElement for changes
    // to the cards (e.g., style attribute changes like left/top).
    const mutationObserver = new MutationObserver(updatePositions);
    if (diagramContainerElement) {
      mutationObserver.observe(diagramContainerElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"], // Crucial for detecting position changes
      });
    }

    // Also, listen to window resize as card positions can be affected.
    window.addEventListener("resize", updatePositions);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updatePositions);
    };
  }, [relationships, diagramContainerElement]); // diagramContainerElement is a key dependency

  // Function to calculate path between two model cards
  const calculatePath = (sourceId: string, targetId: string): string => {
    const sourcePosition = modelPositions.find((pos) => pos.id === sourceId);
    const targetPosition = modelPositions.find((pos) => pos.id === targetId);

    if (!sourcePosition || !targetPosition || !containerRef.current) return "";

    const sourceRect = sourcePosition.rect;
    const targetRect = targetPosition.rect;

    // The SVG's (0,0) is the top-left of containerRef.current.
    // Card rects are relative to the viewport. We need to make them relative to containerRef.current.
    const svgContainerRect = containerRef.current.getBoundingClientRect();

    // Calculate midpoints of cards relative to the SVG container
    const sourceMidX =
      sourceRect.left + sourceRect.width / 2 - svgContainerRect.left;
    const sourceMidY =
      sourceRect.top + sourceRect.height / 2 - svgContainerRect.top;
    const targetMidX =
      targetRect.left + targetRect.width / 2 - svgContainerRect.left;
    const targetMidY =
      targetRect.top + targetRect.height / 2 - svgContainerRect.top;

    // Calculate points on the edges of the rectangles, relative to the SVG container
    const sourcePoint = findClosestPointOnRectangle(
      sourceMidX,
      sourceMidY,
      sourceRect.width,
      sourceRect.height,
      targetMidX,
      targetMidY
    );
    const targetPoint = findClosestPointOnRectangle(
      targetMidX,
      targetMidY,
      targetRect.width,
      targetRect.height,
      sourceMidX,
      sourceMidY
    );

    // Create a curved path
    return `M ${sourcePoint.x} ${sourcePoint.y} C ${
      (sourcePoint.x + targetPoint.x) / 2
    } ${sourcePoint.y}, ${(sourcePoint.x + targetPoint.x) / 2} ${
      targetPoint.y
    }, ${targetPoint.x} ${targetPoint.y}`;
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
    const halfWidth = rectWidth / 2; // These are dimensions, not coordinates
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
    const times = [xTime1, xTime2, yTime1, yTime2].filter(
      (t) => t > 0 && isFinite(t)
    );
    if (times.length === 0) {
      // Should not happen if target is outside and dx/dy are not both zero
      return { x: rectCenterX, y: rectCenterY }; // Fallback to center
    }
    const minTime = Math.min(...times);

    return {
      // rectCenterX, rectCenterY are already relative to SVG container
      // ndx, ndy are direction, minTime is distance scalar
      x: rectCenterX + ndx * minTime,
      y: rectCenterY + ndy * minTime,
    };
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <svg
        ref={svgRef}
        width={svgDimensions.width}
        height={svgDimensions.height}
        className="absolute top-0 left-0 pointer-events-none" // SVG itself should not capture pointer events
      >
        {relationships.map((relation, index) => {
          const path = calculatePath(
            relation.sourceModelId,
            relation.targetModelId
          );
          if (!path) return null; // Don't render if path couldn't be calculated

          return (
            <g
              key={`${relation.sourceModelId}-${relation.targetModelId}-${index}`}
            >
              <path
                d={path}
                fill="none"
                stroke="#FFFFFF" // Ensure this color is visible on your background
                strokeWidth="2"
                strokeDasharray="4,4"
                className="relationship-line" // This class is used by DiagramControls
                // markerEnd={`url(#arrowhead-${index})`} // Apply arrowhead
              />
              <marker
                id={`arrowhead-${index}`}
                viewBox="0 0 10 10" // Adjusted viewBox for better scaling
                refX="8" // Adjusted refX for better arrow positioning on the line end
                refY="5"
                markerUnits="strokeWidth"
                markerWidth="8" // Adjusted size
                markerHeight="6" // Adjusted size
                orient="auto-start-reverse" // Ensures arrow points correctly
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF" />{" "}
                {/* Simpler path for arrow */}
              </marker>

              {/* Tooltip to show relationship details on hover */}
              <title>
                {relation.relationshipFields
                  .map(
                    (field) =>
                      `${relation.sourceModel}.${field.sourceField} → ${relation.targetModel}.${field.targetField}`
                  )
                  .join("\n")}
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
