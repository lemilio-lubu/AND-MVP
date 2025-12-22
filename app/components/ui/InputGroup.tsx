import { ReactNode } from "react";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  theme?: 'blue' | 'purple';
}

export function InputGroup({ label, icon, theme = 'blue', className = "", ...props }: InputGroupProps) {
  const focusColor = theme === 'blue' ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-purple-500 focus:ring-purple-500';
  
  // Default padding is pl-10, but allow override via className if needed (e.g. pl-14)
  const basePadding = className.includes('pl-') ? '' : 'pl-10';

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-400 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 flex items-center gap-1 pointer-events-none">
          {icon}
        </div>
        <input
          className={`w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pr-4 text-white placeholder-slate-600 focus:ring-1 outline-none transition-all text-sm ${basePadding} ${focusColor} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}