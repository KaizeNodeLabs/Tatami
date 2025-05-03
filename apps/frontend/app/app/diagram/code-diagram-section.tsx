"use client";

import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

import { EntityCard, type EntityField } from "@/app/app/diagram/EntityCard";
import { useToast } from "@/hooks/use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { ActionButtons } from "./action-buttons";
import { DiagramControls } from "./diagram-controls";
import { modelStateService } from "@/services/ModelStateService";
import { Loader } from "@/components/ui/loader";

export function CodeDiagramSection() {
  const [activeSection, setActiveSection] = useState("code");
  const [isFetching, setIsFetching] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [code, setCode] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [entities, setEntities] = useState<
    { title: string; fields: EntityField[] }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const { toast } = useToast();
  const editorRef = useRef<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);

  function handleEditorDidMount(
    editor: import("monaco-editor").editor.IStandaloneCodeEditor
  ): void {
    editorRef.current = editor;
    setIsEditorReady(true);
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
      setIsFetching(false);
    });

    modelStateService.initialize();

    return () => subscription.unsubscribe();
  }, [hasCustomEdits]);

  useEffect(() => {
    setIsFetching(true);
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        const generatedCode = generateCairoCode(data.models || []);
        setCode(generatedCode);
        setEditedCode(generatedCode);
        setEntities(generateEntities(data.models || []));
        setIsFetching(false);
      })
      .catch((err) => console.error("Error loading models:", err));
  }, []);

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

  return (
    <>
      <Loader isLoading={isFetching || !isEditorReady} />
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
            <div className="relative h-full flex flex-col">
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
                theme="hc-black"
              />
            </div>
          ) : (
            <div className="bg-neutral grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 overflow-auto h-full">
              {entities.length === 0 ? (
                <p className="text-gray-500">No models created yet</p>
              ) : (
                entities.map(({ title, fields }) => (
                  <EntityCard key={title} title={title} fields={fields} />
                ))
              )}
            </div>
          )}
        </div>

        {activeSection === "diagram" && <DiagramControls />}
      </section>
    </>
  );
}
