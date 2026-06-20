"use client";
import { motion } from "framer-motion";

const logos = [
  "Product Teams",
  "Growth Hackers",
  "PMs Worldwide",
  "Launch Strategists",
  "Startup Founders",
  "Design Leaders",
  "GTM Specialists",
];

export default function TrustedBy() {
  return (
    <section className="py-12 border-y border-[var(--border)] overflow-hidden">
      <div className="text-center mb-6">
        <p className="text-xs font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
          Built for teams that care about launches
        </p>
      </div>
      <div className="relative flex">
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={i}
              className="text-[var(--text-tertiary)] font-semibold text-sm tracking-wide"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
