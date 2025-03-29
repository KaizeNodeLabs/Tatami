import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor"; // Import monaco-editor

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  useEffect(() => {
    if (editorRef.current) {
      monacoInstance.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: "vs-dark",
        automaticLayout: true,
      });

      monacoInstance.current.onDidChangeModelContent(() => {
        const newValue = monacoInstance.current?.getValue() || "";
        onChange(newValue);
      });
    }

    return () => {
      monacoInstance.current?.dispose();
    };
  }, [value, language, onChange]);

  return <div ref={editorRef} style={{ height: "100%", width: "100%" }} />;
};

export default MonacoEditor;
