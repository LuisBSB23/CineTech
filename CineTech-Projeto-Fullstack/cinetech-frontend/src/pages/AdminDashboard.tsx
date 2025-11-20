import { ShieldAlert } from "lucide-react";
import { Card } from "../components/UiComponents";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.perfil !== 'ADMIN') {
        navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="max-w-lg w-full p-10 text-center bg-slate-900 border-red-900/30">
        <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Painel Administrativo</h1>
        <p className="text-slate-400 mb-8">
          Bem-vindo, Administrador <strong>{user?.nome}</strong>.
          <br/>Esta área está em construção.
        </p>
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-sm text-slate-500 font-mono">
          Status: A aguardar implementação de CRUD de Filmes e Sessões.
        </div>
      </Card>
    </div>
  );
}