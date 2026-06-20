"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, Users, MessageSquare, TrendingDown } from "lucide-react";

const reasons = [
  {
    icon: Eye,
    title: "Blind to user reactions",
    desc: "Teams assume users will respond like they do — they don't. Different segments have wildly different concerns.",
  },
  {
    icon: Users,
    title: "Ignoring persona nuance",
    desc: "Admins, power users, and new users each have different blockers. A one-size message alienates most of them.",
  },
  {
    icon: MessageSquare,
    title: "Wrong messaging angle",
    desc: "Leading with features when users care about outcomes — or privacy when they want speed — kills traction instantly.",
  },
  {
    icon: TrendingDown,
    title: "No rollout strategy",
    desc: "Going broad too fast causes backlash. Going narrow too slow kills momentum. Timing and sequencing matter enormously.",
  },
];

export default function WhyLaunchesFail() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
            <AlertTriangle className="w-3 h-3" />
            Why launches fail
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-4">
            The launch graveyard{" "}
            <span className="text-gradient-warm">is avoidable.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Most feature launches fail not because of bad ideas — but because of
            avoidable blind spots that LauncHappy surfaces before you ship.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 glass rounded-2xl p-6 border border-red-500/10 card-hover group"
              >
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">{r.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
