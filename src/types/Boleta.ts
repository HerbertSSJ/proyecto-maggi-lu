export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export interface Boleta {
  id: number;
  numero: number;
  fecha: string;
  usuario: string;
  cliente: string;
  items: ItemCarrito[];
  total: number;
  metodo_pago?: string;
}