import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#111315] text-[#D2D8DA] p-3.5 rounded-2xl shadow-2xl border border-white/10 flex items-start justify-between space-x-3 transition-all animate-bounce-subtle"
        >
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                {toast.title}
              </h4>
              <p className="text-[11px] font-mono text-neutral-300 mt-0.5">
                {toast.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
