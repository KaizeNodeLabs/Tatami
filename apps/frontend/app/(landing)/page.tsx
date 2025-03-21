import PartnersSection from "@/components/algined_with/AligendWith";
import HeroSection from "@/components/hero_section_component/HeroSection";
import JoinCommunity from "@/components/Join_the_community/JoinTheCommunity";
import Productive from "@/components/productive/productive";
import WhyChooseTatami from "../../components/why_choose_us/why-choose-us";
import LowCode from "@/components/low_code_section/low_code_section";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HeroSection />
      <PartnersSection />
      <WhyChooseTatami />
      <LowCode/>
      <Productive />
      <JoinCommunity />
    </div>
  );
}
