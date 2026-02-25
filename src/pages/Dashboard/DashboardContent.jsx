import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
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
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  Wrench,
  Truck,
} from "lucide-react";

const ventasPorCategoria = [
  { categoria: "Frenos", ventas: 45000 },
  { categoria: "Motor", ventas: 38000 },
  { categoria: "Suspensión", ventas: 32000 },
  { categoria: "Eléctricos", ventas: 28000 },
  { categoria: "Carrocería", ventas: 25000 },
  { categoria: "Filtros", ventas: 22000 },
];

const inventarioCritico = [
  {
    producto: "Pastillas de freno Honda",
    stock: 5,
    minimo: 20,
    proveedor: "AutoParts SA",
  },
  {
    producto: "Filtro aceite Yamaha",
    stock: 8,
    minimo: 25,
    proveedor: "MotoSupply",
  },
  {
    producto: "Cadena transmisión 520",
    stock: 12,
    minimo: 30,
    proveedor: "ChainTech",
  },
  {
    producto: "Bujía NGK CR8E",
    stock: 15,
    minimo: 50,
    proveedor: "NGK Direct",
  },
];

const marcasPopulares = [
  { marca: "Honda", porcentaje: 35, color: "#dc2626" },
  { marca: "Yamaha", porcentaje: 28, color: "#2563eb" },
  { marca: "Kawasaki", porcentaje: 20, color: "#16a34a" },
  { marca: "Suzuki", porcentaje: 12, color: "#ea580c" },
  { marca: "Otras", porcentaje: 5, color: "#6b7280" },
];

const ventasMensuales = [
  { mes: "Ene", ventas: 145000, objetivo: 160000 },
  { mes: "Feb", ventas: 132000, objetivo: 160000 },
  { mes: "Mar", ventas: 178000, objetivo: 160000 },
  { mes: "Abr", ventas: 165000, objetivo: 160000 },
  { mes: "May", ventas: 189000, objetivo: 160000 },
  { mes: "Jun", ventas: 195000, objetivo: 160000 },
];

export default function DashboardContent() {
  const totalVentasHoy = 28500;
  const pedidosPendientes = 47;
  const clientesAtendidos = 156;
  const tiempoPromedioEntrega = 2.3;

  return (
    <div className="space-y-6 pb-10">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
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
        ].map((item, i) => (
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
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
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
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {marcasPopulares.map((m) => (
                    <div key={m.marca} className="flex items-center text-xs">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: m.color }}
                      />
                      {m.marca}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ingresos</CardTitle>
              <CardDescription>
                Ventas mensuales vs Objetivo de la tienda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={ventasMensuales}>
                  <defs>
                    <linearGradient
                      id="colorVentas"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="ventas"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorVentas)"
                  />
                  <Line
                    type="monotone"
                    dataKey="objetivo"
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Actual</p>
                      <p className="font-bold text-red-600">{item.stock} uds</p>
                    </div>
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

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// import React from "react";
// // Ajuste de rutas a la carpeta de componentes de tu proyecto
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Badge } from "../../components/ui/badge";
// import { Progress } from "../../components/ui/progress";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";

// // Gráficos
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Line,
//   Area,
//   AreaChart,
//   Tooltip,
// } from "recharts";

// // Iconos
// import {
//   Package,
//   TrendingUp,
//   Clock,
//   AlertTriangle,
//   Users,
//   DollarSign,
//   Wrench,
//   Truck,
// } from "lucide-react";

// // --- Datos Simulados (Mock Data) ---
// const ventasPorCategoria = [
//   { categoria: "Frenos", ventas: 45000 },
//   { categoria: "Motor", ventas: 38000 },
//   { categoria: "Suspensión", ventas: 32000 },
//   { categoria: "Eléctricos", ventas: 28000 },
//   { categoria: "Carrocería", ventas: 25000 },
//   { categoria: "Filtros", ventas: 22000 },
// ];

// const inventarioCritico = [
//   {
//     producto: "Pastillas de freno Honda",
//     stock: 5,
//     minimo: 20,
//     proveedor: "AutoParts SA",
//   },
//   {
//     producto: "Filtro aceite Yamaha",
//     stock: 8,
//     minimo: 25,
//     proveedor: "MotoSupply",
//   },
//   {
//     producto: "Cadena transmisión 520",
//     stock: 12,
//     minimo: 30,
//     proveedor: "ChainTech",
//   },
//   {
//     producto: "Bujía NGK CR8E",
//     stock: 15,
//     minimo: 50,
//     proveedor: "NGK Direct",
//   },
// ];

// const marcasPopulares = [
//   { marca: "Honda", porcentaje: 35, color: "#dc2626" },
//   { marca: "Yamaha", porcentaje: 28, color: "#2563eb" },
//   { marca: "Kawasaki", porcentaje: 20, color: "#16a34a" },
//   { marca: "Suzuki", porcentaje: 12, color: "#ea580c" },
//   { marca: "Otras", porcentaje: 5, color: "#6b7280" },
// ];

// const ventasMensuales = [
//   { mes: "Ene", ventas: 145000, objetivo: 160000 },
//   { mes: "Feb", ventas: 132000, objetivo: 160000 },
//   { mes: "Mar", ventas: 178000, objetivo: 160000 },
//   { mes: "Abr", ventas: 165000, objetivo: 160000 },
//   { mes: "May", ventas: 189000, objetivo: 160000 },
//   { mes: "Jun", ventas: 195000, objetivo: 160000 },
// ];

// export default function DashboardContent() {
//   const totalVentasHoy = 28500;
//   const pedidosPendientes = 47;
//   const clientesAtendidos = 156;
//   const tiempoPromedioEntrega = 2.3;

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header del Dashboard */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//             Dashboard Principal
//           </h1>
//           <p className="text-slate-500">
//             Resumen ejecutivo de operaciones MSG Repuestos
//           </p>
//         </div>
//         <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
//           <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3">
//             <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//             Sistema Online
//           </Badge>
//           <div className="text-right border-l pl-4 border-slate-100">
//             <p className="text-[10px] uppercase font-bold text-slate-400">
//               Actualizado
//             </p>
//             <p className="text-sm font-medium text-slate-700">Hoy, 14:35</p>
//           </div>
//         </div>
//       </div>

//       {/* Métricas Principales con Gradientes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           {
//             title: "Ventas Hoy",
//             val: `$${totalVentasHoy.toLocaleString()}`,
//             icon: DollarSign,
//             color: "from-blue-600 to-blue-700",
//             sub: "+12.5% vs ayer",
//           },
//           {
//             title: "Pedidos Pendientes",
//             val: pedidosPendientes,
//             icon: Package,
//             color: "from-orange-500 to-orange-600",
//             sub: "Promedio 1.8 días",
//           },
//           {
//             title: "Clientes Atendidos",
//             val: clientesAtendidos,
//             icon: Users,
//             color: "from-emerald-500 to-emerald-600",
//             sub: "+8.3% esta semana",
//           },
//           {
//             title: "Tiempo Entrega",
//             val: `${tiempoPromedioEntrega} días`,
//             icon: Truck,
//             color: "from-purple-600 to-purple-700",
//             sub: "Objetivo: 2.0 días",
//           },
//         ].map((item, i) => (
//           <Card
//             key={i}
//             className={cn(
//               "border-none text-white bg-gradient-to-br shadow-lg",
//               item.color,
//             )}
//           >
//             <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//               <CardTitle className="text-sm font-medium opacity-90">
//                 {item.title}
//               </CardTitle>
//               <item.icon className="h-4 w-4 opacity-80" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{item.val}</div>
//               <p className="text-xs mt-1 opacity-80 flex items-center">
//                 <TrendingUp className="h-3 w-3 mr-1" /> {item.sub}
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Tabs de Análisis */}
//       <Tabs defaultValue="ventas" className="space-y-6">
//         <TabsList className="bg-slate-100 p-1">
//           <TabsTrigger value="ventas">Ventas</TabsTrigger>
//           <TabsTrigger value="inventario">Inventario</TabsTrigger>
//           <TabsTrigger value="clientes">Clientes</TabsTrigger>
//           <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
//         </TabsList>

//         <TabsContent value="ventas" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Ventas por Categoría</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={ventasPorCategoria}>
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#f1f5f9"
//                     />
//                     <XAxis
//                       dataKey="categoria"
//                       axisLine={false}
//                       tickLine={false}
//                     />
//                     <YAxis axisLine={false} tickLine={false} />
//                     <Tooltip cursor={{ fill: "#f8fafc" }} />
//                     <Bar
//                       dataKey="ventas"
//                       fill="#3b82f6"
//                       radius={[4, 4, 0, 0]}
//                       barSize={40}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Marcas Populares</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={marcasPopulares}
//                       innerRadius={60}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="porcentaje"
//                     >
//                       {marcasPopulares.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.color}
//                           stroke="none"
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="flex flex-wrap justify-center gap-4 mt-2">
//                   {marcasPopulares.map((m) => (
//                     <div key={m.marca} className="flex items-center text-xs">
//                       <div
//                         className="w-3 h-3 rounded-full mr-2"
//                         style={{ backgroundColor: m.color }}
//                       />
//                       {m.marca}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Evolución de Ingresos</CardTitle>
//               <CardDescription>
//                 Ventas mensuales vs Objetivo de la tienda
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={350}>
//                 <AreaChart data={ventasMensuales}>
//                   <defs>
//                     <linearGradient
//                       id="colorVentas"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis dataKey="mes" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="ventas"
//                     stroke="#10b981"
//                     fillOpacity={1}
//                     fill="url(#colorVentas)"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="objetivo"
//                     stroke="#ef4444"
//                     strokeDasharray="5 5"
//                     dot={false}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Tab de Inventario Crítico */}
//         <TabsContent value="inventario">
//           <Card className="border-red-100 bg-red-50/30">
//             <CardHeader>
//               <CardTitle className="text-red-800 flex items-center gap-2">
//                 <AlertTriangle className="h-5 w-5" /> Stock Crítico
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-4">
//               {inventarioCritico.map((item, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 shadow-sm"
//                 >
//                   <div>
//                     <p className="font-bold text-slate-900">{item.producto}</p>
//                     <p className="text-xs text-slate-500">{item.proveedor}</p>
//                   </div>
//                   <div className="flex items-center gap-6">
//                     <div className="text-right">
//                       <p className="text-xs text-slate-400">Actual</p>
//                       <p className="font-bold text-red-600">{item.stock} uds</p>
//                     </div>
//                     <Badge className="bg-red-600">Reordenar</Badge>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // Función auxiliar para clases de Tailwind
// function cn(...classes) {
//   return classes.filter(Boolean).join(" ");
// }
