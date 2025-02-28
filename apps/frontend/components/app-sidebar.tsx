"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Box,
  ChevronDown,
  ChevronRight,
  Database,
  Edit,
  Layers,
  LayoutTemplate,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

// Static menu items for the main sidebar
const staticMenuItems = [
  { id: "models", label: "Make Models", icon: Database },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "components", label: "Components", icon: Box },
  { id: "layers", label: "Layers", icon: Layers },
  { id: "settings", label: "Settings", icon: Settings },
];

// Dynamic content for each option
const initialDynamicContent = {
  templates: [
    { id: "blank", label: "Blank Canvas" },
    { id: "flowchart", label: "Flowchart" },
    { id: "wireframe", label: "Wireframe" },
    { id: "mindmap", label: "Mind Map" },
  ],
  components: [
    { id: "shapes", label: "Basic Shapes" },
    { id: "connectors", label: "Connectors" },
    { id: "text", label: "Text Elements" },
    { id: "icons", label: "Icons" },
  ],
  models: [],
  layers: [
    { id: "layer1", label: "Layer 1" },
    { id: "layer2", label: "Layer 2" },
    { id: "layer3", label: "Layer 3" },
  ],
  settings: [
    { id: "account", label: "Account Settings" },
    { id: "preferences", label: "Preferences" },
    { id: "theme", label: "Theme" },
  ],
};

// Data type options for properties
const dataTypes = ["String", "Number", "Boolean", "Date", "Object", "Array"];

export function AppSidebar() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState(initialDynamicContent);
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>(
    {},
  );
  const [models, setModels] = useState<
    Array<{
      id: string;
      name: string;
      properties: Array<{
        id: string;
        name: string;
        dataType: string;
        isKey: boolean;
      }>;
    }>
  >([]);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState("");

  // Toggle the selected option
  const toggleOption = (optionId: string) => {
    if (selectedOption === optionId) {
      // If clicking the same option, close it
      setSelectedOption(null);
    } else {
      // Otherwise, select the new option
      setSelectedOption(optionId);
    }
  };

  // Toggle model expansion
  const toggleModelExpansion = (modelId: string) => {
    setExpandedModels((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));
  };

  // Create a new model
  const createModel = () => {
    const newModelId = `model_${Date.now()}`;
    const newModel = {
      id: newModelId,
      name: `New Model ${models.length + 1}`,
      properties: [],
    };

    setModels([...models, newModel]);
    setExpandedModels((prev) => ({
      ...prev,
      [newModelId]: true,
    }));
    setEditingModelId(newModelId);
    setNewModelName(`New Model ${models.length + 1}`);
  };

  // Delete a model
  const deleteModel = (modelId: string) => {
    setModels(models.filter((model) => model.id !== modelId));
  };

  // Save model name
  const saveModelName = (modelId: string) => {
    setModels(
      models.map((model) =>
        model.id === modelId
          ? { ...model, name: newModelName || model.name }
          : model,
      ),
    );
    setEditingModelId(null);
  };

  // Add a property to a model
  const addProperty = (modelId: string) => {
    setModels(
      models.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            properties: [
              ...model.properties,
              {
                id: `prop_${Date.now()}`,
                name: `Property ${model.properties.length + 1}`,
                dataType: "String",
                isKey: model.properties.length === 0, // First property is key by default
              },
            ],
          };
        }
        return model;
      }),
    );
  };

  // Delete a property
  const deleteProperty = (modelId: string, propertyId: string) => {
    setModels(
      models.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            properties: model.properties.filter(
              (prop) => prop.id !== propertyId,
            ),
          };
        }
        return model;
      }),
    );
  };

  // Update property
  const updateProperty = (
    modelId: string,
    propertyId: string,
    field: string,
    value: string | boolean,
  ) => {
    setModels(
      models.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            properties: model.properties.map((prop) => {
              if (prop.id === propertyId) {
                return { ...prop, [field]: value };
              }
              return prop;
            }),
          };
        }
        return model;
      }),
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Static Sidebar - Always visible */}
      <Sidebar
        collapsible="none"
        className="fixed left-0 top-16 h-[calc(100vh-64px)] z-[100] shadow-lg w-[60px] border-r border-yellow-500"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {staticMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={selectedOption === item.id}
                    onClick={() => toggleOption(item.id)}
                    tooltip={item.label}
                    className="hover:border-yellow-500 focus:border-yellow-500 justify-center p-3"
                  >
                    <item.icon className="h-6 w-6" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Dynamic Sidebar - Changes based on selection */}
      {selectedOption && (
        <Sidebar
          collapsible="none"
          className="fixed left-[60px] top-16 h-[calc(100vh-64px)] z-[99] shadow-lg border-r border-yellow-500 w-[300px]"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="border-b border-yellow-500">
                {
                  staticMenuItems.find((item) => item.id === selectedOption)
                    ?.label
                }
              </SidebarGroupLabel>

              {selectedOption === "models" ? (
                <div className="flex flex-col gap-2 p-2">
                  <Button
                    onClick={createModel}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Create Model
                  </Button>

                  <div className="mt-4 space-y-3">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        className="border border-yellow-500 rounded-md overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-2 bg-yellow-500/10">
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              type="button"
                              onClick={() => toggleModelExpansion(model.id)}
                              className="text-yellow-500 hover:text-yellow-600"
                            >
                              {expandedModels[model.id] ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronRight className="h-5 w-5" />
                              )}
                            </button>

                            {editingModelId === model.id ? (
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  value={newModelName}
                                  onChange={(e) =>
                                    setNewModelName(e.target.value)
                                  }
                                  className="h-7 text-sm"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveModelName(model.id)}
                                  className="h-7 px-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-1">
                                <span className="font-medium">
                                  {model.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingModelId(model.id);
                                    setNewModelName(model.name);
                                  }}
                                  className="text-yellow-500 hover:text-yellow-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteModel(model.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {expandedModels[model.id] && (
                          <div className="p-2 space-y-3">
                            <div className="text-sm font-medium text-yellow-500 border-b border-yellow-500/30 pb-1">
                              Properties
                            </div>

                            {model.properties.length > 0 && (
                              <div className="space-y-2">
                                <div className="grid grid-cols-12 gap-1 text-xs font-medium text-yellow-500/70">
                                  <div className="col-span-4">Name</div>
                                  <div className="col-span-4">Data Type</div>
                                  <div className="col-span-3">Key</div>
                                  <div className="col-span-1" />
                                </div>

                                {model.properties.map((property) => (
                                  <div
                                    key={property.id}
                                    className="grid grid-cols-12 gap-1 items-center"
                                  >
                                    <div className="col-span-4">
                                      <Input
                                        value={property.name}
                                        onChange={(e) =>
                                          updateProperty(
                                            model.id,
                                            property.id,
                                            "name",
                                            e.target.value,
                                          )
                                        }
                                        className="h-7 text-xs"
                                      />
                                    </div>
                                    <div className="col-span-4">
                                      <select
                                        value={property.dataType}
                                        onChange={(e) =>
                                          updateProperty(
                                            model.id,
                                            property.id,
                                            "dataType",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full h-7 text-xs rounded-md border border-input bg-background px-3"
                                      >
                                        {dataTypes.map((type) => (
                                          <option key={type} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="col-span-3 flex justify-center">
                                      <input
                                        type="checkbox"
                                        checked={property.isKey}
                                        onChange={(e) =>
                                          updateProperty(
                                            model.id,
                                            property.id,
                                            "isKey",
                                            e.target.checked,
                                          )
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                                      />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          deleteProperty(model.id, property.id)
                                        }
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <Button
                              onClick={() => addProperty(model.id)}
                              size="sm"
                              variant="outline"
                              className="w-full mt-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-black font-medium"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Property
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {dynamicContent[
                      selectedOption as keyof typeof dynamicContent
                    ].map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton className="w-full hover:border-yellow-500 text-base p-3">
                          {item.label}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </div>
  );
}
