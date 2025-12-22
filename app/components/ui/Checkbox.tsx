import { Check } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  theme?: 'blue' | 'purple';
}

export function Checkbox({ checked, onChange, children, theme = 'blue' }: CheckboxProps) {
  const activeColor = theme === 'blue' 
    ? 'peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-focus:ring-blue-500/20' 
    : 'peer-checked:bg-purple-500 peer-checked:border-purple-500 peer-focus:ring-purple-500/20';

  return (
    <label className="flex items-start gap-3 mt-6 cursor-pointer group">
      <div className="relative flex items-center mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className={`w-5 h-5 border-2 border-slate-600 rounded transition-colors peer-focus:ring-2 ${activeColor}`} />
        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity pointer-events-none" weight="bold" />
      </div>
      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors select-none">
        {children}
      </span>
    </label>
  );
}