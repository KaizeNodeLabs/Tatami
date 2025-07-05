"use client";

import { Suspense, lazy, memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load Monaco Editor to improve initial load time
const Editor = lazy(() =>
  import("@monaco-editor/react").then((module) => ({
    default: module.default,
  }))
);

interface DynamicEditorProps {
  value: string;
  language?: string;
  height?: string;
  theme?: string;
  options?: any;
  onMount?: (editor: any) => void;
  onChange?: (value: string | undefined) => void;
}

const EditorSkeleton = memo(() => (
  <div className="space-y-2 p-4 bg-neutral rounded-lg">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-2/3" />
    <div className="mt-4 p-2 bg-background/50 rounded text-sm text-muted-foreground">
      Loading Monaco Editor...
    </div>
  </div>
));

EditorSkeleton.displayName = "EditorSkeleton";

export const DynamicEditor: React.FC<DynamicEditorProps> = memo((props) => {
  const defaultOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: "JetBrains Mono, Monaco, 'Courier New', monospace",
    lineNumbers: "on",
    renderWhitespace: "selection",
    wordWrap: "on",
    automaticLayout: true,
    // Don't set theme here - let parent control it
    ...props.options,
  };

  return (
    <Suspense fallback={<EditorSkeleton />}>
      <Editor
        height={props.height || "400px"}
        language={props.language || "rust"}
        theme={props.theme || "vs-dark"} // Use parent's theme preference
        options={defaultOptions}
        loading={<EditorSkeleton />}
        {...props}
      />
    </Suspense>
  );
});

DynamicEditor.displayName = "DynamicEditor";

export default DynamicEditor;
