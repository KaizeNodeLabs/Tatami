import PartnersSection from "@/components/AlignedWith/AligendWith";
import HeroSection from "@/components/HeroSection";
import Productive from "@/components/productive/productive";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import JoinCommunity from "@/components/JoinTheCommunity/JoinTheCommunity";
import WhyChooseTatami from "./why-choose-us/why-choose-us";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HeroSection />
      <WhyChooseTatami />
      <Productive />
      <JoinCommunity />
      <Link href="/app">
        <Button>Go to App</Button>
      </Link>
    </div>
  );
}
