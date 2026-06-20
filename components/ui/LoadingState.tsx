"use client";
import { motion } from "framer-motion";

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export default function LoadingState({
  message = "Simulating...",
  submessage = "Analyzing your launch",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-violet-600/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <motion.p
          className="font-semibold text-[var(--text-primary)]"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">{submessage}</p>
      </div>
    </div>
  );
}
