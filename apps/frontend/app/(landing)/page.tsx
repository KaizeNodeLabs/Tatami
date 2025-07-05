import dynamic from 'next/dynamic';
import HeroSection from "@/components/hero_section_component/HeroSection";

// Lazy load non-critical sections
const PartnersSection = dynamic(() => import("@/components/algined_with/AligendWith"), {
  loading: () => <div className="h-32 bg-neutral animate-pulse rounded-lg mx-4" />
});

const WhyChooseTatami = dynamic(() => import("@/components/why_choose_us/why-choose-us"), {
  loading: () => <div className="h-64 bg-neutral animate-pulse rounded-lg mx-4" />
});

const LowCode = dynamic(() => import("@/components/low_code_section/low_code_section"), {
  loading: () => <div className="h-48 bg-neutral animate-pulse rounded-lg mx-4" />
});

const Productive = dynamic(() => import("@/components/productive/productive"), {
  loading: () => <div className="h-40 bg-neutral animate-pulse rounded-lg mx-4" />
});

const JoinCommunity = dynamic(() => import("@/components/Join_the_community/JoinTheCommunity"), {
  loading: () => <div className="h-56 bg-neutral animate-pulse rounded-lg mx-4" />
});

const TeamSection = dynamic(() => import("@/components/meet_the_team_section/MeetTeam"), {
  loading: () => <div className="h-48 bg-neutral animate-pulse rounded-lg mx-4" />
});

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HeroSection />
      <PartnersSection />
      <WhyChooseTatami />
      <LowCode/>
      <Productive />
      <JoinCommunity />
      <TeamSection />
    </div>
  );
}
