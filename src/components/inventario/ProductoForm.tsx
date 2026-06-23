"use client";

import { useState, useEffect } from "react";
import { Producto } from "@/types/Producto";
import styles from "@/app/inventario/inventario.module.css";

// datos de los formularios 
interface ProductoFormProps {
  onAgregar: (datos: Omit<Producto, "id" | "fechaCreacion" | "responsable">) => void;
  onActualizar?: (producto: Producto) => void;
  onCancelar?: () => void;
  productoEditando?: Producto | null;
}

// Mensajes de error 
interface ErroresForm {
  nombre?: string;
  precio?: string;
  cantidad?: string;
}

// Formulario para agregar o editar un producto
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

  // modo edicion
  useEffect(() => {
    if (productoEditando) {
      setNombre(productoEditando.nombre);
      setPrecio(String(productoEditando.precio));
      setCantidad(String(productoEditando.cantidad));
      setErrores({});
      setExito("");
    } else { //modo agregar
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

    setErrores(nuevosErrores); //contador
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
    <div className={styles.division}>
      <div className={styles.caja}>

        {/* El título cambia según si se está editando o agregando */}
        <h2 className={styles.tituloCaja}>
          {productoEditando ? "Editar Producto" : "Agregar Producto"}
        </h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Campo: nombre */}
          <div className={styles.grupoInput}>
            <label htmlFor="nombre">Nombre del producto</label>
            <input
              id="nombre"
              type="text"
              className={styles.inputBuscador}
              placeholder="Ej: Leche 1L"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && (
              <p className={styles.errorTexto}>{errores.nombre}</p>
            )}
          </div>

          {/* Campo: precio */}
          <div className={styles.grupoInput}>
            <label htmlFor="precio">Precio ($)</label>
            <input
              id="precio"
              type="number"
              className={styles.inputBuscador}
              placeholder="Ej: 1500"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="1"
            />
            {errores.precio && (
              <p className={styles.errorTexto}>{errores.precio}</p>
            )}
          </div>

          {/* Campo: cantidad */}
          <div className={styles.grupoInput}>
            <label htmlFor="cantidad">Cantidad en stock</label>
            <input
              id="cantidad"
              type="number"
              className={styles.inputBuscador}
              placeholder="Ej: 50"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="0"
            />
            {errores.cantidad && (
              <p className={styles.errorTexto}>{errores.cantidad}</p>
            )}
          </div>

          <button type="submit" className={styles.btnMini}>
            {productoEditando ? "Guardar Cambios" : "Agregar Producto"}
          </button>

          {/* Botón de cancelar: solo visible en modo edición */}
          {productoEditando && onCancelar && (
            <button
              type="button"
              className={styles.btnMini}
              style={{ marginLeft: "8px" }}
              onClick={onCancelar}
            >
              Cancelar edición
            </button>
          )}
        </form>

        {/* Mensaje de éxito al guardar */}
        {exito && (
          <p className={styles.exitoTexto}>{exito}</p>
        )}
      </div>
    </div>
  );
}
