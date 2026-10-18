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
      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors hover:bg-gray-50 ${danger ? "text-red-600" : "text-gray-800"
        }`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            size={20}
            className={danger ? "text-red-500" : "text-purple-600"}
          />
        )}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
}