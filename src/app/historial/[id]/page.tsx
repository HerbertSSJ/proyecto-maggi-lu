"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Boleta, ItemCarrito } from "@/types/Boleta";
import { obtenerBoletas, actualizarBoleta } from "@/utils/boletaStorage";
import styles from "../historial.module.css";

export default function DetalleBoleta() {
  const params = useParams();
  const id = Array.isArray(params.id) ? Number(params.id[0]) : Number(params.id);
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const [boleta, setBoleta] = useState<Boleta | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [editando, setEditando] = useState(false);

  const [editFecha, setEditFecha] = useState("");
  const [editHoraTexto, setEditHoraTexto] = useState("");
  const [editAmPm, setEditAmPm] = useState("a. m.");
  const [editCliente, setEditCliente] = useState("");
  const [editMetodoPago, setEditMetodoPago] = useState("");
  const [editItems, setEditItems] = useState<ItemCarrito[]>([]);

  const [errorFecha, setErrorFecha] = useState("");
  const [errorHora, setErrorHora] = useState("");
  const [errorCliente, setErrorCliente] = useState("");
  const [errorMetodo, setErrorMetodo] = useState("");

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando]);

  useEffect(() => {
    if (!id) return;
    const lista = obtenerBoletas();
    const encontrada = lista.find((b) => b.id === id);
    setBoleta(encontrada || null);
  }, [id]);

  function separarFechaHora(fechaCompleta: string) {
    const partes = fechaCompleta.split(",");
    const fecha = partes[0]?.trim() || fechaCompleta;
    const horaCompleta = partes[1]?.trim() || "";
    return { fecha, horaCompleta };
  }

  function separarHoraAmPm(horaCompleta: string) {
    const amPmMatch = horaCompleta.match(/(a\.\s*m\.|p\.\s*m\.)/i);
    const amPm = amPmMatch ? amPmMatch[0] : "a. m.";
    const horaTexto = horaCompleta.replace(/(a\.\s*m\.|p\.\s*m\.)/i, "").trim();
    return { horaTexto, amPm };
  }

  function iniciarEdicion() {
    if (!boleta) return;
    const { fecha, horaCompleta } = separarFechaHora(boleta.fecha);
    const { horaTexto, amPm } = separarHoraAmPm(horaCompleta);
    setEditando(true);
    setEditFecha(fecha);
    setEditHoraTexto(horaTexto);
    setEditAmPm(amPm || "a. m.");
    setEditCliente(boleta.cliente || "");
    setEditMetodoPago(boleta.metodo_pago || "");
    setEditItems(boleta.items.map((item) => ({ ...item })));
    setErrorFecha("");
    setErrorHora("");
    setErrorCliente("");
    setErrorMetodo("");
  }

  function cancelarEdicion() {
    setEditando(false);
    setErrorFecha("");
    setErrorHora("");
    setErrorCliente("");
    setErrorMetodo("");
  }

  function validarFecha(valor: string): boolean {
    const regex = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/;
    return regex.test(valor.trim());
  }

  function validarHora(valor: string): boolean {
    if (valor.trim() === "") return false;
    const regex = /^\d{1,2}:\d{2}(:\d{2})?$/;
    return regex.test(valor.trim());
  }

  function validarNombre(valor: string): boolean {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(valor.trim());
  }

  function handleFechaChange(valor: string) {
    setEditFecha(valor);
    if (!validarFecha(valor)) {
      setErrorFecha("Formato inválido. Use DD-MM-YYYY (ej: 19-06-2026)");
    } else {
      setErrorFecha("");
    }
  }

  function handleHoraChange(valor: string) {
    setEditHoraTexto(valor);
    if (valor.trim() === "") {
      setErrorHora("La hora es obligatoria.");
    } else if (!validarHora(valor)) {
      setErrorHora("Formato inválido. Use H:MM:SS (ej: 7:39:05)");
    } else {
      setErrorHora("");
    }
  }

  function handleClienteChange(valor: string) {
    if (/\d/.test(valor)) {
      setErrorCliente("El nombre no puede contener números");
      return;
    }
    setEditCliente(valor);
    if (valor.trim() === "") {
      setErrorCliente("");
    } else if (!validarNombre(valor)) {
      setErrorCliente("Solo se permiten letras y espacios");
    } else {
      setErrorCliente("");
    }
  }

  function actualizarItem(idx: number, campo: keyof ItemCarrito, valor: string) {
    const nuevosItems = [...editItems];
    if (campo === "precio" || campo === "cantidad") {
      const numero = Number(valor);
      if (numero < 0) return;
      nuevosItems[idx] = {
        ...nuevosItems[idx],
        [campo]: numero,
        subtotal:
          campo === "precio"
            ? numero * nuevosItems[idx].cantidad
            : nuevosItems[idx].precio * numero,
      };
    } else {
      nuevosItems[idx] = { ...nuevosItems[idx], [campo]: valor };
    }
    setEditItems(nuevosItems);
  }

  function calcularTotal() {
    return editItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  function guardarEdicion() {
    if (!boleta) return;
    let valido = true;

    if (!validarFecha(editFecha)) {
      setErrorFecha("Formato inválido. Use DD-MM-YYYY (ej: 19-06-2026)");
      valido = false;
    }

    if (!validarHora(editHoraTexto)) {
      setErrorHora(
        editHoraTexto.trim() === ""
          ? "La hora es obligatoria."
          : "Formato inválido. Use H:MM:SS (ej: 7:39:05)"
      );
      valido = false;
    }

    if (editCliente.trim() !== "" && !validarNombre(editCliente)) {
      setErrorCliente("El nombre solo puede contener letras y espacios");
      valido = false;
    }

    if (!editMetodoPago) {
      setErrorMetodo("Debe seleccionar un método de pago");
      valido = false;
    }

    if (!valido) return;

    const fechaCompleta = `${editFecha.trim()}, ${editHoraTexto.trim()} ${editAmPm}`;

    const boletaActualizada: Partial<Boleta> = {
      numero: boleta.numero,
      usuario: boleta.usuario,
      fecha: fechaCompleta,
      cliente: editCliente.trim() || "Cliente sin nombre",
      metodo_pago: editMetodoPago,
      items: editItems,
      total: Math.round(calcularTotal() * 100) / 100,
    };

    actualizarBoleta(boleta.id, boletaActualizada);

    const listaActualizada = obtenerBoletas();
    const boletaRecargada = listaActualizada.find((b) => b.id === boleta.id);
    setBoleta(boletaRecargada || null);
    setEditando(false);
    alert("Boleta actualizada.");
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
          <h1>Detalle de Boleta - {usuario}</h1>
        </div>

        <section className={styles.historialSeccion}>
          <button
            onClick={() => router.push("/historial")}
            className={styles.btnCancelar}
            style={{ marginBottom: "20px" }}
          >
            ← Volver al Historial
          </button>

          {boleta === null ? (
            <p className={styles.sinDatos}>Boleta no encontrada.</p>
          ) : (
            <div className={styles.boletaCard}>
              <div className={styles.boletaHeader}>
                <div>
                  <h3>Boleta #{boleta.numero || boleta.id}</h3>

                  {editando ? (
                    <>
                      <div className={styles.campoEdicion}>
                        <label>Fecha:</label>
                        <div>
                          <input
                            type="text"
                            value={editFecha}
                            onChange={(e) => handleFechaChange(e.target.value)}
                            className={`${styles.inputEdicion} ${errorFecha ? styles.inputError : ""}`}
                            placeholder="DD-MM-YYYY"
                          />
                          {errorFecha && <p className={styles.errorTexto}>{errorFecha}</p>}
                        </div>
                      </div>

                      <div className={styles.campoEdicion}>
                        <label>Hora:</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <div>
                            <input
                              type="text"
                              value={editHoraTexto}
                              onChange={(e) => handleHoraChange(e.target.value)}
                              className={`${styles.inputEdicion} ${errorHora ? styles.inputError : ""}`}
                              placeholder="H:MM:SS"
                              style={{ width: "100px" }}
                            />
                            {errorHora && <p className={styles.errorTexto}>{errorHora}</p>}
                          </div>
                          <select
                            value={editAmPm}
                            onChange={(e) => setEditAmPm(e.target.value)}
                            className={styles.inputEdicion}
                            style={{ width: "90px" }}
                          >
                            <option value="a. m.">a. m.</option>
                            <option value="p. m.">p. m.</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.campoEdicion}>
                        <label>Cliente:</label>
                        <div>
                          <input
                            type="text"
                            value={editCliente}
                            onChange={(e) => handleClienteChange(e.target.value)}
                            className={`${styles.inputEdicion} ${errorCliente ? styles.inputError : ""}`}
                            placeholder="Nombre del cliente"
                          />
                          {errorCliente && <p className={styles.errorTexto}>{errorCliente}</p>}
                        </div>
                      </div>
                      <p className={styles.info}><strong>Vendedor:</strong> {boleta.usuario}</p>
                    </>
                  ) : (
                    <>
                      <p className={styles.info}>
                        <strong>Fecha:</strong> {separarFechaHora(boleta.fecha).fecha}
                      </p>
                      <p className={styles.info}>
                        <strong>Hora:</strong> {separarFechaHora(boleta.fecha).horaCompleta || "No registrada"}
                      </p>
                      <p className={styles.info}>
                        <strong>Cliente:</strong> {boleta.cliente || "Sin nombre"}
                      </p>
                      <p className={styles.info}>
                        <strong>Vendedor:</strong> {boleta.usuario}
                      </p>
                    </>
                  )}
                </div>

                <div className={styles.boletaAcciones}>
                  {editando ? (
                    <>
                      <button className={styles.btnGuardar} onClick={guardarEdicion}>
                        Guardar
                      </button>
                      <button className={styles.btnCancelar} onClick={cancelarEdicion}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button className={styles.btnEditar} onClick={iniciarEdicion}>
                      Editar
                    </button>
                  )}
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
                  {editando ? (
                    editItems.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={item.nombre}
                            onChange={(e) => actualizarItem(idx, "nombre", e.target.value)}
                            className={styles.inputTabla}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.precio}
                            onChange={(e) => actualizarItem(idx, "precio", e.target.value)}
                            className={styles.inputTabla}
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => actualizarItem(idx, "cantidad", e.target.value)}
                            className={styles.inputTabla}
                            min="1"
                          />
                        </td>
                        <td>${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    boleta.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.nombre}</td>
                        <td>${item.precio}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className={styles.boletaFooter}>
                <p className={styles.total}>
                  <strong>Total:</strong> $
                  {editando ? calcularTotal().toFixed(2) : boleta.total.toFixed(2)}
                </p>

                {editando ? (
                  <div className={styles.metodoPagoEdit}>
                    <label>Método de Pago:</label>
                    <div>
                      <select
                        value={editMetodoPago}
                        onChange={(e) => {
                          setEditMetodoPago(e.target.value);
                          setErrorMetodo("");
                        }}
                        className={errorMetodo ? styles.inputError : ""}
                      >
                        <option value="">Selecciona...</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                      </select>
                      {errorMetodo && <p className={styles.errorTexto}>{errorMetodo}</p>}
                    </div>
                  </div>
                ) : (
                  <p className={styles.info}>
                    <strong>Método de Pago:</strong> {boleta.metodo_pago || "No especificado"}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}