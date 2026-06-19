"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Fiado } from "@/types/Fiado";
import {
  obtenerFiados,
  crearFiado,
  marcarComoPagado,
  eliminarFiado,
  editarCliente,
} from "@/utils/fiadoStorage";
import { crearBoleta, obtenerSiguienteNumero } from "@/utils/boletaStorage";
import styles from "./fiados.module.css";

export default function FiadosPage() {
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fiados, setFiados] = useState<Fiado[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando]);

  useEffect(() => {
    setFiados(obtenerFiados());
  }, []);

  function handleMarcarPagado(fiado: Fiado) {
    if (!confirm(`¿Confirmar pago de $${fiado.totalDeuda} de ${fiado.cliente}?`)) return;

    const boleta = {
      id: Date.now(),
      numero: obtenerSiguienteNumero(),
      fecha: new Date().toLocaleDateString("es-CL"),
      usuario: usuario || "Desconocido",
      items: fiado.productos,
      total: fiado.totalDeuda,
      metodo_pago: `Fiado pagado por ${fiado.cliente}`,
    };

    crearBoleta(boleta);
    marcarComoPagado(fiado.id);
    setFiados(obtenerFiados());
    alert(`Pago registrado. Boleta #${boleta.numero} creada.`);
  }

  function handleEliminar(id: number) {
    if (!confirm("¿Eliminar este fiado?")) return;
    eliminarFiado(id);
    setFiados(fiados.filter((f) => f.id !== id));
    alert("Fiado eliminado");
  }

  function iniciarEdicion(fiado: Fiado) {
    setEditandoId(fiado.id);
    setNuevoNombre(fiado.cliente);
  }

  function guardarEdicion(id: number) {
    if (!nuevoNombre.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }
    editarCliente(id, nuevoNombre.trim());
    setFiados(obtenerFiados());
    setEditandoId(null);
    setNuevoNombre("");
    alert("Cliente actualizado");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setNuevoNombre("");
  }

  const fiadosPendientes = fiados.filter((f) => !f.pagado);
  const fiadosPagados = fiados.filter((f) => f.pagado);

  if (!usuario) return null;

  return (
    <div className={styles.contenedor}>

      {/* BOTÓN HAMBURGUESA - solo visible en móvil */}
      <button
        className={styles.btnHamburguesaDash}
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      {/* MENÚ LATERAL - siempre visible en desktop */}
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

      {/* ÁREA PRINCIPAL */}
      <main className={`${styles.contenido} ${menuAbierto ? styles.moverDerecha : ""}`}>
        <div className={styles.header}>
          <h1>Gestión de Fiados - {usuario}</h1>
        </div>

        <section className={styles.seccion}>
          <h2>Fiados Pendientes ({fiadosPendientes.length})</h2>

          {fiadosPendientes.length === 0 ? (
            <p className={styles.sinDatos}>No hay fiados pendientes</p>
          ) : (
            fiadosPendientes.map((fiado) => (
              <div key={fiado.id} className={styles.fiadoCard}>
                <div className={styles.fiadoHeader}>
                  <div>
                    {editandoId === fiado.id ? (
                      <div className={styles.editNombre}>
                        <input
                          type="text"
                          value={nuevoNombre}
                          onChange={(e) => setNuevoNombre(e.target.value)}
                          className={styles.inputEditar}
                        />
                        <button className={styles.btnGuardar} onClick={() => guardarEdicion(fiado.id)}>
                          Guardar
                        </button>
                        <button className={styles.btnCancelar} onClick={cancelarEdicion}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <h3>Cliente: {fiado.cliente}</h3>
                    )}
                    <p className={styles.info}><strong>Fecha:</strong> {fiado.fechaInicial}</p>
                    <p className={styles.info}><strong>Vendedor:</strong> {fiado.vendedor}</p>
                  </div>

                  <div className={styles.acciones}>
                    {editandoId !== fiado.id && (
                      <button className={styles.btnEditar} onClick={() => iniciarEdicion(fiado)}>
                        Editar cliente
                      </button>
                    )}
                    <button className={styles.btnPagar} onClick={() => handleMarcarPagado(fiado)}>
                      Marcar pagado
                    </button>
                    <button className={styles.btnEliminar} onClick={() => handleEliminar(fiado.id)}>
                      Eliminar
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
            {fiadosPagados.map((fiado) => (
              <div key={fiado.id} className={`${styles.fiadoCard} ${styles.pagado}`}>
                <h3>Cliente: {fiado.cliente}</h3>
                <p className={styles.info}><strong>Fecha:</strong> {fiado.fechaInicial}</p>
                <p className={styles.info}><strong>Total pagado: ${fiado.totalDeuda}</strong></p>
                <button className={styles.btnEliminar} onClick={() => handleEliminar(fiado.id)}>
                  Eliminar registro
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}