import { Model } from "@/types/models";

export interface UseModelSectionReturn {
  addModel: () => void;
  models: Model[];
  toggleModelExpansion: (modelId: string) => void;
  updateModelName: (modelId: string, name: string) => void;
  deleteModel: (modelId: string) => void;
  updatePropertyDataType: (modelId: string, propertyId: string, dataType: string) => void;
  updatePropertyName: (modelId: string, propertyId: string, name: string) => void;
  updatePropertyKey: (modelId: string, propertyId: string, isKey: boolean) => void;
  deleteProperty: (modelId: string, propertyId: string) => void;
  addProperty: (modelId: string) => void;
  editingModels: { [key: string]: string };
  setEditingModels: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  updateModelTraits: (modelId: string, trait: string, isSelected: boolean) => void;
  handleDownloadTest: (modelId: string) => void;
}