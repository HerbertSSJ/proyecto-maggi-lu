"use client";

import { Producto } from "@/types/Producto";

interface ProductoListProps {
  productos: Producto[];
  onEliminarProducto: (id: number) => void;
  onEditarProducto: (producto: Producto) => void;
}

export default function ProductoList({
  productos,
  onEliminarProducto,
  onEditarProducto,
}: ProductoListProps) {
  if (productos.length === 0) {
    return (
      <p style={{ marginTop: "16px", color: "#888" }}>
        No hay productos en el inventario.
      </p>
    );
  }

  return (
    <div className="division" style={{ marginTop: "24px" }}>
      <div className="caja">
        <h2 className="tituloCaja">Listado de productos</h2>
        <table className="tablaMini">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Fecha de creación</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>
                  {producto.precio.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </td>
                <td>{producto.cantidad}</td>
                <td>{producto.fechaCreacion}</td>
                <td>{producto.responsable}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btnMini"
                    onClick={() => onEditarProducto(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btnMini"
                    onClick={() => onEliminarProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
