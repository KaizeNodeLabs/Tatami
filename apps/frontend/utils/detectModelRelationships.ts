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

  // Enhanced: Filter out models that are empty, have only empty-named properties, or only key fields
  const validModels = models.filter(model => {
    if (!Array.isArray(model.properties) || model.properties.length === 0) return false;
    // At least one non-empty key field
    const hasValidKey = model.properties.some(
      prop => prop.isKey && prop.name && prop.name.trim() !== ""
    );
    // At least one non-key field (to avoid empty models with only keys)
    const hasNonKey = model.properties.some(
      prop => !prop.isKey && prop.name && prop.name.trim() !== ""
    );
    // At least one property must have a non-empty name
    const hasAnyNamed = model.properties.some(
      prop => prop.name && prop.name.trim() !== ""
    );
    return hasValidKey && hasAnyNamed;
  });

  // Compare each pair of models (prevent self-relation)
  for (let i = 0; i < validModels.length; i++) {
    for (let j = i + 1; j < validModels.length; j++) {
      const modelA = validModels[i];
      const modelB = validModels[j];
      if (modelA.id === modelB.id) continue; // Prevent self-relation

      // Extract only key fields from both models (isKey is true and name is not empty)
      const keyFieldsA = modelA.properties.filter(
        prop => prop.isKey && prop.name && prop.name.trim() !== ""
      );
      const keyFieldsB = modelB.properties.filter(
        prop => prop.isKey && prop.name && prop.name.trim() !== ""
      );

      // Find matching key fields (name and type must match exactly)
      const matches: { sourceField: string; targetField: string }[] = [];

      keyFieldsA.forEach(fieldA => {
        keyFieldsB.forEach(fieldB => {
          // Skip if types don't match or names are empty
          if (fieldA.dataType !== fieldB.dataType) return;
          if (!fieldA.name.trim() || !fieldB.name.trim()) return;

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

      // Only add relationship if both models have at least one key field and at least one non-key field
      const modelAHasNonKey = modelA.properties.some(
        prop => !prop.isKey && prop.name && prop.name.trim() !== ""
      );
      const modelBHasNonKey = modelB.properties.some(
        prop => !prop.isKey && prop.name && prop.name.trim() !== ""
      );

      // If we found matches and both models are not "empty" (have more than just keys), add relationship
      if (matches.length > 0 && modelAHasNonKey && modelBHasNonKey) {
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