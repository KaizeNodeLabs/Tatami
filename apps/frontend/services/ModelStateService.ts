import { Model } from "@/types/models";
import { Subject } from "rxjs";

class ModelStateService {
  private models: Model[] = [];
  private modelSubject = new Subject<Model[]>();
  
  // Observable to subscribe to model changes
  public models$ = this.modelSubject.asObservable();
  
  // Initialize the service by loading models
  async initialize() {
    try {
      // Start with empty models array to ensure a clean state
      this.setModels([]);
    } catch (error) {
      console.error("Error initializing ModelStateService:", error);
    }
  }
  
  getModels(): Model[] {
    return [...this.models]; // Return a copy to avoid mutation
  }
  
  // Update the models and notify subscribers
  async setModels(models: Model[]) {
    this.models = [...models];
    this.modelSubject.next(this.models);
    
    // Sync models
    try {
      await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ models: this.models }),
      });
    } catch (error) {
      console.error("Error saving models:", error);
      // Implment logic to handle errors
    }
  }
  
  // Auxiliary methods to interact with models
  async addModel(model: Model) {
    const updatedModels = [...this.models, model];
    await this.setModels(updatedModels);
  }
  
  async updateModel(modelId: string, updates: Partial<Model>) {
    const updatedModels = this.models.map(model => 
      model.id === modelId ? { ...model, ...updates } : model
    );
    await this.setModels(updatedModels);
  }
  
  async deleteModel(modelId: string) {
    const updatedModels = this.models.filter(model => model.id !== modelId);
    await this.setModels(updatedModels);
  }
}

// Export as singleton
export const modelStateService = new ModelStateService();
