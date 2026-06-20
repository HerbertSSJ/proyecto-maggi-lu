"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Fiado } from "@/types/Fiado";
import {
  obtenerFiados,
  marcarComoPagado,
} from "@/utils/fiadoStorage";
import { crearBoleta, obtenerSiguienteNumero } from "@/utils/boletaStorage";
import styles from "./fiados.module.css";

export default function FiadosPage() {
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fiados, setFiados] = useState<Fiado[]>([]);
  const [fiadoPagando, setFiadoPagando] = useState<Fiado | null>(null);
  const [metodoPagoFiado, setMetodoPagoFiado] = useState("");

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando]);

  useEffect(() => {
    setFiados(obtenerFiados());
  }, []);

  function iniciarPago(fiado: Fiado) {
    setFiadoPagando(fiado);
    setMetodoPagoFiado("");
  }

  function confirmarPago() {
    if (!fiadoPagando) return;

    if (!metodoPagoFiado) {
      alert("Debe seleccionar un método de pago.");
      return;
    }

    if (!confirm(`¿Confirmar pago de $${fiadoPagando.totalDeuda} de ${fiadoPagando.cliente}?`)) return;

    // La boleta usa la fecha y hora ACTUAL del pago, no la del fiado
    const boleta = {
      id: Date.now(),
      numero: obtenerSiguienteNumero(),
      fecha: new Date().toLocaleString("es-CL"),
      usuario: usuario || "Desconocido",
      cliente: fiadoPagando.cliente,
      items: fiadoPagando.productos,
      total: fiadoPagando.totalDeuda,
      metodo_pago: metodoPagoFiado,
    };

    crearBoleta(boleta);
    marcarComoPagado(fiadoPagando.id);
    setFiadoPagando(null);
    setMetodoPagoFiado("");
    alert(`Pago registrado. Boleta #${boleta.numero} creada.`);
    router.push("/historial");
  }

  function cancelarPago() {
    setFiadoPagando(null);
    setMetodoPagoFiado("");
  }

  function separarFechaHora(fechaCompleta: string) {
    const partes = fechaCompleta.split(",");
    const fecha = partes[0]?.trim() || fechaCompleta;
    const hora = partes[1]?.trim() || "";
    return { fecha, hora };
  }

  const fiadosPendientes = fiados.filter((f) => !f.pagado);
  const fiadosPagados = fiados.filter((f) => f.pagado);

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
          <h1>Gestión de Fiados - {usuario}</h1>
        </div>

        {fiadoPagando && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Registrar Pago</h2>
              <p><strong>Cliente:</strong> {fiadoPagando.cliente}</p>
              <p><strong>Total a cobrar:</strong> ${fiadoPagando.totalDeuda}</p>
              <p><strong>Fecha del fiado:</strong> {separarFechaHora(fiadoPagando.fechaInicial).fecha}</p>
              <p><strong>Hora del fiado:</strong> {separarFechaHora(fiadoPagando.fechaInicial).hora || "No registrada"}</p>
              <p><strong>Selecciona método de pago:</strong></p>
              <div className={styles.botonesMetodo}>
                <button
                  className={`${styles.btnMetodo} ${metodoPagoFiado === "Efectivo" ? styles.btnMetodoActivo : ""}`}
                  onClick={() => setMetodoPagoFiado("Efectivo")}
                >
                  Efectivo
                </button>
                <button
                  className={`${styles.btnMetodo} ${metodoPagoFiado === "Tarjeta" ? styles.btnMetodoActivo : ""}`}
                  onClick={() => setMetodoPagoFiado("Tarjeta")}
                >
                  Tarjeta
                </button>
              </div>
              <div className={styles.botonesModal}>
                <button className={styles.btnCancelar} onClick={cancelarPago}>
                  Cancelar
                </button>
                <button className={styles.btnPagar} onClick={confirmarPago}>
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        <section className={styles.seccion}>
          <h2>Fiados Pendientes ({fiadosPendientes.length})</h2>
          {fiadosPendientes.length === 0 ? (
            <p className={styles.sinDatos}>No hay fiados pendientes</p>
          ) : (
            fiadosPendientes.map((fiado, index) => (
              <div key={`${fiado.id}-${index}`} className={styles.fiadoCard}>
                <div className={styles.fiadoHeader}>
                  <div>
                    <h3 className={styles.fiadoTitulo}>Cliente: {fiado.cliente}</h3>
                    <p className={styles.info}><strong>Fecha del fiado:</strong> {separarFechaHora(fiado.fechaInicial).fecha}</p>
                    <p className={styles.info}><strong>Hora del fiado:</strong> {separarFechaHora(fiado.fechaInicial).hora || "No registrada"}</p>
                    <p className={styles.info}><strong>Vendedor:</strong> {fiado.vendedor}</p>
                  </div>
                  <div className={styles.acciones}>
                    <button
                      className={styles.btnPagar}
                      onClick={() => iniciarPago(fiado)}
                    >
                      Marcar pagado
                    </button>
                  </div>
                </div>
                <table className={styles.tablaMini}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fiado.productos.map((prod, idx) => (
                      <tr key={idx}>
                        <td>{prod.nombre}</td>
                        <td>${prod.precio}</td>
                        <td>{prod.cantidad}</td>
                        <td>${prod.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.fiadoFooter}>
                  <p className={styles.total}><strong>Total deuda: ${fiado.totalDeuda}</strong></p>
                </div>
              </div>
            ))
          )}
        </section>

        {fiadosPagados.length > 0 && (
          <section className={styles.seccion}>
            <h2>Fiados Pagados ({fiadosPagados.length})</h2>
            {fiadosPagados.map((fiado, index) => (
              <div key={`${fiado.id}-${index}`} className={`${styles.fiadoCard}`}>
                <h3 className={styles.fiadoTitulo}>Cliente: {fiado.cliente}</h3>
                <p className={styles.info}><strong>Fecha del fiado:</strong> {separarFechaHora(fiado.fechaInicial).fecha}</p>
                <p className={styles.info}><strong>Hora del fiado:</strong> {separarFechaHora(fiado.fechaInicial).hora || "No registrada"}</p>
                <p className={styles.info}><strong>Total pagado:</strong> ${fiado.totalDeuda}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}