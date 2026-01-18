import { ReactNode } from "react";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  theme?: 'blue' | 'purple' | 'brand';
}

export function InputGroup({ label, icon, theme = 'brand', className = "", ...props }: InputGroupProps) {
  let focusColor = 'focus:border-[var(--accent)] focus:ring-[var(--accent)]';
  if (theme === 'blue') focusColor = 'focus:border-blue-500 focus:ring-blue-500';
  if (theme === 'purple') focusColor = 'focus:border-purple-500 focus:ring-purple-500';
  
  // Default padding is pl-10, but allow override via className if needed (e.g. pl-14)
  const basePadding = className.includes('pl-') ? '' : 'pl-10';

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 flex items-center gap-1 pointer-events-none">
          {icon}
        </div>
        <input
          className={`w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg py-3 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-1 outline-none transition-all text-sm ${basePadding} ${focusColor} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}