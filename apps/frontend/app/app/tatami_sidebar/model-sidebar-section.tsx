import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  BeakerIcon,
} from "lucide-react";
import { PropertyItem } from "../models/PropertyItem";
import { Button } from "../../../components/ui/button";
import { memo } from "react";
import { UseModelSectionReturn } from "../models/SideBarModels";
import TraitsDropdown from "./TraitsDropdown";

type Props = {
  modelSection: UseModelSectionReturn;
};

function ModelSidebarSection({ modelSection }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 flex justify-end flex-shrink-0">
        <Button
          onClick={modelSection.addModel}
          className="hover:bg-foreground/95 bg-foreground text-background font-medium flex items-center gap-1"
        >
          <span className="text-lg">+</span> Add model
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 overflow-x-visible">
        {modelSection.models.map((model) => (
          <div
            key={model.id}
            className="border border-neutral bg-neutral rounded-md mb-4"
          >
            <div className="flex items-center justify-between p-3 bg-neutral text-foreground flex-wrap">
              <div className="flex items-center gap-2 flex-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => modelSection.toggleModelExpansion(model.id)}
                >
                  {model.expanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Input
                      value={modelSection.editingModels[model.id] ?? model.name}
                      onChange={(e) =>
                        modelSection.setEditingModels((prev) => ({
                          ...prev,
                          [model.id]: e.target.value,
                        }))
                      }
                      className="h-8 bg-background border-neutral flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          modelSection.updateModelName(
                            model.id,
                            modelSection.editingModels[model.id] ?? model.name
                          );
                        } else if (e.key === "Escape") {
                          modelSection.setEditingModels((prev) => {
                            const updated = { ...prev };
                            delete updated[model.id];
                            return updated;
                          });
                        }
                      }}
                    />
                    <div className="w-24 flex-shrink-0 min-w-0">
                      <TraitsDropdown
                        modelId={model.id}
                        onTraitToggle={(modelId, trait, isSelected) =>
                          modelSection.updateModelTraits(
                            modelId,
                            trait,
                            isSelected
                          )
                        }
                        selectedTraits={model.traits || []}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => modelSection.deleteModel(model.id)}
                  className="hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {model.expanded && (
              <div className="p-3 bg-neutral">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Properties
                </h3>
                <div className="grid grid-cols-12 gap-1 text-xs font-medium text-muted-foreground mb-2 bg-background px-2 py-3">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-4">Datatype</div>
                  <div className="col-span-1 text-center">Key</div>
                  <div className="col-span-2 text-center" />
                </div>

                {model.properties.map((property) => (
                  <PropertyItem
                    key={property.id}
                    id={property.id}
                    name={property.name}
                    dataType={property.dataType}
                    isKey={property.isKey}
                    onNameChange={(propertyId, value) =>
                      modelSection.updatePropertyName(
                        model.id,
                        propertyId,
                        value
                      )
                    }
                    onDataTypeChange={(propertyId, value) =>
                      modelSection.updatePropertyDataType(
                        model.id,
                        propertyId,
                        value
                      )
                    }
                    onKeyChange={(propertyId, value) =>
                      modelSection.updatePropertyKey(
                        model.id,
                        propertyId,
                        value
                      )
                    }
                    onDelete={(propertyId) =>
                      modelSection.deleteProperty(model.id, propertyId)
                    }
                  />
                ))}

                <Button
                  onClick={() => modelSection.addProperty(model.id)}
                  className="w-full mt-2 text-text bg-background hover:bg-background/0 hover:text-primary-foreground border border-dotted border-foreground-500"
                >
                  <span className="mr-1">+</span> Add property
                </Button>
                <Button
                  onClick={() => modelSection.handleDownloadTest(model.id)}
                  className="w-full mt-2 text-black bg-yellow hover:bg-yellow/90 font-medium flex items-center gap-2"
                >
                  <BeakerIcon className="h-4 w-4" />
                  Generate Tests
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const MemoizedModelSidebarSection = memo(ModelSidebarSection);
