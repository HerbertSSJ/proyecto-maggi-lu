"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";

// Datos de los usuarios válidos del sistema
const USUARIOS_VALIDOS = [
  { nombre: "Ignacio", clave: "123456" },
  { nombre: "Herbert", clave: "654321" },
];

export default function LoginPage() {
  // Estados del formulario
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  // Hooks de Next.js y contexto de autenticación
  const { login } = useAuth();
  const router = useRouter();

  // Función para manejar el envío del formulario
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevenir recarga de página

    // Buscar si el usuario existe con la clave correcta
    const usuarioEncontrado = USUARIOS_VALIDOS.find(
      (u) => u.nombre === usuario && u.clave === clave
    );

    // Si el usuario es válido
    if (usuarioEncontrado) {
      login(usuarioEncontrado.nombre); // Guardar usuario en contexto
      router.push("/ventas"); // Ir a página de ventas
    } else {
      // Si no es válido, mostrar error
      setError("Usuario o clave incorrectos");
    }
  }

  return (
    <main className={styles.contenedorLogin}>
      <div className={styles.formContainer}>
        <h1 className={styles.titulo}>MIMImarket</h1>
        <p className={styles.subtitulo}>Sistema de Gestión de Ventas</p>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          {/* Input de usuario */}
          <div className={styles.grupoInput}>
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                setError(""); // Limpiar error cuando empieza a escribir
              }}
              placeholder="Ignacio o Herbert"
              className={styles.input}
            />
          </div>

          {/* Input de clave */}
          <div className={styles.grupoInput}>
            <label htmlFor="clave">Clave</label>
            <input
              id="clave"
              type="password"
              value={clave}
              onChange={(e) => {
                setClave(e.target.value);
                setError("");
              }}
              placeholder="Tu clave"
              className={styles.input}
            />
          </div>

          {/* Mostrar error si existe */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Botón de envío */}
          <button type="submit" className={styles.boton}>
            Ingresar
          </button>
        </form>

        {/* Información para el usuario */}
        <div className={styles.credencialesPrueba}>
          <p className={styles.etiqueta}>Usuarios de prueba:</p>
          <ul className={styles.lista}>
            <li>Ignacio / 123456</li>
            <li>Herbert / 654321</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
