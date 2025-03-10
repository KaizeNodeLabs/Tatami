"use client";

import { Button } from "@/components/ui/button";
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
  LayoutTemplate,
  Layers,
  Settings,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Model, Property } from "@/types/models";
import { PropertyItem } from "./models/PropertyItem";

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

export function AppSidebar() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState(initialDynamicContent);
  const [models, setModels] = useState<Model[]>([]);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editModelName, setEditModelName] = useState<string>("");

  const toggleOption = (optionId: string) => {
    if (selectedOption === optionId) {
      setSelectedOption(null);
    } else {
      setSelectedOption(optionId);
    }
  };

  const addModel = () => {
    const newModel: Model = {
      id: `model_${Date.now()}`,
      name: `New Model ${models.length + 1}`,
      expanded: true,
      properties: [
        {
          id: `prop_${Date.now()}`,
          name: "",
          dataType: "# u32",
          isKey: true
        }
      ]
    };
    
    setModels([...models, newModel]);
  };

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
                name: "",
                dataType: "# u32",
                isKey: model.properties.length === 0,
              },
            ],
          };
        }
        return model;
      })
    );
  };

  const deleteProperty = (modelId: string, propertyId: string) => {
    setModels(
      models.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            properties: model.properties.filter((p) => p.id !== propertyId),
          };
        }
        return model;
      })
    );
  };

  const updatePropertyName = (modelId: string, propertyId: string, name: string) => {
    setModels(
      models.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            properties: model.properties.map((p) => 
              p.id === propertyId ? { ...p, name } : p
            ),
          };
        }
        return model;
      })
    );
  };

  const updatePropertyDataType = (modelId: string, propertyId: string, dataType: string) => {
    setModels(
      models.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            properties: model.properties.map((p) => 
              p.id === propertyId ? { ...p, dataType } : p
            ),
          };
        }
        return model;
      })
    );
  };

  const updatePropertyKey = (modelId: string, propertyId: string, isKey: boolean) => {
    setModels(
      models.map((model) => {
        if (model.id === modelId) {
          return {
            ...model,
            properties: model.properties.map((p) => 
              p.id === propertyId ? { ...p, isKey } : p
            ),
          };
        }
        return model;
      })
    );
  };

  const toggleModelExpansion = (modelId: string) => {
    setModels(
      models.map((model) => 
        model.id === modelId ? { ...model, expanded: !model.expanded } : model
      )
    );
  };

  const updateModelName = (modelId: string, name: string) => {
    setModels(
      models.map((model) => 
        model.id === modelId ? { ...model, name } : model
      )
    );
    setEditingModelId(null);
  };
  
  const startEditingModelName = (modelId: string, currentName: string) => {
    setEditingModelId(modelId);
    setEditModelName(currentName);
  };

  const deleteModel = (modelId: string) => {
    setModels(models.filter((model) => model.id !== modelId));
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
          className="fixed left-[60px] top-16 h-[calc(100vh-64px)] z-[99] shadow-lg border-r border-yellow-500 w-[350px] overflow-visible"
        >
          <SidebarContent className="h-full flex flex-col overflow-hidden">
            <SidebarGroup className="flex flex-col h-full overflow-hidden">
              <SidebarGroupLabel className="border-b border-yellow-500 flex-shrink-0">
                {staticMenuItems.find((item) => item.id === selectedOption)?.label}
              </SidebarGroupLabel>

              {selectedOption === "models" ? (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="p-4 flex justify-end flex-shrink-0">
                    <Button
                      onClick={addModel}
                      className="bg-black hover:bg-gray-900 text-white font-medium flex items-center gap-1"
                    >
                      <span className="text-lg">+</span> Add model
                    </Button>
                  </div>
                  
                  {/* Model list with custom scrollbar */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 overflow-x-visible">
                    {models.map((model) => (
                      <div key={model.id} className="border border-yellow-500/20 rounded-md overflow-hidden mb-4">
                        <div className="flex items-center justify-between p-3 bg-sidebar">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleModelExpansion(model.id)}
                              className="text-yellow-500 hover:text-yellow-600"
                            >
                              {model.expanded ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronRight className="h-5 w-5" />
                              )}
                            </button>

                            {editingModelId === model.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editModelName}
                                  onChange={(e) => setEditModelName(e.target.value)}
                                  className="h-8 bg-background border-yellow-500/20 text-foreground"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateModelName(model.id, editModelName);
                                    } else if (e.key === 'Escape') {
                                      setEditingModelId(null);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => updateModelName(model.id, editModelName)}
                                  className="h-8 px-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <span className="font-medium text-foreground">{model.name}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {editingModelId !== model.id && (
                              <button
                                type="button"
                                onClick={() => startEditingModelName(model.id, model.name)}
                                className="text-muted-foreground hover:text-white"
                              >
                                <span className="sr-only">Edit</span>
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteModel(model.id)}
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {model.expanded && (
                          <div className="p-3 bg-background">
                            <h3 className="text-sm font-medium text-foreground mb-3">Properties</h3>
                            
                            <div className="grid grid-cols-12 gap-1 text-xs font-medium text-muted-foreground mb-2 px-2">
                              <div className="col-span-1"></div>
                              <div className="col-span-5">Name</div>
                              <div className="col-span-4">Datatype</div>
                              <div className="col-span-1 text-center">Key</div>
                              <div className="col-span-1"></div>
                            </div>

                            {model.properties.map((property) => (
                              <PropertyItem
                                key={property.id}
                                id={property.id}
                                name={property.name}
                                dataType={property.dataType}
                                isKey={property.isKey}
                                onNameChange={(propertyId, value) => 
                                  updatePropertyName(model.id, propertyId, value)
                                }
                                onDataTypeChange={(propertyId, value) => 
                                  updatePropertyDataType(model.id, propertyId, value)
                                }
                                onKeyChange={(propertyId, value) => 
                                  updatePropertyKey(model.id, propertyId, value)
                                }
                                onDelete={(propertyId) => 
                                  deleteProperty(model.id, propertyId)
                                }
                              />
                            ))}

                            <Button
                              onClick={() => addProperty(model.id)}
                              variant="outline"
                              className="w-full mt-2 border-yellow-500/20 text-muted-foreground hover:bg-sidebar hover:text-foreground"
                            >
                              <span className="mr-1">+</span> Add property
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