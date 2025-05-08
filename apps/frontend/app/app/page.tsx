"use client";

import { useState, useEffect } from "react";
import { CodeDiagramSection } from "@/app/app/diagram/code-diagram-section";
import { Loader } from "@/components/ui/loader";

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="w-full h-full p-10">
      {isLoading ? <Loader /> : <CodeDiagramSection />}
    </main>
  );
}
