import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { SocketProvider } from './contexts/SocketContext';
import App from './App';
import './index.css';

// ─── React Entry Point ───
// Wrapping order matters:
// 1. StrictMode — catches common mistakes in development
// 2. AuthProvider — provides user state to app
// 3. SocketProvider — provides realtime socket connection
// 4. BookingProvider — provides booking workflow state
// 5. BrowserRouter — enables client-side routing

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <BookingProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BookingProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
