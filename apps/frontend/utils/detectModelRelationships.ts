import type { Model } from "@/types/models";

export interface ModelRelationship {
  sourceModel: string;
  sourceModelId: string;
  targetModel: string;
  targetModelId: string;
  relationshipFields: {
    sourceField: string;
    targetField: string;
  }[];
}

/**
 * Detects relationships between models based on matching key fields.
 * IMPORTANT: Only fields marked as keys (isKey === true) are considered for relationships
 * as relationships in data modeling should only be established between primary keys.
 * 
 * @param models Array of models to check for relationships
 * @returns Array of detected relationships
 */
export function detectModelRelationships(models: Model[]): ModelRelationship[] {
  const relationships: ModelRelationship[] = [];

  // Filter out models with no properties or only empty-named properties
  const validModels = models.filter(
    model =>
      Array.isArray(model.properties) &&
      model.properties.some(
        prop => prop.isKey && prop.name && prop.name.trim() !== ""
      )
  );

  // Compare each pair of models
  for (let i = 0; i < validModels.length; i++) {
    for (let j = i + 1; j < validModels.length; j++) {
      const modelA = validModels[i];
      const modelB = validModels[j];

      // Extract only key fields from both models (isKey is true and name is not empty)
      const keyFieldsA = modelA.properties.filter(
        prop => prop.isKey && prop.name && prop.name.trim() !== ""
      );
      const keyFieldsB = modelB.properties.filter(
        prop => prop.isKey && prop.name && prop.name.trim() !== ""
      );

      // Find matching key fields
      const matches: { sourceField: string; targetField: string }[] = [];

      keyFieldsA.forEach(fieldA => {
        keyFieldsB.forEach(fieldB => {
          // Skip if types don't match
          if (fieldA.dataType !== fieldB.dataType) return;

          // Check for exact field name match
          if (fieldA.name === fieldB.name) {
            matches.push({
              sourceField: fieldA.name,
              targetField: fieldB.name
            });
          }
          // Check for common patterns like singular_id to plural
          else if (
            (fieldA.name.endsWith('_id') && fieldB.name === fieldA.name.replace('_id', 's')) ||
            (fieldB.name.endsWith('_id') && fieldA.name === fieldB.name.replace('_id', 's'))
          ) {
            matches.push({
              sourceField: fieldA.name,
              targetField: fieldB.name
            });
          }
        });
      });

      // If we found matches, add relationship
      if (matches.length > 0) {
        relationships.push({
          sourceModel: modelA.name,
          sourceModelId: modelA.id,
          targetModel: modelB.name,
          targetModelId: modelB.id,
          relationshipFields: matches
        });
      }
    }
  }

  return relationships;
}