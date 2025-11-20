import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronLeft } from "lucide-react";
import { getFilmes, getSessoes } from "../api";
import type { Filme, Sessao } from "../types"; // Correção: 'import type'
import { useCart } from "../context/CartContext";
import { Card, Button } from "../components/UiComponents";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getFilmes(), getSessoes(Number(id))])
      .then(([filmesRes, sessoesRes]) => {
        setFilme(filmesRes.find(f => f.id === Number(id)) || null);
        setSessoes(sessoesRes);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center text-cyan-500">Carregando...</div>;
  if (!filme) return <div className="p-20 text-center text-white">Filme não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={20} /> Voltar
      </button>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">{filme.titulo}</h1>
        <div className="flex gap-4 text-sm text-slate-400 mb-6 border-b border-slate-700 pb-6">
          <span className="flex items-center gap-2"><Clock className="text-cyan-500" size={16}/> {filme.duracaoMinutos} min</span>
          <span className="px-2 border-l border-slate-600">Ficção Científica</span>
        </div>
        <p className="text-slate-300 text-lg leading-relaxed">{filme.sinopse}</p>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Calendar className="text-cyan-500"/> Sessões Disponíveis
      </h2>

      <div className="space-y-4">
        {sessoes.map(sessao => <SessaoRow key={sessao.id} sessao={sessao} onAdd={addToCart} />)}
        {sessoes.length === 0 && <p className="text-slate-500">Nenhuma sessão disponível.</p>}
      </div>
    </div>
  );
}

const SessaoRow = ({ sessao, onAdd }: { sessao: Sessao, onAdd: (s: Sessao, q: number) => Promise<void> }) => {
  const [qtd, setQtd] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await onAdd(sessao, qtd);
    setAdding(false);
    setQtd(1);
  };

  const esgotado = sessao.assentosDisponiveis <= 0;
  const data = new Date(sessao.dataHora);

  return (
    <Card className="p-4 flex flex-col md:flex-row items-center gap-6 bg-slate-800/40">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="bg-slate-700 p-2 rounded-lg text-cyan-400"><Clock size={20}/></div>
          <div>
            <div className="text-white font-bold">{data.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="text-xs text-slate-400">{data.toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-700 p-2 rounded-lg text-purple-400"><MapPin size={20}/></div>
          <div>
            <div className="text-white font-medium">{sessao.sala.nome}</div>
            <div className={`text-xs font-bold ${esgotado ? 'text-red-500' : 'text-emerald-500'}`}>
              {esgotado ? 'ESGOTADO' : `${sessao.assentosDisponiveis} livres`}
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 text-right font-bold text-white text-lg flex items-center justify-end">
          R$ {sessao.valorIngresso.toFixed(2)}
        </div>
      </div>

      {!esgotado && (
        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-600 h-10">
            <button onClick={() => setQtd(Math.max(1, qtd - 1))} className="px-3 h-full hover:bg-slate-700 rounded-l text-slate-300">-</button>
            <span className="w-8 text-center text-white text-sm">{qtd}</span>
            <button onClick={() => setQtd(Math.min(sessao.assentosDisponiveis, qtd + 1))} className="px-3 h-full hover:bg-slate-700 rounded-r text-slate-300">+</button>
          </div>
          <Button onClick={handleAdd} isLoading={adding}>Adicionar</Button>
        </div>
      )}
    </Card>
  );
};