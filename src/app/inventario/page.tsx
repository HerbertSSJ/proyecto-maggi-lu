"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Producto } from "@/types/Producto";
import { obtenerProductos, guardarProductos } from "@/utils/inventarioStorage";
import ProductoForm from "@/components/inventario/ProductoForm";
import ProductoList from "@/components/inventario/ProductoList";

export default function InventarioPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando, router]);

  useEffect(() => {
    const cargados = obtenerProductos();
    setProductos(cargados);
  }, []);

  if (cargando) {
    return <main className="contenido"><p>Cargando...</p></main>;
  }

  if (!usuario) return null;

  function handleAgregar(
    datos: Omit<Producto, "id" | "fechaCreacion" | "responsable">
  ) {
    const listaActual = [...productos];
    const indiceExistente = listaActual.findIndex(
      (p) => p.nombre.toLowerCase() === datos.nombre.toLowerCase()
    );

    if (indiceExistente !== -1) {
      listaActual[indiceExistente] = {
        ...listaActual[indiceExistente],
        cantidad: listaActual[indiceExistente].cantidad + datos.cantidad,
        precio: datos.precio,
      };
    } else {
      const nuevoProducto: Producto = {
        id: Date.now(),
        nombre: datos.nombre,
        precio: datos.precio,
        cantidad: datos.cantidad,
        fechaCreacion: new Date().toLocaleDateString(),
        responsable: "Administrador",
      };
      listaActual.push(nuevoProducto);
    }

    setProductos(listaActual);
    guardarProductos(listaActual);
  }

  function handleEliminarProducto(id: number) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmar) return;

    const listaActualizada = productos.filter((p) => p.id !== id);
    setProductos(listaActualizada);
    guardarProductos(listaActualizada);
  }

  function handleEditarProducto(producto: Producto) {
    setProductoEditando(producto);
  }

  function handleActualizarProducto(productoActualizado: Producto) {
    const listaActualizada = productos.map((p) =>
      p.id === productoActualizado.id ? productoActualizado : p
    );
    setProductos(listaActualizada);
    guardarProductos(listaActualizada);
    setProductoEditando(null);
  }

  function handleCancelarEdicion() {
    setProductoEditando(null);
  }

  const productosFiltrados = busqueda.trim() === ""
    ? productos
    : productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );

  return (
    <main className="contenido">
      <h1 className="tituloSeccion">Inventario — MIMImarket</h1>
      <ProductoForm
        onAgregar={handleAgregar}
        onActualizar={handleActualizarProducto}
        onCancelar={handleCancelarEdicion}
        productoEditando={productoEditando}
      />
      <div className="division" style={{ marginTop: "24px" }}>
        <div className="caja">
          <h2 className="tituloCaja">Buscar producto</h2>
          <input
            id="buscador-inventario"
            type="text"
            className="inputBuscador"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      <ProductoList
        productos={productosFiltrados}
        onEliminarProducto={handleEliminarProducto}
        onEditarProducto={handleEditarProducto}
      />
    </main>
  );
}
