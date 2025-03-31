"use client";

import { useEffect, useState } from "react";
import { EntityCard, type EntityField } from "@/components/diagram/EntityCard";
import { useToast } from "@/hooks/use-toast";
import { ActionButtons } from "./action-buttons";
import { DiagramControls } from "./diagram-controls";
import { modelStateService } from "@/services/ModelStateService";
import { generateEntities } from "@/utils/generateEntities"; // Added missing import

export function CodeDiagramSection() {
  const [loading, setLoading] = useState(true);
  const [entities, setEntities] = useState<
    { title: string; fields: EntityField[] }[]
  >([]);
  const [activeSection, setActiveSection] = useState("diagram"); // Added state for activeSection
  const { toast } = useToast();

  // Subscribe to model changes
  useEffect(() => {
    const subscription = modelStateService.models$.subscribe((models) => {
      setEntities(generateEntities(models));
      setLoading(false);
    });

    modelStateService.initialize();

    return () => subscription.unsubscribe();
  }, []);

  const copyToClipboard = () => {
    const diagramData = JSON.stringify(entities, null, 2);
    navigator.clipboard.writeText(diagramData);
    toast({
      title: "Diagram copied",
      description: "The diagram data has been copied to your clipboard",
      duration: 2000,
      style: { color: "white" },
    });
  };

  const downloadDiagram = () => {
    const blob = new Blob([JSON.stringify(entities, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diagram.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSection = () => {
    setActiveSection(activeSection === "diagram" ? "other" : "diagram"); // Placeholder toggle logic
  };

  return (
    <section className="bg-white rounded-xl shadow-md text-black flex flex-col h-full">
      <ActionButtons
        activeSection={activeSection} // Added activeSection prop
        onToggleSection={toggleSection} // Added onToggleSection prop
        onCopy={copyToClipboard}
        onDownload={downloadDiagram}
      />
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="space-y-2">
            {/* Skeleton loaders for diagram */}
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entities.map((entity, index) => (
              <EntityCard
                key={index}
                title={entity.title}
                fields={entity.fields}
              />
            ))}
          </div>
        )}
      </div>
      <DiagramControls />
    </section>
  );
}
