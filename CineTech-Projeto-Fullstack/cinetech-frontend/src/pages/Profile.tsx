import { useEffect, useState } from "react";
import { 
  User, 
  Ticket, 
  CreditCard as CardIcon, 
  Settings, 
  Save, 
  Edit2, 
  Plus,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Componentes e Contextos
import { TicketCard, Button } from "../components/UiComponents";
import { CreditCardForm } from "../components/CreditCardForm";
import { getHistorico, getCartoes, deletarCartao } from "../api/index";
import { type Reserva, type Cartao } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Estados do Perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  // Estados das Abas e Dados
  const [activeTab, setActiveTab] = useState<'ingressos' | 'pagamento'>('ingressos');
  
  // Dados de Histórico
  const [historico, setHistorico] = useState<Reserva[]>([]);
  const [loadingHist, setLoadingHist] = useState(true);

  // Dados de Pagamento
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Cartao | null>(null);

  // Efeito Inicial e Carregamento de Histórico
  useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
    }
    
    setEditNome(user.nome);
    
    // Carrega histórico sempre ao montar
    getHistorico(user.id)
      .then(data => setHistorico(data))
      .catch(err => console.error("Erro ao carregar histórico", err))
      .finally(() => setLoadingHist(false));
  }, [user, navigate]);

  // Função para recarregar cartões
  const refreshCartoes = () => {
    if (user) {
        getCartoes(user.id)
          .then(setCartoes)
          .catch(err => console.error("Erro ao carregar cartões", err));
    }
  };

  // Efeito para Carregar Cartões ao mudar de aba
  useEffect(() => {
    if (activeTab === 'pagamento') {
        refreshCartoes();
    }
  }, [user, activeTab]);

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
        setEditSenha("");
    } catch (error) {
        toast.error("Erro ao atualizar perfil.");
    } finally {
        setLoadingSave(false);
    }
  };

  const handleDeleteCartao = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cartão?")) {
        try {
            await deletarCartao(id);
            toast.success("Cartão removido.");
            refreshCartoes();
        } catch (e) {
            toast.error("Erro ao excluir cartão.");
        }
    }
  };

  const handleEditCartao = (cartao: Cartao) => {
      setEditingCard(cartao);
      setShowAddCard(true);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20 px-4">
      
      {/* --- CABEÇALHO DO PERFIL --- */}
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
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
                    placeholder="Nome Completo"
                />
                <input 
                    type="password" 
                    value={editSenha} 
                    onChange={(e) => setEditSenha(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
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
                <button onClick={() => setIsEditing(true)} className="text-sm text-cyan-400 flex items-center gap-1 hover:text-cyan-300 mx-auto md:mx-0 transition-colors">
                    <Edit2 size={14} /> Editar Perfil
                </button>
             </>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        
        {/* --- MENU LATERAL --- */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('ingressos')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'ingressos' 
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 font-medium shadow-sm' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Ticket size={18} /> Meus Ingressos
          </button>
          
          <button 
            onClick={() => setActiveTab('pagamento')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'pagamento' 
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 font-medium shadow-sm' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <CardIcon size={18} /> Pagamentos
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors cursor-not-allowed opacity-60">
            <Settings size={18} /> Configurações
          </button>
        </div>

        {/* --- CONTEÚDO PRINCIPAL --- */}
        <div className="md:col-span-2 space-y-6">
          
          {/* ABA: MEUS INGRESSOS */}
          {activeTab === 'ingressos' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4 mb-6">Histórico de Compras</h2>
              
                {loadingHist ? (
                    <div className="text-slate-500 text-center py-10">Carregando histórico...</div>
                ) : historico.length === 0 ? (
                    <div className="text-slate-500 text-center py-10 bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
                        <Ticket size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhuma compra realizada ainda.</p>
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
                            seats={item.selectedSeats && item.selectedSeats.length > 0 ? item.selectedSeats : [`${item.quantidade}x`]}
                            total={item.quantidade * item.sessao.valorIngresso}
                            />
                        </motion.div>
                        ))
                    ))}
                    </div>
                )}
            </div>
          )}

          {/* ABA: PAGAMENTOS */}
          {activeTab === 'pagamento' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               {!showAddCard ? (
                 <>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                        <h2 className="text-xl font-bold text-white">Meus Cartões</h2>
                        <Button onClick={() => { setEditingCard(null); setShowAddCard(true); }} className="h-8 text-xs px-3">
                            <Plus size={16} /> Adicionar Novo
                        </Button>
                    </div>

                    {cartoes.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                            <div className="mx-auto w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600 shadow-inner">
                                <CardIcon size={28} />
                            </div>
                            <h3 className="text-slate-300 font-medium mb-1">Carteira Vazia</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                Adicione um cartão de crédito ou débito para agilizar suas próximas compras.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartoes.map((c) => (
                                <motion.div 
                                    key={c.id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800/60 transition-all group"
                                >
                                    {/* Ícone do Cartão */}
                                    <div className="w-12 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded flex items-center justify-center text-[10px] font-bold text-white/30 shadow-inner border border-white/5">
                                        {c.tipo === 'CREDITO' ? 'CRED' : 'DEB'}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-white font-medium tracking-wide">
                                                •••• •••• •••• {c.numero.slice(-4)}
                                            </p>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                                                {c.tipo}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 uppercase mt-0.5 tracking-wider">{c.nomeTitular}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="text-right mr-4 hidden sm:block">
                                            <p className="text-[10px] text-slate-500 uppercase mb-0.5">Validade</p>
                                            <p className="text-sm text-slate-300 font-mono">{c.validade}</p>
                                        </div>
                                        
                                        {/* Botões de Ação */}
                                        <button 
                                            onClick={() => handleEditCartao(c)}
                                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteCartao(c.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                 </>
               ) : (
                 <CreditCardForm 
                    initialData={editingCard}
                    onSuccess={() => { setShowAddCard(false); refreshCartoes(); }} 
                    onCancel={() => setShowAddCard(false)} 
                 />
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}