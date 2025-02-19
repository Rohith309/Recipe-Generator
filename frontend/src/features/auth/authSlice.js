import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  registrationStatus: 'idle',
  registrationError: null,
  loginStatus: 'idle',
  loginError: null,
};

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await authService.register(userData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await authService.login(credentials);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registrationStatus = 'loading';
        state.registrationError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registrationStatus = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.registrationStatus = 'failed';
        state.registrationError = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loginStatus = 'loading';
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.loginError = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
