"use client";

import { useEffect, useState, useRef } from "react";
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
import { ModelRelationship, detectModelRelationships } from "@/utils/detectModelRelationships";

export function CodeDiagramSection() {
  const [activeSection, setActiveSection] = useState("code");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [entities, setEntities] = useState<
    { title: string; fields: EntityField[]; modelId: string }[]
  >([]);
  const [modelRelationships, setModelRelationships] = useState<ModelRelationship[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const [showRelationships, setShowRelationships] = useState(true);
  const { toast } = useToast();
  const [entityPositions, setEntityPositions] = useState<Record<string, { x: number; y: number }>>({});
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);
  const diagramContainerRef = useRef<HTMLDivElement>(null);

  // Handler function for the Monaco editor
  function handleEditorDidMount(editor: import("monaco-editor").editor.IStandaloneCodeEditor): void {
    editorRef.current = editor;
  }

  // Handle code changes in the editor
  function handleEditorChange(value: string | undefined): void {
    if (isEditing && value !== undefined) {
      setEditedCode(value);
      setHasCustomEdits(true);
    }
  }

  // Toggle editing mode
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
  
  // Subscribe to model changes
  useEffect(() => {
    const subscription = modelStateService.models$.subscribe(models => {
      const generatedCode = generateCairoCode(models);

      // Only update code if we haven't made custom edits
      if (!hasCustomEdits) {
        setCode(generatedCode);
        setEditedCode(generatedCode);
      }

      setEntities(generateEntities(models));
      
      // Detect and set model relationships
      const relationships = detectModelRelationships(models);
      setModelRelationships(relationships);
      
      setLoading(false);
    });

    modelStateService.initialize();

    return () => subscription.unsubscribe();
  }, [hasCustomEdits]);

  // Handle relationship visibility toggle
  const handleToggleRelationships = (visible: boolean) => {
    setShowRelationships(visible);
  };

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
      description: "Your changes have been discarded and the generated code restored",
      duration: 2000,
      style: { color: "white" },
    });
  };

  const handleCardDragStart = (event: React.DragEvent<HTMLDivElement>, modelId: string) => {
    const cardElement = event.currentTarget;
    const cardRect = cardElement.getBoundingClientRect();
    
    // Calculate offset from mouse to top-left of card
    const offsetX = event.clientX - cardRect.left;
    const offsetY = event.clientY - cardRect.top;

    event.dataTransfer.setData("application/json", JSON.stringify({ modelId, offsetX, offsetY }));
    event.dataTransfer.effectAllowed = "move";

    // If not already absolutely positioned, capture its current position relative to the diagram container
    // This ensures a smooth transition from grid layout to absolute positioning.
    if (!entityPositions[modelId] && diagramContainerRef.current) {
      const diagramRect = diagramContainerRef.current.getBoundingClientRect();
      const initialX = cardRect.left - diagramRect.left;
      const initialY = cardRect.top - diagramRect.top;
      
      // Set initial position to prevent jump, then allow drag to update it
      setEntityPositions(prev => ({
        ...prev,
        [modelId]: { x: initialX, y: initialY }
      }));
    }
  };

  const handleDiagramDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    event.dataTransfer.dropEffect = "move";
  };

  const handleDiagramDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!diagramContainerRef.current) return;

    try {
      const dataString = event.dataTransfer.getData("application/json");
      if (!dataString) return;

      const { modelId, offsetX, offsetY } = JSON.parse(dataString);
      if (!modelId) return;

      const diagramRect = diagramContainerRef.current.getBoundingClientRect();
      const newX = event.clientX - diagramRect.left - offsetX;
      const newY = event.clientY - diagramRect.top - offsetY;

      setEntityPositions(prev => ({
        ...prev,
        [modelId]: { x: newX, y: newY },
      }));
    } catch (e) {
      console.error("Error processing drop data:", e);
    }
  };

  return (
    <section className="bg-neutral text-foreground rounded-xl shadow-md flex flex-col">
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

                  // Accesibilidad
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
            className="bg-neutral p-10 overflow-auto h-full relative" // Ensure this container is 'relative'
            onDragOver={handleDiagramDragOver}
            onDrop={handleDiagramDrop}
          >
            {/* Grid for model cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.length === 0 ? (
                <p className="text-gray-500">No models created yet</p>
              ) : (
                entities.map(({ title, fields, modelId }) => {
                  const position = entityPositions[modelId];
                  const cardStyle: React.CSSProperties = position
                    ? { position: 'absolute', left: `${position.x}px`, top: `${position.y}px`, zIndex: 20 }
                    : { zIndex: 10 }; // Default zIndex for grid items, can be removed if not needed

                  return (
                    <EntityCard 
                      key={modelId} 
                      title={title} 
                      fields={fields} 
                      modelId={modelId}
                      style={cardStyle}
                      onDragStart={handleCardDragStart}
                    />
                  );
                })
              )}
            </div>
            
            {/* Relationship lines */}
            {activeSection === "diagram" && entities.length > 0 && showRelationships && diagramContainerRef.current && (
              <ModelRelationships relationships={modelRelationships} diagramContainerElement={diagramContainerRef.current} />
            )}
          </div>
        )}
      </div>

      {activeSection === "diagram" && <DiagramControls onToggleRelationships={handleToggleRelationships} />}
    </section>
  );
}