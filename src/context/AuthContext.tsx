"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// información y funciones  requerida
interface AuthContextType {
  usuario: string | null;
  cargando: boolean;
  login: (nombre: string) => void;
  logout: () => void;
}

//datos globales de autenticación
const AuthContext = createContext<AuthContextType>({
  usuario: null,
  cargando: true,
  login: () => { },
  logout: () => { },
});

//  quién está logueado
export function AuthProvider({ children }: { children: ReactNode }) {

  const [usuario, setUsuario] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const usuarioGuardado = localStorage.getItem("usuarioMimi");
      if (usuarioGuardado) {
        setUsuario(usuarioGuardado);
      }
      setCargando(false);
    }
  }, []);
  // Guarda el usuario
  function login(nombre: string) {
    setUsuario(nombre);
    if (typeof window !== "undefined") {
      localStorage.setItem("usuarioMimi", nombre);
    }
  }

  // Borra al usuario
  function logout() {
    setUsuario(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("usuarioMimi");
    }
  }
  //exportacion de logeado
  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}