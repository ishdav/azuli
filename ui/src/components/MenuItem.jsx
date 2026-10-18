"use client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuItem({
  icon: Icon,
  label,
  href,
  onClick,
  badge,
  danger = false,
}) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    if (href) router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 group ${
        danger 
          ? "text-rose-600 hover:bg-rose-50" 
          : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${danger ? "bg-rose-100/50" : "bg-slate-100 group-hover:bg-indigo-100/50 transition-colors"}`}>
            <Icon size={18} className={danger ? "text-rose-600" : "text-slate-500 group-hover:text-indigo-600 transition-colors"} />
          </div>
        )}
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${danger ? "bg-rose-100 text-rose-700" : "bg-indigo-50 text-indigo-700"}`}>
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
      </div>
    </div>
  );
}