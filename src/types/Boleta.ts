// ItemCarrito - Un producto dentro de una boleta
export interface ItemCarrito {
  id: number;           // ID del producto
  nombre: string;
  precio: number;       // Precio unitario en el momento de venta
  cantidad: number;
  subtotal: number;     // precio * cantidad
}

// Boleta - Documento de venta
export interface Boleta {
  id: number;           // ID único (timestamp)
  numero: number;       // Número secuencial legible (#1, #2, #3...)
  fecha: string;        // Fecha en formato local
  usuario: string;      // Quién hizo la venta (Ignacio o Herbert)
  items: ItemCarrito[]; // Los productos vendidos
  total: number;        // Suma de todos los subtotales
  metodo_pago?: string; // Cómo se pagó (Efectivo, Tarjeta, Fiado, etc)
}

