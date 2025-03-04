import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface PropertyItemProps {
  id: string;
  name: string;
  dataType: string;
  isKey: boolean;
  onNameChange: (id: string, value: string) => void;
  onDataTypeChange: (id: string, value: string) => void;
  onKeyChange: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
}

const dataTypes = ["String", "Number", "Boolean", "Date", "Object", "Array"];

export function PropertyItem({
  id,
  name,
  dataType,
  isKey,
  onNameChange,
  onDataTypeChange,
  onKeyChange,
  onDelete,
}: PropertyItemProps) {
  return (
    <div className="grid grid-cols-12 gap-1 items-center bg-gray-800 rounded-md p-2 mb-2">
      <div className="col-span-1 flex justify-center text-gray-400">
        ≡
      </div>
      <div className="col-span-5">
        <Input
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          className="h-8 bg-gray-700 border-none text-white"
          placeholder="Name"
        />
      </div>
      <div className="col-span-4">
        <select
          value={dataType}
          onChange={(e) => onDataTypeChange(id, e.target.value)}
          className="w-full h-8 rounded-md bg-gray-700 border-none text-white px-3"
        >
          {dataTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1 flex justify-center">
        <input
          type="checkbox"
          checked={isKey}
          onChange={(e) => onKeyChange(id, e.target.checked)}
          className="h-4 w-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}