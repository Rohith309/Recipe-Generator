import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Async thunks
export const fetchRecipes = createAsyncThunk(
  'recipe/fetchRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recipes/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch recipes');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipe/fetchRecipeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch recipe');
    }
  }
);

export const createRecipe = createAsyncThunk(
  'recipe/createRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/recipes/', recipeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create recipe');
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipe/updateRecipe',
  async ({ id, recipe }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/recipes/${id}/`, recipe);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update recipe');
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipe/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/recipes/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete recipe');
    }
  }
);

export const generateRecipe = createAsyncThunk(
  'recipe/generateRecipe',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await api.post('/generate/', { ingredients });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to generate recipe');
    }
  }
);

const initialState = {
  recipes: [],
  currentRecipe: null,
  generatedRecipe: null,
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGeneratedRecipe: (state) => {
      state.generatedRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Recipe
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Recipe
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes.push(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Recipe
      .addCase(updateRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = state.recipes.map(recipe =>
          recipe.id === action.payload.id ? action.payload : recipe
        );
        state.currentRecipe = action.payload;
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
        state.currentRecipe = null;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate Recipe
      .addCase(generateRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedRecipe = action.payload;
      })
      .addCase(generateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearGeneratedRecipe } = recipeSlice.actions;
export default recipeSlice.reducer; 