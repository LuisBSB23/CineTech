import { useEffect, useState } from "react";
import { User, Ticket, CreditCard, Settings, Save, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { TicketCard, Button, Card } from "../components/UiComponents";
import { getHistorico } from "../api/index";
import { type Reserva } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [historico, setHistorico] = useState<Reserva[]>([]);
  const [loadingHist, setLoadingHist] = useState(true);
  
  // Estados de Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
    }
    
    // Carrega dados iniciais de edição
    setEditNome(user.nome);
    
    getHistorico(user.id)
      .then(data => setHistorico(data))
      .catch(err => console.error("Erro ao carregar histórico", err))
      .finally(() => setLoadingHist(false));
  }, [user, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoadingSave(true);
    try {
        const res = await axios.put(`http://localhost:8080/api/auth/usuario/${user.id}`, {
            nome: editNome,
            senha: editSenha
        });
        updateUser(res.data);
        toast.success("Perfil atualizado com sucesso!");
        setIsEditing(false);
        setEditSenha(""); // Limpa senha por segurança
    } catch (error) {
        toast.error("Erro ao atualizar perfil.");
    } finally {
        setLoadingSave(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20 px-4">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 shrink-0">
          <User size={40} />
        </div>
        
        <div className="flex-1 text-center md:text-left w-full">
          {isEditing ? (
             <div className="space-y-3 max-w-md animate-in fade-in">
                <input 
                    type="text" 
                    value={editNome} 
                    onChange={(e) => setEditNome(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    placeholder="Nome Completo"
                />
                <input 
                    type="password" 
                    value={editSenha} 
                    onChange={(e) => setEditSenha(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    placeholder="Nova Senha (deixe em branco para manter)"
                />
                <div className="flex gap-2 justify-center md:justify-start">
                    <Button onClick={handleSaveProfile} isLoading={loadingSave} className="h-9 text-sm">
                        <Save size={16} /> Salvar
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="secondary" className="h-9 text-sm">
                        Cancelar
                    </Button>
                </div>
             </div>
          ) : (
             <>
                <h1 className="text-3xl font-bold text-white">{user.nome}</h1>
                <p className="text-slate-400 mb-2">{user.email} • <span className="text-cyan-500 text-xs font-bold border border-cyan-900 bg-cyan-950 px-2 py-0.5 rounded">{user.perfil}</span></p>
                <button onClick={() => setIsEditing(true)} className="text-sm text-cyan-400 flex items-center gap-1 hover:text-cyan-300 mx-auto md:mx-0">
                    <Edit2 size={14} /> Editar Perfil
                </button>
             </>
          )}
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
          <button onClick={() => setIsEditing(true)} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
            <Settings size={18} /> Configurações
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Histórico de Compras</h2>
          
          {loadingHist ? (
            <div className="text-slate-500 text-center py-10">Carregando histórico...</div>
          ) : historico.length === 0 ? (
            <div className="text-slate-500 text-center py-10 bg-slate-900/30 rounded-xl border border-slate-800/50">
                Nenhuma compra realizada ainda.
            </div>
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