"use client";

import { useEffect, useState, useRef } from "react";
import { DynamicEditor } from "@/components/editor/DynamicEditor";
import { EntityCard, type EntityField } from "@/app/app/diagram/EntityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { ActionButtons } from "./action-buttons";
import { DiagramControls } from "./diagram-controls";
import { modelStateService } from "@/services/ModelStateService";
import { ModelRelationships } from "./ModelRelationships";
import { useModelStateContext } from "@/hooks/useModelState";
import {
  ModelRelationship,
  detectModelRelationships,
} from "@/utils/detectModelRelationships";
import { Button } from "@/components/ui/button";

export function CodeDiagramSection() {
  const {
    editedCode,
    hasCustomEdits,
    loading,
    entities,
    relationships,
    isEditing,
    setIsEditing,
    toggleEditMode,
    restoreInitialModel,
    copyToClipboard,
    downloadCode,
    updatedEditedCode,
    activeSections,
    setActiveSection,
  } = useModelStateContext();
  const [relationshipsVisible, setRelationshipsVisible] = useState(true);
  const { toast } = useToast();
  const [entityPositions, setEntityPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const editorRef = useRef<any | null>(null);
  const diagramContainerRef = useRef<HTMLDivElement>(null);

  // --- Drag state for mouse-based dragging ---
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // --- Diagram vertical resizing ---
  const [diagramHeight, setDiagramHeight] = useState<number>(600); // px
  const resizingRef = useRef(false);

  function handleEditorDidMount(editor: any): void {
    editorRef.current = editor;
  }

  function handleEditorChange(value: string | undefined): void {
    if (isEditing && value !== undefined) {
      updatedEditedCode(value);
    }
  }

  const displayCode = editedCode;

  const resetToGenerated = restoreInitialModel;

  // --- Mouse-based dragging handlers ---
  const handleCardMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    modelId: string
  ) => {
    event.preventDefault();
    if (!diagramContainerRef.current) return;
    const cardRect = event.currentTarget.getBoundingClientRect();
    const diagramRect = diagramContainerRef.current.getBoundingClientRect();
    const offsetX = event.clientX - cardRect.left;
    const offsetY = event.clientY - cardRect.top;

    setDraggingId(modelId);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingId || !diagramContainerRef.current) return;
    const diagramRect = diagramContainerRef.current.getBoundingClientRect();
    let newX = event.clientX - diagramRect.left - dragOffset.x;
    let newY = event.clientY - diagramRect.top - dragOffset.y;

    newX = Math.max(0, Math.min(newX, diagramRect.width - 220));
    newY = Math.max(0, Math.min(newY, diagramRect.height - 80));

    setEntityPositions((prev) => ({
      ...prev,
      [draggingId]: { x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  useEffect(() => {
    if (draggingId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [draggingId]);

  // --- Diagram vertical resizing handlers ---
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    resizingRef.current = true;
    document.body.style.cursor = "ns-resize";
  };

  useEffect(() => {
    const handleResizeMouseMove = (e: MouseEvent) => {
      if (resizingRef.current && diagramContainerRef.current) {
        const containerRect =
          diagramContainerRef.current.getBoundingClientRect();
        const minHeight = 300;
        const maxHeight = window.innerHeight - 100;
        let newHeight = e.clientY - containerRect.top;
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
        setDiagramHeight(newHeight);
      }
    };
    const handleResizeMouseUp = () => {
      if (resizingRef.current) {
        resizingRef.current = false;
        document.body.style.cursor = "";
      }
    };
    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup", handleResizeMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleResizeMouseMove);
      window.removeEventListener("mouseup", handleResizeMouseUp);
      document.body.style.cursor = "";
    };
  }, []);

  // --- Always assign absolute positions for all cards when entering diagram view ---
  useEffect(() => {
    if (activeSections !== "diagram") return;
    setEntityPositions((prev) => {
      const updated = { ...prev };
      let changed = false;
      let x = 40,
        y = 40,
        col = 0,
        row = 0;
      const colWidth = 260,
        rowHeight = 160,
        maxCols = 3;
      for (const entity of entities) {
        const id = entity.modelId;
        if (typeof id === "string" && !updated[id]) {
          updated[id] = { x, y };
          changed = true;
          col++;
          if (col >= maxCols) {
            col = 0;
            row++;
            x = 40;
            y = 40 + row * rowHeight;
          } else {
            x += colWidth;
          }
        }
      }
      return changed ? updated : prev;
    });
  }, [activeSections, entities]);

  return (
    <section className="bg-neutral text-foreground rounded-xl shadow-md flex flex-col">
      <ActionButtons
        activeSection={activeSections}
        onToggleSection={() =>
          setActiveSection(activeSections === "code" ? "diagram" : "code")
        }
        onCopy={copyToClipboard}
        onDownload={downloadCode}
      />

      <div className="flex-1 overflow-hidden">
        {activeSections === "code" ? (
          loading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex justify-between p-2 border-b  mx-1">
                {hasCustomEdits && (
                  <button
                    onClick={resetToGenerated}
                    className="text-xs px-3 py-1 rounded bg-red-500 text-white"
                  >
                    Reset to Generated
                  </button>
                )}
                <div className="flex items-center ml-auto">
                  {hasCustomEdits && (
                    <span className="text-xs text-amber-600 mr-2">
                      ⚠️ Custom code
                    </span>
                  )}
                  <button
                    onClick={toggleEditMode}
                    className={`text-xs px-3 py-1 rounded ${isEditing
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                      }`}
                  >
                    {isEditing ? "Save" : "Edit Code"}
                  </button>
                </div>
              </div>
              <DynamicEditor
                value={displayCode}
                language="rust"
                height="70vh"
                theme="hc-black"
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                options={{
                  readOnly: !isEditing,
                  scrollBeyondLastLine: false,
                  fontSize: 15,
                  wordWrap: "on",
                  automaticLayout: true,
                  wrappingIndent: "indent",
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                    alwaysConsumeMouseWheel: false,
                  },
                  minimap: {
                    enabled: true,
                    maxColumn: 80,
                    renderCharacters: false,
                    showSlider: "always",
                  },
                  lineNumbers: "on",
                  lineNumbersMinChars: 3,
                  renderWhitespace: "boundary",
                  renderLineHighlight: "all",
                  guides: {
                    indentation: true,
                    highlightActiveIndentation: true,
                  },
                  cursorBlinking: "smooth",
                  cursorStyle: "line-thin",
                  find: {
                    addExtraSpaceOnTop: false,
                    autoFindInSelection: "never",
                    seedSearchStringFromSelection: "always",
                  },
                  mouseWheelZoom: true,
                  smoothScrolling: true,
                  padding: {
                    top: 12,
                    bottom: 12,
                  },
                }}
              />
            </div>
          )
        ) : (
          <div
            ref={diagramContainerRef}
            className="bg-neutral p-10 overflow-auto w-full relative"
            style={{
              height: diagramHeight,
              minHeight: 300,
              transition: "height 0.1s",
            }}
          >
            {entities.map(({ title, fields, modelId }) => {
              const position = entityPositions[modelId];
              if (position) {
                return (
                  <EntityCard
                    key={modelId}
                    title={title}
                    fields={fields}
                    modelId={modelId}
                    style={{
                      position: "absolute",
                      left: position.x,
                      top: position.y,
                      zIndex: draggingId === modelId ? 30 : 20,
                      cursor: draggingId === modelId ? "grabbing" : "grab",
                      minWidth: 220,
                      pointerEvents:
                        draggingId && draggingId !== modelId ? "none" : "auto",
                    }}
                  />
                );
              }
              return null;
            })}

            <ModelRelationships
              relationships={relationships}
              diagramContainerElement={diagramContainerRef.current}
              relationshipsVisible={relationshipsVisible}
            />

            <div
              onMouseDown={handleResizeMouseDown}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 12,
                cursor: "ns-resize",
                zIndex: 50,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.10))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
              aria-label="Resize diagram vertically"
              tabIndex={0}
              role="separator"
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: "#bbb",
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {activeSections === "diagram" && (
        <DiagramControls
          relationshipsVisible={relationshipsVisible}
          onToggleRelationships={setRelationshipsVisible}
        />
      )}
    </section>
  );
}
