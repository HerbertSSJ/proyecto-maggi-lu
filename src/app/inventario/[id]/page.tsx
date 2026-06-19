"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Producto } from "@/types/Producto";
import { obtenerProductos } from "@/utils/inventarioStorage";
import styles from "../inventario.module.css";

type EstadoProducto = Producto | null | "no-encontrado";

export default function DetalleProductoPage() {
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [estado, setEstado] = useState<EstadoProducto>(null);

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando, router]);

  useEffect(() => {
    const idParam = params?.id;
    const idNumerico = Number(idParam);

    if (!idParam || isNaN(idNumerico)) {
      setEstado("no-encontrado");
      return;
    }

    const productos = obtenerProductos();
    const encontrado = productos.find((p) => p.id === idNumerico);

    setEstado(encontrado ?? "no-encontrado");
  }, [params]);

  if (cargando) {
    return (
      <div className={styles.contenedor}>
        <p style={{ padding: "20px", color: "#888" }}>Cargando...</p>
      </div>
    );
  }

  if (!usuario) return null;

  const menuNav = (
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
  );

  if (estado === "no-encontrado") {
    return (
      <div className={styles.contenedor}>
        <button
          className={styles.btnHamburguesaDash}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>
        {menuNav}
        <main className={`${styles.contenido} ${menuAbierto ? styles.moverDerecha : ""}`}>
          <div className={styles.header}>
            <h1>Detalle de Producto</h1>
          </div>
          <div className={styles.seccion}>
            <div className={styles.caja}>
              <p style={{ color: "#c0392b", marginBottom: "16px" }}>
                Producto no encontrado.
              </p>
              <Link href="/inventario" className={styles.btnMini}>
                Volver al inventario
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (estado === null) {
    return (
      <div className={styles.contenedor}>
        {menuNav}
        <main className={styles.contenido}>
          <div className={styles.header}><h1>Detalle de Producto</h1></div>
          <div className={styles.seccion}>
            <p style={{ color: "#888" }}>Cargando producto...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.contenedor}>
      <button
        className={styles.btnHamburguesaDash}
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>
      {menuNav}
      <main className={`${styles.contenido} ${menuAbierto ? styles.moverDerecha : ""}`}>
        <div className={styles.header}>
          <h1>Detalle de Producto</h1>
        </div>
        <div className={styles.seccion}>
          <div className={styles.caja}>
            <h2 className={styles.tituloCaja}>{estado.nombre}</h2>
            <table className={styles.tablaMini} style={{ marginBottom: "20px" }}>
              <tbody>
                <tr>
                  <th>Nombre</th>
                  <td>{estado.nombre}</td>
                </tr>
                <tr>
                  <th>Precio</th>
                  <td>
                    {estado.precio.toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </td>
                </tr>
                <tr>
                  <th>Stock</th>
                  <td>{estado.cantidad}</td>
                </tr>
                <tr>
                  <th>Fecha de creación</th>
                  <td>{estado.fechaCreacion}</td>
                </tr>
                <tr>
                  <th>Responsable</th>
                  <td>{estado.responsable}</td>
                </tr>
              </tbody>
            </table>
            <Link href="/inventario" className={styles.btnMini}>
              Volver al inventario
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
