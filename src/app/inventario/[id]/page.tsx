"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Producto } from "@/types/Producto";
import { obtenerProductos } from "@/utils/inventarioStorage";

type EstadoProducto = Producto | null | "no-encontrado";

export default function DetalleProductoPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [estado, setEstado] = useState<EstadoProducto>(null);

  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [usuario, cargando, router]);

  useEffect(() => {
    const idParam = params?.id;
    const idNumerico = Number(idParam);

    if (!idParam || isNaN(idNumerico)) {
      setEstado("no-encontrado");
      return;
    }

    const productos = obtenerProductos();
    const encontrado = productos.find((p) => p.id === idNumerico);

    setEstado(encontrado ?? "no-encontrado");
  }, [params]);

  if (cargando) {
    return (
      <main className="contenido">
        <p style={{ color: "#888", marginTop: "16px" }}>Cargando...</p>
      </main>
    );
  }

  if (!usuario) return null;

  if (estado === null) {
    return (
      <main className="contenido">
        <p style={{ color: "#888", marginTop: "16px" }}>Cargando producto...</p>
      </main>
    );
  }

  if (estado === "no-encontrado") {
    return (
      <main className="contenido">
        <h1 className="tituloSeccion">Detalle de Producto</h1>
        <div className="division" style={{ marginTop: "24px" }}>
          <div className="caja">
            <p style={{ color: "#c0392b", marginBottom: "16px" }}>
              Producto no encontrado.
            </p>
            <Link href="/inventario" className="btnMini">
              Volver al inventario
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="contenido">
      <h1 className="tituloSeccion">Detalle de Producto</h1>
      <div className="division" style={{ marginTop: "24px" }}>
        <div className="caja">
          <h2 className="tituloCaja">{estado.nombre}</h2>
          <table className="tablaMini" style={{ marginBottom: "20px" }}>
            <tbody>
              <tr>
                <th>Nombre</th>
                <td>{estado.nombre}</td>
              </tr>
              <tr>
                <th>Precio</th>
                <td>
                  {estado.precio.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </td>
              </tr>
              <tr>
                <th>Stock</th>
                <td>{estado.cantidad}</td>
              </tr>
              <tr>
                <th>Fecha de creación</th>
                <td>{estado.fechaCreacion}</td>
              </tr>
              <tr>
                <th>Responsable</th>
                <td>{estado.responsable}</td>
              </tr>
            </tbody>
          </table>
          <Link href="/inventario" className="btnMini">
            Volver al inventario
          </Link>
        </div>
      </div>
    </main>
  );
}
