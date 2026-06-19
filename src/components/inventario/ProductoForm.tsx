"use client";

import { useState, useEffect } from "react";
import { Producto } from "@/types/Producto";

interface ProductoFormProps {
  onAgregar: (datos: Omit<Producto, "id" | "fechaCreacion" | "responsable">) => void;
  onActualizar?: (producto: Producto) => void;
  onCancelar?: () => void;
  productoEditando?: Producto | null;
}

interface ErroresForm {
  nombre?: string;
  precio?: string;
  cantidad?: string;
}

export default function ProductoForm({
  onAgregar,
  onActualizar,
  onCancelar,
  productoEditando,
}: ProductoFormProps) {
  const [nombre, setNombre] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("");
  const [errores, setErrores] = useState<ErroresForm>({});
  const [exito, setExito] = useState<string>("");

  useEffect(() => {
    if (productoEditando) {
      setNombre(productoEditando.nombre);
      setPrecio(String(productoEditando.precio));
      setCantidad(String(productoEditando.cantidad));
      setErrores({});
      setExito("");
    } else {
      setNombre("");
      setPrecio("");
      setCantidad("");
      setErrores({});
      setExito("");
    }
  }, [productoEditando]);

  function validar(): boolean {
    const nuevosErrores: ErroresForm = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!precio.trim()) {
      nuevosErrores.precio = "El precio es obligatorio.";
    } else if (Number(precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor a 0.";
    }

    if (!cantidad.trim()) {
      nuevosErrores.cantidad = "La cantidad es obligatoria.";
    } else if (Number(cantidad) < 0) {
      nuevosErrores.cantidad = "La cantidad no puede ser negativa.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setExito("");

    if (!validar()) return;

    if (productoEditando && onActualizar) {
      onActualizar({
        ...productoEditando,
        nombre: nombre.trim(),
        precio: Number(precio),
        cantidad: Number(cantidad),
      });
      setExito("Producto actualizado correctamente.");
    } else {
      onAgregar({
        nombre: nombre.trim(),
        precio: Number(precio),
        cantidad: Number(cantidad),
      });
      setExito("Producto guardado correctamente.");
      setNombre("");
      setPrecio("");
      setCantidad("");
      setErrores({});
    }
  }

  return (
    <div className="division">
      <div className="caja">
        <h2 className="tituloCaja">
          {productoEditando ? "Editar Producto" : "Agregar Producto"}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="nombre">Nombre del producto</label>
            <input
              id="nombre"
              type="text"
              className="inputBuscador"
              placeholder="Ej: Leche 1L"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && (
              <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
                {errores.nombre}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="precio">Precio ($)</label>
            <input
              id="precio"
              type="number"
              className="inputBuscador"
              placeholder="Ej: 1500"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="1"
            />
            {errores.precio && (
              <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
                {errores.precio}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="cantidad">Cantidad en stock</label>
            <input
              id="cantidad"
              type="number"
              className="inputBuscador"
              placeholder="Ej: 50"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="0"
            />
            {errores.cantidad && (
              <p style={{ color: "red", fontSize: "0.85rem", marginTop: "4px" }}>
                {errores.cantidad}
              </p>
            )}
          </div>

          <button type="submit" className="btnMini">
            {productoEditando ? "Guardar Cambios" : "Agregar Producto"}
          </button>
          {productoEditando && onCancelar && (
            <button
              type="button"
              className="btnMini"
              style={{ marginLeft: "8px" }}
              onClick={onCancelar}
            >
              Cancelar edición
            </button>
          )}
        </form>

        {exito && (
          <p style={{ color: "green", marginTop: "12px", fontWeight: "bold" }}>
            {exito}
          </p>
        )}
      </div>
    </div>
  );
}
