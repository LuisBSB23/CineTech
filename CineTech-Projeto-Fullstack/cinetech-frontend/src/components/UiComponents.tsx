import { type ReactNode } from "react"; // Correção: 'type' explícito
import { Loader2 } from "lucide-react";

export const Card = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg hover:shadow-cyan-900/20 transition-all ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success';
  isLoading?: boolean;
}

export const Button = ({ children, variant = 'primary', isLoading, className = "", ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50";
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50"
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="animate-spin" size={18} />}
      {children}
    </button>
  );
};