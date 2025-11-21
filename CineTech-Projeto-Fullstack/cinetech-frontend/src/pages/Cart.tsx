import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle, Film, AlertCircle, Ticket, Trash2, Edit3 } from "lucide-react"; 
import { useCart } from "../context/CartContext";
import { Card, Button } from "../components/UiComponents";
import { type ItemReserva } from "../types/index";

export default function Cart() {
  const { reserva, checkout, clearCart, cancelOrder, error, loading, setError } = useCart();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await checkout();
      setSuccess(true);
    } catch (e) { /* Erro tratado no contexto */ }
  };

  const finish = () => {
    clearCart();
    navigate('/');
  };

  // Botão de editar: Navega para a página do filme para permitir alterações
  const handleEdit = (filmeId: number) => {
      navigate(`/filme/${filmeId}`);
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
          
          {reserva && (
            <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left max-h-60 overflow-y-auto custom-scrollbar border border-slate-700/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Seus Ingressos</h4>
              <div className="space-y-3">
                {reserva.itens.map((item: ItemReserva, idx: number) => (
                  <div key={idx} className="flex justify-between items-start border-b border-slate-700/50 last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="text-white font-medium text-sm">{item.sessao.filme.titulo}</p>
                      <p className="text-xs text-slate-400">
                         {new Date(item.sessao.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {item.sessao.sala.nome}
                      </p>
                    </div>
                    <div className="text-right">
                       {item.selectedSeats && item.selectedSeats.length > 0 ? (
                          <span className="text-cyan-400 font-mono text-xs font-bold bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20 block mt-1">
                            Assentos: {item.selectedSeats.join(', ')}
                          </span>
                       ) : (
                          <span className="text-slate-500 text-xs">{item.quantidade}x</span>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={finish} variant="success" className="w-full">Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  if (!reserva || reserva.itens.length === 0) {
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

  const total = reserva.valorTotal ?? reserva.itens.reduce((acc, item) => acc + (item.quantidade * item.sessao.valorIngresso), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in">
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
          {reserva.itens.map((item: ItemReserva, i: number) => (
            <Card key={i} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center group hover:border-slate-600 transition-colors relative">
              <div className="w-16 h-20 bg-slate-700 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
                <Film className="text-slate-500" size={32}/>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{item.sessao.filme.titulo}</h3>
                <div className="flex flex-wrap gap-3 text-sm mt-1">
                    <p className="text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                        {new Date(item.sessao.dataHora).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    <p className="text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        {item.sessao.sala.nome}
                    </p>
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                    <Ticket size={16} className="text-cyan-500" />
                    <span className="text-slate-300 text-sm">
                        {item.quantidade}x Ingressos 
                        {item.selectedSeats && item.selectedSeats.length > 0 && (
                            <span className="ml-2 font-mono text-xs bg-slate-800 px-2 py-1 rounded text-cyan-300 border border-slate-700">
                                {item.selectedSeats.join(', ')}
                            </span>
                        )}
                    </span>
                </div>
              </div>

              <div className="text-right self-end sm:self-center flex flex-col gap-2 items-end">
                <div>
                    <div className="text-slate-500 text-xs mb-1">Unitário: R$ {item.sessao.valorIngresso.toFixed(2)}</div>
                    <div className="font-bold text-white text-xl">
                    R$ {(item.quantidade * item.sessao.valorIngresso).toFixed(2)}
                    </div>
                </div>
                
                <Button 
                    variant="ghost" 
                    onClick={() => handleEdit(item.sessao.filme.id)}
                    className="text-xs h-8 px-3 bg-slate-800 hover:bg-cyan-900/30 text-cyan-400 border border-slate-700"
                >
                    <Edit3 size={12} className="mr-1" /> Editar / Trocar
                </Button>
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
                <div className="flex justify-between text-slate-400 text-sm">
                    <span>Taxa de Serviço</span>
                    <span>R$ 0.00</span>
                </div>
            </div>

            <div className="flex justify-between text-white font-bold text-2xl pt-4 border-t border-slate-700">
              <span>Total</span>
              <span className="text-emerald-400">R$ {total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3">
                <Button 
                    onClick={handleCheckout} 
                    isLoading={loading} 
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
                    <Trash2 size={16} /> Cancelar Pedido
                </Button>
            </div>

            <p className="text-xs text-center text-slate-500 mt-4">
                Ao confirmar, concorda com os termos de cancelamento.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}