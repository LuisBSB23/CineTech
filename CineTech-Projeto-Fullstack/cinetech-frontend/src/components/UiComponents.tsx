import { type ReactNode } from "react";
import { Loader2, QrCode } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitário para classes condicionais
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={cn(
    "bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden shadow-lg hover:shadow-cyan-900/20 transition-all duration-300",
    className
  )}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ children, variant = 'primary', isLoading, className = "", ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20",
    outline: "border border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 bg-transparent",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800"
  };

  return (
    <button className={cn(baseStyle, variants[variant], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="animate-spin" size={18} />}
      {children}
    </button>
  );
};

// Novo Componente: Skeleton Loading
export const MovieCardSkeleton = () => (
  <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 animate-pulse">
    <div className="h-64 bg-slate-800" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-slate-800 rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-4 bg-slate-800 rounded w-1/4" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
      </div>
    </div>
  </div>
);

// Novo Componente: Ticket Card (Para Perfil)
export const TicketCard = ({ title, date, seats, total, id }: { title: string, date: string, seats: string[], total: number, id: number }) => (
  <div className="relative bg-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row border border-slate-700 group hover:border-cyan-500/50 transition-colors">
    {/* Parte Esquerda (Info) */}
    <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
      <div>
        <div className="text-xs font-bold text-cyan-500 mb-1 tracking-wider">CINETECH TICKET</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{date}</p>
      </div>
      <div className="mt-6 flex justify-between items-end">
        <div>
          <p className="text-xs text-slate-500 uppercase">Assentos</p>
          <p className="text-white font-medium">{seats.join(', ')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase">Total</p>
          <p className="text-emerald-400 font-bold">R$ {total.toFixed(2)}</p>
        </div>
      </div>
    </div>

    {/* Divisória Perfurada */}
    <div className="hidden md:block w-0 border-l-2 border-dashed border-slate-950 relative my-2">
      <div className="absolute -top-4 -left-2 w-4 h-4 rounded-full bg-slate-950"></div>
      <div className="absolute -bottom-4 -left-2 w-4 h-4 rounded-full bg-slate-950"></div>
    </div>

    {/* Parte Direita (QR Code) */}
    <div className="bg-slate-900/50 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-700 min-w-[140px]">
      <div className="bg-white p-2 rounded-lg mb-2">
        <QrCode className="text-slate-950" size={64} />
      </div>
      <span className="text-[10px] text-slate-500 font-mono">#{id.toString().padStart(6, '0')}</span>
    </div>
  </div>
);