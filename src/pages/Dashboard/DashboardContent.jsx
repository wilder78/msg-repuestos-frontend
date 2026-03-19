import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Truck,
} from "lucide-react";

// Importamos el hook
import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardContent() {
  const {
    totalVentasHoy,
    pedidosPendientes,
    clientesAtendidos,
    tiempoPromedioEntrega,
    ventasPorCategoria,
    inventarioCritico,
    marcasPopulares,
    cn,
  } = useDashboard();

  const metrics = [
    {
      title: "Ventas Hoy",
      val: `$${totalVentasHoy.toLocaleString()}`,
      icon: DollarSign,
      color: "from-blue-600 to-blue-700",
      sub: "+12.5% vs ayer",
    },
    {
      title: "Pedidos Pendientes",
      val: pedidosPendientes,
      icon: Package,
      color: "from-orange-500 to-orange-600",
      sub: "Promedio 1.8 días",
    },
    {
      title: "Clientes Atendidos",
      val: clientesAtendidos,
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      sub: "+8.3% esta semana",
    },
    {
      title: "Tiempo Entrega",
      val: `${tiempoPromedioEntrega} días`,
      icon: Truck,
      color: "from-purple-600 to-purple-700",
      sub: "Objetivo: 2.0 días",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Principal
          </h1>
          <p className="text-slate-500">
            Resumen ejecutivo de operaciones MSG Repuestos
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Online
          </Badge>
          <div className="text-right border-l pl-4 border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Actualizado
            </p>
            <p className="text-sm font-medium text-slate-700">Hoy, 14:35</p>
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, i) => (
          <Card
            key={i}
            className={cn(
              "border-none text-white bg-gradient-to-br shadow-lg",
              item.color,
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium opacity-90">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.val}</div>
              <p className="text-xs mt-1 opacity-80 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> {item.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="ventas" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ventas por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ventasPorCategoria}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="categoria"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} />
                    <Bar
                      dataKey="ventas"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Marcas Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marcasPopulares}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="porcentaje"
                    >
                      {marcasPopulares.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventario">
          <Card className="border-red-100 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Stock Crítico
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {inventarioCritico.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 shadow-sm"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.producto}</p>
                    <p className="text-xs text-slate-500">{item.proveedor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{item.stock} uds</p>
                    <Badge className="bg-red-600 text-white">Reordenar</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
