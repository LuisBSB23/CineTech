import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle, Film, AlertCircle, Ticket, Trash2, Edit3, CreditCard, X } from "lucide-react"; 
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Card, Button } from "../components/UiComponents";
import { type ItemReserva, type Cartao } from "../types/index";
import { getCartoes, atualizarItem } from "../api"; 
import { toast } from "react-hot-toast";

export default function Cart() {
  const { reserva, checkout, clearCart, cancelOrder, removeItem, error, loading, setError } = useCart();
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [loadingCartoes, setLoadingCartoes] = useState(false);
  const [localReserva, setLocalReserva] = useState(reserva);

  useEffect(() => {
    setLocalReserva(reserva);
  }, [reserva]);

  useEffect(() => {
    if (user) {
        setLoadingCartoes(true);
        getCartoes(user.id)
            .then(data => {
                setCartoes(data);
                if (data.length > 0) {
                    setSelectedCardId(data[0].id);
                }
            })
            .catch(() => console.error("Erro ao buscar cartões"))
            .finally(() => setLoadingCartoes(false));
    }
  }, [user]);

  const handleCheckout = async () => {
    if (!selectedCardId) {
        setError("Selecione um cartão para pagamento.");
        return;
    }
    try {
      await checkout();
      setSuccess(true);
    } catch (e) { /* Erro tratado no contexto */ }
  };

  const finish = () => {
    clearCart();
    navigate('/');
  };

  const handleEdit = (e: React.MouseEvent, filmeId: number) => {
      e.stopPropagation(); 
      navigate(`/filme/${filmeId}`);
  };

  const handleRemoveSeat = async (e: React.MouseEvent, item: ItemReserva, seatToRemove: string) => {
    e.stopPropagation(); 
    e.preventDefault();

    const newSeats = item.selectedSeats ? item.selectedSeats.filter(s => s !== seatToRemove) : [];
    const newQuantity = newSeats.length;

    const toastId = toast.loading("Atualizando...");

    try {
        if (newQuantity === 0) {
            // A exclusão do item limpa completamente a referência de assentos no banco (TB_ITEM_RESERVA é deletada)
            await removeItem(item.id);
            toast.success("Item removido do carrinho.", { id: toastId });
        } else {
            await atualizarItem(item.id, item.sessao.id, newQuantity, newSeats);
            toast.success(`Assento ${seatToRemove} removido.`, { id: toastId });
            window.location.reload(); 
        }
    } catch (e) {
        toast.error("Erro ao atualizar item.", { id: toastId });
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, itemId: number) => {
      e.stopPropagation();
      const toastId = toast.loading("Removendo item...");
      try {
          // Garante a remoção completa da linha no banco
          await removeItem(itemId);
          toast.success("Item removido.", { id: toastId });
      } catch (e) {
          toast.error("Erro ao remover item.", { id: toastId });
      }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-emerald-500" />
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sucesso!</h2>
          <p className="text-slate-400 mb-6">Sua reserva foi confirmada. Bom filme!</p>
          <Button onClick={finish} variant="success" className="w-full">Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  if (!localReserva || localReserva.itens.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
          <ShoppingCart size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Carrinho Vazio</h2>
        <p className="text-slate-500 mb-6">Você ainda não escolheu nenhum filme.</p>
        <Button onClick={() => navigate('/')} className="mt-4">Ver Filmes em Cartaz</Button>
      </div>
    );
  }

  const total = localReserva.itens.reduce((acc, item) => acc + (item.quantidade * item.sessao.valorIngresso), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <ShoppingCart className="text-cyan-500"/> Finalizar Pedido
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-4">
          <AlertCircle size={24} />
          <div className="flex-1"><p>{error}</p></div>
          <button onClick={() => setError(null)} className="hover:bg-red-500/20 p-1 rounded">x</button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {localReserva.itens.map((item: ItemReserva, i: number) => (
            <Card key={i} className="p-5 flex flex-col gap-4 group hover:border-slate-600 transition-colors relative">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  {/* MODIFICAÇÃO 1: Exibir Imagem do Filme ou Placeholder */}
                  <div className="w-16 h-24 sm:w-20 sm:h-28 bg-slate-700 rounded-lg flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                    {item.sessao.filme.imagemUrl ? (
                        <img 
                            src={item.sessao.filme.imagemUrl} 
                            alt={item.sessao.filme.titulo} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Film className="text-slate-500" size={32}/>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-xl truncate">{item.sessao.filme.titulo}</h3>
                    <div className="flex flex-wrap gap-3 text-sm mt-2">
                        <p className="text-slate-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            {new Date(item.sessao.dataHora).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                        <p className="text-slate-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            {item.sessao.sala.nome}
                        </p>
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-center">
                    <div className="text-slate-500 text-xs mb-1">Unitário: R$ {item.sessao.valorIngresso.toFixed(2)}</div>
                    <div className="font-bold text-white text-2xl">
                        R$ {(item.quantidade * item.sessao.valorIngresso).toFixed(2)}
                    </div>
                  </div>
              </div>
                
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800 mt-2">
                    <div className="flex items-center gap-2 mr-auto">
                        <Ticket size={16} className="text-cyan-500" />
                        <span className="text-slate-300 text-sm font-medium">Assentos:</span>
                        <div className="flex flex-wrap gap-2">
                            {item.selectedSeats && item.selectedSeats.map(seat => (
                                <button 
                                    key={seat} 
                                    onClick={(e) => handleRemoveSeat(e, item, seat)}
                                    className="group/seat font-mono text-xs bg-slate-800 px-2 py-1 rounded text-cyan-300 border border-slate-700 flex items-center gap-1 hover:border-red-500/50 hover:bg-red-900/20 transition-colors cursor-pointer"
                                    title="Remover este assento"
                                >
                                    {seat}
                                    <X size={10} className="opacity-0 group-hover/seat:opacity-100 text-red-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={(e) => handleEdit(e, item.sessao.filme.id)}
                            className="text-xs h-8 px-3 bg-slate-800 hover:bg-cyan-900/30 text-cyan-400 border border-slate-700"
                        >
                            <Edit3 size={12} className="mr-1" /> Editar / Trocar
                        </Button>
                        <Button 
                            variant="ghost"
                            onClick={(e) => handleDeleteItem(e, item.id)}
                            className="text-xs h-8 w-8 p-0 bg-slate-800 hover:bg-red-900/30 text-red-400 border border-slate-700"
                            title="Excluir Filme do Carrinho"
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card className="p-6 sticky top-24 space-y-6 bg-slate-900/80 backdrop-blur-lg">
            <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-4">Resumo do Pedido</h3>
            
            <div className="space-y-2">
                <div className="flex justify-between text-slate-400 text-sm">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex justify-between text-white font-bold text-2xl pt-4 border-t border-slate-700">
              <span>Total</span>
              <span className="text-emerald-400">R$ {total.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-700 pt-4">
                <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <CreditCard size={16} className="text-cyan-500" /> Método de Pagamento
                </h4>
                
                {loadingCartoes ? (
                    <p className="text-xs text-slate-500">Carregando cartões...</p>
                ) : cartoes.length > 0 ? (
                    <div className="space-y-2">
                        {cartoes.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedCardId(c.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                                    selectedCardId === c.id 
                                    ? "bg-cyan-900/20 border-cyan-500 ring-1 ring-cyan-500/50" 
                                    : "bg-slate-950 border-slate-800 hover:border-slate-600"
                                }`}
                            >
                                <div className={`w-8 h-5 rounded bg-gradient-to-br ${selectedCardId === c.id ? 'from-cyan-600 to-blue-600' : 'from-slate-700 to-slate-600'} flex items-center justify-center text-[8px] font-bold text-white/80`}>
                                    {c.tipo === 'CREDITO' ? 'CR' : 'DB'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-white">•••• {c.numero.slice(-4)}</p>
                                </div>
                                {selectedCardId === c.id && <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-3 bg-slate-950 rounded-lg border border-slate-800 border-dashed">
                        <p className="text-xs text-slate-500 mb-2">Nenhum cartão salvo.</p>
                        <Button onClick={() => navigate('/perfil')} className="w-full h-8 text-xs" variant="secondary">
                            Adicionar no Perfil
                        </Button>
                    </div>
                )}
            </div>
            
            <div className="space-y-3 pt-2">
                <Button 
                    onClick={handleCheckout} 
                    isLoading={loading} 
                    disabled={!selectedCardId}
                    variant="success" 
                    className="w-full h-14 text-lg shadow-lg shadow-emerald-900/20"
                >
                    Confirmar Compra
                </Button>

                <Button 
                    onClick={cancelOrder}
                    isLoading={loading}
                    variant="outline"
                    className="w-full text-red-400 border-red-900/50 hover:bg-red-950/30 hover:border-red-800 hover:text-red-300"
                >
                    <Trash2 size={16} /> Esvaziar Carrinho
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}