"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useToast } from "./use-toast";
import { generateCairoCode } from "@/utils/generateCairoCode";
import { generateEntities } from "@/utils/generateEntities";
import { detectModelRelationships, ModelRelationship } from "@/utils/detectModelRelationships";
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

const LOCAL_STORAGE_KEY = "modelStatePersistence";
const AUTO_REFRESH_INTERVAL = 500;

const CreateModelStateContext = createContext<ModelStateType | undefined>(undefined);

export const useModelStateContext = () => {
  const context = useContext(CreateModelStateContext);
  if (!context) throw new Error("useModelStateContext is missing from context");
  return context;
};

export const ModelStateProvider = ({ children }: { children: ReactNode }) => {
  const [initialModels, setInitialModels] = useState<any[]>([]);
  const [currentModels, setCurrentModels] = useState<any[]>([]);
  const [entities, setEntities] = useState<EntityCardProps[]>([]);
  const [relationships, setRelationships] = useState<ModelRelationship[]>([]);
  const [editedCode, setEditedCode] = useState("// no models created yet");
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSections, setActiveSection] = useState<"code" | "diagram">("code");

  const { toast } = useToast();

  const isEqualJSON = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

  const persistToLocalStorage = (models: any[], code: string, custom: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ models, editedCode: code, hasCustomEdits: custom })
      );
    }
  };

  const applyModels = (
    models: any[],
    editedCodeOverride?: string,
    hasCustom?: boolean
  ) => {
    const validModels = Array.isArray(models) ? models : [];
    const generatedCode = validModels.length > 0
      ? generateCairoCode(validModels)
      : "// no models created yet";
    const codeToUse = editedCodeOverride ?? generatedCode;

    if (
      isEqualJSON(currentModels, validModels) &&
      editedCode === codeToUse &&
      hasCustomEdits === (hasCustom ?? false)
    ) return;

    setInitialModels(validModels);
    setCurrentModels(validModels);
    setEntities(validModels.length > 0 ? generateEntities(validModels) : []);
    setRelationships(validModels.length > 0 ? detectModelRelationships(validModels) : []);
    setEditedCode(codeToUse);
    setHasCustomEdits(hasCustom ?? false);
  };

  const importModelData = (data: { models: any[] }) => {
    if (!Array.isArray(data?.models)) return;
    applyModels(data.models);
    persistToLocalStorage(data.models, generateCairoCode(data.models), false);
    toast({ title: "Loaded models", description: "The code has been generated." });
  };

  const fetchModelsFromJSON = async () => {
    try {
      const res = await fetch("/models.json", { cache: "no-store" });
      const data = await res.json();
      return Array.isArray(data?.models) ? data.models : null;
    } catch (err) {
      console.warn("❌ Error fetching models.json:", err);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const models = await fetchModelsFromJSON();
      if (!models) return;

      const newCode = generateCairoCode(models).trim();
      const currentCode = editedCode.trim();

      if (!hasCustomEdits && newCode !== currentCode && !isEqualJSON(models, currentModels)) {
        applyModels(models);
        persistToLocalStorage(models, newCode, false);
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [editedCode, hasCustomEdits, currentModels]);

  useEffect(() => {
    const loadInitialModel = async () => {
      const persisted = typeof window !== "undefined"
        ? localStorage.getItem(LOCAL_STORAGE_KEY)
        : null;

      if (persisted) {
        try {
          const parsed = JSON.parse(persisted);
          if (Array.isArray(parsed.models)) {
            applyModels(parsed.models, parsed.editedCode, parsed.hasCustomEdits);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("❌ Error parsing localStorage:", err);
        }
      }

      const models = await fetchModelsFromJSON();
      if (models) {
        applyModels(models);
        persistToLocalStorage(models, generateCairoCode(models), false);
      }
      setLoading(false);
    };

    loadInitialModel();
  }, []);

  useEffect(() => {
    persistToLocalStorage(currentModels, editedCode, hasCustomEdits);
  }, [editedCode, hasCustomEdits, currentModels]);

  const updateEditedCode = (newCode: string) => {
    setEditedCode(newCode);
    setHasCustomEdits(true);
  };

  const restoreInitialModel = () => {
    const restoredCode = initialModels.length > 0
      ? generateCairoCode(initialModels)
      : "// no models created yet";

    setEditedCode(restoredCode);
    setHasCustomEdits(false);

    toast({ title: "Reset", description: "The generated code was restored." });
  };

  const toggleEditMode = () => {
    if (isEditing && hasCustomEdits) {
      toast({ title: "Saved changes", description: "Your edits were saved." });
    }
    setIsEditing((prev) => !prev);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedCode);
    toast({ title: "Code copied to clipboard" });
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
    isEditing,
    hasCustomEdits,
    loading,
    updatedEditedCode: updateEditedCode,
    restoreInitialModel,
    toggleEditMode,
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
