import { Search } from "lucide-react";

export const SearchBar = () => (
  <div className="hidden md:flex flex-1 max-w-md items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-all border border-transparent focus-within:border-blue-300 focus-within:bg-white shadow-sm group">
    <Search className="w-4 h-4 text-gray-500 group-focus-within:text-blue-600" />
    <input
      type="text"
      placeholder="¿Qué repuesto buscas?"
      className="ml-2 bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
    />
  </div>
);
