import type { EntityField } from "@/app/app/diagram/EntityCard";
import type { Model, Property } from "@/types/models";

export function generateEntities(
  models: Model[],
): { title: string; fields: EntityField[]; modelId: string }[] {
  return models.map((model) => ({
    title: model.name,
    modelId: model.id,
    fields: model.properties.map((prop: Property) => ({
      name: prop.name,
      type: prop.dataType,
      isPrimary: prop.isKey || false,
    })),
  }));
}
