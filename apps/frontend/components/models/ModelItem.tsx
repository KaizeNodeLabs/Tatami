import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { PropertyItem } from "./PropertyItem";

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
  onPropertyNameChange: (modelId: string, propertyId: string, name: string) => void;
  onPropertyDataTypeChange: (modelId: string, propertyId: string, dataType: string) => void;
  onPropertyKeyChange: (modelId: string, propertyId: string, isKey: boolean) => void;
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
}: ModelItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleSaveName = () => {
    onNameChange(id, editName);
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
                onChange={(e) => setEditName(e.target.value)}
                className="h-8 bg-gray-700 border-none text-white"
                autoFocus
              />
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
            <span className="sr-only">Edit</span>
            ✎
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
            <div className="col-span-1"></div>
            <div className="col-span-5">Name</div>
            <div className="col-span-4">Datatype</div>
            <div className="col-span-1 text-center">Key</div>
            <div className="col-span-1"></div>
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
              onDelete={(propertyId) => 
                onPropertyDelete(id, propertyId)
              }
            />
          ))}

          <Button
            onClick={() => onPropertyAdd(id)}
            variant="outline"
            className="w-full mt-2 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <span className="mr-1">+</span> Add property
          </Button>
        </div>
      )}
    </div>
  );
}