"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { EntityCard, type EntityField } from "@/app/app/diagram/EntityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { ActionButtons } from "./action-buttons";
import { DiagramControls } from "./diagram-controls";
import { modelStateService } from "@/services/ModelStateService";

// --- Types ---
interface PositionedEntity {
  id: string;
  title: string;
  fields: EntityField[];
  position: { x: number; y: number };
}
interface Relationship {
  from: string;
  to: string;
}

// --- Relationship Helper ---
const generateRelationships = (currentEntities: PositionedEntity[], models: any[]): Relationship[] => {
  const relationships: Relationship[] = [];
  if (!currentEntities.length || !models.length) return [];
  const entityMapByTitle = new Map(currentEntities.map(e => [e.title, e.id]));
  models.forEach(model => {
    const fromEntityId = entityMapByTitle.get(model.name);
    if (!fromEntityId) return;
    (model.fields || []).forEach((field: { name: string, type: string }) => {
      const toEntityId = entityMapByTitle.get(field.type);
      if (toEntityId && fromEntityId !== toEntityId) {
        const exists = relationships.some(
          r => (r.from === fromEntityId && r.to === toEntityId) || (r.from === toEntityId && r.to === fromEntityId)
        );
        if (!exists) relationships.push({ from: fromEntityId, to: toEntityId });
      }
    });
  });
  return relationships;
};

export function CodeDiagramSection() {
  const [activeSection, setActiveSection] = useState("code");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [entities, setEntities] = useState<PositionedEntity[]>([]);
  const [rawModels, setRawModels] = useState<any[]>([]);
  const [activeEntityId, setActiveEntityId] = useState<string | null>(null);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const diagramRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const { toast } = useToast();
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);

  // --- Editor Handlers ---
  function handleEditorDidMount(editor: import("monaco-editor").editor.IStandaloneCodeEditor): void {
    editorRef.current = editor;
  }
  function handleEditorChange(value: string | undefined): void {
    if (isEditing && value !== undefined) {
      setEditedCode(value);
      setHasCustomEdits(true);
    }
  }
  const toggleEditMode = () => {
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

  // --- Model Subscription ---
  useEffect(() => {
    const subscription = modelStateService.models$.subscribe(models => {
      setRawModels(models);
      const generatedCode = generateCairoCode(models);
      if (!hasCustomEdits) {
        setCode(generatedCode);
        setEditedCode(generatedCode);
      }
      const newEntities = generateEntities(models).map((entity, index) => {
        const existingEntity = entities.find(e => e.title === entity.title);
        const id = existingEntity ? existingEntity.id : `${entity.title}-${index}`;
        const position = existingEntity ? existingEntity.position : { x: 100 + index * 280, y: 100 };
        return { ...entity, id, position };
      });
      setEntities(newEntities);
      setLoading(false);
    });
    modelStateService.initialize();
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomEdits]);

  // --- Relationships ---
  const relationships = useMemo(() => generateRelationships(entities, rawModels), [entities, rawModels]);

  // --- Initial Fetch ---
  useEffect(() => {
    setLoading(true);
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        const models = data.models || [];
        setRawModels(models);
        const generatedCode = generateCairoCode(models);
        setCode(generatedCode);
        setEditedCode(generatedCode);
        const initialEntities = generateEntities(models).map((entity, index) => ({
          ...entity,
          id: `${entity.title}-${index}`,
          position: { x: 100 + index * 280, y: 100 },
        }));
        setEntities(initialEntities);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Error loading models",
          description: "Could not fetch model data.",
          variant: "destructive",
        });
      });
  }, []);

  // --- Code Display ---
  const displayCode = hasCustomEdits ? editedCode : code;

  // --- Clipboard & Download ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayCode).then(() => {
      toast({
        title: "Code copied",
        description: "The code has been copied to your clipboard",
        duration: 2000,
        style: { color: "white" },
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      });
    });
  };
  const downloadCode = () => {
    try {
      const blob = new Blob([displayCode], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "models.cairo";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      toast({
        title: "Download failed",
        description: "Could not prepare the code for download.",
        variant: "destructive",
      });
    }
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

  // --- Drag Handlers ---
  const handleMouseDown = useCallback((e: React.MouseEvent, entityId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveEntityId(entityId);
    setStartDragPos({ x: e.pageX, y: e.pageY });
  }, []);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (activeEntityId === null || !diagramRef.current) return;
    e.preventDefault();
    const dx = e.pageX - startDragPos.x;
    const dy = e.pageY - startDragPos.y;
    setEntities(prevEntities =>
      prevEntities.map(entity =>
        entity.id === activeEntityId
          ? { ...entity, position: { x: entity.position.x + dx, y: entity.position.y + dy } }
          : entity
      )
    );
    setStartDragPos({ x: e.pageX, y: e.pageY });
  }, [activeEntityId, startDragPos]);
  const handleMouseUp = useCallback(() => {
    if (activeEntityId) setActiveEntityId(null);
  }, [activeEntityId]);
  useEffect(() => {
    const options = { capture: true };
    if (activeEntityId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp, options);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp, options);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp, options);
    };
  }, [activeEntityId, handleMouseMove, handleMouseUp]);

  // --- Render ---
  return (
    <section className="bg-neutral text-foreground rounded-xl shadow-md flex flex-col h-full">
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
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-4 w-5/6 bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
              <Skeleton className="h-4 w-4/5 bg-gray-700" />
              <Skeleton className="h-4 w-1/3 bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-2 border-b border-gray-700 mx-1">
                {hasCustomEdits && (
                  <button
                    onClick={resetToGenerated}
                    className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Reset to Generated
                  </button>
                )}
                <div className="flex items-center ml-auto space-x-2">
                  {hasCustomEdits && (
                    <span className="text-xs text-yellow-400 mr-2" title="Code has been manually edited">
                      ⚠️ Custom code
                    </span>
                  )}
                  <button
                    onClick={toggleEditMode}
                    className={`text-xs px-3 py-1 rounded transition-colors ${isEditing
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                  >
                    {isEditing ? "Save & Exit Edit" : "Edit Code"}
                  </button>
                </div>
              </div>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  width="100%"
                  className="absolute top-0 left-0"
                  defaultLanguage="rust"
                  value={displayCode}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  options={{
                    readOnly: !isEditing,
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    wrappingIndent: "indent",
                    scrollbar: {
                      verticalScrollbarSize: 10,
                      horizontalScrollbarSize: 10,
                      alwaysConsumeMouseWheel: false
                    },
                    minimap: {
                      enabled: true,
                      maxColumn: 100,
                      renderCharacters: false,
                      showSlider: "mouseover"
                    },
                    lineNumbers: "on",
                    lineNumbersMinChars: 3,
                    renderWhitespace: "none",
                    renderLineHighlight: "gutter",
                    guides: {
                      indentation: true,
                      highlightActiveIndentation: true
                    },
                    cursorBlinking: "smooth",
                    cursorStyle: "line",
                    find: {
                      addExtraSpaceOnTop: false,
                      autoFindInSelection: "multiline",
                      seedSearchStringFromSelection: "selection"
                    },
                    mouseWheelZoom: true,
                    smoothScrolling: true,
                    padding: {
                      top: 10,
                      bottom: 10
                    },
                    tabSize: 4,
                    insertSpaces: true,
                    detectIndentation: true,
                  }}
                  theme="vs-dark"
                />
              </div>
            </div>
          )
        ) : (
          <div
            ref={diagramRef}
            className="bg-[#181818] relative p-10 overflow-auto h-full"
            style={{ cursor: activeEntityId ? 'grabbing' : 'default' }}
          >
            {/* Relationship Lines SVG */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#F6B100" />
                </marker>
              </defs>
              {relationships.map((rel, idx) => {
                const fromEntity = entities.find(e => e.id === rel.from);
                const toEntity = entities.find(e => e.id === rel.to);
                if (!fromEntity || !toEntity) return null;
                const cardWidth = 240;
                const headerHeight = 36;
                const fieldRowHeight = 38;
                const dividerHeight = fromEntity.fields.length > 1 ? (fromEntity.fields.length - 1) * 1 : 0;
                const fromCardHeight = headerHeight + (fromEntity.fields.length * fieldRowHeight) + dividerHeight;
                const toCardHeight = headerHeight + (toEntity.fields.length * fieldRowHeight) + dividerHeight;
                const fromX = fromEntity.position.x + cardWidth / 2;
                const fromY = fromEntity.position.y + fromCardHeight / 2;
                const toX = toEntity.position.x + cardWidth / 2;
                const toY = toEntity.position.y + toCardHeight / 2;
                return (
                  <line
                    key={`rel-${idx}`}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#F6B100"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    strokeDasharray="6 4"
                  />
                );
              })}
            </svg>
            {/* Entity Cards */}
            {entities.length === 0 && !loading ? (
              <p className="text-gray-500 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                No models created yet. Add models to see the diagram.
              </p>
            ) : (
              entities.map((entity) => (
                <EntityCard
                  key={entity.id}
                  title={entity.title}
                  fields={entity.fields}
                  position={entity.position}
                  onMouseDown={(e) => handleMouseDown(e, entity.id)}
                  className={`z-10 transition-shadow duration-150 ${
                    activeEntityId === entity.id
                      ? 'shadow-2xl shadow-yellow-400/30 scale-[1.02]'
                      : 'shadow-md'
                  }`}
                />
              ))
            )}
            {loading && activeSection === 'diagram' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
                <p className="text-gray-300 text-lg animate-pulse">
                  Loading diagram...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {activeSection === "diagram" && <DiagramControls />}
    </section>
  );
}