import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recipes: [],
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    fetchRecipesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecipesSuccess: (state, action) => {
      state.recipes = action.payload;
      state.loading = false;
    },
    fetchRecipesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchRecipesStart, fetchRecipesSuccess, fetchRecipesFailure } = recipeSlice.actions;
export default recipeSlice.reducer;
