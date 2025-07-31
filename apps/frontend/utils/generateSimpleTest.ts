import { Model } from "@/types/models";

export const generateSimpleTest = (model: Model): string => {
  const modelName = model.name;
  const properties = model.properties;

  const propertyAssertions = properties
    .map(
      (prop) =>
        `        assert(${modelName.toLowerCase()}_state.get_${
          prop.name
        }() == 0, '${prop.name} should be 0');`
    )
    .join("\n");

  const testCode = `
#[cfg(test)]
mod tests {
    use super::{${modelName}, I${modelName}};

    #[test]
    #[available_gas(2000000)]
    fn test_${modelName.toLowerCase()}_creation() {
        // Setup
        let mut ${modelName.toLowerCase()}_state = I${modelName}::new();

        // Assertions
${propertyAssertions}
    }
}
`;

  return testCode;
};
