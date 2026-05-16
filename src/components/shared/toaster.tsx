"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const iconMap = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
};

const colorMap = {
  default: "bg-primary text-primary-foreground border-primary/20",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  error: "bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function Toaster() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.variant || "default"];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm",
                colorMap[toast.variant || "default"]
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{toast.title}</p>
                  {toast.description && (
                    <p className="text-sm opacity-80 mt-1">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}