"use client";
import { motion } from "framer-motion";
import { FileInput, SlidersHorizontal, Rocket } from "lucide-react";

const steps = [
  {
    icon: FileInput,
    step: "01",
    title: "Upload or Brief",
    desc: "Drop in your product deck or answer a short guided brief. We extract your feature, target audience, and launch intent in seconds.",
    color: "violet",
  },
  {
    icon: SlidersHorizontal,
    step: "02",
    title: "Tune the Market",
    desc: "Adjust persona sliders — trust, urgency, price sensitivity, switching friction — to match your real audience conditions.",
    color: "cyan",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Simulate & Ship",
    desc: "Watch personas react, explore best/likely/worst scenarios, then receive a complete launch playbook built for your context.",
    color: "amber",
  },
];

const colorMap: Record<string, { tag: string; line: string; icon: string }> = {
  violet: {
    tag: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    line: "bg-violet-500/30",
    icon: "from-violet-600 to-purple-600 text-white",
  },
  cyan: {
    tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    line: "bg-cyan-500/30",
    icon: "from-cyan-600 to-teal-600 text-white",
  },
  amber: {
    tag: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    line: "bg-amber-500/30",
    icon: "from-amber-600 to-orange-600 text-white",
  },
};

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent pointer-events-none dark:via-violet-950/10" />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-tag mb-4 inline-flex">How it works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
            Three steps to{" "}
            <span className="text-gradient-purple">launch confidence</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-px h-[calc(100%-4rem)] bg-gradient-to-b from-violet-500/30 via-cyan-500/20 to-amber-500/20" />

          <div className="space-y-16">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const c = colorMap[s.color];
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`flex items-center gap-12 ${
                    i % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 glass rounded-2xl p-8 border border-[var(--glass-border)] card-hover">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-4 ${c.tag}`}
                    >
                      Step {s.step}
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="hidden md:flex flex-col items-center relative z-10">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${c.icon} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
