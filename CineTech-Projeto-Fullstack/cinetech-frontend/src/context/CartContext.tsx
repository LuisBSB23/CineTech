import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { type Reserva, type Sessao, type ItemReserva } from '../types';
import { 
  criarReserva, 
  adicionarItem, 
  atualizarItem, 
  removerItem as removerItemApi,
  confirmarReserva, 
  getReservaAberta, 
  cancelarReservaApi 
} from '../api/index';
import { useAuth } from './AuthContext';

interface CartContextType {
  reserva: Reserva | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  addToCart: (sessao: Sessao, quantidade: number, selectedSeats: string[]) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>; // Nova função
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

      // CORREÇÃO LÓGICA: Verifica se o item já existe no carrinho
      const existingItem = currentReserva.itens?.find(i => i.sessao.id === sessao.id);
      let novoItem: ItemReserva;

      if (existingItem) {
        // Se existe, ATUALIZA (sobrescreve) os assentos em vez de adicionar
        novoItem = await atualizarItem(existingItem.id, sessao.id, quantidade, selectedSeats);
      } else {
        // Se não existe, CRIA novo item
        novoItem = await adicionarItem(currentReserva.id, sessao.id, quantidade, selectedSeats);
      }

      setReserva((prev: Reserva | null) => {
        if (!prev) return null;
        
        const itensSeguros = prev.itens || [];
        const existingIdx = itensSeguros.findIndex((i: ItemReserva) => i.sessao.id === sessao.id);
        let newItens = [...itensSeguros];
        
        // Garante que os assentos venham como array para o frontend
        const processedItem = {
            ...novoItem,
            selectedSeats: novoItem.assentos ? novoItem.assentos.split(',') : selectedSeats
        };

        if (existingIdx >= 0) {
          newItens[existingIdx] = processedItem;
        } else {
          newItens.push({ ...processedItem, sessao }); // Sessão necessária para renderização imediata
        }
        
        const novoTotal = newItens.reduce((acc: number, i: ItemReserva) => acc + (i.sessao.valorIngresso * i.quantidade), 0);
        return { ...prev, itens: newItens, valorTotal: novoTotal };
      });

      toast.success(existingItem ? 'Assentos atualizados!' : 'Adicionado ao carrinho!', { id: toastId });

    } catch (err: any) {
      const msg = err.response?.data || err.message || "Erro ao adicionar item";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // NOVA FUNÇÃO: Remove item e atualiza estado local sem reload
  const removeItem = async (itemId: number) => {
    if (!reserva) return;
    setLoading(true);
    try {
        await removerItemApi(itemId);
        
        setReserva(prev => {
            if (!prev) return null;
            const newItens = prev.itens.filter(i => i.id !== itemId);
            const novoTotal = newItens.reduce((acc, i) => acc + (i.sessao.valorIngresso * i.quantidade), 0);
            return { ...prev, itens: newItens, valorTotal: novoTotal };
        });
        
    } catch (err) {
        throw err;
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
    <CartContext.Provider value={{ reserva, loading, error, itemCount, addToCart, removeItem, checkout, cancelOrder, clearCart, setError }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
};