"use client";

import React, { useEffect, useState, useRef, RefObject } from "react";
import Editor from "@monaco-editor/react";

import { EntityCard, type EntityField } from "@/app/app/diagram/EntityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { ActionButtons } from "./action-buttons";
import { DiagramControls } from "./diagram-controls";
import { modelStateService } from "@/services/ModelStateService";
import { detectModelRelationships, ModelRelationship } from "@/utils/detectModelRelationships";
import { ModelRelationships } from "./ModelRelationships";

export function CodeDiagramSection() {
  const [activeSection, setActiveSection] = useState("code");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [entities, setEntities] = useState<{ title: string; fields: EntityField[] }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const { toast } = useToast();
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);
  const diagramSectionRef = useRef<HTMLElement | null>(null);
  const diagramContainerRef = useRef<HTMLDivElement | null>(null);
  const [modelRelationships, setModelRelationships] = useState<ModelRelationship[]>([]);
  const [diagramZoom, setDiagramZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollStart = useRef<{ left: number; top: number }>({ left: 0, top: 0 });

  // Handle Monaco mount
  function handleEditorDidMount(editor: import("monaco-editor").editor.IStandaloneCodeEditor): void {
    editorRef.current = editor;
  }

  // Handle editor change
  function handleEditorChange(value: string | undefined): void {
    if (isEditing && value !== undefined) {
      setEditedCode(value);
      setHasCustomEdits(true);
    }
  }

  // Toggle code edit mode
  const toggleEditMode = () => {
    if (isEditing && hasCustomEdits) {
      toast({ title: "Changes saved", description: "Your code changes have been saved", duration: 2000, style: { color: "white" } });
    }

    setIsEditing(!isEditing);
    toast({
      title: isEditing ? "Edit mode disabled" : "Edit mode enabled",
      description: isEditing ? "The editor is now in read-only mode" : "You can now edit the code directly",
      duration: 2000,
      style: { color: "white" },
    });
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && diagramSectionRef.current) {
      diagramSectionRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!diagramContainerRef.current) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    scrollStart.current = {
      left: diagramContainerRef.current.scrollLeft,
      top: diagramContainerRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!diagramContainerRef.current || !isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    diagramContainerRef.current.scrollLeft = scrollStart.current.left - dx;
    diagramContainerRef.current.scrollTop = scrollStart.current.top - dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Subscribe to model stream
  useEffect(() => {
    const subscription = modelStateService.models$.subscribe(models => {
      const generatedCode = generateCairoCode(models);

      if (!hasCustomEdits) {
        setCode(generatedCode);
        setEditedCode(generatedCode);
      }

      setEntities(generateEntities(models));
      setLoading(false);
    });

    modelStateService.initialize();

    return () => subscription.unsubscribe();
  }, [hasCustomEdits]);

  // Load initial models
  useEffect(() => {
    setLoading(true);
    fetch("/api/models")
      .then(res => res.json())
      .then(data => {
        const generatedCode = generateCairoCode(data.models || []);
        setCode(generatedCode);
        setEditedCode(generatedCode);

        const entities = generateEntities(data.models || []);
        setEntities(entities);

        const relationships = detectModelRelationships(data.models || []);
        setModelRelationships(relationships);

        setLoading(false);
      })
      .catch(err => console.error("Error loading models:", err));
  }, []);

  // Listen for zoom change
  useEffect(() => {
    const handleZoomChange = (event: CustomEvent) => {
      setDiagramZoom(event.detail.zoomLevel);
    };

    document.addEventListener("diagramZoomChange", handleZoomChange as EventListener);
    return () => {
      document.removeEventListener("diagramZoomChange", handleZoomChange as EventListener);
    };
  }, []);

  const displayCode = hasCustomEdits ? editedCode : code;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayCode);
    toast({ title: "Code copied", description: "The code has been copied to your clipboard", duration: 2000, style: { color: "white" } });
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
      description: "Your changes have been discarded and the generated code restored",
      duration: 2000,
      style: { color: "white" },
    });
  };

  return (
    <section ref={diagramSectionRef} className="bg-neutral text-foreground rounded-xl shadow-md flex flex-col">
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
              {Array.from({ length: 10 }).map((_, idx) => (
                <Skeleton key={idx} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex justify-between p-2 border-b mx-1">
                {hasCustomEdits && (
                  <button onClick={resetToGenerated} className="text-xs px-3 py-1 rounded bg-red-500 text-white">
                    Reset to Generated
                  </button>
                )}
                <div className="flex items-center ml-auto">
                  {hasCustomEdits && (
                    <span className="text-xs text-amber-600 mr-2">⚠️ Custom code</span>
                  )}
                  <button
                    onClick={toggleEditMode}
                    className={`text-xs px-3 py-1 rounded ${isEditing ? "bg-green-500" : "bg-blue-500"} text-white`}
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
                    showSlider: "always"
                  },
                  lineNumbers: "on",
                  lineNumbersMinChars: 3,
                  renderWhitespace: "boundary",
                  renderLineHighlight: "all",
                  guides: {
                    indentation: true,
                    highlightActiveIndentation: true
                  },
                  cursorBlinking: "smooth",
                  cursorStyle: "line-thin",
                  find: {
                    addExtraSpaceOnTop: false,
                    autoFindInSelection: "never",
                    seedSearchStringFromSelection: "always"
                  },
                  mouseWheelZoom: true,
                  smoothScrolling: true,
                  padding: {
                    top: 12,
                    bottom: 12
                  },
                }}
                theme="hc-black"
              />
            </div>
          )
        ) : (
          <div
            ref={diagramContainerRef}
            className="relative h-[70vh] overflow-auto bg-neutral"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: isDragging ? "none" : "auto"
            }}
          >
            <div
              style={{
                transform: `scale(${diagramZoom / 100})`,
                transformOrigin: "top left",
                width: "max-content",
                height: "max-content",
                padding: "2rem"
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-max">
                {entities.length === 0 ? (
                  <p className="text-gray-500">No models created yet</p>
                ) : (
                  entities.map(({ title, fields }) => (
                    <EntityCard key={title} title={title} fields={fields} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {activeSection === "diagram" &&
        <>
          <ModelRelationships relationships={modelRelationships} />
          <DiagramControls diagramSectionRef={diagramSectionRef} diagramZoom={diagramZoom} />
        </>
      }

    </section>
  );
}
