"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Boleta } from "@/types/Boleta";
import { obtenerBoletas, eliminarBoleta } from "@/utils/boletaStorage";
import styles from "./historial.module.css";

export default function HistorialPage() {
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [boletas, setBoletas] = useState<Boleta[]>([]);

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando]);

  useEffect(() => {
    setBoletas(obtenerBoletas());
  }, []);

  function separarFechaHora(fechaCompleta: string) {
    const partes = fechaCompleta.split(",");
    const fecha = partes[0]?.trim() || fechaCompleta;
    const hora = partes[1]?.trim() || "";
    return { fecha, hora };
  }

  function handleEliminar(id: number) {
    if (!confirm("¿Eliminar esta boleta?")) return;
    eliminarBoleta(id);
    setBoletas(boletas.filter((b) => b.id !== id));
    alert("Boleta eliminada.");
  }

  return (
    <div className={styles.contenedor}>
      <button
        className={styles.btnHamburguesaDash}
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      <nav className={`${styles.menuIzquierda} ${menuAbierto ? styles.menuActivo : ""}`}>
        <h2 className={styles.menu}>
          <img src="/Logo_MIMImarket-removebg-preview.png" alt="MIMImarket" />
        </h2>
        <ul className={styles.listaMenu}>
          <li><a href="/inventario">Inventario</a></li>
          <li><a href="/ventas">Caja Principal</a></li>
          <li><a href="/historial">Historial</a></li>
          <li><a href="/fiados">Fiados</a></li>
        </ul>
        <button className={styles.btnLogout} onClick={logout}>
          Cerrar sesión
        </button>
      </nav>

      <main className={`${styles.contenido} ${menuAbierto ? styles.moverDerecha : ""}`}>
        <div className={styles.header}>
          <h1>Historial de Boletas - {usuario}</h1>
        </div>

        <section className={styles.historialSeccion}>
          <h2>Todas las Boletas</h2>

          {boletas.length === 0 ? (
            <p className={styles.sinDatos}>No hay boletas registradas</p>
          ) : (
            boletas.map((boleta) => (
              <div key={boleta.id} className={styles.boletaCard}>
                <div className={styles.boletaHeader}>
                  <div>
                    <h3>Boleta #{boleta.numero || boleta.id}</h3>
                    <p className={styles.info}>
                      <strong>Fecha:</strong> {separarFechaHora(boleta.fecha).fecha}
                    </p>
                    <p className={styles.info}>
                      <strong>Hora:</strong> {separarFechaHora(boleta.fecha).hora || "No registrada"}
                    </p>
                    <p className={styles.info}>
                      <strong>Cliente:</strong> {boleta.cliente || "Sin nombre"}
                    </p>
                  </div>
                  <div className={styles.boletaAcciones}>
                    <button
                      className={styles.btnEditar}
                      style={{ backgroundColor: "#0066cc" }}
                      onClick={() => router.push(`/historial/${boleta.id}`)}
                    >
                      Ver detalle
                    </button>
                    <button
                      className={styles.btnEliminar}
                      onClick={() => handleEliminar(boleta.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}