"use client";

import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

import { EntityCard, type EntityField } from "@/app/app/diagram/EntityCard";
import { DraggableDiagram } from "@/app/app/diagram/DraggableDiagram";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { ActionButtons } from "./action-buttons";
import { DiagramControls } from "./diagram-controls";
import { modelStateService } from "@/services/ModelStateService";

export function CodeDiagramSection() {
  const [activeSection, setActiveSection] = useState("code");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [entities, setEntities] = useState<
    { title: string; fields: EntityField[] }[]
  >([]);
  // New state for entity relationships
  const [relationships, setRelationships] = useState<
    { from: string; to: string; fieldName?: string }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const { toast } = useToast();
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);

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
      
      // Generate relationships between entities
      if (models.length > 0) {
        const newRelationships = extractRelationships(models);
        setRelationships(newRelationships);
      }
      
      setLoading(false);
    });

    modelStateService.initialize();

    return () => subscription.unsubscribe();
  }, [hasCustomEdits]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        const generatedCode = generateCairoCode(data.models || []);
        setCode(generatedCode);
        setEditedCode(generatedCode); // Initialize editedCode with the same value
        setEntities(generateEntities(data.models || []));
        
        // Extract relationships from models
        if (data.models && data.models.length > 0) {
          const newRelationships = extractRelationships(data.models);
          setRelationships(newRelationships);
        }
        
        setLoading(false);
      })
      .catch((err) => console.error("Error loading models:", err));
  }, []);

  // Helper function to extract relationships between models
  const extractRelationships = (models: any[]) => {
    const relationshipsList: { from: string; to: string; fieldName?: string }[] = [];
    
    // This is a simplified example - modify according to your actual data structure
    models.forEach(model => {
      // Check if the model has references to other models
      if (model.fields) {
        model.fields.forEach((field: any) => {
          if (field.isReference && field.referenceModel) {
            relationshipsList.push({
              from: model.name,
              to: field.referenceModel,
              fieldName: field.name
            });
          }
        });
      }
    });
    
    return relationshipsList;
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

  // Format entities for the draggable diagram
  const diagramEntities = entities.map((entity) => ({
    id: entity.title,
    title: entity.title,
    fields: entity.fields
  }));

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
          // Replace the static grid with the new draggable diagram
          <DraggableDiagram 
            entities={diagramEntities} 
            relationships={relationships} 
          />
        )}
      </div>

      {activeSection === "diagram" && <DiagramControls />}
    </section>
  );
}