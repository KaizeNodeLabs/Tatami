import React, { useState } from "react";
import MonacoEditor from "./MonacoEditor";

const CodePanel: React.FC = () => {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "code.txt";
    link.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1 }}>
        <MonacoEditor value={code} language={language} onChange={setCode} />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleDownload}>Download</button>
        <button
          onClick={() =>
            setLanguage(language === "javascript" ? "python" : "javascript")
          }
        >
          Switch Language
        </button>
      </div>
    </div>
  );
};

export default CodePanel;
