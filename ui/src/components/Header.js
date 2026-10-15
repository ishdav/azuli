"use client";
import Logo from "../.././public/logo.png";

export default function Header({
  title = "Home",
  leftSlot,
  rightSlot,
  onMenuClick,
}) {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-2 min-w-8">
        {leftSlot || (
          <span onClick={onMenuClick} className="cursor-pointer">
            {/* Default fallback if no slot is provided */}
          </span>
        )}
      </div>
      <h5 className="text-xl color-gray-800 font-medium">{title}</h5>
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold overflow-hidden">
        {rightSlot || (
          <img src={Logo.src} alt="Logo" className="w-8 h-8 object-contain" />
        )}
      </div>
    </div>
  );
}