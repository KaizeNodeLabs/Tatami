import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Data type information with descriptions, ranges, and examples
export const DATA_TYPES = {
  u8: {
    description: 'Unsigned 8-bit integer',
    range: '0 to 255',
    example: 'let level: u8 = 100;',
  },
  u16: {
    description: 'Unsigned 16-bit integer',
    range: '0 to 65,535',
    example: 'let small_id: u16 = 3000;',
  },
  u32: {
    description: 'Unsigned 32-bit integer',
    range: '0 to 4,294,967,295',
    example: 'let item_id: u32 = 1_000_000;',
  },
  u64: {
    description: 'Unsigned 64-bit integer',
    range: '0 to 1.84e19',
    example: 'let eth_gwei: u64 = 1e9;',
  },
  u128: {
    description: 'Unsigned 128-bit integer',
    range: '0 to 3.4e38',
    example: 'let total_supply: u128 = 1e24;',
  },
  u256: {
    description: 'Unsigned 256-bit integer',
    range: '0 to 1.15e77',
    example: 'let market_cap: u256 = 1e60;',
  },
  ByteArray: {
    description: 'Fixed-size byte array (hex/raw bytes)',
    range: 'Compile-time defined length',
    example: 'let hash = b"a1b2c3";',
  },
  String: {
    description: 'UTF-8 encoded string',
    range: 'Variable length',
    example: 'let name = "Player1";',
  },
  Bool: {
    description: 'Boolean value',
    range: 'true/false',
    example: 'let is_active = true;',
  },
  ContractAddress: {
    description: 'Typed contract address (wraps felt)',
    range: '251 bits',
    example: 'let contract = 0x123...;',
  },
};

// Trait information with descriptions and use cases
export const TRAITS = {
  Drop: {
    description: 'Hint to the compiler that a type can be safely destroyed when no longer used',
    useCase: 'Automatically cleanup temporary variables',
  },
  Serde: {
    description: 'Provides serialization/deserialization trait implementations',
    useCase: 'Converting structs to byte arrays for storage or transmission',
  },
  IntrospectPacked: {
    description: 'Attempts to pack multiple attributes into a single felt252',
    useCase: 'Optimizing storage space for small data structures',
  },
  Debug: {
    description: 'Enables printing of type instances for debugging',
    useCase: 'Inspecting variable values during development (println!("{:?}", my_var))',
  },
  Copy: {
    description: 'Allows types to be duplicated by copying felts (no new memory allocation)',
    useCase: 'Efficiently cloning simple types like integers or small structs',
  },
};

export interface TypeInfoTooltipProps {
  value: string;
  className?: string;
}

export function TypeInfoTooltip({ value, className }: TypeInfoTooltipProps) {
  // Determine if the value is a data type or trait
  const isDataType = value in DATA_TYPES;
  const isTrait = value in TRAITS;
  
  // Get the appropriate data based on the value
  const data = isDataType 
    ? DATA_TYPES[value as keyof typeof DATA_TYPES]
    : TRAITS[value as keyof typeof TRAITS];
  
  if (!data) {
    return null; // Don't render if we don't have info for this value
  }

  return (
    <Tooltip>
      <TooltipTrigger className={className}>
        <Info className="w-4 h-4" style={{ color: "#f7c618" }} />
      </TooltipTrigger>
      <TooltipContent>
        {isDataType ? (
          <DataTypeTooltipContent data={data as typeof DATA_TYPES[keyof typeof DATA_TYPES]} />
        ) : (
          <TraitTooltipContent data={data as typeof TRAITS[keyof typeof TRAITS]} />
        )}
      </TooltipContent>
    </Tooltip>
  );
}

// Component for data type tooltip content
interface DataTypeTooltipContentProps {
  data: {
    description: string;
    range: string;
    example: string;
  };
}

function DataTypeTooltipContent({ data }: DataTypeTooltipContentProps) {
  return (
    <div className="absolute w-[300px] p-4 rounded-xl bg-background text-white shadow-lg text-sm space-y-4 border border-[#2c2c2c] z-50 ml-8">
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-300">Description</span>
          <p className="mt-1">{data.description}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-300">Size/Range</span>
          <p className="mt-1">{data.range}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-300">Example</span>
          <div className="mt-1">
            <code className="px-2 py-1 rounded-md bg-[#f7c618] text-background font-mono block overflow-x-auto">
              {data.example}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for trait tooltip content
interface TraitTooltipContentProps {
  data: {
    description: string;
    useCase: string;
  };
}

function TraitTooltipContent({ data }: TraitTooltipContentProps) {
  return (
    <div className="absolute left-16 w-[300px] p-4 rounded-xl bg-background text-white shadow-lg text-sm space-y-4 border border-[#2c2c2c] z-100 ml-8">
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-300">Description</span>
          <p className="mt-1">{data.description}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-300">Use Case Example</span>
          <p className="mt-1">{data.useCase}</p>
        </div>
      </div>
    </div>
  );
}
