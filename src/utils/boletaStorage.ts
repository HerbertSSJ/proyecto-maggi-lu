import { Boleta } from "@/types/Boleta";

const STORAGE_KEY = "boletasMimi";
const COUNTER_KEY = "boletasContador";

// CREATE - Obtener todas las boletas
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

// Guardar boletas en localStorage
function guardarBoletas(boletas: Boleta[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boletas));
}

// Obtener siguiente número secuencial
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

// CREATE - Crear nueva boleta
export function crearBoleta(boleta: Boleta): Boleta {
  const boletas = obtenerBoletas();
  boletas.push(boleta);
  guardarBoletas(boletas);
  return boleta;
}

// READ - Obtener una boleta por ID
export function obtenerBoletaPorId(id: number): Boleta | null {
  const boletas = obtenerBoletas();
  return boletas.find((b) => b.id === id) || null;
}

// UPDATE - Actualizar una boleta
export function actualizarBoleta(id: number, boletaActualizada: Boleta): Boleta | null {
  const boletas = obtenerBoletas();
  const indice = boletas.findIndex((b) => b.id === id);

  if (indice === -1) return null;

  boletas[indice] = boletaActualizada;
  guardarBoletas(boletas);
  return boletas[indice];
}

// DELETE - Eliminar una boleta
export function eliminarBoleta(id: number): boolean {
  const boletas = obtenerBoletas();
  const indice = boletas.findIndex((b) => b.id === id);

  if (indice === -1) return false;

  boletas.splice(indice, 1);
  guardarBoletas(boletas);
  return true;
}
