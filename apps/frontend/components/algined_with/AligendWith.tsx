import Image from "next/image";
import React from "react";
import { partners } from "./partners";

const PartnersSection = () => {
  return (
    <div className="w-full h-auto bg-black text-secondary py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            We are aligned with
          </h2>
          <p className="text-primary-foreground text-sm md:text-base max-w-2xl mx-auto">
            Technologies that we use to improve and accelerate the on-chain game development
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-black flex flex-col md:flex-row items-center gap-3 p-4 rounded-lg  transition-colors duration-200"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Image
                  src={partner.logo}
                  width={700}
                  height={700}
                  alt={`${partner.name} logo`}
                />
              </div>
              <div className="flex flex-col md:items-start items-center text-center md:text-left">
                <span className="text-white text-sm md:text-base font-semibold truncate">
                  {partner.name}
                </span>
                <a 
  href={partner.url} 
  target="_blank" 
  rel="noopener noreferrer" 
  style={{ backgroundColor: partner.buttonBg }} 
  className="text-md px-3 sm:px-2 py-1 rounded-full mt-2 md:mt-1 text-white opacity-80 hover:opacity-100 transition-opacity w-fit"
>
  Learn more
</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
