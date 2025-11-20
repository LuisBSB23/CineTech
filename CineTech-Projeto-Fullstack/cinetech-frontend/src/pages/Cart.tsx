import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle, Film, AlertCircle } from "lucide-react"; // Removido Trash2
import { useCart } from "../context/CartContext";
import { Card, Button } from "../components/UiComponents";
import { type ItemReserva } from "../types"; // Importado tipo para usar no map

export default function Cart() {
  const { reserva, checkout, clearCart, error, loading, setError } = useCart();
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

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sucesso!</h2>
          <p className="text-slate-400 mb-6">Sua reserva foi confirmada. Bom filme!</p>
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
        <Button onClick={() => navigate('/')} className="mt-4">Ver Filmes</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <ShoppingCart className="text-cyan-500"/> Finalizar Pedido
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-4">
          <AlertCircle size={24} />
          <div className="flex-1"><p>{error}</p></div>
          <button onClick={() => setError(null)}>x</button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Correção: Tipagem explicita para 'item' e 'i' */}
          {reserva.itens.map((item: ItemReserva, i: number) => (
            <Card key={i} className="p-4 flex gap-4 items-center">
              <div className="w-12 h-16 bg-slate-700 rounded flex items-center justify-center shrink-0"><Film className="text-slate-500"/></div>
              <div className="flex-1">
                <h3 className="text-white font-bold">{item.sessao.filme.titulo}</h3>
                <p className="text-slate-400 text-sm">{new Date(item.sessao.dataHora).toLocaleString()} • {item.sessao.sala.nome}</p>
                <div className="text-cyan-400 text-sm mt-1">{item.quantidade}x R$ {item.sessao.valorIngresso.toFixed(2)}</div>
              </div>
              <div className="text-right font-bold text-white text-lg">
                R$ {(item.quantidade * item.sessao.valorIngresso).toFixed(2)}
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card className="p-6 sticky top-24 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-4">Resumo</h3>
            <div className="flex justify-between text-slate-300"><span>Subtotal</span><span>R$ {reserva.valorTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-slate-700">
              <span>Total</span><span className="text-cyan-400">R$ {reserva.valorTotal.toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} isLoading={loading} variant="success" className="w-full h-12 text-lg">Confirmar Compra</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}