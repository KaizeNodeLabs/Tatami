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
  diagramContainerElement: HTMLDivElement | null;
  relationshipsVisible: boolean;
}

export function ModelRelationships({
  relationships,
  diagramContainerElement,
  relationshipsVisible,
}: ModelRelationshipsProps) {
  const [modelPositions, setModelPositions] = useState<ModelPosition[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePositions = () => {
      if (
        !diagramContainerElement &&
        !document.body.contains(
          containerRef.current?.parentElement || document.body
        )
      ) {
        setModelPositions([]);
        return;
      }

      const cardElements = diagramContainerElement
        ? diagramContainerElement.querySelectorAll<HTMLElement>("[data-model-id]")
        : document.querySelectorAll<HTMLElement>("[data-model-id]");

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
        setSvgDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    const timeout = setTimeout(updatePositions, 0);

    const resizeObserver = new ResizeObserver(updatePositions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const mutationObserver = new MutationObserver(updatePositions);
    if (diagramContainerElement) {
      mutationObserver.observe(diagramContainerElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    window.addEventListener("resize", updatePositions);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updatePositions);
    };
  }, [relationships, diagramContainerElement]);

  const calculatePath = (sourceId: string, targetId: string): string => {
    const sourcePosition = modelPositions.find((pos) => pos.id === sourceId);
    const targetPosition = modelPositions.find((pos) => pos.id === targetId);

    if (!sourcePosition || !targetPosition || !containerRef.current) return "";

    const sourceRect = sourcePosition.rect;
    const targetRect = targetPosition.rect;

    const svgContainerRect = containerRef.current.getBoundingClientRect();

    const sourceMidX =
      sourceRect.left + sourceRect.width / 2 - svgContainerRect.left;
    const sourceMidY =
      sourceRect.top + sourceRect.height / 2 - svgContainerRect.top;
    const targetMidX =
      targetRect.left + targetRect.width / 2 - svgContainerRect.left;
    const targetMidY =
      targetRect.top + targetRect.height / 2 - svgContainerRect.top;

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

    return `M ${sourcePoint.x} ${sourcePoint.y} C ${
      (sourcePoint.x + targetPoint.x) / 2
    } ${sourcePoint.y}, ${(sourcePoint.x + targetPoint.x) / 2} ${
      targetPoint.y
    }, ${targetPoint.x} ${targetPoint.y}`;
  };

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

    const left = rectCenterX - halfWidth;
    const right = rectCenterX + halfWidth;
    const top = rectCenterY - halfHeight;
    const bottom = rectCenterY + halfHeight;

    const dx = targetX - rectCenterX;
    const dy = targetY - rectCenterY;

    if (dx === 0 && dy === 0) {
      return { x: rectCenterX, y: rectCenterY };
    }

    const length = Math.sqrt(dx * dx + dy * dy);
    const ndx = dx / length;
    const ndy = dy / length;

    const xTime1 = ndx !== 0 ? (left - rectCenterX) / ndx : Infinity;
    const xTime2 = ndx !== 0 ? (right - rectCenterX) / ndx : Infinity;
    const yTime1 = ndy !== 0 ? (top - rectCenterY) / ndy : Infinity;
    const yTime2 = ndy !== 0 ? (bottom - rectCenterY) / ndy : Infinity;

    const times = [xTime1, xTime2, yTime1, yTime2].filter(
      (t) => t > 0 && isFinite(t)
    );
    if (times.length === 0) {
      return { x: rectCenterX, y: rectCenterY };
    }
    const minTime = Math.min(...times);

    return {
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
        className="absolute top-0 left-0 pointer-events-none"
      >
        {relationships.map((relation, index) => {
          const path = calculatePath(
            relation.sourceModelId,
            relation.targetModelId
          );
          if (!path) return null;

          return (
            <g
              key={`${relation.sourceModelId}-${relation.targetModelId}-${index}`}
            >
              <path
                d={path}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="4,4"
                className="relationship-line"
                style={{
                  opacity: relationshipsVisible ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
              />
              <marker
                id={`arrowhead-${index}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerUnits="strokeWidth"
                markerWidth="8"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF" />
              </marker>
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