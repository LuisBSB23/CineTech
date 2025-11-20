import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

interface SeatMapProps {
  sessaoId: number;
  occupiedCount: number; // Número exato de assentos ocupados vindo do backend
  onSelectionChange: (count: number) => void;
}

// Estados do assento
type SeatStatus = 'free' | 'occupied' | 'selected';

export const SeatMap = ({ sessaoId, occupiedCount, onSelectionChange }: SeatMapProps) => {
  // Configuração para 80 assentos (8 fileiras x 10 colunas)
  const ROWS = 8;
  const COLS = 10;
  
  const [grid, setGrid] = useState<SeatStatus[][]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const newGrid: SeatStatus[][] = [];
    // Contador para preencher os assentos ocupados sequencialmente
    // (Já que o backend não guarda a posição exata, preenchemos os primeiros N assentos)
    let currentOccupied = 0;

    for (let i = 0; i < ROWS; i++) {
      const row: SeatStatus[] = [];
      for (let j = 0; j < COLS; j++) {
        // Se ainda precisamos marcar assentos como ocupados, marca este
        const isOccupied = currentOccupied < occupiedCount;
        
        if (isOccupied) {
          currentOccupied++;
          row.push('occupied');
        } else {
          row.push('free');
        }
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setSelectedCount(0);
    onSelectionChange(0);
  }, [sessaoId, occupiedCount]); // Recarrega se a sessão ou a ocupação mudar

  const toggleSeat = (r: number, c: number) => {
    if (grid[r][c] === 'occupied') return;

    const newGrid = [...grid];
    // Cria uma cópia da linha para evitar mutação direta do estado aninhado
    newGrid[r] = [...newGrid[r]]; 
    
    const isSelected = newGrid[r][c] === 'selected';
    newGrid[r][c] = isSelected ? 'free' : 'selected';
    
    setGrid(newGrid);
    
    const newCount = isSelected ? selectedCount - 1 : selectedCount + 1;
    setSelectedCount(newCount);
    onSelectionChange(newCount);
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
        {grid.map((row, rowIndex) => (
          row.map((status, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              whileHover={{ scale: status !== 'occupied' ? 1.2 : 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleSeat(rowIndex, colIndex)}
              disabled={status === 'occupied'}
              className={clsx(
                "w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg rounded-b-md text-[10px] flex items-center justify-center font-bold transition-colors shadow-sm",
                status === 'free' && "bg-slate-700 hover:bg-slate-600 text-slate-400 cursor-pointer",
                status === 'occupied' && "bg-red-900/40 text-red-700 cursor-not-allowed border border-red-900/20",
                status === 'selected' && "bg-cyan-500 text-white shadow-cyan-500/50 shadow-md ring-2 ring-cyan-300/30"
              )}
              title={`Fileira ${String.fromCharCode(65 + rowIndex)}, Assento ${colIndex + 1}`}
            >
              {/* Mostra identificação apenas se selecionado */}
              {status === 'selected' && <span className="scale-75">{String.fromCharCode(65 + rowIndex)}{colIndex + 1}</span>}
            </motion.button>
          ))
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