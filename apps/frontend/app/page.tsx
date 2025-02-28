import Productive from "@/components/productive/productive";
import WhyChooseTatami from "./why-choose-us/why-choose-us";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PartnersSection from "@/components/AlignedWith/AligendWith";
import JoinCommunity from "@/components/JoinTheCommunity/JoinTheCommunity";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Tatami</h1>
      <WhyChooseTatami />
      <Productive />
      <JoinCommunity />
      <Link href="/app">
        <Button>Go to App</Button>
      </Link>

    </div>
  );
}
