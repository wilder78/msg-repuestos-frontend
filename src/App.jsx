import { Navbar } from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* El resto de tu página */}
      <div className="p-20 text-center">
        <p className="text-slate-400 italic">
          Contenido de la página de inicio...
        </p>
      </div>
    </div>
  );
}

export default App;
