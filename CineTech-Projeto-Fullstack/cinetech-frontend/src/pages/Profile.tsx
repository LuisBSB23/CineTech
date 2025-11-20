import { useEffect, useState } from "react";
import { User, Ticket, CreditCard, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { TicketCard } from "../components/UiComponents";
import { getHistorico } from "../api/index"; // Import explícito
import { type Reserva } from "../types";

export default function Profile() {
  const [historico, setHistorico] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const USUARIO_ID = 1; 

  useEffect(() => {
    getHistorico(USUARIO_ID)
      .then(data => setHistorico(data))
      .catch(err => console.error("Erro ao carregar histórico", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8 p-4">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-900/30">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Visitante CineTech</h1>
          <p className="text-slate-400">Membro desde 2025</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 text-cyan-400 font-medium border border-slate-700">
            <Ticket size={18} /> Meus Ingressos
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
            <CreditCard size={18} /> Pagamentos
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
            <Settings size={18} /> Configurações
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Histórico de Compras</h2>
          
          {loading ? (
            <div className="text-slate-500 text-center py-10">Carregando histórico...</div>
          ) : historico.length === 0 ? (
            <div className="text-slate-500 text-center py-10">Nenhuma compra realizada ainda.</div>
          ) : (
            <div className="space-y-4">
              {historico.map((reserva, idx) => (
                reserva.itens.map((item, itemIdx) => (
                  <motion.div
                    key={`${reserva.id}-${item.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (idx + itemIdx) * 0.1 }}
                  >
                    <TicketCard 
                      id={reserva.id}
                      title={item.sessao.filme.titulo}
                      date={new Date(item.sessao.dataHora).toLocaleString()}
                      seats={item.assentos ? item.assentos.split(',') : [`${item.quantidade}x`]}
                      total={item.quantidade * item.sessao.valorIngresso}
                    />
                  </motion.div>
                ))
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}