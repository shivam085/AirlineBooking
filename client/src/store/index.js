import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// ─── Central Redux Store ───
// This is the global state container for the entire application.
// We combine individual "slices" of state here.

const store = configureStore({
  reducer: {
    auth: authReducer,
    // flights: flightsReducer (will add in Phase 4)
    // bookings: bookingsReducer (will add in Phase 6)
  },
});

export default store;
