"use client";

import illustration from "@/public/hero-illustration.png";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';

const HeroSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-background text-white py-16 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="font-inter font-bold text-2xl md:text-4xl tracking-[0] mb-4 text-secondary-foreground">
            {t('conquerTheDojo')}
          </h1>
          <p className="sm:text-sm md: text-md lg:text-lg mb-6 text-secondary-foreground">
            {t('leveragePower')}
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <ConnectWallet
              className="bg-yellow text-third-foreground font-semibold py-3 px-6 rounded-md transition-colors hover:bg-yellow/90"
            >
              {t('tryTatami')}
            </ConnectWallet>
          </div>
        </div>
        <div className="md:w-1/2">
          <Image 
            src={illustration} 
            height={1000} 
            width={1000} 
            alt="Tatami" 
            priority
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
