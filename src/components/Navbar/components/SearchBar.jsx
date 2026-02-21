import { Search } from "lucide-react";

export const SearchBar = () => (
  /* Eliminamos 'hidden' para que se vea en móvil y ajustamos el ancho */
  <div className="flex flex-1 max-w-[150px] sm:max-w-md items-center bg-gray-100 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-200 transition-all border border-transparent focus-within:border-blue-300 focus-within:bg-white shadow-sm group">
    <Search className="w-4 h-4 text-gray-500 group-focus-within:text-blue-600" />
    <input
      type="text"
      placeholder="Buscar..."
      className="ml-2 bg-transparent outline-none text-xs sm:text-sm w-full text-gray-700 placeholder:text-gray-400"
    />
  </div>
);
