import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

// ─── Root Component ───
// Layout: Navbar (always visible) → Page Content → Footer (always visible)
// BrowserRouter wraps this in main.jsx

import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
