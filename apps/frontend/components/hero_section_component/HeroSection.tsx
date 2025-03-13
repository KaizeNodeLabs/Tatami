"use client";

import illustration from "@/public/hero-illustration.png";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-background text-foreground py-16 px-4 w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="font-inter font-bold text-2xl md:text-4xl tracking-[0] mb-4 ">
            Conquer the Dojo
          </h1>
          <p className="sm:text-sm md: text-md lg:text-lg mb-6 ">
          Leverage the power of Tatami to accelerate on-chain game development and launch your game quickly and efficiently
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <a
              href="/app"
              className="bg-primary text-third-foreground font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Try Tatami
            </a>
            {/*<a
              href="/learn-more"
              className="border border-primary text-primary font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Open Docs
            </a> */}
          </div>
        </div>
        <div className="md:w-1/2">
          <Image src={illustration} height={1000} width={1000} alt="Tatami"></Image>
        </div>
      </div>
    </section>
  );
}
