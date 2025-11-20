import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile'; // Nova rota

// Componente para gerenciar transições de rota
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/filme/:id" element={<PageWrapper><MovieDetail /></PageWrapper>} />
        <Route path="/carrinho" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/perfil" element={<PageWrapper><Profile /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

// Wrapper para animação padrão de página
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans selection:bg-cyan-500/30">
          <Navbar />
          <main className="pt-6">
             <AnimatedRoutes />
          </main>
          
          {/* Configuração Global dos Toasts */}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: {
                  primary: '#06b6d4', // Cyan-500
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;