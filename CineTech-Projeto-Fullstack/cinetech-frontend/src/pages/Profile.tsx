import { User, Ticket, CreditCard, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { TicketCard } from "../components/UiComponents";

// Mock data para o histórico
const HISTORY = [
  { id: 9821, title: "A Origem", date: "12/11/2025 - 20:00", seats: ["F10", "F11"], total: 71.00 },
  { id: 8742, title: "Duna: Parte Dois", date: "10/11/2025 - 19:30", seats: ["H5"], total: 45.00 },
];

export default function Profile() {
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
        {/* Menu Lateral Simulada */}
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

        {/* Conteúdo Principal */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Histórico de Compras</h2>
          
          <div className="space-y-4">
            {HISTORY.map((ticket, idx) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <TicketCard {...ticket} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}