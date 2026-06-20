"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-dark dark:bg-hero-dark light:bg-hero-light pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/20 text-sm font-medium text-violet-400 mb-8"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Launch Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
        >
          Rehearse your launch{" "}
          <span className="text-gradient-purple block md:inline">
            before the market does.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload a product deck or answer a guided brief. LauncHappy simulates how
          different user personas may react, what could go wrong, and how to launch
          with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/simulate" className="btn-primary text-base px-8 py-4">
            Start Simulation
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="btn-secondary text-base px-8 py-4 dark:text-white/80 dark:border-white/10 text-slate-700 border-slate-200">
            <Play className="w-4 h-4" />
            Watch demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "5", label: "Persona types", suffix: "+" },
            { value: "3", label: "Scenario branches", suffix: "x" },
            { value: "60", label: "Sec to simulate", suffix: "s" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gradient-purple">
                {stat.value}
                <span className="text-xl">{stat.suffix}</span>
              </div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Floating dashboard preview hint */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 relative mx-auto max-w-4xl"
        >
          <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 glow-purple">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="flex-1 glass rounded-full h-6 mx-4" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Power User", mood: "Excited", emoji: "🚀", color: "emerald" },
                { label: "Admin", mood: "Skeptical", emoji: "🤔", color: "amber" },
                { label: "New User", mood: "Confused", emoji: "😕", color: "orange" },
              ].map((p) => (
                <div key={p.label} className="glass rounded-xl p-4 border border-[var(--glass-border)]">
                  <div className="text-2xl mb-2">{p.emoji}</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{p.label}</div>
                  <div
                    className={`text-xs mt-1 font-medium ${
                      p.color === "emerald"
                        ? "text-emerald-400"
                        : p.color === "amber"
                        ? "text-amber-400"
                        : "text-orange-400"
                    }`}
                  >
                    {p.mood}
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${
                        p.color === "emerald"
                          ? "bg-emerald-500 w-4/5"
                          : p.color === "amber"
                          ? "bg-amber-500 w-2/5"
                          : "bg-orange-500 w-1/3"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
