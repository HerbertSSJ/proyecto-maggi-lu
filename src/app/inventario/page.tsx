"use client";

import { useState, useEffect } from "react";
import { Producto } from "@/types/Producto";
import { obtenerProductos, guardarProductos } from "@/utils/inventarioStorage";
import ProductoForm from "@/components/inventario/ProductoForm";

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const cargados = obtenerProductos();
    setProductos(cargados);
  }, []);

  function handleAgregar(
    datos: Omit<Producto, "id" | "fechaCreacion" | "responsable">
  ) {
    const listaActual = [...productos];
    const indiceExistente = listaActual.findIndex(
      (p) => p.nombre.toLowerCase() === datos.nombre.toLowerCase()
    );

    if (indiceExistente !== -1) {
      // Si el producto ya existe: sumar cantidad y actualizar precio
      listaActual[indiceExistente] = {
        ...listaActual[indiceExistente],
        cantidad: listaActual[indiceExistente].cantidad + datos.cantidad,
        precio: datos.precio,
      };
    } else {
      // Si no existe: crear nuevo producto
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

  return (
    <main className="contenido">
      <h1 className="tituloSeccion">Inventario — MIMImarket</h1>
      <ProductoForm onAgregar={handleAgregar} />
      <p style={{ marginTop: "16px", color: "#555" }}>
        Productos en inventario: {productos.length}
      </p>
    </main>
  );
}
