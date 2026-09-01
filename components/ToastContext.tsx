'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          let borderColor = 'border-[#2a3542]';
          let textColor = 'text-[#e8ecf1]';
          let IconComponent = Info;
          let iconColor = 'text-[#4fd1c5]';

          if (toast.type === 'success') {
            borderColor = 'border-[#3fb950]';
            iconColor = 'text-[#3fb950]';
            IconComponent = CheckCircle2;
          } else if (toast.type === 'error') {
            borderColor = 'border-[#e5484d]';
            iconColor = 'text-[#e5484d]';
            IconComponent = XCircle;
          } else if (toast.type === 'warning') {
            borderColor = 'border-[#f0a202]';
            iconColor = 'text-[#f0a202]';
            IconComponent = AlertTriangle;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-lg bg-[#171f29] border ${borderColor} shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2`}
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
              <div className={`flex-1 text-xs sm:text-sm font-medium ${textColor}`}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#8b98a9] hover:text-[#e8ecf1] p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
