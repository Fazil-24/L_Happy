"use client";
import { motion } from "framer-motion";
import { PersonaSliders, MarketConditions } from "@/lib/types";
import SliderControl from "@/components/ui/SliderControl";
import { ArrowRight } from "lucide-react";

interface TuneStepProps {
  sliders: PersonaSliders;
  market: MarketConditions;
  onSlidersChange: (s: PersonaSliders) => void;
  onMarketChange: (m: MarketConditions) => void;
  onSimulate: () => void;
}

export default function TuneStep({
  sliders,
  market,
  onSlidersChange,
  onMarketChange,
  onSimulate,
}: TuneStepProps) {
  const set = <K extends keyof PersonaSliders>(k: K, v: number) =>
    onSlidersChange({ ...sliders, [k]: v });

  const setM = <K extends keyof MarketConditions>(k: K, v: number) =>
    onMarketChange({ ...market, [k]: v });

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Tune the market
        </h2>
        <p className="text-[var(--text-secondary)]">
          Adjust sliders to model your real audience conditions
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Persona sliders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-[var(--glass-border)]"
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Persona Parameters</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">How is your target audience likely to approach this?</p>

          <div className="space-y-6">
            <SliderControl
              label="Trust Level"
              description="How much does your audience trust your brand?"
              value={sliders.trustLevel}
              onChange={(v) => set("trustLevel", v)}
              leftLabel="Low trust"
              rightLabel="High trust"
            />
            <SliderControl
              label="Urgency"
              description="How urgent is the problem this feature solves?"
              value={sliders.urgency}
              onChange={(v) => set("urgency", v)}
              leftLabel="Not urgent"
              rightLabel="Very urgent"
            />
            <SliderControl
              label="Price Sensitivity"
              description="How cost-conscious is your audience?"
              value={sliders.priceSensitivity}
              onChange={(v) => set("priceSensitivity", v)}
              leftLabel="Price insensitive"
              rightLabel="Very price sensitive"
            />
            <SliderControl
              label="Switching Friction"
              description="How hard is it for users to switch from current solutions?"
              value={sliders.switchingFriction}
              onChange={(v) => set("switchingFriction", v)}
              leftLabel="Easy to switch"
              rightLabel="Very sticky alternatives"
            />
            <SliderControl
              label="Novelty Appetite"
              description="How open to new tools and workflows is your audience?"
              value={sliders.noveltyAppetite}
              onChange={(v) => set("noveltyAppetite", v)}
              leftLabel="Risk averse"
              rightLabel="Innovation hungry"
            />
            <SliderControl
              label="Adoption Readiness"
              description="How ready are users to adopt something new right now?"
              value={sliders.adoptionReadiness}
              onChange={(v) => set("adoptionReadiness", v)}
              leftLabel="Resistant"
              rightLabel="Ready to adopt"
            />
          </div>
        </motion.div>

        {/* Market conditions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-[var(--glass-border)]"
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Market Conditions</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">What&apos;s the broader landscape?</p>

          <div className="space-y-6">
            <SliderControl
              label="Market Maturity"
              description="Is this a new category or an established market?"
              value={market.marketMaturity}
              onChange={(v) => setM("marketMaturity", v)}
              leftLabel="Emerging category"
              rightLabel="Mature market"
            />
            <SliderControl
              label="Competition Intensity"
              description="How crowded is this space?"
              value={market.competitionIntensity}
              onChange={(v) => setM("competitionIntensity", v)}
              leftLabel="Low competition"
              rightLabel="Fierce competition"
            />
            <SliderControl
              label="Economic Climate"
              description="How are buyers feeling about spending?"
              value={market.economicClimate}
              onChange={(v) => setM("economicClimate", v)}
              leftLabel="Tight budgets"
              rightLabel="Expansionary"
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onSimulate}
          className="btn-primary w-full justify-center py-4 text-base"
        >
          Run Simulation <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
