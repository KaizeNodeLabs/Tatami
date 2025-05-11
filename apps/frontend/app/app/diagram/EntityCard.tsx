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
          "w-fit md:w-[259.52px] overflow-hidden border border-black/30 rounded-md z-10",
          className,
        )}
        data-model-id={modelId}
        {...props}
      >
        {/* Header */}
        <div className="bg-[#ECA610] px-2 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/diagram/tree.svg"
              alt="tree"
              width={19}
              height={19}
              className="text-black  "
            />
            <h3 className="text-sm font-medium  text-black">{title}</h3>
          </div>
          <Image
            src="/assets/diagram/arrow-ne.svg"
            alt="expand"
            width={19}
            height={19}
            className="cursor-pointer text-black"
          />
        </div>

        {/* Fields */}
        <div className="divide-y bg-[#1E1E1E]">
          {fields.map((field, index) => (
            <div
              key={`${field.name}-${index}`}
              className="flex items-center justify-between px-4 py-2 gap-4"
            >
              <div className="flex items-center gap-2 min-w-0">
                {field.isPrimary && (
                  <Image
                    src="/assets/diagram/key.svg"
                    alt="primary key"
                    width={19}
                    height={19}
                    className="flex-shrink-0 bg- "
                  />
                )}
                {getFieldIcon(field.type, field.name, field.isPrimary ?? false)}
                <span className="text-sm font-medium text-white truncate">
                  {field.name}
                </span>
              </div>
              <span className="text-sm text-[] opacity-76 flex-shrink-0">
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
