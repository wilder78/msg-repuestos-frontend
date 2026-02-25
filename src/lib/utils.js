import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Permite combinar clases de Tailwind sin conflictos de especificidad.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}