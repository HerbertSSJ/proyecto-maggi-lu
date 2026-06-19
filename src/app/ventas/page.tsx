"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Producto } from "@/types/Producto";
import { Boleta, ItemCarrito } from "@/types/Boleta";
import { Fiado } from "@/types/Fiados";
import { obtenerProductos } from "@/utils/inventarioStorage";
import { crearBoleta, obtenerSiguienteNumero } from "@/utils/boletaStorage";
import { crearFiado } from "@/utils/fiadoStorage";
import styles from "./ventas.module.css";

export default function VentasPage() {
  const { usuario, cargando, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando, router]);

  useEffect(() => {
    setProductos(obtenerProductos());
  }, []);

  function agregarAlCarrito(producto: Producto) {
    if (producto.cantidad <= 0) {
      alert("Sin stock");
      return;
    }

    const existe = carrito.find((item) => item.id === producto.id);

    if (existe) {
      if (existe.cantidad >= producto.cantidad) {
        alert("No hay más stock");
        return;
      }
      const nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              subtotal: producto.precio * (item.cantidad + 1),
            }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          subtotal: producto.precio,
        },
      ]);
    }
  }

  function eliminarDelCarrito(id: number) {
    setCarrito(carrito.filter((item) => item.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  function finalizarBoleta() {
    if (carrito.length === 0) {
      alert("No hay productos en la boleta.");
      return;
    }

    if (!metodoPago) {
      alert("Debe seleccionar un método de pago.");
      return;
    }

    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const totalRedondeado = Math.round(total * 100) / 100;

    if (metodoPago === "Fiado") {
      const nombreClienteRaw = prompt("Ingrese el nombre del cliente para el fiado:");
      const nombreCliente =
        !nombreClienteRaw || nombreClienteRaw.trim() === ""
          ? "Cliente sin nombre"
          : nombreClienteRaw.trim();

      const nuevoFiado: Fiado = {
        id: Date.now(),
        cliente: nombreCliente,
        fechaInicial: new Date().toLocaleString("es-CL"),
        totalDeuda: totalRedondeado,
        productos: carrito,
        vendedor: usuario || "Desconocido",
        pagado: false,
      };

      crearFiado(nuevoFiado);
      setCarrito([]);
      setMetodoPago("");
      alert("Fiado registrado a nombre de: " + nombreCliente);
      router.push("/fiados");
      return;
    }

    const nombreClienteRaw = prompt("Ingrese el nombre del cliente (opcional):");
    const nombreCliente =
      !nombreClienteRaw || nombreClienteRaw.trim() === ""
        ? "Cliente sin nombre"
        : nombreClienteRaw.trim();

    const nuevaBoleta: Boleta = {
      id: Date.now(),
      numero: obtenerSiguienteNumero(),
      fecha: new Date().toLocaleString("es-CL"),
      usuario: usuario || "Desconocido",
      cliente: nombreCliente,
      items: carrito,
      total: totalRedondeado,
      metodo_pago: metodoPago,
    };

    crearBoleta(nuevaBoleta);
    setCarrito([]);
    setMetodoPago("");
    alert("Boleta #" + nuevaBoleta.numero + " creada para: " + nombreCliente);
  }

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

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
          <h1>Gestión de Ventas - {usuario}</h1>
        </div>

        <div className={styles.division}>
          <div className={styles.caja}>
            <h2 className={styles.tituloCaja}>Catálogo Rápido</h2>
            <input
              type="text"
              placeholder="Buscar Producto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={styles.inputBuscador}
            />
            <table border={1} className={styles.tablaMini}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Agregar</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>{producto.cantidad}</td>
                    <td>
                      <button
                        className={styles.btnAgregar}
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.cantidad === 0}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.caja}>
            <h2 className={styles.tituloCaja}>Boleta del Cliente</h2>

            {carrito.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999" }}>Carrito vacío</p>
            ) : (
              <>
                <table border={1} className={styles.tablaMini}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cant.</th>
                      <th>Total</th>
                      <th>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nombre}</td>
                        <td>${item.precio}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.subtotal}</td>
                        <td>
                          <button
                            className={styles.btnEliminar}
                            onClick={() => eliminarDelCarrito(item.id)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className={styles.totalTexto}>Total a Pagar: ${total}</h3>

                <h3 className={styles.metodoPago}>
                  Método de Pago: <span>{metodoPago || "No seleccionado"}</span>
                </h3>

                <div className={styles.botonesMetodo}>
                  <button className={styles.btnMetodo} onClick={() => setMetodoPago("Efectivo")}>
                    Efectivo
                  </button>
                  <button className={styles.btnMetodo} onClick={() => setMetodoPago("Tarjeta")}>
                    Tarjeta
                  </button>
                  <button className={styles.btnMetodo} onClick={() => setMetodoPago("Fiado")}>
                    Fiado
                  </button>
                </div>

                <div className={styles.botonesCarrito}>
                  <button className={styles.btnVaciar} onClick={vaciarCarrito}>
                    Vaciar Boleta
                  </button>
                  <button className={styles.btnFinalizar} onClick={finalizarBoleta}>
                    Finalizar Venta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}