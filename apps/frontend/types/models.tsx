export interface Property {
  id: string;
  name: string;
  dataType: string;
  isKey: boolean;
}

export interface Model {
  id: string;
  name: string;
  expanded: boolean;
  properties: Property[];
  traits: string[];
}


export interface PropertyItemProps {
  id: string;
  name: string;
  dataType: string;
  isKey: boolean;
  onNameChange: (propertyId: string, value: string) => void;
  onDataTypeChange: (propertyId: string, value: string) => void;
  onKeyChange: (propertyId: string, value: boolean) => void;
  onDelete: (propertyId: string) => void;
}
