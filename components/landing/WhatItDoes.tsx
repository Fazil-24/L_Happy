"use client";
import { motion } from "framer-motion";
import { Upload, Sliders, Zap, FileText } from "lucide-react";

const features = [
  {
    icon: Upload,
    color: "violet",
    title: "Ingest any brief",
    desc: "Upload a product deck or fill a guided launch brief. LauncHappy extracts the feature, audience, value, and launch intent automatically.",
  },
  {
    icon: Sliders,
    color: "cyan",
    title: "Tune your market",
    desc: "Drag sliders for persona trust, urgency, price sensitivity, switching friction, and novelty appetite to model your real audience.",
  },
  {
    icon: Zap,
    color: "amber",
    title: "Simulate reception",
    desc: "Persona cards animate in with real reactions. A sentiment meter shifts live across best, likely, and worst-case scenarios.",
  },
  {
    icon: FileText,
    color: "pink",
    title: "Get your playbook",
    desc: "Receive a full launch strategy: rollout phases, messaging, safeguards, competitor-style patterns, and success metrics.",
  },
];

const colorMap: Record<string, string> = {
  violet: "from-violet-600/20 to-purple-600/10 border-violet-500/20 text-violet-400",
  cyan: "from-cyan-600/20 to-teal-600/10 border-cyan-500/20 text-cyan-400",
  amber: "from-amber-600/20 to-orange-600/10 border-amber-500/20 text-amber-400",
  pink: "from-pink-600/20 to-rose-600/10 border-pink-500/20 text-pink-400",
};

export default function WhatItDoes() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-tag mb-4 inline-flex">What LauncHappy does</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-4">
            Launch intelligence,{" "}
            <span className="text-gradient-purple">before you ship.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Stop guessing how users will react. Model it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            const colorCls = colorMap[f.color];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-[var(--glass-border)] card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorCls} border flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 ${colorCls.split(" ").pop()}`} />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
