"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  usuario: string | null;
  cargando: boolean;
  login: (nombre: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  cargando: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuario del localStorage al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const usuarioGuardado = localStorage.getItem("usuarioMimi");
      if (usuarioGuardado) {
        setUsuario(usuarioGuardado);
      }
      setCargando(false);
    }
  }, []);

  function login(nombre: string) {
    setUsuario(nombre);
    if (typeof window !== "undefined") {
      localStorage.setItem("usuarioMimi", nombre);
    }
  }

  function logout() {
    setUsuario(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("usuarioMimi");
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}