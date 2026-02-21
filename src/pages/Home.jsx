import React from "react";
import Navbar from "../components/Navbar/Navbar"; // Ajusta según tu estructura

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Tu Navbar actual */}
      <Navbar />

      {/* Contenido de la página de inicio */}
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-6xl">
          Contenido de la página de inicio...
        </h1>
        <p className="mt-6 text-lg text-slate-600 italic">
          Aquí irán tus banners, categorías y repuestos destacados.
        </p>
      </main>
    </div>
  );
};

export default Home;
