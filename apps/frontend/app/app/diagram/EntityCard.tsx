// EntityCard.tsx

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export interface EntityField {
  name: string;
  type: string;
  isPrimary?: boolean;
}

export interface EntityCardProps {
  title: string;
  fields: EntityField[];
  className?: string;
  modelId?: string;
}

export const EntityCard = React.forwardRef<HTMLDivElement, EntityCardProps>(
  ({ title, fields, className, modelId, ...props }, ref) => {
    const getFieldIcon = (type: string, name: string, isPrimary: boolean) => {
      switch (true) {
        // Don't show type icon for ID fields
        case isPrimary:
          return null;
        // Check if the type represents a number
        case type.startsWith("u") || type.startsWith("i") || type === "felt252":
          return (
            <Image
              src="/assets/diagram/var.svg"
              alt="number"
              width={16}
              height={16}
              className="text-primary"
            />
          );
        // For string types
        case type.toLowerCase() === "string" ||
          type.toLowerCase() === "bytearray":
          return (
            <Image
              src="/assets/diagram/string.svg"
              alt="string"
              width={16}
              height={15}
              className="text-primary"
            />
          );
        // Default case - no icon
        default:
          return (
            <Image
              src="/assets/diagram/var.svg"
              alt="number"
              width={16}
              height={16}
              className="text-primary"
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-fit overflow-hidden border border-black/30 rounded-md z-10",
          className,
        )}
        data-model-id={modelId}
        {...props}
      >
        {/* Header */}
        <div className="bg-amber-500 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-black">{title}</span>
          </div>
          <Image
            src="/assets/diagram/arrow-ne.svg"
            alt="expand"
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </div>

        {/* Fields */}
        <div className="divide-y divide-gray-700/30 bg-black/80">
          {fields.map((field, index) => (
            <div
              key={`${field.name}-${index}`}
              className="flex items-center justify-between px-3 py-1.5 gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                {field.isPrimary && (
                  <span className="text-amber-500 flex-shrink-0">🔑</span>
                )}
                {!field.isPrimary && field.type.includes("u") && (
                  <span className="text-amber-500 flex-shrink-0">#</span>
                )}
                {!field.isPrimary && field.type.toLowerCase() === "string" && (
                  <span className="text-amber-500 flex-shrink-0">Aa</span>
                )}
                <span className={`text-sm font-medium ${field.isPrimary ? 'text-amber-500' : 'text-white'} truncate`}>
                  {field.name}
                </span>
              </div>
              <span className="text-sm text-gray-400 opacity-76 flex-shrink-0">
                {field.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

EntityCard.displayName = "EntityCard";