import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, ChevronLeft, Info, MapPin, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Corrigindo os caminhos de importação
import { getFilmes, getSessoes } from "../api/index";
import type { Filme, Sessao } from "../types/index";
import { useCart } from "../context/CartContext";
import { Card, Button, MovieCardSkeleton } from "../components/UiComponents";
import { SeatMap } from "../components/SeatMap";

// Lista fixa de salas conforme o banco de dados (data.sql)
const ALL_ROOMS = [
  { id: 1, nome: "Sala 1 - IMAX" },
  { id: 2, nome: "Sala 2 - VIP" },
  { id: 3, nome: "Sala 3 - Padrão" }
];

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, reserva } = useCart(); // Pegamos a reserva para verificar itens no carrinho
  
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessaoId, setSelectedSessaoId] = useState<number | null>(null);
  
  // Agora armazenamos os IDs dos assentos (strings)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [filmesRes, sessoesRes] = await Promise.all([getFilmes(), getSessoes(Number(id))]);
        setFilme(filmesRes.find(f => f.id === Number(id)) || null);
        setSessoes(sessoesRes);
        
        // Seleciona automaticamente a primeira sessão disponível se houver
        if (sessoesRes.length > 0) {
            setSelectedSessaoId(null); // Deixa o utilizador escolher explicitamente
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    const sessao = sessoes.find(s => s.id === selectedSessaoId);
    if (sessao && selectedSeats.length > 0) {
      await addToCart(sessao, selectedSeats.length, selectedSeats);
      setSelectedSeats([]); // Reseta seleção local
    }
  };

  // Recupera assentos já adicionados ao carrinho para a sessão atual (bloqueio visual)
  const getBlockedSeatsForSession = (sessaoId: number): string[] => {
    if (!reserva || !reserva.itens) return [];
    const item = reserva.itens.find(i => i.sessao.id === sessaoId);
    return item?.selectedSeats || [];
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
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/10 border border-slate-800 bg-slate-800">
             <div className="aspect-[2/3] flex items-center justify-center relative">
                {filme.imagemUrl ? (
                  <img 
                    src={filme.imagemUrl} 
                    alt={filme.titulo} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Info className="text-slate-600" size={64} />
                )}
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

            {/* Grid de Salas (Modificação 1) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {ALL_ROOMS.map(room => {
                 // Verifica se existe sessão para este filme nesta sala
                 const sessionInRoom = sessoes.find(s => s.sala.id === room.id);
                 const isSelected = sessionInRoom && sessionInRoom.id === selectedSessaoId;
                 const isDisabled = !sessionInRoom;

                 return (
                  <button
                    key={room.id}
                    onClick={() => {
                        if (sessionInRoom) {
                            setSelectedSessaoId(sessionInRoom.id);
                            setSelectedSeats([]);
                        }
                    }}
                    disabled={isDisabled}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all min-h-[100px] ${
                      isSelected 
                        ? "bg-cyan-600/20 border-cyan-500 text-white shadow-lg shadow-cyan-900/20 z-10 ring-1 ring-cyan-500" 
                        : isDisabled
                            ? "bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed opacity-60"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-500 hover:text-white"
                    }`}
                  >
                    {sessionInRoom ? (
                        <>
                            <span className="text-xl font-bold mb-1">
                                {new Date(sessionInRoom.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <MapPin size={10} /> {room.nome}
                            </span>
                        </>
                    ) : (
                        <>
                            <Ban size={24} className="mb-2 opacity-40" />
                            <span className="text-[10px] uppercase text-center">{room.nome}</span>
                            <span className="text-[9px] text-slate-600 mt-1">Indisponível</span>
                        </>
                    )}
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
                    occupiedCount={activeSessao.sala.capacidadeTotal - activeSessao.assentosDisponiveis} 
                    // Modificação 3: Passamos os assentos que já estão no carrinho para bloqueá-los
                    blockedSeats={getBlockedSeatsForSession(activeSessao.id)}
                    onSelectionChange={setSelectedSeats} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Footer de Ação */}
            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total a pagar</p>
                <p className="text-3xl font-bold text-white">
                  R$ {activeSessao ? (activeSessao.valorIngresso * selectedSeats.length).toFixed(2) : "0.00"}
                </p>
                <p className="text-xs text-slate-500">
                    {selectedSeats.length} ingressos selecionados
                    {selectedSeats.length > 0 && <span className="text-cyan-500 font-mono ml-1">({selectedSeats.join(', ')})</span>}
                </p>
              </div>

              <Button 
                onClick={handleAddToCart} 
                disabled={selectedSeats.length === 0} 
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