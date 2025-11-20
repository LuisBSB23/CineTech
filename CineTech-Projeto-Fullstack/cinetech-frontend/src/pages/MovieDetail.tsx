import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, ChevronLeft, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFilmes, getSessoes } from "../api";
import type { Filme, Sessao } from "../types";
import { useCart } from "../context/CartContext";
import { Card, Button, MovieCardSkeleton } from "../components/UiComponents";
import { SeatMap } from "../components/SeatMap";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessaoId, setSelectedSessaoId] = useState<number | null>(null);
  const [seatCount, setSeatCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [filmesRes, sessoesRes] = await Promise.all([getFilmes(), getSessoes(Number(id))]);
        setFilme(filmesRes.find(f => f.id === Number(id)) || null);
        setSessoes(sessoesRes);
        if (sessoesRes.length > 0) setSelectedSessaoId(sessoesRes[0].id);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    const sessao = sessoes.find(s => s.id === selectedSessaoId);
    if (sessao && seatCount > 0) {
      await addToCart(sessao, seatCount);
      setSeatCount(0); // Reseta seleção
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-8"><MovieCardSkeleton /></div>;
  if (!filme) return <div className="p-20 text-center text-white">Filme não encontrado.</div>;

  const activeSessao = sessoes.find(s => s.id === selectedSessaoId);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <button onClick={() => navigate('/')} className="group flex items-center text-slate-400 hover:text-cyan-400 mb-6 transition-colors px-4">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <div className="grid md:grid-cols-3 gap-8 px-4">
        {/* Coluna Esquerda: Info do Filme */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/10 border border-slate-800">
             <div className="bg-slate-800 aspect-[2/3] flex items-center justify-center">
                <Info className="text-slate-600" size={64} />
                {/* Aqui iria o poster real */}
             </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{filme.titulo}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                <Clock size={14} className="text-cyan-500"/> {filme.duracaoMinutos} min
              </span>
              <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">Sci-Fi</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">{filme.sinopse}</p>
          </div>
        </div>

        {/* Coluna Direita: Seleção de Sessão e Assentos */}
        <div className="md:col-span-2">
          <Card className="p-6 bg-slate-900/50 backdrop-blur-md border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="text-cyan-500"/> Selecione a Sessão
            </h2>

            {/* Tabs de Sessões */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-slate-700">
              {sessoes.map(sessao => {
                 const isSelected = sessao.id === selectedSessaoId;
                 return (
                  <button
                    key={sessao.id}
                    onClick={() => { setSelectedSessaoId(sessao.id); setSeatCount(0); }}
                    className={`flex flex-col items-center p-3 rounded-xl border min-w-[100px] transition-all ${
                      isSelected 
                        ? "bg-cyan-600/20 border-cyan-500 text-white shadow-lg shadow-cyan-900/20" 
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-lg font-bold">{new Date(sessao.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="text-xs uppercase mt-1">{sessao.sala.nome}</span>
                  </button>
                 );
              })}
            </div>

            {/* Mapa de Assentos */}
            <AnimatePresence mode="wait">
              {activeSessao && (
                <motion.div
                  key={activeSessao.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 mb-6"
                >
                  <SeatMap 
                    sessaoId={activeSessao.id} 
                    // CORREÇÃO: Acessando capacidadeTotal através do objeto 'sala'
                    occupiedCount={activeSessao.sala.capacidadeTotal - activeSessao.assentosDisponiveis} 
                    onSelectionChange={setSeatCount} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Footer de Ação */}
            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total a pagar</p>
                <p className="text-3xl font-bold text-white">
                  R$ {activeSessao ? (activeSessao.valorIngresso * seatCount).toFixed(2) : "0.00"}
                </p>
                <p className="text-xs text-slate-500">{seatCount} ingressos selecionados</p>
              </div>

              <Button 
                onClick={handleAddToCart} 
                disabled={seatCount === 0} 
                variant="success"
                className="w-full sm:w-auto h-12 px-8 text-lg shadow-emerald-900/20"
              >
                Confirmar Assentos
              </Button>
            </div>

          </Card>
        </div>
      </div>
    </motion.div>
  );
}