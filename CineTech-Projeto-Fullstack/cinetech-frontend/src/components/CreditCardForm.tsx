import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Calendar, Lock, User, CheckCircle } from "lucide-react";
import { Button } from "./UiComponents";
import { useAuth } from "../context/AuthContext";
import { adicionarCartao, atualizarCartao } from "../api";
import { toast } from "react-hot-toast";
import type { Cartao } from "../types";

interface CreditCardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Cartao | null; // Para edição
}

export const CreditCardForm = ({ onSuccess, onCancel, initialData }: CreditCardFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Estados do formulário
  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [tipo, setTipo] = useState("CREDITO");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Preencher dados se for edição
  useEffect(() => {
    if (initialData) {
      setNumero(initialData.numero);
      setNome(initialData.nomeTitular);
      setValidade(initialData.validade);
      setCvv(initialData.cvv);
      setTipo(initialData.tipo);
    }
  }, [initialData]);

  // Formatações simples
  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    setNumero(val);
  };

  const handleValidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + "/" + val.substring(2);
    setValidade(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const dados = {
        usuarioId: user.id,
        tipo,
        numero,
        nomeTitular: nome,
        validade,
        cvv
    };

    try {
      if (initialData) {
        await atualizarCartao(initialData.id, dados);
        toast.success("Cartão atualizado com sucesso!");
      } else {
        await adicionarCartao(dados);
        toast.success("Cartão adicionado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      toast.error("Erro ao salvar cartão.");
    } finally {
      setLoading(false);
    }
  };

  // Ilustração do Cartão (CineTech Style) - CORRIGIDA
  const CardIllustration = () => (
    <div className="relative w-full max-w-sm mx-auto aspect-[1.586/1] perspective-1000 mb-8 group">
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        animate={{ rotateY: focusedField === "cvv" ? 180 : 0 }}
        initial={false}
      >
        {/* Frente do Cartão */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl border border-slate-700 shadow-2xl shadow-cyan-900/20 p-6 flex flex-col justify-between overflow-hidden z-20">
          {/* Efeito de Brilho */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-start z-10">
            <div className="w-12 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded flex items-center justify-center opacity-80">
               <div className="w-6 h-6 border border-white/20 rounded-full -mr-3"></div>
               <div className="w-6 h-6 border border-white/20 rounded-full"></div>
            </div>
            <span className="text-xs font-bold tracking-widest text-slate-400">{tipo}</span>
          </div>

          <div className="space-y-1 z-10">
             {/* Chip */}
             <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded mb-2 opacity-80 border border-yellow-600/50"></div>
             <p className="text-xl sm:text-2xl font-mono text-white tracking-widest drop-shadow-md">
               {numero ? numero.match(/.{1,4}/g)?.join(" ") : "0000 0000 0000 0000"}
             </p>
          </div>

          <div className="flex justify-between items-end z-10">
            <div>
              <p className="text-[10px] text-slate-400 uppercase mb-0.5">Nome do Titular</p>
              <p className="font-medium text-white uppercase truncate max-w-[180px]">
                {nome || "SEU NOME AQUI"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase mb-0.5">Validade</p>
              <p className="font-medium text-white">{validade || "MM/AA"}</p>
            </div>
          </div>
        </div>

        {/* Verso do Cartão */}
        <div 
          className="absolute inset-0 backface-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-center rotate-y-180 z-10"
        >
          <div className="absolute top-6 left-0 w-full h-10 bg-slate-950"></div>
          <div className="mt-4">
            <div className="flex items-center justify-end bg-slate-200 h-10 rounded px-3 relative">
               <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[8px] overflow-hidden select-none">
                  CINETECH CINETECH CINETECH CINETECH
               </div>
              <span className="font-mono text-slate-900 font-bold text-lg z-10">{cvv || "***"}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">Código de Segurança (CVV)</p>
          </div>
          <div className="absolute bottom-6 right-6 w-12 h-8 bg-white/10 rounded flex items-center justify-center">
             <div className="w-8 h-5 border border-white/20 rounded"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-6 text-center">
        {initialData ? "Editar Cartão" : "Adicionar Cartão"}
      </h2>
      
      {/* Visualização do Cartão */}
      <CardIllustration />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Cartão */}
        <div className="flex gap-2 mb-4">
            {["CREDITO", "DEBITO"].map((t) => (
                <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`flex-1 py-2 text-xs font-bold rounded border transition-all ${
                        tipo === t 
                        ? "bg-cyan-600 border-cyan-500 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800"
                    }`}
                >
                    {t}
                </button>
            ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1"><CreditCard size={14}/> Número do Cartão</label>
          <input
            type="text"
            value={numero}
            onChange={handleNumeroChange}
            onFocus={() => setFocusedField("numero")}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none font-mono tracking-wide"
            placeholder="0000 0000 0000 0000"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1"><User size={14}/> Nome do Titular</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onFocus={() => setFocusedField("nome")}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none uppercase"
            placeholder="IGUAL NO CARTÃO"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1"><Calendar size={14}/> Validade</label>
            <input
              type="text"
              value={validade}
              onChange={handleValidadeChange}
              onFocus={() => setFocusedField("validade")}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none text-center"
              placeholder="MM/AA"
              required
            />
          </div>
          <div className="space-y-2 w-1/3">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1"><Lock size={14}/> CVV</label>
            <input
              type="text"
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              onFocus={() => setFocusedField("cvv")} // Isso aciona a virada do cartão
              onBlur={() => setFocusedField(null)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none text-center"
              placeholder="123"
              required
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancelar</Button>
            <Button type="submit" variant="success" isLoading={loading} className="flex-1">
                <CheckCircle size={18} /> {initialData ? "Atualizar" : "Salvar"}
            </Button>
        </div>
      </form>
    </div>
  );
};