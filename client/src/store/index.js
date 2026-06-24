import { configureStore, createSlice } from '@reduxjs/toolkit';

// Temporary placeholder slice — prevents the "no valid reducer" warning.
// This will be removed once we add the auth slice in Step 6.
const placeholderSlice = createSlice({
  name: 'app',
  initialState: { initialized: true },
  reducers: {},
});

const store = configureStore({
  reducer: {
    app: placeholderSlice.reducer,
    // Slices will be added here as we build features:
    // auth: authReducer,
    // flights: flightsReducer,
    // bookings: bookingsReducer,
  },
});

export default store;
