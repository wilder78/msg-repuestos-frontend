import { ShoppingCart, User, Menu, X } from "lucide-react";

export const NavActions = ({ isMenuOpen, setIsMenuOpen }) => (
  <div className="flex items-center space-x-2">
    {/* Carrito */}
    <button className="relative p-2.5 text-gray-700 hover:bg-blue-50 rounded-full transition-all group">
      <ShoppingCart className="w-5 h-5 group-hover:text-blue-600" />
      <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
        0
      </span>
    </button>

    {/* Login */}
    <button className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md active:scale-95 group">
      <User className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      <span className="text-sm">Iniciar Sesión</span>
    </button>

    {/* Menú Móvil */}
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="md:hidden p-2.5 text-gray-700 hover:bg-blue-50 rounded-xl transition-all"
    >
      {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  </div>
);