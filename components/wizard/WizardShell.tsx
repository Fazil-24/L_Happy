"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LaunchSession,
  LaunchBriefData,
  PersonaSliders,
  MarketConditions,
  WizardStep,
} from "@/lib/types";
import IngestStep from "./steps/IngestStep";
import ReviewStep from "./steps/ReviewStep";
import TuneStep from "./steps/TuneStep";
import SimulateStep from "./steps/SimulateStep";
import PlaybookStep from "./steps/PlaybookStep";
import LoadingState from "@/components/ui/LoadingState";
import { cn } from "@/lib/utils";

const STEPS: { id: WizardStep; label: string; emoji: string }[] = [
  { id: "ingest", label: "Brief", emoji: "📝" },
  { id: "review", label: "Review", emoji: "✅" },
  { id: "tune", label: "Tune", emoji: "🎚️" },
  { id: "simulate", label: "Simulate", emoji: "⚡" },
  { id: "playbook", label: "Playbook", emoji: "🚀" },
];

const defaultSliders: PersonaSliders = {
  trustLevel: 50,
  urgency: 50,
  priceSensitivity: 50,
  switchingFriction: 50,
  noveltyAppetite: 50,
  adoptionReadiness: 50,
};

const defaultMarket: MarketConditions = {
  marketMaturity: 50,
  competitionIntensity: 50,
  economicClimate: 60,
};

export default function WizardShell() {
  const [session, setSession] = useState<LaunchSession>({
    step: "ingest",
    activeScenario: "likely",
    isLoading: false,
    personaSliders: defaultSliders,
    marketConditions: defaultMarket,
  });

  const setLoading = (msg: string | false) =>
    setSession((s) => ({ ...s, isLoading: !!msg, loadingMessage: msg || undefined }));

  const setError = (error: string) =>
    setSession((s) => ({ ...s, isLoading: false, error }));

  const goTo = (step: WizardStep) =>
    setSession((s) => ({ ...s, step, error: undefined }));

  // Step 1: Brief submitted → call extract API
  const handleBriefSubmit = async (briefData: LaunchBriefData) => {
    setLoading("Extracting insights...");
    setSession((s) => ({ ...s, briefData }));

    const filledFields = [briefData.featureName, briefData.description, briefData.targetUsers, briefData.valueProposition, briefData.launchGoal, briefData.timeline, briefData.competitors, briefData.concerns].filter((v) => v.trim().length > 0).length;
    window.pendo?.track("brief_submitted", {
      inputMethod: "guided_form",
      featureName: briefData.featureName,
      filledFieldCount: filledFields,
      hasDescription: briefData.description.trim().length > 0,
      hasTargetUsers: briefData.targetUsers.trim().length > 0,
      hasValueProposition: briefData.valueProposition.trim().length > 0,
      hasLaunchGoal: briefData.launchGoal.trim().length > 0,
      hasTimeline: briefData.timeline.trim().length > 0,
      hasCompetitors: briefData.competitors.trim().length > 0,
      hasConcerns: briefData.concerns.trim().length > 0,
    });

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefData }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      window.pendo?.track("insights_extracted", {
        featureName: data.insights.featureName,
        launchComplexity: data.insights.launchComplexity,
        targetSegmentCount: data.insights.targetSegments?.length ?? 0,
        differentiatorCount: data.insights.keyDifferentiators?.length ?? 0,
        concernCount: data.insights.potentialConcerns?.length ?? 0,
        inputMethod: "guided_form",
        hasUploadedFile: false,
      });

      setSession((s) => ({ ...s, insights: data.insights, isLoading: false, step: "review" }));
    } catch (err) {
      setError((err as Error).message || "Failed to extract insights");
    }
  };

  const handleTextSubmit = async (text: string, fileName?: string) => {
    setLoading("Extracting insights...");
    setSession((s) => ({ ...s, rawInput: text, uploadedFileName: fileName }));

    window.pendo?.track("brief_submitted", {
      inputMethod: fileName ? "file_upload" : "paste",
      uploadedFileName: fileName ?? "",
      contentLength: text.length,
    });

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefText: text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      window.pendo?.track("insights_extracted", {
        featureName: data.insights.featureName,
        launchComplexity: data.insights.launchComplexity,
        targetSegmentCount: data.insights.targetSegments?.length ?? 0,
        differentiatorCount: data.insights.keyDifferentiators?.length ?? 0,
        concernCount: data.insights.potentialConcerns?.length ?? 0,
        inputMethod: fileName ? "file_upload" : "paste",
        hasUploadedFile: !!fileName,
      });

      setSession((s) => ({ ...s, insights: data.insights, isLoading: false, step: "review" }));
    } catch (err) {
      setError((err as Error).message || "Failed to extract insights");
    }
  };

  // Step 3: Run simulation
  const handleSimulate = async () => {
    if (!session.insights) return;
    setLoading("Simulating launch reception...");
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insights: session.insights,
          sliders: session.personaSliders,
          market: session.marketConditions,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      window.pendo?.track("simulation_completed", {
        featureName: session.insights!.featureName,
        overallSentiment: data.simulation.overallSentiment,
        sentimentLabel: data.simulation.sentimentLabel,
        personaCount: data.simulation.personas?.length ?? 0,
        topRisksCount: data.simulation.topRisks?.length ?? 0,
        topOpportunitiesCount: data.simulation.topOpportunities?.length ?? 0,
        trustLevel: session.personaSliders!.trustLevel,
        urgency: session.personaSliders!.urgency,
        priceSensitivity: session.personaSliders!.priceSensitivity,
        switchingFriction: session.personaSliders!.switchingFriction,
        noveltyAppetite: session.personaSliders!.noveltyAppetite,
        adoptionReadiness: session.personaSliders!.adoptionReadiness,
        marketMaturity: session.marketConditions!.marketMaturity,
        competitionIntensity: session.marketConditions!.competitionIntensity,
        economicClimate: session.marketConditions!.economicClimate,
      });

      setSession((s) => ({ ...s, simulationResult: data.simulation, isLoading: false, step: "simulate" }));
    } catch (err) {
      setError((err as Error).message || "Simulation failed");
    }
  };

  // Step 4: Generate playbook
  const handlePlaybook = async () => {
    if (!session.insights || !session.simulationResult) return;
    setLoading("Crafting your launch playbook...");
    try {
      const res = await fetch("/api/playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insights: session.insights,
          sliders: session.personaSliders,
          market: session.marketConditions,
          simulation: session.simulationResult,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      window.pendo?.track("playbook_generated", {
        featureName: session.insights!.featureName,
        recommendedStyleName: data.playbook.recommendedStyle?.name ?? "",
        recommendedStyleFit: data.playbook.recommendedStyle?.fit ?? "",
        recommendedStyleFitScore: data.playbook.recommendedStyle?.fitScore ?? 0,
        launchReadinessScore: data.playbook.launchReadinessScore,
        phaseCount: data.playbook.phases?.length ?? 0,
        alternativeStyleCount: data.playbook.allStyles?.length ?? 0,
        overallSentiment: session.simulationResult!.overallSentiment,
        launchComplexity: session.insights!.launchComplexity,
      });

      setSession((s) => ({ ...s, playbook: data.playbook, isLoading: false, step: "playbook" }));
    } catch (err) {
      setError((err as Error).message || "Playbook generation failed");
    }
  };

  const handleRestart = () => {
    window.pendo?.track("wizard_restarted", {
      previousFeatureName: session.insights?.featureName ?? "",
      completedStep: session.step,
      hadSimulationResult: !!session.simulationResult,
      hadPlaybook: !!session.playbook,
      previousOverallSentiment: session.simulationResult?.overallSentiment ?? 0,
      previousLaunchReadiness: session.playbook?.launchReadinessScore ?? 0,
    });

    setSession({
      step: "ingest",
      activeScenario: "likely",
      isLoading: false,
      personaSliders: defaultSliders,
      marketConditions: defaultMarket,
    });
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === session.step);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Progress bar */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-[var(--border)] z-0" />
          <div
            className="absolute top-4 left-0 h-px bg-gradient-to-r from-violet-600 to-purple-500 z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((s, i) => {
            const done = i < currentStepIndex;
            const active = i === currentStepIndex;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300",
                    done
                      ? "bg-violet-600 text-white"
                      : active
                      ? "bg-violet-600 text-white ring-4 ring-violet-600/20"
                      : "glass border border-[var(--border)] text-[var(--text-tertiary)]"
                  )}
                >
                  {done ? "✓" : s.emoji}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    active ? "text-violet-400" : "text-[var(--text-tertiary)]"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error banner */}
      {session.error && (
        <div className="max-w-3xl mx-auto mb-6 glass rounded-xl p-4 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <span>⚠</span>
          <span>{session.error}</span>
          <button
            onClick={() => setSession((s) => ({ ...s, error: undefined }))}
            className="ml-auto text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        {session.isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState
              message={(session as any).loadingMessage ?? "Processing..."}
              submessage="Analyzing your launch"
            />
          </motion.div>
        ) : (
          <motion.div
            key={session.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {session.step === "ingest" && (
              <IngestStep onBriefSubmit={handleBriefSubmit} onTextSubmit={handleTextSubmit} />
            )}
            {session.step === "review" && session.insights && (
              <ReviewStep
                insights={session.insights}
                onConfirm={() => goTo("tune")}
                onBack={() => goTo("ingest")}
              />
            )}
            {session.step === "tune" && (
              <TuneStep
                sliders={session.personaSliders!}
                market={session.marketConditions!}
                onSlidersChange={(personaSliders) =>
                  setSession((s) => ({ ...s, personaSliders }))
                }
                onMarketChange={(marketConditions) =>
                  setSession((s) => ({ ...s, marketConditions }))
                }
                onSimulate={handleSimulate}
              />
            )}
            {session.step === "simulate" && session.simulationResult && session.insights && (
              <SimulateStep
                result={session.simulationResult}
                insights={session.insights}
                onGeneratePlaybook={handlePlaybook}
              />
            )}
            {session.step === "playbook" && session.playbook && session.insights && (
              <PlaybookStep
                playbook={session.playbook}
                featureName={session.insights.featureName}
                insights={session.insights}
                onRestart={handleRestart}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
