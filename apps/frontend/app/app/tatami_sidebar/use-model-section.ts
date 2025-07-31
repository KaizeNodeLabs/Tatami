import type { Model } from "@/types/models";
import { useEffect, useState } from "react";
import { modelStateService } from "@/services/ModelStateService";
import { generateSimpleTest } from "@/utils/generateSimpleTest";

export const useModelSection = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [editingModels, setEditingModels] = useState<{ [key: string]: string }>(
    {}
  );

  // Subscribe to model changes
  useEffect(() => {
    const subscription = modelStateService.models$.subscribe(
      (updatedModels) => {
        setModels(updatedModels);
      }
    );

    modelStateService.initialize();

    return () => subscription.unsubscribe();
  }, []);

  const addModel = () => {
    const newModel: Model = {
      id: `model_${Date.now()}`,
      name: `New Model ${models.length + 1}`,
      expanded: true,
      properties: [
        { id: `prop_${Date.now()}`, name: "", dataType: "u32", isKey: true },
      ],
      traits: [], // Inicializar traits como un array vacío
    };

    modelStateService.addModel(newModel);
  };

  const addProperty = (modelId: string) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const updatedModel = {
      ...modelToUpdate,
      properties: [
        ...modelToUpdate.properties,
        {
          id: `prop_${Date.now()}`,
          name: "",
          dataType: "u32",
          isKey: modelToUpdate.properties.length === 0,
        },
      ],
    };

    modelStateService.updateModel(modelId, updatedModel);
  };

  const deleteProperty = (modelId: string, propertyId: string) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const updatedModel = {
      ...modelToUpdate,
      properties: modelToUpdate.properties.filter((p) => p.id !== propertyId),
    };

    modelStateService.updateModel(modelId, updatedModel);
  };

  const updatePropertyDataType = (
    modelId: string,
    propertyId: string,
    dataType: string
  ) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const updatedModel = {
      ...modelToUpdate,
      properties: modelToUpdate.properties.map((p) =>
        p.id === propertyId ? { ...p, dataType } : p
      ),
    };

    modelStateService.updateModel(modelId, updatedModel);
  };

  const updatePropertyKey = (
    modelId: string,
    propertyId: string,
    isKey: boolean
  ) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const updatedModel = {
      ...modelToUpdate,
      properties: modelToUpdate.properties.map((p) =>
        p.id === propertyId ? { ...p, isKey } : p
      ),
    };

    modelStateService.updateModel(modelId, updatedModel);
  };

  const toggleModelExpansion = (modelId: string) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const updatedModel = {
      ...modelToUpdate,
      expanded: !modelToUpdate.expanded,
    };

    modelStateService.updateModel(modelId, updatedModel);
  };

  const updateModelName = (modelId: string, name: string) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const updatedModel = {
      ...modelToUpdate,
      name,
    };

    modelStateService.updateModel(modelId, updatedModel);

    setEditingModels((prev) => {
      const updated = { ...prev };
      delete updated[modelId];
      return updated;
    });
  };

  const deleteModel = (modelId: string) => {
    modelStateService.deleteModel(modelId);
  };

  const updatePropertyName = (
    modelId: string,
    propertyId: string,
    name: string
  ) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const updatedModel = {
      ...modelToUpdate,
      properties: modelToUpdate.properties.map((p) =>
        p.id === propertyId ? { ...p, name } : p
      ),
    };

    modelStateService.updateModel(modelId, updatedModel);
  };

  const updateModelTraits = (
    modelId: string,
    trait: string,
    isSelected: boolean
  ) => {
    const modelToUpdate = models.find((model) => model.id === modelId);
    if (!modelToUpdate) return;

    const currentTraits = modelToUpdate.traits || [];

    const updatedTraits = isSelected
      ? [...currentTraits, trait]
      : currentTraits.filter((t) => t !== trait);

    const uniqueTraits = [...new Set(updatedTraits)];

    const updatedModel = {
      ...modelToUpdate,
      traits: uniqueTraits,
    };

    modelStateService.updateModel(modelId, updatedModel);
  };

  const handleDownloadTest = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (model) {
      const testCode = generateSimpleTest(model);
      const blob = new Blob([testCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${model.name.toLowerCase()}_test.cairo`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return {
    addModel,
    models,
    toggleModelExpansion,
    updateModelName,
    deleteModel,
    updatePropertyDataType,
    updatePropertyName,
    updatePropertyKey,
    deleteProperty,
    addProperty,
    editingModels,
    setEditingModels,
    updateModelTraits,
    handleDownloadTest,
  };
};
