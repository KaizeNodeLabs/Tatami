import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { PropertyItem } from "./PropertyItem";
import { Span } from "next/dist/trace";

interface Property {
  id: string;
  name: string;
  dataType: string;
  isKey: boolean;
}

interface ModelItemProps {
  id: string;
  name: string;
  properties: Property[];
  expanded: boolean;
  onNameChange: (id: string, name: string) => void;
  onExpandToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPropertyAdd: (modelId: string) => void;
  onPropertyDelete: (modelId: string, propertyId: string) => void;
  onPropertyNameChange: (
    modelId: string,
    propertyId: string,
    name: string,
  ) => void;
  onPropertyDataTypeChange: (
    modelId: string,
    propertyId: string,
    dataType: string,
  ) => void;
  onPropertyKeyChange: (
    modelId: string,
    propertyId: string,
    isKey: boolean,
  ) => void;
  allModelNames: string[];
}

export function ModelItem({
  id,
  name,
  properties,
  expanded,
  onNameChange,
  onExpandToggle,
  onDelete,
  onPropertyAdd,
  onPropertyDelete,
  onPropertyNameChange,
  onPropertyDataTypeChange,
  onPropertyKeyChange,
  allModelNames,
}: ModelItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [error, setError] = useState<string | null>(null);

const handleSaveName = () => {
    const trimmed = editName.trim();
    if (trimmed === "") {
      setEditName(name);
      setIsEditing(false);
      setError("Model name cannot be empty.");
      return;
    }
    // Check for duplicate name (excluding self)
    if (
      allModelNames
        .filter((n) => n !== name)
        .map((n) => n.toLowerCase())
        .includes(trimmed.toLowerCase())
    ) {
      setError("Model name already exists.");
      return;
    }
    setError(null);
    onNameChange(id, trimmed);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden mb-4">
      <div className="flex items-center justify-between p-3 bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onExpandToggle(id)}
            className="text-yellow-500 hover:text-yellow-600"
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editName}
                onChange={(e) => {setEditName(e.target.value);
                  setError(null);
                }
                }
                className="h-8 bg-gray-700 border-none text-white"
                autoFocus
              />
              <span>
                [{error && <span className="text-red-500 text-xs">{error}</span>}]
              </span>
              <Button
                size="sm"
                onClick={handleSaveName}
                className="h-8 px-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                Save
              </Button>
            </div>
          ) : (
            <span className="font-medium text-white">{name}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => !isEditing && setIsEditing(true)}
            className="text-gray-400 hover:text-white"
          >
            <span className="sr-only">Edit</span>✎
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 bg-gray-900">
          <h3 className="text-sm font-medium text-white mb-3">Properties</h3>

          <div className="grid grid-cols-12 gap-1 text-xs font-medium text-gray-400 mb-2 px-2">
            <div className="col-span-1" />
            <div className="col-span-5">Name</div>
            <div className="col-span-4">Datatype</div>
            <div className="col-span-1 text-center">Key</div>
            <div className="col-span-1" />
          </div>

          {properties.map((property) => (
            <PropertyItem
              key={property.id}
              id={property.id}
              name={property.name}
              dataType={property.dataType}
              isKey={property.isKey}
              onNameChange={(propertyId, value) =>
                onPropertyNameChange(id, propertyId, value)
              }
              onDataTypeChange={(propertyId, value) =>
                onPropertyDataTypeChange(id, propertyId, value)
              }
              onKeyChange={(propertyId, value) =>
                onPropertyKeyChange(id, propertyId, value)
              }
              onDelete={(propertyId) => onPropertyDelete(id, propertyId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
