import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';

// ─── React Entry Point ───
// Wrapping order matters:
// 1. StrictMode — catches common mistakes in development
// 2. Provider — gives Redux store access to all components
// 3. BrowserRouter — enables client-side routing

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
