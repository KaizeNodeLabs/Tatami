"use client";

import Image from "next/image";
import type React from "react";
import chooseUs from '@/public/chooseUs.png';
import { useTranslation } from 'react-i18next';

const WhyChooseTatami: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="text-white flex flex-col sm:flex-col md:flex-col lg:flex-row items-center justify-center px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-16 sm:py-20 md:py-24 lg:py-28 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full">
      <div className="w-full sm:w-full md:w-full lg:w-1/2 flex justify-center lg:justify-end">
        <Image
          src={chooseUs}
          alt="Tatami Concept"
          width={264}
          height={264}
          className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[360px] h-auto object-contain"
          priority
        />
      </div>
      <div className="w-full md:w-full lg:w-1/2 flex flex-col items-center md:items-center lg:items-start text-center md:text-center lg:text-left px-4 sm:px-6 md:px-8">
        <h2 className="sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          {t('whyChooseTatami')}
        </h2>
        <div className="space-y-4 sm:space-y-5 md:space-y-6 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
          <div className="flex flex-col md:flex-col lg:flex-row items-center md:items-center lg:items-start gap-4 sm:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-12 xl:h-12 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-[#FEB913] text-black font-bold text-md">
              x10
            </div>
            <div className="flex flex-col">
              <h3 className="text-base sm:text-lg md:text-sm lg:text-xl font-bold mb-1">
                {t('buildFaster')}
              </h3>
              <p className="text-secondary-foreground text-sm sm:text-base md:text-md lg:text-md leading-snug">
                {t('acceleratesDevelopment')}
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col md:flex-col lg:flex-row items-center md:items-center lg:items-start gap-4 sm:gap-5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-14 lg:h-12 xl:w-12 xl:h-12 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-[#FEB913]">
            <Image
              src="/IconMouse.svg"
              alt="Mouse Icon"
              width={24}
              height={24}
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-7 lg:w-7 lg:h-8 xl:w-8 xl:h-8 2xl:w-8 2xl:h-8"
            />
          </div>

            <div className="flex flex-col">
              <h3 className="text-base sm:text-lg md:text-md lg:text-xl font-bold mb-1">
                {t('noCodeGameDevelopment')}
              </h3>
              <p className="text-secondary-foreground text-sm sm:text-base md:text-md lg:text-md leading-snug">
                {t('codeWithoutMuchEffort')}
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col md:flex-col lg:flex-row items-center md:items-center lg:items-start gap-4 sm:gap-5">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#FEB913]">
              <Image
                src="/IconLight.svg"
                alt="Lightbulb Icon"
                width={24} // Ajusta según sea necesario
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              />
            </div>

            <div className="flex flex-col">
              <h3 className="text-base sm:text-lg md:text-md lg:text-xl font-bold mb-1">
                {t('thinkAboutTheIdea')}
              </h3>
              <p className="text-secondary-foreground text-sm sm:text-base md:text-md lg:text-md leading-snug">
                {t('dontThinkAboutCode')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTatami;