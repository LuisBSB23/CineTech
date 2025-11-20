import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

interface SeatMapProps {
  sessaoId: number;
  occupiedCount: number; // Assentos ocupados no banco (backend)
  blockedSeats?: string[]; // Assentos que já estão no carrinho (bloqueio visual frontend)
  onSelectionChange: (selectedSeats: string[]) => void;
}

type SeatStatus = 'free' | 'occupied' | 'selected' | 'blocked';

export const SeatMap = ({ sessaoId, occupiedCount, blockedSeats = [], onSelectionChange }: SeatMapProps) => {
  const ROWS = 8;
  const COLS = 10;
  
  // Estado local apenas para os selecionados no momento
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Gera o ID do assento (ex: A1, B5)
  const getSeatId = (r: number, c: number) => {
    const rowLetter = String.fromCharCode(65 + r); // 65 = 'A'
    return `${rowLetter}${c + 1}`;
  };

  useEffect(() => {
    // Reseta seleção ao mudar de sessão
    setSelectedSeats([]);
    onSelectionChange([]);
  }, [sessaoId]);

  // Função auxiliar para determinar o status inicial de um assento
  const getSeatStatus = (r: number, c: number): SeatStatus => {
    const seatId = getSeatId(r, c);
    
    // Lógica para assentos ocupados vindos do Backend (quantidade simples)
    // Preenchemos sequencialmente (A1, A2...) baseado no occupiedCount
    // Isso é uma simulação visual já que o backend não guarda posição exata
    const flatIndex = r * COLS + c;
    if (flatIndex < occupiedCount) return 'occupied';

    // Lógica para assentos no Carrinho (Frontend)
    // Se o assento estiver na lista de blockedSeats, mostramos como ocupado/bloqueado
    if (blockedSeats.includes(seatId)) return 'blocked';

    // Lógica de seleção atual do usuário
    if (selectedSeats.includes(seatId)) return 'selected';

    return 'free';
  };

  const toggleSeat = (r: number, c: number) => {
    const seatId = getSeatId(r, c);
    const status = getSeatStatus(r, c);

    // Impede interação com assentos ocupados ou bloqueados pelo carrinho
    if (status === 'occupied' || status === 'blocked') return;

    let newSelected: string[];
    if (status === 'selected') {
      newSelected = selectedSeats.filter(id => id !== seatId);
    } else {
      newSelected = [...selectedSeats, seatId];
    }

    setSelectedSeats(newSelected);
    onSelectionChange(newSelected);
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      {/* Tela */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full mb-2" />
        <div className="h-12 w-full bg-gradient-to-b from-cyan-500/10 to-transparent transform -perspective-x-45 text-center text-xs text-cyan-500/50 flex items-end justify-center pb-2">
          TELA
        </div>
      </div>

      {/* Grid de Assentos */}
      <div className="grid gap-2 min-w-[300px] justify-center mx-auto" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          Array.from({ length: COLS }).map((_, colIndex) => {
            const status = getSeatStatus(rowIndex, colIndex);
            const seatId = getSeatId(rowIndex, colIndex);
            
            const isOccupiedOrBlocked = status === 'occupied' || status === 'blocked';

            return (
              <motion.button
                key={seatId}
                whileHover={{ scale: !isOccupiedOrBlocked ? 1.2 : 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSeat(rowIndex, colIndex)}
                disabled={isOccupiedOrBlocked}
                className={clsx(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg rounded-b-md text-[10px] flex items-center justify-center font-bold transition-colors shadow-sm",
                  status === 'free' && "bg-slate-700 hover:bg-slate-600 text-slate-400 cursor-pointer",
                  // Unificamos visualmente 'occupied' e 'blocked' como ocupados (vermelho escuro)
                  (status === 'occupied' || status === 'blocked') && "bg-red-900/40 text-red-700 cursor-not-allowed border border-red-900/20",
                  status === 'selected' && "bg-cyan-500 text-white shadow-cyan-500/50 shadow-md ring-2 ring-cyan-300/30"
                )}
                title={`Assento ${seatId} - ${status === 'free' ? 'Livre' : 'Ocupado'}`}
              >
                {(status === 'selected' || status === 'blocked') && <span className="scale-75">{seatId}</span>}
              </motion.button>
            );
          })
        ))}
      </div>

      {/* Legenda */}
      <div className="flex justify-center gap-6 mt-8 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-700 rounded" /> Livre
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-500 rounded shadow shadow-cyan-500/50" /> Selecionado
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-900/40 border border-red-900/20 rounded" /> Ocupado
        </div>
      </div>
    </div>
  );
};