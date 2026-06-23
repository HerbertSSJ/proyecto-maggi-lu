import { Producto } from "@/types/Producto";
const STORAGE_KEY = "inventarioMimi";

export function obtenerProductos(): Producto[] {
  if (typeof window === "undefined") return [];

  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) return [];
    return JSON.parse(datos) as Producto[];
  } catch {
    console.error("Error al leer inventarioMimi desde localStorage");
    return [];
  }
}

export function guardarProductos(productos: Producto[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}
