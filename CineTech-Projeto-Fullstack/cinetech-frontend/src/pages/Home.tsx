import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Film, Clock, Tag, ChevronLeft, ChevronRight,} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFilmes } from "../api";
import type { Filme } from "../types";
import { Card, Button, MovieCardSkeleton } from "../components/UiComponents";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Todos", "Ação", "Sci-Fi", "Drama", "Aventura"];

export default function Home() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  // Estado para o Carrossel
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q")?.toLowerCase() || "";
  
  // Hooks para Proteção
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      getFilmes().then(setFilmes).finally(() => setLoading(false));
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Lógica do Carrossel (5 primeiros filmes)
  const heroMovies = useMemo(() => filmes.slice(0, 5), [filmes]);

  // Rotação automática do carrossel
  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000); // Muda a cada 6 segundos
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const nextSlide = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
  };

  const prevSlide = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  // Proteção de Rotas
  const handleProtectedAction = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!user) {
        navigate("/login");
    } else {
        navigate(path);
    }
  };

  const filteredFilmes = useMemo(() => {
    return filmes.filter(f => {
      const matchesSearch = f.titulo.toLowerCase().includes(searchTerm);
      const mockGenre = f.titulo.includes("Duna") || f.titulo.includes("Interestelar") ? "Sci-Fi" : "Ação";
      const matchesCategory = activeFilter === "Todos" || mockGenre === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [filmes, searchTerm, activeFilter]);

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Carrossel Hero Section */}
      {!loading && heroMovies.length > 0 && !searchTerm && (
        <div className="relative w-full h-[500px] md:h-[600px] mb-12 overflow-hidden rounded-3xl shadow-2xl shadow-black mx-auto max-w-7xl group">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={heroMovies[currentHeroIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
                {/* Imagem de Fundo */}
                <div className="absolute inset-0">
                    {heroMovies[currentHeroIndex].imagemUrl ? (
                        <img 
                            src={heroMovies[currentHeroIndex].imagemUrl} 
                            alt={heroMovies[currentHeroIndex].titulo}
                            className="w-full h-full object-cover object-center opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />
                </div>

                {/* Conteúdo do Filme */}
                <div className="absolute bottom-0 left-0 z-20 p-8 md:p-16 max-w-3xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider border border-cyan-500/30 mb-4 backdrop-blur-md">
                            EM DESTAQUE
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            {heroMovies[currentHeroIndex].titulo}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-slate-300 mb-6 text-sm font-medium">
                            <span className="flex items-center gap-1">
                                <Clock size={16} className="text-cyan-500"/> 
                                {heroMovies[currentHeroIndex].duracaoMinutos} min
                            </span>
                            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                            <span>{heroMovies[currentHeroIndex].generos?.split(',')[0] || 'Cinema'}</span>
                        </div>

                        <p className="text-slate-200 text-lg md:text-xl mb-8 line-clamp-2 max-w-2xl drop-shadow-md">
                            {heroMovies[currentHeroIndex].sinopse}
                        </p>
                        
                        <div className="flex gap-4">
                            <Button 
                                onClick={(e) => handleProtectedAction(e, `/filme/${heroMovies[currentHeroIndex].id}`)} 
                                className="h-12 px-8 text-lg shadow-cyan-500/20" 
                                variant="primary"
                            >
                                <Tag size={20} /> Reservar Agora
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles de Navegação */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white border border-white/10 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white border border-white/10 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={32} />
          </button>

          {/* Indicadores (Bolinhas) */}
          <div className="absolute bottom-6 right-8 z-30 flex gap-2">
            {heroMovies.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                        currentHeroIndex === idx ? "w-8 bg-cyan-500" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                />
            ))}
          </div>
        </div>
      )}

      {/* Container Principal (Grid de Filmes) */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {searchTerm ? `Resultados para "${searchTerm}"` : "Em Cartaz"}
          </h2>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                  activeFilter === cat 
                    ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-900/20" 
                    : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <MovieCardSkeleton key={i} />)
          ) : filteredFilmes.length > 0 ? (
            filteredFilmes.map((filme, index) => (
              <motion.div
                key={filme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="flex flex-col group h-full">
                  <div className="h-[400px] bg-slate-800 flex items-center justify-center relative overflow-hidden">
                    {filme.imagemUrl ? (
                      <img 
                        src={filme.imagemUrl} 
                        alt={filme.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                        <Film size={48} className="text-slate-600 group-hover:scale-110 group-hover:text-cyan-500 transition-all duration-500" />
                      </>
                    )}
                    
                    {/* Botão flutuante */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <Button onClick={(e) => handleProtectedAction(e, `/filme/${filme.id}`)} className="rounded-full px-6">Ver Detalhes</Button>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                        {filme.titulo}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><Clock size={14} className="text-cyan-500"/> {filme.duracaoMinutos} min</span>
                      <span className="px-1.5 py-0.5 border border-slate-700 rounded">Legendado</span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">{filme.sinopse}</p>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">
              Nenhum filme encontrado com esses critérios.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}