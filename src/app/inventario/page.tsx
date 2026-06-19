"use client";

import { useState, useEffect } from "react";
import { Producto } from "@/types/Producto";
import { obtenerProductos, guardarProductos } from "@/utils/inventarioStorage";
import ProductoForm from "@/components/inventario/ProductoForm";
import ProductoList from "@/components/inventario/ProductoList";

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

  return (
    <main className="contenido">
      <h1 className="tituloSeccion">Inventario — MIMImarket</h1>
      <ProductoForm onAgregar={handleAgregar} />
      <ProductoList
        productos={productos}
        onEliminarProducto={handleEliminarProducto}
      />
    </main>
  );
}
