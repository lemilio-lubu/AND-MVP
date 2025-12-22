import { ArrowRight } from "@phosphor-icons/react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  theme?: 'blue' | 'purple';
}

export function GradientButton({ children, theme = 'blue', disabled, className = "", ...props }: GradientButtonProps) {
  const blueTheme = "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]";
  const purpleTheme = "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]";
  
  const activeClass = theme === 'blue' ? blueTheme : purpleTheme;
  const disabledClass = "bg-slate-800 text-slate-500 cursor-not-allowed";

  return (
    <button
      disabled={disabled}
      className={`w-full mt-6 py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${disabled ? disabledClass : activeClass} ${className}`}
      {...props}
    >
      {children}
      <ArrowRight weight="bold" />
    </button>
  );
}