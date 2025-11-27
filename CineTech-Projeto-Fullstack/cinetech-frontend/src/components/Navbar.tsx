import { Film, ShoppingCart, User, Search, LogIn, UserPlus, LogOut } from "lucide-react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "./UiComponents";

export const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) setSearchParams(prev => { prev.set("q", term); return prev; });
    else setSearchParams(prev => { prev.delete("q"); return prev; });
  };

  // Proteção de clique no carrinho
  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
        e.preventDefault();
        navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.perfil === 'ADMIN';

  // MODIFICAÇÃO: Admin pode ver a busca (para filtrar a lista dele), mas não vê carrinho
  const shouldHideSearch = location.pathname === '/perfil' || (location.pathname === '/carrinho');

  // MODIFICAÇÃO: Desativar link da Home para Admin
  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAdmin) {
      e.preventDefault();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo - MODIFICAÇÃO: Admin não navega para home */}
        <Link 
          to="/" 
          onClick={handleLogoClick}
          className={`flex items-center gap-2 group shrink-0 ${isAdmin ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className={`bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg ${!isAdmin && 'group-hover:scale-105'} transition-transform shadow-lg shadow-cyan-500/20`}>
            <Film className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
            CineTech
          </span>
        </Link>

        {/* Busca */}
        {!shouldHideSearch && (
          <div className="flex-1 max-w-md hidden md:block animate-in fade-in zoom-in duration-300">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder={isAdmin ? "Filtrar lista de filmes..." : "Buscar filmes..."}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
        )}
        
        {shouldHideSearch && <div className="flex-1 md:block hidden" />}

        {/* Ações / Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
               <div className="flex items-center gap-3 mr-2">
                    <span className="text-xs text-slate-400 hidden lg:block">Olá, {user.nome.split(' ')[0]}</span>
                    <Link to="/perfil" className={`p-2 rounded-full transition-all hover:bg-slate-800 ${location.pathname === '/perfil' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'}`} title="Meu Perfil">
                        <User size={22} />
                    </Link>
               </div>

               {/* MODIFICAÇÃO: Carrinho oculto para Admin */}
               {!isAdmin && (
                 <Link to="/carrinho" onClick={handleCartClick} className={`relative p-2 rounded-full transition-all hover:bg-slate-800 ${location.pathname === '/carrinho' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'}`}>
                  <ShoppingCart size={22} />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-lg shadow-cyan-500/50 animate-in zoom-in">
                      {itemCount}
                    </span>
                  )}
                </Link>
               )}

              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-full transition-colors" title="Sair">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-sm hidden sm:flex">
                    <LogIn size={16} /> Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button variant="primary" className="text-sm h-9 px-4">
                    <UserPlus size={16} /> Cadastrar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Busca Mobile */}
      {!shouldHideSearch && (
        <div className="md:hidden px-4 pb-3 animate-in fade-in slide-in-from-top-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
               type="text"
               placeholder={isAdmin ? "Filtrar lista..." : "Buscar filmes..."}
               value={searchTerm}
               onChange={handleSearch}
               className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}
    </nav>
  );
};