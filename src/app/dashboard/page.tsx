"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../ventas/ventas.module.css";
import Link from "next/link";

export default function DashboardPage() {
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando, router]);

  if (cargando) {
    return (
      <div className={styles.contenedor}>
        <p style={{ padding: "20px", color: "#888" }}>Cargando...</p>
      </div>
    );
  }

  if (!usuario) return null;

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
          <li><Link href="/inventario">Inventario</Link></li>
          <li><Link href="/ventas">Caja Principal</Link></li>
          <li><Link href="/historial">Historial</Link></li>
          <li><Link href="/fiados">Fiados</Link></li>
        </ul>
        <button className={styles.btnLogout} onClick={logout}>
          Cerrar sesión
        </button>
      </nav>

      <main className={`${styles.contenido} ${menuAbierto ? styles.moverDerecha : ""}`}>
        <div className={styles.header}>
          <h1>Bienvenido al Dashboard, {usuario}</h1>
        </div>

        <div className={styles.division}>
          <div className={styles.caja}>
            <h2 className={styles.tituloCaja}>Accesos Rápidos</h2>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/ventas" className={styles.btnFinalizar} style={{ textAlign: "center", textDecoration: "none", flex: "1 1 200px" }}>
                Ir a Caja Principal
              </Link>
              <Link href="/inventario" className={styles.btnFinalizar} style={{ textAlign: "center", textDecoration: "none", flex: "1 1 200px" }}>
                Ir a Inventario
              </Link>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              <Link href="/historial" className={styles.btnFinalizar} style={{ textAlign: "center", textDecoration: "none", flex: "1 1 200px" }}>
                Ver Historial de Ventas
              </Link>
              <Link href="/fiados" className={styles.btnFinalizar} style={{ textAlign: "center", textDecoration: "none", flex: "1 1 200px" }}>
                Gestionar Fiados
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
