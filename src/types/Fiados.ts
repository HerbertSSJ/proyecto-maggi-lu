import { ItemCarrito } from "@/types/Boleta";

export interface Fiado {
  id: number;
  cliente: string;
  fechaInicial: string;
  totalDeuda: number;
  productos: ItemCarrito[];
  vendedor: string;
  pagado: boolean;
}