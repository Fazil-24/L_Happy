import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import WhatItDoes from "@/components/landing/WhatItDoes";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyLaunchesFail from "@/components/landing/WhyLaunchesFail";
import PersonaPreview from "@/components/landing/PersonaPreview";
import ScenarioPreview from "@/components/landing/ScenarioPreview";
import LandingCTA from "@/components/landing/LandingCTA";

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <TrustedBy />
      <WhatItDoes />
      <HowItWorks />
      <WhyLaunchesFail />
      <PersonaPreview />
      <ScenarioPreview />
      <LandingCTA />
    </div>
  );
}
