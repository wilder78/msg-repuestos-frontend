// En src/components/Navbar/components/Logo.jsx
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center">
    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden shadow-sm border-2 border-white flex items-center justify-center bg-white">
      <img 
        src="/imagen/logocuadrado.png" 
        alt="MSG Repuestos" 
        className="h-full w-full object-cover scale-[1.35]"
      />
    </div>
  </Link>
);