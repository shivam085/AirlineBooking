import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ───
// We're keeping this simple for the UI phase.
// In Phase 3, this will be populated via real API calls.
const initialState = {
  user: null, // e.g., { id: '1', firstName: 'Jane', role: 'user' }
  token: null, // JWT token string
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ─── Auth Slice ───
// This manages the global authentication state.
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // These reducers are temporary "mock" actions for the UI phase.
    // In Phase 3, we'll replace these with extraReducers handling createAsyncThunk.
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
