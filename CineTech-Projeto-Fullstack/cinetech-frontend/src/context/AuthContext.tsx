import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Usuario } from "../types";

interface AuthContextType {
  user: Usuario | null;
  login: (userData: Usuario) => void;
  logout: () => void;
  updateUser: (userData: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    // Recuperar usuário do localStorage ao iniciar
    const storedUser = localStorage.getItem("cinetech_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem("cinetech_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cinetech_user");
  };

  const updateUser = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem("cinetech_user", JSON.stringify(userData));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};