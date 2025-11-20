import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { type Reserva, type Sessao, type ItemReserva } from '../types';
import { criarReserva, adicionarItem, confirmarReserva } from '../api';

interface CartContextType {
  reserva: Reserva | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  // Atualizado para aceitar a lista de assentos específicos
  addToCart: (sessao: Sessao, quantidade: number, selectedSeats: string[]) => Promise<void>;
  checkout: () => Promise<void>;
  clearCart: () => void;
  setError: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const USUARIO_ID = 1; 

  const addToCart = async (sessao: Sessao, quantidade: number, selectedSeats: string[]) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Reservando assentos...');

    try {
      let currentReserva = reserva;
      
      if (!currentReserva) {
        currentReserva = await criarReserva(USUARIO_ID);
        setReserva(currentReserva);
      }

      // O backend registra apenas a quantidade, mas o frontend guardará os IDs dos assentos no estado
      const novoItem = await adicionarItem(currentReserva.id, sessao.id, quantidade);

      setReserva((prev: Reserva | null) => {
        if (!prev) return null;
        
        const itensSeguros = prev.itens || [];
        const existingIdx = itensSeguros.findIndex((i: ItemReserva) => i.sessao.id === sessao.id);
        let newItens = [...itensSeguros];
        
        if (existingIdx >= 0) {
          // Se já existe item para essa sessão, soma a quantidade e combina os assentos
          const itemExistente = newItens[existingIdx];
          const assentosAtualizados = [
            ...(itemExistente.selectedSeats || []),
            ...selectedSeats
          ];
          
          newItens[existingIdx] = { 
            ...itemExistente, 
            quantidade: itemExistente.quantidade + quantidade,
            selectedSeats: assentosAtualizados
          };
        } else {
          // Novo item com os assentos selecionados
          newItens.push({ ...novoItem, sessao, selectedSeats });
        }
        
        const novoTotal = newItens.reduce((acc: number, i: ItemReserva) => acc + (i.sessao.valorIngresso * i.quantidade), 0);
        return { ...prev, itens: newItens, valorTotal: novoTotal };
      });

      toast.success('Adicionado ao carrinho!', { id: toastId });

    } catch (err: any) {
      const msg = err.response?.data || err.message || "Erro ao adicionar item";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    if (!reserva) return;
    setLoading(true);
    const toastId = toast.loading('Processando pagamento...');

    try {
      await confirmarReserva(reserva.id);
      toast.success('Compra realizada com sucesso!', { id: toastId });
      // Após sucesso, o clearCart será chamado pela UI ou redirecionamento
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : "Erro ao finalizar compra.";
      setError(msg);
      toast.error(msg, { id: toastId });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setReserva(null);
    setError(null);
  };

  const itemCount = reserva?.itens?.reduce((acc: number, i: ItemReserva) => acc + i.quantidade, 0) || 0;

  return (
    <CartContext.Provider value={{ reserva, loading, error, itemCount, addToCart, checkout, clearCart, setError }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
};