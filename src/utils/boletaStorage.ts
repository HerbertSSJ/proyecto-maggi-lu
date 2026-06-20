import { Boleta } from "@/types/Boleta";

const STORAGE_KEY = "boletasMimi";
const COUNTER_KEY = "boletasContador";

export function obtenerBoletas(): Boleta[] {
  if (typeof window === "undefined") return [];
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) return [];
    return JSON.parse(datos) as Boleta[];
  } catch (error) {
    console.error("Error al leer boletas:", error);
    return [];
  }
}

function guardarBoletas(boletas: Boleta[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boletas));
}

export function obtenerSiguienteNumero(): number {
  if (typeof window === "undefined") return 1;
  try {
    const contador = localStorage.getItem(COUNTER_KEY);
    const numero = contador ? parseInt(contador, 10) + 1 : 1;
    localStorage.setItem(COUNTER_KEY, numero.toString());
    return numero;
  } catch {
    return 1;
  }
}

export function crearBoleta(boleta: Boleta): Boleta {
  const boletas = obtenerBoletas();
  boletas.push(boleta);
  guardarBoletas(boletas);
  return boleta;
}

export function obtenerBoletaPorId(id: number): Boleta | null {
  const boletas = obtenerBoletas();
  return boletas.find((b) => b.id === id) || null;
}

export function actualizarBoleta(id: number, cambios: Partial<Boleta>): Boleta | null {
  const boletas = obtenerBoletas();
  const indice = boletas.findIndex((b) => b.id === id);

  if (indice === -1) return null;

  // Fusionar campos existentes con los cambios — no reemplazar todo
  boletas[indice] = { ...boletas[indice], ...cambios, id };
  guardarBoletas(boletas);
  return boletas[indice];
}

export function eliminarBoleta(id: number): boolean {
  const boletas = obtenerBoletas();
  const indice = boletas.findIndex((b) => b.id === id);

  if (indice === -1) return false;

  boletas.splice(indice, 1);
  guardarBoletas(boletas);
  return true;
}