import api from '../utils/axios';

export const recipeService = {
  // Get all recipes
  async getAllRecipes() {
    const response = await api.get('/recipes/');
    return response.data;
  },

  // Get single recipe
  async getRecipeById(id) {
    const response = await api.get(`/recipes/${id}/`);
    return response.data;
  },

  // Create new recipe
  async createRecipe(recipeData) {
    const response = await api.post('/recipes/', recipeData);
    return response.data;
  },

  // Update recipe
  async updateRecipe(id, recipeData) {
    const response = await api.put(`/recipes/${id}/`, recipeData);
    return response.data;
  },

  // Delete recipe
  async deleteRecipe(id) {
    await api.delete(`/recipes/${id}/`);
    return id;
  },

  // Generate recipe from ingredients
  async generateRecipe(ingredients) {
    const response = await api.post('/generate/', { ingredients });
    return response.data;
  },

  // Save generated recipe
  async saveGeneratedRecipe(recipeData) {
    const response = await api.post('/save-generated/', recipeData);
    return response.data;
  }
}; 