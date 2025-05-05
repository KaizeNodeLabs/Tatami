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
  
  // Compare each pair of models
  for (let i = 0; i < models.length; i++) {
    for (let j = i + 1; j < models.length; j++) {
      const modelA = models[i];
      const modelB = models[j];
      
      // Extract only key fields from both models (isKey is true)
      const keyFieldsA = modelA.properties.filter(prop => prop.isKey);
      const keyFieldsB = modelB.properties.filter(prop => prop.isKey);
      
      // Find matching key fields
      const matches: { sourceField: string; targetField: string }[] = [];
      
      // For each key field in Model A, check if there's a matching key field in Model B
      keyFieldsA.forEach(fieldA => {
        keyFieldsB.forEach(fieldB => {
          // Check for exact field name match (e.g., beast_id to beast_id)
          if (fieldA.name === fieldB.name) {
            matches.push({
              sourceField: fieldA.name,
              targetField: fieldB.name
            });
          }
          // Check for common patterns like singular_id to plural
          // For example: beast_id to beasts, user_id to users
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