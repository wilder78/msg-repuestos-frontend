import React from "react";

const InfoCard = ({ icon: Icon, iconColor = "slate", title, children }) => {
  const colorVariants = {
    blue: "border-blue-100 bg-blue-50/30 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50/30 text-emerald-700",
    violet: "border-violet-100 bg-violet-50/30 text-violet-700",
    amber: "border-amber-100 bg-amber-50/30 text-amber-700",
    slate: "border-slate-200 bg-white text-slate-500",
    rose: "border-rose-100 bg-rose-50/30 text-rose-700",
    indigo: "border-indigo-100 bg-indigo-50/30 text-indigo-700",
  };

  const iconColorVariants = {
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    violet: "text-violet-700",
    amber: "text-amber-700",
    slate: "text-slate-500",
    rose: "text-rose-700",
    indigo: "text-indigo-700",
  };

  // Validar que el color exista, si no usar slate por defecto
  const validColor = colorVariants[iconColor] ? iconColor : "slate";

  return (
    <div
      className={`p-4 rounded-xl border ${colorVariants[validColor]} space-y-3 transition-all hover:shadow-md`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColorVariants[validColor]}`} />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
};

export default InfoCard;
