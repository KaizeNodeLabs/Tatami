import type { Model, Property } from "@/types/models";

export function generateCairoCode(models: Model[]): string {
  if (!models.length) return "// No models created yet";
  
  return models
    .map(
      (model) => {
        const traitsString = model.traits && model.traits.length 
          ? `#[derive(${model.traits.join(', ')})]` 
          : '';
        
        return `${traitsString}\n#[dojo::model]\npub struct ${model.name} {${model.properties
          .map(
            (prop: Property) =>
              `    ${prop.isKey ? "\n    #[key]" : ""}\n    pub ${prop.name}: ${prop.dataType},`,
          )
          .join("")} \n} `;
      }
    )
    .join("\n");
}