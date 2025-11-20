import { Film, ShoppingCart, User, Search } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // Sincroniza o input local com a URL (útil se navegar via voltar/avançar)
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term) {
      setSearchParams(prev => {
        prev.set("q", term);
        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.delete("q");
        return prev;
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20">
            <Film className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
            CineTech
          </span>
        </Link>

        {/* Busca (Centralizada) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar filmes..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <Link to="/perfil" className={`p-2 rounded-full transition-all hover:bg-slate-800 ${location.pathname === '/perfil' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'}`}>
            <User size={22} />
          </Link>

          <Link to="/carrinho" className={`relative p-2 rounded-full transition-all hover:bg-slate-800 ${location.pathname === '/carrinho' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'}`}>
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-lg shadow-cyan-500/50 animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Busca Mobile (aparece apenas em telas pequenas) */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
             type="text"
             placeholder="Buscar filmes..."
             value={searchTerm}
             onChange={handleSearch}
             className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </nav>
  );
};