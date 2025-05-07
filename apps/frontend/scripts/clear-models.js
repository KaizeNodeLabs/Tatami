/**
 * This script clears the models.json file, removing all existing models
 * but keeping the structure intact. This ensures the application starts
 * with a clean state for model relationships.
 */

const fs = require('fs');
const path = require('path');

const MODELS_JSON_PATH = path.join(process.cwd(), 'public', 'models.json');

function clearModelsJson() {
  try {
    // Create empty models structure
    const emptyModels = {
      models: []
    };

    // Write empty models to file
    fs.writeFileSync(MODELS_JSON_PATH, JSON.stringify(emptyModels, null, 2));
    console.log('✅ models.json has been cleared. The application will start with no models.');
  } catch (error) {
    console.error('❌ Error clearing models.json:', error);
    process.exit(1);
  }
}

// Execute when run directly
if (require.main === module) {
  clearModelsJson();
}

module.exports = clearModelsJson; 