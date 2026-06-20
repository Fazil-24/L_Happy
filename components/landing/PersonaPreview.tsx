"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const personas = [
  {
    emoji: "🚀",
    name: "Power User",
    type: "Early Adopter",
    mood: "Excited",
    moodColor: "emerald",
    quote: "This saves me 30 minutes after every standup. Sign me up yesterday.",
    adoption: 90,
  },
  {
    emoji: "🛡️",
    name: "IT Admin",
    type: "Gatekeeper",
    mood: "Skeptical",
    moodColor: "amber",
    quote: "How is meeting data stored? Who has access? I need a security review first.",
    adoption: 35,
  },
  {
    emoji: "🌱",
    name: "New User",
    type: "Casual Adopter",
    mood: "Confused",
    moodColor: "orange",
    quote: "Looks useful but the setup flow lost me on step three. Not sure I'd get it.",
    adoption: 48,
  },
  {
    emoji: "💼",
    name: "Decision Maker",
    type: "Economic Buyer",
    mood: "Interested",
    moodColor: "cyan",
    quote: "What's the ROI story? If this cuts meeting overhead, I want the numbers.",
    adoption: 65,
  },
];

const moodColors: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  orange: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

const adoptionColors: Record<string, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  orange: "bg-orange-500",
  cyan: "bg-cyan-500",
};

export default function PersonaPreview() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none dark:via-cyan-950/10" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            Persona simulation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-4">
            See your launch through{" "}
            <span className="text-gradient-purple">every pair of eyes.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Each persona reacts differently. Tune sliders to shift how skeptical
            or excited they appear — and watch the simulation update in real time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {personas.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass rounded-2xl p-5 border border-[var(--glass-border)] card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{p.emoji}</div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full border",
                    moodColors[p.moodColor]
                  )}
                >
                  {p.mood}
                </span>
              </div>
              <div className="font-semibold text-[var(--text-primary)]">{p.name}</div>
              <div className="text-xs text-[var(--text-tertiary)] mb-3">{p.type}</div>
              <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed mb-4">
                &ldquo;{p.quote}&rdquo;
              </p>
              <div>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mb-1.5">
                  <span>Adoption likelihood</span>
                  <span className={cn("font-semibold", `text-${p.moodColor}-400`)}>
                    {p.adoption}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5">
                  <motion.div
                    className={cn("h-full rounded-full", adoptionColors[p.moodColor])}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.adoption}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.4, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
