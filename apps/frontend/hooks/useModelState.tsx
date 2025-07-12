"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "./use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { detectModelRelationships, ModelRelationship } from "@/utils/detectModelRelationships";
import { modelStateService } from "@/services/ModelStateService";
import { EntityCardProps } from "@/app/app/diagram/EntityCard";

interface ModelStateType {
  entities: EntityCardProps[];
  relationships: ModelRelationship[];
  editedCode: string;
  isEditing: boolean;
  hasCustomEdits: boolean;
  loading: boolean;
  updatedEditedCode: (newCode: string) => void;
  restoreInitialModel: () => void;
  toggleEditMode: () => void;
  copyToClipboard: () => void;
  downloadCode: () => void;
  setIsEditing?: (value: boolean) => void;
  activeSections: "code" | "diagram";
  setActiveSection: (section: "code" | "diagram") => void;
  importModelData?: (data: { models: any[] }) => void;
}

const CreateModelStateContext = createContext<ModelStateType | undefined>(undefined);

export const useModelStateContext = () => {
  const context = useContext(CreateModelStateContext);
  if (!context) {
    throw new Error("useModelStateContext is missing from context");
  }
  return context;
};

const LOCAL_STORAGE_KEY = "modelStatePersistence";

export const ModelStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialModels, setInitialModels] = useState<any[]>([]);
  const [currentModels, setCurrentModels] = useState<any[]>([]);
  const [entities, setEntities] = useState<EntityCardProps[]>([]);
  const [relationships, setRelationships] = useState<ModelRelationship[]>([]);
  const [editedCode, setEditedCode] = useState("");
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSections, setActiveSection] = useState<"code" | "diagram">("code");
  const [forceRender, setForceRender] = useState(0);
  const { toast } = useToast();

  const applyModels = (models: any[], editedCodeOverride?: string, hasCustom?: boolean) => {
    const genCode = generateCairoCode(models);
    const codeToUse = editedCodeOverride ?? genCode;
    setInitialModels(models);
    setCurrentModels(models);
    setEntities(generateEntities(models));
    setRelationships(detectModelRelationships(models));
    setEditedCode(codeToUse);
    setHasCustomEdits(hasCustom ?? false);
  };

  const importModelData = (data: { models: any[] }) => {
    const { models } = data;
    if (!models || !Array.isArray(models)) return;

    applyModels(models);

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        models,
        editedCode: generateCairoCode(models),
        hasCustomEdits: false,
      })
    );

    toast({ title: "Modelos cargados", description: "El código ha sido generado." });
  };

  useEffect(() => {
    const loadModel = async () => {
      const persisted = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;

      if (persisted) {
        try {
          const parsed = JSON.parse(persisted);
          if (parsed.models?.length) {
            applyModels(parsed.models, parsed.editedCode, parsed.hasCustomEdits);
            setLoading(false);
            setForceRender((prev) => prev + 1);
            return;
          }
        } catch (error) {
          console.error("❌ Error parsing persisted model state:", error);
        }
      }

      // ✅ Si no hay nada persistido, busca el archivo JSON
      try {
        const res = await fetch("/models.json", { cache: "no-store" });
        const data = await res.json();
        if (data?.models?.length) {
          applyModels(data.models);
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              models: data.models,
              editedCode: generateCairoCode(data.models),
              hasCustomEdits: false,
            })
          );
          setLoading(false);
          setForceRender((prev) => prev + 1);
        }
      } catch (error) {
        console.error("❌ Error loading /models.json:", error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          editedCode,
          hasCustomEdits,
          models: currentModels,
        })
      );
    }
  }, [editedCode, hasCustomEdits, currentModels]);

  const updateEditedCode = (newCode: string) => {
    setEditedCode(newCode);
    setHasCustomEdits(true);
  };

  const restoreInitialModel = () => {
    const genCode = generateCairoCode(initialModels);
    setEditedCode(genCode);
    setHasCustomEdits(false);
    toast({
      title: "Reset",
      description: "Restored generated code",
    });
  };

  const toggleEditMode = () => {
    if (isEditing && hasCustomEdits) {
      toast({ title: "Changes saved", description: "Your edits were saved" });
    }
    setIsEditing((prev) => !prev);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedCode);
    toast({ title: "Code copied" });
  };

  const downloadCode = () => {
    const blob = new Blob([editedCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "models.cairo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modelStateValue: ModelStateType = {
    entities,
    relationships,
    editedCode,
    hasCustomEdits,
    loading,
    updatedEditedCode: updateEditedCode,
    restoreInitialModel,
    toggleEditMode,
    isEditing,
    copyToClipboard,
    downloadCode,
    setIsEditing,
    activeSections,
    setActiveSection,
    importModelData,
  };

  return (
    <CreateModelStateContext.Provider value={modelStateValue}>
      {children}
    </CreateModelStateContext.Provider>
  );
};
