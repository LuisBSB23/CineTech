import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Film, Clock, Tag, Play } from "lucide-react";
import { motion } from "framer-motion";
import { getFilmes } from "../api";
import type { Filme } from "../types";
import { Card, Button, MovieCardSkeleton } from "../components/UiComponents";

const CATEGORIES = ["Todos", "Ação", "Sci-Fi", "Drama", "Aventura"];

export default function Home() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q")?.toLowerCase() || "";

  useEffect(() => {
    // Simula um loading um pouco maior para mostrar o Skeleton
    const timer = setTimeout(() => {
      getFilmes().then(setFilmes).finally(() => setLoading(false));
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Lógica de filtragem (Busca da Navbar + Tags Locais)
  const filteredFilmes = useMemo(() => {
    return filmes.filter(f => {
      const matchesSearch = f.titulo.toLowerCase().includes(searchTerm);
      // Simulação de categorias baseada no título/sinopse (já que a API mock não tem gênero)
      const mockGenre = f.titulo.includes("Duna") || f.titulo.includes("Interestelar") ? "Sci-Fi" : "Ação";
      const matchesCategory = activeFilter === "Todos" || mockGenre === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [filmes, searchTerm, activeFilter]);

  // Filme destaque (o primeiro da lista ou um fixo)
  const featuredMovie = filmes[1]; // Duna como exemplo

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Hero Section Imersiva */}
      {!loading && featuredMovie && !searchTerm && (
        <div className="relative w-full h-[500px] md:h-[600px] mb-12 overflow-hidden rounded-3xl shadow-2xl shadow-black mx-auto max-w-7xl">
          {/* Background com Overlay Gradiente */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              {/* Placeholder Visual para o Banner (Manteremos o genérico de cinema para o Hero, pois pôsteres são verticais) */}
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
            </div>
          </div>

          {/* Conteúdo do Hero */}
          <div className="absolute bottom-0 left-0 z-20 p-8 md:p-16 max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider border border-cyan-500/30 mb-4">
                EM DESTAQUE
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {featuredMovie.titulo}
              </h1>
              <p className="text-slate-300 text-lg md:text-xl mb-8 line-clamp-2 max-w-2xl">
                {featuredMovie.sinopse}
              </p>
              <div className="flex gap-4">
                <Link to={`/filme/${featuredMovie.id}`}>
                  <Button className="h-12 px-8 text-lg" variant="primary">
                    <Tag size={20} /> Reservar Agora
                  </Button>
                </Link>
                <Button className="h-12 px-8 text-lg" variant="secondary">
                  <Play size={20} /> Trailer
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Container Principal */}
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Filtros e Cabeçalho da Lista */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {searchTerm ? `Resultados para "${searchTerm}"` : "Em Cartaz"}
          </h2>
          
          {/* Tags de Filtro */}
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

        {/* Grid de Filmes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Skeletons
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
                    {/* Lógica de Imagem ou Placeholder */}
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
                    
                    {/* Botão flutuante no hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <Link to={`/filme/${filme.id}`}>
                        <Button className="rounded-full px-6">Ver Detalhes</Button>
                      </Link>
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