import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button, Card } from "../components/UiComponents";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chamada direta ao endpoint de login (ajuste a URL se necessário)
      const res = await axios.post("http://localhost:8080/api/auth/login", { email, senha });
      const user = res.data;
      
      login(user);
      toast.success(`Bem-vindo, ${user.nome}!`);
      
      if (user.perfil === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <Card className="w-full max-w-md p-8 bg-slate-900/80 border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <LogIn className="text-cyan-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Acesse sua conta</h1>
          <p className="text-slate-400 mt-2">Entre para comprar ingressos e ver seu histórico</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg" isLoading={loading}>
            Entrar
          </Button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  );
}