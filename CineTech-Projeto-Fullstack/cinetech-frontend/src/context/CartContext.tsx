import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { type Reserva, type Sessao, type ItemReserva } from '../types';
import { criarReserva, adicionarItem, confirmarReserva, getReservaAberta, cancelarReservaApi } from '../api/index';
import { useAuth } from './AuthContext';

interface CartContextType {
  reserva: Reserva | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  addToCart: (sessao: Sessao, quantidade: number, selectedSeats: string[]) => Promise<void>;
  checkout: () => Promise<void>;
  cancelOrder: () => Promise<void>;
  clearCart: () => void;
  setError: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
        setLoading(true);
        getReservaAberta(user.id)
            .then(data => {
                if (data.itens && (data.valorTotal === null || data.valorTotal === undefined)) {
                    const totalCalculado = data.itens.reduce((acc, item) => acc + (item.quantidade * item.sessao.valorIngresso), 0);
                    data.valorTotal = totalCalculado;
                }
                
                // CORREÇÃO ERRO VISUAL: Transforma string 'A1,A2' do banco em array ['A1', 'A2']
                // para o frontend exibir corretamente ao recarregar
                if (data.itens) {
                    data.itens = data.itens.map(item => ({
                        ...item,
                        selectedSeats: item.assentos ? item.assentos.split(',') : []
                    }));
                }

                setReserva(data);
            })
            .catch(() => {
                setReserva(null);
            })
            .finally(() => setLoading(false));
    } else {
        setReserva(null);
    }
  }, [user]);

  const addToCart = async (sessao: Sessao, quantidade: number, selectedSeats: string[]) => {
    if (!user) {
        toast.error("Precisa de iniciar sessão para reservar.");
        return;
    }

    setLoading(true);
    setError(null);
    const toastId = toast.loading('A reservar lugares...');

    try {
      let currentReserva = reserva;
      
      if (!currentReserva) {
        currentReserva = await criarReserva(user.id);
        setReserva(currentReserva);
      }

      const novoItem = await adicionarItem(currentReserva.id, sessao.id, quantidade, selectedSeats);

      setReserva((prev: Reserva | null) => {
        if (!prev) return null;
        
        const itensSeguros = prev.itens || [];
        const existingIdx = itensSeguros.findIndex((i: ItemReserva) => i.sessao.id === sessao.id);
        let newItens = [...itensSeguros];
        
        if (existingIdx >= 0) {
          newItens[existingIdx] = { 
            ...novoItem,
            selectedSeats: novoItem.assentos ? novoItem.assentos.split(',') : selectedSeats
          };
        } else {
          newItens.push({ 
            ...novoItem, 
            sessao, 
            selectedSeats: novoItem.assentos ? novoItem.assentos.split(',') : selectedSeats 
          });
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
    const toastId = toast.loading('A processar pagamento...');

    try {
      await confirmarReserva(reserva.id);
      toast.success('Compra realizada com sucesso!', { id: toastId });
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : "Erro ao finalizar compra.";
      setError(msg);
      toast.error("Erro na compra: " + msg, { id: toastId, duration: 5000 });
      
      // Se der erro de conflito (409) ou esgotado (400), limpa o carrinho local
      if (err.response?.status === 409 || err.response?.status === 400) {
           setReserva(null); 
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!reserva) return;
    setLoading(true);
    try {
        await cancelarReservaApi(reserva.id);
        setReserva(null);
        toast.success("Pedido cancelado e carrinho limpo.");
    } catch (err) {
        toast.error("Erro ao cancelar pedido.");
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
    <CartContext.Provider value={{ reserva, loading, error, itemCount, addToCart, checkout, cancelOrder, clearCart, setError }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
};