"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Boleta } from "@/types/Boleta";
import {
  obtenerBoletas,
  eliminarBoleta,
  actualizarBoleta,
} from "@/utils/boletaStorage";
import styles from "./historial.module.css";

export default function HistorialPage() {
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [editando, setEditando] = useState<number | null>(null);
  const [metodoPagoEdit, setMetodoPagoEdit] = useState("");

  // Verificar autenticación
  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando]);

  // Cargar boletas
  useEffect(() => {
    setBoletas(obtenerBoletas());
  }, []);

  function eliminarBoleta_Func(id: number) {
    if (confirm("¿Eliminar boleta?")) {
      eliminarBoleta(id);
      setBoletas(boletas.filter((b) => b.id !== id));
      alert("Boleta eliminada");
    }
  }

  function iniciarEdicion(boleta: Boleta) {
    setEditando(boleta.id);
    setMetodoPagoEdit(boleta.metodo_pago || "");
  }

  function guardarEdicion(id: number) {
    if (!metodoPagoEdit) {
      alert("Selecciona método de pago");
      return;
    }

    const boletaActualizada = boletas.find((b) => b.id === id);
    if (boletaActualizada) {
      boletaActualizada.metodo_pago = metodoPagoEdit;
      actualizarBoleta(id, boletaActualizada);
      setBoletas([...boletas]);
      setEditando(null);
      alert("Boleta actualizada");
    }
  }

  function cancelarEdicion() {
    setEditando(null);
    setMetodoPagoEdit("");
  }

  return (
    <div className={styles.contenedor}>
      {/* MENÚ LATERAL */}
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
          <li>
            <a href="/inventario">Inventario</a>
          </li>
          <li>
            <a href="/ventas">Caja Principal</a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenuAbierto(false);
              }}
            >
              Historial
            </a>
          </li>
        </ul>

        <button className={styles.btnLogout} onClick={logout}>
          Cerrar sesión
        </button>
      </nav>

      {/* ÁREA PRINCIPAL */}
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
                    <h3>Boleta #{boleta.numero}</h3>
                    <p className={styles.info}>
                      <strong>Fecha:</strong> {boleta.fecha}
                    </p>
                    <p className={styles.info}>
                      <strong>Usuario:</strong> {boleta.usuario}
                    </p>
                  </div>
                  <div className={styles.boletaAcciones}>
                    {editando === boleta.id ? (
                      <>
                        <button
                          className={styles.btnGuardar}
                          onClick={() => guardarEdicion(boleta.id)}
                        >
                          Guardar
                        </button>
                        <button
                          className={styles.btnCancelar}
                          onClick={cancelarEdicion}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.btnEditar}
                          onClick={() => iniciarEdicion(boleta)}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.btnEliminar}
                          onClick={() => eliminarBoleta_Func(boleta.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ITEMS DE LA BOLETA */}
                <table className={styles.tablaMini}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boleta.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.nombre}</td>
                        <td>${item.precio}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* TOTAL Y MÉTODO DE PAGO */}
                <div className={styles.boletaFooter}>
                  <p className={styles.total}>
                    <strong>Total:</strong> ${boleta.total.toFixed(2)}
                  </p>

                  {editando === boleta.id ? (
                    <div className={styles.metodoPagoEdit}>
                      <label>Método de Pago:</label>
                      <select
                        value={metodoPagoEdit}
                        onChange={(e) => setMetodoPagoEdit(e.target.value)}
                      >
                        <option value="">Selecciona...</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Fiado">Fiado</option>
                      </select>
                    </div>
                  ) : (
                    <p className={styles.info}>
                      <strong>Método de Pago:</strong> {boleta.metodo_pago || "No especificado"}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
