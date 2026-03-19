// src/hooks/useDashboard.js
import { useMemo } from "react";

export function useDashboard() {
  // En el futuro, aquí podrías hacer un fetch a tu API
  const stats = useMemo(() => ({
    totalVentasHoy: 28500,
    pedidosPendientes: 47,
    clientesAtendidos: 156,
    tiempoPromedioEntrega: 2.3,
  }), []);

  const dataCharts = {
    ventasPorCategoria: [
      { categoria: "Frenos", ventas: 45000 },
      { categoria: "Motor", ventas: 38000 },
      { categoria: "Suspensión", ventas: 32000 },
      { categoria: "Eléctricos", ventas: 28000 },
      { categoria: "Carrocería", ventas: 25000 },
      { categoria: "Filtros", ventas: 22000 },
    ],
    inventarioCritico: [
      { producto: "Pastillas de freno Honda", stock: 5, minimo: 20, proveedor: "AutoParts SA" },
      { producto: "Filtro aceite Yamaha", stock: 8, minimo: 25, proveedor: "MotoSupply" },
      { producto: "Cadena transmisión 520", stock: 12, minimo: 30, proveedor: "ChainTech" },
      { producto: "Bujía NGK CR8E", stock: 15, minimo: 50, proveedor: "NGK Direct" },
    ],
    marcasPopulares: [
      { marca: "Honda", porcentaje: 35, color: "#dc2626" },
      { marca: "Yamaha", porcentaje: 28, color: "#2563eb" },
      { marca: "Kawasaki", porcentaje: 20, color: "#16a34a" },
      { marca: "Suzuki", porcentaje: 12, color: "#ea580c" },
      { marca: "Otras", porcentaje: 5, color: "#6b7280" },
    ],
    ventasMensuales: [
      { mes: "Ene", ventas: 145000, objetivo: 160000 },
      { mes: "Feb", ventas: 132000, objetivo: 160000 },
      { mes: "Mar", ventas: 178000, objetivo: 160000 },
      { mes: "Abr", ventas: 165000, objetivo: 160000 },
      { mes: "May", ventas: 189000, objetivo: 160000 },
      { mes: "Jun", ventas: 195000, objetivo: 160000 },
    ]
  };

  // Función auxiliar para concatenar clases (similar a clsx)
  const cn = (...classes) => classes.filter(Boolean).join(" ");

  return {
    ...stats,
    ...dataCharts,
    cn
  };
}