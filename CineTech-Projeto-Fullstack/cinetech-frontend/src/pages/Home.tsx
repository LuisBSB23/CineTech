import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Film, Clock } from "lucide-react";
import { getFilmes } from "../api";
import type { Filme } from "../types"; // Correção: 'import type'
import { Card, Button } from "../components/UiComponents";

export default function Home() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilmes().then(setFilmes).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20 text-cyan-500">Carregando...</div>;

  return (
    <div className="animate-fade-in">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-white mb-2">Em Cartaz</h1>
        <p className="text-slate-400">Escolha seu filme e viva a experiência CineTech.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filmes.map(filme => (
          <Card key={filme.id} className="flex flex-col group">
            <div className="h-48 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
              <Film size={64} className="text-slate-600 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{filme.titulo}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-slate-700 rounded text-slate-300 border border-slate-600 flex items-center gap-1">
                  <Clock size={12}/> {filme.duracaoMinutos} min
                </span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">{filme.sinopse}</p>
              <Link to={`/filme/${filme.id}`}>
                <Button className="w-full">Ver Sessões</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}