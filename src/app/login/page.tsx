"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";


// LISTA DE USUARIOS
const USUARIOS_VALIDOS = [
  { nombre: "Ignacio", clave: "123456" },
  { nombre: "Herbert", clave: "654321" },
];

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  // FUNCIÓN: manejar el envío del formulario
  // Se ejecuta cuando el usuario hace clic en "Ingresar"
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // ↑ MUY IMPORTANTE: evita que el formulario recargue la página
    // (comportamiento por defecto de HTML que queremos prevenir)

    // Buscar si existe un usuario con ese nombre Y esa clave exacta
    // .find() recorre el array y devuelve el primer elemento que cumple la condición
    // Si no encuentra ninguno, devuelve undefined
    const usuarioEncontrado = USUARIOS_VALIDOS.find(
      (u) => u.nombre === usuario && u.clave === clave
    );

    //LÓGICA DE AUTENTICACIÓN
    if (usuarioEncontrado) {
      login(usuarioEncontrado.nombre);
      router.push("/ventas");
    } else {
      setError("Usuario o clave incorrectos");
    }
  }

  // JSX:en pantalla
  return (
    <main className={styles.contenedorLogin}>
      {/* Caja blanca centrada en la pantalla */}
      <div className={styles.formContainer}>

        {/* Título y subtítulo */}
        <h1 className={styles.titulo}>MIMImarket</h1>
        <p className={styles.subtitulo}>Sistema de Gestión de Ventas</p>

        {/* onSubmit → llama a handleSubmit cuando se envía el formulario */}
        <form onSubmit={handleSubmit} className={styles.formulario}>

          {/*INPUT USUARIO*/}
          <div className={styles.grupoInput}>
            <label htmlFor="usuario">Usuario</label>
            {/* htmlFor debe coincidir con el id del input (accesibilidad) */}
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                setError(""); /**limpia */
              }}
              placeholder="Ignacio o Herbert"
              className={styles.input}
            />
          </div>

          {/*INPUT CLAVE*/}
          <div className={styles.grupoInput}>
            <label htmlFor="clave">Clave</label>
            <input
              id="clave"
              type="password" /** */
              value={clave}
              onChange={(e) => {
                setClave(e.target.value);
                setError("");
              }}
              placeholder="Tu clave"
              className={styles.input}
            />
          </div>

          {/* ── MENSAJE DE ERROR ──
          {/*Renderizado condicional: solo muestra el div si "error" no está vacío*/}
          {/*{error && <div>} → si error es "" (falsy), no renderiza nada */}
          {error && <div className={styles.error}>{error}</div>}

          {/* BOTÓN DE ENVÍO */}
          <button type="submit" className={styles.boton}>
            Ingresar
          </button>
        </form>

        {/*CREDENCIALES DE PRUEBA*/}
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
