import { Fiado } from "@/types/Fiado";

const STORAGE_KEY = "listaDeudores";

export function obtenerFiados(): Fiado[] {
  if (typeof window === "undefined") return [];
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) return [];
    return JSON.parse(datos) as Fiado[];
  } catch {
    console.error("Error al leer listaDeudores desde localStorage");
    return [];
  }
}

export function guardarFiados(fiados: Fiado[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fiados));
}

export function crearFiado(fiado: Fiado): void {
  const fiados = obtenerFiados();
  fiados.push(fiado);
  guardarFiados(fiados);
}

export function marcarComoPagado(id: number): void {
  const fiados = obtenerFiados();
  const indice = fiados.findIndex((f) => f.id === id);
  if (indice !== -1) {
    fiados[indice].pagado = true;
    guardarFiados(fiados);
  }
}

export function eliminarFiado(id: number): void {
  const fiados = obtenerFiados();
  const filtrados = fiados.filter((f) => f.id !== id);
  guardarFiados(filtrados);
}

export function editarCliente(id: number, nuevoNombre: string): void {
  const fiados = obtenerFiados();
  const indice = fiados.findIndex((f) => f.id === id);
  if (indice !== -1) {
    fiados[indice].cliente = nuevoNombre;
    guardarFiados(fiados);
  }
}