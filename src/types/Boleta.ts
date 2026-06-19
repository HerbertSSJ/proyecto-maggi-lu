import { Boleta } from "@/types/Boleta";

const STORAGE_KEY = "historialVentas";

export function obtenerBoletas(): Boleta[] {
  if (typeof window === "undefined") return [];
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) return [];
    return JSON.parse(datos) as Boleta[];
  } catch {
    console.error("Error al leer historialVentas desde localStorage");
    return [];
  }
}

export function guardarBoletas(boletas: Boleta[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boletas));
}

export function crearBoleta(boleta: Boleta): void {
  const boletas = obtenerBoletas();
  boletas.push(boleta);
  guardarBoletas(boletas);
}

export function actualizarBoleta(id: number, cambios: Partial<Boleta>): void {
  const boletas = obtenerBoletas();
  const indice = boletas.findIndex((b) => b.id === id);
  if (indice !== -1) {
    boletas[indice] = { ...boletas[indice], ...cambios };
    guardarBoletas(boletas);
  }
}

export function eliminarBoleta(id: number): void {
  const boletas = obtenerBoletas();
  const filtradas = boletas.filter((b) => b.id !== id);
  guardarBoletas(filtradas);
}

export function obtenerSiguienteNumero(): number {
  const boletas = obtenerBoletas();
  if (boletas.length === 0) return 1;
  const maxNumero = Math.max(...boletas.map((b) => b.numero));
  return maxNumero + 1;
}