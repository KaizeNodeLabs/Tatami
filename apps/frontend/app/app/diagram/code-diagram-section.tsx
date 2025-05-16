"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { EntityCard, type EntityField } from "@/app/app/diagram/EntityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { ActionButtons } from "./action-buttons";
import { DiagramControls } from "./diagram-controls";
import { modelStateService } from "@/services/ModelStateService";
import { ModelRelationships } from "./ModelRelationships";
import {
  ModelRelationship,
  detectModelRelationships,
} from "@/utils/detectModelRelationships";

export function CodeDiagramSection() {
  const [activeSection, setActiveSection] = useState("code");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [entities, setEntities] = useState<
    { title: string; fields: EntityField[]; modelId: string }[]
  >([]);
  const [modelRelationships, setModelRelationships] = useState<
    ModelRelationship[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);

  const [showRelationships, setShowRelationships] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [diagramHeight, setDiagramHeight] = useState("70vh");
  const { toast } = useToast();
  const [entityPositions, setEntityPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const editorRef = useRef<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);
  const diagramContainerRef = useRef<HTMLDivElement>(null);

  // --- Drag state for mouse-based dragging ---
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // --- Diagram vertical resizing ---

  const resizingRef = useRef(false);

  function handleEditorDidMount(
    editor: import("monaco-editor").editor.IStandaloneCodeEditor
  ): void {
    editorRef.current = editor;
  }

  function handleEditorChange(value: string | undefined): void {
    if (isEditing && value !== undefined) {
      setEditedCode(value);
      setHasCustomEdits(true);
    }
  }

  const toggleEditMode = () => {
    if (isEditing && hasCustomEdits) {
      toast({
        title: "Changes saved",
        description: "Your code changes have been saved",
        duration: 2000,
        style: { color: "white" },
      });
    }

    setIsEditing(!isEditing);
    toast({
      title: isEditing ? "Edit mode disabled" : "Edit mode enabled",
      description: isEditing
        ? "The editor is now in read-only mode"
        : "You can now edit the code directly",
      duration: 2000,
      style: { color: "white" },
    });
  };

  useEffect(() => {
    const subscription = modelStateService.models$.subscribe((models) => {
      const generatedCode = generateCairoCode(models);

      if (!hasCustomEdits) {
        setCode(generatedCode);
        setEditedCode(generatedCode);
      }

      setEntities(generateEntities(models));
      setModelRelationships(detectModelRelationships(models));
      setLoading(false);
    });

    modelStateService.initialize();

    return () => subscription.unsubscribe();
  }, [hasCustomEdits]);


  // Handle relationship visibility toggle
  const handleToggleRelationships = (visible: boolean) => {
    setShowRelationships(visible);
  };

  // Handle zoom change
  const handleZoomChange = useCallback((newZoomLevel: number) => {
    setZoomLevel(newZoomLevel);
    
    if (diagramContainerRef.current) {
      const contentContainer = diagramContainerRef.current.querySelector('.diagram-content-container');
      if (contentContainer) {
        (contentContainer as HTMLElement).style.transform = `scale(${newZoomLevel / 100})`;
        (contentContainer as HTMLElement).style.transformOrigin = 'center top';
      }
    }
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
    
    // If exiting fullscreen, reset diagram height
    if (isFullscreen) {
      setDiagramHeight("70vh");
    } else {
      // Enter fullscreen mode
      setDiagramHeight("calc(100vh - 120px)");
    }
  }, [isFullscreen]);

  // Adjust diagram height
  const increaseDiagramHeight = useCallback(() => {
    if (!isFullscreen) {
      setDiagramHeight(prev => {
        const currentHeight = parseInt(prev);
        if (!isNaN(currentHeight)) {
          return `${currentHeight + 10}vh`;
        }
        return prev;
      });
    }
  }, [isFullscreen]);

  // Determine which code to display
  const displayCode = hasCustomEdits ? editedCode : code;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayCode);
    toast({
      title: "Code copied",
      description: "The code has been copied to your clipboard",
      duration: 2000,
      style: { color: "white" },
    });
  };

  const downloadCode = () => {
    const blob = new Blob([displayCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "models.cairo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToGenerated = () => {
    setEditedCode(code);
    setHasCustomEdits(false);
    toast({
      title: "Code reset",
      description:
        "Your changes have been discarded and the generated code restored",
      duration: 2000,
      style: { color: "white" },
    });
  };

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
        const containerRect = diagramContainerRef.current.getBoundingClientRect();
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
    if (activeSection !== "diagram") return;
    setEntityPositions((prev) => {
      const updated = { ...prev };
      let changed = false;
      let x = 40, y = 40, col = 0, row = 0;
      const colWidth = 260, rowHeight = 160, maxCols = 3;
      for (const entity of entities) {
        if (!updated[entity.modelId]) {
          updated[entity.modelId] = { x, y };
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
  }, [activeSection, entities]);

  return (
    <section className={`bg-neutral text-foreground rounded-xl shadow-md flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <ActionButtons
        activeSection={activeSection}
        onToggleSection={() =>
          setActiveSection(activeSection === "code" ? "diagram" : "code")
        }
        onCopy={copyToClipboard}
        onDownload={downloadCode}
      />

      <div className="flex-1 overflow-hidden">
        {activeSection === "code" ? (
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
              <div className="flex justify-between p-2 border-b mx-1">
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
                    className={`text-xs px-3 py-1 rounded ${
                      isEditing
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {isEditing ? "Save" : "Edit Code"}
                  </button>
                </div>
              </div>
              <Editor
                height="70vh"
                className="bg-black"
                defaultLanguage="rust"
                value={displayCode}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
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
                    alwaysConsumeMouseWheel: false

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
                theme="hc-black"
              />
            </div>
          )
        ) : (
          <div
            ref={diagramContainerRef}
            className="bg-neutral p-10 overflow-auto relative transition-all duration-300 ease-in-out"
            style={{ height: diagramHeight }}
          >
            {/* Grid for model cards with zoom container */}
            <div 
              className="diagram-content-container transition-transform duration-300 ease-in-out"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center top' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entities.length === 0 ? (
                  <p className="text-gray-500">No models created yet</p>
                ) : (
                  entities.map(({ title, fields, modelId }) => (
                    <EntityCard 
                      key={modelId} 
                      title={title} 
                      fields={fields} 
                      modelId={modelId} 
                    />
                  ))
                )}
              </div>
              
              {/* Relationship lines */}
              {activeSection === "diagram" && entities.length > 0 && showRelationships && (
                <ModelRelationships relationships={modelRelationships} />
              )}

            </div>
          </div>
        )}
      </div>

      {activeSection === "diagram" && (
        <>
          <DiagramControls 
            onToggleRelationships={handleToggleRelationships} 
            onZoomChange={handleZoomChange}
            onToggleFullscreen={toggleFullscreen}
            zoomLevel={zoomLevel}
            isFullscreen={isFullscreen}
          />
          
        </>
      )}
    </section>
  );
}