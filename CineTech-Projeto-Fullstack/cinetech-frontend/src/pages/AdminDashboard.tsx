import { useEffect, useState, useMemo } from "react";
// REMOVIDO: Search (Não usado)
import { ShieldAlert, Plus, Film, Clock, Image as ImageIcon, List } from "lucide-react";
// REMOVIDO: Card (Não usado)
import { Button } from "../components/UiComponents";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFilmes, criarFilme } from "../api";
import type { Filme } from "../types";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Busca da URL (Navbar)
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q")?.toLowerCase() || "";

  // Form States
  const [titulo, setTitulo] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [duracao, setDuracao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [generos, setGeneros] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.perfil !== 'ADMIN') {
        navigate('/');
    }
  }, [user, navigate]);

  const loadFilmes = () => {
    setLoading(true);
    getFilmes()
      .then(setFilmes)
      // CORRIGIDO: Removido argumento 'err' não usado
      .catch(() => toast.error("Erro ao carregar filmes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFilmes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        await criarFilme({
            titulo,
            sinopse,
            duracaoMinutos: parseInt(duracao),
            imagemUrl,
            generos
        });
        toast.success("Filme adicionado com sucesso!");
        setShowModal(false);
        resetForm();
        loadFilmes();
    } catch (error) {
        toast.error("Erro ao salvar filme.");
    } finally {
        setSaving(false);
    }
  };

  const resetForm = () => {
      setTitulo("");
      setSinopse("");
      setDuracao("");
      setImagemUrl("");
      setGeneros("");
  };

  const filteredFilmes = useMemo(() => {
      if (!searchTerm) return filmes;
      return filmes.filter(f => f.titulo.toLowerCase().includes(searchTerm));
  }, [filmes, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 animate-fade-in">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> Painel Administrativo
            </h1>
            <p className="text-slate-400 mt-1">Gerenciar Catálogo de Filmes</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white">
            <Plus size={18} /> Adicionar Filme
        </Button>
      </div>

      {/* Lista de Filmes */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
                <List size={18} className="text-cyan-500"/> Lista de Filmes ({filteredFilmes.length})
            </h3>
        </div>

        {loading ? (
            <div className="p-8 text-center text-slate-500">Carregando catálogo...</div>
        ) : filteredFilmes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhum filme encontrado.</div>
        ) : (
            <div className="divide-y divide-slate-800">
                {filteredFilmes.map((filme) => (
                    <div key={filme.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors group">
                        <div className="w-12 h-16 bg-slate-800 rounded overflow-hidden flex-shrink-0">
                            {filme.imagemUrl ? (
                                <img src={filme.imagemUrl} alt={filme.titulo} className="w-full h-full object-cover" />
                            ) : (
                                <Film className="w-full h-full p-3 text-slate-600" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">{filme.titulo}</h4>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-1">
                                <span className="flex items-center gap-1"><Clock size={10} /> {filme.duracaoMinutos} min</span>
                                <span>|</span>
                                <span className="truncate max-w-[200px]">{filme.generos}</span>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                                ID: {filme.id}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Modal Adicionar Filme */}
      <AnimatePresence>
        {showModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Adicionar Novo Filme</h2>
                        <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>
                    
                    <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Título do Filme</label>
                                <input 
                                    required 
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white focus:border-cyan-500 outline-none"
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}
                                    placeholder="Ex: Interestelar"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Duração (minutos)</label>
                                <input 
                                    required 
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white focus:border-cyan-500 outline-none"
                                    value={duracao}
                                    onChange={e => setDuracao(e.target.value)}
                                    placeholder="Ex: 169"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-slate-300">URL da Imagem (Poster)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input 
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 pl-10 text-white focus:border-cyan-500 outline-none"
                                        value={imagemUrl}
                                        onChange={e => setImagemUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            {imagemUrl && (
                                <div className="h-40 w-28 bg-slate-800 rounded mx-auto mt-2 overflow-hidden border border-slate-700">
                                    <img src={imagemUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-slate-300">Gêneros (separados por vírgula)</label>
                            <input 
                                required 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white focus:border-cyan-500 outline-none"
                                value={generos}
                                onChange={e => setGeneros(e.target.value)}
                                placeholder="Ex: Ficção Científica, Drama"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-slate-300">Sinopse</label>
                            <textarea 
                                required 
                                rows={4}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white focus:border-cyan-500 outline-none resize-none"
                                value={sinopse}
                                onChange={e => setSinopse(e.target.value)}
                                placeholder="Resumo do filme..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-4">
                            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button type="submit" variant="success" isLoading={saving}>Salvar Filme</Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}